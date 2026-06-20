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
    maintenanceMode: string;
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
    signupsDisabled: string;
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
    uploadsDisabled: string;
    accountBanned: string;
  };
  moderation: {
    duplicateFile: string;
    duplicateThumbnail: string;
    duplicateVisual: string;
    likelyReupload: string;
    suspiciousContent: string;
    missingFingerprint: string;
    authRequired: string;
    rejectedGeneric: string;
    statusApproved: string;
    statusReview: string;
    statusPending: string;
    statusRejected: string;
    originalBadge: string;
  };
  admin: {
    panelTitle: string;
    loading: string;
    accessDenied: string;
    loginRequired: string;
    backToSite: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    usersTitle: string;
    usersSubtitle: string;
    videosTitle: string;
    videosSubtitle: string;
    reportsTitle: string;
    reportsSubtitle: string;
    settingsTitle: string;
    settingsSubtitle: string;
    adminOnly: string;
    saved: string;
    saving: string;
    saveSettings: string;
    saveFailed: string;
    deleted: string;
    searchUsers: string;
    allStatuses: string;
    noVideos: string;
    noReports: string;
    approve: string;
    reject: string;
    sendToReview: string;
    preview: string;
    delete: string;
    confirmDeleteVideo: string;
    ban: string;
    unban: string;
    banned: string;
    active: string;
    viewChannel: string;
    suspicionScore: string;
    rejectionReason: string;
    reportReason: string;
    reportedBy: string;
    anonymous: string;
    unknownVideo: string;
    openModeration: string;
    resolve: string;
    dismiss: string;
    generalSettings: string;
    moderationSettings: string;
    siteName: string;
    siteTagline: string;
    maintenanceMode: string;
    maintenanceModeDesc: string;
    allowUploads: string;
    allowUploadsDesc: string;
    allowSignups: string;
    allowSignupsDesc: string;
    autoApproveEnabled: string;
    autoApproveEnabledDesc: string;
    reviewNewCreators: string;
    reviewNewCreatorsDesc: string;
    rejectSuspiciousUploads: string;
    rejectSuspiciousUploadsDesc: string;
    nav: {
      dashboard: string;
      users: string;
      videos: string;
      reports: string;
      settings: string;
    };
    roles: {
      user: string;
      moderator: string;
      admin: string;
    };
    stats: {
      users: string;
      videos: string;
      reviewQueue: string;
      openReports: string;
      bannedUsers: string;
    };
    quickActions: {
      reviewVideos: string;
      reviewVideosDesc: string;
      handleReports: string;
      handleReportsDesc: string;
      manageUsers: string;
      manageUsersDesc: string;
      siteSettings: string;
      siteSettingsDesc: string;
    };
    table: {
      user: string;
      role: string;
      videos: string;
      status: string;
      actions: string;
      views: string;
    };
    reportStatus: {
      open: string;
      resolved: string;
      dismissed: string;
    };
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
      maintenanceMode: "ClashAnime is in maintenance mode. Some features are temporarily unavailable.",
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
      signupsDisabled: "New sign-ups are currently disabled.",
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
      uploadsDisabled: "Video uploads are temporarily disabled.",
      accountBanned: "Your account is suspended and cannot upload videos.",
    },
    moderation: {
      duplicateFile:
        "This exact video file was already uploaded to ClashAnime. Only original content is allowed.",
      duplicateThumbnail:
        "This cover image matches another upload. Use an original thumbnail.",
      duplicateVisual:
        "This clip looks like a duplicate of existing content. Upload your own original edit.",
      likelyReupload:
        "This clip looks like downloaded content from YouTube or another platform. Only original edits you created are allowed.",
      suspiciousContent:
        "This upload needs manual review before it can appear publicly.",
      missingFingerprint: "Could not fingerprint this file. Try re-exporting the video.",
      authRequired: "Sign in to upload videos.",
      rejectedGeneric: "This upload was blocked by content protection.",
      statusApproved: "Live",
      statusReview: "Under review",
      statusPending: "Pending",
      statusRejected: "Rejected",
      originalBadge: "Original",
    },
    admin: {
      panelTitle: "Admin Panel",
      loading: "Loading admin panel...",
      accessDenied: "You do not have permission to access the admin panel.",
      loginRequired: "Sign in with an admin account to continue.",
      backToSite: "Back to site",
      dashboardTitle: "Dashboard",
      dashboardSubtitle: "Overview of users, videos, moderation, and reports.",
      usersTitle: "Subscribers",
      usersSubtitle: "Manage roles, bans, and channel access.",
      videosTitle: "Videos",
      videosSubtitle: "Approve, reject, review, or delete uploaded clips.",
      reportsTitle: "Reports",
      reportsSubtitle: "Review copyright and content reports from users.",
      settingsTitle: "Site Settings",
      settingsSubtitle: "Control uploads, sign-ups, maintenance, and moderation rules.",
      adminOnly: "Only admins can access this section.",
      saved: "Changes saved.",
      saving: "Saving...",
      saveSettings: "Save settings",
      saveFailed: "Could not save settings.",
      deleted: "Deleted.",
      searchUsers: "Search by username or name",
      allStatuses: "All",
      noVideos: "No videos match this filter.",
      noReports: "No reports match this filter.",
      approve: "Approve",
      reject: "Reject",
      sendToReview: "Send to review",
      preview: "Preview",
      delete: "Delete",
      confirmDeleteVideo: "Delete this video permanently?",
      ban: "Ban",
      unban: "Unban",
      banned: "Banned",
      active: "Active",
      viewChannel: "View channel",
      suspicionScore: "Suspicion score",
      rejectionReason: "Rejection reason",
      reportReason: "Reason",
      reportedBy: "Reported by",
      anonymous: "anonymous",
      unknownVideo: "Unknown video",
      openModeration: "Open moderation",
      resolve: "Resolve",
      dismiss: "Dismiss",
      generalSettings: "General",
      moderationSettings: "Moderation",
      siteName: "Site name",
      siteTagline: "Site tagline",
      maintenanceMode: "Maintenance mode",
      maintenanceModeDesc: "Shows a maintenance notice and limits public activity.",
      allowUploads: "Allow uploads",
      allowUploadsDesc: "Disable to block new video uploads site-wide.",
      allowSignups: "Allow sign-ups",
      allowSignupsDesc: "Disable to block new account creation.",
      autoApproveEnabled: "Auto-approve clean uploads",
      autoApproveEnabledDesc: "Approve uploads that pass duplicate and suspicion checks.",
      reviewNewCreators: "Review new creators",
      reviewNewCreatorsDesc: "Hold first uploads from new accounts for manual review.",
      rejectSuspiciousUploads: "Reject suspicious uploads",
      rejectSuspiciousUploadsDesc: "Block likely re-uploads from YouTube and other platforms.",
      nav: {
        dashboard: "Dashboard",
        users: "Subscribers",
        videos: "Videos",
        reports: "Reports",
        settings: "Settings",
      },
      roles: {
        user: "User",
        moderator: "Moderator",
        admin: "Admin",
      },
      stats: {
        users: "Subscribers",
        videos: "Videos",
        reviewQueue: "Review queue",
        openReports: "Open reports",
        bannedUsers: "Banned users",
      },
      quickActions: {
        reviewVideos: "Review videos",
        reviewVideosDesc: "Open the moderation queue for pending clips.",
        handleReports: "Handle reports",
        handleReportsDesc: "Resolve copyright and abuse reports.",
        manageUsers: "Manage subscribers",
        manageUsersDesc: "Change roles, ban accounts, and inspect channels.",
        siteSettings: "Site settings",
        siteSettingsDesc: "Configure uploads, sign-ups, and moderation.",
      },
      table: {
        user: "User",
        role: "Role",
        videos: "Videos",
        status: "Status",
        actions: "Actions",
        views: "Views",
      },
      reportStatus: {
        open: "Open",
        resolved: "Resolved",
        dismissed: "Dismissed",
      },
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
      maintenanceMode: "ClashAnimeはメンテナンス中です。一部機能が一時的に利用できません。",
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
      signupsDisabled: "現在、新規登録は停止されています。",
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
      uploadsDisabled: "動画アップロードは一時的に停止されています。",
      accountBanned: "アカウントが停止されているため、アップロードできません。",
    },
    moderation: {
      duplicateFile:
        "この動画ファイルはすでにClashAnimeにアップロードされています。オリジナルのみ投稿できます。",
      duplicateThumbnail:
        "このカバー画像は別の投稿と一致します。オリジナルのサムネイルを使用してください。",
      duplicateVisual:
        "このクリップは既存コンテンツの重複の可能性があります。自分のオリジナル編集をアップロードしてください。",
      likelyReupload:
        "YouTubeなど他プラットフォームからダウンロードした動画の可能性があります。自分で作成したオリジナルのみ投稿できます。",
      suspiciousContent:
        "このアップロードは公開前に手動審査が必要です。",
      missingFingerprint: "ファイルの指紋を取得できませんでした。動画を再書き出ししてください。",
      authRequired: "動画をアップロードするにはログインしてください。",
      rejectedGeneric: "コンテンツ保護によりこのアップロードはブロックされました。",
      statusApproved: "公開中",
      statusReview: "審査中",
      statusPending: "保留",
      statusRejected: "拒否",
      originalBadge: "オリジナル",
    },
    admin: {
      panelTitle: "管理パネル",
      loading: "管理パネルを読み込み中...",
      accessDenied: "管理パネルへのアクセス権限がありません。",
      loginRequired: "管理者アカウントでログインしてください。",
      backToSite: "サイトに戻る",
      dashboardTitle: "ダッシュボード",
      dashboardSubtitle: "ユーザー、動画、審査、報告の概要。",
      usersTitle: "登録者",
      usersSubtitle: "ロール、停止、チャンネル管理。",
      videosTitle: "動画",
      videosSubtitle: "承認、拒否、審査、削除。",
      reportsTitle: "報告",
      reportsSubtitle: "著作権とコンテンツ報告を確認。",
      settingsTitle: "サイト設定",
      settingsSubtitle: "アップロード、登録、メンテナンス、審査ルール。",
      adminOnly: "管理者のみアクセスできます。",
      saved: "保存しました。",
      saving: "保存中...",
      saveSettings: "設定を保存",
      saveFailed: "設定を保存できませんでした。",
      deleted: "削除しました。",
      searchUsers: "ユーザー名または名前で検索",
      allStatuses: "すべて",
      noVideos: "該当する動画がありません。",
      noReports: "該当する報告がありません。",
      approve: "承認",
      reject: "拒否",
      sendToReview: "審査へ",
      preview: "プレビュー",
      delete: "削除",
      confirmDeleteVideo: "この動画を完全に削除しますか？",
      ban: "停止",
      unban: "停止解除",
      banned: "停止中",
      active: "有効",
      viewChannel: "チャンネルを見る",
      suspicionScore: "疑わしさスコア",
      rejectionReason: "拒否理由",
      reportReason: "理由",
      reportedBy: "報告者",
      anonymous: "匿名",
      unknownVideo: "不明な動画",
      openModeration: "審査を開く",
      resolve: "解決",
      dismiss: "却下",
      generalSettings: "一般",
      moderationSettings: "審査",
      siteName: "サイト名",
      siteTagline: "サイトのタグライン",
      maintenanceMode: "メンテナンスモード",
      maintenanceModeDesc: "メンテナンス通知を表示し、一部機能を制限します。",
      allowUploads: "アップロードを許可",
      allowUploadsDesc: "無効にすると新規動画アップロードを停止します。",
      allowSignups: "新規登録を許可",
      allowSignupsDesc: "無効にすると新規アカウント作成を停止します。",
      autoApproveEnabled: "問題ないアップロードを自動承認",
      autoApproveEnabledDesc: "重複と疑わしさチェックを通過した投稿を承認します。",
      reviewNewCreators: "新規クリエイターを審査",
      reviewNewCreatorsDesc: "新規アカウントの最初の投稿を手動審査に回します。",
      rejectSuspiciousUploads: "疑わしいアップロードを拒否",
      rejectSuspiciousUploadsDesc: "YouTubeなどからの再アップロードをブロックします。",
      nav: {
        dashboard: "ダッシュボード",
        users: "登録者",
        videos: "動画",
        reports: "報告",
        settings: "設定",
      },
      roles: {
        user: "ユーザー",
        moderator: "モデレーター",
        admin: "管理者",
      },
      stats: {
        users: "登録者",
        videos: "動画",
        reviewQueue: "審査待ち",
        openReports: "未処理の報告",
        bannedUsers: "停止ユーザー",
      },
      quickActions: {
        reviewVideos: "動画を審査",
        reviewVideosDesc: "保留中のクリップ審査キューを開きます。",
        handleReports: "報告を処理",
        handleReportsDesc: "著作権と不正利用の報告を解決します。",
        manageUsers: "登録者を管理",
        manageUsersDesc: "ロール変更、停止、チャンネル確認。",
        siteSettings: "サイト設定",
        siteSettingsDesc: "アップロード、登録、審査を設定します。",
      },
      table: {
        user: "ユーザー",
        role: "ロール",
        videos: "動画",
        status: "状態",
        actions: "操作",
        views: "視聴",
      },
      reportStatus: {
        open: "未処理",
        resolved: "解決済み",
        dismissed: "却下",
      },
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
      maintenanceMode: "ClashAnime في وضع الصيانة. بعض الميزات غير متاحة مؤقتاً.",
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
      signupsDisabled: "التسجيلات الجديدة متوقفة حالياً.",
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
      uploadsDisabled: "رفع الفيديوهات متوقف مؤقتاً.",
      accountBanned: "حسابك موقوف ولا يمكنك رفع الفيديوهات.",
    },
    moderation: {
      duplicateFile:
        "تم رفع هذا الملف بالفعل إلى ClashAnime. يُسمح بالمحتوى الأصلي فقط.",
      duplicateThumbnail:
        "صورة الغلاف مطابقة لرفع آخر. استخدم صورة غلاف أصلية.",
      duplicateVisual:
        "يبدو هذا المقطع نسخة مكررة من محتوى موجود. ارفع montage أصلياً خاصاً بك.",
      likelyReupload:
        "يبدو هذا المقطع محمّلاً من YouTube أو منصة أخرى. يُسمح فقط بالمحتوى الأصلي الذي أنشأته بنفسك.",
      suspiciousContent:
        "هذا الرفع يحتاج مراجعة يدوية قبل أن يظهر للعامة.",
      missingFingerprint: "تعذر إنشاء بصمة للملف. أعد تصدير الفيديو.",
      authRequired: "سجّل الدخول لرفع الفيديوهات.",
      rejectedGeneric: "تم حظر هذا الرفع بواسطة حماية المحتوى.",
      statusApproved: "منشور",
      statusReview: "قيد المراجعة",
      statusPending: "معلق",
      statusRejected: "مرفوض",
      originalBadge: "أصلي",
    },
    admin: {
      panelTitle: "لوحة التحكم",
      loading: "جارٍ تحميل لوحة التحكم...",
      accessDenied: "ليس لديك صلاحية للوصول إلى لوحة التحكم.",
      loginRequired: "سجّل الدخول بحساب مدير للمتابعة.",
      backToSite: "العودة للموقع",
      dashboardTitle: "لوحة المعلومات",
      dashboardSubtitle: "نظرة عامة على المشتركين والفيديوهات والمراجعة والبلاغات.",
      usersTitle: "المشتركون",
      usersSubtitle: "إدارة الأدوار والحظر والقنوات.",
      videosTitle: "الفيديوهات",
      videosSubtitle: "قبول أو رفض أو مراجعة أو حذف المقاطع.",
      reportsTitle: "البلاغات",
      reportsSubtitle: "مراجعة بلاغات حقوق النشر ومحتوى المستخدمين.",
      settingsTitle: "إعدادات الموقع",
      settingsSubtitle: "التحكم بالرفع والتسجيل والصيانة وقواعد المراجعة.",
      adminOnly: "المديرون فقط يمكنهم الوصول لهذا القسم.",
      saved: "تم حفظ التغييرات.",
      saving: "جارٍ الحفظ...",
      saveSettings: "حفظ الإعدادات",
      saveFailed: "تعذر حفظ الإعدادات.",
      deleted: "تم الحذف.",
      searchUsers: "ابحث باسم المستخدم أو الاسم",
      allStatuses: "الكل",
      noVideos: "لا توجد فيديوهات مطابقة.",
      noReports: "لا توجد بلاغات مطابقة.",
      approve: "قبول",
      reject: "رفض",
      sendToReview: "إرسال للمراجعة",
      preview: "معاينة",
      delete: "حذف",
      confirmDeleteVideo: "حذف هذا الفيديو نهائياً؟",
      ban: "حظر",
      unban: "إلغاء الحظر",
      banned: "محظور",
      active: "نشط",
      viewChannel: "عرض القناة",
      suspicionScore: "درجة الاشتباه",
      rejectionReason: "سبب الرفض",
      reportReason: "السبب",
      reportedBy: "بلّغ بواسطة",
      anonymous: "مجهول",
      unknownVideo: "فيديو غير معروف",
      openModeration: "فتح المراجعة",
      resolve: "حل",
      dismiss: "تجاهل",
      generalSettings: "عام",
      moderationSettings: "المراجعة",
      siteName: "اسم الموقع",
      siteTagline: "شعار الموقع",
      maintenanceMode: "وضع الصيانة",
      maintenanceModeDesc: "يعرض تنبيهاً ويحدّ من نشاط الموقع.",
      allowUploads: "السماح بالرفع",
      allowUploadsDesc: "عطّل لمنع رفع فيديوهات جديدة.",
      allowSignups: "السماح بالتسجيل",
      allowSignupsDesc: "عطّل لمنع إنشاء حسابات جديدة.",
      autoApproveEnabled: "قبول تلقائي للرفعات النظيفة",
      autoApproveEnabledDesc: "قبول المقاطع التي تجتاز فحص التكرار والاشتباه.",
      reviewNewCreators: "مراجعة المبدعين الجدد",
      reviewNewCreatorsDesc: "إبقاء أول رفع لكل حساب جديد قيد المراجعة.",
      rejectSuspiciousUploads: "رفض الرفعات المشبوهة",
      rejectSuspiciousUploadsDesc: "حظر إعادة رفع المحتوى من YouTube ومنصات أخرى.",
      nav: {
        dashboard: "لوحة المعلومات",
        users: "المشتركون",
        videos: "الفيديوهات",
        reports: "البلاغات",
        settings: "الإعدادات",
      },
      roles: {
        user: "مستخدم",
        moderator: "مشرف",
        admin: "مدير",
      },
      stats: {
        users: "المشتركون",
        videos: "الفيديوهات",
        reviewQueue: "قائمة المراجعة",
        openReports: "بلاغات مفتوحة",
        bannedUsers: "محظورون",
      },
      quickActions: {
        reviewVideos: "مراجعة الفيديوهات",
        reviewVideosDesc: "افتح قائمة المقاطع المعلقة.",
        handleReports: "معالجة البلاغات",
        handleReportsDesc: "حل بلاغات حقوق النشر وإساءة الاستخدام.",
        manageUsers: "إدارة المشتركين",
        manageUsersDesc: "تغيير الأدوار وحظر الحسابات.",
        siteSettings: "إعدادات الموقع",
        siteSettingsDesc: "ضبط الرفع والتسجيل والمراجعة.",
      },
      table: {
        user: "المستخدم",
        role: "الدور",
        videos: "الفيديوهات",
        status: "الحالة",
        actions: "إجراءات",
        views: "المشاهدات",
      },
      reportStatus: {
        open: "مفتوح",
        resolved: "محلول",
        dismissed: "متجاهل",
      },
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
