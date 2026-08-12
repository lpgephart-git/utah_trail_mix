export function formatHikeDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
}

export function formatDistance(miles: number | null): string | null {
  if (miles == null) return null;
  return `${miles} mi`;
}

export function formatElevation(ft: number | null): string | null {
  if (ft == null) return null;
  return `${ft.toLocaleString("en-US")} ft gain`;
}
