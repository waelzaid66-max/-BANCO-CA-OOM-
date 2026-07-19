import { Feather } from "@/components/icons";
import { FeedItem, useGetTrending } from "@workspace/api-client-react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/components/AppText";
import {
  Category,
  CategoryIcon,
} from "@/components/CategoryTabs";
import { type CarBrand } from "@/constants/cars";
import { useI18n } from "@/context/LanguageContext";
import { SavedSearch } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

// Concrete, browseable sections (no "all" — these are the real catalogues a
// shopper picks between). Each card pushes a dedicated section mini-app —
// never filters the shared Search tab in place (that melt collapsed every
// catalogue into one melted search surface).
const SECTIONS: Category[] = ["car", "real_estate", "facilities", "materials"];

// Dedicated section mini-app routes. Must stay registered in app/_layout.tsx
// as Stack.Screen entries or router.push 404s.
const SECTION_ROUTE: Record<Category, Href> = {
  all: "/section/car",
  car: "/section/car",
  real_estate: "/section/real-estate",
  facilities: "/section/factories",
  materials: "/section/materials",
};

// On-brand gradient pairs per section so each card reads as its own world while
// staying in the BANCO red/charcoal family.
// Red-family fallback fills behind the section photos (identity rule: logo red
// + derivatives only — aligned with lib/sectionTheme's corrected palette).
const SECTION_GRADIENT: Record<Category, [string, string]> = {
  all: ["#7A0C12", "#1C0507"],
  car: ["#8A0E14", "#1C0507"],
  real_estate: ["#7A1226", "#190509"],
  facilities: ["#7E1F14", "#140505"],
  materials: ["#6E1A10", "#160805"],
};

// Real, representative cover photography per browse section, bundled locally so
// the cards read as authentic (trust) and premium. A cinematic scrim sits over
// each photo for legibility and a framed, editorial feel. The gradient above
// stays as the fallback fill behind the photo while it loads.
const SECTION_PHOTO: Partial<Record<Category, number>> = {
  car: require("../assets/images/categories/car.jpg"),
  real_estate: require("../assets/images/categories/real_estate.jpg"),
  facilities: require("../assets/images/categories/facilities.jpg"),
  materials: require("../assets/images/categories/materials.jpg"),
};

// Faint BANCO wordmark embossed behind each card's content — a subtle, premium
// on-brand finish (white-tinted, very low opacity, sits above the scrim but
// below the badge/label/chevron so it never fights legibility).
const BANCO_WATERMARK = require("../assets/images/banco-logo.png");

// 5th portal — Booking & Stays (residential + furnished rental, NOT hotels).
// Wears the real-estate rose identity (blue is reserved for Banks & Financiers)
// and leads with a real photo like the four section cards.
const BOOKING_PHOTO = require("../assets/images/categories/booking.jpg");

interface Props {
  onBrowseBrand: (brand: CarBrand) => void;
  onApplySaved: (s: SavedSearch) => void;
  onOpenListing: (item: FeedItem) => void;
  /**
   * Open the existing results map over a coordinate-rich category (real-estate).
   * The host latches the intent and auto-enables map mode once mappable results
   * arrive, falling back to the list when none carry coordinates — so tapping
   * this never lands the user on an empty map.
   */
  onExploreMap: () => void;
  /** Re-run a recent text search (fills the input + commits immediately). */
  onSearchQuery: (q: string) => void;
}

export function SearchDiscover({
  onBrowseBrand: _onBrowseBrand,
  onApplySaved: _onApplySaved,
  onOpenListing: _onOpenListing,
  onExploreMap,
  onSearchQuery: _onSearchQuery,
}: Props) {
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  const { data: trendingRes } = useGetTrending();
  const trending = trendingRes?.data ?? [];

  // Honest gate for the "Explore on map" entry: only surface it when we have
  // real evidence that coordinate-bearing inventory exists. The trending feed is
  // already loaded here and runs through the same coordinate resolver as search
  // (listing override → area centroid), so any trending item with finite coords
  // proves the catalogue has mappable listings — no extra query needed. When no
  // such evidence exists we hide the CTA rather than advertise a map we can't fill.
  const mapAvailable = trending.some(
    (i) =>
      i.coordinates &&
      Number.isFinite(i.coordinates.lat) &&
      Number.isFinite(i.coordinates.lng)
  );

  const handleSectionPress = (cat: Category) => {
    // Always enter the dedicated section mini-app — never melt into shared
    // Search CategoryTabs / EngineChips on this Discover surface.
    router.push(SECTION_ROUTE[cat]);
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <AppText
      style={[styles.sectionTitle, { color: colors.foreground, textAlign }]}
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
      {/* Section portals — full-width ENTER rows (not a 2×2 filter grid).
          Tapping pushes /section/* mini-apps; chips live inside those apps. */}
      <SectionHeader label={t("search.discover.sections")} />
      <View style={styles.sectionList}>
        {SECTIONS.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => handleSectionPress(cat)}
            style={styles.sectionPortalWrap}
            testID={`section-card-${cat}`}
            accessibilityRole="button"
            accessibilityHint={t("search.discover.section.enterSection")}
          >
            <LinearGradient
              colors={SECTION_GRADIENT[cat]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.sectionPortal, { flexDirection: rowDir }]}
            >
              <View style={styles.sectionThumbWrap}>
                <Image
                  source={SECTION_PHOTO[cat]}
                  style={styles.sectionThumb}
                  contentFit="cover"
                  transition={200}
                />
                <LinearGradient
                  colors={["rgba(12,4,5,0.05)", "rgba(12,4,5,0.55)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.sectionThumbScrim}
                />
              </View>
              <View style={styles.sectionPortalBody}>
                <View
                  style={[
                    styles.sectionPortalTitleRow,
                    { flexDirection: rowDir },
                  ]}
                >
                  <CategoryIcon category={cat} color="#FFFFFF" size={16} />
                  <AppText style={[styles.sectionPortalTitle, { textAlign }]}>
                    {t(`home.categories.${cat}`)}
                  </AppText>
                </View>
                <AppText style={[styles.sectionPortalEnter, { textAlign }]}>
                  {t("search.discover.section.enterSection")}
                </AppText>
              </View>
              <Feather
                name={isRTL ? "chevron-left" : "chevron-right"}
                size={20}
                color="rgba(255,255,255,0.9)"
              />
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {/* ── 5th portal card — Booking & Stays (إيجار وحجز) ──────────────────
          Residential + furnished rental (NOT hotels). Full-width to read as a
          portal into its own mini-app (/section/booking → BookingStaysApp),
          not a same-tier catalogue section. Real photo + scrim + watermark,
          exactly like the four section cards; rose real-estate identity —
          blue is reserved for Banks & Financiers. */}
      <Pressable
        onPress={() => router.push("/section/booking" as Href)}
        style={styles.bookingCardWrap}
        testID="section-card-booking"
      >
        <View
          style={[styles.bookingCard, { backgroundColor: SECTION_GRADIENT.real_estate[1] }]}
        >
          <Image
            source={BOOKING_PHOTO}
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
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.sectionWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.bookingTopRow, { flexDirection: rowDir }]}>
            <View style={styles.sectionBadge}>
              <Feather name="calendar" size={18} color="#FFFFFF" />
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={20}
              color="rgba(255,255,255,0.85)"
            />
          </View>
          <View>
            <View
              style={[
                styles.sectionLabelRow,
                isRTL && { flexDirection: "row-reverse" },
              ]}
            >
              <View
                style={[styles.sectionAccent, { backgroundColor: colors.primary }]}
              />
              <AppText style={[styles.sectionLabel, { textAlign, fontSize: 18 }]}>
                {t("search.discover.bookingHub")}
              </AppText>
            </View>
            <AppText style={[styles.bookingSub, { textAlign }]}>
              {t("search.discover.bookingHubSub")}
            </AppText>
          </View>
        </View>
      </Pressable>

      {/* Explore on map — gated on real coordinate-bearing inventory (see
          mapAvailable). If a browse still resolves with no coordinates the host
          falls back to the list, so this never lands on an empty map. */}
      {mapAvailable && (
        <Pressable
          onPress={onExploreMap}
          style={styles.mapCtaWrap}
          testID="discover-explore-map"
        >
          <LinearGradient
            colors={["#23252B", "#0C0D10"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mapCta}
          >
            <Image
              source={require("../assets/images/banco-glow.png")}
              style={[styles.mapGlow, isRTL ? { left: -24 } : { right: -24 }]}
              contentFit="contain"
            />
            <View style={[styles.mapCtaRow, { flexDirection: rowDir }]}>
              <View style={[styles.mapBadge, { backgroundColor: colors.primary }]}>
                <Feather name="map" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.mapCtaText}>
                <AppText style={[styles.mapTitle, { textAlign }]}>
                  {t("search.discover.exploreMap")}
                </AppText>
                <AppText style={[styles.mapSub, { textAlign }]}>
                  {t("search.discover.exploreMapSub")}
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
      )}

      {/* Car import — opens the Cars section mini-app (never melts into the
          shared Search tab). Engine chips live inside SectionSearchApp. */}
      <Pressable
        onPress={() => router.push(SECTION_ROUTE.car)}
        style={styles.hubCtaWrap}
        testID="discover-car-import"
      >
        <LinearGradient
          colors={["#8A0E14", "#1C0507"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCta}
        >
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.hubWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.mapCtaRow, { flexDirection: rowDir }]}>
            <View style={[styles.mapBadge, { backgroundColor: colors.primary }]}>
              <CategoryIcon category="car" color="#FFFFFF" />
            </View>
            <View style={styles.mapCtaText}>
              <AppText style={[styles.mapTitle, { textAlign }]}>
                {t("search.discover.carImport")}
              </AppText>
              <AppText style={[styles.mapSub, { textAlign }]}>
                {t("search.discover.carImportSub")}
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

      {/* ── Business & supply hubs (الأعمال والتوريد) ────────────────────────
          Rectangular portal rows into the B2B worlds. Each carries the BANCO
          watermark so the identity never drops. Colours: supply = deep red
          family, importers = neutral charcoal, Banks & Financiers = the ONE
          trust-blue section outside the red family (deliberate, banks only). */}
      <SectionHeader label={t("search.discover.businessHub")} />

      <Pressable
        onPress={() => router.push("/business/global-supply")}
        style={styles.hubCtaWrap}
        testID="discover-supply-portal"
      >
        <LinearGradient
          colors={["#4A0D12", "#170506"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCta}
        >
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.hubWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.mapCtaRow, { flexDirection: rowDir }]}>
            <View style={[styles.mapBadge, { backgroundColor: colors.primary }]}>
              <Feather name="globe" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.mapCtaText}>
              <AppText style={[styles.mapTitle, { textAlign }]}>
                {t("search.discover.supplyPortal")}
              </AppText>
              <AppText style={[styles.mapSub, { textAlign }]}>
                {t("search.discover.supplyPortalSub")}
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

      <Pressable
        onPress={() => router.push("/business/supply-hub")}
        style={styles.hubCtaWrap}
        testID="discover-importers-hub"
      >
        <LinearGradient
          colors={["#23252B", "#0C0D10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCta}
        >
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.hubWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.mapCtaRow, { flexDirection: rowDir }]}>
            <View style={[styles.mapBadge, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
              <Feather name="package" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.mapCtaText}>
              <AppText style={[styles.mapTitle, { textAlign }]}>
                {t("search.discover.importersHub")}
              </AppText>
              <AppText style={[styles.mapSub, { textAlign }]}>
                {t("search.discover.importersHubSub")}
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

      <Pressable
        onPress={() => router.push("/business/banks" as Href)}
        style={styles.hubCtaWrap}
        testID="discover-banks-hub"
      >
        <LinearGradient
          colors={["#0D2B4A", "#071522"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hubCta}
        >
          <View pointerEvents="none" style={styles.sectionWatermarkWrap}>
            <Image
              source={BANCO_WATERMARK}
              style={styles.hubWatermark}
              contentFit="contain"
              tintColor="#FFFFFF"
            />
          </View>
          <View style={[styles.mapCtaRow, { flexDirection: rowDir }]}>
            <View style={[styles.mapBadge, { backgroundColor: "#1E6FD9" }]}>
              <Feather name="credit-card" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.mapCtaText}>
              <AppText style={[styles.mapTitle, { textAlign }]}>
                {t("search.discover.banksHub")}
              </AppText>
              <AppText style={[styles.mapSub, { textAlign }]}>
                {t("search.discover.banksHubSub")}
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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 120 },
  sectionList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionPortalWrap: {
    width: "100%",
  },
  sectionPortal: {
    alignItems: "center",
    gap: 12,
    minHeight: 78,
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  sectionThumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sectionThumb: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionThumbScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionPortalBody: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  sectionPortalTitleRow: {
    alignItems: "center",
    gap: 8,
  },
  sectionPortalTitle: {
    flexShrink: 1,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.15,
  },
  sectionPortalEnter: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.72)",
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
    width: 32,
    height: 32,
    borderRadius: 10,
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
  mapCtaWrap: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  mapCta: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 16,
  },
  mapGlow: {
    position: "absolute",
    top: -16,
    bottom: -16,
    width: 130,
    opacity: 0.5,
  },
  mapCtaRow: {
    alignItems: "center",
    gap: 14,
  },
  mapBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  mapCtaText: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  mapSub: {
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.78)",
    marginTop: 2,
  },
  bookingCardWrap: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  bookingCard: {
    height: 112,
    borderRadius: 18,
    overflow: "hidden",
    padding: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  bookingTopRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookingSub: {
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 3,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  hubCtaWrap: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  hubCta: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  hubWatermark: {
    width: "40%",
    height: "60%",
    opacity: 0.08,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    gap: 8,
    paddingHorizontal: 16,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  brandChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  savedChip: {
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 200,
  },
  savedChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  cardRow: {
    gap: 12,
    paddingHorizontal: 16,
  },
  cCard: {
    width: 168,
    borderWidth: 1,
    overflow: "hidden",
  },
  cImgWrap: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  cImg: {
    width: "100%",
    height: "100%",
  },
  cTag: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cTagText: {
    fontSize: 11,
    color: "#FFFFFF",
  },
  cBody: {
    padding: 10,
    gap: 3,
  },
  cPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  cTitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  loadingRow: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginHorizontal: 16,
  },
});
