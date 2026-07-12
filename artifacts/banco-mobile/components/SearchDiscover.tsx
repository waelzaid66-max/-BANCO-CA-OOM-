import { Feather } from "@/components/icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/components/AppText";
import { Category, CategoryIcon } from "@/components/CategoryTabs";
import { CompanyOffers } from "@/components/search/CompanyOffers";
import { type CarBrand } from "@/constants/cars";
import { useI18n } from "@/context/LanguageContext";
import { type SavedSearch } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";
import type { FeedItem } from "@workspace/api-client-react";

// ─── Architecture ────────────────────────────────────────────────────────────
//
// SearchDiscover is the clean directory of BANCO's distinct product portals.
// Every card is a separate division / sub-app with its own catalogue, search
// engine, and data source. Nothing is mixed: clicking Cars enters the Cars
// world; Real Estate enters its own world, etc.
//
// Marketplace sections (5 cards):
//   Cars  |  Real Estate  |  Factories  |  Materials  |  Booking & Stays
//
// B2B Business Hub (3 portal CTAs — separate from the marketplace):
//   Global Supply Portal  |  Global Importers  |  Banks & Financiers
//
// CompanyOffers (company directory — below the hub)
//
// ─── What is intentionally NOT here ─────────────────────────────────────────
//   • Popular car brands chips   → belong inside the Cars section UI
//   • Trending / Recently viewed → belong in the Feed (Home tab)
//   • Saved / Recent searches    → belong in the Search results chrome
//   • Car-import CTA             → is a Cars-section filter, not a top-level portal
//   • Explore on map CTA         → is an inline affordance inside Real Estate
//
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS: Category[] = ["car", "real_estate", "facilities", "materials"];

// Each marketplace section opens its own dedicated full-screen mini-app page —
// a complete search engine scoped to only that category. Tapping a card pushes
// into that world (no inline expansion, no shared Search-tab state to bleed).
const SECTION_ROUTE: Record<Category, string> = {
  all: "/section/car",
  car: "/section/car",
  real_estate: "/section/real-estate",
  facilities: "/section/factories",
  materials: "/section/materials",
};

const SECTION_GRADIENT: Record<Category, [string, string]> = {
  all: ["#7A0C12", "#1C0507"],
  car: ["#8A0E14", "#1C0507"],
  real_estate: ["#5A0A2A", "#190509"],
  facilities: ["#6A1410", "#140505"],
  materials: ["#7A2A0C", "#160805"],
};

const SECTION_PHOTO: Partial<Record<Category, number>> = {
  car: require("../assets/images/categories/car.jpg"),
  real_estate: require("../assets/images/categories/real_estate.jpg"),
  facilities: require("../assets/images/categories/facilities.jpg"),
  materials: require("../assets/images/categories/materials.jpg"),
};

const BANCO_WATERMARK = require("../assets/images/banco-logo.png");

interface Props {
  // ── Legacy props — all optional so the parent call-site needs no changes ──
  // Section cards now navigate into dedicated section pages (router.push), so
  // these inline-browse callbacks are no longer used by SearchDiscover.
  onBrowseSection?: (cat: Category, engine: string) => void;
  onBrowseBrand?: (brand: CarBrand) => void;
  onApplySaved?: (s: SavedSearch) => void;
  onOpenListing?: (item: FeedItem) => void;
  onExploreMap?: (section: Category) => void;
  onSearchQuery?: (q: string) => void;
}

export function SearchDiscover(_props: Props) {
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const handleSectionPress = (cat: Category) => {
    router.push(SECTION_ROUTE[cat] as never);
  };

  const SectionHeader = ({
    label,
    top = 22,
  }: {
    label: string;
    top?: number;
  }) => (
    <AppText
      style={[
        styles.sectionTitle,
        { color: colors.foreground, textAlign, marginTop: top },
      ]}
    >
      {label}
    </AppText>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── Marketplace section cards ────────────────────────────────────────
          Each card is a distinct catalogue / sub-app. Tapping a card opens that
          section's dedicated full-screen search page. */}
      <SectionHeader label={t("search.discover.sections")} top={14} />

      <View style={styles.sectionGrid}>
        {SECTIONS.map((cat) => {
          return (
            <Pressable
              key={cat}
              onPress={() => handleSectionPress(cat)}
              style={styles.sectionCardWrap}
              testID={`section-card-${cat}`}
            >
              <View
                style={[
                  styles.sectionCard,
                  { backgroundColor: SECTION_GRADIENT[cat][1] },
                ]}
              >
                <Image
                  source={SECTION_PHOTO[cat]}
                  style={styles.sectionPhoto}
                  contentFit="cover"
                  transition={220}
                />
                <LinearGradient
                  colors={[
                    "rgba(12,4,5,0.10)",
                    "rgba(12,4,5,0.46)",
                    "rgba(12,4,5,0.88)",
                  ]}
                  locations={[0, 0.55, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.sectionScrim}
                />
                <View
                  pointerEvents="none"
                  style={styles.sectionWatermarkWrap}
                >
                  <Image
                    source={BANCO_WATERMARK}
                    style={styles.sectionWatermark}
                    contentFit="contain"
                    tintColor="#FFFFFF"
                  />
                </View>
                <View style={styles.sectionBadge}>
                  <CategoryIcon category={cat} color="#FFFFFF" />
                </View>
                <View
                  style={[
                    styles.sectionLabelRow,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <View
                    style={[
                      styles.sectionAccent,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                  <AppText style={[styles.sectionLabel, { textAlign }]}>
                    {t(`home.categories.${cat}`)}
                  </AppText>
                </View>
                <Feather
                  name={isRTL ? "chevron-left" : "chevron-right"}
                  size={16}
                  color="rgba(255,255,255,0.92)"
                  style={[
                    styles.sectionChevron,
                    isRTL ? { left: 12 } : { right: 12 },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ── 5th portal: Booking & Stays ──────────────────────────────────────
          Full-width — visually distinct from the 2×2 grid; opens the dedicated
          Booking & Stays page (real_estate + offer_type=rent, engine locked). */}
      <Pressable
        onPress={() => router.push("/section/booking")}
        style={styles.bookingCardWrap}
        testID="section-card-booking"
      >
        <LinearGradient
          colors={["#0A2840", "#040D14"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bookingCard}
        >
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.sectionWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.bookingCardRow, { flexDirection: rowDir }]}>
            <View
              style={[
                styles.sectionBadge,
                {
                  backgroundColor: "rgba(26,127,219,0.25)",
                  borderColor: "rgba(26,127,219,0.45)",
                },
              ]}
            >
              <Feather name="calendar" size={20} color="#5AB4FF" />
            </View>
            <View style={styles.bookingCardText}>
              <AppText
                style={[styles.sectionLabel, { textAlign, fontSize: 17 }]}
              >
                {t("home.categories.booking")}
              </AppText>
              <AppText style={[styles.bookingCardSub, { textAlign }]}>
                {t("search.discover.bookingHubSub")}
              </AppText>
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color="rgba(255,255,255,0.8)"
            />
          </View>
        </LinearGradient>
      </Pressable>

      {/* ── Divider between marketplace portals and B2B hub ─────────────── */}
      <View style={styles.hubDivider}>
        <View
          style={[styles.hubDividerLine, { backgroundColor: colors.border }]}
        />
        <AppText
          style={[styles.hubDividerLabel, { color: colors.mutedForeground }]}
        >
          {isRTL ? "الأعمال والشركات" : "Business & B2B"}
        </AppText>
        <View
          style={[styles.hubDividerLine, { backgroundColor: colors.border }]}
        />
      </View>

      {/* ── Business Hub CTAs ─────────────────────────────────────────────
          Three separate B2B portals — each routes to its own dedicated app.
          These are NOT marketplace filters; they're distinct business systems. */}
      <SectionHeader label={t("search.discover.businessHub")} top={0} />

      {/* 1 — Global Supply Portal */}
      <Pressable
        onPress={() => router.push("/business/supply-hub")}
        style={styles.hubCardWrap}
        testID="discover-supply-portal"
      >
        <LinearGradient
          colors={["#3A0A10", "#120406"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCard}
        >
          <View style={[styles.hubCardRow, { flexDirection: rowDir }]}>
            <View style={[styles.hubBadge, { backgroundColor: colors.primary }]}>
              <Feather name="globe" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.hubCardText}>
              <AppText style={[styles.hubTitle, { textAlign }]}>
                {t("search.discover.supplyPortal")}
              </AppText>
              <AppText style={[styles.hubSub, { textAlign }]}>
                {t("search.discover.supplyPortalSub")}
              </AppText>
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </View>
        </LinearGradient>
      </Pressable>

      {/* 2 — Global Supply & Importers */}
      <Pressable
        onPress={() => router.push("/business/global-supply")}
        style={styles.hubCardWrap}
        testID="discover-importers-hub"
      >
        <LinearGradient
          colors={["#0D1F30", "#060C14"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCard}
        >
          <View style={[styles.hubCardRow, { flexDirection: rowDir }]}>
            <View style={[styles.hubBadge, { backgroundColor: "#1A5FAD" }]}>
              <Feather name="package" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.hubCardText}>
              <AppText style={[styles.hubTitle, { textAlign }]}>
                {t("search.discover.importersHub")}
              </AppText>
              <AppText style={[styles.hubSub, { textAlign }]}>
                {t("search.discover.importersHubSub")}
              </AppText>
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </View>
        </LinearGradient>
      </Pressable>

      {/* 3 — Banks & Financiers */}
      <Pressable
        onPress={() => router.push("/business/banks")}
        style={styles.hubCardWrap}
        testID="discover-banks-hub"
      >
        <LinearGradient
          colors={["#1A1200", "#0A0800"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCard}
        >
          <View style={[styles.hubCardRow, { flexDirection: rowDir }]}>
            <View style={[styles.hubBadge, { backgroundColor: "#C9A84C" }]}>
              <Feather name="credit-card" size={20} color="#000000" />
            </View>
            <View style={styles.hubCardText}>
              <AppText style={[styles.hubTitle, { textAlign }]}>
                {t("search.discover.banksHub")}
              </AppText>
              <AppText style={[styles.hubSub, { textAlign }]}>
                {t("search.discover.banksHubSub")}
              </AppText>
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color="rgba(255,255,255,0.7)"
            />
          </View>
        </LinearGradient>
      </Pressable>

      {/* Company directory */}
      <CompanyOffers />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 120 },

  // ── Section header ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginHorizontal: 16,
    marginBottom: 12,
  },

  // ── 2×2 marketplace grid ──────────────────────────────────────────────────
  sectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionCardWrap: {
    width: "47%",
    maxWidth: "47%",
    flexGrow: 0,
    flexBasis: "47%",
  },
  sectionCard: {
    height: 118,
    borderRadius: 20,
    overflow: "hidden",
    padding: 14,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000000",
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  sectionCardOpen: {
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  sectionPhoto: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionWatermarkWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionWatermark: {
    width: "52%",
    height: "34%",
    opacity: 0.1,
  },
  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  sectionAccent: {
    width: 3,
    height: 15,
    borderRadius: 2,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  sectionChevron: {
    position: "absolute",
    top: 14,
  },
  engineReveal: {
    marginTop: 6,
  },

  // ── Booking & Stays full-width card ───────────────────────────────────────
  bookingCardWrap: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  bookingCard: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(90,180,255,0.18)",
    shadowColor: "#1A7FDB",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    justifyContent: "center",
  },
  bookingCardRow: {
    alignItems: "center",
    gap: 14,
  },
  bookingCardText: {
    flex: 1,
    gap: 3,
  },
  bookingCardSub: {
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.72)",
    marginTop: 2,
  },

  // ── Divider between marketplace and B2B hub ───────────────────────────────
  hubDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 6,
    gap: 10,
  },
  hubDividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  hubDividerLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // ── Business Hub CTA cards ────────────────────────────────────────────────
  hubCardWrap: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  hubCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 14,
  },
  hubCardRow: {
    alignItems: "center",
    gap: 14,
  },
  hubBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  hubCardText: {
    flex: 1,
  },
  hubTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  hubSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.70)",
    marginTop: 2,
  },
});
