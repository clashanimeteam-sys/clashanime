-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- Merges anime radio settings into site_settings.general without overwriting existing keys.

update public.site_settings
set
  value = coalesce(value, '{}'::jsonb)
    || jsonb_build_object(
      'anime_radio_enabled', coalesce((value->>'anime_radio_enabled')::boolean, true),
      'anime_radio_autoplay', coalesce((value->>'anime_radio_autoplay')::boolean, true),
      'anime_radio_default_volume', coalesce((value->>'anime_radio_default_volume')::numeric, 0.35)
    ),
  updated_at = now()
where key = 'general';

-- If general row is missing, seed defaults (should not happen on production).
insert into public.site_settings (key, value)
select
  'general',
  jsonb_build_object(
    'site_name', 'ClashAnime',
    'site_tagline', 'Duel System',
    'maintenance_mode', false,
    'allow_uploads', true,
    'allow_signups', true,
    'anime_radio_enabled', true,
    'anime_radio_autoplay', true,
    'anime_radio_default_volume', 0.35
  )
where not exists (select 1 from public.site_settings where key = 'general');
