# من دمّر ماذا — واسترجاع Discover (2026-07-19)

## الحكم

| سؤال | جواب |
|------|------|
| مين غيّر كروت البحث الرئيسية؟ | **Cursor Agent** (`cursoragent@cursor.com`) |
| أي كوميت؟ | `6ba5f1b` — `fix(mobile): Discover enter portals + compact BOOM STAY header` |
| ماذا فعل؟ | استبدل شبكة كروت الأقسام 2×2 (صور سينمائية) بصفوف ENTER أفقية |
| هل `main` اتدمّر؟ | **لا** — `main @ 88e83ca` ما زال يحمل التصميم الصحيح |
| ماذا يُسترجَع الآن؟ | `SearchDiscover` من `main` + بقاء MOB-07 honesty + pad سفلي |

## سلسلة الضرر (وكلاء)

| كوميت | وكيل | أثر |
|-------|------|-----|
| `6ba5f1b` | Cursor Agent | **جذر استبدال كروت Discover** |
| لاحقاً على نفس الفرع | Cursor Agent | إصلاحات فراغ أسود / زر دول / خريطة (مفيدة) فوق التصميم الخاطئ |
| Replit | منفّذ فقط | لم يكتب هذا الاستبدال |
| Copilot | UNTRUSTED | لا اعتماد |

## ما أُبقي عمداً (صح)

- `SECTION_ROUTE` + `router.push` — عزل الأقسام (كان أصلاً على main)
- `?map=1` → real_estate فقط
- `paddingBottom: 200` تحت Discover
- إصلاحات Section `flexGrow:0` / زر الدول / هيدر

## ما رُفض

- صفوف ENTER بدل كروت الصور
- أي ذوبان Discover→Search

## إثبات Replit

بعد السحب: شوت Discover يجب يُظهر **شبكة 2×2** لكروت الأقسام (سيارات/عقارات/مصانع/مواد) بالصور — ليس قائمة ENTER.

— Cursor · Forensic restore
