import type { BlogPost } from "@/lib/blog/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "start-your-first-clash",
    category: "user-guide",
    publishedAt: "2026-06-20",
    readingMinutes: 5,
    locales: {
      en: {
        title: "How to Start Your First Clash on ClashAnime",
        excerpt:
          "Step-by-step guide to joining anime duels, uploading clips with hashtags, and climbing the leaderboard on ClashAnime.",
        sections: [
          {
            heading: "Create your account",
            body: "Sign up at clashanime.com with email or social login. Complete your profile with a username — this becomes your channel link for sharing clips and invite referrals.",
          },
          {
            heading: "Pick a clash",
            body: "Open the homepage or Anime Radar (/tracker). Live release clashes show a 24-hour countdown. Tap Enter the Clash to see rules, match hashtags, and the current leaderboard.",
          },
          {
            heading: "Upload with the right hashtags",
            body: "Go to Upload and attach your clip. Add the clash hashtags shown on the clash page (e.g. #clashanime plus anime-specific tags). Clips must match the episode or theme to rank.",
          },
          {
            heading: "Earn engagement points",
            body: "Ranking uses likes + comments×2 + shares×3. Share your clip link on X, Discord, or WhatsApp to drive votes. Every interaction grows your hunter points and clash rank.",
          },
          {
            heading: "Win and collect rewards",
            body: "When a 24-hour episode clash ends, the top clip wins +2,000 hunter points automatically. Season leaders and exclusives can unlock ClashCoins cash prizes after KYC verification.",
          },
        ],
      },
      ar: {
        title: "كيف تبدأ نزالك الأول في ClashAnime",
        excerpt:
          "دليل خطوة بخطوة للدخول في نزالات الأنمي، رفع اللقطات بالهاشتاغات الصحيحة، والصعود في لوحة الصدارة.",
        sections: [
          {
            heading: "أنشئ حسابك",
            body: "سجّل في clashanime.com بالبريد أو تسجيل الدخول الاجتماعي. أكمل ملفك باسم مستخدم — يصبح رابط قناتك لمشاركة المقاطع ودعوة الأصدقاء.",
          },
          {
            heading: "اختر نزالاً",
            body: "افتح الصفحة الرئيسية أو رادار الأنمي (/tracker). النزالات المباشرة تعرض عدّاد 24 ساعة. اضغط «ادخل النزال» لرؤية القواعد والهاشتاغات ولوحة المتصدرين.",
          },
          {
            heading: "ارفع بالهاشتاغات الصحيحة",
            body: "اذهب إلى الرفع وأرفق مقطعك. أضف هاشتاغات النزال الظاهرة في صفحة النزال (مثل #clashanime وهاشتاغات الأنمي). يجب أن يطابق المقطع الحلقة أو الموضوع ليُرتّب.",
          },
          {
            heading: "اجمع نقاط التفاعل",
            body: "الترتيب = إعجابات + تعليقات×2 + مشاركات×3. شارك رابط مقطعك على X أو Discord أو واتساب لجلب الأصوات. كل تفاعل يرفع نقاط الصياد وترتيبك.",
          },
          {
            heading: "اربح واجمع الجوائز",
            body: "عند انتهاء نزال الحلقة (24 ساعة)، أفضل مقطع يفوز بـ +2,000 نقطة صياد تلقائياً. متصدرون الموسم والحصريات يمكنهم فتح جوائز ClashCoins النقدية بعد تحقق KYC.",
          },
        ],
      },
      ja: {
        title: "ClashAnimeで最初のクラッシュを始める方法",
        excerpt:
          "アニメ対戦への参加、ハッシュタグ付きクリップのアップロード、リーダーボード順位アップのステップガイド。",
        sections: [
          {
            heading: "アカウント作成",
            body: "clashanime.comでメールまたはソーシャルログインで登録。ユーザー名を設定すると、クリップ共有と招待リンクのチャンネルURLになります。",
          },
          {
            heading: "クラッシュを選ぶ",
            body: "ホームまたは新作アニメレーダー（/tracker）を開く。ライブ放送クラッシュには24時間カウントダウンが表示されます。「クラッシュに入る」でルール、タグ、ランキングを確認。",
          },
          {
            heading: "正しいハッシュタグでアップロード",
            body: "アップロードページでクリップを添付。クラッシュページのタグ（#clashanime など）を追加。エピソードやテーマに合ったクリップのみランク対象。",
          },
          {
            heading: "エンゲージメントポイントを獲得",
            body: "順位 = いいね + コメント×2 + シェア×3。X、Discord、WhatsAppでリンクを共有して票を集めましょう。",
          },
          {
            heading: "勝利と報酬",
            body: "24時間エピソードクラッシュ終了時、1位クリップに+2,000ハンターポイントが自動付与。シーズン上位者はKYC後にClashCoins現金賞も可能。",
          },
        ],
      },
    },
  },
  {
    slug: "high-quality-anime-clips",
    category: "user-guide",
    publishedAt: "2026-06-21",
    readingMinutes: 4,
    locales: {
      en: {
        title: "Upload High-Quality Anime Clips That Win Clashes",
        excerpt:
          "Technical tips for resolution, length, audio, and editing so your clips rank higher in ClashAnime duels and episode clashes.",
        sections: [
          {
            heading: "Resolution and aspect ratio",
            body: "Export at 1080p minimum when possible. Vertical 9:16 works best for mobile feeds; 16:9 is fine for cinematic moments. Avoid blurry upscales or heavy compression.",
          },
          {
            heading: "Keep it short and punchy",
            body: "Winning clips are usually 15–60 seconds. Lead with the best frame in the first 2 seconds — viewers vote fast.",
          },
          {
            heading: "Clean audio",
            body: "Balance BGM and dialogue. Muted or distorted audio loses votes. Use subtle impact SFX on fight peaks if it fits the scene.",
          },
          {
            heading: "Use clash hashtags correctly",
            body: "Always include #clashanime plus the tags listed on the clash page. Wrong tags mean your clip may not appear in the clash leaderboard.",
          },
        ],
      },
      ar: {
        title: "ارفع لقطات أنمي بجودة عالية تفوز في النزالات",
        excerpt:
          "نصائح تقنية للدقة والمدة والصوت والمونتاج لترتيب أعلى في نزالات ClashAnime.",
        sections: [
          {
            heading: "الدقة ونسبة العرض",
            body: "صدّر بـ 1080p كحد أدنى عند الإمكان. 9:16 عمودي أفضل للموبايل؛ 16:9 مناسب للمشاهد السينمائية. تجنّب التكبير الضبابي أو الضغط الشديد.",
          },
          {
            heading: "قصير ومؤثر",
            body: "اللقطات الفائزة عادة 15–60 ثانية. ابدأ بأقوى إطار في أول ثانيتين — الناخبون يقررون بسرعة.",
          },
          {
            heading: "صوت نظيف",
            body: "وازن الموسيقى والحوار. الصوت المكتوم أو المشوه يخسر أصواتاً. استخدم مؤثرات خفيفة على ذروة القتال إن مناسب.",
          },
          {
            heading: "استخدم الهاشتاغات الصحيحة",
            body: "ضمّن دائماً #clashanime مع الهاشتاغات في صفحة النزال. الهاشتاغ الخاطئ قد يمنع ظهور مقطعك في لوحة النزال.",
          },
        ],
      },
      ja: {
        title: "勝てる高品質アニメクリップのアップロード",
        excerpt:
          "解像度、長さ、音声、編集のコツでClashAnime対戦順位を上げる。",
        sections: [
          {
            heading: "解像度とアスペクト比",
            body: "可能なら1080p以上で書き出し。9:16縦型はモバイル向け、16:9はシネマ向き。ぼやけたアップスケールや過度な圧縮は避ける。",
          },
          {
            heading: "短くインパクトを",
            body: "勝ちクリップは通常15–60秒。最初の2秒で最高のフレームを見せる。",
          },
          {
            heading: "クリーンな音声",
            body: "BGMとセリフのバランスを。音割れは票を失う。",
          },
          {
            heading: "正しいハッシュタグ",
            body: "常に #clashanime とクラッシュページのタグを付ける。",
          },
        ],
      },
    },
  },
  {
    slug: "invite-link-rewards",
    category: "user-guide",
    publishedAt: "2026-06-22",
    readingMinutes: 4,
    locales: {
      en: {
        title: "Invite Friends and Grow Your Hunter Points Faster",
        excerpt:
          "How ClashAnime referral links work, what you earn when friends join, and best practices for sharing your channel.",
        sections: [
          {
            heading: "Find your invite link",
            body: "Open Profile or Invite Friends in the sidebar. Your unique link looks like clashanime.com/ref/yourusername. Share it anywhere you talk anime.",
          },
          {
            heading: "What you earn",
            body: "When referred users sign up and stay active — uploading, voting, commenting — you gain hunter points from platform activity rules. More engaged referrals = faster rank growth.",
          },
          {
            heading: "Share clips, not just the link",
            body: "Post your best clash clips with your ref link in bio or caption. A great edit sells the platform better than a bare URL.",
          },
          {
            heading: "Play fair",
            body: "Fake accounts or bot traffic violate Terms of Use and can forfeit points. Organic community growth is the sustainable path to Top 12 and ClashCoins.",
          },
        ],
      },
      ar: {
        title: "ادعُ أصدقاءك وارفع نقاط الصياد أسرع",
        excerpt:
          "كيف تعمل روابط الدعوة في ClashAnime، ماذا تربح عند انضمام الأصدقاء، وأفضل طرق مشاركة قناتك.",
        sections: [
          {
            heading: "اعثر على رابط الدعوة",
            body: "افتح الملف الشخصي أو «ادعُ أصدقاءك» في الشريط الجانبي. رابطك الفريد مثل clashanime.com/ref/username. شاركه حيث تتحدث عن الأنمي.",
          },
          {
            heading: "ماذا تربح",
            body: "عندما يسجل المُحالون ويبقون نشطين — رفع، تصويت، تعليق — تكسب نقاط صياد حسب قواعد المنصة. إحالات نشطة = صعود أسرع في الرتب.",
          },
          {
            heading: "شارك اللقطات لا الرابط فقط",
            body: "انشر أفضل لقطات النزال مع رابط الدعوة في البايو أو الوصف. montage قوي يبيع المنصة أفضل من رابط عاري.",
          },
          {
            heading: "العب بعدل",
            body: "الحسابات الوهمية أو البوتات تخالف الشروط وقد تؤدي لمصادرة النقاط. النمو العضوي هو الطريق للـ Top 12 و ClashCoins.",
          },
        ],
      },
      ja: {
        title: "友達を招待してハンターポイントを加速",
        excerpt:
          "ClashAnime紹介リンクの仕組み、報酬、チャンネル共有のベストプラクティス。",
        sections: [
          {
            heading: "招待リンクを見つける",
            body: "プロフィールまたはサイドバーの「友達を招待」。clashanime.com/ref/ユーザー名 形式。",
          },
          {
            heading: "獲得できるもの",
            body: "紹介ユーザーが登録しアップロード・投票・コメントで活動すると、ルールに基づきハンターポイントが付与。",
          },
          {
            heading: "リンクだけでなくクリップを",
            body: "最高のクラッシュクリップと一緒に紹介リンクをシェア。",
          },
          {
            heading: "フェアプレイ",
            body: "偽アカウントやボットは規約違反でポイント没収の可能性。",
          },
        ],
      },
    },
  },
  {
    slug: "radar-season-highlights",
    category: "radar-analysis",
    publishedAt: "2026-06-23",
    readingMinutes: 6,
    locales: {
      en: {
        title: "Anime Radar: Top Clips and Trends This Season",
        excerpt:
          "Weekly-style analysis of trending anime on ClashAnime Radar — which releases drive the hottest clashes and why engagement spikes.",
        sections: [
          {
            heading: "What Anime Radar tracks",
            body: "Our Jikan-powered schedule syncs new episodes daily. Trending top-10 titles get automatic 24-hour release clashes so creators compete on the freshest episodes.",
          },
          {
            heading: "Why certain anime dominate",
            body: "Shonen fight scenes, romance reveals, and plot twists generate the most uploads. Titles with active global fanbases — JJK, Demon Slayer, Solo Leveling, One Piece — consistently top clash participation.",
          },
          {
            heading: "Three clip types that win",
            body: "• Raw hype moments with perfect timing\n• Funny reaction edits with captions\n• Side-by-side power scaling comparisons\nMix formats to stand out in a crowded clash.",
          },
          {
            heading: "Join before the window closes",
            body: "Episode clashes run 24 hours from open. Early uploads get more exposure time for votes. Watch the homepage banner countdown and enter immediately after an episode drops.",
          },
        ],
      },
      ar: {
        title: "رادار الأنمي: أفضل اللقطات واتجاهات الموسم",
        excerpt:
          "تحليل لأكثر الأنميات إثارة في رادار ClashAnime — أي إصدارات تشعل النزالات ولماذا يرتفع التفاعل.",
        sections: [
          {
            heading: "ماذا يتابع الرادار",
            body: "جدول Jikan يُحدَّث يومياً. أفضل 10 ترند تحصل على نزالات إصدار 24 ساعة تلقائياً للتنافس على أحدث الحلقات.",
          },
          {
            heading: "لماذا يسيطر أنمي معيّن",
            body: "مشاهد القتال في الشونين، مفاجآت الرومانس، وانقلابات الحبكة تولّد أكثر الرفعات. JJK و Demon Slayer و Solo Leveling و One Piece يتصدرون المشاركة.",
          },
          {
            heading: "ثلاثة أنواع لقطات تفوز",
            body: "• لحظات hype خام بتوقيت مثالي\n• edits مضحكة مع تعليقات\n• مقارنات قوة جنباً إلى جنب\nنوّع الأشكال للتميز.",
          },
          {
            heading: "ادخل قبل إغلاق النافذة",
            body: "نزالات الحلقة 24 ساعة من الفتح. الرفع المبكر = وقت أطول للأصوات. راقب عدّاد الصفحة الرئيسية.",
          },
        ],
      },
      ja: {
        title: "アニメレーダー：今シーズンのトップクリップとトレンド",
        excerpt:
          "ClashAnimeレーダーで話題のアニメ分析 — どの新作がクラッシュを熱くするか。",
        sections: [
          {
            heading: "レーダーが追うもの",
            body: "Jikan連携のスケジュールが毎日更新。トレンドTOP10に24時間リリースクラッシュが自動付与。",
          },
          {
            heading: "特定作品が支配する理由",
            body: "バトル、恋愛、どんでん返しがアップロードを増やす。JJK、鬼滅、ソロレベ、ワンピースなどが常に上位。",
          },
          {
            heading: "勝ちやすい3タイプ",
            body: "• 生のハイライト\n• 字幕付きネタ編集\n• 戦力比較\n形式を混ぜて差別化。",
          },
          {
            heading: "窓が閉じる前に",
            body: "エピソードクラッシュは24時間。早いアップロードほど票を集めやすい。",
          },
        ],
      },
    },
  },
  {
    slug: "top12-winner-spotlight",
    category: "winner-stories",
    publishedAt: "2026-06-24",
    readingMinutes: 5,
    locales: {
      en: {
        title: "Top 12 Spotlight: How Arena Kings Climb the Rankings",
        excerpt:
          "Short spotlight on what separates Top 12 creators — consistency, community, and smart clash strategy on ClashAnime.",
        sections: [
          {
            heading: "Consistency beats one viral clip",
            body: "Top 12 hunters upload regularly across clashes and seasons. They treat every 24-hour window as a chance to stack points, not a one-off lottery.",
          },
          {
            heading: "Community is the multiplier",
            body: "Winners reply to comments, share others' clips, and build Discord or X circles. Engagement flows both ways — your audience becomes your voting base.",
          },
          {
            heading: "Strategic clash picking",
            body: "Pros watch Anime Radar for trending opens and less crowded niches. Entering early on a rising title can mean less competition and more visibility.",
          },
          {
            heading: "From points to ClashCoins",
            body: "High hunter ranks unlock conversion to ClashCoins. Complete one-time KYC, then request bank transfer, PayPal, or USDT payout after admin review.",
          },
        ],
      },
      ar: {
        title: "تسليط الضوء على Top 12: كيف يصعد ملوك الساحة",
        excerpt:
          "ما يميز متصدرين الـ 12 — الاستمرارية، المجتمع، واستراتيجية النزالات الذكية.",
        sections: [
          {
            heading: "الاستمرارية تتفوق على viral واحد",
            body: "صياد Top 12 يرفعون بانتظام عبر النزالات والمواسم. كل نافذة 24 ساعة فرصة لتراكم النقاط.",
          },
          {
            heading: "المجتمع مضاعف القوة",
            body: "الفائزون يردون على التعليقات، يشاركون مقاطع غيرهم، ويبنون دوائر X أو Discord. جمهورك = قاعدة أصواتك.",
          },
          {
            heading: "اختيار النزالات بذكاء",
            body: "المحترفون يراقبون الرادار للترند والنيشات الأقل ازدحاماً. الدخول المبكر على عنوان صاعد = منافسة أقل.",
          },
          {
            heading: "من النقاط إلى ClashCoins",
            body: "الرتب العالية تفتح التحويل لـ ClashCoins. أكمل KYC مرة واحدة ثم اطلب سحب بنكي أو PayPal أو USDT بعد مراجعة الإدارة.",
          },
        ],
      },
      ja: {
        title: "Top 12スポットライト：アリーナの王が順位を上げる方法",
        excerpt:
          "Top 12クリエイターの共通点 — 継続性、コミュニティ、賢いクラッシュ戦略。",
        sections: [
          {
            heading: "継続がバイラル1本に勝る",
            body: "Top 12は定期的にアップロード。24時間窓を積み重ねる。",
          },
          {
            heading: "コミュニティが倍率",
            body: "勝者はコメント返信と相互シェアで投票基盤を作る。",
          },
          {
            heading: "クラッシュ選び",
            body: "レーダーでトレンドと空いているニッチを狙う。",
          },
          {
            heading: "ポイントからClashCoinsへ",
            body: "高ランクで変換可能。KYC後、銀行/PayPal/USDT出金。",
          },
        ],
      },
    },
  },
  {
    slug: "instant-episode-clash-update",
    category: "platform-updates",
    publishedAt: "2026-06-25",
    readingMinutes: 4,
    locales: {
      en: {
        title: "New: Instant 24-Hour Episode Clashes Are Live",
        excerpt:
          "ClashAnime launches instant episode clashes — 24-hour windows, auto-finalize, +2,000 point rewards, and homepage countdown banners.",
        sections: [
          {
            heading: "What changed",
            body: "When a trending or scheduled episode releases, ClashAnime opens a dedicated clash for exactly 24 hours. No manual admin step — sync runs every 30 minutes via automation.",
          },
          {
            heading: "How ranking works",
            body: "Score = likes + comments×2 + shares×3. At window close, the system picks the winner, awards +2,000 hunter points, and notifies all users who opted in.",
          },
          {
            heading: "Where to find it",
            body: "Homepage banner with countdown and poster, Anime Radar active clashes section, and push/in-app notifications when a new clash opens.",
          },
          {
            heading: "What's next",
            body: "We are expanding daily trending sync, improving Radar analysis articles, and tuning fair-rank algorithms for global creators.",
          },
        ],
      },
      ar: {
        title: "جديد: نزالات الحلقة الفورية 24 ساعة أصبحت مباشرة",
        excerpt:
          "ClashAnime تطلق نزالات حلقة فورية — 24 ساعة، إغلاق تلقائي، +2,000 نقطة، وبانر عدّاد في الصفحة الرئيسية.",
        sections: [
          {
            heading: "ما الذي تغيّر",
            body: "عند صدور حلقة ترند أو مجدولة، تُفتح نزال لمدة 24 ساعة بالضبط. المزامنة كل 30 دقيقة تلقائياً.",
          },
          {
            heading: "كيف يُحسب الترتيب",
            body: "النقاط = إعجابات + تعليقات×2 + مشاركات×3. عند الإغلاق يُختار الفائز ويُمنح +2,000 نقطة وإشعار للمستخدمين.",
          },
          {
            heading: "أين تجدها",
            body: "بانر الصفحة الرئيسية مع العدّاد والغلاف، قسم النزالات النشطة في الرادار، وإشعارات عند فتح نزال جديدة.",
          },
          {
            heading: "القادم",
            body: "توسيع مزامنة الترند اليومية، مقالات تحليل الرادار، وتحسين خوارزميات العدالة للمبدعين عالمياً.",
          },
        ],
      },
      ja: {
        title: "新機能：24時間インスタントエピソードクラッシュ",
        excerpt:
          "24時間窓、自動確定、+2,000ポイント、ホームカウントダウンバナー。",
        sections: [
          {
            heading: "変更点",
            body: "トレンドまたはスケジュール放送で24時間クラッシュが自動開催。30分ごとに同期。",
          },
          {
            heading: "ランキング",
            body: "いいね + コメント×2 + シェア×3。終了時+2,000ポイント付与。",
          },
          {
            heading: "見つけ方",
            body: "ホームバナー、レーダーのアクティブクラッシュ、通知。",
          },
          {
            heading: "今後",
            body: "デイリートレンド拡張と公平ランク改善。",
          },
        ],
      },
    },
  },
  {
    slug: "prizes-and-earnings-guide",
    category: "earnings-prizes",
    publishedAt: "2026-06-26",
    readingMinutes: 7,
    locales: {
      en: {
        title: "Complete Guide to ClashAnime Prizes, Points, and ClashCoins",
        excerpt:
          "Everything about hunter points, episode clash rewards, season prizes, ClashCoins conversion, and how creators earn on ClashAnime.",
        sections: [
          {
            heading: "Hunter points — your rank fuel",
            body: "You earn points from uploads, votes, comments, shares, referrals, and clash wins. Points determine your hunter rank (D to S) and leaderboard position.",
          },
          {
            heading: "Episode clash winner: +2,000 points",
            body: "Each 24-hour instant episode clash awards the top clip +2,000 hunter points automatically when the window closes. No ClashCoins in this prize — pure rank acceleration.",
          },
          {
            heading: "Season and exclusive cash prizes",
            body: "Top 12, Hall of Legends, and exclusive duels offer ClashCoins (USD cents in your wallet). Season podium ranks can pay $100 / $500 / $1,000 equivalent at configured prize pools.",
          },
          {
            heading: "Converting to ClashCoins",
            body: "Eligible ranks can convert hunter points to ClashCoins at platform rates (see wallet: 10,000 points = $10). Minimum withdrawal is $10 after KYC approval.",
          },
          {
            heading: "Payout methods",
            body: "After one-time KYC (legal name, phone, address), request bank transfer, PayPal, or USDT. Admin reviews within 24–72 hours. Anti-fraud checks apply.",
          },
        ],
      },
      ar: {
        title: "دليل شامل: جوائز ClashAnime والنقاط و ClashCoins",
        excerpt:
          "كل شيء عن نقاط الصياد، جوائز نزال الحلقة، جوائز الموسم، تحويل ClashCoins، وكيف يربح المبدعون.",
        sections: [
          {
            heading: "نقاط الصياد — وقود رتبتك",
            body: "تكسب من الرفع، التصويت، التعليق، المشاركة، الإحالات، وفوز النزالات. تحدد رتبة الصياد (D إلى S) وموقعك في لوحة الصدارة.",
          },
          {
            heading: "فائز نزال الحلقة: +2,000 نقطة",
            body: "كل نزال 24 ساعة تمنح أفضل مقطع +2,000 نقطة تلقائياً عند الإغلاق. الجائزة نقاط فقط — تسريع الرتبة.",
          },
          {
            heading: "جوائز موسم وحصريات نقدية",
            body: "Top 12 و Hall of Legends والduels الحصرية تقدم ClashCoins (سنتات USD). منصة الموسم قد تدفع ما يعادل 100$ / 500$ / 1000$ حسب الجائزة.",
          },
          {
            heading: "التحويل إلى ClashCoins",
            body: "الرتب المؤهلة تحوّل النقاط بأسعار المنصة (10,000 نقطة = 10$). الحد الأدنى للسحب 10$ بعد KYC.",
          },
          {
            heading: "طرق السحب",
            body: "بعد KYC (اسم قانوني، هاتف، عنوان): تحويل بنكي أو PayPal أو USDT. مراجعة خلال 24–72 ساعة. فحوصات مكافحة الاحتيال.",
          },
        ],
      },
      ja: {
        title: "ClashAnime賞・ポイント・ClashCoins完全ガイド",
        excerpt:
          "ハンターポイント、エピソードクラッシュ報酬、シーズン賞、ClashCoins変換のすべて。",
        sections: [
          {
            heading: "ハンターポイント",
            body: "アップロード、投票、コメント、シェア、紹介、勝利で獲得。ランクD〜S。",
          },
          {
            heading: "エピソードクラッシュ +2,000",
            body: "24時間窓の1位に+2,000ポイント自動付与。ClashCoinsは含まない。",
          },
          {
            heading: "シーズン・限定現金賞",
            body: "Top 12、Hall of Legends、限定デュエルでClashCoins。",
          },
          {
            heading: "ClashCoins変換",
            body: "10,000ポイント = $10。最低出金$10（KYC後）。",
          },
          {
            heading: "出金方法",
            body: "銀行振込、PayPal、USDT。24〜72時間レビュー。",
          },
        ],
      },
    },
  },
  {
    slug: "global-earnings-faq",
    category: "faq",
    publishedAt: "2026-06-27",
    readingMinutes: 8,
    locales: {
      en: {
        title: "FAQ: Can You Earn from ClashAnime in Every Country?",
        excerpt:
          "Answers about global availability, age requirements, KYC, taxes, payout countries, and common earning questions on ClashAnime.",
        sections: [
          {
            heading: "Is ClashAnime available worldwide?",
            body: "Yes. Creators from most countries can sign up, upload clips, join clashes, and earn hunter points. Some payout methods may vary by region due to banking or compliance rules.",
          },
          {
            heading: "Can I earn real money from any country?",
            body: "ClashCoins cash payouts are available to verified users who complete KYC and pass anti-fraud review. We support international bank transfer, PayPal, and USDT where legally permitted. Restricted sanctions countries may be blocked.",
          },
          {
            heading: "Do I need to be 18+?",
            body: "You must meet the minimum age in your country to create an account and request payouts. Parental guidance is required where local law demands it.",
          },
          {
            heading: "How much can I realistically earn?",
            body: "Casual creators stack points slowly through daily activity. Competitive clash winners, Top 12 hunters, and season leaders earn the most. Episode clash wins give +2,000 points — multiple wins compound quickly.",
          },
          {
            heading: "Are there fees or taxes?",
            body: "ClashAnime does not charge withdrawal fees in most cases; your bank or PayPal may. You are responsible for reporting income per your local tax laws.",
          },
          {
            heading: "How long do payouts take?",
            body: "After KYC approval, withdrawal requests are reviewed manually within 24–72 hours. First payout may take longer for verification.",
          },
          {
            heading: "What gets accounts banned?",
            body: "Fake engagement, duplicate accounts, stolen clips, false KYC, or bot traffic can forfeit balances and ban accounts permanently per Terms of Use.",
          },
        ],
      },
      ar: {
        title: "أسئلة شائعة: هل أربح من ClashAnime في كل دولة؟",
        excerpt:
          "إجابات عن التوفر العالمي، العمر، KYC، الضرائب، دول السحب، وأسئلة الربح الشائعة.",
        sections: [
          {
            heading: "هل ClashAnime متاح عالمياً؟",
            body: "نعم. مبدعون من معظم الدول يمكنهم التسجيل والرفع والنزالات ونقاط الصياد. بعض طرق السحب تختلف حسب المنطقة والامتثال.",
          },
          {
            heading: "هل أربح مالاً حقيقياً من أي دولة؟",
            body: "سحوبات ClashCoins للمستخدمين الموثّقين بعد KYC ومراجعة مكافحة الاحتيال. تحويل بنكي دولي و PayPal و USDT حيث يسمح القانون. دول العقوبات قد تُحظر.",
          },
          {
            heading: "هل أحتاج 18+؟",
            body: "يجب أن تبلغ الحد الأدنى للعمر في بلدك للحساب وطلب السحب.",
          },
          {
            heading: "كم أربح واقعياً؟",
            body: "المبدع العادي يراكم نقاطاً ببطء. الفائزون في النزالات و Top 12 ومتصدرون الموسم يكسبون الأكثر. كل فوز نزال +2,000 نقطة.",
          },
          {
            heading: "هل هناك رسوم أو ضرائب؟",
            body: "ClashAnime لا يفرض رسوم سحب في أغلب الحالات؛ البنك أو PayPal قد يفرض. أنت مسؤول عن إقرار الدخل محلياً.",
          },
          {
            heading: "كم يستغرق السحب؟",
            body: "بعد KYC، المراجعة خلال 24–72 ساعة. أول سحب قد يأخذ وقتاً أطول.",
          },
          {
            heading: "ما الذي يُغلق الحساب؟",
            body: "تفاعل وهمي، حسابات مكررة، مقاطع مسروقة، KYC مزيف، أو بوتات — قد تؤدي لمصادرة الرصيد وإغلاق دائم.",
          },
        ],
      },
      ja: {
        title: "FAQ：どの国でもClashAnimeで稼げる？",
        excerpt:
          "全世界利用、年齢、KYC、税金、出金国、よくある質問。",
        sections: [
          {
            heading: "全世界で使える？",
            body: "はい。多くの国から登録・アップロード・クラッシュ参加が可能。出金方法は地域により異なる場合あり。",
          },
          {
            heading: "どの国でも現金化できる？",
            body: "KYCと不正チェック後、ClashCoins出金。銀行/PayPal/USDT。制裁国は制限の可能性。",
          },
          {
            heading: "18歳以上？",
            body: "各国の最低年齢が必要。",
          },
          {
            heading: "現実的な収益は？",
            body: "カジュアルはゆっくり。クラッシュ勝者・Top 12・シーズン上位が最多。+2,000/勝利。",
          },
          {
            heading: "手数料・税金？",
            body: "出金手数料は通常なし（金融機関は別）。税金申告は自己責任。",
          },
          {
            heading: "出金時間？",
            body: "KYC後24〜72時間レビュー。",
          },
          {
            heading: "BAN理由？",
            body: "不正エンゲージ、複垢、盗用、偽KYC、ボット。",
          },
        ],
      },
    },
  },
];
