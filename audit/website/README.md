# Website planning — index

> **2026-07-18 — مسار النسخة الكاملة:**  
> 1. [`WEBSITE-NO-TOUCH-CHARTER-AR.md`](./WEBSITE-NO-TOUCH-CHARTER-AR.md) — ضمان عدم المساس بخط الإنتاج  
> 2. [`WEBSITE-FULL-COPY-PLAN-AND-PREP-AR.md`](./WEBSITE-FULL-COPY-PLAN-AND-PREP-AR.md) — الخطة + التحضير  
> 3. [`WEBSITE-PHASE1-VISUAL-PARITY-STATUS-AR.md`](./WEBSITE-PHASE1-VISUAL-PARITY-STATUS-AR.md) — **Phase 1 جاري:** لوجو + هيرو brand-first

**Playbook السابق:** [`WEBSITE-PRE-START-PLAYBOOK-AR.md`](./WEBSITE-PRE-START-PLAYBOOK-AR.md)  
**Delivery & admin toggle roadmap:** [`WEBSITE-DELIVERY-ROADMAP-AR.md`](./WEBSITE-DELIVERY-ROADMAP-AR.md)

| Document | Purpose |
|----------|---------|
| [`WEBSITE-NO-TOUCH-CHARTER-AR.md`](./WEBSITE-NO-TOUCH-CHARTER-AR.md) | **Freeze:** blacklist/whitelist — لا لمس موبايل/API/ماركت/أدمن |
| [`WEBSITE-FULL-COPY-PLAN-AND-PREP-AR.md`](./WEBSITE-FULL-COPY-PLAN-AND-PREP-AR.md) | نسخة كاملة → ماركت كوبي → هيدرز → فيشة |
| [`WEBSITE-PRE-START-PLAYBOOK-AR.md`](./WEBSITE-PRE-START-PLAYBOOK-AR.md) | Ordered ideas, Go gates, efficiency, DoD per wave |
| [`WEBSITE-READINESS-GATES.md`](./WEBSITE-READINESS-GATES.md) | Sign-off checklists (product, CI, API, GCP, waves) |
| [`WEBSITE-DELIVERY-ROADMAP-AR.md`](./WEBSITE-DELIVERY-ROADMAP-AR.md) | Staging → mobile trial → prod |
| [`WEBSITE-EXECUTION-PRIORITY-AR.md`](./WEBSITE-EXECUTION-PRIORITY-AR.md) | **موبايل أولاً** — طبقات التنفيذ |
| [`WEBSITE-MASTER-PLAN-AR.md`](./WEBSITE-MASTER-PLAN-AR.md) | Vision, personas, waves W0–W8 (Arabic) |
| [`WEBSITE-FEATURE-MATRIX.md`](./WEBSITE-FEATURE-MATRIX.md) | Feature × surface × wave matrix |
| [`WEBSITE-SEPARATION-AND-COMPATIBILITY-PLAN.md`](./WEBSITE-SEPARATION-AND-COMPATIBILITY-PLAN.md) | Architecture, OpenAPI, isolation (English) |
| [`WEBSITE-MOBILE-INDEPENDENCE-CHECKLIST.md`](./WEBSITE-MOBILE-INDEPENDENCE-CHECKLIST.md) | Per-PR mobile safety |

**Status (2026-07-11):** `node scripts/website-ci-local.mjs` **10/10 PASS** (boundaries, rewrite config, lint, typecheck, parity, landing redirect + banco-web build, SEO audit, bundle budget). W8 `/directory` + landing→banco-web redirect when `VITE_WEB_URL` set. Staging CDN + live `/l/:id` smoke + E2E still pending. Surfaces runbook: [`release/SURFACES-DEPLOY-FINISH.md`](../../release/SURFACES-DEPLOY-FINISH.md).
