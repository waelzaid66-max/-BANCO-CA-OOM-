# تسليم للوكيل الأساسي (Replit) — 2026-07-08

**CI على `main` أخضر** (بعد `eff3471` lockfile لـ `globals`). لقطة فشل PR #2 عند `38de1c0` كانت قبل هذا الإصلاح.

## SHA المعتمد

| المعنى | Commit |
|--------|--------|
| `HEAD` على `main` (origin) | `30dcb2a` |
| إصلاح ESLint `URL` + `globals.node` | مدمج PR #2 + `eff3471` |
| إصلاح SEO بعد نشر SELL | مدمج PR #1 |
| خريطة البحث `MapViewport` (`min_lat`/`max_lat`…) | على `main` في `SearchResultsMap.tsx` |

التحقق من المرآات:

```text
origin/main = 30dcb2a ✅
bbanco / bdeals / boom ← شغّل push-mirror-remotes.sh من Replit (cursor[bot] يأخذ 403)
```

## إن احتجت إعادة دفع المرآات

من Replit (حساب المالك، ليس `cursor[bot]`):

```bash
chmod +x scripts/push-mirror-remotes.sh
./scripts/push-mirror-remotes.sh
```

## ما يعمل عليه الوكيل الأساسي (خارج نطاق المزامنة)

راجع `STATUS_REPORT.md` §4 و`audit/production-readiness/OPEN-ITEMS-BACKLOG.md` — **O16** فقط مفتوح (staging smoke، جهاز، EAS).

## ملفات حُدّثت في موجة التوثيق (للمراجعة)

- `REPO_SYNC_STATUS.md` — SHA والمرآات
- `STATUS_REPORT.md` — مرجع HEAD
- `scripts/push-mirror-remotes.sh` — أداة دفع مرآات
- هذا الملف

## aws-virgen (second production repo)

Primary `main` is finalized and tagged **`v1.0.0-rc.1`**. Publish to `aws-virgen` (owner token):

```bash
chmod +x scripts/publish-aws-virgen-rc.sh
./scripts/publish-aws-virgen-rc.sh v1.0.0-rc.1
```

See [docs/AWS_VIRGEN_REPOSITORY.md](docs/AWS_VIRGEN_REPOSITORY.md).


`packageManager: pnpm@11.9.0` + أمر التثبيت السريع في `.agents/memory/banco-replit-install-env.md`.
