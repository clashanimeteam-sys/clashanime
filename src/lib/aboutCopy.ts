import type { Locale } from "@/lib/types";

export type AboutIcon = "spark" | "code" | "globe" | "scale" | "coins" | "users" | "rocket" | "heart";

export type AboutCopy = {
  title: string;
  intro: string;
  storyHeading: string;
  storyTagline: string;
  chapters: Array<{ icon: AboutIcon; heading: string; body: string }>;
  visionHeading: string;
  visionIntro: string;
  pillars: Array<{ icon: AboutIcon; title: string; body: string }>;
  heroesHeading: string;
  heroesBody: string;
  futureHeading: string;
  futureBody: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  teamHeading: string;
  teamIntro: string;
  teamRoles: Array<{ title: string; description: string }>;
  teamContactLabel: string;
  teamContactEmail: string;
};

const aboutAr: AboutCopy = {
  title: "معلومات عنا",
  intro:
    "بدأنا ClashAnime من شغفنا بعالم الأنمي، بهدف إنشاء مساحة تكسر قيود المشاهدة العادية. نحن نؤمن بأن الأنمي ليس مجرد قصص نشاهدها، بل هو تجربة تستحق التنافس، والتحليل، والمشاركة مع مجتمع عالمي يفهم قيمتها.",
  storyHeading: "قصة ClashAnime",
  storyTagline: "حيث يولد الأبطال وتشتعل النزالات",
  chapters: [
    {
      icon: "spark",
      heading: "البداية: شرارة الفكرة",
      body: `لم تكن ClashAnime مجرد كود برمجناه أو موقعاً وضعناه على الإنترنت. بدأت الحكاية من غرفتنا البسيطة، حيث كنا نقضي ساعات في مشاهدة قتالات الأنمي، نتجادل حول "من هو الأقوى؟" و"من صاحب اللقطة الأسطورية؟". لاحظنا أن كل ما حولنا مجرد منصات "للمشاهدة السلبية"؛ فيديوهات تمر أمامنا دون أن نكون جزءاً منها. هنا ولد التساؤل: لماذا لا نملك ساحة خاصة بنا؟ ساحة لا نكتفي فيها بالمشاهدة، بل نصنع فيها التحدي؟`,
    },
    {
      icon: "code",
      heading: "من الفكرة إلى الواقع: التحدي التقني",
      body: `قررنا أن نحول هذا الشغف إلى نظام رقمي. لم يكن الأمر سهلاً، فقد كان التحدي هو كيف نجمع "عشاق الأنمي" من كل صقاع الأرض في مكان واحد، دون أن يشعروا بالمسافة أو اختلاف اللغة. بنينا ClashAnime لتكون أكثر من مجرد موقع؛ صممناها لتكون "نظاماً بيئياً" يعتمد على سرعة التفاعل (Real-time Engagement)، حيث تتحرك المراكز وتشتعل المنافسة أمام عينيك في كل ثانية.`,
    },
    {
      icon: "users",
      heading: "بناء ثقافة تنافس عادلة",
      body: `المنافسة بلا قواعد تتحول إلى فوضى. استثمرنا في لوحات ترتيب عامة، ونوافذ نزال مؤقتة، وأدوات إبلاغ، وإرشادات مجتمع مكتوبة، ومسارات إشراف حتى يثق المبدعون بالساحة. الترتيب يعتمد على تفاعل حقيقي — إعجابات وتعليقات ومشاركات — فتصبح القصة وطاقة المجتمع أهم من الأرقام الفارغة.`,
    },
    {
      icon: "coins",
      heading: "مكافآت بمسؤولية",
      body: `ClashCoins وجوائز الموسم موجودة لتقدير المساهمة المستمرة والموثّقة — لا معجزات بين ليلة وضحاها. شروط الاستحقاق وKYC للسحب ومكافحة الاحتيال تحمي الأعضاء النزيهين. ننشر أدلة وأسئلة شائعة لتبقى التوقعات شفافة للمبدعين والعائلات ومراجعي المنصات.`,
    },
    {
      icon: "globe",
      heading: "عربي وإنجليزي وياباني — ساحة واحدة",
      body: `عالم الأنمي متعدد اللغات. ClashAnime يقدّم واجهة ودليل الأبطال بالعربية والإنجليزية واليابانية حتى يتعلّم الأعضاء قواعد النزال والرتب واللعب النظيف بلغتهم، بينما يتنافسون على اللوحات العالمية ذاتها.`,
    },
  ],
  visionHeading: "رؤيتنا: أن نكون وجهة العالم الأولى",
  visionIntro:
    'نحن لا نطمح لنكون "موقعاً آخر"، بل نسعى لتكون ClashAnime هي المنصة التي يلجأ إليها أي شخص في العالم قبل أن يقرر من هو الأفضل. نخطط لذلك من خلال:',
  pillars: [
    {
      icon: "globe",
      title: "عالمية المحتوى",
      body: "جعل اللغات (العربية، الإنجليزية، اليابانية) جسراً يربط عشاق الأنمي، بحيث لا يكون هناك حاجز يمنع أي بطل من مشاركة إبداعه.",
    },
    {
      icon: "scale",
      title: "نظام النزالات العادل",
      body: 'استخدام خوارزمياتنا لضمان أن الفيديوهات التي تحصل على "أصوات" حقيقية هي التي تتصدر، بعيداً عن الطرق التقليدية.',
    },
    {
      icon: "coins",
      title: "اقتصاد المجتمع",
      body: "إيماننا بأن المحتوى يستحق تقديراً حقيقياً، لذلك أطلقنا ClashCoins، لتكون عملة أبطالنا التي تترجم شغفهم إلى قيمة ملموسة.",
    },
  ],
  heroesHeading: "نداء إلى الأبطال: نحن نجتمع لنصنع التاريخ",
  heroesBody:
    'نحن في ClashAnime نؤمن أن القوة ليست في المشاهدة الفردية، بل في "التجمع". نحن ندعوك لتكون جزءاً من هذا التحدي. سواء كنت فناناً يصنع الـ "Edits"، أو متابعاً شغوفاً يبحث عن الأقوى، أو حتى شخصاً يريد أن يختبر ذكاءه في التوقعات.. مكانك هنا.',
  futureHeading: "مستقبلنا يُكتب الآن",
  futureBody:
    'نحن نطور المنصة كل يوم لتكون أسرع، أذكى، وأكثر عدلاً. كل تحديث نطلقه في ClashAnime هو خطوة جديدة لنكون المنصة الأولى عالمياً. نحن لا نبني موقعاً، نحن نبني "أرينا" رقمية خالدة.',
  ctaHeading: "هل أنت مستعد لنقل تجربتك في الأنمي إلى المستوى التالي؟",
  ctaBody: "انضم للصدام اليوم!",
  ctaButton: "انضم الآن",
  teamHeading: "فريق العمل",
  teamIntro:
    "خلف ClashAnime فريق صغير شغوف بعالم الأنمي، يجمع بين التقنية والإبداع وإدارة المجتمع. نعمل يومياً من أجل بناء أرينا رقمية تليق بعشاق الأنمي حول العالم.",
  teamRoles: [
    {
      title: "الرؤية والمنتج",
      description: "نحوّل شغف الأنمي إلى تجربة تفاعلية عالمية تليق بالمجتمع.",
    },
    {
      title: "الهندسة والتطوير",
      description: "نبني منصة سريعة وآمنة تعتمد على التفاعل في الوقت الفعلي.",
    },
    {
      title: "المجتمع والدعم",
      description: "نرافق المبدعين والمتابعين ونضمن بيئة عادلة للجميع.",
    },
  ],
  teamContactLabel: "تواصل مع الفريق",
  teamContactEmail: "clashanime.team@gmail.com",
};

const aboutEn: AboutCopy = {
  title: "About Us",
  intro:
    "We started ClashAnime out of our passion for anime, with the goal of creating a space that breaks the limits of passive viewing. We believe anime is not just stories we watch — it is an experience worth competing over, analyzing, and sharing with a global community that understands its value.",
  storyHeading: "The ClashAnime Story",
  storyTagline: "Where heroes are born and duels ignite",
  chapters: [
    {
      icon: "spark",
      heading: "The Beginning: A Spark of an Idea",
      body: `ClashAnime was never just code we wrote or a site we put online. The story started in our simple room, where we spent hours watching anime battles, arguing over "who is stronger?" and "who landed the legendary moment?". We noticed everything around us was built for passive viewing — videos passing by without us being part of them. That is when the question was born: why don't we have our own arena? An arena where we do not just watch, but create the challenge?`,
    },
    {
      icon: "code",
      heading: "From Idea to Reality: The Technical Challenge",
      body: `We decided to turn that passion into a digital system. It was not easy — the challenge was bringing anime fans from every corner of the world into one place without distance or language feeling like a barrier. We built ClashAnime to be more than a website; we designed it as an ecosystem powered by real-time engagement, where ranks move and competition ignites before your eyes every second.`,
    },
    {
      icon: "users",
      heading: "Building a Fair Competitive Culture",
      body: `Competition without rules becomes noise. We invested in public leaderboards, timed clash windows, report tools, written Community Guidelines, and moderation workflows so creators can trust the arena. Ranking emphasizes real engagement signals — likes, comments, and shares — so storytelling and community energy matter more than empty metrics.`,
    },
    {
      icon: "coins",
      heading: "Rewards with Responsibility",
      body: `ClashCoins and seasonal prizes exist to recognize consistent, verified contribution — not overnight miracles. Eligibility, KYC for cash-outs, and anti-fraud checks protect honest members. We publish guides and FAQ pages so expectations stay transparent for creators, families, and platform reviewers.`,
    },
    {
      icon: "globe",
      heading: "Arabic, English, Japanese — One Arena",
      body: `Anime fandom is multilingual. ClashAnime ships product copy and Heroes Guide articles in Arabic, English, and Japanese so members can learn the rules of clashes, ranks, and fair play in the language they prefer while competing on the same global boards.`,
    },
  ],
  visionHeading: "Our Vision: The World's First Destination",
  visionIntro:
    "We do not aim to be just another site. We want ClashAnime to be the platform anyone turns to before deciding who is the best. We are building toward that through:",
  pillars: [
    {
      icon: "globe",
      title: "Global Content",
      body: "Arabic, English, and Japanese as bridges connecting anime fans — so no hero is blocked from sharing their creativity.",
    },
    {
      icon: "scale",
      title: "Fair Duel System",
      body: "Our algorithms ensure videos that earn real votes rise to the top — away from traditional, opaque ranking methods.",
    },
    {
      icon: "coins",
      title: "Community Economy",
      body: "We believe content deserves real appreciation. That is why we launched ClashCoins — our heroes' currency that turns passion into tangible value.",
    },
  ],
  heroesHeading: "A Call to Heroes: We Gather to Make History",
  heroesBody:
    "At ClashAnime we believe strength is not in watching alone, but in gathering. We invite you to be part of this challenge — whether you are an artist making edits, a passionate fan hunting for the strongest, or someone who wants to test their prediction skills. Your place is here.",
  futureHeading: "Our Future Is Being Written Now",
  futureBody:
    "We improve the platform every day to make it faster, smarter, and fairer. Every update we ship is a step toward becoming the world's number-one platform. We are not building a website — we are building an eternal digital arena.",
  ctaHeading: "Ready to take your anime experience to the next level?",
  ctaBody: "Join the clash today!",
  ctaButton: "Join Now",
  teamHeading: "Our Team",
  teamIntro:
    "Behind ClashAnime is a small team passionate about anime, combining technology, creativity, and community care. We work every day to build a digital arena worthy of fans worldwide.",
  teamRoles: [
    {
      title: "Product & Vision",
      description: "Turning anime passion into a global, interactive experience.",
    },
    {
      title: "Engineering",
      description: "Building a fast, secure platform powered by real-time engagement.",
    },
    {
      title: "Community & Support",
      description: "Standing with creators and fans and keeping the arena fair for everyone.",
    },
  ],
  teamContactLabel: "Contact the team",
  teamContactEmail: "clashanime.team@gmail.com",
};

const aboutJa: AboutCopy = {
  title: "私たちについて",
  intro:
    "ClashAnimeは、受動的な視聴の枠を超える場をつくりたいというアニメへの情熱から始まりました。アニメはただ見る物語ではなく、競い、分析し、価値を理解する世界のコミュニティと分かち合う体験だと私たちは考えています。",
  storyHeading: "ClashAnimeの物語",
  storyTagline: "ヒーローが生まれ、デュエルが燃える場所",
  chapters: [
    {
      icon: "spark",
      heading: "始まり：アイデアの火花",
      body: `ClashAnimeは、書いたコードや公開したサイトだけの話ではありません。部屋でアニメのバトルを何時間も見て、「誰が最強？」「どの瞬間が伝説か？」と議論する日常から生まれました。周りは受動的な視聴ばかりで、自分は物語の一部になれない。そこで問いが生まれました——なぜ自分たちのアリーナがないのか？見るだけでなく、挑戦をつくる場が。`,
    },
    {
      icon: "code",
      heading: "アイデアから実装へ",
      body: `その情熱をデジタルシステムに変えました。世界中のファンを距離や言語の壁なく一つの場に集めるのは簡単ではありませんでした。ClashAnimeは単なるサイトではなく、リアルタイムのエンゲージメントで順位が動き、競争が目の前で燃えるエコシステムとして設計されています。`,
    },
    {
      icon: "users",
      heading: "公正な競争文化",
      body: `ルールのない競争はノイズになります。公開ランキング、時間制限クラッシュ、通報、コミュニティガイドライン、モデレーションに投資し、作り手が信頼できるアリーナを目指しています。順位はいいね・コメント・シェアなど実エンゲージを重視します。`,
    },
    {
      icon: "coins",
      heading: "責任ある報酬",
      body: `ClashCoinsとシーズン賞は、一夜の奇跡ではなく継続的で検証可能な貢献を認めるためのものです。適格性、出金時のKYC、不正対策が誠実なメンバーを守ります。ガイドとFAQで期待値を透明にしています。`,
    },
    {
      icon: "globe",
      heading: "アラビア語・英語・日本語の一つのアリーナ",
      body: `アニメのファンダムは多言語です。ClashAnimeは製品文言とヒーローズガイドを三言語で届け、クラッシュ・ランク・フェアプレイのルールを学びながら、同じ世界ボードで競えるようにしています。`,
    },
  ],
  visionHeading: "ビジョン：世界が最初に向かう場所へ",
  visionIntro:
    "「また一つのサイト」ではなく、誰が一番かを決める前に訪れるプラットフォームを目指します。そのために：",
  pillars: [
    {
      icon: "globe",
      title: "グローバルなコンテンツ",
      body: "アラビア語・英語・日本語を橋にし、誰も創造の共有を阻まれないようにします。",
    },
    {
      icon: "scale",
      title: "公正なデュエル",
      body: "本物の票を集めた動画が上位に来る仕組みを追求します。",
    },
    {
      icon: "coins",
      title: "コミュニティ経済",
      body: "コンテンツには正当な評価が必要です。だから ClashCoins を立ち上げ、情熱を実感できる価値に変えました。",
    },
  ],
  heroesHeading: "ヒーローへの呼びかけ",
  heroesBody:
    "強さは一人で見ることにあるのではなく、集まることにあります。編集者も、最強を探すファンも、予想を試したい人も——あなたの居場所はここにあります。",
  futureHeading: "未来は今、書かれている",
  futureBody:
    "毎日、より速く・賢く・公正なプラットフォームへ改善しています。私たちはサイトではなく、永続するデジタルアリーナを築いています。",
  ctaHeading: "アニメ体験を次のレベルへ上げる準備はできましたか？",
  ctaBody: "今日、クラッシュに参加しよう！",
  ctaButton: "今すぐ参加",
  teamHeading: "チーム",
  teamIntro:
    "ClashAnimeの裏には、アニメへの情熱と技術・創造・コミュニティケアを組み合わせる小さなチームがいます。世界のファンにふさわしいアリーナを毎日つくっています。",
  teamRoles: [
    {
      title: "プロダクトとビジョン",
      description: "アニメへの情熱を、世界規模のインタラクティブ体験へ。",
    },
    {
      title: "エンジニアリング",
      description: "リアルタイムエンゲージメントを支える、速く安全な基盤を構築。",
    },
    {
      title: "コミュニティとサポート",
      description: "作り手とファンに寄り添い、公正なアリーナを守る。",
    },
  ],
  teamContactLabel: "チームへのお問い合わせ",
  teamContactEmail: "clashanime.team@gmail.com",
};

export function getAboutCopy(locale: Locale): AboutCopy {
  if (locale === "ar") return aboutAr;
  if (locale === "ja") return aboutJa;
  return aboutEn;
}
