# Pending Repairs

| Field | Value |
|-------|-------|
| Commit | `2c667c81be1fe76d1ef4113a15edc2ed58548e75` |
| Branch | `main` |
| Date | 2026-07-21 |
| Production accepted | **NO** |


1. Laptop/owner: `CONFIRM_BANCOO_FORCE=YES` + `./scripts/publish-bancoo-production-main.sh` (bancoo MAIN)
2. Laptop: `pnpm install --frozen-lockfile` + `laptop-validation-matrix.mjs --with-install`
3. Owner: sync bancooom + deploy + paste readyz (F1)
4. Laptop: device N2 QA + audit paste `PASTE-CURSOR-LAPTOP-AGENT-WAVE-STATUS-SOLD-SOT-AR.md`
5. Optional MED: dealer-os edit-media hydrate (UpdateListingBody.media already live on mobile)
6. Optional: VIDEO-POSTER-SCHEMA-UNWIRED — do **not** invent frame extract
7. Optional: EXPO-APP-IDENTITY-DRIFT — owner branding decision
8. Runtime prove web export on Replit after deps available

