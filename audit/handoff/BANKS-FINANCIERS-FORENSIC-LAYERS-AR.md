# تقرير جنائي — بنوك وممولين: طبقات · إنشاءات صحيحة · عرض ناقص

**الفرع:** `cursor/discover-enter-fix-4322`  
**Tip SHA:** اطبع `git rev-parse --short HEAD` عند القراءة (لا تثبت short قديم).  
**الحالة:** FORENSIC ONLY — لا كود حتى موافقة Owner صريحة.  
**الدخول:** Discover → `testID=discover-banks-hub` → `router.push("/business/banks")`

---

## 0) الحكم في جملة

الصفحة **تفتح مسارها الخاص** (`/business/banks`) وليست ذائبة داخل Search tab.  
ما يبدو «مش صفحة خاصة» هو أن **العرض العام brochure ثابت** بينما **الإنشاءات الحقيقية (دليل وسطاء · Inbox · فروع · مقاعد)** موجودة في طبقات أخرى ومقفولة أو غير موصولة بالهب العام.  
الوكلاء اختصروا عبر توسيع طبقات أقسام/أعمال أخرى بدل بناء عالم بنوك مكتمل للزائر.

---

## 1) مسار الفتح — حقيقة vs شعور

| فحص | النتيجة | دليل |
|------|---------|------|
| Discover CTA | `Pressable` → `"/business/banks"` | `SearchDiscover.tsx` ~449–451 |
| هل Banks داخل `SECTION_ROUTE`؟ | **لا — متعمّد** | `SECTION_ROUTE` = car / real-estate / factories / materials فقط |
| شاشة الوجهة | `app/business/banks.tsx` | ملف كامل: hero أزرق + PRODUCTS + Join + Inbox شرطي |
| مسار أقسام أخرى | `/section/*` ميني-آب Search | Banks **خارج** هذا الـ stack |

**معنى ملاحظة المالك «مش بتفتح صفحة خاصة بيها»:**  
ليس 404 ولا melt لتاب Search. الشعور يأتي من أن الزائر يتوقع ميني-عالم (قائمة مؤسسات / منتجات حية / فلاتر) فيجد **هب تسويقي** يشبه بطاقة Business أخرى، بينما القدرات الثقيلة مخفية أو أدمن-فقط.

---

## 2) خريطة الطبقات — ما هو Banks فعلاً؟

```
Discover (hub portal أزرق)
        ↓ push /business/banks

Layer A — Public Hub (banks.tsx)
  hero + subtitle صادق + PRODUCTS[] ثابت
  Join CTA → onboarding?intent=fi
  note صدق

Layer B — FI Staff (نفس الملف، شرطي)
  InstitutionInboxSection
  GET /v1/financing/inbox (أعضاء فقط)
  branch assign · contacted/closed

Layer C — Admin CRM (غير موبايل عام)
  listIntermediaries · seats · forward
  permission: manage_financing

Layer D — Listing financing (عالم آخر)
  payment_options / bank_finance على إعلان
  seed BANK_FINANCE_PARTNERS ≠ دليل بنوك
```

**قاعدة الهوية:** أزرق trust = Banks فقط (`BANKS_ACCENT` / `SECTION_GRADIENT.banks`). Stay وردي — ممنوع استعارة أزرق Stay.

---

## 3) إنشاءات صحيحة موجودة — لكنها مش معروضة للعامة

| إنشاء | أين يعيش | يظهر للزائر؟ | ملاحظة |
|--------|----------|--------------|--------|
| جدول `financing_intermediaries` + `listIntermediaries()` | API أدمن | **لا** | لا endpoint عام للموبايل |
| Inbox مؤسسة + تحديث حالة/فرع | `banks.tsx` + `/v1/financing/inbox` | فقط عضو FI موقّع | يختفي بصمت لغير الأعضاء (403 → null) |
| `intent=fi` على Join | CTA → onboarding | نعم مسار | فُتح بـ P0 / #28 مسار |
| دور `financial_institution` | backend enum | نعم بعد onboarding | فصل عن dealer موجود |
| فروع + seats + auto-handoff | FI phase 2 | داخل inbox فقط | تشغيل يومي يحتاج ربط أدمن |
| أنواع منتجات (عقار/سيارات/…) | `PRODUCTS[]` محلي | نعم كنص | **ليست** بيانات بنك حي |

مرجع سابق متوافق: `audit/financing/01-BANKS-HUB-REAL-DATA-AR.md` (PARTIAL).

---

## 4) ما يُبنى غلط / ناقص في العرض

| ID | العرض الحالي | المشكلة |
|----|--------------|---------|
| MOB-02 | صفوف PRODUCTS كبطاقات | كانت توحي بتنقّل (chevron)؛ أُزيل الـ chevron لكن الصفوف ما زالت «شكل كتالوج» بلا وجهة |
| MOB-03 (مغلق نصياً) | كان «شركاء موثّقون» | النسخ الآن صادق: «ليست دليل شركاء حي» — لكن الشكل ما زال brochure |
| S6 | نفس الشاشة = تسويق + inbox مخفي | توقعات الزائر ≠ حقيقة القسم |
| Directory gap | لا قائمة مؤسسات من API | التوقع الأكبر غير مبني على الموبايل العام |
| Onboarding مشترك | حقول dealer/company/FI | توسعة طبقة أعمال قديمة بدل عالم FI مستقل (S2/S3 في تقرير 05) |

Replit matrix يؤكد السطحين فقط كقبول بصري حالي:
- **S056** hub صادق (منتجات بلا chevron · Join · note)
- **S057** inbox إن حساب FI

لا يوجد في المصفوفة «دليل شركاء حي» كسطح جاهز.

---

## 5) اختصار الوكلاء — توسيع طبقات أقسام أخرى

| اختصار لُوحظ تاريخياً | طبقة مستعارة | لماذا غلط لـ Banks |
|----------------------|--------------|---------------------|
| معاملة Banks كميني-آب Search (`SectionSearchApp` / criteria) | طبقات Car/RE/Factories | Banks ليس `Category` في `SECTION_ROUTE` ولا محرك بحث إعلانات |
| إصلاح «فراغ» بـ `topPad = web?67` | نمط layout أقسام | ضغط هيدر؛ صُحّح لـ insets حقيقية على #37 |
| أزرق لـ Stay / Booking | هوية Banks | كُسر ثم رُمّم وردي Stay |
| Join → onboarding بلا `intent=fi` | مسار تاجر | فرد يصبح dealer |
| نجاح onboarding → إنشاء إعلان | عالم بائع | رحلة بنك تُدفع لمسار listing |
| الاعتماد على seed `BANK_FINANCE_PARTNERS` كـ «دليل» | طبقة listing payment_options | أسماء خطط تمويل على إعلانات تجريبية ≠ directory |
| نسخ «شركاء موثّقون» فوق PRODUCTS | تسويق مكان بيانات | أُصلح نصياً؛ الشكل ما زال مضلّلاً جزئياً |

**خلاصة الاختصار:** المشكلة ليست أن Banks «ناقص ملف» — الملف موجود وغني (inbox حقيقي). المشكلة أن **الطبقة العامة لم تُبنَ كعالم بنوك**؛ وُضعت brochure فوق أنابيب CRM/FI بينما الدليل الحي بقي أدمن-فقط.

---

## 6) مقارنة سريعة مع الأقسام الخمسة

| بُعد | Car / RE / … / Stay | Banks |
|------|---------------------|-------|
| Route | `/section/*` | `/business/banks` |
| نواة | `useSearchMiniApp` + نتائج | Hub + Inbox شرطي |
| بيانات عامة | إعلانات حية من search API | لا directory عام |
| هوية لون | أحمر/وردي عائلة | أزرق وحيد |
| هدف الزائر | تصفّح/فلترة مخزون | تعرّف أنواع تمويل + انضمام مؤسسة |
| هدف المؤسسة | (بائع/مضيف) | استلام طلبات محوّلة |

Banks **عالم سادس موازٍ** — ليس «قسم سادس بنفس طبقات البحث». أي إصلاح يحاول لصق `engines/facets` عليه = اختصار طبقات قديمة.

---

## 7) ماذا **ليس** مطلوب إصلاحه الآن (بدون Start)

- W3 FI AuthZ عميق  
- دليل شركاء حي كامل (يحتاج قرار منتج + API عام + UI)  
- إعادة تصميم Discover  
- دمج Banks داخل `SECTION_ROUTE`  
- لمس Financing CRM أدمن إلا بتنسيق معلن

---

## 8) خيارات Owner — موافقة قبل أي كود

| خيار | ماذا يعني | مخاطرة |
|------|-----------|--------|
| **أ) Confirm-only** | Replit S056/S057 على tip الحالي؛ لا كود | صفر كود |
| **ب) Honesty شكلي أعمق** | تقليل إيهام «كتالوج»: PRODUCTS كشرح فقط / عناوين أوضح؛ بدون directory | UI صغير؛ لا API |
| **ج) دليل شركاء حي (Start صريح)** | endpoint عام آمن + قائمة في `banks.tsx` من `financing_intermediaries` النشطة | منتج+API+AuthZ+نسخ؛ ممنوع اختراع بيانات |
| **د) عالم FI منفصل أعمق** | onboarding/نجاح/باقة FI بلا مسار listing | أكبر من الهب؛ تنسيق مع #28/P0 |

**اقتراح Cursor:** ابدأ بـ **أ** للتأكيد البصري، ثم إن وافقت: **ب** جراحي قبل أي **ج**.

---

## 9) أوامر تحقق سريعة (بدون تعديل)

```bash
rg -n "business/banks|discover-banks|SECTION_ROUTE" artifacts/banco-mobile/components/SearchDiscover.tsx
rg -n "PRODUCTS|InstitutionInbox|intent=fi" artifacts/banco-mobile/app/business/banks.tsx
rg -n "listIntermediaries|/intermediaries|/inbox" artifacts/api-server/src/routes/v1/
sed -n '1391,1406p;3326,3341p' artifacts/banco-mobile/constants/i18n.ts
```

---

## 10) طلب موافقة

Owner: اختر **أ / ب / ج / د** (أو مزيج مرتّب).  
Cursor لا يلمس `banks.tsx` / Financing API لبناء directory أو إعادة تشكيل الهب حتى يردّ Start صريح على بند مسمّى.
