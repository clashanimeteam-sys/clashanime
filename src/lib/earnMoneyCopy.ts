import type { Locale } from "@/lib/types";
import type { EarnMoneyTaskType } from "@/lib/earnMoney";
import { formatEarnMoneyUsd } from "@/lib/earnMoney/settings";

export type EarnMoneyTaskCopy = {
  title: string;
  subtitle: string;
  steps: string[];
  terms: string[];
};

export type EarnMoneyCopy = {
  pageTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  rewardBadge: string;
  rewardPerTask: string;
  howItWorksTitle: string;
  howItWorksSteps: string[];
  tasks: Record<EarnMoneyTaskType, EarnMoneyTaskCopy>;
  warningTitle: string;
  warningBody: string;
  submitTitle: string;
  submitSubtitle: string;
  taskLabel: string;
  urlLabel: string;
  urlPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitButton: string;
  submitting: string;
  submitSuccess: string;
  submitError: string;
  loginRequired: string;
  loginCta: string;
  walletCta: string;
  referralNote: string;
  statusPending: string;
  statusApproved: string;
  statusRejected: string;
  yourSubmissions: string;
  stepsLabel: string;
  termsLabel: string;
  selectTask: string;
  selectedTask: string;
};

const earnEn: EarnMoneyCopy = {
  pageTitle: "Earn Money",
  heroTitle: "Earn real rewards for promoting Clash Anime",
  heroSubtitle:
    "Complete simple promotional tasks, submit your proof link, and receive {amount} in ClashCoins after our team verifies your work.",
  rewardBadge: "{amount} per approved task",
  rewardPerTask: "Each verified task pays {amount} to your ClashCoins wallet.",
  howItWorksTitle: "How it works",
  howItWorksSteps: [
    "Pick one of the tasks below and follow the instructions carefully.",
    "Publish your video, forum post, or blog article with the required Clash Anime mention.",
    "Submit the public link here. Our team reviews within a few business days.",
    "Once approved, {amount} is credited automatically to your ClashCoins wallet.",
  ],
  tasks: {
    youtube: {
      title: "YouTube tutorial video",
      subtitle: "Show the world how Clash Anime works.",
      steps: [
        "Publish a video on your YouTube channel explaining how to use Clash Anime: sign up, log in, upload a clip, join a clash, use the community, and open your ClashCoins wallet.",
        "Include clashanime.com in the description and mention Clash Anime in the title.",
        "After publishing, submit the video link below for review.",
      ],
      terms: [
        "Channel must have at least 100 subscribers and 5 published videos.",
        "Video title must include “Clash Anime” or “clashanime.com”.",
        "Website link must appear in the video description.",
        "You may also add your referral link from Invite Friends for extra earnings.",
      ],
    },
    forum: {
      title: "Forum guide post",
      subtitle: "Share a helpful post on an active forum.",
      steps: [
        "Write a positive guide about Clash Anime on a relevant forum: registration, uploading clips, joining clashes, community rules, and support.",
        "Mention the site as: Clash Anime — clashanime.com",
        "Submit the public forum post link below after publishing.",
      ],
      terms: [
        "Forum account must be at least one month old with at least 5 previous posts.",
        "Post must clearly mention Clash Anime and link to clashanime.com.",
        "You may include your referral link for additional commission.",
      ],
    },
    blog: {
      title: "Blog or website article",
      subtitle: "Publish on your own active site or blog.",
      steps: [
        "Publish an article about anime community platforms or creator rewards and mention Clash Anime with a link to clashanime.com.",
        "Explain how creators can upload clips, compete in clashes, and earn ClashCoins.",
        "Submit the published article URL below for verification.",
      ],
      terms: [
        "Your website or blog must be active, established, and contain older posts — not a brand-new empty site.",
        "Article must mention Clash Anime — clashanime.com with a working link.",
        "You may add your referral link for extra referral rewards.",
      ],
    },
  },
  warningTitle: "Fair play policy",
  warningBody:
    "Deleting your video, forum post, or article after receiving the reward will result in account suspension and removal of related rewards.",
  submitTitle: "Submit your proof link",
  submitSubtitle: "Log in, choose the task you completed, and paste the public URL.",
  taskLabel: "Task type",
  urlLabel: "Public link",
  urlPlaceholder: "https://...",
  notesLabel: "Extra notes (optional)",
  notesPlaceholder: "Channel name, forum username, or anything that helps us verify faster.",
  submitButton: "Send for review",
  submitting: "Sending...",
  submitSuccess: "Submitted successfully. We will review your link soon.",
  submitError: "Could not submit. Check the link and try again.",
  loginRequired: "Sign in to submit a task and track your reward status.",
  loginCta: "Sign in",
  walletCta: "Open ClashCoins wallet",
  referralNote: "Tip: combine these tasks with your referral link from Invite Friends to earn even more.",
  statusPending: "Under review",
  statusApproved: "Approved — {amount} credited",
  statusRejected: "Rejected",
  yourSubmissions: "Your submissions",
  stepsLabel: "Steps",
  termsLabel: "Terms",
  selectTask: "Select this task",
  selectedTask: "Selected",
};

const earnJa: EarnMoneyCopy = {
  pageTitle: "お金を稼ぐ",
  heroTitle: "Clash Animeを紹介して報酬を獲得",
  heroSubtitle:
    "簡単な紹介タスクを完了し、証明リンクを送信すると、審査後にClashCoinsウォレットへ{amount}が付与されます。",
  rewardBadge: "承認ごとに{amount}",
  rewardPerTask: "承認されたタスクごとに{amount}がウォレットに入ります。",
  howItWorksTitle: "流れ",
  howItWorksSteps: [
    "下のタスクから1つ選び、指示どおりに進めます。",
    "動画・掲示板・ブログにClash Animeの記載を入れて公開します。",
    "公開リンクをここから送信します。数日以内に審査します。",
    "承認されると{amount}がClashCoinsウォレットに自動付与されます。",
  ],
  tasks: {
    youtube: {
      title: "YouTube解説動画",
      subtitle: "Clash Animeの使い方を動画で紹介。",
      steps: [
        "登録・ログイン・クリップ投稿・クラッシュ参加・コミュニティ・ClashCoinsウォレットの流れをYouTubeで解説してください。",
        "説明欄にclashanime.comを入れ、タイトルにClash Animeを含めてください。",
        "公開後、動画リンクを送信してください。",
      ],
      terms: [
        "チャンネル登録者100人以上・動画5本以上。",
        "タイトルに「Clash Anime」または「clashanime.com」を含める。",
        "説明欄にサイトリンク必須。",
        "友達招待の紹介リンクも追加可能。",
      ],
    },
    forum: {
      title: "掲示板ガイド投稿",
      subtitle: "活発な掲示板に紹介記事を投稿。",
      steps: [
        "Clash Animeについてのガイドを掲示板に投稿してください。",
        "「Clash Anime — clashanime.com」と明記してください。",
        "公開後、投稿URLを送信してください。",
      ],
      terms: [
        "掲示板アカウントは1ヶ月以上・過去投稿5件以上。",
        "Clash Animeと公式リンクの記載必須。",
        "紹介リンクの追加も可能。",
      ],
    },
    blog: {
      title: "ブログ／サイト記事",
      subtitle: "自分のサイトやブログに記事を公開。",
      steps: [
        "アニメコミュニティやクリエイター報酬についての記事にClash Animeを紹介してください。",
        "clashanime.comへのリンクを含めてください。",
        "公開記事のURLを送信してください。",
      ],
      terms: [
        "サイト／ブログは稼働中で過去投稿があること（新規空サイト不可）。",
        "Clash Anime — clashanime.com の明記必須。",
        "紹介リンクの追加も可能。",
      ],
    },
  },
  warningTitle: "公正利用ポリシー",
  warningBody:
    "報酬受取後に動画・投稿・記事を削除した場合、アカウント停止および報酬取消の対象となります。",
  submitTitle: "証明リンクを送信",
  submitSubtitle: "ログイン後、完了したタスクと公開URLを送信してください。",
  taskLabel: "タスク種別",
  urlLabel: "公開リンク",
  urlPlaceholder: "https://...",
  notesLabel: "補足（任意）",
  notesPlaceholder: "チャンネル名や掲示板ユーザー名など。",
  submitButton: "審査に送信",
  submitting: "送信中...",
  submitSuccess: "送信しました。まもなく審査します。",
  submitError: "送信できませんでした。リンクを確認してください。",
  loginRequired: "タスク送信にはログインが必要です。",
  loginCta: "ログイン",
  walletCta: "ClashCoinsウォレットを開く",
  referralNote: "ヒント: 友達招待リンクと組み合わせるとさらに稼げます。",
  statusPending: "審査中",
  statusApproved: "承認済み — {amount}付与",
  statusRejected: "却下",
  yourSubmissions: "あなたの送信履歴",
  stepsLabel: "手順",
  termsLabel: "条件",
  selectTask: "このタスクを選択",
  selectedTask: "選択中",
};

const earnAr: EarnMoneyCopy = {
  pageTitle: "اربح الأموال",
  heroTitle: "اربح مكافآت حقيقية عند الترويج لـ Clash Anime",
  heroSubtitle:
    "نفّذ مهاماً ترويجية بسيطة، أرسل رابط الإثبات، واستلم {amount} في محفظة ClashCoins بعد مراجعة فريقنا.",
  rewardBadge: "{amount} لكل مهمة معتمدة",
  rewardPerTask: "كل مهمة موثّقة تمنحك {amount} في محفظة ClashCoins.",
  howItWorksTitle: "كيف يعمل البرنامج؟",
  howItWorksSteps: [
    "اختر إحدى المهام أدناه واتبع التعليمات بدقة.",
    "انشر الفيديو أو المنشور أو المقال مع ذكر Clash Anime كما هو مطلوب.",
    "أرسل الرابط العام هنا. نراجع الطلب خلال أيام عمل قليلة.",
    "بعد الموافقة، يُضاف {amount} تلقائياً إلى محفظة ClashCoins.",
  ],
  tasks: {
    youtube: {
      title: "فيديو تعليمي على يوتيوب",
      subtitle: "عرّف العالم على Clash Anime.",
      steps: [
        "انشر فيديو على قناتك يشرح استخدام Clash Anime: التسجيل، تسجيل الدخول، رفع مقطع، دخول نزال، المجتمع، ومحفظة ClashCoins.",
        "ضع رابط clashanime.com في وصف الفيديو واذكر Clash Anime في العنوان.",
        "بعد النشر، أرسل رابط الفيديو أدناه للمراجعة.",
      ],
      terms: [
        "يجب أن تحتوي القناة على أكثر من 100 مشترك وأكثر من 5 فيديوهات منشورة.",
        "يجب أن يتضمن عنوان الفيديو «Clash Anime» أو «clashanime.com».",
        "يجب وضع رابط الموقع في وصف الفيديو.",
        "يمكنك إضافة رابط الدعوة من «ادعُ أصدقاءك» لأرباح إضافية.",
      ],
    },
    forum: {
      title: "منشور إرشادي في منتدى",
      subtitle: "شارك دليلاً مفيداً في منتدى نشط.",
      steps: [
        "اكتب دليلاً إيجابياً عن Clash Anime في منتدى مناسب: التسجيل، رفع المقاطع، النزالات، قوانين المجتمع، والدعم.",
        "اذكر الموقع بهذا الشكل: Clash Anime — clashanime.com",
        "بعد النشر، أرسل رابط المنشور العام أدناه.",
      ],
      terms: [
        "يجب أن يكون حساب المنتدى أقدم من شهر ويحتوي على 5 منشورات سابقة على الأقل.",
        "يجب ذكر Clash Anime مع رابط clashanime.com بوضوح.",
        "يمكنك إضافة رابط الدعوة لعمولات إضافية.",
      ],
    },
    blog: {
      title: "مقال على موقعك أو مدونتك",
      subtitle: "انشر على موقع أو مدونة نشطة تملكها.",
      steps: [
        "انشر مقالاً عن منصات مجتمع الأنمي أو مكافآت المبدعين واذكر Clash Anime مع رابط clashanime.com.",
        "اشرح كيف يرفع المبدعون مقاطعهم، يتنافسون في النزالات، ويكسبون ClashCoins.",
        "أرسل رابط المقال المنشور أدناه للتحقق.",
      ],
      terms: [
        "يجب أن يكون موقعك/مدونتك فعّالاً وقديماً ويحتوي منشورات سابقة — وليس موقعاً جديداً فارغاً.",
        "يجب ذكر Clash Anime — clashanime.com مع رابط يعمل.",
        "يمكنك إضافة رابط الدعوة لمكافآت إحالة إضافية.",
      ],
    },
  },
  warningTitle: "سياسة اللعب النزيه",
  warningBody:
    "حذف الفيديو أو المنشور أو المقال بعد استلام المكافأة يؤدي إلى تعليق الحساب وإلغاء المكافآت المرتبطة.",
  submitTitle: "أرسل رابط الإثبات",
  submitSubtitle: "سجّل الدخول، اختر المهمة التي أنجزتها، والصق الرابط العام.",
  taskLabel: "نوع المهمة",
  urlLabel: "الرابط العام",
  urlPlaceholder: "https://...",
  notesLabel: "ملاحظات إضافية (اختياري)",
  notesPlaceholder: "اسم القناة، اسم المستخدم في المنتدى، أو أي تفاصيل تساعدنا على التحقق.",
  submitButton: "إرسال للمراجعة",
  submitting: "جارٍ الإرسال...",
  submitSuccess: "تم الإرسال بنجاح. سنراجع الرابط قريباً.",
  submitError: "تعذّر الإرسال. تحقق من الرابط وحاول مجدداً.",
  loginRequired: "يجب تسجيل الدخول لإرسال مهمة ومتابعة حالة المكافأة.",
  loginCta: "تسجيل الدخول",
  walletCta: "فتح محفظة ClashCoins",
  referralNote: "نصيحة: اجمع هذه المهام مع رابط الدعوة من «ادعُ أصدقاءك» لزيادة أرباحك.",
  statusPending: "قيد المراجعة",
  statusApproved: "مقبول — تم إضافة {amount}",
  statusRejected: "مرفوض",
  yourSubmissions: "طلباتك",
  stepsLabel: "الخطوات",
  termsLabel: "الشروط",
  selectTask: "اختر هذه المهمة",
  selectedTask: "محدّدة",
};

const earnMoneyByLocale: Record<Locale, EarnMoneyCopy> = {
  en: earnEn,
  ja: earnJa,
  ar: earnAr,
};

function applyRewardAmount(copy: EarnMoneyCopy, amountLabel: string): EarnMoneyCopy {
  const json = JSON.stringify(copy).replaceAll("{amount}", amountLabel);
  return JSON.parse(json) as EarnMoneyCopy;
}

export function getEarnMoneyCopy(locale: Locale, rewardUsd = 2): EarnMoneyCopy {
  const base = earnMoneyByLocale[locale] ?? earnEn;
  return applyRewardAmount(base, formatEarnMoneyUsd(rewardUsd));
}
