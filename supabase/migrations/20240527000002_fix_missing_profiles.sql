-- Insert missing profiles for existing users
insert into public.profiles (id, username, display_name, avatar_url)
select 
  u.id, 
  coalesce(
    u.raw_user_meta_data->>'user_name',
    u.raw_user_meta_data->>'preferred_username',
    split_part(u.email, '@', 1)
  ) || '_' || substr(md5(random()::text), 1, 4) as username,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)) as display_name,
  u.raw_user_meta_data->>'avatar_url' as avatar_url
from auth.users u
left join public.profiles p on u.id = p.id
where p.id is null;
