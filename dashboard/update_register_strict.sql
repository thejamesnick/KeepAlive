-- Make status strict: If success=false, set status='dead' immediately
create or replace function public.register_ping(token text, success boolean)
returns jsonb
language plpgsql
security definer
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

  -- 4. Update Project Status (STRICT MODE)
  update public.projects
  set last_ping_at = now(),
      status = case when success then 'active' else 'dead' end  -- << STRICT CHANGE HERE
  where id = target_project_id;

  return jsonb_build_object('success', true, 'project_id', target_project_id);
end;
$$;
