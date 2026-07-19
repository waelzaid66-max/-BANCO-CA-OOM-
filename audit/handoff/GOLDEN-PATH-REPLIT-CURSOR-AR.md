# المسار الذهبي الوحيد — Replit ↔ Cursor (World-Class)

**اقرأ هذا الملف فقط.** باقي ملفات handoff مراجع؛ هذا مصدر الحقيقة التشغيلي.

| | |
|--|--|
| PR | https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37 |
| Branch | `cursor/discover-enter-fix-4322` |
| أمر النسخة | `git reset --hard origin/cursor/discover-enter-fix-4322` |
| Code floor | `6b3c1d1` يجب أن يكون سلفاً لـ `HEAD` |
| Copilot | **UNTRUSTED — تجاهل** |
| Website | لا تلمس `artifacts/banco-website` |
| W3 FI | محظور |

---

## 1) تركيب (30 ثانية)

```bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git fetch origin
git checkout cursor/discover-enter-fix-4322
git reset --hard origin/cursor/discover-enter-fix-4322
echo "SYNC_SHA=$(git rev-parse HEAD)"
git merge-base --is-ancestor 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4 HEAD
cd artifacts/banco-mobile
node --test tests/section-miniapp-guard.test.mjs   # المتوقع: 21/21 PASS
npx expo start --clear
```

علّق على PR: `## REPLIT SYNC` + خرج الأوامر.

---

## 2) إثبات P01–P13 (بلا إخفاء)

انظر جدول P في `PASTE-REPLIT-LIVE-CHANNEL-CURSOR-AR.md`.  
كل FAIL = شوت + وصف. ممنوع تجميل الشوت.

`testID` مفيدة:
- `stays-header` · `stays-back`
- `legal-terms-link` · `legal-privacy-link`
- `post-{id}-video` · `post-{id}-featured`
- `section-card-{car|real_estate|…}`

---

## 3) Forensics إلزامي

- Metro: 80–120 سطر بعد reload  
- Connections: API base / Clerk / failed requests  
- Speed: Discover / section / Stay / map  
- Noise: عدّ التحذيرات المتكررة  

---

## 4) إصلاح إن كُسر شيء

جراحي في `banco-mobile` فقط → حارس PASS → push → `## REPLIT FIX` (BEFORE/AFTER SHA).  
أو `BLOCKED` بأدلة لـ Cursor.

---

## 5) قالب الرد النهائي

`## REPLIT → CURSOR FULL REPORT` من LIVE-CHANNEL.

---

## ما تتضمنه هذه النسخة (كاملة)

| طبقة | محتوى |
|------|--------|
| Mobile UX | Discover ENTER · Stay مضغوط · MOB-07 · map honesty · RTL |
| Runtime | ErrorBoundary يغلف Clerk · API base loud-fail |
| RTL Stay | B-reaction يفتح للداخل |
| CI/Deploy | full mobile pack + seed production kill-switch (مدموج من #38) |
| Proof IDs | Legal + profile badges |

— Cursor · Golden Path · zero concealment
