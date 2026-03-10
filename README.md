# SubletSync

**The trusted sublease marketplace for students.**
Verified .edu listings, scam-free messaging, and a beautiful premium experience — no server required.

---

## What's included

| File | Description |
|------|-------------|
| `subletsync.html` | Landing page |
| `browse.html` | Browse & search listings |
| `listing.html` | Single listing detail |
| `auth.html` | Sign in / Create account |
| `post.html` | Post a listing (4-step form) |
| `dashboard.html` | User dashboard (listings, saved, messages) |
| `messages.html` | Real-time messaging |
| `app.js` | Supabase client, data layer, utilities, nav |
| `schema.sql` | Full Supabase database schema + RLS policies |

---

## Setup Guide

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and click **Start for free**
2. Create a new project — choose a region close to your users
3. Wait ~2 minutes for the project to provision

### Step 2 — Run the schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste the entire contents of `schema.sql`
4. Click **Run**

This creates:
- `profiles` table (extends auth.users)
- `listings` table
- `messages` table
- `saved_listings` table
- All Row Level Security (RLS) policies
- Indexes for fast queries
- Storage bucket `listing-images`

### Step 3 — Get your API keys

1. In Supabase, go to **Settings → API**
2. Copy your **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
3. Copy your **anon / public** key (starts with `eyJ…`)

### Step 4 — Update app.js

Open `app.js` and replace the placeholder values at the top:

```js
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';   // ← paste your URL here
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY_HERE';              // ← paste your anon key here
```

### Step 5 — Create the storage bucket (if not auto-created)

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Name it exactly: `listing-images`
4. Check **Public bucket** ✓
5. Click **Create bucket**

> The schema.sql tries to create this automatically, but the storage API sometimes needs the UI.

### Step 6 — Enable email auth

1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled (it is by default)
3. Optional: Disable "Confirm email" for easier testing (Auth → Email Templates → toggle "Enable email confirmations")

### Step 7 — Deploy

**Option A — GitHub Pages (free)**
1. Push this folder to a GitHub repo
2. Go to repo **Settings → Pages**
3. Set source to main branch, root folder
4. Your site is live at `https://yourusername.github.io/repo-name/subletsync.html`

**Option B — Netlify (free, easiest)**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop this entire folder onto the deploy zone
3. Done — live URL in seconds

**Option C — Vercel (free)**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this folder
3. Follow the prompts

---

## Demo Mode

If `SUPABASE_URL` still contains `YOUR_PROJECT_ID`, the app runs in **demo mode**:
- 8 realistic Austin/UT listings are shown (hardcoded in `app.js`)
- Auth uses `localStorage` (sessions are local only)
- Saved listings and messages use `localStorage`
- A banner alerts users they're in demo mode

Demo mode is great for showing the UI without any backend setup.

---

## Customizing

### Change the city / listings
Edit the `DEMO_LISTINGS` array in `app.js` to feature your own city.

### Add your university's branding
The color `#BF5700` is UT Burnt Orange. Change `--accent` in each file's `:root` block.

### Add more amenities
The amenity list is in `post.html` (step 3) and `app.js` (`AMENITY_ICONS` object in `listing.html`).

### Set up email notifications
Use Supabase Edge Functions or a third-party service like Resend to send email when a new message arrives.

---

## Security Notes

- All database access is controlled by **Row Level Security (RLS)** — users can only read/write their own data
- The `anon` key is safe to expose in client-side code (it's designed for public access)
- Never commit your `service_role` key to a public repo
- `.edu` verification is done by email domain — it's a trust signal, not a hard gate
- The app warns users to never send money before signing a lease

---

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Fonts**: Cormorant Garamond (display) + Plus Jakarta Sans (body) via Google Fonts
- **Hosting**: Any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages)

---

## License

MIT — use it, fork it, build your own campus marketplace.
