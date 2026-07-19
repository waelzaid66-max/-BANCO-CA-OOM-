# Replit — النسخة الحالية الحقيقية (مصدر الحقيقة الوحيد الآن)

**من:** Cursor · **إلى:** Replit + المالك · **التاريخ:** 2026-07-19  
**يلغي:** أي لصق قديم يطلب فرع `discover-enter-fix` أو يدّعي إن #32–#41 «مش على main».

---

## 0) الحقيقة في سطر

| عنصر | قيمة |
|------|------|
| الفرع | **`main`** فقط |
| Tip الحالي على GitHub | **`dad3a592c66f1b83b1407b753c0b9cae9362b138`** (`dad3a59`) |
| ماذا يشمل | W1 #32 · W3 FI #40 · G2 أقسام #41 · mob01/04/05 · W4 sort · Discover ENTER |
| دور Replit | **سحب + Reload + شوتات تأكيد** — ممنوع صيانة كود على Replit |
| PR معلّق اختياري | **#42** (M-1/M-2 عقد البحث) — بعد دمجه اسحب main مرة ثانية |

**Claude (`7f6f3ec`) قال إن الـPRs مش على main — هذا ادّعاء قديم.** تجاهله. الدمج تم.

---

## 1) انسخ ونفّذ على Replit (قسري)

```bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

git fetch origin
git checkout main
git reset --hard origin/main

SYNC_SHA="$(git rev-parse HEAD)"
echo "SYNC_SHA=$SYNC_SHA"
git log -1 --oneline

# يجب أن يمرّ — وإلا النسخة باطلة
test "$SYNC_SHA" = "dad3a592c66f1b83b1407b753c0b9cae9362b138" \
  || git merge-base --is-ancestor dad3a592c66f1b83b1407b753c0b9cae9362b138 HEAD

echo "MAIN_FLOOR_OK=yes"

# Expo نظيف
cd artifacts/banco-mobile
npx expo start --clear
```

بعد دمج #42 لاحقاً: نفس الأوامر بدون تثبيت SHA ثابت — يكفي `origin/main` الأحدث + `git log -1`.

---

## 2) ماذا يجب أن تشوف بصرياً (مصفوفة صدق)

| # | الشاشة | المتوقع على `dad3a59` |
|---|--------|------------------------|
| 1 | Discover → كارت قسم | يدخل `/section/…` (مش يفلتر تاب السيرش) |
| 2 | Discover → خريطة | `/section/real-estate?map=1` |
| 3 | مواد / مصانع / سيارات / عقارات | شرائط فلاتر منفصلة · ترتيب 34px · عدّاد يشمل sort |
| 4 | Stay / حجز | هيدر **وردي** · نوع + إيجار · رجوع يصفر **بدون** Alert تأكيد |
| 5 | بنوك | brochure صدق — **مش** دليل شركاء حي |
| 6 | بروفايل | أزرار الغلاف بـ`end` (RTL) · هاتف في التعديل · بطاقة إكمال تختفي لو مكتمل |
| 7 | FI inbox (حساب بنك) | AuthZ فرع + آلة حالات (خلفية — لا UI أسود) |

---

## 3) ممنوع على Replit

1. تعديل كود لإخفاء عيب.  
2. سحب فرع أسود Stay أو أي PR قديم بدل `main`.  
3. بناء دليل بنوك حي.  
4. الاعتماد على تقارير Claude قبل الدمج (`0696c66` / «مش على main»).

---

## 4) بعد الشوتات — أرجع للمالك سطراً

```
REPLIT_SYNC_SHA=<الصق git rev-parse HEAD>
SHOTS=Discover-ENTER | Stay-rose | Materials-strips | Banks-brochure | Profile-RTL
NOTES=<أي فرق بصري فقط>
```

— Cursor · حزمة النسخة الحالية لـReplit
