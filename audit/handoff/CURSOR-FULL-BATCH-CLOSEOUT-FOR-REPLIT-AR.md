# إغلاق الدفعة الكاملة — تقرير لـReplit والمالك

**من:** Cursor · **التاريخ:** 2026-07-19  
**هدف التقرير:** تعرف بالظبط إيه اللي على النسخة الحالية (`main`) وإيه اللي لسه معلّق.

---

## 1) Tip النسخة الحالية

| | |
|--|--|
| `origin/main` | `dad3a592c66f1b83b1407b753c0b9cae9362b138` (`dad3a59`) |
| آخر دمج مرئي | Merge PR **#41** (بعد #40 على نفس الخط) |
| قناة Claude | `7f6f3ec` — مراجعة فقط · **لا كود أحدث** |
| PR مفتوح اختياري | **#42** M-1/M-2 عقد البحث (`39b36c6`) |

---

## 2) ما اتعمل واتدمج على main (دفعة كاملة)

| PR | الموضوع | حالة |
|----|---------|------|
| #32 | W1 عزل Discover عن Search + حارس CI | ✅ على main |
| #33 | MOB-04 RTL غلاف البروفايل (`end`) | ✅ |
| #34 | W4 شريحة الترتيب في شريط الفلاتر | ✅ |
| #35 | MOB-01 هاتف في تعديل البروفايل | ✅ |
| #36 | MOB-05 صدق Discover/بنوك | ✅ |
| #39/#28 مسار | FI P0 فصل / تشطيبات | ✅ |
| #40 | **W3 أمان FI** (AuthZ · state machine · owner · isActive) — Claude اعتمد β | ✅ `628e7a0` |
| #41 | G2 تشطيب أقسام (مواد/عقارات/عربيات/Stay وردي · auto-reset · RTL كروت) | ✅ `dad3a59` |

---

## 3) ملاحظات صيانة Claude — حالة دقيقة

| بند Claude | الحالة |
|------------|--------|
| M-1 مرآة `propertyType` في search-contract | ✅ في PR **#42** (مش main بعد) |
| M-2 حذف cast الموبايل | ✅ في #42 |
| M-3 assert `/section/booking` | ✅ **على main** مسبقاً |
| M-4 مراجعة `search.tsx` | ✅ مراجعة منتهية — **لا كود إضافي** (انظر ملف M-4) |

---

## 4) ما يتفتحش (بوابات مالك)

| بند | السبب |
|-----|--------|
| دليل بنوك حي | ADS-FIRST · يحتاج جملة D1=ج |
| هيدر Stay أسود / `StaysHomeHeader` | المالك رفض · وردي MUST-KEEP |
| إعادة تنفيذ W3 | #40 معتمد ومختبر · ممنوع لمس `FinancingService` تاني بلا سبب |

---

## 5) تقارير Claude القديمة — تجاهلها على Replit

| ادّعاء قديم | الحقيقة |
|-------------|---------|
| «الإصلاحات مش على main» | **غلط** — ادمجت |
| `main = 0696c66` | **قديم** → `dad3a59` |
| سحب فرع `discover-enter-fix` | **ملغي** — اسحب `main` فقط |
| تأكيد Alert عند رجوع Stay | **تغير** — auto-reset بلا حوار |

---

## 6) أمر Replit الوحيد

افتح ونفّذ حرفياً:

→ **`audit/handoff/REPLIT-CURRENT-VERSION-NOW-AR.md`**

لصق قصير:

→ **`audit/handoff/PASTE-REPLIT-CURRENT-BATCH-AR.md`**

---

## 7) ملفات handoff المرتبطة بهذه الدفعة

| ملف | غرض |
|-----|------|
| `CURSOR-COMPOSE-WITH-CLAUDE-LIVE-AR.md` | تنسيق مع Claude الحي |
| `CURSOR-M4-SEARCH-TSX-REVIEW-AR.md` | مراجعة M-4 |
| `CURSOR-OWNER-PROCEED-ATFADDAL-AR.md` | سجل «اتفضل» |
| `PASTE-OWNER-COMPOSE-CLAUDE-AR.md` | لصق مالك قصير |
| `JOINT-ARCHITECTURE-EXECUTION-PLAN-AR.md` | حالة الموجات محدّثة |

— Cursor · إغلاق دفعة للعرض على Replit بدقة
