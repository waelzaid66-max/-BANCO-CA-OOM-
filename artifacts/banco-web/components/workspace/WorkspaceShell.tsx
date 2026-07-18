"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isClerkConfigured, signInPath } from "../../lib/clerk-config";
import { localeFromPathname } from "../../lib/hub-config";
import { getMarketUrl } from "../../lib/site-env";
import { workspaceUiCopy } from "../../lib/workspace-ui-copy";

const shellStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "2rem 1.25rem",
  display: "grid",
  gridTemplateColumns: "minmax(180px, 220px) 1fr",
  gap: "1.5rem",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
};

const navLinkStyle: React.CSSProperties = {
  color: "var(--banco-fg)",
  textDecoration: "none",
  padding: "0.45rem 0.65rem",
  borderRadius: 8,
  fontSize: "0.9rem",
  fontWeight: 600,
};

type WorkspaceShellProps = {
  children: ReactNode;
};

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = usePathname() ?? "/workspace";
  const locale = localeFromPathname(pathname);
  const copy = workspaceUiCopy(locale);
  const prefix = locale === "en" ? "/en/workspace" : "/workspace";
  const market = getMarketUrl();
  const clerkOn = isClerkConfigured();

  const links = [
    { href: prefix, label: copy.navOverview, exact: true },
    { href: `${prefix}/listings`, label: copy.navListings },
    { href: `${prefix}/listings/new`, label: copy.navNewListing },
    { href: `${prefix}/leads`, label: copy.navLeads },
    { href: `${prefix}/messages`, label: copy.navMessages },
    { href: `${prefix}/bookings`, label: copy.navBookings },
    { href: `${prefix}/analytics`, label: copy.navAnalytics },
    { href: `${prefix}/wallet`, label: copy.navWallet },
    { href: `${prefix}/b2b`, label: copy.b2bTitle },
  ];

  if (!clerkOn) {
    return (
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.25rem" }}
        data-banco-journey="workspace"
        data-banco-auth="off"
      >
        <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.35rem" }}>{copy.title}</h1>
        <p style={{ color: "var(--banco-muted)", lineHeight: 1.7 }}>{copy.authDisabled}</p>
        <p style={{ marginTop: "0.5rem", color: "var(--banco-muted)", lineHeight: 1.7 }}>
          {copy.signInRequired}
        </p>
        <p style={{ marginTop: "1rem" }}>
          <Link href={signInPath(locale)} style={{ color: "var(--banco-primary)", fontWeight: 700 }}>
            {copy.signInCta}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={shellStyle} data-banco-journey="workspace" data-banco-auth="on">
      <aside aria-label={copy.title}>
        <h1 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>{copy.title}</h1>
        <nav style={navStyle}>
          {links.map((link) => {
            const active =
              link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...navLinkStyle,
                  background: active ? "rgba(232,0,45,0.12)" : "transparent",
                  color: active ? "var(--banco-primary)" : "var(--banco-fg)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          {market ? (
            <a href={market} target="_blank" rel="noreferrer" style={navLinkStyle}>
              {copy.navMarket}
            </a>
          ) : null}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
