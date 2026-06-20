-- Run in Supabase SQL Editor (production: doqiuduigbdoczdzsima)
-- https://supabase.com/dashboard/project/doqiuduigbdoczdzsima/sql/new
--
-- Seeds curated anime reaction stickers (after Vercel deploy serves /public/anime-stickers/).
-- Safe to re-run.

insert into public.anime_sticker_packs (slug, name_en, name_ar, name_ja, sort_order)
values ('reactions', 'Reactions', 'ردود فعل', 'リアクション', 0)
on conflict (slug) do nothing;

insert into public.anime_stickers (pack_id, slug, label, image_url, media_type, sort_order, active)
select p.id, v.slug, v.label, v.image_url, 'gif', v.sort_order, true
from public.anime_sticker_packs p
cross join (
  values
    ('cry', 'Cry', 'https://www.clashanime.com/anime-stickers/reactions/cry.gif', 1),
    ('laugh', 'Laugh', 'https://www.clashanime.com/anime-stickers/reactions/laugh.gif', 2),
    ('happy', 'Happy', 'https://www.clashanime.com/anime-stickers/reactions/happy.gif', 3),
    ('wave', 'Wave', 'https://www.clashanime.com/anime-stickers/reactions/wave.gif', 4),
    ('dance', 'Dance', 'https://www.clashanime.com/anime-stickers/reactions/dance.gif', 5),
    ('sleep', 'Sleep', 'https://www.clashanime.com/anime-stickers/reactions/sleep.gif', 6),
    ('angry', 'Angry', 'https://www.clashanime.com/anime-stickers/reactions/angry.gif', 7),
    ('nod', 'Nod', 'https://www.clashanime.com/anime-stickers/reactions/nod.gif', 8),
    ('clap', 'Clap', 'https://www.clashanime.com/anime-stickers/reactions/clap.gif', 9)
) as v(slug, label, image_url, sort_order)
where p.slug = 'reactions'
on conflict (pack_id, slug) do update
set
  label = excluded.label,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  active = true;

select
  (select count(*) from public.anime_sticker_packs where slug = 'reactions') as pack_count,
  (select count(*) from public.anime_stickers s join public.anime_sticker_packs p on p.id = s.pack_id where p.slug = 'reactions') as sticker_count;
