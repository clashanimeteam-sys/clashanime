insert into public.videos (title, thumbnail_url, video_url, likes_count, comments_count, created_at)
values
  (
    'Gojo vs Sukuna — Domain Clash',
    'https://picsum.photos/seed/clash1/540/960',
    '',
    48200,
    3180,
    now() - interval '45 minutes'
  ),
  (
    'Luffy Gear 5 Animation Duel',
    'https://picsum.photos/seed/clash2/540/960',
    '',
    39100,
    2740,
    now() - interval '2 hours'
  ),
  (
    'Naruto Rasengan vs Sasuke Chidori',
    'https://picsum.photos/seed/clash3/540/960',
    '',
    35600,
    2100,
    now() - interval '3 hours'
  ),
  (
    'Demon Slayer Water vs Thunder Breathing',
    'https://picsum.photos/seed/clash4/540/960',
    '',
    28900,
    1650,
    now() - interval '4 hours'
  ),
  (
    'Attack on Titan ODM Gear Chase',
    'https://picsum.photos/seed/clash5/540/960',
    '',
    22100,
    980,
    now() - interval '6 hours'
  ),
  (
    'Bleach Bankai Reveal Edit',
    'https://picsum.photos/seed/clash6/540/960',
    '',
    18700,
    740,
    now() - interval '8 hours'
  )
on conflict do nothing;
