# مرجع تشغيل الموجة الجراحية — Cursor

**فرع حالي:** `cursor/fi-authz-agent-patch-4322`  
**آخر دمج main:** `0696c66` = PR **#39** (تشطيب FI بصري + حارس)  
**لوحة أم:** `FULL-PICTURE-SAFE-PATH-MASTER-AR.md`  
**Banks:** `BANKS-FINANCIERS-FORENSIC-LAYERS-AR.md`  
**فهم ثابت:** التطبيق كامل · التشطيب صغير · ممنوع هدم/redesign · طبقة واحدة مسمّاة

---

## قواعد لمس الكود (كل PR صغير)

1. لا Discover ENTER · لا Stay أسود · لا iconBtn&lt;12 · لا topPad 67  
2. لا Banks directory حي بلا Start صريح «ج»  
3. AuthZ وكيل PATCH: Owner أمر «كمل» بعد #39 — Cursor ينفّذ R1+R2 جراحياً (هذه الموجة)  
4. حارس `section-miniapp-guard` يبقى أخضر  
5. ملفات مشتركة FI: أعلن في handoff قبل التعديل

---

## طابور OPEN — حالة الموجة

| ID | البند | موجة | حالة |
|----|-------|------|------|
| OPEN-10 / F-ORD-05 | Profile→FI بدون `intent=fi` | #39 | ✅ merged |
| F-UX-02 | Join فوق أعضاء FI | #39 | ✅ merged |
| F-UX-01 / OPEN-09 | لا اختصار Banks من البروفايل لـ FI | #39 | ✅ merged |
| F-SEP (عرض) | FI يرى كارت «أضف إعلان» كتاجر | #39 | ✅ merged |
| Honesty | productsHint على الهب | #39 | ✅ merged |
| Guard | قفل المسارات | #39 ثم +1 | ✅ **34/34** |
| OPEN-03 / F-SEC-01 | AuthZ وكيل PATCH = list scope | **هذه** | ▶️ |
| OPEN-05 / R2 | state machine forwarded→contacted→closed | **هذه** | ▶️ |
| Honesty | fiSuccessBody لا يدّعي ربط تلقائي بعد Verify | **هذه** | ▶️ |
| OPEN-02 | دليل شركاء حي | لاحقاً بعد D1=ج | ⏸ |
| OPEN-04 | Verify→link inbox | لاحقاً (Start) | ⏸ |
| OPEN-01 | تأكيد Replit بصري **G0** على `main ≥ 0696c66` | موازٍ | ▶️ انظر `G0-START-NOW-MOST-IMPORTANT-AR.md` |

---

## ملفات هذه الموجة (AuthZ)

- `artifacts/api-server/src/services/FinancingService.ts` — R1 branch scope + R2 transitions  
- `artifacts/api-server/src/services/FinancingService.test.ts` — اختبارات سالبة/إيجابية  
- `artifacts/banco-mobile/constants/i18n.ts` — صدق `fiSuccessBody`  
- `artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs`

---

## بعد كل دفعة

```bash
node artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs   # 34/34
# مع DATABASE_URL (docker-compose.test.yml):
# pnpm --filter @workspace/api-server exec vitest run src/services/FinancingService.test.ts
git rev-parse --short HEAD
```
