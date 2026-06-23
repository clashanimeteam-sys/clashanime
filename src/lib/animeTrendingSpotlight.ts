import type { Locale } from "@/lib/types";

export type TrendingSpotlightEntry = {
  rank: number;
  title: string;
  description: string;
};

export type TrendingSpotlightContent = {
  sectionTitle: string;
  entries: TrendingSpotlightEntry[];
};

const trendingSpotlightEn: TrendingSpotlightContent = {
  sectionTitle: "10 anime dominating trends and the arena right now",
  entries: [
    {
      rank: 1,
      title: "Jujutsu Kaisen (Season 3 — Culling Game Arc)",
      description:
        "The most popular anime returns in force with the Culling Game arc. MAPPA's intense battles and animation have made it undisputed at the top of global trends.",
    },
    {
      rank: 2,
      title: "Gachiakuta",
      description:
        "The breakout new series that won Best New Series at the Anime Awards. A boy thrown into a world of trash seeks revenge, with a wildly unique art style and eye-catching animation.",
    },
    {
      rank: 3,
      title: "SAKAMOTO DAYS",
      description:
        "One of the most anticipated trending anime—a legendary retired hitman tries to live quietly as a shopkeeper protecting his family, blending comedy with spectacular acrobatic action.",
    },
    {
      rank: 4,
      title: "My Hero Academia (Final Season)",
      description:
        "Entering its concluding season with decisive battles, the series stays on trend as fans follow Midoriya and the heroes' final clash against the villains.",
    },
    {
      rank: 5,
      title: "Solo Leveling (Season 2)",
      description:
        'After the smash hit first season, Jinwoo returns strong in Season 2 "Arise from the Shadow," recently winning design and animation awards and dominating streaming platforms.',
    },
    {
      rank: 6,
      title: "Frieren: Beyond Journey's End (Season 2)",
      description:
        "The elf mage's ongoing journey has won millions of hearts. It remains one of the highest-rated anime thanks to its emotional depth and stunning visual production.",
    },
    {
      rank: 7,
      title: "Demon Slayer: Kimetsu no Yaiba – Infinity Castle",
      description:
        "Though released as a theatrical trilogy, any Infinity Castle update instantly dominates social media and shoots to the top of search trends.",
    },
    {
      rank: 8,
      title: "DAN DA DAN",
      description:
        "A wild blend of aliens, ghosts, and romantic comedy that keeps drawing huge engagement with its bizarre, hilarious direction.",
    },
    {
      rank: 9,
      title: "Daemons of the Shadow Realm",
      description:
        "From the creator of Fullmetal Alchemist, this new series holds a steady top-viewership spot with a mysterious story of twins and bonds to the spirit world.",
    },
    {
      rank: 10,
      title: "Witch Hat Atelier",
      description:
        "Pure magical fantasy that stunned viewers with gorgeous art and animation that feels like a moving painting—now a favorite among fantasy fans.",
    },
  ],
};

const trendingSpotlightAr: TrendingSpotlightContent = {
  sectionTitle: "10 أنميات تتصدر الترند والساحة حالياً",
  entries: [
    {
      rank: 1,
      title: "Jujutsu Kaisen (الموسم الثالث - قتال النخبة)",
      description:
        'الأنمي الأكثر شعبية يعود بقوة مع آرك "لعبة الإعدام" (The Culling Game). الإثارة والقتالات والتحريك من استوديو MAPPA جعلته يتصدر الترند العالمي بلا منازع.',
    },
    {
      rank: 2,
      title: "Gachiakuta",
      description:
        'الأنمي الجديد الذي فاز بجائزة "أفضل سلسلة جديدة" في جوائز الأنمي. تدور قصته حول فتى يُلقى به في عالم السفالة والمخلفات ويسعى للانتقام، ويتميز بأسلوب رسم وتحريك فريد جداً وخاطف للأنظار.',
    },
    {
      rank: 3,
      title: "SAKAMOTO DAYS",
      description:
        "واحد من أكثر الأنميات انتظاراً وتصدراً للترند؛ قصة القاتل المأجور الأسطوري المتقاعد الذي يحاول عيش حياة هادئة كصاحب متجر يحمي عائلته، والقتالات فيه تجمع بين الكوميديا والأكشن الخرافي البهلواني.",
    },
    {
      rank: 4,
      title: "My Hero Academia (الموسم الأخير / النهائي)",
      description:
        "مع دخول الأنمي في موسمه الختامي والمعارك المصيرية الكبرى، يتواجد العمل باستمرار في الترند حيث يتابع المشاهدون نهاية رحلة ميدوريا والأبطال ضد الأشرار.",
    },
    {
      rank: 5,
      title: "Solo Leveling (الموسم الثاني)",
      description:
        'بعد النجاح الساحق للموسم الأول، عاد جين-وو بقوة في الموسم الثاني "Arise from the Shadow"، وحصد الأنمي مؤخراً جوائز في التصميم والتحريك، ولا يزال يكتسح منصات العرض.',
    },
    {
      rank: 6,
      title: "Frieren: Beyond Journey's End (الموسم الثاني)",
      description:
        "رحلة الفيلسوفة القزمية (إلف) المستمرة حازت على قلوب الملايين. الأنمي يحافظ على مكانته كواحد من أعلى الأنميات تقييماً بفضل عمق القصة والإنتاج البصري المذهل.",
    },
    {
      rank: 7,
      title: "Demon Slayer: Kimetsu no Yaiba – Infinity Castle",
      description:
        "رغم أنه يُعرض على شكل أفلام سينمائية (ثلاثية قلعة اللانهائية)، إلا أن أي تحديث أو عرض يخص قاتل الشياطين يقلب السوشيال ميديا رأساً على عقب ويتصدر قوائم البحث فوراً.",
    },
    {
      rank: 8,
      title: "DAN DA DAN",
      description:
        "العمل الجنوني الذي يدمج بين الكائنات الفضائية، الأشباح، والكوميديا الرومانسية. مستمر في حصد تفاعل هائل بسبب أسلوبه الإخراجي الغريب والممتع جداً.",
    },
    {
      rank: 9,
      title: "Daemons of the Shadow Realm",
      description:
        "من نفس مؤلفة الأنمي الأسطوري Fullmetal Alchemist، هذا الأنمي الجديد حجز مكاناً ثابتاً في قائمة الأعلى مشاهدة بفضل قصته الغامضة التي تدور حول التوائم والروابط مع عالم الأرواح.",
    },
    {
      rank: 10,
      title: "Witch Hat Atelier",
      description:
        "أنمي السحر الخالص الذي أدهش الجميع بجمال الرسوم والتحريك البصري الساحر الذي يشعرك وكأنك تقرأ لوحة فنية متحركة، وقد أصبح حديث عشاق الفانتازيا الخيالية.",
    },
  ],
};

const trendingSpotlightJa: TrendingSpotlightContent = {
  sectionTitle: "今、トレンドとアリーナを席巻しているアニメ10選",
  entries: [
    {
      rank: 1,
      title: "呪術廻戦（第3期 — 死滅回游編）",
      description:
        "人気No.1作品が「死滅回游」編で本格復帰。MAPPAの激しいバトルと作画が世界のトレンドを独走中。",
    },
    {
      rank: 2,
      title: "ガチアクタ",
      description:
        "アニメアワード最優秀新作に輝いた注目の新作。ゴミの世界に放り込まれた少年の復讐劇が、独創的な画風と映像で視線を奪う。",
    },
    {
      rank: 3,
      title: "SAKAMOTO DAYS",
      description:
        "待望のトレンド作。伝説の殺し屋が店番として静かな日々を守る物語。コメディと派手なアクションが融合。",
    },
    {
      rank: 4,
      title: "僕のヒーローアカデミア（最終期）",
      description:
        "決戦のクライマックスへ突入する最終シーズン。デクとヒーローたちの終焉の戦いがトレンドを維持。",
    },
    {
      rank: 5,
      title: "俺だけレベルアップな件（第2期）",
      description:
        "第1期の大ヒットに続き、第2期「-Arise from the Shadow-」でジンウーが再び躍進。配信プラットフォームを席巻中。",
    },
    {
      rank: 6,
      title: "葬送のフリーレン（第2期）",
      description:
        "エルフの魔法使いの旅が多くの心を掴む。物語の深さと圧倒的な映像美で高評価を維持。",
    },
    {
      rank: 7,
      title: "鬼滅の刃 無限城編",
      description:
        "劇場三部作として公開されても、鬼滅の最新情報はSNSを一瞬で席巻し検索上位を独占。",
    },
    {
      rank: 8,
      title: "ダンダダン",
      description:
        "宇宙人・幽霊・ラブコメが混ざる狂気作。奇抜で愉快な演出が大きな反響を生み続けている。",
    },
    {
      rank: 9,
      title: "冥土の王",
      description:
        "鋼の錬金術師の作者による新作。双子と霊界の繋がりを描くミステリアスな物語が視聴率上位をキープ。",
    },
    {
      rank: 10,
      title: "とんがり帽子のアトリエ",
      description:
        "美しい作画と幻想的な映像が話題の魔法ファンタジー。動く絵画のような世界観がファンタジー好きを魅了。",
    },
  ],
};

const trendingSpotlightByLocale: Record<Locale, TrendingSpotlightContent> = {
  en: trendingSpotlightEn,
  ar: trendingSpotlightAr,
  ja: trendingSpotlightJa,
};

export function getTrendingSpotlight(locale: Locale): TrendingSpotlightContent {
  return trendingSpotlightByLocale[locale] ?? trendingSpotlightEn;
}
