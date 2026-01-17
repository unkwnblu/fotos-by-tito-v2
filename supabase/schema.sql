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

  -- Create bookings table
  create table bookings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    phone text,
    message text,
    package_name text not null,
    package_price text not null,
    category_title text not null,
    status text not null default 'pending' -- pending, confirmed, completed, cancelled
  );

  -- Enable RLS for bookings
  alter table bookings enable row level security;

  create policy "Public can create bookings"
    on bookings for insert
    to public
    with check (true);

  create policy "Authenticated users can view bookings"
    on bookings for select
    to authenticated
    using (true);

  create policy "Authenticated users can update bookings"
    on bookings for update
    to authenticated
    using (true)
    with check (true);

  create policy "Authenticated users can delete bookings"
    on bookings for delete
    to authenticated
    using (true);

  -- Create messages table
  create table messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text,
    subject text not null,
    message text not null,
    status text not null default 'unread' -- unread, read, replied
  );

  -- Enable RLS for messages
  alter table messages enable row level security;

  create policy "Public can insert messages"
    on messages for insert
    to public
    with check (true);

  create policy "Authenticated users can view messages"
    on messages for select
    to authenticated
    using (true);

  create policy "Authenticated users can update messages"
    on messages for update
    to authenticated
    using (true)
    with check (true);

  create policy "Authenticated users can delete messages"
    on messages for delete
    to authenticated
    using (true);

  -- Create testimonials table
  create table testimonials (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    location text not null,
    text text not null,
    rating integer not null default 5,
    image_url text
  );

  -- Enable RLS for testimonials
  alter table testimonials enable row level security;

  create policy "Public can view testimonials"
    on testimonials for select
    to public
    using (true);

  create policy "Authenticated users can manage testimonials"
    on testimonials for all
    to authenticated
    using (true)
    with check (true);

  -- Create profiles table
  create table profiles (
    id uuid references auth.users on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    email text,
    role text default 'user'
  );

  -- Enable RLS for profiles
  alter table profiles enable row level security;

  create policy "Public profiles are viewable"
    on profiles for select
    to authenticated
    using (true);

  create policy "Admins can update profiles"
    on profiles for update
    to authenticated
    using (true) -- Ideally check if current user is admin, but for now allow auth users (admins) to update
    with check (true);

  -- Function to handle new user signup
  create function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.profiles (id, email, role)
    values (new.id, new.email, 'user');
    return new;
  end;
  $$ language plpgsql security definer;

  -- Trigger to call the function
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
