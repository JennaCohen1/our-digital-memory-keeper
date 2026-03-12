-- Memory Book: spaces (memory books), members, albums, stories, assets, album_photos
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New query).

-- Profiles: extend auth.users with app profile (optional; we can use auth.users + metadata)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  primary_email text,
  display_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Spaces = Memory Books
create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  cover_image_id uuid
);

-- Membership: which users belong to which spaces
create table if not exists public.space_members (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

-- Reusable photo/assets (one row per uploaded image; can be used in multiple albums)
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  mime_type text not null default 'image/jpeg',
  captured_at timestamptz,
  event_date date,
  created_at timestamptz not null default now(),
  source text check (source in ('upload', 'google_photos'))
);

-- Albums: space-scoped, event_date required
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Album-photo join: which assets appear in which album (caption per album)
create table if not exists public.album_photos (
  album_id uuid not null references public.albums(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  caption text,
  sort_order int not null default 0,
  primary key (album_id, asset_id)
);

-- Stories: space-scoped, event_date required
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  title text not null,
  content text not null,
  event_date date not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS: enable on all tables
alter table public.profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.assets enable row level security;
alter table public.albums enable row level security;
alter table public.album_photos enable row level security;
alter table public.stories enable row level security;

-- Profiles: users can read/update own
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Spaces: members can read; only creator can delete (simplified: members can read)
create policy "Members can view space" on public.spaces for select
  using (exists (select 1 from public.space_members sm where sm.space_id = spaces.id and sm.user_id = auth.uid()));
create policy "Authenticated can create space" on public.spaces for insert with check (auth.uid() = created_by);
create policy "Owner can update space" on public.spaces for update
  using (exists (select 1 from public.space_members sm where sm.space_id = spaces.id and sm.user_id = auth.uid() and sm.role = 'owner'));
create policy "Owner can delete space" on public.spaces for delete using (auth.uid() = created_by);

-- Space members: members can read; owner can insert/delete
create policy "Members can view space_members" on public.space_members for select
  using (exists (select 1 from public.space_members sm where sm.space_id = space_members.space_id and sm.user_id = auth.uid()));
create policy "Owner can add member" on public.space_members for insert
  with check (exists (select 1 from public.space_members sm where sm.space_id = space_members.space_id and sm.user_id = auth.uid() and sm.role = 'owner'));
create policy "Owner can remove member" on public.space_members for delete
  using (exists (select 1 from public.space_members sm where sm.space_id = space_members.space_id and sm.user_id = auth.uid() and sm.role = 'owner'));

-- Assets: owner can do anything
create policy "Users can view own assets" on public.assets for select using (auth.uid() = owner_user_id);
create policy "Users can insert own assets" on public.assets for insert with check (auth.uid() = owner_user_id);
create policy "Users can delete own assets" on public.assets for delete using (auth.uid() = owner_user_id);

-- Albums: space members can read; editors/owners can insert/update/delete
create policy "Space members can view albums" on public.albums for select
  using (exists (select 1 from public.space_members sm where sm.space_id = albums.space_id and sm.user_id = auth.uid()));
create policy "Space members can create albums" on public.albums for insert
  with check (exists (select 1 from public.space_members sm where sm.space_id = albums.space_id and sm.user_id = auth.uid()) and auth.uid() = created_by);
create policy "Space members can update albums" on public.albums for update
  using (exists (select 1 from public.space_members sm where sm.space_id = albums.space_id and sm.user_id = auth.uid()));
create policy "Space members can delete albums" on public.albums for delete
  using (exists (select 1 from public.space_members sm where sm.space_id = albums.space_id and sm.user_id = auth.uid()));

-- Album_photos: same as albums (via album membership)
create policy "Space members can view album_photos" on public.album_photos for select
  using (exists (select 1 from public.albums a join public.space_members sm on sm.space_id = a.space_id where a.id = album_photos.album_id and sm.user_id = auth.uid()));
create policy "Space members can manage album_photos" on public.album_photos for all
  using (exists (select 1 from public.albums a join public.space_members sm on sm.space_id = a.space_id where a.id = album_photos.album_id and sm.user_id = auth.uid()));

-- Stories: same as albums
create policy "Space members can view stories" on public.stories for select
  using (exists (select 1 from public.space_members sm where sm.space_id = stories.space_id and sm.user_id = auth.uid()));
create policy "Space members can create stories" on public.stories for insert
  with check (exists (select 1 from public.space_members sm where sm.space_id = stories.space_id and sm.user_id = auth.uid()) and auth.uid() = created_by);
create policy "Space members can update stories" on public.stories for update
  using (exists (select 1 from public.space_members sm where sm.space_id = stories.space_id and sm.user_id = auth.uid()));
create policy "Space members can delete stories" on public.stories for delete
  using (exists (select 1 from public.space_members sm where sm.space_id = stories.space_id and sm.user_id = auth.uid()));

-- When a space is created, add creator as owner in space_members
create or replace function public.handle_new_space()
returns trigger as $$
begin
  insert into public.space_members (space_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_space_created
  after insert on public.spaces
  for each row execute function public.handle_new_space();

-- Storage bucket for assets
-- In Supabase Dashboard: Storage -> New bucket -> name "assets".
-- Set to Public if you want direct image URLs, or Private and use signed URLs in the app.
-- Add policy: "Users can upload to own path" (bucket assets, path user_id/*).
-- Example policy (Storage -> assets -> Policies): INSERT for authenticated with (bucket_id = 'assets' AND (storage.foldername(name))[1] = auth.uid()::text).
