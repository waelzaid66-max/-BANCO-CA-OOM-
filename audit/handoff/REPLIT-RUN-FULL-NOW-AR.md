# ⚡ REPLIT — تأكيد النسخة الصحيحة فقط · ممنوع صيانة

**تحذير المالك:** Replit **لا يعمل أي صيانة**.  
مهمتك = سحب النسخة المعتمدة · تشغيل · إثبات إنها هي · شوتات · STOP.

**المصدر الوحيد للاعتماد:** `CANONICAL-CORRECT-VERSION-AR.md`

| | |
|--|--|
| **CANONICAL_CODE_SHA** | `5bef87e9a632aee5f55cbe917284d31f3f763453` |
| **SHORT** | `5bef87e` |
| **الفرع** | `cursor/discover-enter-fix-4322` |
| **PR** | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| **ممنوع** | edit · commit · push · fix · Copilot · أي «صيانة» |

---

## نفّذ حرفياً (ثبّت على SHA الكود المعتمد — ليس أي tip docs)

```bash
set -e
cd "$(git rev-parse --show-toplevel)"

CANONICAL=5bef87e9a632aee5f55cbe917284d31f3f763453

git fetch origin
git checkout cursor/discover-enter-fix-4322
# مهم: تثبيت بايتات الحكم — لا تستخدم tip docs الأحدث للمعاينة
git reset --hard "$CANONICAL"

SYNC_SHA=$(git rev-parse HEAD)
SHORT=$(git rev-parse --short HEAD)
echo "SYNC_SHA=$SYNC_SHA"
echo "SHORT=$SHORT"

test "$SYNC_SHA" = "$CANONICAL" || {
  echo "FAIL: SYNC_SHA must be $CANONICAL — got $SYNC_SHA — STOP. Do NOT fix."
  exit 1
}
```

### بصمات (تأكيد فقط — لا إصلاح)

```bash
rg -n "sectionGrid|sectionPortal|SectionBackdrop|StaysHomeHeader" \
  artifacts/banco-mobile/components/SearchDiscover.tsx \
  artifacts/banco-mobile/components/search/BookingStaysApp.tsx || true
# توقّع: sectionGrid + SectionBackdrop موجودين · sectionPortal + StaysHomeHeader غائبين

test ! -f artifacts/banco-mobile/components/search/stays/StaysHomeHeader.tsx \
  && echo "StaysHomeHeader ABSENT OK"

node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
# توقّع: 25/25 PASS — لو FAIL: الصق اللوج وSTOP. لا تصلح.
```

### تشغيل للعرض فقط

```bash
cd artifacts/banco-mobile
npx expo start --clear
```

---

## شوتات للحكم (P1–P6)

1. Discover = كروت صور 2×2  
2. سيارات · 3. عقارات · 4. مصانع  
5. Stay = هيرو وردي  
6. دخول قسم من Discover يشتغل  

---

## رد على PR #37 فقط

```text
## REPLIT → CURSOR (CONFIRM CANONICAL ONLY — NO MAINTENANCE)
CANONICAL_EXPECTED: 5bef87e
SYNC_SHA: <full>
SHORT: <short>
MATCH_CANONICAL: YES|NO
GUARD: 25/25 PASS|FAIL
FINGERPRINTS:
  sectionGrid: YES|NO
  SectionBackdrop/stays-hero: YES|NO
  StaysHomeHeader absent: YES|NO
  sectionPortal absent: YES|NO
SCREEN:
  P1 Discover photo 2x2: YES|NO
  P2–P4 sections ok: YES|NO
  P5 Stay rose: YES|NO
  P6 section enter: YES|NO
METRO: NONE | <paste>
SHOTS: attached
STOP — no code, no maintenance, waiting Owner judgment
```

**STOP.** ممنوع أي شغل صيانة. المالك يحكم بالعين على هذه النسخة فقط.

— Cursor · Confirm-only order
