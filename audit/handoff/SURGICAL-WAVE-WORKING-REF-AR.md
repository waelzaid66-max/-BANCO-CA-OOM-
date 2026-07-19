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
| Guard | قفل المسارات | #39 ثم AuthZ | ✅ **35/35** |
| OPEN-03 / F-SEC-01 | AuthZ وكيل PATCH = list scope | **#40** | ✅ |
| OPEN-05 / R2 | state machine forwarded→contacted→closed | **#40** | ✅ |
| Honesty | fiSuccessBody لا يدّعي ربط تلقائي بعد Verify | **#40** | ✅ |
| F-SEC-05 | رفض forward لوسيط inactive | **#40** | ✅ |
| F-SEC-07 | منع مسح documents عند إعادة حفظ business | **#40** | ✅ |
| F-SEC-03 | owner يجب أن يكون `financial_institution` | **#40** | ✅ |
| F-UX-03 | خطأ شبكة inbox ≠ «لست عضواً» | **#40** | ✅ |
| OPEN-02 | دليل شركاء حي | لاحقاً بعد D1=ج | ⏸ |
| OPEN-04 | Verify→link inbox | لاحقاً (Start) | ⏸ |
| OPEN-01 | تأكيد Replit بصري **G0** على `main ≥ 0696c66` | موازٍ | ▶️ انظر `G0-START-NOW-MOST-IMPORTANT-AR.md` |

---

## ملفات هذه الموجة (#40)

- `artifacts/api-server/src/services/FinancingService.ts` — R1/R2 + F-SEC-05/03  
- `artifacts/api-server/src/services/FinancingService.test.ts`  
- `artifacts/api-server/src/lib/mergeBusinessCompanyDetails.ts` (+ test) — F-SEC-07  
- `artifacts/api-server/src/services/UserService.ts` — merge docs  
- `artifacts/banco-mobile/app/business/banks.tsx` — F-UX-03  
- `artifacts/banco-mobile/constants/i18n.ts`  
- `artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs`

**لم يُمس (متعمد):** F-SEC-04 فرض دور على seat — تصميم المقاعد = حساب marketplace عادي  
**موقوف بلا Start:** OPEN-02 دليل حي · OPEN-04 Verify→link · نقل آمن

---

## بعد كل دفعة

```bash
node artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs   # 35/35
# مع DATABASE_URL (docker-compose.test.yml):
# pnpm --filter @workspace/api-server exec vitest run src/services/FinancingService.test.ts src/lib/mergeBusinessCompanyDetails.test.ts
git rev-parse --short HEAD
```
