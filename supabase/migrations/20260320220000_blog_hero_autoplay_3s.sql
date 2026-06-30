-- Set blog hero carousel interval to 3 seconds between slides
update public.site_settings
set
  value = jsonb_set(
    coalesce(value, '{}'::jsonb),
    '{autoPlaySeconds}',
    '3'::jsonb,
    true
  ),
  updated_at = now()
where key = 'blog_hero_display';
