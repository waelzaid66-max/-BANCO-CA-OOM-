# BANCO — Booking & Stays Review + Maintenance Orders

_Updated: 2026-07-13 · Scope: `artifacts/banco-mobile` (+ notes on api-server & secrets)._

This is the honest status handoff. It records **corrected understanding**, an
**inventory** (done / not done / broken), the **secrets audit** (with reasons),
and the **maintenance orders** (gaps written as commands, pending your approval).
Nothing here is hidden.

---

## 0. Corrected understanding (where I was wrong)

1. **The light-blue colour belongs to the Banks & Financiers section — NOT to
   Booking.** It was an alternative accent for the *Banks & Financiers* world
   (`/business/banks`) from an earlier request that was never finished. I wrongly
   applied a navy/blue to the Booking cards. → Blue is now removed from Booking
   (correct). Giving Banks & Financiers its proper blue identity is still an
   **open gap** (see Order M3).
2. **Every card — not only the 4 main Discover cards — should carry an
   expressive background that indicates its section**, in the spirit of the 4
   main Discover cards (no logos; identity via colour + a section-telling
   backdrop). I initially thought only the 4 main cards get this. → StayCard now
   does it, but the rule is **app-wide** across card types (open gap, Order M2).
3. **Booking = residential & furnished RENTAL, never hotels.** (I had this right;
   confirming it explicitly.)
4. **The B reaction has two layers and both must exist** (confirmed working now):
   - single tap = like/save → B turns accent-red, reaches the owner/notifications;
   - long-press = menu with **Potential** (interested affinity) and **not-for-me**.
5. **The Booking page must be genuinely redesigned, not ported.** Reusing the old
   section-search UI carried its old problems (card size/shape, spacing, tall
   search chrome). This is the core open gap (Order M1).

---

## 1. Inventory — DONE (this task, #22)

- **StayCard** (`components/StayCard.tsx`): removed the blue accent → uses the
  real-estate identity accent; photo-forward card (real unit photo as the
  section-indicating background + scrim + overlaid title/location); honest
  `price_display` (verbatim, no client math); **B reaction restored to full
  parity with SmartAssetCard** (tap = save, long-press = Potential/not-for-me);
  bookable ribbon, sponsored badge, share.
- **BookingStaysApp** (`components/search/BookingStaysApp.tsx`): removed the
  always-visible text search rectangle → **tap-to-open search icon** that
  collapses after use; **market-country picker merged inline** with the term
  tabs, smaller/balanced; filters are icon buttons; rental-term tabs are the
  primary segmentation (this subsumes the separate "term chips" request).
- Detail screen `BookingCard` reserve flow still gated on `furnished_daily`;
  `?focus=booking` deep-scroll intact.
- i18n keys present (en + ar). `tsc --noEmit` clean except the pre-existing,
  unrelated `app/(tabs)/profile.tsx` error (tracked separately as compile task).
- No feature deleted; publishing / BANCO Market / the rest of the system untouched.

## 2. Inventory — NOT DONE / needs real work (open gaps)

- **M1 — Booking page true redesign.** It still sits on the old section-search
  foundation. Needs a purpose-built stays layout (correct card proportions,
  spacing, empty/loading states) — a real redesign, not the old UI.
- **M2 — Expressive section backgrounds for ALL card types**, app-wide (not just
  StayCard), following the 4-main-Discover-cards idea; colour + section-telling
  backdrop, no logos.
- **M3 — Banks & Financiers identity** (the unfinished blue-accent request):
  give that section its blue accent + expressive backgrounds.
- **M4 — Glass bottom bar on mini-app search pages** (proposed task #23): keep
  the bottom bar visible but transparent/frosted inside the search area.
- **M5 — Car Import (استيراد السيارات) end-to-end** (proposed task #24).
- **M6 — Maps functional & evolved across every section** (proposed task #25).
- **M7 — Filters redesign** beyond the search box (the FilterSheet itself), so it
  is smaller/cleaner and works correctly in every section.

## 3. Inventory — BROKEN (found; reasons only, not yet fixed)

- **Weekly dealer report emails crash.** `api-server` throws
  `Cannot convert argument to a ByteString … value 1575` in `EmailService.ts`.
  **Reason:** Arabic text is placed into an email/HTTP header (e.g. Subject)
  without RFC-2047 encoding; headers must be Latin-1/ASCII.
- **Paymob checkout cannot be tested.** **Reason:** `PAYMOB_MODE=sandbox` is set
  but no Paymob API/secret/HMAC credentials exist (see §4). (Task #7.)
- **AI features depend on a dev-only endpoint.** `AI_INTEGRATIONS_OPENAI_BASE_URL`
  points at `localhost:1106/modelfarm/...`. **Reason:** the managed-AI sidecar is
  dev-only and is not reachable in a published deployment; a production fallback
  (own `OPENAI_API_KEY`) is needed for any AI-dependent feature in prod.
- **Clerk is on a TEST instance** (`pk_test_…`). **Reason:** dev Clerk keys;
  publishing to production needs a Clerk **production** instance (`pk_live_…`).

## 4. Secrets audit (existence only — values never shown)

**Present & OK:** `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (test),
`VITE_CLERK_PUBLISHABLE_KEY` (test), `RESEND_API_KEY`, `SESSION_SECRET`,
`EXPO_TOKEN`, `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`,
`PUBLIC_OBJECT_SEARCH_PATHS`, `ADMIN_EMAILS`, `PAYMOB_MODE=sandbox`.

**Missing / needs attention:**
- **Paymob sandbox credentials** — none present (no API key / secret / HMAC).
  Reason: never provided → checkout untestable.
- **Clerk production keys** (`pk_live_…` / matching secret) — only test keys
  exist. Reason: needed for production publish, not for dev.
- **Production AI key** (own `OPENAI_API_KEY`) — absent. Reason: the dev modelfarm
  URL won't work in production.
- `CLERK_PROXY_URL` is empty (referenced by the Expo workflow). Likely optional;
  flag only.

_No secret values were read or printed._

---

## 5. Maintenance orders — pending your approval

Approve these (all, or pick a priority order) and I will execute them one by one.
The three cross-cutting ones are already filed as project tasks; the rest are
listed here as orders to file/execute on your go-ahead.

| # | Order | Filed as |
|---|-------|----------|
| M1 | Redesign the Booking (furnished/residential rental) page from scratch — correct card proportions, spacing, states; not the old UI | to file on approval |
| M2 | Give every card type an expressive, section-indicating background app-wide | to file on approval |
| M3 | Finish the Banks & Financiers blue identity (accent + backgrounds) | to file on approval |
| M4 | Glass/transparent bottom bar on mini-app search pages | task #23 |
| M5 | Car Import end-to-end | task #24 |
| M6 | Working, evolved maps for every section | task #25 |
| M7 | Redesign the filters sheet (smaller, cleaner, works everywhere) | to file on approval |
| B1 | Fix Arabic-header crash in weekly report emails (`EmailService.ts`) | to file on approval |
| B2 | Add Paymob sandbox credentials | task #7 |

**Rule for all orders:** no random/partial execution, delete no existing
feature, hide no problem, never block publishing (BANCO Market or elsewhere),
and keep each section conceptually separate and self-evident.
