# ⚡ REPLIT — أمر واحد فقط · شغّل بالكامل · ممنوع كود

**هذا الملف يلغي كل أوامر Replit القديمة المتضاربة.**  
تجاهل: ENTER-FIX · LIVE-CHANNEL القديم · SYNC-EXACT-SHA · PROOF القديم · أي SHA مثبت قديم.

| | |
|--|--|
| **الدور** | تشغيل + شوتات + لوجات فقط |
| **ممنوع** | تعديل كود · commit · push · Copilot · redesign · أسئلة منتج |
| **الفرع الوحيد** | `cursor/discover-enter-fix-4322` |
| **PR** | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| **CI** | أخضر على tip (Typecheck + Mobile + API) |
| **خريطة المالك** | `YOU-ARE-HERE-OWNER-MAP-AR.md` |

---

## 1) سحب النسخة (حرفياً)

```bash
set -e
cd "$(git rev-parse --show-toplevel)"

git fetch origin
git checkout cursor/discover-enter-fix-4322
git reset --hard origin/cursor/discover-enter-fix-4322

echo "SYNC_SHA=$(git rev-parse HEAD)"
echo "SHORT=$(git rev-parse --short HEAD)"
# أي SHORT على هذا الفرع بعد reset صحيح — لا تطارد أرقام قديمة
```

---

## 2) إثبات سريع قبل Expo

```bash
# يجب يظهر sectionGrid + SectionBackdrop
# يجب يغيب sectionPortal + StaysHomeHeader
rg -n "sectionGrid|sectionPortal|SectionBackdrop|StaysHomeHeader" \
  artifacts/banco-mobile/components/SearchDiscover.tsx \
  artifacts/banco-mobile/components/search/BookingStaysApp.tsx || true

node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
# توقّع: 25/25 PASS
```

لو الحارس FAIL → **وقف** والصق اللوج على PR #37. لا تصلح الكود.

---

## 3) شغّل التطبيق بالكامل

```bash
cd artifacts/banco-mobile
npx expo start --clear
```

افتح المعاينة (ويب أو جهاز) من الصفر بعد الـ clear.

---

## 4) شوتات إلزامية (بالترتيب)

| # | شاشة | يجب يظهر |
|---|------|----------|
| P1 | Discover / بحث رئيسي | كروت أقسام **2×2 صور** — مش ENTER |
| P2 | سيارات | يدخل القسم · مفيش فراغ أسود · دولة **باسم** · خريطة مش عملاقة |
| P3 | عقارات | نفس فوق |
| P4 | مصانع | نفس فوق |
| P5 | Stay / Booking | هيرو **وردي** — مش أسود |
| P6 | ضغط كارت من Discover | يفتح `/section/...` مش يذوب في Search |

أي FAIL: صوّره + الصق Metro. **لا تخفي.**

---

## 5) رد على PR #37 فقط

```text
## REPLIT → CURSOR (RUNTIME ONLY — NO CODE)
SYNC_SHA: <git rev-parse HEAD>
SHORT: <git rev-parse --short HEAD>
GUARD: 25/25 PASS|FAIL
P1 Discover photo 2x2: YES|NO
P2 Cars ok: YES|NO
P3 RE ok: YES|NO
P4 Factories ok: YES|NO
P5 Stay rose hero: YES|NO
P6 Section enter works: YES|NO
METRO: NONE | <الصق>
SHOTS: attached
STOP — waiting Owner/Cursor
```

---

## 6) STOP

لا كوميت. لا بوش. لا «إصلاح سريع».  
استنى أمر Cursor/Owner التالي.

— Cursor · Single Replit plan · Full run only
