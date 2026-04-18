<!-- RLS IMPLEMENTATION CHECKLIST -->

# RLS Implementation Checklist

## 📋 Przed wdrożeniem

- [ ] Kopia zapasowa bazy danych (lub upewnij się że masz backup)
- [ ] RLS będzie wymagać ustawienia session context - upewnij się że to wdrożysz
- [ ] SERVICE_ROLE_KEY będzie omijać RLS (to jest OK dla serwera)

## 🚀 Wdrożenie w Supabase

### Krok 1: RLS Policies
- [ ] Otwórz `supabase-rls.sql`
- [ ] Zaloguj się do Supabase Console
- [ ] Przejdź do `SQL Editor`
- [ ] Skopiuj zawartość `supabase-rls.sql` i wykonaj
- [ ] Sprawdź w `Authentication > Policies` że policies zostały utworzone

### Krok 2: RPC Functions
- [ ] Skopiuj zawartość `supabase-rpc-functions.sql`
- [ ] Wklej do SQL Editor i wykonaj
- [ ] Sprawdź w `Database > Functions` że funkcje `set_app_session_id` i `get_game_state_with_context` istnieją

## 🔧 Integracja z kodem (Opcjonalnie)

### Opcja A: SERVICE_ROLE_KEY (Domyślnie)
- [ ] Już działa, RLS będzie omijana na serwerze (to jest OK)
- [ ] Brak zmian w kodzie wymaganych

### Opcja B: ANON_KEY (Bardziej bezpieczne)
- [ ] Skopiuj kod z `lib/supabase/server-with-rls.ts`
- [ ] Dodaj `setRLSSessionContext()` przed każdym zapytaniem
- [ ] Test: Spróbuj uzyskać dostęp do innej sesji (powinno być puste)

## ✅ Testy bezpieczeństwa

- [ ] Test 1: Spróbuj czytać czyjąś inną sesję bez session context (powinno być puste)
- [ ] Test 2: Ustaw poprawny session_id i czytaj dane (powinno działać)
- [ ] Test 3: Gra działa normalnie (dashbord, moduły, eventy)
- [ ] Test 4: Utwórz dwie sesje i sprawdź że się nie widzą

## 🛡️ Bezpieczeństwo

- [ ] session_id jest w httpOnly cookie (niemożliwe do kradzieży z JS)
- [ ] RLS policies wymagają matching session_id
- [ ] SERVICE_ROLE_KEY nie jest ujawniony w przeglądarce
- [ ] Nie transmitujesz session_id w URL lub logach

## 📊 Monitoring

- [ ] Sprawdzaj Supabase Logs dla błędów RLS
- [ ] Monitoruj `ERROR: new row violates row-level security policy`
- [ ] Sprawdzaj performance - RLS może dodać overhead

## 🎉 Gotowe!

- [ ] RLS jest włączony i testowany
- [ ] Dokumentacja RLS_SETUP_GUIDE.md jest dostępna dla zespołu
- [ ] Pliki `supabase-rls.sql` i `supabase-rpc-functions.sql` są w repozytorium

---

## Krótkie komendy do szybkiego testu

```bash
# 1. Sprawdź czy RLS jest włączony
psql> SELECT tablename, rowsecurity FROM pg_tables 
      WHERE schemaname='public';

# 2. Wylistuj polityki
psql> SELECT * FROM pg_policies WHERE tablename IN ('game_sessions', 'game_events');

# 3. Test: Spróbuj czytać bez kontekstu (powinno być puste)
SELECT * FROM game_sessions;

# 4. Test: Ustaw kontekst i czytaj
SELECT set_config('app.current_session_id', 'test-session-id', false);
SELECT * FROM game_sessions WHERE session_id = 'test-session-id';
```

## Dodatkowe zasoby

- 📚 [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- 🔐 [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- 💡 [Best Practices](https://supabase.com/docs/guide
