# حالة الريبوهين الرسميين — مصدر الحقيقة

**آخر تحديث:** 2026-07-11 (v1.1.6 delivery)  
**مجلد العمل (المصدر الوحيد):** `C:\Users\waelz\Downloads\BANCO-CA-OOM`  
**قاعدة الوكيل:** «حدّث الريبوهات» = **الريبوهان أدناه فقط**. `main` = نسخة هذا المجلد.  
**ممنوع على الوكيل:** push إلى `boom` / `bbanco` / `bdeals` / `upstream` — إلا بطلب صريح.

| # | الريبو | Remote / آلية | الدور |
|---|--------|---------------|-------|
| 1 | **-BANCO-CA-OOM-** | `origin` | أساسي — كود + CI + Replit |
| 2 | **aws-virgen** | sync script / GitHub workflow | AWS deploy |

**الوسm:** `v1.1.6-production-2026-07-11`  
**تقرير التسليم:** `audit/production-readiness/FULL-DELIVERY-REPORT-2026-07-11-AR.md`

---

## push المسموح للوكيل

```bash
git push origin main
git push origin --tags
```

## aws-virgen (الريبو الثاني)

```bash
node scripts/generate-aws-virgen-sync-manifest.mjs --tag v1.1.6-production-2026-07-11
./scripts/publish-aws-virgen-rc.sh v1.1.6-production-2026-07-11
```

Manifest: `release/AWS_VIRGEN_SYNC_MANIFEST.json`

---

## بوابات قبل push

```bash
pnpm run confidence              # 19/19
pnpm run typecheck
pnpm run lint
pnpm run test:api:unit           # 15/15
node scripts/website-ci-local.mjs # 9/9
pnpm run ops:verify-deploy
node audit/mobile/scripts/pre-redeploy-code-gate.mjs
```

---

## حالة النشر

| الطبقة | الحالة |
|--------|--------|
| origin/main | ✅ بعد push |
| aws-virgen sync | ⏳ token |
| API حي wave 6 | ✅ |
| API حي wave 8+bio | ❌ Replit redeploy |
| EAS / متجر | ⏳ |

```bash
bash audit/mobile/REPLIT-SHELL-COPYPASTE.sh
pnpm run ops:post-redeploy
```
