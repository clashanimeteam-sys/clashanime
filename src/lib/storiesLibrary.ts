import type { Locale } from "@/lib/types";

export type StoryArticle = {
  slug: string;
  publishedAt: string;
  readingMinutes: number;
  /** Anime cover for library cards (MAL CDN). */
  coverImageUrl: string;
  coverAnimeTitle: string;
  locales: Record<
    Locale,
    {
      title: string;
      excerpt: string;
      sections: Array<{ heading: string; body: string }>;
    }
  >;
};

/** Original ClashAnime essays — text-only, no episode dumps or manga scans. */
export const STORY_ARTICLES: StoryArticle[] = [
  {
    slug: "why-found-family-stories-hit-so-hard",
    publishedAt: "2026-08-01",
    readingMinutes: 8,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
    coverAnimeTitle: "One Piece",
    locales: {
      en: {
        title: "Why “Found Family” Stories Hit So Hard in Anime",
        excerpt:
          "An original essay on how anime builds emotional bonds between strangers — and why that craft matters more than spectacle.",
        sections: [
          {
            heading: "The emotional shortcut that isn’t cheap",
            body: "Found-family storytelling works because it dramatizes belonging. Characters begin alone, rejected, or rootless, then slowly invent a home through shared risk. The best anime versions avoid easy speeches. They show trust through food, training, quiet chores, and the decision to stay when leaving would be safer.",
          },
          {
            heading: "Structure behind the feeling",
            body: "A strong found-family arc usually moves through three beats: isolation, reluctant alliance, and mutual responsibility. Spectacle can decorate those beats, but the spine is relationship change. When audiences cry, they are often responding to that spine — not only to a final battle pose.",
          },
          {
            heading: "Why it travels across cultures",
            body: "Belonging is a universal hunger. Arabic, English, and Japanese audiences can recognize the pattern even when settings differ: a pirate crew, a classroom club, a hunter team, a traveling theater troupe. ClashAnime highlights this craft in essays so fans can discuss stories without needing pirated streams.",
          },
          {
            heading: "How to watch with a critic’s eye",
            body: "Ask three questions: Who is lonely at the start? What shared cost creates trust? What does the group protect that an individual could not? Those questions turn passive viewing into active reading — and they work whether you watch legally on a licensed service or revisit memories of older seasons.",
          },
        ],
      },
      ar: {
        title: "لماذا تلمس قصص «العائلة المختارة» في الأنمي بهذه القوة؟",
        excerpt:
          "مقال أصلي عن كيف يبني الأنمي روابط عاطفية بين غرباء — ولماذا تكون الحرفة أهم من المشاهد البصرية وحدها.",
        sections: [
          {
            heading: "اختصار عاطفي… لكنه ليس رخيصاً",
            body: "قصص العائلة المختارة تنجح لأنها تصوّر الانتماء. يبدأ الأبطال وحيدين أو مرفوضين ثم يبنون بيتاً عبر المخاطرة المشتركة. أفضل الأعمال تتجنب الخطب السهلة؛ تُظهر الثقة بالطعام والتدريب والبقاء حين يكون الرحيل أسلم.",
          },
          {
            heading: "البنية خلف الشعور",
            body: "القوس القوي يمر غالباً بثلاث محطات: العزلة، التحالف المتردد، ثم المسؤولية المتبادلة. المشاهد الملحمية تزيّن البنية، لكن العمود الفقري هو تغيّر العلاقات.",
          },
          {
            heading: "لماذا تعبر الثقافات؟",
            body: "الانتماء حاجة عالمية. الجمهور العربي والإنجليزي والياباني يتعرف على النمط حتى لو اختلفت الإعدادات: طاقم قراصنة، نادٍ مدرسي، فريق صيادين. نناقش الحرفة هنا بلا الحاجة لبث مقرصن.",
          },
          {
            heading: "كيف تشاهد بعين ناقد؟",
            body: "اسأل: من وحيد في البداية؟ أي ثمن مشترك يصنع الثقة؟ ماذا تحمي الجماعة ولا يحميه الفرد؟ هذه الأسئلة تحوّل المشاهدة إلى قراءة فاعلة.",
          },
        ],
      },
      ja: {
        title: "アニメの「疑似家族」が心を打つ理由",
        excerpt: "他人同士が家族になる物語の技法を読み解くオリジナルエッセイ。",
        sections: [
          {
            heading: "安易ではない感情の近道",
            body: "疑似家族は所属感をドラマ化する。孤独から始まり、共有リスクで家を作る。名作は演説より食事・訓練・残る選択で信頼を見せる。",
          },
          {
            heading: "感情の背後の構造",
            body: "孤立→気が進まない同盟→相互責任。スペクタクルは飾りで、軸は関係の変化だ。",
          },
          {
            heading: "文化を超える理由",
            body: "所属欲は普遍。海賊団でも部活でも同じ型を読める。ClashAnimeは海賊配信なしで技法を語る。",
          },
          {
            heading: "批評的な観方",
            body: "誰が孤独か、何が信頼の対価か、集団だけが守れるものは何か。この三問で能動的に読める。",
          },
        ],
      },
    },
  },
  {
    slug: "silence-and-sound-in-anime-storytelling",
    publishedAt: "2026-08-02",
    readingMinutes: 7,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/5/87048.jpg",
    coverAnimeTitle: "Your Name",
    locales: {
      en: {
        title: "Silence and Sound: How Anime Directs Emotion Without Dialogue",
        excerpt:
          "Original craft notes on quiet frames, ambient noise, and musical restraint in anime storytelling.",
        sections: [
          {
            heading: "When quiet is louder",
            body: "Silence is not empty. A held shot of wind, footsteps, or a kettle can carry more grief than a monologue. Editors use silence to give the audience room to feel before the score returns.",
          },
          {
            heading: "Diegetic vs score",
            body: "Diegetic sound belongs to the world (rain, trains, classroom chatter). Non-diegetic score sits outside it. Great directors decide which layer owns the moment. Over-scoring every emotion flattens contrast.",
          },
          {
            heading: "Practical listening",
            body: "On your next legal watch, mute the screen for thirty seconds during a quiet scene, then unmute. Notice what the image was already saying. This habit improves appreciation without requiring spoilers or illegal uploads.",
          },
        ],
      },
      ar: {
        title: "الصمت والصوت: كيف يوجّه الأنمي المشاعر بلا حوار",
        excerpt: "ملاحظات أصلية عن اللقطات الهادئة والضوضاء المحيطة وضبط الموسيقى في سرد الأنمي.",
        sections: [
          {
            heading: "حين يكون الهدوء أعلى صوتاً",
            body: "الصمت ليس فراغاً. لقطة طويلة للريح أو الخطوات قد تحمل حزناً أعمق من مونولوج. المونتير يمنح الجمهور مساحة للشعور قبل عودة الموسيقى.",
          },
          {
            heading: "صوت العالم مقابل الموسيقى",
            body: "صوت العالم (مطر، قطار، صف) يختلف عن الموسيقى الخارجية. المخرج الجيد يختار من يملك اللحظة. المبالغة الموسيقية تسطّح التباين.",
          },
          {
            heading: "تمرين استماع عملي",
            body: "في مشاهدة قانونية، اكتم الصوت ثلاثين ثانية ثم أعده. لاحظ ما كانت الصورة تقوله أصلاً.",
          },
        ],
      },
      ja: {
        title: "沈黙と音——台詞なしで感情を導くアニメ技法",
        excerpt: "静かなカットと環境音、音楽の抑制についてのオリジナルノート。",
        sections: [
          {
            heading: "静けさが大きいとき",
            body: "沈黙は空虚ではない。風や足音の長回しが独白より深く語ることがある。",
          },
          {
            heading: "物語内音とスコア",
            body: "雨や教室のざわめきは世界の音。劇伴は外の層。どちらが瞬間を所有するかを決めるのが演出だ。",
          },
          {
            heading: "実践",
            body: "合法視聴で30秒ミュートし、映像が既に語っていたことに気づく練習を。",
          },
        ],
      },
    },
  },
  {
    slug: "rivalries-that-build-character",
    publishedAt: "2026-08-03",
    readingMinutes: 7,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    coverAnimeTitle: "Naruto",
    locales: {
      en: {
        title: "Rivalries That Build Character (Not Just Power Levels)",
        excerpt:
          "How rivalry arcs teach discipline, identity, and moral choice — beyond who punches harder.",
        sections: [
          {
            heading: "Rivalry as mirror",
            body: "A good rival reflects what the hero refuses to admit: envy, fear, unfinished talent. The fight is a conversation with fists, but the real progress is self-knowledge.",
          },
          {
            heading: "Avoiding empty power creep",
            body: "If each fight only raises numbers, stakes become noise. Better rivalries change goals: protect someone, refuse a shortcut, accept mentorship, redefine winning.",
          },
          {
            heading: "Classroom to battlefield",
            body: "Whether rivalry lives in sports anime, shonen tournaments, or quiet academic contests, the craft is the same: two paths, one shared stage, growth measured by choices.",
          },
        ],
      },
      ar: {
        title: "المنافسات التي تبني الشخصية (لا مستويات القوة فقط)",
        excerpt: "كيف تعلّم أقواس المنافسة الانضباط والهوية والاختيار الأخلاقي — أبعد من من يضرب أقوى.",
        sections: [
          {
            heading: "المنافس كمرآة",
            body: "المنافس الجيد يعكس ما يرفض البطل الاعتراف به: الحسد أو الخوف أو الموهبة غير المكتملة. القتال حوار، والتقدّم معرفة للنفس.",
          },
          {
            heading: "تجنّب تضخّم القوة الفارغ",
            body: "إذا رفع كل قتال الأرقام فقط صارت المخاطر ضوضاء. المنافسات الأفضل تغيّر الأهداف: حماية أحد، رفض اختصار، قبول الإرشاد.",
          },
          {
            heading: "من الصف إلى الميدان",
            body: "رياضة أو بطولة أو تنافس دراسي — الحرفة واحدة: طريقان، مسرح مشترك، نمو يُقاس بالاختيارات.",
          },
        ],
      },
      ja: {
        title: "強さ数値ではない、人格を作るライバル関係",
        excerpt: "競争が規律・アイデンティティ・倫理的選択を教える仕組み。",
        sections: [
          {
            heading: "鏡としてのライバル",
            body: "良いライバルは英雄が認めたくない自己を映す。成長は自己認識だ。",
          },
          {
            heading: "空虚なパワーインフレを避ける",
            body: "数値だけの勝負は騒音になる。目標の変化が本質。",
          },
          {
            heading: "教室から戦場まで",
            body: "スポーツも学園も同じ型：二つの道、一つの舞台、選択で測る成長。",
          },
        ],
      },
    },
  },
  {
    slug: "worldbuilding-small-details",
    publishedAt: "2026-08-04",
    readingMinutes: 6,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    coverAnimeTitle: "Frieren",
    locales: {
      en: {
        title: "Worldbuilding Through Small Details: Signs, Snacks, and Side Characters",
        excerpt:
          "Original notes on how tiny props and extras make anime worlds feel lived-in.",
        sections: [
          {
            heading: "Texture over exposition",
            body: "A handwritten shop sign, a seasonal snack, or a background student with a routine can sell a world faster than a lore dump. Texture invites curiosity without demanding a wiki.",
          },
          {
            heading: "Side characters as proof of life",
            body: "When extras have habits, the city feels occupied. When they exist only to deliver information, the world feels hollow. Look for recurring faces in legal rewatches.",
          },
          {
            heading: "Why this helps writers",
            body: "Aspiring writers can practice by listing ten ordinary objects from a favorite series and explaining what each object implies about culture, class, or climate — without copying protected art.",
          },
        ],
      },
      ar: {
        title: "بناء العالم بالتفاصيل الصغيرة: لافتات ووجبات وشخصيات جانبية",
        excerpt: "ملاحظات أصلية عن كيف تجعل الأدوات الصغيرة عوالم الأنمي حية.",
        sections: [
          {
            heading: "الملمس أهم من الشرح الطويل",
            body: "لافتة مكتوبة بخط اليد أو وجبة موسمية قد تبني العالم أسرع من فقرة معلومات. الملمس يثير الفضول بلا ويكيبيديا.",
          },
          {
            heading: "الشخصيات الجانبية كدليل حياة",
            body: "حين يكون للخلفيات عادات تبدو المدينة مسكونة. ابحث عن وجوه متكررة في إعادة مشاهدة قانونية.",
          },
          {
            heading: "فائدة للكتّاب",
            body: "تمرّن بسرد عشرة أشياء عادية من عمل تحبه وما تعنيه عن الثقافة والطبقة والمناخ — بلا نسخ فن محمي.",
          },
        ],
      },
      ja: {
        title: "小さなディテールで作る世界観——看板・食べ物・端役",
        excerpt: "小道具と端役が世界を生きたものにする技法メモ。",
        sections: [
          {
            heading: "説明より質感",
            body: "手書きの看板や季節のおやつが、長台詞より速く世界を売る。",
          },
          {
            heading: "端役は生活の証拠",
            body: "習慣のある端役が街を住まわせる。情報屋だけの端役は空洞だ。",
          },
          {
            heading: "作家向け練習",
            body: "好きな作品の日常物を10個挙げ、文化・階級・気候を読む。保護された絵は模写しない。",
          },
        ],
      },
    },
  },
  {
    slug: "endings-that-respect-the-audience",
    publishedAt: "2026-08-05",
    readingMinutes: 7,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
    coverAnimeTitle: "Steins;Gate",
    locales: {
      en: {
        title: "Endings That Respect the Audience",
        excerpt:
          "What separates a earned finale from a rushed twist — themes, callbacks, and emotional honesty.",
        sections: [
          {
            heading: "Promise and payoff",
            body: "An ending feels earned when it answers the story’s first question. If the opening asked “Can this loner trust again?”, the finale should respond in action, not only in a speech.",
          },
          {
            heading: "Callbacks without trivia",
            body: "Good callbacks return symbols with new meaning. Bad callbacks only wink at fans. The difference is whether the image has changed the character.",
          },
          {
            heading: "Ambiguity vs confusion",
            body: "Ambiguity invites interpretation. Confusion hides missing craft. If two smart viewers disagree about theme, that can be healthy. If nobody can explain cause and effect, the ending failed.",
          },
        ],
      },
      ar: {
        title: "نهايات تحترم الجمهور",
        excerpt: "ما يفرق النهاية المستحقة عن المفاجأة المتعجلة: الثيمات والعودة الصادقة للعاطفة.",
        sections: [
          {
            heading: "وعد ووفاء",
            body: "النهاية المستحقة تجيب سؤال البداية بالفعل لا بالخطبة فقط.",
          },
          {
            heading: "عودة بلا توافه",
            body: "العودة الجيدة تعيد رمزاً بمعنى جديد. السيئة تغمز المعجبين فقط.",
          },
          {
            heading: "غموض أم ارتباك؟",
            body: "الغموض يدعو للتأويل. الارتباك يخفي نقص الحرفة.",
          },
        ],
      },
      ja: {
        title: "観客を尊重する結末",
        excerpt: "急ごしらえのどんでん返しと、earned ending の違い。",
        sections: [
          {
            heading: "約束と回収",
            body: "冒頭の問いに行動で答える結末がearnedだ。",
          },
          {
            heading: "コールバック",
            body: "意味が更新される回収は良い。ただのファンサービスは弱い。",
          },
          {
            heading: "曖昧さと混乱",
            body: "解釈を開く曖昧さは良い。因果が不明な混乱は失敗。",
          },
        ],
      },
    },
  },
  {
    slug: "daily-heroes-brief-how-we-update",
    publishedAt: "2026-08-06",
    readingMinutes: 5,
    coverImageUrl: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    coverAnimeTitle: "Attack on Titan",
    locales: {
      en: {
        title: "Daily Heroes Brief: How ClashAnime Updates the Guide",
        excerpt:
          "How our Heroes Guide and anime news desk refresh daily with editorial summaries — without piracy.",
        sections: [
          {
            heading: "What updates daily",
            body: "Anime news drafts are synced from public RSS sources, then shaped into ClashAnime summaries when published. Radar calendars refresh on a schedule. Stories and essays remain original text you can read anytime.",
          },
          {
            heading: "What never updates as piracy",
            body: "We do not add full episodes, manga chapter dumps, or stolen art packs. Catalog pages link out for discovery. Legal reading and watching stay on official platforms.",
          },
          {
            heading: "Where to check each morning",
            body: "Start at Anime News, then open Stories for essays, Manga/Gallery catalogs for discovery, Radar for schedules, and Radio for ambience while you read.",
          },
        ],
      },
      ar: {
        title: "موجز الأبطال اليومي: كيف نحدّث الدليل",
        excerpt: "كيف يتجدّد دليل الأبطال وأخبار الأنمي يومياً بملخصات تحريرية — بلا قرصنة.",
        sections: [
          {
            heading: "ما يتحدّث يومياً",
            body: "مسودات أخبار الأنمي تُزامَن من مصادر RSS عامة ثم تُصاغ كملخصات ClashAnime عند النشر. الرادار يتحدّث وفق جدول. القصص مقالات أصلية دائمة.",
          },
          {
            heading: "ما لا نحدّثه كقرصنة",
            body: "لا حلقات كاملة ولا فصول مانغا ولا حزم فن مسروق. الكتالوجات للاكتشاف عبر روابط خارجية.",
          },
          {
            heading: "صباح كل يوم",
            body: "ابدأ بأخبار الأنمي ثم القصص ثم المانغا/الصور ثم الرادار والراديو.",
          },
        ],
      },
      ja: {
        title: "デイリー英雄ブリーフ——ガイド更新の仕組み",
        excerpt: "ヒーローズガイドとニュースを日次で更新する方法（海賊版なし）。",
        sections: [
          {
            heading: "毎日更新するもの",
            body: "公開RSSからニュース下書きを同期し、公開時にClashAnime要約へ。レーダーも定期更新。物語は常設のオリジナル文章。",
          },
          {
            heading: "海賊版としては更新しない",
            body: "本編・単行本スキャン・盗用素材は追加しない。カタログは発見用リンク。",
          },
          {
            heading: "朝の回り方",
            body: "ニュース→物語→マンガ/画像→レーダー→ラジオ。",
          },
        ],
      },
    },
  },
];

export function getStoryArticle(slug: string): StoryArticle | undefined {
  return STORY_ARTICLES.find((article) => article.slug === slug);
}

export function getStorySlugs(): string[] {
  return STORY_ARTICLES.map((article) => article.slug);
}

export function getStoryCopy(slug: string, locale: Locale) {
  const article = getStoryArticle(slug);
  if (!article) return null;
  return article.locales[locale] ?? article.locales.en;
}
