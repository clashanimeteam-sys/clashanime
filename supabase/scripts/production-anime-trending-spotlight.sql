-- Run in Supabase SQL Editor (production: sghdfqidcdrwaoaxnimz)
-- Safe to re-run. Trending spotlight with Jikan-backed clashes.


-- Anime Tracker: trending spotlight with Jikan-backed clashes

alter table public.anime_releases
  drop constraint if exists anime_releases_source_check;

alter table public.anime_releases
  add constraint anime_releases_source_check
  check (source in ('manual', 'anilist', 'jikan', 'trending'));

alter table public.anime_releases
  add column if not exists mal_score numeric,
  add column if not exists episodes_total integer,
  add column if not exists broadcast_label text,
  add column if not exists airing_status text;

create unique index if not exists anime_releases_trending_mal_uidx
  on public.anime_releases (mal_id)
  where source = 'trending' and mal_id is not null;

create table if not exists public.anime_trending_spotlight (
  id uuid primary key default gen_random_uuid(),
  rank integer not null,
  mal_id integer not null,
  editorial_en text,
  editorial_ar text,
  editorial_ja text,
  release_id uuid references public.anime_releases (id) on delete set null,
  active boolean not null default true,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint anime_trending_spotlight_rank_check check (rank between 1 and 100),
  constraint anime_trending_spotlight_rank_uidx unique (rank),
  constraint anime_trending_spotlight_mal_uidx unique (mal_id)
);

create index if not exists anime_trending_spotlight_active_idx
  on public.anime_trending_spotlight (active, rank);

alter table public.anime_trending_spotlight enable row level security;

drop policy if exists anime_trending_spotlight_public_select on public.anime_trending_spotlight;
create policy anime_trending_spotlight_public_select
  on public.anime_trending_spotlight
  for select
  using (active = true or public.is_staff());

insert into public.anime_trending_spotlight (rank, mal_id, editorial_en, editorial_ar, editorial_ja)
values
  (
    1, 57658,
    'The most popular anime returns in force with the Culling Game arc. MAPPA''s intense battles and animation have made it undisputed at the top of global trends.',
    'الأنمي الأكثر شعبية يعود بقوة مع آرك "لعبة الإعدام" (The Culling Game). الإثارة والقتالات والتحريك من استوديو MAPPA جعلته يتصدر الترند العالمي بلا منازع.',
    '人気No.1作品が「死滅回游」編で本格復帰。MAPPAの激しいバトルと作画が世界のトレンドを独走中。'
  ),
  (
    2, 59062,
    'The breakout new series that won Best New Series at the Anime Awards. A boy thrown into a world of trash seeks revenge, with a wildly unique art style and eye-catching animation.',
    'الأنمي الجديد الذي فاز بجائزة "أفضل سلسلة جديدة" في جوائز الأنمي. تدور قصته حول فتى يُلقى به في عالم السفالة والمخلفات ويسعى للانتقام، ويتميز بأسلوب رسم وتحريك فريد جداً وخاطف للأنظار.',
    'アニメアワード最優秀新作に輝いた注目の新作。ゴミの世界に放り込まれた少年の復讐劇が、独創的な画風と映像で視線を奪う。'
  ),
  (
    3, 58939,
    'One of the most anticipated trending anime—a legendary retired hitman tries to live quietly as a shopkeeper protecting his family, blending comedy with spectacular acrobatic action.',
    'واحد من أكثر الأنميات انتظاراً وتصدراً للترند؛ قصة القاتل المأجور الأسطوري المتقاعد الذي يحاول عيش حياة هادئة كصاحب متجر يحمي عائلته، والقتالات فيه تجمع بين الكوميديا والأكشن الخرافي البهلواني.',
    '待望のトレンド作。伝説の殺し屋が店番として静かな日々を守る物語。コメディと派手なアクションが融合。'
  ),
  (
    4, 54789,
    'Entering its concluding season with decisive battles, the series stays on trend as fans follow Midoriya and the heroes'' final clash against the villains.',
    'مع دخول الأنمي في موسمه الختامي والمعارك المصيرية الكبرى، يتواجد العمل باستمرار في الترند حيث يتابع المشاهدون نهاية رحلة ميدوريا والأبطال ضد الأشرار.',
    '決戦のクライマックスへ突入する最終シーズン。デクとヒーローたちの終焉の戦いがトレンドを維持。'
  ),
  (
    5, 58567,
    'After the smash hit first season, Jinwoo returns strong in Season 2 "Arise from the Shadow," recently winning design and animation awards and dominating streaming platforms.',
    'بعد النجاح الساحق للموسم الأول، عاد جين-وو بقوة في الموسم الثاني "Arise from the Shadow"، وحصد الأنمي مؤخراً جوائز في التصميم والتحريك، ولا يزال يكتسح منصات العرض.',
    '第1期の大ヒットに続き、第2期「-Arise from the Shadow-」でジンウーが再び躍進。配信プラットフォームを席巻中。'
  ),
  (
    6, 59978,
    'The elf mage''s ongoing journey has won millions of hearts. It remains one of the highest-rated anime thanks to its emotional depth and stunning visual production.',
    'رحلة الفيلسوفة القزمية (إلف) المستمرة حازت على قلوب الملايين. الأنمي يحافظ على مكانته كواحد من أعلى الأنميات تقييماً بفضل عمق القصة والإنتاج البصري المذهل.',
    'エルフの魔法使いの旅が多くの心を掴む。物語の深さと圧倒的な映像美で高評価を維持。'
  ),
  (
    7, 59192,
    'Though released as a theatrical trilogy, any Infinity Castle update instantly dominates social media and shoots to the top of search trends.',
    'رغم أنه يُعرض على شكل أفلام سينمائية (ثلاثية قلعة اللانهائية)، إلا أن أي تحديث أو عرض يخص قاتل الشياطين يقلب السوشيال ميديا رأساً على عقب ويتصدر قوائم البحث فوراً.',
    '劇場三部作として公開されても、鬼滅の最新情報はSNSを一瞬で席巻し検索上位を独占。'
  ),
  (
    8, 60543,
    'A wild blend of aliens, ghosts, and romantic comedy that keeps drawing huge engagement with its bizarre, hilarious direction.',
    'العمل الجنوني الذي يدمج بين الكائنات الفضائية، الأشباح، والكوميديا الرومانسية. مستمر في حصد تفاعل هائل بسبب أسلوبه الإخراجي الغريب والممتع جداً.',
    '宇宙人・幽霊・ラブコメが混ざる狂気作。奇抜で愉快な演出が大きな反響を生み続けている。'
  ),
  (
    9, 62001,
    'From the creator of Fullmetal Alchemist, this new series holds a steady top-viewership spot with a mysterious story of twins and bonds to the spirit world.',
    'من نفس مؤلفة الأنمي الأسطوري Fullmetal Alchemist، هذا الأنمي الجديد حجز مكاناً ثابتاً في قائمة الأعلى مشاهدة بفضل قصته الغامضة التي تدور حول التوائم والروابط مع عالم الأرواح.',
    '鋼の錬金術師の作者による新作。双子と霊界の繋がりを描くミステリアスな物語が視聴率上位をキープ。'
  ),
  (
    10, 51553,
    'Pure magical fantasy that stunned viewers with gorgeous art and animation that feels like a moving painting—now a favorite among fantasy fans.',
    'أنمي السحر الخالص الذي أدهش الجميع بجمال الرسوم والتحريك البصري الساحر الذي يشعرك وكأنك تقرأ لوحة فنية متحركة، وقد أصبح حديث عشاق الفانتازيا الخيالية.',
    '美しい作画と幻想的な映像が話題の魔法ファンタジー。動く絵画のような世界観がファンタジー好きを魅了。'
  )
on conflict (rank) do update set
  mal_id = excluded.mal_id,
  editorial_en = excluded.editorial_en,
  editorial_ar = excluded.editorial_ar,
  editorial_ja = excluded.editorial_ja,
  updated_at = now();

create or replace function public.upsert_anime_release_from_trending_sync(
  p_mal_id integer,
  p_title text,
  p_title_ja text default null,
  p_poster_url text default null,
  p_synopsis_en text default null,
  p_match_tags text[] default '{}'::text[],
  p_mal_score numeric default null,
  p_episodes_total integer default null,
  p_broadcast_label text default null,
  p_airing_status text default null,
  p_episode_number integer default 1
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tags text[];
begin
  if p_mal_id is null or trim(coalesce(p_title, '')) = '' then
    raise exception 'mal id and title required';
  end if;

  v_tags := public._normalize_anime_match_tags(p_match_tags, p_title);

  insert into public.anime_releases (
    title,
    title_ja,
    mal_id,
    release_date,
    episode_number,
    poster_url,
    match_tags,
    synopsis_en,
    mal_score,
    episodes_total,
    broadcast_label,
    airing_status,
    source,
    status
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_title_ja, '')), ''),
    p_mal_id,
    current_date,
    greatest(coalesce(p_episode_number, 1), 1),
    nullif(trim(coalesce(p_poster_url, '')), ''),
    v_tags,
    nullif(trim(coalesce(p_synopsis_en, '')), ''),
    p_mal_score,
    p_episodes_total,
    nullif(trim(coalesce(p_broadcast_label, '')), ''),
    nullif(trim(coalesce(p_airing_status, '')), ''),
    'trending',
    'released'
  )
  on conflict (mal_id) where mal_id is not null and source = 'trending'
  do update set
    title = excluded.title,
    title_ja = excluded.title_ja,
    poster_url = coalesce(excluded.poster_url, anime_releases.poster_url),
    match_tags = excluded.match_tags,
    synopsis_en = coalesce(excluded.synopsis_en, anime_releases.synopsis_en),
    mal_score = excluded.mal_score,
    episodes_total = excluded.episodes_total,
    broadcast_label = excluded.broadcast_label,
    airing_status = excluded.airing_status,
    episode_number = excluded.episode_number,
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.upsert_anime_release_from_trending_sync(
  integer, text, text, text, text, text[], numeric, integer, text, text, integer
) to service_role;

create or replace function public.open_trending_spotlight_clash(p_release_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_release public.anime_releases%rowtype;
  v_clash_id uuid;
  v_clash_title text;
  v_link text;
begin
  select * into v_release
  from public.anime_releases
  where id = p_release_id
  for update;

  if not found then
    raise exception 'release not found';
  end if;

  if v_release.source <> 'trending' then
    raise exception 'not a trending release';
  end if;

  if v_release.clash_id is not null then
    update public.anime_release_clashes
    set
      status = 'active',
      closes_at = greatest(coalesce(closes_at, now()), now() + interval '30 days'),
      match_tags = public._normalize_anime_match_tags(v_release.match_tags, v_release.title)
    where id = v_release.clash_id;

    return v_release.clash_id;
  end if;

  v_clash_title := trim(v_release.title) || ' · Trending';

  insert into public.anime_release_clashes (
    title,
    status,
    match_tags,
    opens_at,
    closes_at
  )
  values (
    v_clash_title,
    'active',
    public._normalize_anime_match_tags(v_release.match_tags, v_release.title),
    now(),
    now() + interval '30 days'
  )
  returning id into v_clash_id;

  update public.anime_releases
  set
    clash_id = v_clash_id,
    updated_at = now()
  where id = p_release_id;

  v_link := '/tracker/clash/' || v_clash_id::text;

  perform public._notify_all_users(
    'anime_release_clash',
    'Trending anime clash',
    v_clash_title || ' is trending now. Submit your best clip!',
    v_link,
    jsonb_build_object(
      'release_id', p_release_id,
      'clash_id', v_clash_id,
      'anime_title', v_release.title,
      'episode_number', v_release.episode_number,
      'kind', 'trending'
    )
  );

  update public.anime_release_clashes
  set notification_sent = true
  where id = v_clash_id;

  return v_clash_id;
end;
$$;

grant execute on function public.open_trending_spotlight_clash(uuid) to service_role;

create or replace function public.get_trending_spotlight_cards()
returns table (
  rank integer,
  editorial_en text,
  editorial_ar text,
  editorial_ja text,
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
    s.editorial_en,
    s.editorial_ar,
    s.editorial_ja,
    ar.id as release_id,
    c.id as clash_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.episodes_total,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    ar.mal_score,
    ar.broadcast_label,
    ar.airing_status,
    coalesce(c.match_tags, ar.match_tags) as match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and c.id is not null
        and public._video_matches_anime_tags(v.hashtags, coalesce(c.match_tags, ar.match_tags))
    ) as clip_count
  from public.anime_trending_spotlight s
  left join public.anime_releases ar on ar.id = s.release_id
  left join public.anime_release_clashes c on c.id = ar.clash_id
  where s.active = true
  order by s.rank asc;
$$;

grant execute on function public.get_trending_spotlight_cards() to anon, authenticated, service_role;

create or replace function public.list_trending_spotlight_admin()
returns table (
  id uuid,
  rank integer,
  mal_id integer,
  editorial_en text,
  editorial_ar text,
  editorial_ja text,
  release_id uuid,
  clash_id uuid,
  active boolean,
  synced_at timestamptz,
  anime_title text,
  mal_score numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.rank,
    s.mal_id,
    s.editorial_en,
    s.editorial_ar,
    s.editorial_ja,
    s.release_id,
    ar.clash_id,
    s.active,
    s.synced_at,
    ar.title as anime_title,
    ar.mal_score
  from public.anime_trending_spotlight s
  left join public.anime_releases ar on ar.id = s.release_id
  order by s.rank asc;
$$;

grant execute on function public.list_trending_spotlight_admin() to authenticated, service_role;

drop function if exists public.get_active_anime_release_clashes();

create or replace function public.get_active_anime_release_clashes()
returns table (
  clash_id uuid,
  clash_title text,
  release_id uuid,
  anime_title text,
  title_ar text,
  title_ja text,
  episode_number integer,
  poster_url text,
  synopsis_en text,
  synopsis_ar text,
  synopsis_ja text,
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
    c.id as clash_id,
    c.title as clash_title,
    ar.id as release_id,
    ar.title as anime_title,
    ar.title_ar,
    ar.title_ja,
    ar.episode_number,
    ar.poster_url,
    ar.synopsis_en,
    ar.synopsis_ar,
    ar.synopsis_ja,
    c.match_tags,
    c.opens_at,
    c.closes_at,
    (
      select count(*)
      from public.videos v
      where v.moderation_status = 'approved'
        and public._video_matches_anime_tags(v.hashtags, c.match_tags)
    ) as clip_count
  from public.anime_release_clashes c
  join public.anime_releases ar on ar.clash_id = c.id
  where c.status = 'active'
    and (c.closes_at is null or c.closes_at > now())
    and ar.source <> 'trending'
  order by c.opens_at desc;
$$;

grant execute on function public.get_active_anime_release_clashes() to anon, authenticated, service_role;

notify pgrst, 'reload schema';
