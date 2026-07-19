# مرجع تشغيل الموجة الجراحية — Cursor

**فرع:** `cursor/surgical-finish-wave-4322`  
**لوحة أم:** `FULL-PICTURE-SAFE-PATH-MASTER-AR.md`  
**Banks:** `BANKS-FINANCIERS-FORENSIC-LAYERS-AR.md`  
**فهم ثابت:** التطبيق كامل · التشطيب صغير · ممنوع هدم/redesign · طبقة واحدة مسمّاة

---

## قواعد لمس الكود (كل PR صغير)

1. لا Discover ENTER · لا Stay أسود · لا iconBtn&lt;12 · لا topPad 67  
2. لا Banks directory حي بلا Start صريح «ج»  
3. لا W3 AuthZ (Claude) بلا Start «هـ»  
4. حارس `section-miniapp-guard` يبقى أخضر  
5. ملفات مشتركة FI: أعلن في handoff قبل التعديل

---

## طابور OPEN — حالة الموجة

| ID | البند | موجة | حالة |
|----|-------|------|------|
| OPEN-10 / F-ORD-05 | Profile→FI بدون `intent=fi` | **هذه** | ✅ |
| F-UX-02 | Join فوق أعضاء FI | **هذه** | ✅ |
| F-UX-01 / OPEN-09 | لا اختصار Banks من البروفايل لـ FI | **هذه** | ✅ |
| F-SEP (عرض) | FI يرى كارت «أضف إعلان» كتاجر | **هذه** | ✅ |
| Honesty | productsHint على الهب | **هذه** | ✅ |
| Guard | قفل المسارات الجديدة | **هذه** | ✅ 33/33 |
| OPEN-02 | دليل شركاء حي | لاحقاً بعد D1=ج | ⏸ |
| OPEN-03 | AuthZ وكيل PATCH | Claude W3 | ⏸ |
| OPEN-04/05 | Verify→link · state machine | لاحقاً | ⏸ |
| OPEN-01 | تأكيد Replit بصري **G0** | **الآن — الأهم** | ▶️ انظر `G0-START-NOW-MOST-IMPORTANT-AR.md` |

---

## ملفات هذه الموجة

- `artifacts/banco-mobile/app/business/banks.tsx`
- `artifacts/banco-mobile/app/(tabs)/profile.tsx`
- `artifacts/banco-mobile/constants/i18n.ts`
- `artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs` (اختبارات صدق المسار)

---

## بعد كل دفعة

```bash
node artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
git rev-parse --short HEAD
```
