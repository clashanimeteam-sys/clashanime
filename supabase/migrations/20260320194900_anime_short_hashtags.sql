-- Short hashtags with #clashanime primary tag for all anime tracker clashes

alter table public.anime_trending_spotlight
  add column if not exists short_tags text[] not null default '{}'::text[];

update public.anime_trending_spotlight set short_tags = array['clashanime', 'jjk', 'jujutsu'] where rank = 1;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'gachiakuta', 'gachi'] where rank = 2;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'sakamotodays', 'sakamoto'] where rank = 3;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'mha', 'myhero'] where rank = 4;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'sololeveling', 'sl'] where rank = 5;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'frieren'] where rank = 6;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'demonslayer', 'kimetsu'] where rank = 7;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'dandadan'] where rank = 8;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'yominotsugai', 'daemons'] where rank = 9;
update public.anime_trending_spotlight set short_tags = array['clashanime', 'witchhat', 'atelier'] where rank = 10;

create or replace function public._normalize_anime_match_tags(p_tags text[], p_title text default null)
returns text[]
language plpgsql
immutable
as $$
declare
  raw_tags text[] := coalesce(p_tags, '{}'::text[]);
  normalized text[] := array['clashanime']::text[];
  tag text;
  slug text;
  first_word text;
begin
  foreach tag in array raw_tags loop
    slug := lower(regexp_replace(trim(both '#' from coalesce(tag, '')), '[^a-z0-9]+', '', 'g'));
    if slug <> ''
      and slug <> 'clashanime'
      and length(slug) <= 24
      and not slug = any(normalized) then
      normalized := array_append(normalized, slug);
    end if;
  end loop;

  if p_title is not null and trim(p_title) <> '' then
    slug := lower(regexp_replace(trim(p_title), '[^a-z0-9]+', '', 'g'));
    if slug <> ''
      and slug <> 'clashanime'
      and length(slug) <= 24
      and not slug = any(normalized) then
      normalized := array_append(normalized, slug);
    elsif slug <> '' and length(slug) > 24 then
      first_word := lower(split_part(regexp_replace(trim(p_title), '[^a-zA-Z0-9 ]+', ' ', 'g'), ' ', 1));
      if first_word <> ''
        and length(first_word) <= 24
        and not first_word = any(normalized) then
        normalized := array_append(normalized, first_word);
      end if;
    end if;
  end if;

  if array_length(normalized, 1) > 6 then
    normalized := normalized[1:6];
  end if;

  return normalized;
end;
$$;

create or replace function public.refresh_short_anime_match_tags()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  r record;
begin
  for r in select id, title, match_tags from public.anime_releases loop
    update public.anime_releases
    set
      match_tags = public._normalize_anime_match_tags(r.match_tags, r.title),
      updated_at = now()
    where id = r.id;
    v_count := v_count + 1;
  end loop;

  update public.anime_release_clashes c
  set match_tags = ar.match_tags
  from public.anime_releases ar
  where ar.clash_id = c.id;

  return v_count;
end;
$$;

grant execute on function public.refresh_short_anime_match_tags() to service_role;

drop function if exists public.get_trending_spotlight_cards();

create or replace function public.get_trending_spotlight_cards()
returns table (
  rank integer,
  mal_id integer,
  editorial_en text,
  editorial_ar text,
  editorial_ja text,
  seed_title_en text,
  seed_title_ar text,
  seed_title_ja text,
  release_id uuid,
  clash_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  episodes_total integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
  mal_score numeric,
  broadcast_label text,
  airing_status text,
  match_tags text[],
  opens_at timestamptz,
  closes_at timestamptz,
  clip_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.rank,
    s.mal_id,
    s.editorial_en,
    s.editorial_ar,
    s.editorial_ja,
    s.title_en as seed_title_en,
    s.title_ar as seed_title_ar,
    s.title_ja as seed_title_ja,
    ar.id as release_id,
    coalesce(c.id, ar.clash_id) as clash_id,
    coalesce(nullif(trim(ar.title), ''), s.title_en) as anime_title,
    coalesce(ar.title_ar, s.title_ar) as title_ar,
    coalesce(ar.title_ja, s.title_ja) as title_ja,
    coalesce(ar.episode_number, 1) as episode_number,
    ar.episodes_total,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.mal_score,
    ar.broadcast_label,
    ar.airing_status,
    case
      when coalesce(array_length(s.short_tags, 1), 0) > 0 then
        public._normalize_anime_match_tags(s.short_tags, coalesce(nullif(trim(ar.title), ''), s.title_en))
      else
        public._normalize_anime_match_tags(coalesce(c.match_tags, ar.match_tags, '{}'::text[]), coalesce(nullif(trim(ar.title), ''), s.title_en))
    end as match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and coalesce(c.id, ar.clash_id) is not null
        and public._video_matches_anime_tags(
          v.hashtags,
          case
            when coalesce(array_length(s.short_tags, 1), 0) > 0 then
              public._normalize_anime_match_tags(s.short_tags, coalesce(nullif(trim(ar.title), ''), s.title_en))
            else
              public._normalize_anime_match_tags(coalesce(c.match_tags, ar.match_tags, '{}'::text[]), coalesce(nullif(trim(ar.title), ''), s.title_en))
          end
        )
    ) as clip_count
  from public.anime_trending_spotlight s
  left join public.anime_releases ar
    on ar.id = s.release_id
    or (s.release_id is null and ar.mal_id = s.mal_id and ar.source = 'trending')
  left join public.anime_release_clashes c
    on c.id = ar.clash_id
  where s.active = true
  order by s.rank asc;
$$;

grant execute on function public.get_trending_spotlight_cards() to anon, authenticated, service_role;

select public.refresh_short_anime_match_tags();

notify pgrst, 'reload schema';
