# BOOM STAY — Premium black header (mount-ready)

**Status:** Design locked for implementation · **not mounted in app yet**  
**Visual target:** [`boom-stay-header-target-mock.png`](./boom-stay-header-target-mock.png)  
**Code target:** replace rose hero in `BookingStaysApp.tsx` only  

---

## 0. Design thesis (one sentence)

A **black, brand-first header** — identity breathes in the center, search is a thin crimson pill, types are icon tabs — while every current Stay action keeps working and **hotels never appear**.

---

## 1. Signature vs silence

| Loud (one signature) | Quiet (discipline) |
|----------------------|--------------------|
| B-OOM STAY brand block (metallic red energy) | Pure black plane, no pink glass, no watermark corner |
| Crimson search stroke + active tab | Inactive tabs muted grey only |
| Generous vertical air around brand | No cards, badges, or promo chips in header |

---

## 2. Locked layout (4 bands)

```
Band A  TopBar     h ≈ 44   ← back ·············· save
Band B  Brand      h ≈ 120  centered stack (logo · tagline · powered by)
Band C  Search     h = 50   crimson pill
Band D  TypeTabs   h ≈ 56   All · Studio · Apt · Villa · Chalet
```

Horizontal inset: **16**. Safe area: `insets.top` above Band A.  
Gap A→B: **12** · B→C: **20** · C→D: **14** · D→content: **8**.

---

## 3. Color system (header scope)

| Name | Hex | Role |
|------|-----|------|
| Void | `#000000` | Header background |
| Crimson | `#B81E3C` | `STAYS_ACCENT` — border, active tab, search icons |
| Crimson flash | `#E8002D` | Press/focus optional |
| Snow | `#FFFFFF` | Back / save icons, primary readable text |
| Ash | `#8E8E93` | Placeholder, inactive tabs, tagline |
| Hairline | `rgba(255,255,255,0.16)` | Tab dividers |
| Search fill | `#000000` | Pill interior |

**Kill list:** `#650E36`, rose glass `rgba(255,255,255,0.16)` hero pills, `SectionBackdrop` inside header, absolute BANCO watermark.

---

## 4. Typography

| Role | Spec |
|------|------|
| STAY word (beside boom asset) | Inter_700Bold · 22–24 · tracking 3–4 · Snow or Crimson |
| Tagline | Inter_500Medium · 11 · Ash · centered |
| POWERED BY | Inter_500Medium · 9 · Ash · uppercase · tracking 1.2 |
| Search placeholder | Inter_400Regular · 15 · Ash |
| Search value | Inter_500Medium · 15 · Snow |
| Tab label | Inter_600SemiBold · 11 · Crimson\|Ash |

**Assets:** `boom-logo.png` (2045×769, display ~108×40) as-is · `banco-logo.png` tint Crimson/Snow under powered-by.

---

## 5. Interaction map (product-safe)

| Band | Control | Behavior (existing) | testID |
|------|---------|---------------------|--------|
| A | Back chevron | `goBack` | `stays-back` |
| A | Bookmark | `handleSaveSearch` | `stays-save-search` |
| C | Pill / input | open/commit search | `stays-search-*` |
| C | Sliders (inside pill, right) | open `FilterSheet` + badge | `stays-filter-toggle` |
| D | Type tabs | `selectStayType` | `stays-type-*` |

**Not in header:** hamburger, notification bell, Hotels.  
**Market country:** keep under header / in strip as today — not deleted.

---

## 6. Type tabs (mock look · app values)

| Visual | `propertyType` | Icon (Ionicons / Feather) |
|--------|----------------|---------------------------|
| All (active default) | `__all__` | `business` / building |
| Studio | `studio` | bed / grid |
| Apartment | `apartment` | `business` |
| Villa | `villa` | `home` |
| Chalet | `chalet` | `home` + tree-ish or snow |

Active = Crimson icon+label. Inactive = Ash. Dividers between. Horizontal scroll OK on small phones.

---

## 7. Component mount plan

```
components/search/stays/
  StaysHomeHeader.tsx       // bands A–D composition
  staysHeaderStyles.ts      // StyleSheet + tokens
```

`BookingStaysApp` → delete rose `hero` JSX/styles →  
`<StaysHomeHeader …props from existing handlers />`

Presentational only. Zero new API.

---

## 8. Motion (subtle, 2 beats)

1. Brand: opacity 0→1 + 6px rise on mount (~280ms).  
2. Search border: slight Crimson flash on focus.  
Respect `Reduce Motion` → skip rise, keep opacity.

---

## 9. Tooling readiness (implementation wave)

| Tool | Ready for |
|------|-----------|
| Expo / RN `View` `Pressable` `TextInput` | Structure |
| `expo-image` + existing logos | Brand |
| `@/components/icons` Feather/Ionicons | Actions + tabs |
| `useSafeAreaInsets` + RTL `rowDir` | Layout |
| Existing `FilterSheet` / `useSearchMiniApp` | Behavior |
| Target mock PNG in `docs/` | Visual QA |
| Boundaries: touch **only** banco-mobile stays header | Safety |

---

## 10. Acceptance checklist

- [ ] Looks like target mock (black · brand center · crimson pill · icon tabs)  
- [ ] No rose hero / no watermark clash  
- [ ] No Hotels  
- [ ] Back · save · filter · search · types all work  
- [ ] AR + EN + RTL on SE-class and Pro Max widths  
- [ ] Results / map / bottom nav untouched  

---

## 11. Go signal

Owner says **نفّذ / اركب** → implement mount in one focused PR.  
Until then: design + mock + plan only.
