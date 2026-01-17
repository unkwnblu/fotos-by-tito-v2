-- Create a table for photos
create table photos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  category_id text not null,
  storage_path text not null
);

-- Enable RLS
alter table photos enable row level security;

-- Create policies (Allow generic access for now, or restrict to authenticated users for inserts)
create policy "Public photos are viewable by everyone"
  on photos for select
  to public
  using (true);

create policy "Authenticated users can insert photos"
  on photos for insert
  to authenticated
  with check (true);

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');
  
create policy "Public photos are viewable"
  on storage.objects for select
  to public
  using (bucket_id = 'photos');

-- Create the storage bucket 'photos'
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "Authenticated users can delete photos"
  on photos for delete
  to authenticated
  using (true);

create policy "Authenticated users can delete storage objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'photos');

-- Create categories table
create table categories (
  id text primary key, -- slug like 'portraits'
  title text not null, -- Display name like 'Portraits & Headshots'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for categories
alter table categories enable row level security;

create policy "Public categories are viewable"
  on categories for select
  to public
  using (true);

create policy "Authenticated users can manage categories"
  on categories for all
  to authenticated
  using (true)
  with check (true);

-- Seed initial categories
insert into categories (id, title) values
  ('portraits', 'PORTRAITS & HEADSHOTS'),
  ('newborns', 'NEWBORNS'),
  ('maternity', 'MATERNITY'),
  ('family-milestones', 'FAMILY & MILESTONES'),
  ('christmas', 'CHRISTMAS')
on conflict (id) do nothing;
