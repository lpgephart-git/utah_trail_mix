import type { Hike } from "@/lib/types";

// Hikes don't store an end time, so assume a 2-hour block for the calendar event.
const DURATION_MS = 2 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** ISO timestamp → iCalendar UTC basic format, e.g. 20260919T150000Z */
export function toICSDate(iso: string): string {
  const d = new Date(iso);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function endISO(startISO: string): string {
  return new Date(new Date(startISO).getTime() + DURATION_MS).toISOString();
}

function esc(s: string): string {
  return (s || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** A full VCALENDAR document for one hike (served as an .ics download). */
export function buildICS(hike: Hike, eventUrl: string, stampISO: string): string {
  const desc = [hike.notes, eventUrl].filter(Boolean).join("\n\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Utah Trail Mix//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:hike-${hike.id}@utah-trail-mix`,
    `DTSTAMP:${toICSDate(stampISO)}`,
    `DTSTART:${toICSDate(hike.starts_at)}`,
    `DTEND:${toICSDate(endISO(hike.starts_at))}`,
    `SUMMARY:${esc(`Utah Trail Mix: ${hike.title}`)}`,
    `LOCATION:${esc(hike.trailhead)}`,
    `DESCRIPTION:${esc(desc)}`,
    `URL:${eventUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** A Google Calendar "create event" template link. */
export function googleCalUrl(hike: Hike, eventUrl: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Utah Trail Mix: ${hike.title}`,
    dates: `${toICSDate(hike.starts_at)}/${toICSDate(endISO(hike.starts_at))}`,
    details: [hike.notes, eventUrl].filter(Boolean).join("\n\n"),
    location: hike.trailhead || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
