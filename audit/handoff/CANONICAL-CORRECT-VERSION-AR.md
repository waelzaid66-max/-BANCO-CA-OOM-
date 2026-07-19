# النسخة الصحيحة المعتمدة — بعد فحص الفروع

**تاريخ الاعتماد:** 2026-07-19 (محدّث بعد rebase على main)

---

## الهوية

| عنصر | قيمة |
|------|------|
| **الفرع** | `cursor/discover-enter-fix-4322` |
| **PR** | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| **SHORT الحي** | `e09f33a` (اطبع HEAD بعد hard reset على الفرع) |
| **معنى النسخة** | `origin/main` + تنظيف الضرر فقط (typecheck · حذف boom docs · i18n ميت) |
| **تحقيق + خطة** | `INVESTIGATION-AND-REPAIR-PLAN-AR.md` |
| **سلسلة الضرر** | `FULL-DAMAGE-CHAIN-AND-BRANCH-MATRIX-AR.md` |

> بعد كل push: اطبع `git rev-parse HEAD` على الفرع — هذا هو CANONICAL_CODE_SHA الحي.  
> Replit يثبت على **ذلك الـ SHA** من `origin/cursor/discover-enter-fix-4322` بعد hard reset (ليس main وحده إن التنظيف لم يُدمَج بعد).

---

## ماذا يجب أن يظهر

- Discover = كروت صور 2×2  
- Stay = هيرو وردي  
- لا ENTER · لا `StaysHomeHeader` · لا boom-stay docs  
- `BReactionButton` يستورد من `LanguageContext`  
- حارس 25/25  

## أدوار

| | |
|--|--|
| Cursor | صيانة وإصلاح |
| Replit | تأكيد النسخة فقط — **ممنوع صيانة** |
| Copilot | UNTRUSTED |

---

— Cursor · Canonical
