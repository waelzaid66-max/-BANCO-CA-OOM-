"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getAdminUrl,
  getAppStoreUrls,
  getMarketUrl,
} from "../lib/site-env";
import { chromeCopy } from "../lib/chrome-copy";
import { adminNavItems, browseNavItems, marketNavItems } from "../lib/chrome-nav";
import { localeFromPathname, localizedPath } from "../lib/hub-config";
import { writeStoredLocale } from "../lib/locale-preference";
import { BrandMark } from "./BrandMark";
import { SiteMainNav } from "./SiteMainNav";

const headerStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--banco-border)",
  background: "rgba(0,0,0,0.92)",
  backdropFilter: "blur(10px)",
  position: "sticky",
  top: 0,
  zIndex: 50,
};

const innerStyle: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "0.65rem 1.15rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.85rem",
  flexWrap: "wrap",
};

const footerStyle: React.CSSProperties = {
  borderTop: "1px solid var(--banco-border)",
  marginTop: "2.5rem",
  padding: "1.5rem 1.25rem 2rem",
  color: "var(--banco-muted)",
  fontSize: "0.85rem",
};

const footerGridStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "1rem",
};

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const copy = chromeCopy(locale);
  const market = getMarketUrl();
  const admin = getAdminUrl();
  const stores = getAppStoreUrls();
  const browse = browseNavItems(locale);

  const isDirectoryHub =
    pathname === "/directory" || pathname === "/en/directory";

  useEffect(() => {
    if (locale === "ar" && !pathname.startsWith("/listing/")) {
      writeStoredLocale("ar");
    }
  }, [locale, pathname]);

  if (isDirectoryHub) {
    return <div id="main-content">{children}</div>;
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={innerStyle}>
          <BrandMark href={copy.homeHref} ariaLabel={copy.brandAria} size="header" />
          <SiteMainNav />
        </div>
      </header>
      <div id="main-content">{children}</div>
      <footer style={footerStyle}>
        <div style={footerGridStyle}>
          <div>
            <strong style={{ color: "var(--banco-fg)" }}>{copy.browse}</strong>
            <p style={{ margin: "0.5rem 0 0", lineHeight: 1.8 }}>
              {browse.map((item, i) => (
                <span key={item.href}>
                  {i > 0 ? " · " : null}
                  <Link href={item.href}>{item.label}</Link>
                </span>
              ))}
              {" · "}
              <Link href={localizedPath("/directory", locale)}>
                {locale === "ar" ? "دليل المنصات" : "Platform directory"}
              </Link>
            </p>
          </div>
          <div>
            <strong style={{ color: "var(--banco-fg)" }}>{copy.platforms}</strong>
            <p style={{ margin: "0.5rem 0 0", lineHeight: 1.8 }}>
              {market ? (
                <>
                  <a href={market} target="_blank" rel="noreferrer">
                    {copy.marketLabel}
                  </a>
                  {marketNavItems(market, locale).slice(1, 4).map((item) => (
                    <span key={item.href}>
                      {" · "}
                      <a href={item.href} target="_blank" rel="noreferrer">
                        {item.label}
                      </a>
                    </span>
                  ))}
                </>
              ) : (
                copy.marketSoon
              )}
            </p>
            {admin ? (
              <p style={{ margin: "0.35rem 0 0", lineHeight: 1.8 }}>
                <strong style={{ color: "var(--banco-fg)" }}>{copy.managementMenu}</strong>
                {" · "}
                {adminNavItems(admin, locale).slice(0, 3).map((item, i) => (
                  <span key={item.href}>
                    {i > 0 ? " · " : null}
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <div>
            <strong style={{ color: "var(--banco-fg)" }}>{copy.app}</strong>
            <p style={{ margin: "0.5rem 0 0", lineHeight: 1.8 }}>
              {stores.android ? (
                <a href={stores.android} target="_blank" rel="noreferrer">
                  {copy.appAndroid}
                </a>
              ) : (
                copy.androidSoon
              )}
              {" · "}
              {stores.ios ? (
                <a href={stores.ios} target="_blank" rel="noreferrer">
                  {copy.appIos}
                </a>
              ) : (
                copy.iosSoon
              )}
            </p>
          </div>
        </div>
        <p style={{ textAlign: "center", margin: "1.25rem 0 0" }}>
          © {new Date().getFullYear()} BANCO
        </p>
      </footer>
    </>
  );
}
