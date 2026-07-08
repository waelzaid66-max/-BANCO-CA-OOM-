# BANCO — حالة مزامنة الريبوهات (نسخة الإنتاج)

**التاريخ:** 2026-07-08  
**النسخة المعتمدة (canonical):** `8a697c4` على فرع `main`  
**السابق:** `92a33e0` (اعتماد إنتاج) · `f2dcab7` (Metro + OpenAI)

---

## أين تقارير التحديثات والتشغيل؟

| التقرير | المسار | المحتوى |
|---------|--------|---------|
| **مزامنة الريبوهات (هذا الملف)** | `REPO_SYNC_STATUS.md` | SHA، الريموتات، نتائج الدفع |
| **مزامنة Replit → b-banco (قديم)** | `SYNC_REPORT.md` | مرجع تاريخي 2026-07-04 |
| **اعتماد إنتاج + نشر** | `audit/production-readiness/PRODUCTION-SIGN-OFF-AND-DEPLOYMENT.md` | جاهزية، أمن، امتثال، GO/NO GO |
| **تقرير جاهزية نهائي** | `audit/production-readiness/BANCO-STORE-FINAL-PRODUCTION-READINESS-REPORT.md` | مصفوفة الحالة |
| **مرشح الإصدار** | `audit/production-readiness/RELEASE-CANDIDATE-FINAL.md` | قرار التجميد |
| **تشغيل EAS + جهاز** | `audit/production-readiness/STAGING-EAS-DEVICE-RUNBOOK.md` | أوامر PowerShell |
| **بناء EAS** | `release/EAS_BUILD.md` | متغيرات `EXPO_PUBLIC_*` |
| **نشر عام** | `release/DEPLOYMENT.md` · `release/DEPLOY_VERIFICATION.md` | Replit / AWS |
| **صيانة رئيسي** | `audit/maintenance/MASTER-MAINTENANCE-READINESS-PLAN.md` | موجات الصيانة |
| **فحص محلي بدون أسرار** | `node scripts/production-confidence-check.mjs` | 12/12 بوابات |

---

## الريبوهات والريموتات

| الاسم | GitHub URL | دور | قبل المزامنة | بعد المزامنة |
|-------|------------|-----|--------------|--------------|
| **origin** (أساسي) | `waelzaid66-max/-BANCO-CA-OOM-` | مصدر العمل الرئيسي | `8a697c4` ✅ |
| **bbanco** | `waelzaid66-max/b-banco` | مرآة كاملة | `8a697c4` ✅ |
| **bdeals** | `waelzaid66-max/b.deals` | الريبو الأصلي (deploy) | `8a697c4` ✅ |
| **boom** | `waelzaid66-max/B-OOM` | B-OOM الأصلي | `8a697c4` ✅ |
| **upstream** (محلي) | `banco stor app/banco.store-main` | نسخة محلية | `8a697c4` ✅ |

> **ملاحظة:** لا يوجد فرع `aws-virgen-main`. مجلد `aws-virgen` مرجع منفصل فقط.

---

## اختبارات ما قبل الدفع (2026-07-08)

| البوابة | النتيجة |
|---------|---------|
| `production-confidence-check.mjs` | **12/12 PASS** |
| `pnpm run typecheck` | **PASS** |
| `pnpm run lint` | **PASS** |
| `banco-mobile build` | **PASS** |
| `banco-mobile test` (23) | **PASS** |

---

## التحقق بعد الدفع

```powershell
cd C:\Users\waelz\Downloads\BANCO-CA-OOM
git fetch origin bbanco bdeals boom
git rev-parse HEAD origin/main bbanco/main bdeals/main boom/main
# يجب أن تكون الخمسة = 8a697c4... (نفس SHA على كل الريموتات)
```

---

## CI على GitHub

بعد الدفع، تحقق من Actions على كل ريبو:

- https://github.com/waelzaid66-max/-BANCO-CA-OOM-/actions
- https://github.com/waelzaid66-max/b-banco/actions
- https://github.com/waelzaid66-max/b.deals/actions
- https://github.com/waelzaid66-max/B-OOM/actions

---

*يُحدَّث تلقائياً عند كل موجة مزامنة إنتاج.*
