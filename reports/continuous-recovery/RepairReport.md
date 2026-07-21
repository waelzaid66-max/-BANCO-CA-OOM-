# Repair Report — ARCHIVE / POST-SIGNUP / EDIT INVALIDATE

| Field | Value |
|-------|-------|
| Commit | `edbe6cf16a1daf83a3201afc7e6bdd649c9c0412` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


## Unique ID
`REP-ARCHIVE-POSTSIGNUP-2026-07-21`

## Problem
1. Edit listing PATCH success only bumped session version — listing RQ cache could stay stale.
2. Post-signup `updateMe` failure still `router.push` business onboarding (half-wired journey).
3. Dealer-os could archive/activate; mobile mine/detail only sold/delete/bump.

## Evidence
- Laptop-style audit of tip `9965d12`
- API already accepts `UpdateListingBody.status` active|sold|archived
- Dealer `handleStatusToggle` archive/activate contract

## Root Cause
Prior wave wired edit media + post-signup Alert but left navigation and cache incomplete; archive UI never ported to mobile.

## Files Modified
See fingerprint.lastRepair.files

## Validation
- chain-integrity-gate: PASS (46 markers incl. archive/post-signup/invalidate)
- mobile node tests: PASS
- typecheck/lint/full build: BLOCKED (no node_modules)

## Rollback
`git revert` this commit; gates will fail intentionally if markers regress.

## Final Status
CODE MERGED on working line · NOT production-accepted · bancooom still FAIL · live F1 BLOCKED

