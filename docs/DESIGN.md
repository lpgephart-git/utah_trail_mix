# Utah Trail Mix — Design System

*Extracted from the Stitch mockups, 2026-08-11. This is the visual spec we build the real site against.*

## Type

- **Headings / display:** Quicksand (600/700)
- **Body / labels:** Inter (400/600)
- Display 48/56 · Headline-lg 32/40 · Headline-md 24/32 · Body-lg 18/28 · Body 16/24 · Label 14 (uppercase, letter-spacing 0.05em)

## Color (Material 3 warm/earthy — matches "trail mix")

| Token | Hex | Use |
|---|---|---|
| primary | `#8d4b00` | amber-brown, buttons/brand |
| primary-container | `#b15f00` | hover/darker |
| secondary | `#1f6c3a` | trail green, accents |
| secondary-container | `#a4f1b2` | "Easy" badge bg |
| tertiary | `#864d31` | icons, "Easy" badge alt |
| error / error-container | `#ba1a1a` / `#ffdad6` | "Hard/Ambitious" badge |
| background | `#fdf9e9` | warm cream page bg |
| surface-container-lowest | `#ffffff` | cards |
| surface-container | `#f2eede` | footer, muted panels |
| on-surface | `#1c1c13` | text |
| on-surface-variant | `#554336` | muted text |
| outline-variant | `#dbc2b0` | borders |

Radius: cards `xl` (0.75rem), buttons `full` (pill) or `lg`. Soft shadow only.

## Difficulty badge convention (STANDARDIZE — mockups are inconsistent)

Lock to **three** tiers and one color each:
- **Easy** → secondary-container (green)
- **Moderate** → surface-variant (neutral) *(or tertiary)*
- **Ambitious** → error-container (red)

> The mockups mix "Moderate/Hard/Ambitious/Strenuous/Beginner Friendly" — pick Easy / Moderate / Ambitious and use everywhere.

## Page inventory (all designed, mobile + desktop)

1. **Landing** — hero ("Educators who'd rather network on a trail"), two CTAs, "Who walks with us" 4-card grid (Nutrition Pros / School Nurses / Health & PE / Wellness Ed), featured-hike banner.
2. **Schedule** — 3-col grid of hike cards: date, difficulty badge, distance/elevation, AllTrails + Strava links, attendee avatars + "N going", RSVP.
3. **Hike detail** — hero image, stat grid (distance/elevation/time/date), description + "what to bring", route/map area, sidebar RSVP card (guests, carpool, dietary), attendee list w/ trail-leader star, "spots remaining."
4. **Join** — name, email, role (dropdown), district/school, "Count me in."

## Nice features Stitch added (keep for Phase 2+)

- Carpool preference on RSVP (drive / need a ride / meet there)
- Post-hike snack/dietary restrictions field
- "Spots remaining" capacity cap
- Trail-leader badge on attendee avatars
- "What to bring" checklist per hike

## Fixes / decisions before/while building

- [ ] Footer year `© 2024` → **2026**
- [ ] **Standardize role dropdown** to nutrition-forward list everywhere: Nutrition / food service · School nurse · Health / PE · Counselor / wellness · Other educator. (One mockup drifted to Teacher/Admin/Counselor.)
- [ ] **Standardize nav / IA** — mockups vary (Our Mission·Find a Trail·Professional Wellness vs Dashboard·Schedule·Community vs Home·About·Schedule). Proposed: **Home · Schedule · About · Join**.
- [ ] All images are temporary AI-generated URLs (googleusercontent) — **will expire**; replace with real trail photos before launch.
- [ ] Trail data is placeholder & inconsistent (e.g. Mount Olympus shown with a red-rock desert photo; it's Wasatch granite). Replace with verified trails + correct dates.
- [ ] Tailwind + Material Symbols via CDN is fine for prototype; for the real Next.js build, port these tokens into the Tailwind config and swap Material Symbols for an icon set we install.

## Build notes

Port the color tokens above into `tailwind.config`, load Quicksand + Inter via `next/font`, and build the four pages as the Phase 1 app on Next.js + Supabase (see PLAN.md §6). The Stitch HTML is the pixel reference, not the codebase.
