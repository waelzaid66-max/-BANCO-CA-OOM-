/**
 * BOOM STAY — premium black header (visual shell).
 *
 * Presentational only: same Stay actions as the former rose hero
 * (back · save · search · filter · property-type tabs). No hotels.
 * Parent (`BookingStaysApp`) owns all search state and handlers.
 */
import { Feather, Ionicons } from "@/components/icons";
import { Image } from "expo-image";
import { AppTextInput as TextInput } from "@/components/AppTextInput";
import type { TextInput as RNTextInput } from "react-native";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/AppText";
import { STAYS_ACCENT } from "@/components/StayCard";
import { useI18n } from "@/context/LanguageContext";

const BOOM_LOGO = require("../../../assets/images/boom-logo.png");

const VOID = "#000000";
const SNOW = "#FFFFFF";
const ASH = "#8E8E93";
const HAIRLINE = "rgba(255,255,255,0.16)";

export type StayTypeTab = {
  value: string;
  label: string;
};

type StaysHomeHeaderProps = {
  searchOpen: boolean;
  draftQuery: string;
  searchSaved: boolean;
  activeFilterCount: number;
  activeStayType: string;
  typeTabs: StayTypeTab[];
  inputRef: React.RefObject<RNTextInput | null>;
  onBack: () => void;
  onSaveSearch: () => void;
  onOpenFilters: () => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onQueryChange: (text: string) => void;
  onSubmitQuery: () => void;
  onClearQuery: () => void;
  onSelectType: (value: string) => void;
};

/** Names must exist in `@/components/icons` ICONS registry (runtime + types). */
function tabIcon(value: string): React.ComponentProps<typeof Ionicons>["name"] {
  switch (value) {
    case "__all__":
      return "business-outline";
    case "studio":
      return "bed-outline";
    case "apartment":
      return "business-outline";
    case "villa":
      return "home";
    case "chalet":
      return "grid-outline";
    default:
      return "radio-button-off";
  }
}

export function StaysHomeHeader({
  searchOpen,
  draftQuery,
  searchSaved,
  activeFilterCount,
  activeStayType,
  typeTabs,
  inputRef,
  onBack,
  onSaveSearch,
  onOpenFilters,
  onOpenSearch,
  onCloseSearch,
  onQueryChange,
  onSubmitQuery,
  onClearQuery,
  onSelectType,
}: StaysHomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useI18n();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign = isRTL ? "right" : "left";

  return (
    <View style={[styles.root, { paddingTop: topPad + 4 }]} testID="stays-header">
      {/* Band A — back · compact brand · save (one short row, not half-screen) */}
      <View style={[styles.topBar, { flexDirection: rowDir }]}>
        <Pressable
          onPress={onBack}
          style={styles.iconHit}
          hitSlop={12}
          testID="stays-back"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={20}
            color={SNOW}
          />
        </Pressable>
        <View style={styles.brandInline}>
          <View
            style={[
              styles.wordmarkRow,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Image
              source={BOOM_LOGO}
              style={styles.wordmarkBoom}
              contentFit="contain"
            />
            <AppText style={styles.wordmarkStay} numberOfLines={1}>
              STAY
            </AppText>
          </View>
          <AppText style={styles.tagline} numberOfLines={1}>
            {t("search.discover.section.staysTagline")}
          </AppText>
        </View>
        <Pressable
          onPress={onSaveSearch}
          disabled={searchSaved}
          style={styles.iconHit}
          testID="stays-save-search"
          accessibilityRole="button"
        >
          <Feather
            name="bookmark"
            size={18}
            color={searchSaved ? STAYS_ACCENT : SNOW}
          />
        </Pressable>
      </View>

      {/* Band C — search pill (filter lives on the right, mock-aligned) */}
      {searchOpen ? (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Ionicons name="search" size={18} color={STAYS_ACCENT} />
          <TextInput
            ref={inputRef}
            value={draftQuery}
            onChangeText={onQueryChange}
            onSubmitEditing={onSubmitQuery}
            placeholder={t("search.discover.section.staysWhere")}
            placeholderTextColor={ASH}
            style={[styles.searchInput, { textAlign }]}
            returnKeyType="search"
            testID="stays-search-input"
            autoCorrect={false}
          />
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="stays-search-clear">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          ) : (
            <Pressable onPress={onCloseSearch} hitSlop={8} testID="stays-search-close">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          )}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="stays-filter-toggle"
          >
            <Feather name="sliders" size={17} color={STAYS_ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      ) : (
        <View style={[styles.searchPill, { flexDirection: rowDir }]}>
          <Pressable
            onPress={onOpenSearch}
            style={[styles.searchMainHit, { flexDirection: rowDir }]}
            testID="stays-search-toggle"
          >
            <Ionicons name="search" size={18} color={STAYS_ACCENT} />
            <AppText
              style={[
                styles.searchPlaceholder,
                {
                  textAlign,
                  color: draftQuery ? SNOW : ASH,
                },
              ]}
              numberOfLines={1}
            >
              {draftQuery || t("search.discover.section.staysWhere")}
            </AppText>
          </Pressable>
          {draftQuery.length > 0 ? (
            <Pressable onPress={onClearQuery} hitSlop={8} testID="stays-search-clear">
              <Feather name="x" size={16} color={ASH} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={onOpenFilters}
            hitSlop={8}
            style={styles.filterInSearch}
            testID="stays-filter-toggle"
          >
            <Feather name="sliders" size={17} color={STAYS_ACCENT} />
            {activeFilterCount > 0 ? (
              <View style={styles.filterBadge}>
                <AppText style={styles.filterBadgeText}>{activeFilterCount}</AppText>
              </View>
            ) : null}
          </Pressable>
        </View>
      )}

      {/* Band D — property type tabs (no hotels) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabsRow, { flexDirection: rowDir }]}
        style={styles.tabsScroll}
      >
        {typeTabs.map((tab, index) => {
          const active = activeStayType === tab.value;
          const tint = active ? STAYS_ACCENT : ASH;
          return (
            <React.Fragment key={tab.value}>
              {index > 0 ? <View style={styles.tabDivider} /> : null}
              <Pressable
                onPress={() => onSelectType(tab.value)}
                style={styles.tabItem}
                testID={`stays-type-${tab.value}`}
              >
                <Ionicons name={tabIcon(tab.value)} size={20} color={tint} />
                <AppText style={[styles.tabLabel, { color: tint }]} numberOfLines={1}>
                  {tab.label}
                </AppText>
              </Pressable>
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: VOID,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  topBar: {
    alignItems: "center",
    minHeight: 40,
    marginBottom: 8,
    gap: 6,
  },
  brandInline: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconHit: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmarkRow: {
    alignItems: "center",
    gap: 6,
  },
  wordmarkBoom: {
    width: 72,
    height: 24,
  },
  wordmarkStay: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: STAYS_ACCENT,
    letterSpacing: 2.2,
  },
  tagline: {
    marginTop: 2,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: ASH,
    textAlign: "center",
  },
  searchPill: {
    height: 44,
    borderRadius: 999,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
    backgroundColor: VOID,
    borderWidth: 1.5,
    borderColor: STAYS_ACCENT,
  },
  searchMainHit: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    minHeight: 42,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: SNOW,
    padding: 0,
  },
  filterInSearch: {
    position: "relative",
    padding: 4,
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
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
    color: SNOW,
  },
  tabsScroll: {
    marginTop: 8,
    marginHorizontal: -14,
  },
  tabsRow: {
    alignItems: "stretch",
    paddingHorizontal: 10,
    gap: 0,
    minHeight: 44,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    minWidth: 60,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    fontFamily: "Inter_600SemiBold",
  },
  tabDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "center",
    height: 22,
    backgroundColor: HAIRLINE,
  },
});
