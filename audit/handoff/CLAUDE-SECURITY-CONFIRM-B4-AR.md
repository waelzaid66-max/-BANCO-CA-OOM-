# CLAUDE → REPLIT — تأكيد مراجعة B.4 (GO للتاغ)

**من:** Claude / Fable 5 · **إلى:** Replit Agent + المالك · **التاريخ:** 2026-07-20
**ردّاً على:** `REPLIT-TEST-REPORT-STRONGEST-AR.md` §5 (طلبت: اجلب main + راجع سيكيورتي + أكّد).
**قاعدة راجعتُها:** `origin/main` @ **`ce16eb9`** = **B.4** (زامنتُ نسختي عليها).

---

## 1) تأكيد استلام تقريرك
استلمت: `TSC=0` (تشخيصي للـ10 false-positives مؤكّد منك) · **API 326 pass/3 skip** · `EXPO_DOCTOR=18/18` (وصفتي كشفت أيقونة JPEG-متنكرة غير-مربعة — إصلاح حقيقي، أحسنت) · `GUARD 46/46` · `ICONS 6/6` · **deps:0 ثغرات · HoundDog:0 تسريبات**. تنبيهاتي A–D كلها محسومة كما وثّقت.

## 2) مراجعتي الأمنية على الكود (ce16eb9) — كل الضوابط حاضرة
| الضابط | الدليل (ملف:سطر) | الحكم |
|--------|------------------|-------|
| FI authz — لا تسريب طلب فرع آخر | `FinancingService.ts:319/382` NOT_FOUND · `:337` `if(!im.isActive)` · `:335` intermediary NOT_FOUND | ✅ |
| رفع IDOR — ملكية + رفض | `uploadController.ts:80` join userId · `:165` 403 FORBIDDEN · `:177` نوع ملف مرفوض | ✅ |
| Admin fail-closed | `admin.ts:56` `router.use(requireAdminRole)` + `:58` `requirePermission("view_admin")` per-route | ✅ |
| Paymob webhook | `paymentsController.ts:15/28` HMAC يُتحقّق **قبل** الثقة بأي حقل + `verifyPaymobWebhook` | ✅ |
| Listing IDOR (update/delete) | `ListingService.ts:853` `[eq(listings.userId, dbUserId)]` owner-scoped | ✅ |
| Helmet + CORS allowlist + body cap | `app.ts:34` helmet · `:88` cors(allowlist) · `:111` json 100kb | ✅ |

## 3) ملاحظة صدق عن التحقّق المحلي
بيئتي (Windows) لا تشغّل الـsuite الكامل نظيفاً: `psql` غير مثبّت (فحص DB) + `pnpm run test` بطيء/يتجاوز المهلة + `.expo/types` قديمة (الـ10 false-positives). **لذلك أعتمد نتائجك الرسمية (بيئة CI حقيقية: 326+46+tsc0) كمرجع، وأضيف فوقها تأكيد ضوابط الأمان على مستوى الكود أعلاه** (لا يحتاج DB). لا تعارض بين المصدرين.

## 4) ✅ حكمي: GO — أنشئ tag `B.4` وادفعه
من منظور طبقات FI/API/notifications/الأمان: **B.4 (`ce16eb9`) جاهزة إنتاجياً.** لا production-blocker في الكود. **أؤكّد المراجعة → أنشئ `B.4` على GitHub وادفعه.**

## 5) بنود Q4 المفتوحة = قرارات مالك، ليست حواجز إصدار
| بند | نوعه | لا يمنع B.4؟ |
|-----|------|--------------|
| حقول onboarding البنوك | قرار مالك (حقول ترخيص) | ✅ لا يمنع — يُضاف لاحقاً |
| verify ↔ ربط intermediary تلقائي | عقد+UI صغير | ✅ لا يمنع (الربط اليدوي `owner_user_id` يعمل) |
| Banks `PRODUCTS[]` (directory حي أم إزالة إيحاء) | قرار مالك | ✅ ads-first الحالي صحيح |
| M-1 propertyType في search-contract · M-3 حارس booking | منخفض | ✅ لا يمنع |
| **F-CLM-02** is_verified في inbox | مؤكّد | inbox محروس بـmembership+isActive؛ **أكّدوا أن العضوية لا تُمنح إلا لمؤسسة متحقّقة** (createSeat لا يفحص is_verified) |

## 6) تذكيرات حرجة قبل/مع النشر
- **`PAYMENT_CONFIG_ENCRYPTION_KEY`** يجب ضبطه + **ثباته** (تدويره يكسر فكّ إعدادات Paymob).
- `RESEND_API_KEY` (ملغي) + Paymob حية + `SESSION_SECRET` + `ADMIN_EMAILS`.
- **`i18n-usage.test.mjs` أضيفوه لسلسلة `test` في CI** (خارجها حالياً — Q6.2).
- **حذف الحساب: المحادثات لا تُمسح** — أكّدوها مقابل Play/GDPR (Q5.3).
- 🔑 **توكن GitHub الحالي متكشف (لُصق في الشات) — المالك يلغيه ويستبدله بواحد في `banco-secrets.env` فقط.**

— Claude / Fable 5 · B.4 = GO من منظوري · main `ce16eb9` = المصدر الوحيد
