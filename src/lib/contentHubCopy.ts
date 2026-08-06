import type { Locale } from "@/lib/types";
import type { GuidePageCopy } from "@/lib/faqCopy";

export type ContentHubKey = "stories" | "manga" | "gallery";

const storiesEn: GuidePageCopy = {
  title: "Anime Stories & Tales — Original Fan Essays",
  intro:
    "ClashAnime Stories is a text-first library of original essays, season reflections, character analysis, and cultural notes. We publish written commentary — not episode streams, not full manga scans, and not copyrighted video dumps. Every piece is meant to inform and entertain readers while respecting creators and publishers.",
  sections: [
    {
      heading: "What you will find here",
      body: "Long-form articles about storytelling craft in anime: themes, symbolism, world-building, and why certain arcs resonate with global fans. We focus on discussion and education — the kind of reading experience that helps newcomers and veterans alike.",
    },
    {
      heading: "How we stay copyright-safe",
      body: "We do not host full episodes, Blu-ray rips, or complete chapter scans. We avoid uploading studio artwork we do not have rights to redistribute. When we reference a series, we use fair commentary language and point readers toward legal platforms for watching or buying official releases.",
    },
    {
      heading: "Languages",
      body: "Guides and essays appear in Arabic, English, and Japanese so families and fans can read in the language they prefer. Switch locale from the sidebar flags anytime.",
    },
    {
      heading: "Related hubs",
      body: "Continue with Manga Notes for panel and pacing analysis, the Image Moodboard for atmosphere inspiration, Anime Radio for soundtrack ambience, Anime Radar for release calendars, and the Heroes Guide blog for editorial updates.",
    },
  ],
  closing:
    "Stories first. Legal discovery second. ClashAnime is rebuilding as a reading and culture hub — not a streaming or upload arena.",
};

const storiesAr: GuidePageCopy = {
  title: "قصص وحكايات الأنمي — مقالات أصلية",
  intro:
    "مكتبة نصية لمقالات أصلية وتأملات موسمية وتحليل شخصيات وملاحظات ثقافية. ننشر تعليقاً مكتوباً — لا بثاً للحلقات، ولا مسحاً كاملاً للمانغا، ولا رفع فيديوهات محمية. الهدف إعلام القارئ وترفيهه مع احترام المبدعين والناشرين.",
  sections: [
    {
      heading: "ماذا ستجد هنا؟",
      body: "مقالات طويلة عن حرفة السرد في الأنمي: الثيمات، الرمزية، بناء العوالم، ولماذا تلمس بعض الأقواس الجماهير عالمياً. نركز على النقاش والتعليم.",
    },
    {
      heading: "كيف نحترم حقوق النشر؟",
      body: "لا نستضيف حلقات كاملة أو نسخ Blu-ray أو فصول مانغا كاملة. نتجنب رفع أعمال فنية للاستوديوهات بلا حق. عند الإشارة لعمل، نوجّه للقراءة/المشاهدة القانونية.",
    },
    {
      heading: "اللغات",
      body: "المحتوى بالعربية والإنجليزية واليابانية. غيّر اللغة من أعلام الشريط الجانبي.",
    },
    {
      heading: "أقسام مرتبطة",
      body: "ملاحظات المانغا، معرض الصور، راديو الأنمي، رادار الأنمي، ودليل الأبطال.",
    },
  ],
  closing: "القصص أولاً. الاكتشاف القانوني ثانياً. ClashAnime يتحول لمركز قراءة وثقافة — لا ساحة بث أو رفع.",
};

const storiesJa: GuidePageCopy = {
  title: "アニメの物語・エッセイ",
  intro:
    "オリジナルの文章・季節の考察・キャラ分析・文化ノートのテキストライブラリです。配信やフルスキャンは扱いません。創作者と出版社を尊重した読み物です。",
  sections: [
    {
      heading: "内容",
      body: "テーマ、象徴、世界観、物語の作り方についての長文。教育と議論が中心です。",
    },
    {
      heading: "著作権への配慮",
      body: "全話配信・BDリップ・全話スキャンは置きません。権利のない素材アップロードもしません。公式の合法サービスへ誘導します。",
    },
    {
      heading: "言語",
      body: "アラビア語・英語・日本語。サイドバーの旗で切替。",
    },
    {
      heading: "関連",
      body: "マンガノート、画像ムードボード、アニメラジオ、レーダー、ヒーローズガイド。",
    },
  ],
  closing: "物語と文化のハブへ。配信・投稿アリーナではありません。",
};

const mangaEn: GuidePageCopy = {
  title: "Manga Notes — Panels, Pacing & Reading Culture",
  intro:
    "Manga Notes explores how comics tell stories: panel rhythm, cliffhangers, adaptation differences between page and screen, and reading tips for newcomers. This hub is educational commentary — not a scanlation mirror and not a place to download full volumes.",
  sections: [
    {
      heading: "Reading craft",
      body: "We explain how creators use gutters, silent panels, and chapter breaks to control emotion. Understanding craft makes legal reading more rewarding whether you buy physical volumes or use licensed apps.",
    },
    {
      heading: "Adaptation talk",
      body: "When anime adapts manga, scenes expand or shrink. Our notes compare storytelling choices in general terms without reprinting protected pages or scripts.",
    },
    {
      heading: "Copyright stance",
      body: "No full-chapter uploads. No piracy links. Support official publishers and creators. Report abuse via our Report page if you see stolen scans shared elsewhere.",
    },
    {
      heading: "Where to go next",
      body: "Pair Manga Notes with Stories essays, Image Moodboard, Anime Radar release dates, and the Heroes Guide for weekly editorial picks.",
    },
  ],
  closing: "Read legally. Talk thoughtfully. That is the ClashAnime manga desk.",
};

const mangaAr: GuidePageCopy = {
  title: "ملاحظات المانغا — الإيقاع واللوحات وثقافة القراءة",
  intro:
    "نستكشف كيف تروي القصص المصوّرة: إيقاع اللوحات، التشويق، فروقات الاقتباس بين الصفحة والشاشة، ونصائح للمبتدئين. محتوى تعليمي — ليس مرآة للمسوحات المقرصنة ولا مكاناً لتحميل مجلدات كاملة.",
  sections: [
    {
      heading: "حرفة القراءة",
      body: "نشرح كيف يستخدم المبدعون الفراغات واللوحات الصامتة وفواصل الفصول. فهم الحرفة يجعل القراءة القانونية أجمل.",
    },
    {
      heading: "حديث الاقتباس",
      body: "عند اقتباس الأنمي للمانغا تتوسع مشاهد أو تُختصر. نقارن اختيارات السرد عموماً دون إعادة نشر صفحات محمية.",
    },
    {
      heading: "موقف حقوق النشر",
      body: "لا رفع لفصول كاملة. لا روابط قرصنة. ادعم الناشرين الرسميين. أبلغ عبر صفحة الإبلاغ عن أي مسح مسروق.",
    },
    {
      heading: "ماذا بعد؟",
      body: "القصص، معرض الصور، رادار الأنمي، ودليل الأبطال.",
    },
  ],
  closing: "اقرأ قانونياً. ناقش بعمق. هذا مكتب مانغا ClashAnime.",
};

const mangaJa: GuidePageCopy = {
  title: "マンガノート — コマ・テンポ・読書文化",
  intro:
    "コマ割り、クリフハンガー、紙と映像の違い、初心者向け読書ヒントを扱う教育的コーナーです。スキャンレーション置き場ではありません。",
  sections: [
    {
      heading: "読みの技法",
      body: "余白・無音コマ・章区切りが感情をどう作るかを解説。合法な読書をより楽しくします。",
    },
    {
      heading: "アニメ化の話",
      body: "一般的な脚色の違いを論じ、保護されたページや脚本は転載しません。",
    },
    {
      heading: "著作権",
      body: "全話アップロード禁止。海賊版リンク禁止。公式を支援。通報ページあり。",
    },
    {
      heading: "次へ",
      body: "物語エッセイ、画像、レーダー、ヒーローズガイドへ。",
    },
  ],
  closing: "合法に読み、丁寧に語る。それがClashAnimeのマンガデスクです。",
};

const galleryEn: GuidePageCopy = {
  title: "Image Moodboard — Atmosphere & Visual Inspiration",
  intro:
    "The Image Moodboard is a light visual desk for color palettes, composition ideas, and atmosphere notes inspired by anime aesthetics. It is not a warehouse of stolen key art, screenshots dumps, or character sheet archives. We prioritize original descriptions and safe mood references.",
  sections: [
    {
      heading: "What belongs here",
      body: "Written mood guides (warm dusk palettes, rainy neon cities, quiet shrine mornings), composition tips for fan illustrators learning fundamentals, and links to official art books or licensed merch when relevant.",
    },
    {
      heading: "What does not belong",
      body: "Bulk ripped screenshots, watermarked studio packs, or galleries that replace buying official art. If an image is used, it must be rights-cleared or clearly transformative commentary with attribution.",
    },
    {
      heading: "Create legally",
      body: "Aspiring artists should practice from life and original studies, then support official artbooks. ClashAnime encourages creativity without piracy.",
    },
    {
      heading: "Browse the rest of the hub",
      body: "Stories, Manga Notes, Anime Radio, Anime Radar, and Heroes Guide complete the copyright-safe experience.",
    },
  ],
  closing: "Inspiration without theft — that is the rule of this gallery desk.",
};

const galleryAr: GuidePageCopy = {
  title: "معرض الصور — أجواء وإلهام بصري",
  intro:
    "مكتب بصري خفيف لألوان وتكوين وأجواء مستوحاة من جماليات الأنمي. ليس مخزناً لفن مسروق أو لقطات شاشة جماعية أو أرشيف شخصيات. نفضّل وصفاً أصلياً ومراجع آمنة.",
  sections: [
    {
      heading: "ما ينتمي هنا",
      body: "أدلة مزاج مكتوبة، نصائح تكوين للمبتدئين، وروابط لكتب فنية رسمية عند الحاجة.",
    },
    {
      heading: "ما لا ينتمي",
      body: "لقطات ممزّقة بالجملة، حزم استوديو بعلامة مائية، أو معارض تغني عن شراء الفن الرسمي.",
    },
    {
      heading: "أبدع قانونياً",
      body: "تدرّب من الحياة ودراسات أصلية، وادعم الكتب الرسمية. ClashAnime يشجّع الإبداع بلا قرصنة.",
    },
    {
      heading: "باقي المركز",
      body: "قصص، مانغا، راديو، رادار، ودليل الأبطال.",
    },
  ],
  closing: "إلهام بلا سرقة — قاعدة هذا المعرض.",
};

const galleryJa: GuidePageCopy = {
  title: "画像ムードボード — 雰囲気と視覚インスピレーション",
  intro:
    "色・構図・雰囲気の軽いビジュアルデスク。盗用キーアート倉庫やスクショダンプではありません。",
  sections: [
    {
      heading: "扱うもの",
      body: "ムードガイド文章、構図の基礎、公式画集への誘導。",
    },
    {
      heading: "扱わないもの",
      body: "大量スクショ、透かし付きスタジオ素材、公式購入の代替ギャラリー。",
    },
    {
      heading: "合法に作る",
      body: "写生とオリジナル練習を推奨。海賊行為は禁止。",
    },
    {
      heading: "他ハブ",
      body: "物語・マンガ・ラジオ・レーダー・ヒーローズガイド。",
    },
  ],
  closing: "盗まずに着想する。それがルールです。",
};

const MAP: Record<ContentHubKey, Record<Locale, GuidePageCopy>> = {
  stories: { en: storiesEn, ar: storiesAr, ja: storiesJa },
  manga: { en: mangaEn, ar: mangaAr, ja: mangaJa },
  gallery: { en: galleryEn, ar: galleryAr, ja: galleryJa },
};

export function getContentHubCopy(key: ContentHubKey, locale: Locale): GuidePageCopy {
  return MAP[key][locale] ?? MAP[key].en;
}
