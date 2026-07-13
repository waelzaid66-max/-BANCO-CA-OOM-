import type { Category } from "@workspace/taxonomy/categories";

/**
 * Per-section accent tokens — each browse category is its own "company"
 * visually, not only on Discover cards. Accents stay in the BANCO red/charcoal
 * family so publish chrome never fights brand, but active Search tabs/chips
 * shift enough that cars ≠ real-estate ≠ facilities ≠ materials.
 */
// Sharper, more saturated accents than the previous near-identical dark reds, so
// each section reads as its own space while staying in BANCO's warm red identity:
// brand red → vivid red (cars) → rose-burgundy (real estate) → burnt terracotta
// (factories) → bronze (raw materials). All keep white foreground contrast.
export const SECTION_ACCENT: Record<Category, string> = {
  all: "#B4121A",
  car: "#CC1E24",
  real_estate: "#9C1650",
  facilities: "#B0400F",
  materials: "#A8600F",
};

export function sectionAccent(category: Category | null | undefined): string {
  if (!category) return SECTION_ACCENT.all;
  return SECTION_ACCENT[category] ?? SECTION_ACCENT.all;
}

/**
 * Banks & Financiers is its own world — the ONLY section that steps outside the
 * red family, into a trust-blue. It is not a feed `Category`, so it lives here
 * as a standalone key (`SectionKey`) used by the business hub + finance surfaces.
 * A confident mid-blue that still keeps white foreground contrast.
 */
export const BANKS_ACCENT = "#1668B5";

export type SectionKey = Category | "banks" | "industrial";

/**
 * Two-stop identity gradients (accent → deeper shade of the SAME hue). These are
 * the section-indicating BACKDROP every card falls back to when a listing has no
 * photo — so a card is never a blank grey box; it always says which world it is.
 */
export const SECTION_GRADIENT: Record<SectionKey, readonly [string, string]> = {
  all: ["#B4121A", "#7E0C12"],
  car: ["#CC1E24", "#8E1519"],
  real_estate: ["#9C1650", "#650E36"],
  facilities: ["#B0400F", "#772909"],
  materials: ["#A8600F", "#71400A"],
  industrial: ["#9A4A16", "#642A0A"],
  banks: ["#1E7BD0", "#0E4C92"],
};

/**
 * The section's motif icon (Ionicons name), drawn large + faint on the backdrop
 * so the world reads instantly even with no product photo.
 */
// Names MUST exist in the custom icon registry (components/icons.tsx), which
// maps a subset of Ionicons/MaterialCommunity names to lucide SVGs. Unmapped
// names silently render the fallback warning glyph — every value here is a
// confirmed-mapped name.
export const SECTION_MOTIF: Record<SectionKey, string> = {
  all: "grid",
  car: "car",
  real_estate: "home",
  facilities: "business",
  materials: "package",
  industrial: "cog",
  banks: "credit-card",
};

export function sectionGradient(key: string | null | undefined): readonly [string, string] {
  if (!key) return SECTION_GRADIENT.all;
  return SECTION_GRADIENT[key as SectionKey] ?? SECTION_GRADIENT.all;
}

export function sectionMotif(key: string | null | undefined): string {
  if (!key) return SECTION_MOTIF.all;
  return SECTION_MOTIF[key as SectionKey] ?? SECTION_MOTIF.all;
}
