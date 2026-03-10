-- ================================================================
-- SubletSync — Supabase Database Schema
-- Run this in the Supabase SQL Editor (supabase.com/dashboard)
-- ================================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────
-- Extends Supabase auth.users with public profile data
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  name          text,
  bio           text,
  university    text,
  grad_year     int,
  avatar_url    text,
  is_edu        boolean generated always as (email ilike '%.edu') stored,
  trust_score   int not null default 70 check (trust_score between 0 and 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, university, grad_year)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'university',
    (new.raw_user_meta_data->>'grad_year')::int
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── Listings ──────────────────────────────────────────────────
create table if not exists public.listings (
  id              uuid primary key default uuid_generate_v4(),
  lister_id       uuid not null references public.profiles(id) on delete cascade,
  title           text not null check (char_length(title) between 5 and 120),
  address         text not null,
  city            text not null,
  state           char(2) not null,
  price           int not null check (price > 0),
  bedrooms        int not null default 1 check (bedrooms >= 0),
  bathrooms       numeric(3,1) not null default 1 check (bathrooms > 0),
  sqft            int check (sqft > 0),
  description     text check (char_length(description) >= 20),
  available_from  date not null,
  available_to    date not null check (available_to > available_from),
  furnished       boolean not null default false,
  sublease_type   text not null default 'whole_unit' check (sublease_type in ('whole_unit','private_room')),
  amenities       text[] not null default '{}',
  photos          text[] not null default '{}',
  status          text not null default 'active' check (status in ('active','filled','removed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- ── Messages ──────────────────────────────────────────────────
create table if not exists public.messages (
  id           uuid primary key default uuid_generate_v4(),
  listing_id   uuid not null references public.listings(id) on delete cascade,
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  receiver_id  uuid not null references public.profiles(id) on delete cascade,
  content      text not null check (char_length(content) between 1 and 5000),
  read         boolean not null default false,
  created_at   timestamptz not null default now(),
  constraint no_self_message check (sender_id <> receiver_id)
);

-- ── Saved Listings ────────────────────────────────────────────
create table if not exists public.saved_listings (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, listing_id)
);

-- ================================================================
-- INDEXES
-- ================================================================
create index if not exists idx_listings_city         on public.listings(city);
create index if not exists idx_listings_price        on public.listings(price);
create index if not exists idx_listings_status       on public.listings(status);
create index if not exists idx_listings_available_from on public.listings(available_from);
create index if not exists idx_listings_lister_id    on public.listings(lister_id);
create index if not exists idx_listings_created_at   on public.listings(created_at desc);
create index if not exists idx_messages_listing      on public.messages(listing_id);
create index if not exists idx_messages_sender       on public.messages(sender_id);
create index if not exists idx_messages_receiver     on public.messages(receiver_id);
create index if not exists idx_messages_created      on public.messages(created_at);
create index if not exists idx_saved_user            on public.saved_listings(user_id);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
alter table public.profiles        enable row level security;
alter table public.listings        enable row level security;
alter table public.messages        enable row level security;
alter table public.saved_listings  enable row level security;

-- ── Profiles RLS ─────────────────────────────────────────────
-- Anyone can read public profiles
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can only update their own profile
create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role handles inserts via trigger
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── Listings RLS ──────────────────────────────────────────────
-- Anyone can read active listings
create policy "listings_public_read"
  on public.listings for select
  using (status = 'active' or auth.uid() = lister_id);

-- Authenticated users can create listings
create policy "listings_authenticated_insert"
  on public.listings for insert
  with check (auth.uid() = lister_id);

-- Listers can update their own listings
create policy "listings_own_update"
  on public.listings for update
  using (auth.uid() = lister_id);

-- Listers can delete their own listings
create policy "listings_own_delete"
  on public.listings for delete
  using (auth.uid() = lister_id);

-- ── Messages RLS ──────────────────────────────────────────────
-- Users can read their own messages (sent or received)
create policy "messages_own_read"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Authenticated users can send messages
create policy "messages_authenticated_insert"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Receivers can mark messages as read
create policy "messages_mark_read"
  on public.messages for update
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);

-- ── Saved Listings RLS ────────────────────────────────────────
-- Users can read their own saved listings
create policy "saved_own_read"
  on public.saved_listings for select
  using (auth.uid() = user_id);

-- Users can save listings
create policy "saved_own_insert"
  on public.saved_listings for insert
  with check (auth.uid() = user_id);

-- Users can unsave listings
create policy "saved_own_delete"
  on public.saved_listings for delete
  using (auth.uid() = user_id);

-- ================================================================
-- STORAGE BUCKET
-- (Run separately or in Storage tab — this SQL creates the bucket)
-- ================================================================
insert into storage.buckets (id, name, public)
  values ('listing-images', 'listing-images', true)
  on conflict (id) do nothing;

-- Allow authenticated users to upload images
-- Listing images: stored under {user_id}/{filename}
-- Avatar images: stored under avatars/{user_id}.{ext}
create policy "listing_images_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

-- Allow authenticated users to overwrite/update their uploads (upsert)
create policy "listing_images_update"
  on storage.objects for update
  using (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

-- Anyone can view listing images (public bucket)
create policy "listing_images_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Users can delete their own listing uploads (stored at {user_id}/...)
create policy "listing_images_own_delete"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and (
      -- Listing photos: first folder segment is user ID
      auth.uid()::text = (storage.foldername(name))[1]
      -- Avatar photos: stored as avatars/{user_id}.ext
      or name like 'avatars/' || auth.uid()::text || '.%'
    )
  );

-- ================================================================
-- USEFUL VIEWS (optional but handy)
-- ================================================================
create or replace view public.listings_with_profile as
  select
    l.*,
    p.name          as lister_name,
    p.email         as lister_email,
    p.avatar_url    as lister_avatar,
    p.university    as lister_university,
    p.grad_year     as lister_grad_year,
    p.is_edu        as lister_is_edu,
    p.trust_score   as trust_score
  from public.listings l
  join public.profiles p on p.id = l.lister_id;
