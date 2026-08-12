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

### Brand the verification email

Supabase → Authentication → Email Templates → **Magic Link** (this flow uses a magic
link to verify, then the member sets a password on `/welcome`). Customize the subject and
body for Utah Trail Mix, e.g.:

> **Subject:** Confirm your spot with Utah Trail Mix 🥾
> **Body:** Welcome to the trail! Tap below to confirm your email and set your password.
> `{{ .ConfirmationURL }}`

Also set **Authentication → URL Configuration → Site URL** to your site, and add
`http://localhost:3000/**` (and later your Vercel URL) to the redirect allow-list.

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

- **Strava route embed URL** — build a public route in Strava's planner and paste its
  embed URL; it renders as an interactive map on the hike page.
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
