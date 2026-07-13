// Banks & Financiers portal — financial institutions hub.
// Trust-blue identity: the ONE section outside BANCO's red family, in BANKS_ACCENT.
import { Feather, MaterialCommunityIcons } from "@/components/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@clerk/expo";

import { AppText } from "@/components/AppText";
import { useI18n } from "@/context/LanguageContext";
import { useColors } from "@/hooks/useColors";
import { BANKS_ACCENT, SECTION_GRADIENT } from "@/lib/sectionTheme";

const BLUE = BANKS_ACCENT;
const BLUE_DIM = "#0E4C92";
const BLUE_BG = "#1668B518";
const BLUE_BORDER = "#1668B538";

type Product = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  titleKey: string;
  descKey: string;
};

const PRODUCTS: Product[] = [
  {
    icon: "home-city-outline",
    titleKey: "business.banks.homeLoanTitle",
    descKey: "business.banks.homeLoanDesc",
  },
  {
    icon: "car-outline",
    titleKey: "business.banks.autoLoanTitle",
    descKey: "business.banks.autoLoanDesc",
  },
  {
    icon: "briefcase-outline",
    titleKey: "business.banks.businessLoanTitle",
    descKey: "business.banks.businessLoanDesc",
  },
  {
    icon: "account-cash-outline",
    titleKey: "business.banks.personalLoanTitle",
    descKey: "business.banks.personalLoanDesc",
  },
];

export default function BanksScreen() {
  const colors = useColors();
  const { t, isRTL } = useI18n();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { isSignedIn } = useAuth();
  const rowDir = isRTL ? "row-reverse" : "row";
  const textAlign: "left" | "right" = isRTL ? "right" : "left";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: rowDir,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.iconBtn}
          hitSlop={12}
          testID="banks-back"
        >
          <Feather
            name={isRTL ? "arrow-right" : "arrow-left"}
            size={22}
            color={colors.foreground}
          />
        </Pressable>
        <AppText style={[styles.headerTitle, { color: colors.foreground }]}>
          {t("business.banks.title")}
        </AppText>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — expressive blue-gradient banner that states the section's world */}
        <LinearGradient
          colors={SECTION_GRADIENT.banks}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderWidth: 0 }]}
        >
          <View
            style={[styles.heroBadge, { backgroundColor: "rgba(255,255,255,0.16)" }]}
          >
            <MaterialCommunityIcons name="bank-outline" size={40} color="#FFFFFF" />
          </View>
          <AppText style={[styles.heroTitle, { color: "#FFFFFF", textAlign }]}>
            {t("business.banks.title")}
          </AppText>
          <AppText
            style={[styles.heroSub, { color: "rgba(255,255,255,0.88)", textAlign }]}
          >
            {t("business.banks.subtitle")}
          </AppText>
        </LinearGradient>

        {/* Products section */}
        <AppText
          style={[
            styles.sectionTitle,
            { color: colors.foreground, textAlign },
          ]}
        >
          {t("business.banks.productsTitle")}
        </AppText>

        {PRODUCTS.map((p) => (
          <View
            key={p.titleKey}
            style={[
              styles.productCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                flexDirection: rowDir,
              },
            ]}
          >
            <View style={[styles.productIcon, { backgroundColor: BLUE_BG }]}>
              <MaterialCommunityIcons
                name={p.icon}
                size={22}
                color={BLUE_DIM}
              />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <AppText
                style={[
                  styles.productTitle,
                  { color: colors.foreground, textAlign },
                ]}
              >
                {t(p.titleKey)}
              </AppText>
              <AppText
                style={[
                  styles.productDesc,
                  { color: colors.mutedForeground, textAlign },
                ]}
              >
                {t(p.descKey)}
              </AppText>
            </View>
            <Feather
              name={isRTL ? "chevron-left" : "chevron-right"}
              size={18}
              color={colors.mutedForeground}
            />
          </View>
        ))}

        {/* Join CTA */}
        <View
          style={[
            styles.joinBox,
            {
              backgroundColor: BLUE_BG,
              borderColor: BLUE_BORDER,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={[styles.joinIconWrap, { backgroundColor: BLUE_BG }]}>
            <MaterialCommunityIcons
              name="bank-check"
              size={32}
              color={BLUE}
            />
          </View>
          <AppText
            style={[
              styles.joinTitle,
              { color: colors.foreground, textAlign },
            ]}
          >
            {t("business.banks.joinTitle")}
          </AppText>
          <AppText
            style={[
              styles.joinDesc,
              { color: colors.mutedForeground, textAlign },
            ]}
          >
            {t("business.banks.joinDesc")}
          </AppText>
          <Pressable
            onPress={() => {
              if (isSignedIn) {
                router.push("/business/onboarding");
              } else {
                router.push("/(tabs)/profile");
              }
            }}
            style={styles.joinBtn}
            testID="banks-register-cta"
          >
            <MaterialCommunityIcons
              name="bank-plus"
              size={18}
              color="#FFFFFF"
            />
            <AppText style={styles.joinBtnText}>
              {t("business.banks.joinCta")}
            </AppText>
          </Pressable>
        </View>

        {/* Neutral disclaimer */}
        <View
          style={[
            styles.disclaimer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              flexDirection: rowDir,
            },
          ]}
        >
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <AppText
            style={[
              styles.disclaimerText,
              { color: colors.mutedForeground, textAlign },
            ]}
          >
            {t("business.banks.note")}
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  scroll: { padding: 16, paddingBottom: 120, gap: 12 },

  // Hero
  hero: {
    alignItems: "center",
    padding: 28,
    borderWidth: 1,
    borderRadius: 20,
    gap: 12,
    marginBottom: 8,
  },
  heroBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 21, fontFamily: "Inter_700Bold" },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    maxWidth: 300,
  },

  // Products
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
    marginBottom: 2,
  },
  productCard: {
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  productIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  productTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  productDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },

  // Join CTA
  joinBox: {
    alignItems: "center",
    gap: 12,
    padding: 24,
    borderWidth: 1,
    marginTop: 8,
  },
  joinIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  joinTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  joinDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    textAlign: "center",
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    marginTop: 4,
  },
  joinBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  // Disclaimer
  disclaimer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderWidth: 1,
    alignItems: "flex-start",
    marginTop: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
