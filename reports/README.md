# BANCO `/reports`

## Current mandatory packs

| Pack | Path |
|------|------|
| **Production Fingerprint (canonical JSON)** | [`ProductionFingerprint.json`](./ProductionFingerprint.json) |
| **Validation Standard (F0/F1 + full mandatory set)** | [`production-validation-standard-2026-07-21/`](./production-validation-standard-2026-07-21/) |
| Protocol v1.0 evidence pack | [`production-protocol-v1-2026-07-21/`](./production-protocol-v1-2026-07-21/) |

### Regenerate

```bash
node scripts/generate-production-validation-standard.mjs
node scripts/generate-production-protocol-reports.mjs
```

### F0 / F1 owner brief (Arabic)

`audit/F0-F1-EVIDENCE-RECOMMENDATION-2026-07-21-AR.md`

**Production Ready is NOT declared** while install/typecheck/live F1 remain BLOCKED.

## Other folders

| Folder | Meaning |
|--------|---------|
| `from-maintenance/` | Historical maintenance audits |
| `from-other-repos/` | Knowledge snapshots — **not** merge sources |
