import type { Locale } from "@/lib/types";

export type GuideSection = { heading: string; body: string };

export type GuidePageCopy = {
  title: string;
  intro: string;
  sections: GuideSection[];
  closing: string;
};

const faqEn: GuidePageCopy = {
  title: "ClashAnime FAQ — How the Arena, Ranks & ClashCoins Work",
  intro:
    "This FAQ explains ClashAnime in plain language for new members, parents, partners, and reviewers. ClashAnime is a competitive anime community: creators upload short duel clips, join timed episode clashes, climb hunter ranks, invite friends, and may earn ClashCoins through verified activity. It is not a get-rich-quick scheme and not a dump of full copyrighted episodes.",
  sections: [
    {
      heading: "What is ClashAnime?",
      body: "ClashAnime (clashanime.com) is a global anime challenge platform. Members compete with short anime-style clips and edits in public leaderboards. Votes, comments, and shares decide ranking during live clash windows. The goal is fair competition, recognition, and community growth — not passive scrolling alone.",
    },
    {
      heading: "Is ClashAnime a free anime streaming site?",
      body: "No. The main product on clashanime.com is the competitive arena: uploads, clashes, community, tracker, ranks, and rewards tools. Any member watch experience is separate and may be marked coming soon. ClashAnime does not claim to replace licensed streaming services. Users must follow copyright rules and Community Guidelines.",
    },
    {
      heading: "How do clashes work?",
      body: "Major episode drops can open a timed clash (often about 24 hours). Creators enter the clash, upload a short clip, add required hashtags including #clashanime, and share for votes. Ranking typically uses likes + comments×2 + shares×3. Episode clash #1 may receive a large hunter-point bonus when the window closes.",
    },
    {
      heading: "What are hunter ranks?",
      body: "Hunter ranks track contribution: Newbie (0–999), Explorer (1,000–2,999), Duelist (3,000–5,999), Master (6,000–9,999), Clash Master (10,000–20,000). Higher ranks unlock perks such as community posting, stronger votes, badges, and verification eligibility. Points come from signup, referrals, uploads, community posts, and clash wins — not from buying fake engagement.",
    },
    {
      heading: "How do ClashCoins and payouts work?",
      body: "ClashCoins are wallet credits tied to eligible programs (season podiums, reviewed tasks, conversions when allowed). Typical guidance on the platform: about 10,000 points = $10 when conversion applies; minimum cash-out around $10 after KYC identity checks. Amounts change by campaign. Fraud, bots, and multi-accounting can forfeit rewards.",
    },
    {
      heading: "What content is allowed?",
      body: "Original edits you have rights to share, fair-use style short clips within Community Guidelines, respectful comments, and accurate clash tags. Forbidden: stolen re-uploads presented as your own, adult content, harassment, scams, malware, and anything that violates our Terms or applicable law. Use Report tools when you see abuse.",
    },
    {
      heading: "How do privacy and safety work?",
      body: "We use account data to run authentication, moderation, rewards, and product features. We do not sell personal data as a business model. Review Privacy Policy, Cookie Policy, Terms, DMCA, and Community Guidelines linked in the footer. Contact support via the Contact page when needed.",
    },
    {
      heading: "Where should beginners start?",
      body: "1) Create an account. 2) Complete your profile. 3) Read Community Guidelines. 4) Open Earn money (/earn) if membership tasks apply. 5) Enter a live clash from Home or Anime Tracker. 6) Upload a sharp 15–60s clip with correct tags. 7) Share fairly and climb ranks. Read the Heroes Guide blog for deeper tutorials.",
    },
  ],
  closing:
    "Still stuck? Open Contact, Report, or the Heroes Guide. Play fair — the arena stays strong when everyone follows the same rules.",
};

const faqAr: GuidePageCopy = {
  title: "الأسئلة الشائعة — الساحة والرتب وClashCoins",
  intro:
    "هذا الدليل يجيب بوضوح على أسئلة الأعضاء الجدد والمراجعين. ClashAnime مجتمع أنمي تنافسي: ترفع لقطات نزال قصيرة، تدخل نزالات حلقات مؤقتة، تصعد رتب الصياد، تدعو أصدقاءك، وقد تربح ClashCoins عبر نشاط موثّق. ليست وعداً بالإثراء السريع وليست موقعاً لبث حلقات كاملة محمية.",
  sections: [
    {
      heading: "ما هو ClashAnime؟",
      body: "ClashAnime منصة تحديات أنمي عالمية. الأعضاء يتنافسون بلقطات قصيرة ومونتاجات على لوحات ترتيب عامة. الإعجابات والتعليقات والمشاركات تحدد الترتيب خلال نوافذ النزال. الهدف منافسة عادلة واعتراف ونمو مجتمع — لا تمرير سلبي فقط.",
    },
    {
      heading: "هل الموقع للمشاهدة المجانية للحلقات؟",
      body: "لا. المنتج الأساسي على clashanime.com هو الساحة: الرفع، النزالات، المجتمع، الرادار، الرتب، وأدوات الربح. أي تجربة مشاهدة للأعضاء منفصلة وقد تظهر «قريباً». ClashAnime لا يستبدل منصات البث المرخّصة. يجب احترام حقوق النشر وإرشادات المجتمع.",
    },
    {
      heading: "كيف تعمل النزالات؟",
      body: "الحلقات الكبيرة قد تفتح نزالاً مؤقتاً (غالباً نحو 24 ساعة). تدخل النزال، ترفع مقطعاً قصيراً، تضيف الهاشتاغات المطلوبة مع #clashanime، وتشارك للتصويت. الترتيب عادة: إعجابات + تعليقات×2 + مشاركات×3. المركز الأول قد يحصل على مكافأة نقاط كبيرة عند الإغلاق.",
    },
    {
      heading: "ما هي رتب الصياد؟",
      body: "Newbie ثم Explorer ثم Duelist ثم Master ثم Clash Master حسب النقاط. الرتب الأعلى تفتح مزايا مثل النشر في المجتمع، تصويت أقوى، شارات، وأهلية التوثيق. النقاط من التسجيل والإحالات والرفع وفوز النزال — لا من شراء تفاعل وهمي.",
    },
    {
      heading: "كيف تعمل ClashCoins والسحب؟",
      body: "ClashCoins أرصدة محفظة مرتبطة ببرامج مؤهّلة (منصات الموسم، مهام مراجعة، تحويل عند السماح). إرشاد شائع: حوالي 10,000 نقطة = 10$ عند التحويل؛ حد أدنى سحب حوالي 10$ بعد KYC. المبالغ تتغيّر. الاحتيال والبوتات والحسابات المتعددة قد تلغي الجوائز.",
    },
    {
      heading: "ما المحتوى المسموح؟",
      body: "مونتاج أصلي لديك حق مشاركته، لقطات قصيرة ضمن الإرشادات، تعليقات محترمة، وهاشتاغات صحيحة. ممنوع: سرقة المقاطع، محتوى للبالغين، تحرش، احتيال، وأي مخالفة للشروط أو القانون. استخدم الإبلاغ عند المخالفة.",
    },
    {
      heading: "الخصوصية والسلامة؟",
      body: "نستخدم بيانات الحساب للدخول والإشراف والمكافآت وتشغيل المنتج. لا نبيع بياناتك كنموذج عمل. راجع سياسة الخصوصية والكوكيز والشروط وDMCA وإرشادات المجتمع في التذييل.",
    },
    {
      heading: "من أين يبدأ المبتدئ؟",
      body: "1) سجّل. 2) أكمل الملف. 3) اقرأ الإرشادات. 4) افتح اربح الأموال إن لزم. 5) ادخل نزالاً من الرئيسية أو الرادار. 6) ارفع مقطعاً 15–60 ثانية بالهاشتاغات. 7) شارك بنزاهة واصعد. راجع دليل الأبطال للتفاصيل.",
    },
  ],
  closing: "تحتاج مساعدة؟ تواصل أو أبلغ أو افتح دليل الأبطال. اللعب النظيف يحمي الساحة للجميع.",
};

const faqJa: GuidePageCopy = {
  title: "よくある質問 — アリーナ・ランク・ClashCoins",
  intro:
    "ClashAnimeは競争型アニメコミュニティです。短いデュエルクリップ投稿、時間制限クラッシュ、ハンターランク、招待、検証済み活動によるClashCoins。一攫千金でも、フルエピソード違法配信サイトでもありません。",
  sections: [
    {
      heading: "ClashAnimeとは？",
      body: "世界のファンが短いクリップで競うアニメチャレンジ基盤です。公開ランキングとリアルタイム熱量が中心です。",
    },
    {
      heading: "無料の本編視聴サイトですか？",
      body: "いいえ。本サイトの主製品はアリーナ（投稿・クラッシュ・コミュニティ・ランク・報酬）です。正規配信の代替ではありません。著作権とガイドラインを守ってください。",
    },
    {
      heading: "クラッシュの仕組みは？",
      body: "大型エピソード公開時に時間制限クラッシュが開くことがあります。タグを付けて短いクリップを投稿し、票を集めて順位を上げます。",
    },
    {
      heading: "ハンターランクは？",
      body: "Newbie → Explorer → Duelist → Master → Clash Master。ポイントは登録・招待・投稿・勝利などから増え、偽エンゲージは禁止です。",
    },
    {
      heading: "ClashCoinsと出金は？",
      body: "対象プログラムとKYC後の出金があります。換算・最低額はキャンペーンで変わります。不正は失効します。",
    },
    {
      heading: "許可されるコンテンツは？",
      body: "権利のある編集、ガイドライン内の短いクリップ、礼儀正しい交流。盗用・成人向け・嫌がらせ・詐欺は禁止。",
    },
    {
      heading: "プライバシーは？",
      body: "認証・モデレーション・報酬のためにアカウント情報を使い、販売しません。フッターのポリシーを確認してください。",
    },
    {
      heading: "初心者の始め方は？",
      body: "登録→プロフィール→ガイドライン→必要ならお金を稼ぐ→ライブクラッシュ→正しいタグで投稿→公正に共有。詳細はヒーローズガイドへ。",
    },
  ],
  closing: "困ったらお問い合わせ・通報・ガイドをご利用ください。公正なプレイがアリーナを守ります。",
};

export function getFaqCopy(locale: Locale): GuidePageCopy {
  if (locale === "ar") return faqAr;
  if (locale === "ja") return faqJa;
  return faqEn;
}
