-- Blog hero carousel display settings (visibility, overlay, autoplay)
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
