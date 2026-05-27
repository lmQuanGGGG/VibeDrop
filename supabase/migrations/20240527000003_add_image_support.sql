-- 1. Add image_url to prompts table
alter table public.prompts
add column if not exists image_url text;

-- 2. Create the 'prompts' storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('prompts', 'prompts', true)
on conflict (id) do update set public = true;

-- 3. Set up Storage Policies for the 'prompts' bucket
-- Allow public read access to the bucket
create policy "Give public read access to prompts bucket"
on storage.objects for select
using (bucket_id = 'prompts');

-- Allow authenticated users to upload files to the bucket
create policy "Allow authenticated users to upload to prompts bucket"
on storage.objects for insert
with check (
  bucket_id = 'prompts' and
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
create policy "Allow authenticated users to update their files"
on storage.objects for update
using (
  bucket_id = 'prompts' and
  auth.uid() = owner
);

-- Allow authenticated users to delete their own files
create policy "Allow authenticated users to delete their files"
on storage.objects for delete
using (
  bucket_id = 'prompts' and
  auth.uid() = owner
);
