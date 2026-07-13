import { Feather, Ionicons } from "@/components/icons";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import type { TextInput as RNTextInput } from "react-native";
import {
  getAutocomplete,
  sendBehaviorSignal,
  FeedItem,
  SearchListingsCategory,
} from "@workspace/api-client-react";
import { router, useNavigation } from "expo-router";
import { usePreventRemove } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { LocationPicker } from "@/components/LocationPicker";
import { SkeletonCard } from "@/components/SkeletonCard";
import { StayCard, STAYS_ACCENT } from "@/components/StayCard";
import { SectionBackdrop } from "@/components/SectionBackdrop";
import { SearchResultsSurface } from "@/components/search/SearchResultsSurface";
import { SearchResultsMap } from "@/components/search/SearchResultsMap";
import { FilterSheet } from "@/components/search/FilterSheet";
import { apiCategoryFor } from "@/components/CategoryTabs";
import { labelForValue } from "@/constants/locations";
import { DEFAULT_MARKET_COUNTRY } from "@/constants/listingCreateTaxonomy";
import {
  loadPreferredMarketCountry,
  savePreferredMarketCountry,
} from "@/lib/marketPreference";
import { useI18n } from "@/context/LanguageContext";
import { useSession } from "@/context/SessionContext";
import { useSound } from "@/context/SoundContext";
import { useColors } from "@/hooks/useColors";
import { useSearchMiniApp } from "@/hooks/useSearchMiniApp";
import {
  DEFAULT_CRITERIA,
  SearchCriteria,
  mapAnchorKey,
} from "@/lib/searchParams";
import { requestNearMeCoords, DEFAULT_NEAR_RADIUS_KM } from "@/lib/nearMe";
import {
  MarketCountryButton,
  MarketCountryPicker,
} from "@/components/MarketCountryPicker";
import {
  rentalTermsForSearch,
  sanitizeRentalTermForMarket,
} from "@/lib/searchTaxonomy";

const ALL_TAB = "__all__";

/** Deterministic, key-sorted serialization used for baseline-delta dirty checks
 *  (mirrors SectionSearchApp — a freshly-landed page is never falsely dirty). */
function serializeCriteria(c: SearchCriteria): string {
  return (Object.keys(c) as (keyof SearchCriteria)[])
    .sort()
    .map((k) => `${String(k)}=${JSON.stringify(c[k])}`)
    .join("|");
}

/**
 * Booking & Stays — a Booking.com-style stays experience built on the section
 * search engine. It locks the category to real_estate and the engine to rent,
 * then makes the market's real rental-term taxonomy the PRIMARY segmentation:
 * a prominent tab strip ("All" + the market's honest terms — EG: daily /
 * new-law / old-law, Gulf: daily / annual). Results render as StayCards; the
 * furnished/daily units carry a "bookable" ribbon and reserve from their detail
 * via the existing BookingCard. Everything else (baseline-delta exit-confirm,
 * market hydration, pull-to-refresh, infinite scroll, map, near-me) reuses the
 * proven mini-app machinery. No backend changes.
 */
export function BookingStaysApp() {
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const { playSound } = useSound();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    sessionId,
    isSaved,
    toggleSave,
    saveSearch,
    isSearchSaved,
    cacheFeedItem,
    recordQuery,
  } = useSession();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const onCommitted = useCallback(
    (c: SearchCriteria) => {
      sendBehaviorSignal({
        session_id: sessionId,
        action: "click",
        category: apiCategoryFor(c.category) as SearchListingsCategory | undefined,
      }).catch(() => {});
    },
    [sessionId],
  );

  const search = useSearchMiniApp(onCommitted);
  const { criteria, items, viewState, phase, hasNext, commit, update, applyPatch, loadMore, retry } =
    search;

  // The clean, per-entry baseline: real_estate + rent + market's default term
  // basis (null → "All"). Dirty = any delta from this, so entering never prompts.
  const buildSeed = useCallback(
    (market: string): SearchCriteria => ({
      ...DEFAULT_CRITERIA,
      marketCountry: market,
      category: "real_estate",
      engineKey: "rent",
      rentalTerm: sanitizeRentalTermForMarket(null, market),
    }),
    [],
  );
  const baselineRef = useRef<SearchCriteria | null>(null);

  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const seed = buildSeed(criteria.marketCountry);
    baselineRef.current = seed;
    commit(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Native: hydrate the persisted market once, advancing the baseline in lockstep
  // so a non-default saved market is not treated as "dirty".
  const marketHydrated = useRef(Platform.OS === "web");
  useEffect(() => {
    if (marketHydrated.current) return;
    let cancelled = false;
    void loadPreferredMarketCountry().then((iso) => {
      if (cancelled) return;
      marketHydrated.current = true;
      if (iso === criteria.marketCountry) return;
      const marketPatch: Partial<SearchCriteria> = {
        marketCountry: iso,
        rentalTerm: sanitizeRentalTermForMarket(null, iso),
      };
      if (baselineRef.current) {
        baselineRef.current = { ...baselineRef.current, ...marketPatch };
      }
      applyPatch(marketPatch);
      if (items.length > 0 || phase !== "idle") retry();
    });
    return () => {
      cancelled = true;
    };
  }, [applyPatch, retry, items.length, phase, criteria.marketCountry]);

  // ── Map view ──
  const [mapMode, setMapMode] = useState(false);
  const [marketPickerOpen, setMarketPickerOpen] = useState(false);
  const mappableItems = useMemo(
    () =>
      items.filter(
        (i) =>
          i.coordinates &&
          Number.isFinite(i.coordinates.lat) &&
          Number.isFinite(i.coordinates.lng),
      ),
    [items],
  );
  const inResultsView = viewState === "results";
  const hasPagePins = mappableItems.length > 0;
  useEffect(() => {
    if (!inResultsView && mapMode) setMapMode(false);
  }, [inResultsView, mapMode]);

  const mapSectionKey = mapAnchorKey(criteria);
  const prevMapSectionKey = useRef(mapSectionKey);
  useEffect(() => {
    if (prevMapSectionKey.current === mapSectionKey) return;
    prevMapSectionKey.current = mapSectionKey;
    setMapMode(false);
  }, [mapSectionKey]);

  // ── Text query + autocomplete (real_estate-scoped) ──
  const [draftQuery, setDraftQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  // The search box is tap-to-open (an icon), not a permanent rectangle. Opening
  // focuses the field; closing (toggle / submit) collapses it back to the icon.
  const openSearch = () => {
    playSound("tap");
    setSearchOpen(true);
    setShowSuggestions(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  const closeSearch = () => {
    setSearchOpen(false);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const autocompleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<RNTextInput>(null);
  const autocompleteSeq = useRef(0);

  useEffect(
    () => () => {
      if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current);
      if (commitTimer.current) clearTimeout(commitTimer.current);
    },
    [],
  );

  const fetchAutocomplete = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const seq = ++autocompleteSeq.current;
    try {
      const res = await getAutocomplete({ q, category: "real_estate" });
      if (seq !== autocompleteSeq.current) return;
      setSuggestions(res.data ?? []);
    } catch {
      if (seq !== autocompleteSeq.current) return;
      setSuggestions([]);
    }
  }, []);

  const handleQueryChange = (text: string) => {
    setDraftQuery(text);
    setShowSuggestions(true);
    if (autocompleteTimer.current) clearTimeout(autocompleteTimer.current);
    autocompleteTimer.current = setTimeout(() => fetchAutocomplete(text), 250);
    if (commitTimer.current) clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => update({ q: text }), 350);
  };

  const commitQueryNow = (q: string) => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    setShowSuggestions(false);
    recordQuery(q);
    update({ q });
  };

  const clearQuery = () => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    setDraftQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    update({ q: "" });
  };

  const handleSuggestionTap = (s: string) => {
    setDraftQuery(s);
    commitQueryNow(s);
  };

  const handleCardPress = useCallback(
    (item: FeedItem) => {
      cacheFeedItem(item);
      router.push(`/listing/${item.id}`);
    },
    [cacheFeedItem],
  );

  // ── Term tabs (primary segmentation, market-driven taxonomy) ──
  const rentalTerms = rentalTermsForSearch(criteria.marketCountry);
  const activeTerm = criteria.rentalTerm ?? ALL_TAB;
  const selectTerm = (value: string) => {
    playSound("tap");
    Haptics.selectionAsync();
    if (value === ALL_TAB) {
      update({ rentalTerm: null });
    } else {
      update({ rentalTerm: value, engineKey: "rent" });
    }
  };

  const selectMarketCountry = (code: string) => {
    void savePreferredMarketCountry(code);
    update({
      marketCountry: code,
      rentalTerm: sanitizeRentalTermForMarket(criteria.rentalTerm, code),
    });
  };

  const toggleNearMe = useCallback(async () => {
    if (criteria.nearMeEnabled) {
      update({ nearMeEnabled: false, nearLat: null, nearLng: null });
      return;
    }
    const coords = await requestNearMeCoords();
    if (!coords) {
      Alert.alert(t("search.nearMe"), t("search.nearMeDenied"));
      return;
    }
    update({
      nearMeEnabled: true,
      nearLat: coords.lat,
      nearLng: coords.lng,
      nearRadiusKm: DEFAULT_NEAR_RADIUS_KM,
    });
  }, [criteria.nearMeEnabled, t, update]);

  // "Clear all" → this page's clean baseline (real_estate + rent + All, market
  // preserved). Post-reset the page is not dirty.
  const clearAllFilters = useCallback(() => {
    setDraftQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    const baseline = baselineRef.current ?? buildSeed(criteria.marketCountry);
    commit(baseline);
  }, [buildSeed, commit, criteria.marketCountry]);

  // Filter badge excludes the term tabs (surfaced separately) and payment (rentals
  // carry no financing) — only price / location / near-me / market count here.
  const activeFilterCount = [
    !!criteria.minPrice || !!criteria.maxPrice,
    !!criteria.location,
    criteria.nearMeEnabled,
    criteria.marketCountry !==
      (baselineRef.current?.marketCountry ?? DEFAULT_MARKET_COUNTRY),
  ].filter(Boolean).length;

  const isDirty =
    (baselineRef.current !== null &&
      serializeCriteria(criteria) !== serializeCriteria(baselineRef.current)) ||
    !!draftQuery.trim();

  const searchSaved = isSearchSaved({
    criteria: { ...criteria, q: draftQuery.trim() },
    q: draftQuery.trim(),
    category: criteria.category,
    minPrice: criteria.minPrice,
    maxPrice: criteria.maxPrice,
    location: criteria.location,
    paymentType: criteria.paymentType,
  });

  const handleSaveSearch = () => {
    const snapshot: SearchCriteria = { ...criteria, q: draftQuery.trim() };
    saveSearch({
      criteria: snapshot,
      q: snapshot.q,
      category: snapshot.category,
      minPrice: snapshot.minPrice,
      maxPrice: snapshot.maxPrice,
      location: snapshot.location,
      paymentType: snapshot.paymentType,
    });
  };

  usePreventRemove(isDirty, ({ data }) => {
    Alert.alert(
      t("search.discover.section.exitTitle"),
      t("search.discover.section.exitMessage"),
      [
        { text: t("search.discover.section.exitCancel"), style: "cancel" },
        {
          text: t("search.discover.section.exitConfirm"),
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ],
    );
  });

  const goBack = () => {
    playSound("tap");
    router.back();
  };

  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";
  const locationLabel = criteria.location
    ? labelForValue(criteria.location, isRTL) || criteria.location
    : "";

  let overlay: React.ReactNode = null;
  if (viewState === "loading" || viewState === "discover") {
    overlay = (
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  } else if (viewState === "error") {
    overlay = (
      <View style={styles.emptyState}>
        <Feather name="wifi-off" size={52} color={colors.mutedForeground} />
        <AppText style={[styles.emptyTitle, { color: colors.foreground }]}>
          {t("search.errorTitle")}
        </AppText>
        <AppText style={[styles.emptyText, { color: colors.mutedForeground }]}>
          {t("search.errorHint")}
        </AppText>
        <Pressable
          onPress={retry}
          style={[
            styles.applyBtn,
            { backgroundColor: STAYS_ACCENT, borderRadius: colors.radius },
          ]}
          testID="stays-retry"
        >
          <AppText style={[styles.applyText, { color: "#FFFFFF" }]}>
            {t("search.retry")}
          </AppText>
        </Pressable>
      </View>
    );
  } else if (viewState === "empty") {
    overlay = (
      <View style={styles.emptyState}>
        <Feather name="calendar" size={52} color={colors.mutedForeground} />
        <AppText style={[styles.emptyTitle, { color: colors.foreground }]}>
          {t("search.noResults")}
        </AppText>
        <AppText style={[styles.emptyText, { color: colors.mutedForeground }]}>
          {t("search.noResultsHint")}
        </AppText>
        {activeFilterCount > 0 || draftQuery.trim() || !!criteria.rentalTerm ? (
          <Pressable
            onPress={() => {
              playSound("tap");
              clearAllFilters();
            }}
            style={[
              styles.emptyCta,
              { backgroundColor: STAYS_ACCENT, borderRadius: colors.radius },
            ]}
            testID="stays-empty-clear"
          >
            <Feather name="refresh-cw" size={16} color="#FFFFFF" />
            <AppText style={[styles.emptyCtaText, { color: "#FFFFFF" }]}>
              {t("search.discover.section.reset")}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Stays hero — the section's rose real-estate identity, not the generic
          marketplace search chrome. Carries title, save/filter actions and a
          single "Where to?" search pill. ─────────────────────────────────── */}
      <View style={[styles.hero, { paddingTop: topPad + 12 }]}>
        <SectionBackdrop section="real_estate" motifSize={140} />
        <View style={[styles.heroTopRow, { flexDirection: rowDir }]}>
          <Pressable onPress={goBack} style={styles.heroBackBtn} hitSlop={12} testID="stays-back">
            <Feather
              name={isRTL ? "arrow-right" : "arrow-left"}
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
          <View style={styles.heroTitleWrap}>
            <AppText style={[styles.heroTitle, { textAlign }]} numberOfLines={1}>
              {t("home.categories.booking")}
            </AppText>
            <AppText style={[styles.heroSub, { textAlign }]} numberOfLines={1}>
              {t("search.discover.section.bookingSub")}
            </AppText>
          </View>
          <Pressable
            onPress={handleSaveSearch}
            disabled={searchSaved}
            style={[styles.heroActionBtn, searchSaved && styles.heroActionBtnActive]}
            testID="stays-save-search"
          >
            <Feather
              name="bookmark"
              size={16}
              color={searchSaved ? STAYS_ACCENT : "#FFFFFF"}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              playSound("tap");
              setShowFilters((v) => !v);
            }}
            style={[
              styles.heroActionBtn,
              activeFilterCount > 0 && styles.heroActionBtnActive,
            ]}
            testID="stays-filter-toggle"
          >
            <Feather
              name="sliders"
              size={17}
              color={activeFilterCount > 0 ? STAYS_ACCENT : "#FFFFFF"}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            )}
          </Pressable>
        </View>

        {/* Single "Where to?" pill — tap to reveal the field; the field itself
            replaces the placeholder in place (no separate rectangle). */}
        {searchOpen ? (
          <View style={[styles.heroSearch, { flexDirection: rowDir }]}>
            <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.9)" />
            <TextInput
              ref={inputRef}
              value={draftQuery}
              onChangeText={handleQueryChange}
              onSubmitEditing={() => {
                commitQueryNow(draftQuery);
                if (!draftQuery.trim()) closeSearch();
              }}
              placeholder={t("search.discover.section.staysWhere")}
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={[styles.heroSearchInput, { textAlign }]}
              returnKeyType="search"
              testID="stays-search-input"
              autoCorrect={false}
            />
            <Pressable
              onPress={draftQuery.length > 0 ? clearQuery : closeSearch}
              hitSlop={8}
              testID="stays-search-close"
            >
              <Feather name="x" size={16} color="rgba(255,255,255,0.9)" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={openSearch}
            style={[styles.heroSearch, { flexDirection: rowDir }]}
            testID="stays-search-toggle"
          >
            <Ionicons name="location-outline" size={18} color="rgba(255,255,255,0.9)" />
            <AppText
              style={[
                styles.heroSearchText,
                {
                  textAlign,
                  color: draftQuery ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                },
              ]}
              numberOfLines={1}
            >
              {draftQuery || t("search.discover.section.staysWhere")}
            </AppText>
            {draftQuery.length > 0 ? (
              <Pressable onPress={clearQuery} hitSlop={8} testID="stays-search-clear">
                <Feather name="x" size={16} color="rgba(255,255,255,0.9)" />
              </Pressable>
            ) : (
              <Feather name="search" size={16} color="rgba(255,255,255,0.9)" />
            )}
          </Pressable>
        )}
      </View>

      {/* Autocomplete — anchored directly under the hero search pill. */}
      {showSuggestions && suggestions.length > 0 && (
        <View
          style={[
            styles.suggestions,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {suggestions.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => handleSuggestionTap(s)}
              style={[
                styles.suggestionItem,
                {
                  flexDirection: rowDir,
                  borderBottomColor:
                    i < suggestions.length - 1 ? colors.border : "transparent",
                },
              ]}
            >
              <Ionicons name="search-outline" size={14} color={colors.mutedForeground} />
              <AppText style={[styles.suggestionText, { color: colors.foreground }]}>
                {s}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}

      {/* Controls: market chip + primary rental-term segmentation. */}
      <View style={[styles.controlsRow, { flexDirection: rowDir }]}>
        <MarketCountryButton
          selected={criteria.marketCountry}
          onPress={() => {
            playSound("tap");
            setMarketPickerOpen(true);
          }}
        />
        <View style={[styles.controlsDivider, { backgroundColor: colors.border }]} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.termTabs, { flexDirection: rowDir }]}
        >
          {[{ value: ALL_TAB, label: t("search.discover.section.staysAll") }]
            .concat(
              rentalTerms.map((r) => ({ value: r.value, label: isRTL ? r.ar : r.en })),
            )
            .map((tab) => {
              const active = activeTerm === tab.value;
              return (
                <Pressable
                  key={tab.value}
                  onPress={() => selectTerm(tab.value)}
                  style={[
                    styles.termTab,
                    {
                      backgroundColor: active ? STAYS_ACCENT : colors.card,
                      borderColor: active ? STAYS_ACCENT : colors.border,
                    },
                  ]}
                  testID={`stays-term-${tab.value}`}
                >
                  <AppText
                    style={[
                      styles.termTabText,
                      { color: active ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {tab.label}
                  </AppText>
                </Pressable>
              );
            })}
        </ScrollView>
      </View>

      {viewState === "results" && items.length > 0 ? (
        <AppText
          style={[styles.resultsCount, { color: colors.mutedForeground, textAlign }]}
          testID="stays-results-count"
        >
          {t("search.resultsCount", {
            count: `${items.length}${hasNext ? "+" : ""}`,
          })}
        </AppText>
      ) : null}

      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        criteria={criteria}
        shownCategories={["real_estate"]}
        engines={[]}
        quickBrands={[]}
        brandValue={null}
        locationLabel={locationLabel}
        lockCategory
        onSelectCategory={() => {}}
        onSelectEngine={() => {}}
        onBrowseBrand={() => {}}
        onOpenBrandPicker={() => {}}
        onUpdate={(partial) => {
          if (partial.marketCountry) {
            void savePreferredMarketCountry(partial.marketCountry);
          }
          update(partial);
        }}
        onOpenLocationPicker={() => setLocationPickerOpen(true)}
        onClearLocation={() => update({ location: "" })}
        onToggleNearMe={() => void toggleNearMe()}
        onClearAll={clearAllFilters}
      />

      <View style={styles.resultsArea}>
        <SearchResultsSurface
          items={items}
          onCardPress={handleCardPress}
          onSave={toggleSave}
          isSaved={isSaved}
          onEndReached={loadMore}
          loadingMore={phase === "loadingMore"}
          refreshing={phase === "refreshing"}
          error={phase === "error"}
          onRetry={retry}
          onRefresh={retry}
          overlay={overlay}
          CardComponent={StayCard}
        />

        {mapMode && inResultsView ? (
          <SearchResultsMap
            items={mappableItems}
            criteria={criteria}
            onOpenListing={handleCardPress}
            onOpenListingId={(id) => router.push(`/listing/${id}?focus=booking`)}
            onSave={toggleSave}
            isSaved={isSaved}
          />
        ) : null}

        {inResultsView ? (
          <View
            style={[styles.mapToggleWrap, { bottom: insets.bottom + 24 }]}
            pointerEvents="box-none"
          >
            <Pressable
              onPress={() => {
                playSound("tap");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMapMode((m) => !m);
              }}
              style={[
                styles.mapToggle,
                { backgroundColor: STAYS_ACCENT, flexDirection: rowDir },
              ]}
              testID="stays-map-toggle"
            >
              <Feather name={mapMode ? "list" : "map"} size={16} color="#FFFFFF" />
              <AppText style={[styles.mapToggleText, { color: "#FFFFFF" }]}>
                {mapMode
                  ? t("search.discover.section.staysList")
                  : hasPagePins
                    ? `${t("search.discover.section.staysMap")} (${mappableItems.length})`
                    : t("search.discover.section.staysMap")}
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </View>

      <LocationPicker
        visible={locationPickerOpen}
        selectedValue={criteria.location}
        onClose={() => setLocationPickerOpen(false)}
        onSelect={(value) => {
          update({ location: value });
          setLocationPickerOpen(false);
        }}
        onClear={() => {
          update({ location: "" });
          setLocationPickerOpen(false);
        }}
      />

      <MarketCountryPicker
        visible={marketPickerOpen}
        selected={criteria.marketCountry}
        onClose={() => setMarketPickerOpen(false)}
        onSelect={(iso) => {
          selectMarketCountry(iso);
          setMarketPickerOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultsArea: { flex: 1 },

  // ── Stays hero ───────────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "#650E36",
  },
  heroTopRow: { alignItems: "center", gap: 8, marginBottom: 14 },
  heroBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitleWrap: { flex: 1 },
  heroTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  heroSub: {
    fontSize: 12.5,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.78)",
    marginTop: 2,
  },
  heroActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroActionBtnActive: { backgroundColor: "#FFFFFF" },
  filterBadge: {
    position: "absolute",
    top: 3,
    right: 3,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: STAYS_ACCENT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  filterBadgeText: {
    fontSize: 9.5,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  heroSearch: {
    height: 50,
    borderRadius: 15,
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  heroSearchText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  heroSearchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
    padding: 0,
  },
  controlsRow: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  controlsDivider: { width: 1, height: 22, opacity: 0.7 },
  termTabs: { paddingBottom: 2, gap: 7, alignItems: "center" },
  termTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  termTabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  resultsCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  suggestions: {
    marginHorizontal: 12,
    marginTop: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  suggestionItem: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  suggestionText: { fontSize: 14, fontFamily: "Inter_400Regular", flex: 1 },
  mapToggleWrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  mapToggle: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  mapToggleText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyText: { fontSize: 13.5, fontFamily: "Inter_400Regular", textAlign: "center" },
  applyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: "center",
    marginTop: 16,
  },
  applyText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 22,
    marginTop: 8,
  },
  emptyCtaText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
