-- Blog hero carousel slides (Heroes Guide /blog cover)
insert into public.site_settings (key, value)
values (
  'blog_hero_slides',
  '[]'::jsonb
)
on conflict (key) do nothing;
