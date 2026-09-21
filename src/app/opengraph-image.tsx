import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

// Branded 1200x630 PNG used as the default social-share image for the whole site
// (a real raster image — Facebook/LinkedIn/X/Slack don't reliably render SVG OG
// images). Pages can still override with their own openGraph.images.
export const runtime = "edge";
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ffffff", fontSize: "78px", fontWeight: 800, lineHeight: 1.02 }}>
            Where brands meet
          </div>
          <div style={{ color: "#C6FF3D", fontSize: "78px", fontWeight: 800, lineHeight: 1.02 }}>
            campus culture.
          </div>
          <div style={{ color: "#B9B9C3", fontSize: "30px", marginTop: "24px", maxWidth: "860px" }}>
            {siteConfig.tagline}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#C6FF3D", fontSize: "26px", fontWeight: 700 }}>{siteConfig.companyDomain}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {["Events", "Ambassadors", "Product Placement"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  border: "2px solid #2F5BFF",
                  color: "#ffffff",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "20px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
