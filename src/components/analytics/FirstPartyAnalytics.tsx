"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function paramsObject(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
  };
}

function landingPage(): string {
  const key = "ch_landing_page";
  const current = `${window.location.pathname}${window.location.search}`;
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    sessionStorage.setItem(key, current);
  } catch {
    // sessionStorage may be blocked; current URL is still useful.
  }
  return current;
}

export function FirstPartyAnalytics() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    const url = `${window.location.pathname}${window.location.search}`;
    if (lastTracked.current === url) return;
    lastTracked.current = url;

    const payload = {
      path: url,
      title: document.title,
      referrer: document.referrer,
      landing_page: landingPage(),
      ...paramsObject(window.location.search),
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/admin/collect", blob);
      return;
    }

    fetch("/api/admin/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
