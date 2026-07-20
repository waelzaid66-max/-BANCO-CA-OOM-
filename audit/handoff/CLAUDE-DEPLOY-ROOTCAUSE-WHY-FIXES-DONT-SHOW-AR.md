# CLAUDE → REPLIT — لماذا لا تظهر الإصلاحات (تشخيص عميق) + الأمر الدقيق

**من:** Claude / Fable 5 · **إلى:** Replit + المالك · **2026-07-20** · **القاعدة:** `origin/main` @ `a38cc12`

## التشخيص (فحصت pipeline النشر كاملاً)
| فحص | نتيجة |
|-----|-------|
| الكود على main | ✅ كل الإصلاحات موجودة (هيدر/خريطة/Stay-أيقونة/إيجار-أيقونة/استيراد) |
| `artifacts/banco-mobile/.replit-artifact/artifact.toml` production | `build=[pnpm --filter banco-mobile run build]` ثم `run=[... run serve]` ✅ صحيح |
| `build` = `node scripts/build.js` | Expo/Metro export — **لا يمرّ على tsc، فلا يفشل على الأنواع القديمة** ✅ |
| `serve` = `node server/serve.js` | يخدم `static-build/` + `/status` ✅ |
| `static-build/` committed؟ | **لا** → يُبنى طازجاً كل نشر (ليس bundle قديم مخزّن) ✅ |

## ⇒ السبب الجذري الوحيد
**الكود والإعداد سليمان. النشر الإنتاجي الحي ما زال من main قديم** — نشر Replit يدوي (Publish)، لا يُعاد تلقائياً على كل commit. فالـ`static-build` المخدوم بُني قبل هبوط الإصلاحات.

## الأمر الدقيق (يُظهر الإصلاحات فوراً)
1. **اضغط Publish / أعد النشر الإنتاجي على `a38cc12`** → يعيد تشغيل `banco-mobile run build` (build.js) → `static-build` يُبنى بالكود الجديد → serve يخدمه.
2. **تحقّق من لوجات البناء:** أن `build.js` أكمل وأنتج `static-build/` بلا فشل، وأن `GET /status` = 200.
3. لو تعرض المعاينة التطويرية (expo dev): **أعد تشغيل خدمة expo** (العملية قديمة) + Reload.
4. أكّد للمالك SHA المنشور = `a38cc12` (أو أحدث).

## ملاحظة
`/status` + config النشر أُضيفا للتو (`a38cc12`) — فالمعاينة كانت غالباً غير-قابلة-للوصول قبلها وتخدم fallback. **نشر جديد الآن يجب أن ينجح ويُظهر كل شيء.**

— Claude / Fable 5 · الكود سليم · المطلوب: Publish جديد + تحقّق لوجات البناء + /status
