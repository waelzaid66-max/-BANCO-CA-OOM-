# Pending Repairs

| Field | Value |
|-------|-------|
| Commit | `76ead31dc3778e9e521ce013cab2c9719145b483` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. Laptop/owner: `CONFIRM_BANCOO_FORCE=YES` + `./scripts/publish-bancoo-production-main.sh` (bancoo MAIN)
2. Laptop: `pnpm install --frozen-lockfile` + `laptop-validation-matrix.mjs --with-install`
2. Owner: sync bancooom + deploy + paste readyz (F1)
3. Laptop: device N2 QA
4. Optional card: aws-virgen EB packaging (AWS lane only)
5. Runtime prove web export on Replit after deps available

