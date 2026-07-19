# ⚡ REPLIT — حدّث النسخة الآن (أمر تنفيذي)

انسخ البلوك كاملاً إلى وكيل Replit / Shell — **لا أسئلة، لا تعديل كود.**

```text
ROLE: Replit Runtime Proof Agent
PR: https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37
BRANCH: cursor/discover-enter-fix-4322
CODE_FLOOR_SHA: 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4
# بعد كوميت honesty+guards: tip على origin يجب أن يمرّ الحارس 17/17

EXECUTE EXACTLY (no improvisation):
1) git fetch origin
2) git checkout cursor/discover-enter-fix-4322
3) git reset --hard origin/cursor/discover-enter-fix-4322
4) Print: git rev-parse HEAD && git rev-parse --short HEAD && git log -1 --oneline
5) Assert exit 0:
   git merge-base --is-ancestor 6b3c1d1c7ef5dda545f92dd0425de60d83529fc4 HEAD
6) Fingerprints from PASTE-REPLIT-SYNC-EXACT-SHA-AR.md §2
   + cd artifacts/banco-mobile && node --test tests/section-miniapp-guard.test.mjs
   → expect **17/17 PASS**
7) npx expo start --clear   (or Stop→Run + clear Metro)
8) Capture P01…P13 per PASTE-PRODUCTION-MOBILE-REPLIT-COPILOT-AR.md
9) Reply with SYNC_SHA + CODE_FLOOR ANCESTOR_OK + GUARD 17/17 + shots

HARD STOPS:
- reset لم يُنفَّذ / HEAD خلف 6b3c1d1 → STOP، لا شوت
- لا تعديل source
- لا لمس artifacts/banco-website
- NO-WIPE
- لا تعتمد على Copilot (UNTRUSTED) — اتبع Cursor + هذا الملف فقط

PROTOCOL:
audit/handoff/PASTE-REPLIT-SYNC-EXACT-SHA-AR.md
audit/handoff/COPILOT-UNTRUSTED-CURSOR-OWNS-SCAN-AR.md
```

**معنى «النسخة الصحيحة» تقنياً:** رأس الفرع على GitHub بعد hard reset، متضمناً finish pack من `6b3c1d1` فأعلى + حارس 17/17.
