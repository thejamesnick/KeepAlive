-- ⚡️ PERFORMANCE INDEXES FOR SCALE (500k+ Projects)

-- 1. Accelerate "Show me recent pings for Project X"
-- This is used constantly by the Dashboard graphs
create index if not exists idx_pings_project_date 
on public.pings (project_id, created_at desc);

-- 2. Accelerate "Find Project by API Key"
-- Used by the Ingestion API for every single incoming ping
-- (Ideally unique constraint already handles this, but explicit index helps lookups)
create index if not exists idx_projects_api_token 
on public.projects (api_token);

-- 3. Accelerate "Find all projects for User Y"
-- Used when the Dashboard loads
create index if not exists idx_projects_user_id 
on public.projects (user_id);

-- 🏗️ MAINTENANCE (Cron Job Candidate)
-- If pings grow to 100M rows, you'll need a cleanup job.
-- Run this manually or schedule it later:
-- delete from pings where created_at < list(now() - interval '30 days');
