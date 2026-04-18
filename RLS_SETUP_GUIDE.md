# RLS Setup Guide - Adulting Sandbox

## Przegląd

Twój projekt używa anonimowych sesji opartych na ciasteczkach (session_id), a nie Supabase Auth. Ten przewodnik pokazuje, jak wdrożyć Row Level Security (RLS) dla tabel `game_sessions` i `game_events`.

## Kroki wdrożenia

### Krok 1: Wdróż RLS Policies w Supabase

1. Zaloguj się do [Supabase Console](https://supabase.com/dashboard)
2. Wybierz Twój projekt
3. Przejdź do `SQL Editor`
4. Skopiuj zawartość pliku `supabase-rls.sql`
5. Wklej do SQL Editor i wykonaj (`Run`)

```sql
-- Enable RLS on both tables and create policies
-- (zawartość z supabase-rls.sql)
```

### Krok 2: Utwórz RPC Funkcje

1. W `SQL Editor` skopiuj zawartość pliku `supabase-rpc-functions.sql`
2. Wklej i wykonaj (`Run`)

To tworzy funkcje Helper, które ustawiają kontekst sesji dla RLS.

### Krok 3: Zaktualizuj server.ts (Opcjonalnie)

Jeśli używasz **anon key** zamiast SERVICE_ROLE_KEY, należy ustawić kontekst sesji:

```typescript
// lib/supabase/server.ts
import { getSupabaseServer, setRLSSessionContext } from "@/lib/supabase/server-with-rls"

export async function getSupabaseServerWithRLS(sessionId: string) {
  const supabase = getSupabaseServer()
  
  // Set RLS context before queries
  await setRLSSessionContext(supabase, sessionId)
  
  return supabase
}
```

Następnie w `game-actions.ts`:

```typescript
import { getSupabaseServerWithRLS } from "@/lib/supabase/server"

export async function getOrCreateGameState(): Promise<GameState> {
  const sessionId = await getOrCreateSessionId()
  const supabase = await getSupabaseServerWithRLS(sessionId)  // ← dodane
  
  // ... reszta kodu bez zmian
}
```

### Krok 4 (WAŻNE): Dla Browser Client (anon key)

Jeśli używasz `createClient()` w komponencie-klientach React, musisz również ustawić session context:

```typescript
// Przykład: components/game/scene-runner.tsx
import { createClient } from "@/lib/supabase/client"

export function MyComponent() {
  const supabase = createClient()
  
  async function loadGameState() {
    const sessionId = await getSessionId() // pobierz z cookie
    
    // Ustaw kontekst RLS PRZED zapytaniem
    await supabase.rpc("set_app_session_id", { session_id: sessionId })
    
    // Teraz zapytanie będzie chronione przez RLS
    const { data } = await supabase
      .from("game_sessions")
      .select("*")
      .single()
  }
}
```

## Struktura RLS

### game_sessions Tabela

| Operacja | Warunek | Opis |
|----------|---------|------|
| **SELECT** | `session_id = current_session_id` | Użytkownik widzi tylko swoje sesje |
| **INSERT** | Brak warunku | Anyone może utworzyć nową sesję |
| **UPDATE** | `session_id = current_session_id` | Użytkownik może aktualizować tylko swoją sesję |
| **DELETE** | `session_id = current_session_id` | Użytkownik może usunąć tylko swoją sesję |

### game_events Tabela

| Operacja | Warunek | Opis |
|----------|---------|------|
| **SELECT** | `session_id = current_session_id` | Użytkownik widzi tylko swoje eventy |
| **INSERT** | `session_id = current_session_id` | Pode tworzyć eventy tylko dla swoiej sesji |
| **UPDATE** | `session_id = current_session_id` | Użytkownik może edytować tylko swoje eventy |
| **DELETE** | `session_id = current_session_id` | Użytkownik może usunąć tylko swoje eventy |

## Przechowywanie session_id w Cookies

Aktualnie masz to już wdrożone w `lib/game-actions.ts`:

```typescript
const COOKIE_NAME = "adulting_session"

async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies()
  const existing = jar.get(COOKIE_NAME)?.value
  if (existing) return existing
  
  const fresh = generateSessionId()
  jar.set(COOKIE_NAME, fresh, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
  return fresh
}
```

✅ To już chroni session_id - jest `httpOnly` i nie mogą go zmienić skrypty.

## Testy bezpieczeństwa

Po wdrożeniu RLS, przetestuj:

```javascript
// Test 1: Spróbuj czytać czyjąś inną sesję (powinno być puste)
const { data: otherSession } = await supabase
  .from("game_sessions")
  .select("*")
  .eq("session_id", "someone-else-session-id")  // NOT set as current context

// Rezultat: [] - żadne dane nie będą zwrócone ✅

// Test 2: Spróbuj wstawi dane bez ustawienia kontekstu
/* Rezultat: Error - INSERT check failed ✅ */

// Test 3: Po ustawieniu poprawnego kontekstu, można czytać/pisać
await supabase.rpc("set_app_session_id", { session_id: "my-session-id" })
const { data: mySession } = await supabase
  .from("game_sessions")
  .select("*")

// Rezultat: Twoje dane ✅
```

## Uwagi na temat SERVICE_ROLE_KEY

Jeśli używasz SERVICE_ROLE_KEY na serwerze (`lib/supabase/server.ts`), RLS **zostanie pominięta**.

**To jest OK dla server-side, ale:**
- Ufaj serwerowi - on ustawi kontekst automatycznie
- Nie ujawniaj SERVICE_ROLE_KEY w przeglądarce

## FAQ

### P: Czy muszę zmienić mój kod aplikacji?
**O:** Minimalnie. Możesz zostawić RLS wyłączone (jak teraz) i wdrożyć je stopniowo.

### P: Co jeśli zapomnimy ustawić session context?
**O:** RLS zapotrzebuje warunku `current_setting('app.current_session_id')` - jeśli jest pusty/NULL, zapytanie zwróci 0 wierszy.

### P: Czy to działa z next.js cache?
**O:** Tak. `revalidatePath()` działa z RLS. Każde zapytanie ma swój kontekst.

### P: Czy mogę mieć jednocześnie RLS i bez RLS?
**O:** Tak. Możesz disablować RLS na niektórych tabelach lub w określonych sytuacjach (admin panel).

## Troubleshooting

**Problem:** `ERROR: new row violates row-level security policy`
- **Rozwiązanie:** Upewnij się, że `session_id` w INSERT/UPDATE matches kontekstu RLS

**Problem:** Pusty wynik mimo że dane istnieją
- **Rozwiązanie:** RLS policy nie pasuje. Sprawdź czy `set_config('app.current_session_id', ...)` został ustawiony

**Problem:** Zapytanie działa w SQL Editor ale nie w aplikacji  
- **Rozwiązanie:** SQL Editor używa roli `authenticated`, a aplikacja używa `anon`. Sprawdź uprawnienia (`GRANT`).

## Następne kroki

1. ✅ Wdróż `supabase-rls.sql` w Supabase
2. ✅ Wdróż `supabase-rpc-functions.sql` w Supabase
3. ✅ Zaktualizuj `lib/supabase/server.ts` aby ustawić session context
4. ✅ Test bezpieczeństwa
5. ✅ Monitoruj błędy w logu aplikacji

---

**Pytania?** Sprawdź [dokumentację Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
