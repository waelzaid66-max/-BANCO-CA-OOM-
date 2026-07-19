# النسخة الصحيحة المعتمدة — Canonical Correct Version

**تاريخ الاعتماد:** 2026-07-19  
**معتمد من:** Cursor (مسؤول التسليم) لأمر المالك  
**الغرض:** حكم المالك بدون تخمين — Replit يثبت فقط أن هذه النسخة هي اللي شغّالة قدامه

---

## 1) الهوية الهندسية (لا تفاوض)

| عنصر | قيمة ثابتة |
|------|------------|
| **الاسم** | BANCO Mobile Finish — Correct Restored Tip |
| **الفرع** | `cursor/discover-enter-fix-4322` |
| **CANONICAL_CODE_SHA** | `5bef87e9a632aee5f55cbe917284d31f3f763453` |
| **SHORT** | `5bef87e` |
| **معنى التثبيت** | بايتات الموبايل المعتمدة للحكم — Replit يعمل `reset --hard` لهذا الـ SHA بالضبط |
| **PR** | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| **أساس سليم لم يُمس** | `origin/main` @ `88e83ca` |
| **CI على `5bef87e`** | ✅ Typecheck · Mobile static · API · ESLint · GCP — كلها PASS |

> للحكم: Expo يجب يعمل على **`5bef87e` حرفياً**.  
> كوميتات docs لاحقة على الفرع لا تُستخدم للمعاينة حتى يعتمد Cursor SHA كود جديد صراحةً.

---

## 2) المعمارية الصحيحة (ما يجب أن يكون)

```
Discover (Search tab, viewState=discover)
  └─ كروت أقسام 2×2 صور → router.push(SECTION_ROUTE[cat])
       ├─ /section/car          → SectionSearchApp (lockCategory)
       ├─ /section/real-estate  → SectionSearchApp (+ ?map=1 latch MOB-07)
       ├─ /section/factories    → SectionSearchApp
       ├─ /section/materials    → SectionSearchApp
       └─ /section/booking      → BookingStaysApp (هيرو وردي + SectionBackdrop)

ممنوع:
  ✗ ذوبان Discover → Search criteria (onBrowseSection / update category)
  ✗ صفوف ENTER / sectionPortal
  ✗ StaysHomeHeader أسود
  ✗ صيانة أو تعديل من Replit
```

---

## 3) بصمات الملف ( forefinger — إثبات أن النسخة صحيحة)

| بصمة | متوقع |
|------|--------|
| `SearchDiscover.tsx` فيه `sectionGrid` | نعم |
| `SearchDiscover.tsx` فيه `sectionPortal` أو `StaysHomeHeader` | **لا** |
| `BookingStaysApp.tsx` فيه `SectionBackdrop` + `testID="stays-hero"` | نعم |
| ملف `stays/StaysHomeHeader.tsx` | **غائب** |
| `BReactionButton.tsx` يستورد `useI18n` من `@/context/LanguageContext` | نعم |
| `section-miniapp-guard.test.mjs` | **25/25 PASS** |
| `hScroll: { flexGrow: 0 }` في Section + Stay | نعم |

---

## 4) ماذا يرى المالك على الشاشة (معيار الحكم)

| شاشة | الصح |
|------|------|
| Discover | كروت صور 2×2 للأقسام |
| سيارات / عقارات / مصانع | ميني-آب · لا فراغ أسود · دولة باسم · خريطة غير عملاقة |
| Stay | هيرو وردي BOOM STAY |
| ضغط كارت | يدخل `/section/...` |

---

## 5) أدوار بعد هذا الاعتماد

| طرف | مسموح | ممنوع |
|-----|--------|--------|
| **Cursor** | أي صيانة/إصلاح لاحق بأمر Owner | تفويض صيانة لـ Replit |
| **Replit** | سحب `5bef87e` · تشغيل · شوت · **تأكيد** إنها النسخة المعتمدة | صيانة · كود · commit · push · «إصلاح» |
| **Copilot** | — | كل شيء (UNTRUSTED) |
| **أي أحد** | — | شغل قبل استلام تأكيد النسخة الصحيحة من Replit أمام المالك |

---

## 6) سلم ما بعد الحكم

1. Replit يؤكد SYNC_SHA = `5bef87e…` + شوتات مطابقة للمعيار  
2. Owner يحكم بالعين  
3. إن OK → دمج **#37 فقط** على main  
4. لا W3 / لا صيانات جانبية حتى أمر Owner التالي

— Cursor · Canonical lock · Highest engineering clarity
