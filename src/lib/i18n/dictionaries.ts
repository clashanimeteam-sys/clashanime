import type { Locale } from "@/lib/types";

export type Dictionary = {
  brand: {
    name: string;
    tagline: string;
  };
  nav: {
    clash: string;
    videos: string;
    community: string;
    music: string;
    exclusives: string;
    settings: string;
  };
  home: {
    titlePrimary: string;
    titleSecondary: string;
    subtitle: string;
    gridLabel: string;
    upload: string;
  };
  video: {
    like: string;
    unlike: string;
    comments: string;
    share: string;
    report: string;
    linkCopied: string;
    shareCancelled: string;
    reportSubmitted: string;
    goldMedal: string;
    silverMedal: string;
    bronzeMedal: string;
    rank: string;
    unavailable: string;
    backHome: string;
    notFound: string;
    views: string;
    commentPlaceholder: string;
    postComment: string;
    postingComment: string;
    actionFailed: string;
    noComments: string;
    loginToComment: string;
    reply: string;
    replyingTo: string;
    viewReplies: string;
    hideReplies: string;
    commentLikes: string;
    pinComment: string;
    unpinComment: string;
    pinned: string;
    addEmoji: string;
    swipeVideos: string;
    settings: string;
    playbackSpeed: string;
    normalSpeed: string;
    mute: string;
    unmute: string;
    fullscreen: string;
    copyLink: string;
  };
  theme: {
    light: string;
    dark: string;
    toggle: string;
  };
  locale: {
    label: string;
  };
  footer: {
    tagline: string;
    terms: string;
    dmca: string;
    reportContent: string;
  };
  auth: {
    logIn: string;
    signUp: string;
    signOut: string;
    loginTitle: string;
    signupTitle: string;
    loginSubtitle: string;
    signupSubtitle: string;
    continueGoogleLogin: string;
    continueGoogleSignup: string;
    continueGithubLogin: string;
    continueGithubSignup: string;
    continueFacebookLogin: string;
    continueFacebookSignup: string;
    emailPlaceholder: string;
    continueEmail: string;
    close: string;
    backHome: string;
    emailSent: string;
    invalidEmail: string;
    noAccount: string;
    hasAccount: string;
    loading: string;
    signingIn: string;
    callbackError: string;
    configError: string;
  };
  profile: {
    loading: string;
    customize: string;
    saveChanges: string;
    unsavedChanges: string;
    saving: string;
    saved: string;
    displayName: string;
    bio: string;
    changeAvatar: string;
    changeBanner: string;
    avatarSaved: string;
    bannerSaved: string;
    uploading: string;
    myVideos: string;
    noVideos: string;
    videosCount: string;
    follow: string;
    unfollow: string;
    followers: string;
    followingLoading: string;
    loadingChannel: string;
    channelNotFound: string;
    channelVideos: string;
    noChannelVideos: string;
    manageChannel: string;
  };
  upload: {
    create: string;
    title: string;
    subtitle: string;
    originalOnly: string;
    loading: string;
    videoFile: string;
    thumbnailFile: string;
    videoTitle: string;
    videoTitlePlaceholder: string;
    hashtags: string;
    hashtagsPlaceholder: string;
    durationLabel: string;
    durationError: string;
    invalidVideo: string;
    requiredFields: string;
    scanning: string;
    uploading: string;
    publish: string;
    reviewPending: string;
    scanFailed: string;
  };
  moderation: {
    duplicateFile: string;
    duplicateThumbnail: string;
    duplicateVisual: string;
    missingFingerprint: string;
    authRequired: string;
    rejectedGeneric: string;
    statusApproved: string;
    statusReview: string;
    statusPending: string;
    statusRejected: string;
    originalBadge: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    brand: {
      name: "ClashAnime",
      tagline: "Duel System",
    },
    nav: {
      clash: "Clash",
      videos: "Videos",
      community: "Community",
      music: "Music",
      exclusives: "Exclusives",
      settings: "Settings",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "Videos rise to the top based on real-time likes and comments. The fastest-growing clips win the grid.",
      gridLabel: "Clash Anime grid",
      upload: "Video Upload",
    },
    video: {
      like: "Like video",
      unlike: "Unlike video",
      comments: "View comments",
      share: "Share",
      report: "Report video",
      linkCopied: "Link copied",
      shareCancelled: "Share cancelled",
      reportSubmitted: "Report submitted. Our team will review it.",
      goldMedal: "Gold medal",
      silverMedal: "Silver medal",
      bronzeMedal: "Bronze medal",
      rank: "Rank",
      unavailable: "This video is not available yet.",
      backHome: "Back to trending",
      notFound: "Video not found.",
      views: "views",
      commentPlaceholder: "Write a comment...",
      postComment: "Post comment",
      postingComment: "Posting...",
      actionFailed: "Could not save. Try again.",
      noComments: "No comments yet. Be the first to comment.",
      loginToComment: "to post a comment.",
      reply: "Reply",
      replyingTo: "Replying to",
      viewReplies: "View replies ({count})",
      hideReplies: "Hide replies",
      commentLikes: "likes",
      pinComment: "Pin",
      unpinComment: "Unpin",
      pinned: "Pinned",
      addEmoji: "Add emoji",
      swipeVideos: "Swipe up or down for next video",
      settings: "Video settings",
      playbackSpeed: "Playback speed",
      normalSpeed: "Normal",
      mute: "Mute",
      unmute: "Unmute",
      fullscreen: "Fullscreen",
      copyLink: "Copy link",
    },
    theme: {
      light: "Switch to light mode",
      dark: "Switch to dark mode",
      toggle: "Toggle theme",
    },
    locale: {
      label: "Language",
    },
    footer: {
      tagline: "Anime duels ranked by real-time community engagement.",
      terms: "Terms of Use",
      dmca: "DMCA",
      reportContent: "Report Content",
    },
    auth: {
      logIn: "Log In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      loginTitle: "Log in to Clash Anime",
      signupTitle: "Sign up to Clash Anime",
      loginSubtitle: "Continue with Google, GitHub, or Facebook to join the duel grid.",
      signupSubtitle: "Create your account with Google, GitHub, or Facebook and start uploading duels.",
      continueGoogleLogin: "Continue with Google",
      continueGoogleSignup: "Continue with Google",
      continueGithubLogin: "Continue with GitHub",
      continueGithubSignup: "Continue with GitHub",
      continueFacebookLogin: "Continue with Facebook",
      continueFacebookSignup: "Continue with Facebook",
      emailPlaceholder: "Email Address",
      continueEmail: "Continue with Email",
      close: "Close and go back",
      backHome: "Back to Clash Anime home",
      emailSent: "Check your email for the login link.",
      invalidEmail: "Enter a valid email address.",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      loading: "Connecting...",
      signingIn: "Signing you in...",
      callbackError: "Authentication failed. Please try again.",
      configError: "Auth is not configured yet.",
    },
    profile: {
      loading: "Loading your channel...",
      customize: "Customize channel",
      saveChanges: "Save changes",
      unsavedChanges: "You have unsaved changes.",
      saving: "Saving...",
      saved: "Channel updated.",
      displayName: "Channel name",
      bio: "About",
      changeAvatar: "Photo",
      changeBanner: "Cover",
      avatarSaved: "Profile photo updated.",
      bannerSaved: "Cover image updated.",
      uploading: "Uploading...",
      myVideos: "Your videos",
      noVideos: "No videos yet. Upload your first duel clip.",
      videosCount: "videos",
      follow: "Follow",
      unfollow: "Unfollow",
      followers: "followers",
      followingLoading: "...",
      loadingChannel: "Loading channel...",
      channelNotFound: "Channel not found.",
      channelVideos: "Videos",
      noChannelVideos: "This channel has no videos yet.",
      manageChannel: "Manage your channel",
    },
    upload: {
      create: "Create",
      title: "Upload duel clip",
      subtitle: "Short vertical clips only: 10 seconds to 1 minute.",
      originalOnly:
        "Only original content is allowed. Each upload is scanned automatically for duplicates before publishing.",
      loading: "Loading upload...",
      videoFile: "Video file",
      thumbnailFile: "Cover image",
      videoTitle: "Title",
      videoTitlePlaceholder: "Give your duel a title",
      hashtags: "Hashtags",
      hashtagsPlaceholder: "#anime #duel #clash",
      durationLabel: "Duration",
      durationError: "Clip must be between 10 seconds and 1 minute.",
      invalidVideo: "Could not read this video file.",
      requiredFields: "Add a video, cover image, and title.",
      scanning: "Checking original content...",
      uploading: "Uploading...",
      publish: "Publish",
      reviewPending:
        "Your clip was uploaded and is under review. It will appear publicly once approved.",
      scanFailed: "Could not verify this file. Try again with a different export.",
    },
    moderation: {
      duplicateFile:
        "This exact video file was already uploaded to ClashAnime. Only original content is allowed.",
      duplicateThumbnail:
        "This cover image matches another upload. Use an original thumbnail.",
      duplicateVisual:
        "This clip looks like a duplicate of existing content. Upload your own original edit.",
      missingFingerprint: "Could not fingerprint this file. Try re-exporting the video.",
      authRequired: "Sign in to upload videos.",
      rejectedGeneric: "This upload was blocked by content protection.",
      statusApproved: "Live",
      statusReview: "Under review",
      statusPending: "Pending",
      statusRejected: "Rejected",
      originalBadge: "Original",
    },
  },
  ja: {
    brand: {
      name: "ClashAnime",
      tagline: "デュエルシステム",
    },
    nav: {
      clash: "クラッシュ",
      videos: "動画",
      community: "コミュニティ",
      music: "音楽",
      exclusives: "限定",
      settings: "設定",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "リアルタイムのいいねとコメントで動画が上位に上がります。最も伸びているクリップがグリッドの頂点を占めます。",
      gridLabel: "Clash Animeグリッド",
      upload: "動画アップロード",
    },
    video: {
      like: "いいね",
      unlike: "いいねを取り消す",
      comments: "コメントを見る",
      share: "共有",
      report: "動画を報告",
      linkCopied: "リンクをコピーしました",
      shareCancelled: "共有をキャンセルしました",
      reportSubmitted: "報告を受け付けました。チームが確認します。",
      goldMedal: "金メダル",
      silverMedal: "銀メダル",
      bronzeMedal: "銅メダル",
      rank: "順位",
      unavailable: "この動画はまだ視聴できません。",
      backHome: "トレンドに戻る",
      notFound: "動画が見つかりません。",
      views: "回視聴",
      commentPlaceholder: "コメントを書く...",
      postComment: "コメントする",
      postingComment: "送信中...",
      actionFailed: "保存できませんでした。もう一度お試しください。",
      noComments: "まだコメントがありません。最初のコメントをどうぞ。",
      loginToComment: "してコメントを投稿。",
      reply: "返信",
      replyingTo: "返信先",
      viewReplies: "返信を表示 ({count})",
      hideReplies: "返信を非表示",
      commentLikes: "いいね",
      pinComment: "固定",
      unpinComment: "固定解除",
      pinned: "固定済み",
      addEmoji: "絵文字を追加",
      swipeVideos: "上下にスワイプして次の動画へ",
      settings: "動画設定",
      playbackSpeed: "再生速度",
      normalSpeed: "標準",
      mute: "ミュート",
      unmute: "ミュート解除",
      fullscreen: "全画面",
      copyLink: "リンクをコピー",
    },
    theme: {
      light: "ライトモードに切り替え",
      dark: "ダークモードに切り替え",
      toggle: "テーマを切り替え",
    },
    locale: {
      label: "言語",
    },
    footer: {
      tagline: "リアルタイムのコミュニティ参加でランク付けされるアニメデュエル。",
      terms: "利用規約",
      dmca: "DMCA",
      reportContent: "コンテンツを報告",
    },
    auth: {
      logIn: "ログイン",
      signUp: "新規登録",
      signOut: "ログアウト",
      loginTitle: "Clash Animeにログイン",
      signupTitle: "Clash Animeに登録",
      loginSubtitle: "Google、GitHub、またはFacebookでデュエルグリッドに参加します。",
      signupSubtitle: "Google、GitHub、またはFacebookでアカウントを作成してデュエルを始めましょう。",
      continueGoogleLogin: "Googleで続行",
      continueGoogleSignup: "Googleで続行",
      continueGithubLogin: "GitHubで続行",
      continueGithubSignup: "GitHubで続行",
      continueFacebookLogin: "Facebookで続行",
      continueFacebookSignup: "Facebookで続行",
      emailPlaceholder: "メールアドレス",
      continueEmail: "メールで続行",
      close: "閉じて戻る",
      backHome: "Clash Animeホームに戻る",
      emailSent: "ログインリンクをメールで確認してください。",
      invalidEmail: "有効なメールアドレスを入力してください。",
      noAccount: "アカウントをお持ちでないですか？",
      hasAccount: "すでにアカウントをお持ちですか？",
      loading: "接続中...",
      signingIn: "ログイン処理中...",
      callbackError: "認証に失敗しました。もう一度お試しください。",
      configError: "認証がまだ設定されていません。",
    },
    profile: {
      loading: "チャンネルを読み込み中...",
      customize: "チャンネルを編集",
      saveChanges: "変更を保存",
      unsavedChanges: "未保存の変更があります。",
      saving: "保存中...",
      saved: "チャンネルを更新しました。",
      displayName: "チャンネル名",
      bio: "概要",
      changeAvatar: "写真",
      changeBanner: "カバー",
      avatarSaved: "プロフィール写真を更新しました。",
      bannerSaved: "カバー画像を更新しました。",
      uploading: "アップロード中...",
      myVideos: "あなたの動画",
      noVideos: "まだ動画がありません。最初のデュエルをアップロードしましょう。",
      videosCount: "本の動画",
      follow: "フォロー",
      unfollow: "フォロー解除",
      followers: "フォロワー",
      followingLoading: "...",
      loadingChannel: "チャンネルを読み込み中...",
      channelNotFound: "チャンネルが見つかりません。",
      channelVideos: "動画",
      noChannelVideos: "このチャンネルにはまだ動画がありません。",
      manageChannel: "チャンネルを管理",
    },
    upload: {
      create: "作成",
      title: "デュエルクリップをアップロード",
      subtitle: "縦型ショート動画のみ：10秒から1分まで。",
      originalOnly:
        "オリジナルコンテンツのみ投稿できます。公開前に自動で重複チェックを行います。",
      loading: "アップロードを読み込み中...",
      videoFile: "動画ファイル",
      thumbnailFile: "カバー画像",
      videoTitle: "タイトル",
      videoTitlePlaceholder: "デュエルにタイトルを付ける",
      hashtags: "ハッシュタグ",
      hashtagsPlaceholder: "#anime #duel #clash",
      durationLabel: "長さ",
      durationError: "クリップは10秒から1分の間である必要があります。",
      invalidVideo: "この動画ファイルを読み取れませんでした。",
      requiredFields: "動画、カバー画像、タイトルを追加してください。",
      scanning: "オリジナル性を確認中...",
      uploading: "アップロード中...",
      publish: "公開",
      reviewPending:
        "クリップはアップロードされ、審査中です。承認後に公開されます。",
      scanFailed: "ファイルを検証できませんでした。別の書き出しで再試行してください。",
    },
    moderation: {
      duplicateFile:
        "この動画ファイルはすでにClashAnimeにアップロードされています。オリジナルのみ投稿できます。",
      duplicateThumbnail:
        "このカバー画像は別の投稿と一致します。オリジナルのサムネイルを使用してください。",
      duplicateVisual:
        "このクリップは既存コンテンツの重複の可能性があります。自分のオリジナル編集をアップロードしてください。",
      missingFingerprint: "ファイルの指紋を取得できませんでした。動画を再書き出ししてください。",
      authRequired: "動画をアップロードするにはログインしてください。",
      rejectedGeneric: "コンテンツ保護によりこのアップロードはブロックされました。",
      statusApproved: "公開中",
      statusReview: "審査中",
      statusPending: "保留",
      statusRejected: "拒否",
      originalBadge: "オリジナル",
    },
  },
  ar: {
    brand: {
      name: "ClashAnime",
      tagline: "نظام النزالات",
    },
    nav: {
      clash: "النزالات",
      videos: "الفيديوهات",
      community: "المجتمع",
      music: "الموسيقى",
      exclusives: "حصري",
      settings: "الإعدادات",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "تصعد الفيديوهات إلى القمة بناءً على الإعجابات والتعليقات الفورية. المقاطع الأسرع نمواً تفوز بالشبكة.",
      gridLabel: "شبكة Clash Anime",
      upload: "رفع فيديو",
    },
    video: {
      like: "إعجاب بالفيديو",
      unlike: "إلغاء الإعجاب",
      comments: "عرض التعليقات",
      share: "مشاركة",
      report: "الإبلاغ عن الفيديو",
      linkCopied: "تم نسخ الرابط",
      shareCancelled: "تم إلغاء المشاركة",
      reportSubmitted: "تم إرسال البلاغ. سيقوم فريقنا بمراجعته.",
      goldMedal: "ميدالية ذهبية",
      silverMedal: "ميدالية فضية",
      bronzeMedal: "ميدالية برونزية",
      rank: "الترتيب",
      unavailable: "هذا الفيديو غير متاح بعد.",
      backHome: "العودة إلى الرائج",
      notFound: "الفيديو غير موجود.",
      views: "مشاهدة",
      commentPlaceholder: "اكتب تعليقاً...",
      postComment: "نشر التعليق",
      postingComment: "جارٍ النشر...",
      actionFailed: "تعذّر الحفظ. حاول مرة أخرى.",
      noComments: "لا توجد تعليقات بعد. كن أول من يعلّق.",
      loginToComment: "لنشر تعليق.",
      reply: "رد",
      replyingTo: "الرد على",
      viewReplies: "عرض الردود ({count})",
      hideReplies: "إخفاء الردود",
      commentLikes: "إعجاب",
      pinComment: "تثبيت",
      unpinComment: "إلغاء التثبيت",
      pinned: "مثبّت",
      addEmoji: "إضافة إيموجي",
      swipeVideos: "مرّر لأعلى أو لأسفل للفيديو التالي",
      settings: "إعدادات الفيديو",
      playbackSpeed: "سرعة التشغيل",
      normalSpeed: "عادي",
      mute: "كتم الصوت",
      unmute: "تشغيل الصوت",
      fullscreen: "ملء الشاشة",
      copyLink: "نسخ الرابط",
    },
    theme: {
      light: "التبديل إلى الوضع النهاري",
      dark: "التبديل إلى الوضع الليلي",
      toggle: "تبديل المظهر",
    },
    locale: {
      label: "اللغة",
    },
    footer: {
      tagline: "نزالات أنمي مُرتَّبة حسب تفاعل المجتمع في الوقت الفعلي.",
      terms: "شروط الاستخدام",
      dmca: "DMCA",
      reportContent: "الإبلاغ عن محتوى",
    },
    auth: {
      logIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      loginTitle: "تسجيل الدخول إلى Clash Anime",
      signupTitle: "إنشاء حساب في Clash Anime",
      loginSubtitle: "تابع بحساب Google أو GitHub أو Facebook للانضمام إلى شبكة النزالات.",
      signupSubtitle: "أنشئ حسابك عبر Google أو GitHub أو Facebook وابدأ برفع النزالات.",
      continueGoogleLogin: "المتابعة مع Google",
      continueGoogleSignup: "المتابعة مع Google",
      continueGithubLogin: "المتابعة مع GitHub",
      continueGithubSignup: "المتابعة مع GitHub",
      continueFacebookLogin: "المتابعة مع Facebook",
      continueFacebookSignup: "المتابعة مع Facebook",
      emailPlaceholder: "عنوان البريد الإلكتروني",
      continueEmail: "المتابعة بالبريد الإلكتروني",
      close: "إغلاق والعودة",
      backHome: "العودة إلى الصفحة الرئيسية لـ Clash Anime",
      emailSent: "تحقق من بريدك الإلكتروني للحصول على رابط تسجيل الدخول.",
      invalidEmail: "أدخل عنوان بريد إلكتروني صالحاً.",
      noAccount: "ليس لديك حساب؟",
      hasAccount: "لديك حساب بالفعل؟",
      loading: "جارٍ الاتصال...",
      signingIn: "جارٍ تسجيل الدخول...",
      callbackError: "فشلت المصادقة. حاول مرة أخرى.",
      configError: "المصادقة غير مُعدّة بعد.",
    },
    profile: {
      loading: "جارٍ تحميل قناتك...",
      customize: "تخصيص القناة",
      saveChanges: "حفظ التغييرات",
      unsavedChanges: "لديك تغييرات غير محفوظة.",
      saving: "جارٍ الحفظ...",
      saved: "تم تحديث القناة.",
      displayName: "اسم القناة",
      bio: "نبذة",
      changeAvatar: "صورة",
      changeBanner: "غلاف",
      avatarSaved: "تم تحديث صورة القناة.",
      bannerSaved: "تم تحديث صورة الغلاف.",
      uploading: "جارٍ الرفع...",
      myVideos: "فيديوهاتك",
      noVideos: "لا توجد فيديوهات بعد. ارفع أول نزال.",
      videosCount: "فيديو",
      follow: "متابعة",
      unfollow: "إلغاء المتابعة",
      followers: "متابع",
      followingLoading: "...",
      loadingChannel: "جارٍ تحميل القناة...",
      channelNotFound: "القناة غير موجودة.",
      channelVideos: "الفيديوهات",
      noChannelVideos: "لا توجد فيديوهات في هذه القناة بعد.",
      manageChannel: "إدارة قناتك",
    },
    upload: {
      create: "إنشاء",
      title: "رفع مقطع نزال",
      subtitle: "مقاطع قصيرة عمودية فقط: من 10 ثوانٍ إلى دقيقة.",
      originalOnly:
        "يُسمح بالمحتوى الأصلي فقط. يُفحص كل رفع تلقائياً للكشف عن التكرار قبل النشر.",
      loading: "جارٍ تحميل الرفع...",
      videoFile: "ملف الفيديو",
      thumbnailFile: "صورة الغلاف",
      videoTitle: "العنوان",
      videoTitlePlaceholder: "أضف عنواناً للنزال",
      hashtags: "الهاشتاغات",
      hashtagsPlaceholder: "#anime #duel #clash",
      durationLabel: "المدة",
      durationError: "يجب أن يكون المقطع بين 10 ثوانٍ ودقيقة واحدة.",
      invalidVideo: "تعذر قراءة ملف الفيديو.",
      requiredFields: "أضف فيديو وصورة غلاف وعنواناً.",
      scanning: "جارٍ التحقق من أصالة المحتوى...",
      uploading: "جارٍ الرفع...",
      publish: "نشر",
      reviewPending:
        "تم رفع المقطع وهو قيد المراجعة. سيظهر للعامة بعد الموافقة.",
      scanFailed: "تعذر التحقق من الملف. جرّب تصديراً مختلفاً للفيديو.",
    },
    moderation: {
      duplicateFile:
        "تم رفع هذا الملف بالفعل إلى ClashAnime. يُسمح بالمحتوى الأصلي فقط.",
      duplicateThumbnail:
        "صورة الغلاف مطابقة لرفع آخر. استخدم صورة غلاف أصلية.",
      duplicateVisual:
        "يبدو هذا المقطع نسخة مكررة من محتوى موجود. ارفع montage أصلياً خاصاً بك.",
      missingFingerprint: "تعذر إنشاء بصمة للملف. أعد تصدير الفيديو.",
      authRequired: "سجّل الدخول لرفع الفيديوهات.",
      rejectedGeneric: "تم حظر هذا الرفع بواسطة حماية المحتوى.",
      statusApproved: "منشور",
      statusReview: "قيد المراجعة",
      statusPending: "معلق",
      statusRejected: "مرفوض",
      originalBadge: "أصلي",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
