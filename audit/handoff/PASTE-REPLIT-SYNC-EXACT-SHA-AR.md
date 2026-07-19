# Replit — مزامنة النسخة الصحيحة (Exact SHA Pin)

**من:** Cursor · قائد الجودة التقنية  
**هدف:** تشغيل Expo على نفس بايتات الكود المعتمدة — لا كاش قديم، لا فرع خاطئ، لا «تقريباً».  
**النسخة المعتمدة الآن (mobile finish pack):**

| حقل | قيمة إلزامية |
|-----|----------------|
| Remote | `origin` |
| Branch | `cursor/discover-enter-fix-4322` |
| **SHA الكامل** | `6b3c1d1c7ef5dda545f92dd0425de60d83529fc4` |
| **SHA القصير** | `6b3c1d1` |
| PR | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| رسالة الكوميت | `fix(mobile): harden MOB-07 map latch, RTL chrome, section guards` |

---

## 0) قواعد حديدية

1. أي معاينة Expo بدون مطابقة SHA أعلاه = **غير صالحة**.  
2. ممنوع تعديل كود لإخفاء عيب.  
3. ممنوع لمس `artifacts/banco-website`.  
4. NO-WIPE: لا حذف ميزات.  
5. بعد المزامنة: Full Reload / امسح Metro cache إن لزم.

---

## 1) مزامنة قسرية للنسخة الصحيحة

نفّذ بالترتيب حرفياً (Shell في Replit):

```bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

git fetch origin
git checkout cursor/discover-enter-fix-4322
git reset --hard origin/cursor/discover-enter-fix-4322

# Pin verification — يجب أن يطبع السطرين التاليين حرفياً:
git rev-parse HEAD
# المتوقع: 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4

git rev-parse --short HEAD
# المتوقع: 6b3c1d1

git log -1 --oneline
# المتوقع يبدأ بـ: 6b3c1d1 fix(mobile): harden MOB-07...
```

إذا `HEAD` ≠ `6b3c1d1c7ef5dda545f92dd0425de60d83529fc4` → **توقف** وأعد `git fetch` ثم `reset --hard` مرة أخرى. لا تصوّر.

---

## 2) بصمات ملفات (إثبات أن النسخة هي نسخة Cursor)

```bash
# يجب أن تظهر المطابقات التالية (exit 0):
rg -n "sectionPortal|sectionList" artifacts/banco-mobile/components/SearchDiscover.tsx
rg -n 'router\.push\("/section/real-estate\?map=1"\)' "artifacts/banco-mobile/app/(tabs)/search.tsx"
rg -n "Array\.isArray\(\s*params\.map\s*\)" artifacts/banco-mobile/components/search/SectionSearchApp.tsx
rg -n "StaysHomeHeader" artifacts/banco-mobile/components/search/BookingStaysApp.tsx
rg -n '"key":\s*Key' artifacts/banco-mobile/components/icons.tsx
rg -n '"business":\s*Building2' artifacts/banco-mobile/components/icons.tsx

# حارس العزل — المتوقع: 12/12 pass
cd artifacts/banco-mobile && node --test tests/section-miniapp-guard.test.mjs
```

الصق مخرجات الأوامر أعلاه في ردك لـ Cursor.

---

## 3) إعادة تشغيل Expo على النسخة النظيفة

```bash
# من جذر الريبو أو حسب سكربت Replit المعتاد لـ banco-mobile:
# أوقف Metro إن كان شغّال، ثم:
cd artifacts/banco-mobile
# مثال شائع — استخدم أمر المشروع عندكم إن اختلف:
npx expo start --clear
```

أو من واجهة Replit: **Stop → Run** بعد الـ hard reset، مع Clear bundler cache إن وُجد.

---

## 4) إثبات بصري (بعد المزامنة فقط)

نفّذ P01…P13 من:

- `audit/handoff/PASTE-PRODUCTION-MOBILE-REPLIT-COPILOT-AR.md`
- `audit/handoff/PASTE-FINAL-MAINTENANCE-REPLIT-COPILOT-AR.md`

قالب الرد الإلزامي:

```
SYNC_SHA: 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4
SHORT: 6b3c1d1
GUARD: 12/12 PASS|FAIL
EXPO: OK|FAIL

P01…P13: PASS/FAIL + مرفق كل شوت
انحرافات حرفية:
```

---

## 5) ماذا بعد نجاح المزامنة+الإثبات (للمالك/Cursor فقط)

| ترتيب | إجراء |
|-------|--------|
| 1 | دمج PR #37 إلى `main` بعد إثبات Replit أخضر |
| 2 | Replit يعيد pin على `main` بعد الدمج (SHA جديد) |
| 3 | مراجعة #28 FI P0 — **بدون** Start W3 |
| 4 | W3 أمان FI فقط بجملة Start صريحة من المالك |

— Cursor · Exact SHA protocol
