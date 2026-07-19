# أوامر برودكشن — Replit + Copilot (بعد أوديت 2026-07-19)

## Replit — مسار الإثبات الحالي (موبايل)

1. اقرأ ونفّذ: `audit/handoff/PASTE-REPLIT-UPDATE-NOW-AR.md` على PR **#37**  
2. Code floor: `6b3c1d1` · Branch: `cursor/discover-enter-fix-4322`  
3. رد: `SYNC_SHA` + `GUARD 12/12` + P01…P13  
4. **لا تعدّل كود** · لا website · NO-WIPE  

بعد دمج #37 → `main`: أعد `reset --hard origin/main` وصوّر من جديد.

## Copilot — مسح برودكشن (قراءة فقط أثناء إثبات #37)

أنشئ/حدّث: `audit/handoff/COPILOT-SCAN-REPORT-PRODUCTION-MOBILE-AR.md`

افحص فقط (لا PR كود إلا بطلب):

- مطابقة حراس `section-miniapp-guard` مع سلوك Discover/Stay/MOB-07  
- عدم ذوبان Search←→sections  
- مسارات FI على main مقابل ما يعد به #28 (لا تلمس W3)  
- هل `ci.yml` / `deploy.yml` يشغّلان `pnpm --filter @workspace/banco-mobile run test` بعد دمج فرع CI  

صيغة التقرير: ملف · سطر · PASS/FAIL · لا اقتراح حذف ميزات.

## ترتيب المالك (حقيقة برودكشن)

| # | إجراء |
|---|--------|
| 1 | اعتماد شوتات Replit لـ #37 ثم دمج |
| 2 | دمج فرع `cursor/production-audit-ci-gates-4322` (CI+seed) |
| 3 | مراجعة يدوية + دمج #28 FI P0 |
| 4 | #29 docs · ثم فقط Start W3 إن لزم |
| 5 | OPS: أسرار → staging smoke → EAS |

مرجع الأوديت الكامل: `audit/production-readiness/PRODUCTION-AUDIT-LIVE-2026-07-19-AR.md`
