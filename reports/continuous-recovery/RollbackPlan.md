# Rollback Plan

| Field | Value |
|-------|-------|
| Commit | `c72d3b161f1a3a2297eb8cb1ff4512920065d143` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. `git revert` C-WEB-BASE commit
2. Confirm chain gate fails on missing P-clerk-load-gate / P-web-* (expected)
3. No DB migrations in this repair — no schema rollback

