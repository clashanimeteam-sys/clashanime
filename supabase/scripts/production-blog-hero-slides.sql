-- Blog hero carousel slides for Heroes Guide (/blog)
-- Run in Supabase SQL editor on production if migration not applied via CLI.

insert into public.site_settings (key, value)
values (
  'blog_hero_slides',
  '[]'::jsonb
)
on conflict (key) do nothing;

insert into public.site_settings (key, value)
values (
  'blog_hero_display',
  jsonb_build_object(
    'carouselEnabled', true,
    'showTextOverlay', true,
    'overlayOpacity', 28,
    'autoPlaySeconds', 3
  )
)
on conflict (key) do nothing;

-- Ensure existing production row uses 3s between slides
update public.site_settings
set
  value = jsonb_set(coalesce(value, '{}'::jsonb), '{autoPlaySeconds}', '3'::jsonb, true),
  updated_at = now()
where key = 'blog_hero_display';
