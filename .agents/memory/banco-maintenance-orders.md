---
name: BANCO maintenance orders (M-series) status & cancellations
description: Which of the user's "maintenance orders" are done, which remain, and which were explicitly cancelled and must NOT be reintroduced. Canonical handoff doc pointer.
---

# BANCO maintenance orders

The full, living status handoff (done / missing / broken / secrets audit / how to
publish) lives in the repo at
`artifacts/banco-mobile/docs/booking-stays-rebuild-report.md`. Read it first.

## Durable decisions (not derivable from code)

- **DONE:** M1 (Booking page redesign — hospitality "stays" hero, real rose
  section identity), M2 (every card type falls back to a section-identity
  backdrop, app-wide), M3 (Banks & Financiers = trust-blue). Also small items
  #19 (Booking Discover card real photo) and #20 (rental term tabs).
- **ONLY REMAINING order:** **M7 — redesign the shared `FilterSheet`
  (`components/search/FilterSheet.tsx`)** smaller/cleaner. It is shared by BOTH
  `BookingStaysApp.tsx` and `SectionSearchApp.tsx`, so any change must keep
  working in both.
- **CANCELLED by the user — DO NOT reintroduce or re-propose:**
  - **M4** glass/transparent bottom bar on mini-app search pages (was task #23)
  - **M5** Car Import (استيراد السيارات) end-to-end (was task #24)
  - **M6** working/evolved maps for every section (was task #25)
  **Why:** the user explicitly killed these three tasks; treat like the
  "Home has NO search bar" ban — reappearing = a regression, not a feature.

## Publish / environment reality
- Publishing is a USER action (the Publish button); the agent cannot publish, and
  native mobile binaries cannot be built from the iOS Replit app (web is fine).
- Before a real PROD launch: Clerk needs `pk_live_…` (only test keys exist), a
  production `OPENAI_API_KEY` is needed (dev modelfarm URL is dev-only), and
  Paymob sandbox creds are still missing (task #7). None block a dev preview.
