"use client";

import { usePathname } from "next/navigation";
import { localeFromPathname } from "../../lib/hub-config";
import { marketNavItems } from "../../lib/chrome-nav";
import { getMarketUrl } from "../../lib/site-env";
import { workspaceUiCopy } from "../../lib/workspace-ui-copy";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "0.65rem",
  marginTop: "1rem",
};

const linkStyle: React.CSSProperties = {
  display: "block",
  border: "1px solid var(--banco-border)",
  borderRadius: "var(--banco-radius)",
  background: "var(--banco-card)",
  padding: "0.75rem 0.9rem",
  color: "var(--banco-primary)",
  fontWeight: 600,
  fontSize: "0.9rem",
  textDecoration: "none",
};

export function WorkspaceB2bPanel() {
  const pathname = usePathname() ?? "/workspace/b2b";
  const locale = localeFromPathname(pathname);
  const copy = workspaceUiCopy(locale);
  const market = getMarketUrl();
  const links = market ? marketNavItems(market, locale) : [];

  return (
    <>
      <h2 style={{ margin: "0 0 0.75rem" }}>{copy.b2bTitle}</h2>
      <p style={{ color: "var(--banco-muted)", lineHeight: 1.7, margin: 0 }}>{copy.b2bBody}</p>
      {market ? (
        <>
          <p style={{ margin: "1rem 0 0.35rem", fontWeight: 600, fontSize: "0.9rem" }}>
            {copy.b2bMarketLinks}
          </p>
          <div style={gridStyle}>
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {item.label}
              </a>
            ))}
          </div>
          <p style={{ margin: "1rem 0 0", fontSize: "0.85rem", color: "var(--banco-muted)" }}>
            {copy.b2bMarketNote}
          </p>
        </>
      ) : (
        <p style={{ marginTop: "1rem", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
          {copy.b2bMarketDisabled}
        </p>
      )}
    </>
  );
}
