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
    'autoPlaySeconds', 5
  )
)
on conflict (key) do nothing;
