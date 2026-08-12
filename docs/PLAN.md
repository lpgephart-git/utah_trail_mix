# Utah Trail Mix — Planning Doc

*Draft v2 · 2026-08-11*

> **Locked:** Name = **Utah Trail Mix** · Geography = **Wasatch Front** (SLC area) to kick off.

A Utah hiking/outdoors community for educators — with a nutrition focus, deliberately
widened to nurses and other school-wellness folks. The real engine underneath is
**genuine professional networking**: hikes are the honest, low-pressure excuse to reach
out and build relationships.

---

## 1. The concept in one sentence

> A friendly, well-run hiking group for Utah educators (nutrition-first, wellness-wide)
> that runs a monthly-ish trail schedule people can sign up for on a nice website — and
> that quietly doubles as your networking flywheel.

**Why this works:** nutrition professionals are a smaller pool, so anchoring to the
adjacent-and-eager crowd (nurses, PE/health teachers, counselors, wellness coordinators)
gives you critical mass *and* keeps every hike full of people worth knowing.

---

## 2. Name — LOCKED: **Utah Trail Mix**

"Trail Mix" is a nutrition pun, it's literally hiking, and "mix" captures the whole point
(mixing educators from different roles together). "Utah" roots it locally and reads well.

Branding directions to explore later: trail-mix-ingredient palette (nuts/berries/oats =
warm earth tones + a pop of berry red), a topo-line motif, a simple peak/logo mark.

---

## 3. Who it's for (concentric circles)

1. **Core:** K–12 / higher-ed **nutrition** professionals (school nutrition directors,
   dietitians, food-service educators, nutrition faculty).
2. **Natural allies:** **school nurses** and health/PE teachers — high overlap in mindset,
   more likely to jump at an outdoor invite.
3. **Wider net:** counselors, wellness coordinators, coaches, and educators generally who
   want movement + connection.

Keep the *door* wide open — **anyone who works at a Utah school or district is welcome**,
from teachers to nutrition/food service to nurses, counselors, coaches, front office,
custodial, bus drivers, and admin. Lead with warmth and inclusion; let the nutrition/
wellness flavor be a *heart*, never a gate.

---

## 4. Cadence & timeline

- **Fall 2026 — Kickoff hike (this year):** one easy, accessible, social hike to start the
  school year. Low stakes, high welcome. Goal: prove people will show up.
- **Summer 2027 — Monthly:** roughly one hike/month, May–September, escalating if there's
  appetite.
- **Flex:** add spontaneous hikes when the group wants them.

Rule of thumb: **it lives or dies on hike #1 attendance, not on the website.** Build just
enough site to look legit and take signups, then pour energy into the first turnout.

---

## 5. What the site needs to do

Since we're building **custom signups** (your call), the site is a real (small) app:

**Phase 1 — Launch (what we build first):**
- Beautiful landing page: the vibe, who it's for, the mission
- **Hike schedule** — upcoming hikes as cards
- Each hike card: date/time, trailhead, difficulty, distance/elevation, meetup notes,
  **AllTrails map link**, optional **Strava route/activity link**
- **Sign up / RSVP** per hike (name, email, role/district, "bringing +1?")
- Simple **member signup** (join the group even before RSVPing a specific hike)
- Organizer view: see who's coming to each hike

**Phase 2 — Community (once there's a group):**
- Member accounts / profiles
- A **board** — could be leadership roles *and/or* a discussion/announcement feed
- Post-hike photos, recaps, Strava kudos
- Email blasts / reminders before each hike

**Phase 3 — Nice-to-haves:**
- Waitlists & capacity caps per hike
- Carpool coordination
- Recurring calendar (.ics) invites
- Weather-aware reminders

---

## 6. Proposed tech (low-cost, custom, yours)

Designed so one person can run it cheaply and it can grow into Phase 2/3 without a rewrite.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js** (React) | One codebase for pages + API; great DX; deploys free-ish |
| DB + Auth + storage | **Supabase** (hosted Postgres) | Gives you a real database, member auth, and photo storage out of the box — huge shortcut vs. rolling your own |
| Hosting | **Vercel** | Free tier fine to start; push-to-deploy |
| Styling | **Tailwind CSS** | Fast path to "really nice" without a design team |
| Email | **Resend** (or Supabase) | RSVP confirmations + reminders |

Rough data model (Phase 1):
- `members` — id, name, email, role, district, joined_at
- `hikes` — id, title, date, trailhead, difficulty, distance, elevation_gain,
  strava_embed, alltrails_url, gmaps_url, notes, capacity
- `rsvps` — id, hike_id, member_id, guests, status, created_at

Everything above stays valid as we add profiles and a board later.

### Maps & trail links — LOCKED (reliable + free, no API keys)

- **In-platform map:** **Strava route embed** (free, no API key, just a paste-in snippet).
  Build each upcoming hike as a public route in Strava's planner; embed it on the hike
  page. Swap to the real *activity* after the hike for a nice post-hike touch.
- **Trail info/reviews:** **AllTrails deep link** out (free; no AllTrails+ needed since
  we only link, not embed). AllTrails has no public API and its map embeds may require
  AllTrails+, so we don't depend on them.
- **Directions:** plain **Google Maps link** to the trailhead (free, no API key). We skip
  the *embedded* Google map because only the iframe version needs a key + billing.

Hike page renders whatever's present and gracefully skips what isn't — so every hike has
at minimum an AllTrails link + a directions link, with the Strava map when a route exists.

---

## 7. Candidate Utah trails (verify before publishing)

Aim for a *range* of difficulty so nobody self-selects out — networking group means
accessible-first, with occasional "ambitious" options.

**Easy / social (great for kickoff & mixed groups):**
- Ensign Peak (SLC) — short, big city views
- Silver Lake boardwalk (Brighton) — flat, accessible, gorgeous
- Donut Falls (Big Cottonwood) — family-friendly, waterfall payoff
- The Living Room (SLC foothills) — short, iconic "chairs" viewpoint

**Moderate (summer prime):**
- Cecret Lake / Albion Basin (Alta) — legendary July wildflowers
- Stewart Falls (Sundance) — waterfall, moderate
- Bells Canyon lower falls (Sandy)

**Ambitious (for the eager crowd):**
- Lake Blanche (Big Cottonwood) — steep but stunning
- Grandeur Peak / Mount Olympus — peak-baggers

> ⚠️ Confirm current trail status, seasonality, parking, and Cottonwood Canyon access
> rules (they change) before committing dates.

---

## 8. Open decisions (for you)

1. ~~**Name**~~ — ✅ **Utah Trail Mix**
2. ~~**Geography**~~ — ✅ **Wasatch Front** (SLC area) to start
3. **Kickoff date & trail** — which fall weekend, which easy trail?
4. **How public** — anyone can join, or invite/approve to keep it educator-only?
5. **Your time budget** — how hands-on do you want to be with the code vs. me scaffolding it?

---

## 9. Suggested next steps

1. Lock the name + kickoff hike (date + trail).
2. I scaffold the Phase 1 site (landing + schedule + RSVP) — you review the look.
3. Seed it with the kickoff hike, share the link, drive turnout.
4. After hike #1, decide whether Phase 2 (board/community) is worth building.
