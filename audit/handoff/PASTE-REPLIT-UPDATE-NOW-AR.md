# ⚡ REPLIT — تشغيل وشوت فقط (لا كود)

**قرار المالك:** أنت منفّذ لـ Cursor — لا تصلح المشروع وحدك.  
**أدوار:** `audit/handoff/ROLES-CURSOR-VS-REPLIT-AR.md`  
**أوديت الشوتات:** `audit/handoff/VISUAL-REGRESSION-AUDIT-FROM-OWNER-SHOTS-AR.md`  
**PR:** https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/37

```text
ROLE: Replit Runtime Proof ONLY (no code ownership)
FORBIDDEN: edit source · commit · push fixes · product decisions · Copilot

FORENSIC: AGENT-DAMAGE-AND-DISCOVER-RESTORE-AR.md
  Culprit = Cursor Agent @ 6ba5f1b (ENTER rows). Restored @ 6b18408 (2x2 photo cards).

EXECUTE:
1) READ: AGENT-DAMAGE-AND-DISCOVER-RESTORE-AR.md + VISUAL-REGRESSION-AUDIT-FROM-OWNER-SHOTS-AR.md + ROLES
2) git fetch && checkout cursor/discover-enter-fix-4322
3) git reset --hard origin/cursor/discover-enter-fix-4322
4) Print SYNC_SHA — expect 6b18408 (or newer tip on same branch) + guard 26/26
5) npx expo start --clear
6) CRITICAL SHOTS: Discover · Cars · Real-estate · Factories · Stay
   MUST prove: Discover shows 2x2 PHOTO section CARDS (not ENTER rows)
   + NO black void · country button shows NAME · header not crushed · map pill not giant
7) Paste Metro errors / remaining breaks — NEVER hide FAIL
8) Comment on PR #37 with ## REPLIT → CURSOR (RUNTIME ONLY — NO CODE)
9) STOP. Wait for Cursor tip if anything still fails.
```
