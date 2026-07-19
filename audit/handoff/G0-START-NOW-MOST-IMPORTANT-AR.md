# G0 — الأهم الآن: محاذاة الحقيقة (قبل أي كود جديد)

**لماذا هذا الأهم؟**  
أي تشطيب/شوت على جهاز قديم = لوم كاذب. لازم نتأكد إن اللي بتتشاف = tip الحالي، وبعدين ندمج، وبعدين نكمّل.

**وضع الكود:** جاهز · حارس **33/33** · لا هدم

---

## 1) الحقيقة الثابتة (انسخها)

| بند | قيمة |
|-----|------|
| الفرع المطلوب على الجهاز | `cursor/surgical-finish-wave-4322` |
| Tip SHA | اطبع بعد السحب: `git rev-parse --short HEAD` (فرع #39) |
| PR الكود | **#39** — https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/39 |
| PR docs/حراس سابق | **#37** (محتواه docs موجود أصلاً داخل تاريخ #39) |
| `origin/main` عند الكتابة | `14d3a89` |
| حارس | `node artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs` → **33/33** |

```bash
git fetch origin
git checkout cursor/surgical-finish-wave-4322
git reset --hard origin/cursor/surgical-finish-wave-4322
git rev-parse --short HEAD   # لازم: 9bca3c4
node artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs   # 33/33
```

---

## 2) شوتات G0 الإلزامية فقط (مش المصفوفة الكاملة)

| # | السطح | ماذا يجب أن يظهر | ❌ فشل إن |
|---|--------|-------------------|-----------|
| G0-1 | Discover | كروت 2×2 صور · بوابة Stay · Banks أزرق · **لا** صفوف ENTER · **لا** CategoryTabs فوق Discover | ENTER / melt |
| G0-2 | قسم سيارات (مثال) | هيدر: back+عنوان+search+filter **داخل** الشريط · chips بلا فراغ أسود · نتائج/فارغ صادق | أزرار خارجة · void أسود |
| G0-3 | Stay / Booking | هيرو **وردي** · ليس أسود | هيدر أسود |
| G0-4 | Banks زائر/غير عضو | subtitle صادق · productsHint · Join ظاهر · **لا** chevron تنقّل | ادّعاء دليل شركاء |
| G0-5 | Banks عضو FI (إن متاح) | inbox ظاهر · **Join مختفي** | Join فوق الـ inbox |
| G0-6 | Profile اختيار FI | بعد اختيار مؤسسة → onboarding بـ نشاط بنك فقط (`intent=fi`) | مسار تاجر/إعلان |
| G0-7 | Profile حساب FI قائم | كارت «مؤسسة مالية» → يفتح Banks · **ليس** «أضف إعلان» كأساسي | كارت تاجر |

ارفع الشوتات + جدول ✅/❌ في تعليق على **PR #39** أو ملف  
`audit/handoff/REPLIT-G0-DELIVERY-AR.md` على فرع `replit/…-4322`.

**Replit = تصوير وتأكيد فقط — ممنوع تعديل كود لإخفاء عيب.**

---

## 3) بعد G0 — ترتيب الدمج (الأهم التالي)

1. Owner يعتمد شوتات G0 (أو يسجّل فروقاً حقيقية فقط).  
2. **دمج PR #39** إلى `main` (يحمل تشطيب FI + حارس 33 + docs الصورة الكاملة).  
3. Replit يسحب `main` الجديد.  
4. بعدها فقط: G2 تشطيب قسم مسمّى إن ظهر عيب في الشوت · أو قرار Banks ب/ج · أو Start هـ لـ Claude (W3).

---

## 4) ما لن يُفتح الآن (حتى ينتهي G0)

- دليل بنوك حي  
- W3 AuthZ  
- redesign Discover/Stay  
- موجة pad عشوائية على كل الشاشات  

---

## 5) جملة Owner للاعتماد

- «G0 OK — ادمج #39»  
أو  
- «G0 فشل في: … (رقم الشوت)»  

*Cursor ينتظر اعتماد G0 قبل كود تشطيب إضافي.*
