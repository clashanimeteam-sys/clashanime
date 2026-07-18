export type AnimeSeoEntry = {
  en: string;
  ar?: string;
  ja?: string;
  alt?: string[];
};

/** Popular anime catalog — EN / AR / JA + common alternate titles. */
export const POPULAR_ANIME_CATALOG: AnimeSeoEntry[] = [
  { en: "One Piece", ar: "ون بيس", ja: "ワンピース" },
  { en: "Naruto", ar: "ناروتو", ja: "ナルト", alt: ["Naruto Shippuden"] },
  { en: "Bleach", ar: "بليتش", ja: "ブリーチ", alt: ["Bleach: Thousand-Year Blood War"] },
  { en: "Dragon Ball Z", ar: "دراغون بول زد", ja: "ドラゴンボールZ", alt: ["Dragon Ball Super"] },
  { en: "Hunter x Hunter", ar: "هنتر × هنتر", ja: "ハンター×ハンター" },
  { en: "Detective Conan", ar: "المحقق كونان", ja: "名探偵コナン" },
  { en: "Fairy Tail", ar: "فيري تيل", ja: "フェアリーテイル" },
  { en: "Gintama", ar: "جينتاما", ja: "銀魂" },
  { en: "Black Clover", ar: "بلاك كلوفر", ja: "ブラッククローバー" },
  { en: "Boruto", ar: "بوروتو", ja: "BORUTO" },
  { en: "Attack on Titan", ar: "هجوم العمالقة", ja: "進撃の巨人" },
  { en: "Demon Slayer", ar: "قاتل الشياطين", ja: "鬼滅の刃", alt: ["Kimetsu no Yaiba"] },
  { en: "Jujutsu Kaisen", ar: "جوجوتسو كايسن", ja: "呪術廻戦", alt: ["JJK"] },
  { en: "My Hero Academia", ar: "ماي هيرو أكاديميا", ja: "僕のヒーローアカデミア", alt: ["MHA"] },
  { en: "Chainsaw Man", ar: "تشينسو مان", ja: "チェンソーマン" },
  { en: "Solo Leveling", ar: "سولو لفلينغ", ja: "俺だけレベルアップな件" },
  { en: "Kaiju No. 8", ar: "كايجو رقم 8", ja: "怪獣8号" },
  { en: "Hell's Paradise", ar: "جنة الجحيم", ja: "地獄楽" },
  { en: "Vinland Saga", ar: "فينلاند ساغا", ja: "ヴィンランド・サガ" },
  { en: "Mob Psycho 100", ar: "موب سايكو 100", ja: "モブサイコ100" },
  { en: "One Punch Man", ar: "ون بنش مان", ja: "ワンパンマン" },
  { en: "Fire Force", ar: "فاير فورس", ja: "炎炎ノ消防隊" },
  { en: "Tokyo Ghoul", ar: "طوكيو غول", ja: "東京喰種" },
  { en: "Blue Exorcist", ar: "الملاك الأزرق", ja: "青の祓魔師" },
  { en: "Death Note", ar: "ديث نوت", ja: "デスノート" },
  { en: "Code Geass", ar: "كود جياس", ja: "コードギアス", alt: ["Code Geass: Lelouch of the Rebellion"] },
  { en: "Monster", ar: "مونستر", ja: "モンスター" },
  { en: "Fullmetal Alchemist: Brotherhood", ar: "الخيميائي الفولاذي", ja: "鋼の錬金術師 FULLMETAL ALCHEMIST" },
  { en: "Steins;Gate", ar: "ستاينز غيت", ja: "STEINS;GATE" },
  { en: "Psycho-Pass", ar: "سايكو باس", ja: "PSYCHO-PASS" },
  { en: "The Promised Neverland", ar: "الميعاد المستحيل", ja: "約束のネバーランド" },
  { en: "Erased", ar: "إيريزد", ja: "僕だけがいない街" },
  { en: "Classroom of the Elite", ar: "فصل النخبة", ja: "ようこそ実力至上主義の教室へ" },
  { en: "Tomodachi Game", ar: "توموداتشي غيم", ja: "トモダチゲーム" },
  { en: "Summertime Rendering", ar: "صيف الرسم", ja: "サマータイムレンダ" },
  { en: "Pluto", ar: "بلوتو", ja: "PLUTO" },
  { en: "Frieren: Beyond Journey's End", ar: "فرييرن", ja: "葬送のフリーレン", alt: ["Frieren"] },
  { en: "Mushoku Tensei", ar: "مشوكو تنسي", ja: "無職転生", alt: ["Mushoku Tensei: Jobless Reincarnation"] },
  { en: "Re:Zero", ar: "ري زيرو", ja: "Re:ゼロ", alt: ["Re:Zero - Starting Life in Another World"] },
  { en: "That Time I Got Reincarnated as a Slime", ar: "السلايم", ja: "転生したらスライムだった件" },
  { en: "Overlord", ar: "أوفرلورد", ja: "オーバーロード" },
  { en: "The Rising of the Shield Hero", ar: "بطل الدرع", ja: "盾の勇者の成り上がり" },
  { en: "Sword Art Online", ar: "سورد آرت أونلاين", ja: "ソードアート・オンライン" },
  { en: "Eminence in Shadow", ar: "سيد الظل", ja: "陰の実力者になりたくて!" },
  { en: "Made in Abyss", ar: "صنع في الهاوية", ja: "メイドインアビス" },
  { en: "Dororo", ar: "دورورو", ja: "どろろ" },
  { en: "Berserk", ar: "بيرسيرك", ja: "ベルセルク" },
  { en: "Claymore", ar: "كلايمور", ja: "クレイモア" },
  { en: "Haikyu!!", ar: "هايكيو", ja: "ハイキュー!!" },
  { en: "Blue Lock", ar: "بلو لوك", ja: "ブルーロック" },
  { en: "Kuroko's Basketball", ar: "كوروكو", ja: "黒子のバスケ" },
  { en: "Hajime no Ippo", ar: "هاجيمي نو إيبو", ja: "はじめの一歩" },
  { en: "Slam Dunk", ar: "سلام دانك", ja: "スラムダンク" },
  { en: "Diamond no Ace", ar: "دايموند إيس", ja: "ダイヤのA" },
  { en: "Free!", ar: "فري", ja: "Free!" },
  { en: "Yowamushi Pedal", ar: "يواموشي بيدال", ja: "弱虫ペダル" },
  { en: "Aoashi", ar: "أواشي", ja: "アオアシ" },
  { en: "Violet Evergarden", ar: "فايوليت إيفرغاردن", ja: "ヴァイオレット・エヴァーガーデン" },
  { en: "Your Lie in April", ar: "كذبتك في أبريل", ja: "四月は君の嘘" },
  { en: "Kaguya-sama: Love is War", ar: "كاغويا ساما", ja: "かぐや様は告らせたい" },
  { en: "Spy x Family", ar: "سباي × فاميلي", ja: "SPY×FAMILY" },
  { en: "Oshi no Ko", ar: "أوشي نو كو", ja: "【推しの子】" },
  { en: "Horimiya", ar: "هوريميا", ja: "ホリミヤ" },
  { en: "A Silent Voice", ar: "صوت صامت", ja: "聲の形" },
  { en: "Your Name", ar: "اسمك", ja: "君の名は。" },
  { en: "Anohana", ar: "أنohana", ja: "あの日見た花の名前を僕達はまだ知らない。", alt: ["Anohana: The Flower We Saw That Day"] },
  { en: "Great Teacher Onizuka", ar: "المعلم العظيم أونيزوكا", ja: "GTO", alt: ["GTO"] },
  { en: "Grand Blue", ar: "غراند بلو", ja: "ぐらんぶる" },
  { en: "Fruits Basket", ar: "فروتس باسكت", ja: "フルーツバスケット" },
  { en: "Clannad: After Story", ar: "كلاناد", ja: "CLANNAD" },
  { en: "Ranking of Kings", ar: "تصنيف الملوك", ja: "王様ランキング" },
  { en: "Bocchi the Rock!", ar: "بوتشي ذا روك", ja: "ぼっち・ざ・ろっく!" },
  { en: "Neon Genesis Evangelion", ar: "إيفانجيليون", ja: "新世紀エヴァンゲリオン" },
  { en: "Cowboy Bebop", ar: "كاوبوي بيبوب", ja: "カウボーイビバップ" },
  { en: "Cyberpunk: Edgerunners", ar: "سايبربانك", ja: "CYBERPUNK: EDGERUNNERS" },
  { en: "Gurren Lagann", ar: "جرين لاغان", ja: "天元突破グレンラガン" },
  { en: "Ghost in the Shell", ar: "شبح في القشرة", ja: "攻殻機動隊" },
  { en: "Akira", ar: "أكيرا", ja: "AKIRA" },
  { en: "Spirited Away", ar: "المخطوفة", ja: "千と千尋の神隠し" },
  { en: "Princess Mononoke", ar: "أميرة مونونوكي", ja: "もののけ姫" },
  { en: "Howl's Moving Castle", ar: "قلعة هاول المتحركة", ja: "ハウルの動く城" },
  { en: "Gachiakuta", ar: "غاتشياكوتا", ja: "ガチアクタ" },
  { en: "Sakamoto Days", ar: "ساكاموتو دايز", ja: "サカモトデイズ" },
  { en: "Dandadan", ar: "داندادان", ja: "ダンダダン" },
  { en: "Yomi no Tsugai", ar: "يومي نو تسوجاي", ja: "黄泉のツガイ" },
  { en: "Witch Hat Atelier", ar: "أتيليه قبعة الساحرة", ja: "とんがり帽子のアトリエ" },
];

export const ANIME_CONTENT_KEYWORDS = {
  en: [
    "best anime 2026",
    "anime community",
    "new anime episodes",
    "anime duel clips",
    "best anime clips",
    "seasonal anime list",
    "action anime",
    "fighting anime",
    "hype anime",
    "most popular anime",
    "anime challenges",
    "anime ratings",
    "anime news",
    "anime schedule",
    "completed anime",
    "ongoing anime",
    "famous anime characters",
    "strongest anime fighter",
  ],
  ar: [
    "أفضل أنمي 2026",
    "مجتمع أنمي",
    "حلقات أنمي جديدة",
    "لقطات نزال أنمي",
    "أفضل لقطات أنمي",
    "قائمة أنمي الموسم",
    "أنمي أكشن",
    "أنمي قتالات",
    "أنمي حماسي",
    "أشهر الأنميات",
    "تحديات أنمي",
    "تقييم أنمي",
    "أخبار الأنمي",
    "مواعيد الأنمي",
    "أنمي مكتمل",
    "أنمي مستمر",
    "شخصيات أنمي مشهورة",
    "أقوى مقاتل في الأنمي",
  ],
  ja: [
    "2026年 おすすめアニメ",
    "アニメ コミュニティ",
    "新アニメ エピソード",
    "アニメ デュエルクリップ",
    "アニメ 名シーン",
    "今期アニメ 一覧",
    "アクション アニメ",
    "バトル アニメ",
    "熱い アニメ",
    "人気 アニメ",
    "アニメ クリップ",
    "アニメ チャレンジ",
    "アニメ 評価",
    "アニメ ニュース",
    "アニメ 放送予定",
    "完結 アニメ",
    "放送中 アニメ",
    "有名 アニメ キャラ",
    "最強 アニメ キャラ",
  ],
} as const;

export const CLASH_COMPETITION_KEYWORDS = {
  en: [
    "anime challenge",
    "anime duels",
    "best anime fight",
    "anime clip challenge",
    "anime voting",
    "who is stronger",
    "anime fight voting",
    "anime competition",
    "best clip contest",
    "top 12 challenge",
    "Clash Anime",
    "anime cash prize",
    "engagement challenge",
    "interaction king",
    "anime race",
    "duel arena",
    "video challenge",
    "daily voting",
    "challenge prizes",
    "who tops the leaderboard",
  ],
  ar: [
    "تحدي الأنمي",
    "نزالات أنمي",
    "أفضل قتال أنمي",
    "تحدي لقطات أنمي",
    "تصويت أنمي",
    "من الأقوى",
    "تصويت قتالات الأنمي",
    "منافسة الأنمي",
    "مسابقة أفضل لقطة",
    "تحدي الـ 12 الكبار",
    "كلاش أنمي",
    "جائزة مالية أنمي",
    "تحدي التفاعل",
    "ملك التفاعلات",
    "سباق الأنمي",
    "ساحة النزالات",
    "تحدي الفيديوهات",
    "تصويت يومي",
    "جوائز التحدي",
    "من يتصدر القائمة",
  ],
  ja: [
    "アニメ チャレンジ",
    "アニメ 対戦",
    "最高の アニメ バトル",
    "アニメ クリップ 対決",
    "アニメ 投票",
    "どっちが強い",
    "バトル 投票",
    "アニメ 競争",
    "ベストクリップ コンテスト",
    "トップ12 チャレンジ",
    "クラッシュアニメ",
    "アニメ 賞金",
    "エンゲージメント チャレンジ",
    "インタラクション キング",
    "アニメ レース",
    "対戦 アリーナ",
    "動画 チャレンジ",
    "デイリー 投票",
    "チャレンジ 賞品",
    "ランキング 1位",
  ],
} as const;

export const LONG_TAIL_KEYWORDS = {
  en: [
    "best site for anime challenges",
    "how to earn from anime clips",
    "interactive anime duel site",
    "anime voting challenge",
    "where to find best anime clips",
    "site where top anime ranks",
    "real money prizes competition",
    "compete for best anime clip title",
    "interactive anime community 2026",
    "ClashAnime platform for anime",
  ],
  ar: [
    "أفضل موقع لتحديات الأنمي",
    "كيف أربح من لقطات الأنمي",
    "موقع لنزالات الأنمي التفاعلية",
    "تحدي تصويت الأنمي",
    "أين أجد أفضل لقطات أنمي",
    "موقع يتصدر فيه أفضل الأنميات",
    "جوائز مالية حقيقية للمنافسة",
    "التنافس على لقب أفضل لقطة أنمي",
    "مجتمع الأنمي المتفاعل 2026",
    "منصة ClashAnime للأنمي",
  ],
  ja: [
    "アニメ チャレンジ おすすめサイト",
    "アニメ クリップ 稼ぎ方",
    "インタラクティブ アニメ 対戦 サイト",
    "アニメ 投票 チャレンジ",
    "最高のアニメ クリップ どこ",
    "アニメ ランキング サイト",
    "本物の 賞金 コンテスト",
    "ベストクリップ タイトル 争奪",
    "アニメ コミュニティ 2026",
    "ClashAnime アニメ プラットフォーム",
  ],
} as const;

export const EXCLUSIVE_KEYWORDS = {
  en: [
    "exclusive anime clips",
    "rare anime content",
    "top 12 challenge",
    "interaction heroes",
    "clip challenge",
    "cash prizes anime",
    "anime title shop",
    "anime badges",
    "season leaders",
    "combat moment challenge",
  ],
  ar: [
    "لقطات حصرية",
    "محتوى أنمي نادر",
    "تحدي الـ 12",
    "أبطال التفاعلات",
    "تحدي المقطع",
    "جوائز نقدية لأنمي",
    "متجر ألقاب الأنمي",
    "أوسمة الأنمي",
    "متصدرين الموسم",
    "تحدي اللحظات القتالية",
  ],
  ja: [
    "限定 アニメ クリップ",
    "レア アニメ コンテンツ",
    "トップ12 チャレンジ",
    "インタラクション ヒーロー",
    "クリップ チャレンジ",
    "アニメ 現金 賞品",
    "アニメ 称号 ショップ",
    "アニメ バッジ",
    "シーズン リーダー",
    "バトル モーメント チャレンジ",
  ],
} as const;

const ANIME_TEMPLATE_EN = [
  (title: string) => `${title} clips`,
  (title: string) => `${title} fight`,
  (title: string) => `${title} challenge`,
  (title: string) => `${title} best moment`,
  (title: string) => `${title} voting`,
  (title: string) => `who wins ${title}`,
  (title: string) => `${title} season 2026`,
  (title: string) => `${title} hype clips`,
  (title: string) => `${title} battles`,
  (title: string) => `${title} ranking`,
  (title: string) => `${title} episode`,
  (title: string) => `${title} episodes`,
] as const;

const ANIME_TEMPLATE_AR = [
  (title: string) => `${title} لقطات`,
  (title: string) => `${title} قتال`,
  (title: string) => `${title} تحدي`,
  (title: string) => `${title} أفضل لحظة`,
  (title: string) => `${title} تصويت`,
  (title: string) => `من سيفوز في ${title}`,
  (title: string) => `${title} موسم 2026`,
  (title: string) => `${title} لقطات حماسية`,
  (title: string) => `${title} معارك`,
  (title: string) => `${title} تصنيف`,
  (title: string) => `${title} حلقة`,
  (title: string) => `${title} حلقات`,
] as const;

const ANIME_TEMPLATE_JA = [
  (title: string) => `${title} クリップ`,
  (title: string) => `${title} バトル`,
  (title: string) => `${title} チャレンジ`,
  (title: string) => `${title} 名シーン`,
  (title: string) => `${title} 投票`,
  (title: string) => `${title} 誰が勝つ`,
  (title: string) => `${title} 2026年`,
  (title: string) => `${title} 熱いシーン`,
  (title: string) => `${title} 戦闘`,
  (title: string) => `${title} ランキング`,
  (title: string) => `${title} エピソード`,
] as const;

function applyTemplates(
  title: string | undefined,
  templates: ReadonlyArray<(value: string) => string>,
): string[] {
  if (!title?.trim()) return [];
  return templates.map((fn) => fn(title.trim()));
}

export function buildAnimeDynamicKeywords(entries: AnimeSeoEntry[]): string[] {
  const keywords: string[] = [];

  for (const entry of entries) {
    keywords.push(entry.en);
    if (entry.ar) keywords.push(entry.ar);
    if (entry.ja) keywords.push(entry.ja);
    if (entry.alt) keywords.push(...entry.alt);

    keywords.push(...applyTemplates(entry.en, ANIME_TEMPLATE_EN));
    keywords.push(...applyTemplates(entry.ar, ANIME_TEMPLATE_AR));
    keywords.push(...applyTemplates(entry.ja, ANIME_TEMPLATE_JA));

    for (const alt of entry.alt ?? []) {
      keywords.push(...applyTemplates(alt, ANIME_TEMPLATE_EN));
    }
  }

  return keywords;
}

export function buildAnimeDynamicKeywordsFromTitles(titles: string[]): string[] {
  const unique = [...new Set(titles.map((title) => title.trim()).filter(Boolean))];
  return buildAnimeDynamicKeywords(unique.map((en) => ({ en })));
}

export function collectStaticSeoKeywords(): string[] {
  const catalogKeywords = buildAnimeDynamicKeywords(POPULAR_ANIME_CATALOG);
  const flatCatalogTitles = POPULAR_ANIME_CATALOG.flatMap((entry) =>
    [entry.en, entry.ar, entry.ja, ...(entry.alt ?? [])].filter((value): value is string =>
      Boolean(value?.trim()),
    ),
  );

  return [
    ...flatCatalogTitles,
    ...catalogKeywords,
    ...ANIME_CONTENT_KEYWORDS.en,
    ...ANIME_CONTENT_KEYWORDS.ar,
    ...ANIME_CONTENT_KEYWORDS.ja,
    ...CLASH_COMPETITION_KEYWORDS.en,
    ...CLASH_COMPETITION_KEYWORDS.ar,
    ...CLASH_COMPETITION_KEYWORDS.ja,
    ...LONG_TAIL_KEYWORDS.en,
    ...LONG_TAIL_KEYWORDS.ar,
    ...LONG_TAIL_KEYWORDS.ja,
    ...EXCLUSIVE_KEYWORDS.en,
    ...EXCLUSIVE_KEYWORDS.ar,
    ...EXCLUSIVE_KEYWORDS.ja,
  ];
}

export function dedupeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = keyword.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}
