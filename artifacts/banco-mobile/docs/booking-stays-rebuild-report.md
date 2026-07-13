# Booking & Stays Rebuild — Status Report

_Last updated: 2026-07-13. Scope: `artifacts/banco-mobile` (BANCO Mobile). Task #22._

This document is the running record for the Booking & Stays ("الإيجار / بوكينج")
section rebuild — what was built, what was fixed after the user's design
corrections, the honest constraints, and the outstanding maintenance requests
that are being handled as separate follow-up tasks. It is written to be handed
off to any developer (or agent) picking this up.

---

## 1. What Booking & Stays IS (the essence — do not drift)

Booking & Stays is **NOT hotels**. It is the **residential rental** world:
furnished / rent housing. Under the hood it is the Real-Estate section filtered
to `offer_type = rent` (engine locked to `rent`), with the market's real rental
taxonomy as the primary segmentation. It exists to connect people to places to
live — that is the product's purpose.

- The section wears **Real-Estate's identity**, not a foreign colour. Accent =
  `sectionAccent("real_estate")` (a rose-burgundy in the BANCO family). There is
  **no blue** anywhere in this section anymore.
- Rental taxonomy values (real, from the taxonomy package): `furnished_daily`,
  `new_law`, `old_law`, `annual_contract`. Egypt demo data uses
  furnished_daily / new_law / old_law only.
- Only `furnished_daily` units are **bookable** (they get the "bookable now"
  ribbon and the `BookingCard` reserve flow on the detail screen). Everything
  else is a contact-the-owner rental. This gate lives in `app/listing/[id].tsx`.
- **Honesty rule:** the card renders `item.price_display` verbatim. The BFF
  already bakes the per-term suffix ("/يوم" etc.) into that string. No
  client-side price math, ever.

## 2. What was built

- **`components/StayCard.tsx`** — a Booking.com-style, photo-forward stay card.
  The unit's real photo is the full-bleed background (a section-indicating
  visual, exactly like the four main Discover section cards), under a bottom
  scrim that carries the title + location in white. Bookable ribbon, sponsored
  badge, share, and the identity-B reaction sit over the photo; trust signal +
  honest price + reserve affordance sit in a compact strip below.
- **`components/search/BookingStaysApp.tsx`** — the section mini-app. Locks
  category=real_estate + engine=rent, makes the market's rental-term tabs the
  primary segmentation, and reuses the proven mini-app machinery (baseline-delta
  dirty/exit-confirm, market hydration, pull-to-refresh, infinite scroll, map,
  near-me, autocomplete). No backend changes.
- **`components/search/SearchResultsSurface.tsx`** — accepts an optional
  `CardComponent` so the booking surface renders `StayCard`s.
- **`app/section/booking.tsx`** — renders `<BookingStaysApp />`.

## 3. Design corrections applied (from user feedback)

1. **No blue cards.** The earlier navy `BOOKING_ACCENT (#0A2840)` was removed
   everywhere in the section and replaced with `STAYS_ACCENT` =
   `sectionAccent("real_estate")`. Cards now lead with a **real photo
   background that indicates the section/unit**, matching the four main search
   section cards — not a flat colour.
2. **Reaction feature restored to full parity.** The new StayCard had gutted the
   identity-B reaction (dead `onAngry`, a hardcoded heart icon, dropped affinity
   signal). It is now wired **identically to `SmartAssetCard`**:
   - Tap on B = save (turns the B accent-red; reaches the owner).
   - Long-press opens the menu: **Potential** (save + `interested` affinity
     signal) and **not-for-me** (`angry` affinity signal), via
     `sendBehaviorSignal`.
   - Section-aware save glyph (a key for residences), `potentialFlash` visual.
   No feature is dropped versus the feed card.
3. **Search chrome slimmed.** The always-visible "Where to?" text rectangle is
   gone. Search is now a **tap-to-open icon** in the header that reveals a
   collapsible input (auto-focus; submit/clear collapses it). Save-search and
   filters are icon buttons too. The market-country picker is now an **inline
   compact chip** sitting on the same row as the primary term tabs — smaller and
   balanced.

## 4. Verified / intact (nothing broken)

- `npx tsc --noEmit` is clean (excluding the pre-existing, unrelated
  `app/(tabs)/profile.tsx` error tracked under Task #18).
- The `furnished_daily` → `BookingCard` gate on the detail screen is intact, as
  is the `?focus=booking` deep-scroll.
- i18n keys used by the section exist in both `en` and `ar`
  (`home.categories.booking`, `search.discover.section.bookingSub`, `staysWhere`,
  `staysAll`, `staysBookable`, `staysMap`, `staysList`).
- Publishing (النشر), BANCO Market (dealer-os), and the rest of the system are
  untouched — this work is additive to the mobile Search surface only.

## 5. Honest constraints (read before "fixing" these)

- **No backend changes** were made for this task. Reactions ride the existing
  `sendBehaviorSignal` (adaptive-feed affinity) + the existing saves system. The
  "reaches the owner / notifications" behaviour is whatever those existing
  systems already do — no new notification backend was invented.
- The seed is **non-idempotent**; demo rental term/price data is patched via SQL
  on the live DB, never by re-running the seed.
- Term tabs are intentionally thin for the demo (Egypt: furnished_daily=2,
  new_law=2, old_law=1; the 10 dealer rentals carry no term and appear only
  under "All"). This is honest, not a bug.

## 6. Outstanding maintenance requests (tracked as follow-up tasks)

These were raised by the user as part of "complete every section properly." They
are **larger, cross-cutting** efforts and are proposed as separate tasks rather
than bundled here:

- **Booking & Stays Discover card photo** — give the 5th (Booking) Discover card
  a real photo background like the other four (currently still a gradient).
- **Glassy bottom tab bar on search/mini-app pages** — instead of hiding the tab
  bar on section search pages, give it a transparent/glass treatment within the
  search area.
- **Car Import (استيراد السيارات) end-to-end** — complete the flow smartly.
- **Map features** — make every section's map genuinely functional and enhance it.
- **Per-section standalone polish** — ensure each section stands on its own.

See the project task list for the live status of each.
