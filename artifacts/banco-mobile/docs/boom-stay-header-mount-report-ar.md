# تقرير تركيب هيدر BOOM STAY الأسود

**الفرع:** `cursor/boom-stay-header-black-4322`  
**التاريخ:** 2026-07-19  
**النطاق:** هيدر صفحة Booking & Stays فقط — بدون فنادق، بدون لمس API/ماركت/أقسام أخرى  

---

## ماذا تغيّر (شكل فقط)

| قبل | بعد |
|-----|-----|
| Hero وردي `#650E36` + `SectionBackdrop` + watermark | هيدر أسود `#000000` شيك |
| هوية مضغوطة بين أزرار | هوية مركزية: B-OOM + STAY + tagline + powered by BANCO |
| بحث frosted داخل الوردي | حبة سوداء بإطار قرمزي + فلتر على اليمين |
| chips نصية تحت الهيدر | تبويبات أيقونة+نص: All · Studio · Apartment · Villa · Chalet |

**مرجع بصري:** `docs/boom-stay-header-target-mock.png`  
**خطة:** `docs/boom-stay-header-redesign-plan.md`

---

## ماذا لم يُكسر (عقود محفوظة)

- رجوع `stays-back` → `router.back`
- حفظ البحث `stays-save-search`
- فلتر `stays-filter-toggle` → نفس `FilterSheet`
- بحث / اقتراحات / commit query
- أنواع العقار `stays-type-*` (نفس قيم `propertyType`)
- سوق الدولة `MarketCountryButton` تحت الهيدر
- نتائج `StayCard`، خريطة، FAB، `MiniAppBottomNav`
- قفل `real_estate` + `rent`
- **لا Hotels**

---

## ملفات

| ملف | دور |
|-----|-----|
| `components/search/stays/StaysHomeHeader.tsx` | **جديد** — الهيدر الأسود |
| `components/search/BookingStaysApp.tsx` | استبدال الـ hero الوردي بالتركيب |
| `constants/i18n.ts` | `staysTabAll` + `staysTagline` |
| `docs/boom-stay-header-*` | خطة + mock + هذا التقرير |

---

## كيف تشوفه على Replit

1. اسحب/ادمج فرع `cursor/boom-stay-header-black-4322` (أو الـ PR).
2. شغّل `banco-mobile` (Expo).
3. Discover → **Booking & Stays** → `/section/booking`.
4. تأكد: أسود · هوية وسط · بحث بإطار أحمر · تبويبات · رجوع/حفظ/فلتر/نتائج كما قبل.

---

## Rollback

أعد تفعيل الـ hero الوردي من `BookingStaysApp` السابق، أو `git revert` للكوميت. لا migration ولا API.
