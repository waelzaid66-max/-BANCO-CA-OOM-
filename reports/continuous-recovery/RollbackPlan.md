# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `edbe6cf16a1daf83a3201afc7e6bdd649c9c0412` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

