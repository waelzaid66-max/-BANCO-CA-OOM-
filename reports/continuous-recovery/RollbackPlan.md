# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `2c667c81be1fe76d1ef4113a15edc2ed58548e75` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

