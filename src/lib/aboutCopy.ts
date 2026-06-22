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

export function getAboutCopy(locale: Locale): AboutCopy {
  if (locale === "ar") return aboutAr;
  if (locale === "ja") {
    return {
      ...aboutEn,
      title: "私たちについて",
      teamHeading: "チーム",
      teamContactLabel: "チームへのお問い合わせ",
      ctaButton: "今すぐ参加",
    };
  }
  return aboutEn;
}
