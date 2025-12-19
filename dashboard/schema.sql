-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (User Data & Billing)
-- Good for: Storing 'Pro' status, Stripe IDs, Email preferences
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  subscription_tier text default 'free', -- 'free', 'pro', 'enterprise'
  stripe_customer_id text,
  created_at timestamp with time zone default now()
);

-- 2. PROJECTS TABLE
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  project_id text unique not null, -- 'kp_...'
  api_token text not null,         -- 'keep_live_...'
  status text default 'pending',   -- 'active', 'dead', 'pending'
  
  -- Monitoring Data
  last_ping_at timestamp with time zone,
  next_ping_at timestamp with time zone, 
  
  -- The "Future Proof" Column 🛡️
  -- Stores: { "notify_slack": true, "slack_url": "...", "alert_email": "..." }
  settings jsonb default '{}'::jsonb, 
  
  created_at timestamp with time zone default now(),
  constraint unique_project_id unique (project_id)
);

-- 3. PINGS TABLE (History)
create table public.pings (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  success boolean default true,
  latency_ms integer,
  user_agent text, -- Good for debugging
  created_at timestamp with time zone default now()
);

-- 4. SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.pings enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Projects Policies (Updated to link via auth.uid())
create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can create projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

-- Pings Policies
create policy "Users can view pings for own projects" on public.pings for select using (
  exists (select 1 from public.projects where projects.id = pings.project_id and projects.user_id = auth.uid())
);

-- 5. AUTOMATIC PROFILE CREATION (Trigger)
-- This automatically makes a profile row when a user signs up via Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
