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
