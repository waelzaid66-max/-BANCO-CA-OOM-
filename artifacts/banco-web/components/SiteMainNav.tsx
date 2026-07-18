"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chromeCopy } from "../lib/chrome-copy";
import {
  adminNavItems,
  browseNavItems,
  marketNavItems,
} from "../lib/chrome-nav";
import { localeFromPathname } from "../lib/hub-config";
import { isWebMarketCopyEnabled } from "../lib/market-copy-config";
import {
  getAdminUrl,
  getAppStoreUrls,
  getMarketUrl,
} from "../lib/site-env";
import { workspaceUiCopy } from "../lib/workspace-ui-copy";
import { SiteNavDropdown } from "./SiteNavDropdown";
import { SiteAuthControls } from "./SiteAuthControls";
import { LocaleSwitcher } from "./LocaleSwitcher";

const navStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.65rem",
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  color: "var(--banco-fg)",
  textDecoration: "none",
  fontSize: "0.9rem",
  fontWeight: 600,
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 20,
  background: "var(--banco-border)",
  marginInline: "0.15rem",
};

export function SiteMainNav() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const copy = chromeCopy(locale);
  const marketBase = getMarketUrl();
  const adminBase = getAdminUrl();
  const stores = getAppStoreUrls();

  const browse = browseNavItems(locale);

  const appItems = [
    stores.android ? { href: stores.android, label: copy.appAndroid, external: true as const } : null,
    stores.ios ? { href: stores.ios, label: copy.appIos, external: true as const } : null,
  ].filter(Boolean) as { href: string; label: string; external: true }[];

  const webMarketCopy = isWebMarketCopyEnabled();
  const webMarketHref = locale === "en" ? "/en/workspace/b2b" : "/workspace/b2b";
  const marketItems = [
    ...(webMarketCopy
      ? [
          {
            href: webMarketHref,
            label: workspaceUiCopy(locale).marketNavWebCopy,
            external: false as const,
          },
        ]
      : []),
    ...(marketBase
      ? marketNavItems(marketBase, locale).map((item) => ({ ...item, external: true as const }))
      : []),
  ];

  const managementItems = adminBase
    ? adminNavItems(adminBase, locale).map((item) => ({ ...item, external: true as const }))
    : [];

  return (
    <nav style={navStyle} aria-label={copy.navAria}>
      {browse.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              ...linkStyle,
              color: active ? "var(--banco-primary)" : "var(--banco-fg)",
            }}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}

      <span style={dividerStyle} aria-hidden />

      {appItems.length > 0 ? (
        <SiteNavDropdown label={copy.appMenu} items={appItems} />
      ) : (
        <span style={{ ...linkStyle, color: "var(--banco-muted)", fontWeight: 500 }}>{copy.appSoon}</span>
      )}

      {marketItems.length > 0 ? (
        <SiteNavDropdown label={copy.marketMenu} items={marketItems} />
      ) : (
        <span style={{ ...linkStyle, color: "var(--banco-muted)", fontWeight: 500 }}>{copy.marketSoon}</span>
      )}

      {managementItems.length > 0 ? (
        <SiteNavDropdown label={copy.managementMenu} items={managementItems} alignEnd />
      ) : null}

      <span style={dividerStyle} aria-hidden />

      <SiteAuthControls locale={locale} />
      <LocaleSwitcher />
    </nav>
  );
}
