# حالة الريبوهين الرسميين — مصدر الحقيقة

**آخر تحديث:** 2026-07-11  
**مجلد العمل (المصدر الوحيد):** `C:\Users\waelz\Downloads\BANCO-CA-OOM`  
**قاعدة الوكيل:** «حدّث الريبوهات» = **الريبوهان أدناه فقط**. `main` في هذا المجلد = نسختك.  
**ممنوع على الوكيل:** `git push boom` · `bbanco` · `bdeals` · `upstream` — إلا بطلب صريح من المشغّل.

| # | الريبو | Remote / آلية | الدور |
|---|--------|---------------|-------|
| 1 | **-BANCO-CA-OOM-** | `origin` | أساسي — كود + CI + Replit |
| 2 | **aws-virgen** | sync script / GitHub workflow | AWS deploy — نسخة مطابقة للأساسي |

**وسm:** `v1.1.5-production-2026-07-11`  
**مرجع:** `audit/production-readiness/FULL-DEPLOY-TASK-MATRIX-2026-07-11-AR.md`

---

## أوامر push المسموحة للوكيل

```bash
git push origin main
git push origin --tags    # عند إنشاء tag فقط
```

## الريبو الثاني (aws-virgen) — ليس git push مباشر

```bash
node scripts/generate-aws-virgen-sync-manifest.mjs --tag v1.1.5-production-2026-07-11
./scripts/publish-aws-virgen-rc.sh v1.1.5-production-2026-07-11
```

أو GitHub Actions: **Sync aws-virgen (full main)**.

---

## SHA الحالي (origin)

```bash
git fetch origin main && git rev-parse --short origin/main
pnpm run confidence
node scripts/website-ci-local.mjs
```

---

## مصفوفة النشر

| الطبقة | مثبت؟ |
|--------|--------|
| كود GitHub (`origin/main`) | ✅ |
| aws-virgen sync | ⏳ token |
| API حي Replit — موجة 6 | ✅ |
| API حي — موجة 8+bio | ❌ STALE — Replit redeploy |
| EAS / متجر | ⏳ |

---

## Replit redeploy

```bash
bash audit/mobile/REPLIT-SHELL-COPYPASTE.sh
pnpm run ops:post-redeploy
```

---

## خارج نطاق الوكيل (لا push تلقائي)

`boom` (B-OOM) · `bbanco` · `bdeals` — مرآات اختيارية للمشغّل فقط.
