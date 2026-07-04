insert into public.site_settings (key, value)
values (
  'ad_placements',
  '{
    "enabled": false,
    "showPreviewPlaceholders": true,
    "pages": {
      "home": false,
      "blog": true,
      "videos": true,
      "videoReels": true,
      "community": false,
      "tracker": false
    },
    "reelsEveryNVideos": 4,
    "slotBanner": "",
    "slotInFeed": ""
  }'::jsonb
)
on conflict (key) do nothing;
