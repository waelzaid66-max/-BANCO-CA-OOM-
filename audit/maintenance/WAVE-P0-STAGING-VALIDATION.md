# Wave P0 — Staging validation (upload schema + smoke)

**Date:** 2026-07-08  
**Plan ref:** `MASTER-MAINTENANCE-READINESS-PLAN.md` §4 P0 items 2–4  
**Scope:** No AWS/GCP/store deploy — validation only.

---

## P0-2 — CI green

After every push to `main`:

1. Open GitHub Actions → workflow **CI**
2. Confirm jobs pass:
   - **Typecheck & build** (all packages + api-server/dealer/admin/landing build)
   - **API tests (Postgres)** (schema push + seed + full suite)

```bash
gh run list --branch main --limit 3
gh run watch
```

---

## P0-3 — `upload_claims` on staging/prod (C-01)

### Automated (CI + tests)

- CI runs `pnpm --filter @workspace/db run push-force` before tests.
- `ensureSchemaPatches()` runs on **api-server boot** and **vitest global setup** (idempotent fallback).
- Regression: `artifacts/api-server/src/lib/ensureSchema.test.ts`

```bash
pnpm --filter @workspace/api-server test ensureSchema
pnpm --filter @workspace/api-server test uploadClaims
```

### Manual on staging DB (once per environment)

```bash
pnpm --filter @workspace/db run push-force
# or rely on next api-server deploy (bootstrap calls ensureSchemaPatches)
```

Verify table:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'upload_claims' ORDER BY 1;
```

---

## P0-4 — Staging smoke (Clerk + real storage byte-path)

**Prerequisites:** staging API URL, Clerk test user JWT, `OBJECT_STORAGE_*` configured (S3 or Replit).

| Step | Check | Pass criteria |
|------|--------|----------------|
| 1 | `GET /api/healthz` | 200 without auth |
| 2 | `GET /api/readyz` | 200 when DB up |
| 3 | `POST /v1/uploads/request-url` | 200 + presigned URL; row in `upload_claims` |
| 4 | PUT bytes to presigned URL | 200/204 |
| 5 | `POST /v1/uploads/verify` | 200 |
| 6 | `POST /v1/uploads/promote` (same user) | 200 |
| 7 | `POST /v1/uploads/promote` (other user, same URL) | **403** (IDOR blocked) |
| 8 | Create listing with promoted media URL | listing saves; image serves |

### Mobile smoke (manual)

1. Profile → **Payments** → Billing hub → Wallet / Invoices / Plans
2. Profile → **Rental hub** (if bookable listings) → Host bookings
3. Notification tap: `booking` → `/bookings?role=host`
4. Notification tap: `payment_failed` → `/billing`

---

## Wave close-out checklist

- [ ] PH-1 committed + pushed
- [ ] CI green on `main`
- [ ] `ensureSchema` + `uploadClaims` tests pass locally or on CI
- [ ] Staging `upload_claims` confirmed (SQL or smoke step 3)
- [ ] Staging upload byte-path smoke (steps 1–8)

**Next after P0 green:** P1 backlog or B4 (invoice PDF) — not cloud production deploy.
