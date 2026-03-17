-- Fix: allow space creators to see their own spaces immediately after creation.
-- The existing SELECT policy on spaces requires a space_members row, but the
-- AFTER INSERT trigger that creates that row may not be visible to PostgREST's
-- RETURNING clause.  This policy lets the creator always read their own space.
create policy "Creator can view own space"
  on public.spaces for select
  using (auth.uid() = created_by);
