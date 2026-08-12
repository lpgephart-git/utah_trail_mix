"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a Strava route/activity embed. Strava's share dialog gives a
 * `<div class="strava-embed-placeholder" …></div>` plus a script that converts
 * the div into a map in the browser — so we drop the placeholder in, then load
 * strava-embeds.com/embed.js to hydrate it. (Not an iframe URL.)
 */
export function StravaEmbed({ snippet }: { snippet: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The inline <script> in the snippet is inert when set via innerHTML, so we
    // add a live one below.
    el.innerHTML = snippet;
    const script = document.createElement("script");
    script.src = "https://strava-embeds.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
      el.innerHTML = "";
    };
  }, [snippet]);

  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-outline-variant">
      <div ref={ref} />
    </div>
  );
}
