# قناة حية — Replit ↔ Cursor على الريبو (إلزامي)

**من:** Cursor · قائد الجودة التقنية  
**إلى:** Replit Agent على نفس الريبو (تتواصلون الآن)  
**قناة الرد الوحيدة:** تعليقات [PR #37](https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37) + ملفات تحت `audit/handoff/`  
**Copilot:** UNTRUSTED — تجاهلوه تماماً

---

## 0) النسخة الكاملة المعتمدة الآن

| حقل | قيمة |
|-----|------|
| Branch | `cursor/discover-enter-fix-4322` |
| **أمر النسخة** | `git reset --hard origin/cursor/discover-enter-fix-4322` ثم اطبع `git rev-parse HEAD` |
| Code floor (سلف إلزامي) | `6b3c1d1c7ef5dda545f92dd0425de60d83529fc4` |
| حارس | **21/21 PASS** (`section-miniapp-guard`) |
| مسار ذهبي | `GOLDEN-PATH-REPLIT-CURSOR-AR.md` |
| PR | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |

**قاعدة tip:** بعد `fetch`+`reset --hard` اركب ما يطبعه `git rev-parse HEAD` — لا تثبتوا SHA قديم من رسالة سابقة. إن `CODE_FLOOR` ليس سلفاً → توقفوا.

---

## 1) قواعد حديدية (تشديد أقصى)

1. **لا تخفِ شيئاً** — كل شاشة مكسورة / باج / انحراف بصري / خطأ لوج = تُبلَّغ حرفياً.  
2. **لا تجميل كاذب** — ممنوع تعديل كود فقط لإخفاء العيب في الشوت.  
3. **NO-WIPE** — ممنوع حذف ميزات/مسارات/أقسام.  
4. **Website معزول** — ممنوع لمس `artifacts/banco-website`.  
5. **W3 FI محظور** — لا تبدأوا أمان FI.  
6. **إصلاح مسموح فقط** لعيوب مرئية/تشغيلية واضحة على الموبايل (جراحي، ملف محدود) + تبليغ Cursor فوراً على PR.  
7. **أي إصلاح بدون تعليق PR + SHA قبل/بعد = مرفوض.**

---

## 2) مرحلة A — تركيب النسخة (قبل أي شوت)

```bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git fetch origin
git checkout cursor/discover-enter-fix-4322
git reset --hard origin/cursor/discover-enter-fix-4322

echo "SYNC_SHA=$(git rev-parse HEAD)"
echo "SHORT=$(git rev-parse --short HEAD)"
git log -1 --oneline

git merge-base --is-ancestor 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4 HEAD
echo "CODE_FLOOR_OK=$?"

# بصمات
rg -n "sectionPortal|sectionList" artifacts/banco-mobile/components/SearchDiscover.tsx
rg -n 'category\s*===\s*"real_estate"' artifacts/banco-mobile/components/SearchDiscover.tsx
rg -n 'router\.push\("/section/real-estate\?map=1"\)' "artifacts/banco-mobile/app/(tabs)/search.tsx"
rg -n "StaysHomeHeader" artifacts/banco-mobile/components/search/BookingStaysApp.tsx
rg -n "Array\.isArray\(\s*params\.map\s*\)" artifacts/banco-mobile/components/search/SectionSearchApp.tsx

cd artifacts/banco-mobile
node --test tests/section-miniapp-guard.test.mjs
# المتوقع: 21/21 pass

# نظّف الضجيج ثم شغّل
npx expo start --clear
```

الصق خرج الأوامر أعلاه في تعليق PR #37 تحت عنوان: `## REPLIT SYNC`.

---

## 3) مرحلة B — إثبات بصري (لا تتخطَّ)

من `PASTE-PRODUCTION-MOBILE-REPLIT-COPILOT-AR.md` + إضافات:

| ID | ماذا تصوّر / تتحقق |
|----|---------------------|
| P01 | Discover: بوابات ENTER أفقية (ليس مربعات فلتر) |
| P02 | ضغط سيارات → `/section/car` (ميني-آب) |
| P03 | عقارات / مصانع / مواد → أقسامها |
| P04 | Booking & Stays → `/section/booking` + هيدر مضغوط |
| P05 | لا CategoryTabs/engines على Discover |
| P06 | Banks: نص صدق (ليست دليل شركاء حي) |
| P07 | Legal إن وُجد في المسار |
| P08 | Stay فلتر داخل الميني-آب فقط |
| P09 | عربي RTL عام |
| P10 | لا انهيار / شاشة بيضاء |
| P11 | Explore on map → عقارات `?map=1` (CTA يظهر فقط إن trending عقاري بإحداثيات) |
| P12 | اقتراحات بحث عربية لا تتداخل مع زر الفلتر + محاذاة نص |
| P13 | Profile شبكة: شارات منطقية تحت RTL |

كل شوت: `PASS|FAIL` + مرفق + `SYNC_SHA`.

---

## 4) مرحلة C — لوجات · ضجيج · توصيلات · سرعة (إلزامي)

انشر في PR تحت `## REPLIT RUNTIME FORENSICS` بدون تلخيص مخادع:

### C1 — Logs
- الصق **آخر 80–120 سطر** من Metro / Expo بعد Full Reload.  
- صنّف كل سطر صاخب: `ERROR` / `WARN` / `Noise(ignore)` / `Actionable`.  
- أي `ERROR` أحمر = سطر كامل + الشاشة التي كنت عليها.

### C2 — Connections
| فحص | كيف | نتيجة |
|-----|-----|--------|
| API base | هل `EXPO_PUBLIC_DOMAIN` مضبوط؟ | OK/FAIL + القيمة المموّهة |
| Clerk | جلسة ضيف / مسجّل | OK/FAIL |
| شبكة طلبات فاشلة | من اللوج أو Network | قائمة URL+status |
| Deep link / section routes | تنقّل الأقسام | OK/FAIL |

### C3 — Speed / jank
| سطح | TTFF تقديري | ملاحظات |
|-----|-------------|---------|
| Discover أول رسم | …ث | |
| دخول قسم سيارات | …ث | |
| Stay هيدر | …ث | |
| Map (إن ظهر CTA) | …ث | |
| أي تقطيع / re-render واضح | نعم/لا | صف أين |

### C4 — Noise budget
- عدّ تحذيرات Metro المتكررة (نفس الرسالة × N).  
- إن > 20 تحذير متكرر لنفس السبب → سجّل كـ `NOISE-P1` مع نص التحذير.

---

## 5) مرحلة D — شاشة مكسورة / باج / ديفو (أصلح + بلّغ)

إذا رأيت عيباً حقيقياً:

1. **صفّه أولاً** في PR: شاشة · خطوات · متوقع · حاصل · شوت.  
2. **أصلح جراحياً** فقط داخل `artifacts/banco-mobile` (أو حارس اختبار إن لزم).  
3. **ممنوع:** website · مسح ميزات · تغييرات FI/W3 · «تنظيف عام».  
4. بعد الإصلاح:
   ```bash
   git status
   git diff --stat
   cd artifacts/banco-mobile && node --test tests/section-miniapp-guard.test.mjs
   git add -A && git commit -m "fix(mobile/replit): <وصف دقيق>"
   git push origin cursor/discover-enter-fix-4322
   ```
5. علّق على PR:
   ```
   ## REPLIT FIX
   BEFORE_SHA: …
   AFTER_SHA: …
   FILES: …
   GUARD: 21/21 PASS|FAIL
   BUG: …
   ```

إن لم تقدروا على إصلاح آمن → **لا تخفوا**؛ اتركوا `BLOCKED` + الدليل لـ Cursor.

---

## 6) قالب الرد النهائي لـ Cursor (انسخوه)

```text
## REPLIT → CURSOR FULL REPORT

SYNC_SHA: …
SHORT: …
CODE_FLOOR: 6b3c1d1 ANCESTOR_OK=yes|no
GUARD: 21/21 PASS|FAIL
EXPO: OK|FAIL
COPILOT: IGNORED

### P01…P13
P01: PASS|FAIL — note
…
P13: PASS|FAIL — note

### RUNTIME FORENSICS
LOGS: (ملخص + لصق الأخطاء)
CONNECTIONS: API=… Clerk=… failed_requests=…
SPEED: discover=…s section=…s stays=…s map=…s
NOISE: count=… top=…

### FIXES PUSHED (إن وُجدت)
- sha / files / bug

### OPEN BUGS NOT FIXED
- …

### ASK CURSOR
- …
```

---

## 7) ماذا يفعل Cursor بعد تقريركم

- يراجع كل FAIL/ERROR حرفياً.  
- يكمل صيانة على نفس الفرع أو فرع لاحق.  
- لا يدمج #37 إلى `main` قبل تقرير أخضر أو قائمة عيوب صريحة مقبولة من المالك.

— Cursor · Live channel · origin tip after hard reset · zero concealment
