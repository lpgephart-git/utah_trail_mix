# Utah Trail Mix

A hiking community site for Utah educators — nutrition pros, school nurses, health & PE
teachers, and wellness folks. Monthly Wasatch Front hikes with a schedule, custom RSVPs,
a per-hike comment board, and admin-managed hikes.

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **Supabase** (Postgres +
Auth). Planning notes live in [`docs/`](docs) (PLAN, DESIGN, TRAILS).

## Preview mode (no setup)

```bash
npm run dev
```

Open http://localhost:3000. With no Supabase credentials the site runs on **seed data**
so you can click through the landing, schedule, and a hike page immediately. Sign-up,
RSVP, comments, and admin activate once Supabase is connected.

## Going live with Supabase (free tier)

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Run the SQL** in the SQL editor, in this order:
   - [`supabase/schema.sql`](supabase/schema.sql) — profiles, hikes, rsvps, per-hike
     comments, RLS, and the new-user trigger.
   - [`supabase/community.sql`](supabase/community.sql) — community feed (posts,
     replies, likes) + the `post-images` storage bucket.
   - [`supabase/profile-photos.sql`](supabase/profile-photos.sql) — profile photos
     (`avatar_path` + the `avatars` storage bucket).
   - [`supabase/seed.sql`](supabase/seed.sql) — optional: five sample hikes.
3. **Add env vars:** copy `.env.local.example` → `.env.local` and fill in the Project URL
   and anon key (Supabase → Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Restart `npm run dev`.** The app now uses the database.

### Email templates (REQUIRED for the 6-digit code)

Signup/login is passwordless: members get a **6-digit code** to type in (no link to click,
so corporate/school email scanners can't consume it). For the code to appear, the email
must include `{{ .Token }}`.

Supabase → Authentication → Email Templates → edit **both** "Confirm signup" and
"Magic Link", setting the body to something like:

```html
<h2>Welcome to Utah Trail Mix 🥾</h2>
<p>Here's your sign-in code:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>Enter it on the site to finish signing in. The code expires in about an hour.
If you didn't request it, you can ignore this email.</p>
```

Subject, e.g.: `Your Utah Trail Mix sign-in code`.

URL Configuration / redirect allow-lists aren't needed for the code flow, but setting
**Site URL** to your deployed URL is still good practice.

> Note: Supabase's built-in email sender is rate-limited (a few/hour, testing only).
> For real use, configure custom SMTP (Authentication → SMTP Settings) — Gmail SMTP works
> without a domain via an app password; Resend/SendGrid/Postmark need a verified domain.

### Make yourself an admin

Sign up once through the site, then in the Supabase SQL editor:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

Admins get the **Admin** nav link and can create, edit, publish, and delete hikes.
RLS enforces this at the database level too.

## Maps & embeds (reliable + free)

Per hike you can set three optional fields in the admin form:

- **Strava embed code** — build a public route in Strava, then Share → Embed → Copy Embed
  Code and paste the whole snippet (the `<div class="strava-embed-placeholder">…</div>`
  plus its script). It hydrates into an interactive map on the hike page.
- **AllTrails URL** — deep link out to the full trail page (free, no account needed).
- **Google Maps directions URL** — e.g. `https://maps.google.com/?q=<trailhead>`.

The hike page shows whatever is present and skips the rest.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com](https://vercel.com) (free Hobby plan).
3. Add the same env vars, setting `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
4. Add `https://your-app.vercel.app/**` to Supabase's redirect allow-list.

## Project map

```
src/app             routes: landing, schedule, about, join, login, welcome,
                    hikes/[id], admin/*, auth/*
src/components      SiteHeader, SiteFooter, HikeCard, RsvpPanel, CommentForm, HikeForm
src/lib             supabase clients, data access, types, seed data, formatting
supabase/schema.sql database schema + RLS
src/proxy.ts        session refresh + /admin guard (Next 16 "proxy" convention)
```
