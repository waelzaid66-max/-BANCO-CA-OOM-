# ⚡ REPLIT — أظهر النسخة الحقيقية الآن (تشغيل فقط)

**من:** Cursor → Replit  
**أمر المالك:** يبغى يشوف أمامه **النسخة الحقيقية** على النشر الآن.  
**ممنوع:** تعديل كود · كوميت · بوش · Copilot · أي redesign · أي SHA قديم

---

## النسخة الحقيقية = هذا الـ tip فقط

| | |
|--|--|
| **الفرع** | `cursor/discover-enter-fix-4322` |
| **SYNC_SHA المطلوب** | `457d6f7` (أو أحدث tip على نفس الفرع بعد `git fetch` — اطبع `git rev-parse HEAD`) |
| **PR** | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |

### ماذا يجب أن يظهر (الحقيقة)

1. **Discover** — شبكة كروت أقسام **2×2 صور** (سيارات/عقارات/مصانع/مواد) — **مش** صفوف ENTER  
2. **Stay / Booking** — هيرو **وردي** + كلمة BOOM STAY — **مش** هيدر أسود  
3. **أقسام سيارات/عقارات/مصانع** — مفيش فراغ أسود ضخم · زر الدولة فيه **اسم** · زر الخريطة مش عملاق · الهيدر مش مسحوق  
4. ضغط كارت القسم → يدخل `/section/...` (ميني-آب)

### ماذا يُرفض فوراً (نسخ غلط / أقدم / أغبي)

- صفوف ENTER بدل الكروت  
- هيدر Stay أسود (`StaysHomeHeader`)  
- أي معاينة على `main` القديم بدون سحب هذا الفرع  
- أي «إصلاح» من عندك للكود

---

## انسخ ونفّذ الآن (حرفياً)

```bash
set -e
cd "$(git rev-parse --show-toplevel)"

git fetch origin
git checkout cursor/discover-enter-fix-4322
git reset --hard origin/cursor/discover-enter-fix-4322

echo "SYNC_SHA=$(git rev-parse HEAD)"
echo "SHORT=$(git rev-parse --short HEAD)"
# يجب أن يبدأ بـ bb7f0fc أو يكون أحدث commit على نفس الفرع بعد هذا الـ tip

# إثبات سريع أن النسخة الحقيقية مش ENTER/أسود:
rg -n "sectionGrid|sectionPortal|StaysHomeHeader|SectionBackdrop" \
  artifacts/banco-mobile/components/SearchDiscover.tsx \
  artifacts/banco-mobile/components/search/BookingStaysApp.tsx || true
# توقّع: sectionGrid + SectionBackdrop موجودين · sectionPortal و StaysHomeHeader غائبين

node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
# توقّع: 25/25 PASS

cd artifacts/banco-mobile
npx expo start --clear
```

ثم صوّر بالترتيب وألصق على PR #37:

1. Discover (كروت صور 2×2)  
2. سيارات  
3. عقارات  
4. مصانع  
5. Stay (هيرو وردي)

---

## قالب التعليق على PR (انسخ)

```text
## REPLIT → CURSOR (RUNTIME ONLY — NO CODE)
SYNC_SHA: <الصق git rev-parse HEAD>
GUARD: 25/25 PASS|FAIL
TRUE VERSION CHECK:
- Discover photo 2x2 cards: YES|NO
- Stay rose hero: YES|NO
- No ENTER rows: YES|NO
- No black Stay header: YES|NO
- No black void in sections: YES|NO
- Country button shows NAME: YES|NO
SHOTS: Discover · Cars · RE · Factories · Stay (attached)
METRO/ERRORS: (الصق أو NONE)
STOP — waiting for Cursor/Owner.
```

**STOP.** لا تلمّس الكود. المالك يشوف الحقيقة من الشوتات فقط.
