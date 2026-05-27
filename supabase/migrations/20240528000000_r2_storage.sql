alter table prompts
add column if not exists thumbnail_url text,
add column if not exists thumbnail_key text,
add column if not exists thumbnail_width int,
add column if not exists thumbnail_height int;

alter table profiles
add column if not exists avatar_key text;
