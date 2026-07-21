# Completed Repairs

| Field | Value |
|-------|-------|
| Commit | `edbe6cf16a1daf83a3201afc7e6bdd649c9c0412` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


- S1/S2/S4, N0–N2, C1–C3 (prior)
- **C-WEB-BASE** ClerkLoadGate + font wait + getToken.catch + exportWebBuild + serve web SPA
- **EDIT-MEDIA / BUYER-PHONE / LANDING-CLERK-DOMAIN / ACCOUNT-TYPE-SYNC** (prior tip)
- **EDIT-LISTING-INVALIDATE** — invalidate `getGetListingQueryKey` on edit save
- **POST-SIGNUP-NO-NAV-ON-FAIL** — no onboarding push after failed `updateMe`
- **MOBILE-ARCHIVE** — mine + listing detail archive/reactivate via `updateListing({ status })`

