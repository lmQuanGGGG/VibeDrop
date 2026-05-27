alter table profiles enable row level security;
alter table prompts enable row level security;
alter table votes enable row level security;
alter table comments enable row level security;
alter table saved_prompts enable row level security;
alter table reports enable row level security;

create policy "Public profiles are readable"
on profiles for select using (true);

create policy "Users can create their profile"
on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update using (auth.uid() = id);

create policy "Public active prompts are readable"
on prompts for select
using (status = 'active' and (visibility = 'public' or auth.uid() = user_id));

create policy "Users can create prompts"
on prompts for insert
with check (auth.uid() = user_id);

create policy "Users can update own prompts"
on prompts for update
using (auth.uid() = user_id);

create policy "Users can delete own prompts"
on prompts for delete
using (auth.uid() = user_id);

create policy "Admins can moderate prompts"
on prompts for update
using (public.is_admin())
with check (public.is_admin());

create policy "Votes are readable"
on votes for select using (true);

create policy "Users can vote"
on votes for insert
with check (auth.uid() = user_id);

create policy "Users can update own votes"
on votes for update
using (auth.uid() = user_id);

create policy "Users can delete own votes"
on votes for delete
using (auth.uid() = user_id);

create policy "Comments are readable on public prompts"
on comments for select
using (
  exists (
    select 1 from prompts
    where prompts.id = comments.prompt_id
      and prompts.status = 'active'
      and prompts.visibility = 'public'
  )
  or auth.uid() = user_id
  or public.is_admin()
);

create policy "Users can comment"
on comments for insert
with check (
  auth.uid() = user_id and exists (
    select 1 from prompts
    where prompts.id = comments.prompt_id
      and prompts.status = 'active'
      and prompts.visibility = 'public'
  )
);

create policy "Users can update own comments"
on comments for update
using (auth.uid() = user_id or public.is_admin());

create policy "Users can delete own comments"
on comments for delete
using (auth.uid() = user_id or public.is_admin());

create policy "Saved prompts are private"
on saved_prompts for select
using (auth.uid() = user_id);

create policy "Users can save prompts"
on saved_prompts for insert
with check (auth.uid() = user_id);

create policy "Users can remove saved prompts"
on saved_prompts for delete
using (auth.uid() = user_id);

create policy "Users can report"
on reports for insert
with check (auth.uid() = reporter_id);

create policy "Admins can read reports"
on reports for select
using (public.is_admin());

create policy "Admins can delete reports"
on reports for delete
using (public.is_admin());
