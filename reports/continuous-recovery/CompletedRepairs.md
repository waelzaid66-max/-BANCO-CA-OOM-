# Completed Repairs

| Field | Value |
|-------|-------|
| Commit | `2c667c81be1fe76d1ef4113a15edc2ed58548e75` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


- S1/S2/S4, N0–N2, C1–C3 (prior)
- **C-WEB-BASE** ClerkLoadGate + font wait + getToken.catch + exportWebBuild + serve web SPA
- **EDIT-MEDIA / BUYER-PHONE / LANDING-CLERK-DOMAIN / ACCOUNT-TYPE-SYNC** (prior tip)
- **EDIT-LISTING-INVALIDATE** / **MOBILE-ARCHIVE** / **POST-SIGNUP-NO-NAV** (prior)
- **STATUS-MUTATION-CACHE** — mine/detail/chat bump + invalidate after status/delete/promote
- **MINE-MARK-SOLD** + **DEALER-OS-MARK-SOLD** via existing `updateListing({ status: "sold" })`
- **ACCOUNT-TYPE-CHOSEN-AFTER-ME** — Clerk flag only after `/me` success; reopen gate on fail

