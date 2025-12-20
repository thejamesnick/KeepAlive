-- Update the register_ping function to handle success status
create or replace function public.register_ping(token text, success boolean)
returns jsonb
language plpgsql
security definer -- << This runs as Admin (bypasses RLS)
as $$
declare
  target_project_id uuid;
begin
  -- 1. Find project by token
  select id into target_project_id
  from public.projects
  where api_token = token
  limit 1;

  -- 2. If not found, error
  if target_project_id is null then
    return jsonb_build_object('success', false, 'error', 'Invalid Token');
  end if;

  -- 3. Insert Ping
  insert into public.pings (project_id, success, latency_ms)
  values (target_project_id, success, 0); 

  -- 4. Update Project Last Ping
  -- We update last_ping_at regardless of success to show we heard from it.
  -- But we only set status to 'active' if it was a success.
  update public.projects
  set last_ping_at = now(),
      status = case when success then 'active' else status end
  where id = target_project_id;

  return jsonb_build_object('success', true, 'project_id', target_project_id);
end;
$$;
