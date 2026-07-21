"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Client } from "@/site.config";

/**
 * A single logo tile with staged fallback:
 *   1. self-hosted /logos/<file>  →  2. live remote source  →  3. name wordmark
 * This guarantees a real logo shows on the live site even if the self-hosted
 * file hasn't been fetched yet, and never renders a broken image.
 */
function ClientLogo({ client, onDark }: { client: Client; onDark: boolean }) {
  const local = `/logos/${client.file}`;
  const [src, setSrc] = useState(local);
  const [failed, setFailed] = useState(false);

  const tile = cn(
    "flex h-16 w-40 items-center justify-center rounded-xl border px-4",
    onDark
      ? "border-[color:var(--border-on-dark)] bg-white/[0.04]"
      : "border-[color:var(--border-on-light)] bg-white",
  );

  if (failed) {
    return (
      <div className={tile}>
        <span
          className={cn(
            "text-center text-sm font-semibold tracking-tight",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {client.name}
        </span>
      </div>
    );
  }

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={client.name}
      loading="lazy"
      className="max-h-10 max-w-[8.5rem] object-contain"
      onError={() => {
        // fall back to the remote source once, then to the wordmark.
        if (client.remote && src !== client.remote) setSrc(client.remote);
        else setFailed(true);
      }}
    />
  );

  return (
    <div className={tile}>
      {client.url ? (
        <a href={client.url} target="_blank" rel="noopener noreferrer" aria-label={client.name}>
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}

/** Revolving marquee of real client logos. Pauses on hover; static under reduced motion. */
export function ClientMarquee({
  clients,
  onDark = false,
}: {
  clients: Client[];
  onDark?: boolean;
}) {
  const doubled = [...clients, ...clients];
  return (
    <div className="group relative overflow-hidden" role="region" aria-label="Client logos">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />
      <ul className="marquee-track flex w-max animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
        {doubled.map((client, i) => (
          <li key={`${client.file}-${i}`} aria-hidden={i >= clients.length}>
            <ClientLogo client={client} onDark={onDark} />
          </li>
        ))}
      </ul>
    </div>
  );
}
