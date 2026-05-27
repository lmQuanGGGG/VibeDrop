create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  prompt_text text not null,
  result_text text,
  category text not null,
  tags text[] default '{}',
  visibility text default 'public' check (visibility in ('public', 'private')),
  remix_of uuid references prompts(id) on delete set null,
  copy_count int default 0,
  save_count int default 0,
  view_count int default 0,
  status text default 'active' check (status in ('active', 'hidden', 'deleted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  prompt_id uuid references prompts(id) on delete cascade not null,
  value int not null check (value in (-1, 1)),
  created_at timestamptz default now(),
  unique(user_id, prompt_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  prompt_id uuid references prompts(id) on delete cascade not null,
  content text not null,
  parent_id uuid references comments(id) on delete cascade,
  status text default 'active' check (status in ('active', 'hidden', 'deleted')),
  created_at timestamptz default now()
);

create table if not exists saved_prompts (
  user_id uuid references profiles(id) on delete cascade not null,
  prompt_id uuid references prompts(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, prompt_id)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade not null,
  prompt_id uuid references prompts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  reason text not null,
  created_at timestamptz default now()
);

create index if not exists prompts_created_at_idx on prompts (created_at desc);
create index if not exists prompts_category_idx on prompts (category);
create index if not exists prompts_tags_gin_idx on prompts using gin (tags);
create index if not exists votes_prompt_idx on votes (prompt_id);
create index if not exists comments_prompt_idx on comments (prompt_id);
create index if not exists saved_prompts_prompt_idx on saved_prompts (prompt_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists prompts_updated_at on prompts;
create trigger prompts_updated_at
before update on prompts
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.increment_prompt_metric(
  prompt_id uuid,
  field_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if field_name = 'copy_count' then
    update prompts set copy_count = copy_count + 1 where id = prompt_id;
  elsif field_name = 'view_count' then
    update prompts set view_count = view_count + 1 where id = prompt_id;
  else
    raise exception 'invalid metric field';
  end if;
end;
$$;

create or replace function public.adjust_prompt_save_count(
  prompt_id uuid,
  delta int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if delta not in (-1, 1) then
    raise exception 'invalid save delta';
  end if;

  update prompts
  set save_count = greatest(save_count + delta, 0)
  where id = prompt_id;
end;
$$;

grant execute on function public.increment_prompt_metric(uuid, text) to anon, authenticated;
grant execute on function public.adjust_prompt_save_count(uuid, int) to anon, authenticated;
