# حزمة تسليم فورية — وكيل Cursor على اللابتوب (مساعد للموجة N0/N1)

**من:** Cloud agent على `-BANCO-CA-OOM-`  
**إلى:** وكيل Cursor Desktop / Laptop (الثانوي)  
**وقت:** 2026-07-21 · **قبل القراءة اسحب `main`**

---

## 0) أوامر مزامنة إلزامية أولاً

```bash
cd "$(git rev-parse --show-toplevel)"
git fetch origin
git checkout main
git pull --ff-only origin main
git log -1 --oneline
# المتوقع: 9bcea44 أو أحدث
```

```bash
node scripts/chain-integrity-gate.mjs
# يجب 28/28 PASS
node --test artifacts/banco-mobile/tests/lib-hardening.test.mjs
node --test artifacts/banco-mobile/tests/section-miniapp-guard.test.mjs
node --test artifacts/banco-mobile/tests/mobile-resilience.test.mjs
```

**لو gate أحمر: قف. لا إصلاحات منتج.**

---

## 1) الوثائق المرجعية

1. `audit/NEXT-WAVE-FULL-SYSTEM-STUDY-BEFORE-EXECUTION-2026-07-21-AR.md`  
2. `audit/N0-BASELINE-AND-N1-UPLOAD-HYGIENE-2026-07-21-AR.md`  
3. `audit/N1-2-PUSH-DEEPLINK-STUDY-AND-HARDENING-2026-07-21-AR.md`  
4. `audit/ACCOUNTS-COMPLETE-GAPS-S1-S2-S4-2026-07-21-AR.md`  
5. هذا الملف

---

## 2) دورك (مساعد — ليس redesign)

| اعمل | لا تعمل |
|------|---------|
| تأكيد gate أخضر محلياً | دمج فرع booking-notif الضخم |
| QA يدوي N0 | لمس Stay/Cars/SECTION_ROUTE |
| Ops trace رفع إن فشل | إحياء ListingMediaEditor دون أمر |
| **N1.2 ASB push proof** | اختراع Presence/Facebook/auto-FI |
| تقرير بـ request-id / token | تعطيل chain gate · «إصلاح» Expo Go |

---

## 3) بروتوكول قبل/بعد أي تغيير

**قبل:** الأوامر الأربعة خضر + فرضية سطر واحد  
**بعد:** نفس الأوامر + smoke المسار + لا لمس حسابات/شرائط/Discover

---

## 4) N0 + N1.1 (Cloud مكتمل)

Upload update→503 · حسابات S1/S2/S4 · gates خضر

### QA يدوي N0
- [ ] Profile ⋯ · Skip · هاتف  
- [ ] FI → Banks awaiting إن بلا ربط  
- [ ] Stay 30×30 + car strip · Discover ENTER  
- [ ] رفع صورة إنشاء إعلان  

---

## 5) N1.2 Push — مصدر مكتمل + إثباتك على ASB

**مصدر (9bcea44):** chokepoint · Expo Go guard · shared router · message `listingId`  
حراسات: `P-push-service|chokepoint|expo-go-guard|routing-shared`

**ASB/dev client فقط (ليس Expo Go):**
1. إذن إشعارات → تسجيل توكن  
2. رسالة اختبار → tap دافئ + cold-start → `/messages/[id]`  
3. booking guest/host · billing · financing→banks  
4. سجّل منفصل: in-app / lock-screen / email  

---

## 6) التالي

N1.3 طابور ربط FI أدمن (مراقبة) · ثم N2 قسم واحد بأمر المالك

---

**ردك:** `SYNC_SHA=…` · `GATE=28/28` · `QA_N0=…` · `PUSH_ASB=pass|fail|expo-go-skip`
