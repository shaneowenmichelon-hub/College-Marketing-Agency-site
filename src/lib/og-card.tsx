import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

/** Shared text-only social card. No client logos. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function renderOgCard(input: {
  kicker: string;
  title: string;
  accent: string;
  detail?: string;
}) {
  const titleSize = input.title.length > 28 ? 58 : 72;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0F",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "#2F5BFF" }} />
          <div style={{ color: "#ffffff", fontSize: "30px", fontWeight: 700 }}>{siteConfig.companyName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1000px" }}>
          <div style={{ color: "#C6FF3D", fontSize: "26px", fontWeight: 700, letterSpacing: "0.08em" }}>
            {input.kicker.toUpperCase()}
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.05,
              marginTop: "18px",
            }}
          >
            {input.title}
          </div>
          <div style={{ color: "#C6FF3D", fontSize: "40px", fontWeight: 700, lineHeight: 1.15, marginTop: "12px" }}>
            {input.accent}
          </div>
          {input.detail ? (
            <div style={{ color: "#B9B9C3", fontSize: "28px", marginTop: "16px" }}>{input.detail}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#C6FF3D", fontSize: "26px", fontWeight: 700 }}>{siteConfig.companyDomain}</div>
          <div style={{ color: "#B9B9C3", fontSize: "22px" }}>Campus marketing for brands</div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
