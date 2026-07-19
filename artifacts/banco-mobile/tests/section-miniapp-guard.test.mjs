// W1 regression guard — section mini-apps must stay isolated from Search-tab criteria.
//
// Prevents the Discover→shared-Search "melt" from returning:
//   1. SECTION_ROUTE map exists for car / real_estate / facilities / materials
//   2. Discover cards push those routes (router.push(SECTION_ROUTE…))
//   3. No onBrowseSection bridge that filters the Search tab in place
//   4. Stack screens for section/* remain registered in app/_layout.tsx
//
// Run: pnpm --filter @workspace/banco-mobile run test:section-guard

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.dirname(__dirname);
const DISCOVER = path.join(APP_ROOT, "components", "SearchDiscover.tsx");
const SEARCH_TAB = path.join(APP_ROOT, "app", "(tabs)", "search.tsx");
const LAYOUT = path.join(APP_ROOT, "app", "_layout.tsx");

const SECTION_SCREENS = [
  "section/car",
  "section/real-estate",
  "section/factories",
  "section/materials",
  "section/booking",
];

test("SearchDiscover keeps SECTION_ROUTE for every catalogue section", () => {
  const src = fs.readFileSync(DISCOVER, "utf8");
  assert.match(src, /const SECTION_ROUTE/);
  for (const key of ["car", "real_estate", "facilities", "materials"]) {
    assert.match(
      src,
      new RegExp(`${key}:\\s*"/section/`),
      `SECTION_ROUTE missing entry for ${key}`,
    );
  }
});

test("Discover section press pushes SECTION_ROUTE (not shared Search criteria)", () => {
  const src = fs.readFileSync(DISCOVER, "utf8");
  assert.match(src, /router\.push\(SECTION_ROUTE\[cat\]\)/);
  assert.match(src, /router\.push\(SECTION_ROUTE\.car\)/);
});

test("Discover→Search melt bridge is gone (no prop, no host helper)", () => {
  const discover = fs.readFileSync(DISCOVER, "utf8");
  const searchTab = fs.readFileSync(SEARCH_TAB, "utf8");
  // Prop / type surface on Discover (identifier in code, not prose comments).
  assert.doesNotMatch(
    discover,
    /^\s*onBrowseSection\??\s*:/m,
    "SearchDiscover Props must not declare onBrowseSection (re-melt risk)",
  );
  assert.doesNotMatch(
    searchTab,
    /onBrowseSection=\{/,
    "search.tsx must not pass onBrowseSection into Discover",
  );
  assert.doesNotMatch(
    searchTab,
    /const browseSection\s*=/,
    "search.tsx must not keep browseSection helper that mutates shared criteria",
  );
});

test("root layout still registers all section mini-app Stack screens", () => {
  const layout = fs.readFileSync(LAYOUT, "utf8");
  for (const name of SECTION_SCREENS) {
    assert.match(
      layout,
      new RegExp(`name="${name.replace("/", "\\/")}"`),
      `Stack.Screen missing for ${name}`,
    );
  }
});

test("section route files exist on disk", () => {
  for (const name of [
    "car",
    "real-estate",
    "factories",
    "materials",
    "booking",
  ]) {
    const file = path.join(APP_ROOT, "app", "section", `${name}.tsx`);
    assert.ok(fs.existsSync(file), `missing ${file}`);
  }
});

test("Search catalogue chrome is gated off Discover (MOB-05)", () => {
  const searchTab = fs.readFileSync(SEARCH_TAB, "utf8");
  assert.match(
    searchTab,
    /viewState\s*!==\s*["']discover["']/,
    "search.tsx must hide CategoryTabs/engines while Discover is showing",
  );
  assert.match(
    searchTab,
    /<CategoryTabs[\s\S]*?viewState\s*!==\s*["']discover["']|<Fragment>[\s\S]*CategoryTabs|viewState\s*!==\s*["']discover["'][\s\S]*CategoryTabs/,
    "CategoryTabs must sit behind the Discover gate",
  );
});
