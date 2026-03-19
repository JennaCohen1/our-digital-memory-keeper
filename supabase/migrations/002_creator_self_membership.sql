-- Allow space creator to add themselves as owner (so app works even if trigger is missing).
-- Run in Supabase: Dashboard → SQL Editor → New query → paste and run (after 001_initial_schema.sql).

create policy "Creator can add self as owner" on public.space_members for insert
  with check (
    auth.uid() = user_id
    and role = 'owner'
    and exists (
      select 1 from public.spaces s
      where s.id = space_id and s.created_by = auth.uid()
    )
  );
