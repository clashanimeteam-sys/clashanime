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
    hunterSystem: string;
    bountyRewards: string;
    inviteFriends: string;
    channelSettings: string;
    myVideos: string;
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
    inClashTop: string;
    trendingDuel: string;
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
    signupToComment: string;
    reply: string;
    replyingTo: string;
    viewReplies: string;
    hideReplies: string;
    commentLikes: string;
    pinComment: string;
    unpinComment: string;
    pinned: string;
    addEmoji: string;
    addSticker: string;
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
    privacy: string;
    terms: string;
    communityGuidelines: string;
    dmca: string;
    reportContent: string;
  };
  pages: {
    videosTitle: string;
    videosSubtitle: string;
    exclusivesTitle: string;
    exclusivesSubtitle: string;
    communityTitle: string;
    communitySubtitle: string;
    communityBody: string;
    musicTitle: string;
    musicSubtitle: string;
    musicBody: string;
    emptyVideos: string;
    emptyExclusives: string;
  };
  exclusives: {
    dailyHallBadge: string;
    dailyHallTitle: string;
    dailyHallSubtitle: string;
    interactionKing: string;
    pointsToday: string;
    noDailyLeader: string;
    randomDuelBadge: string;
    randomDuelTitle: string;
    randomDuelDesc: string;
    startRandomDuel: string;
    randomDuelPageDesc: string;
    vs: string;
    watchAndVote: string;
    shuffleDuel: string;
    noDuelVideos: string;
    backToExclusives: string;
    challengeClipButton: string;
    challengeClipModalTitle: string;
    challengeClipModalDesc: string;
    pickYourClip: string;
    startChallengeDuel: string;
    creatingChallengeDuel: string;
    loadingClips: string;
    noClipsToChallenge: string;
    loginToChallenge: string;
    challengeFailed: string;
    challengeDuelBadge: string;
    challengeDuelTitle: string;
    challengeDuelPageDesc: string;
    clipChallengeExclusivesDesc: string;
    browseVideosToChallenge: string;
    clipChallengeSectionTitle: string;
    clipChallengeSectionDesc: string;
    pointsWagerBadge: string;
    pointsWagerTitle: string;
    pointsWagerDesc: string;
    startPointsWager: string;
    creatingPointsWager: string;
    pointsWagerModalTitle: string;
    pointsWagerModalDesc: string;
    loginToPointsWager: string;
    yourBalance: string;
    inviteOpponent: string;
    wagerAmount: string;
    wagerPotPreview: string;
    pointsWagerFailed: string;
    incomingWagerInvites: string;
    wagerInviteFrom: string;
    acceptWagerDuel: string;
    acceptingWager: string;
    yourOpenWagers: string;
    waitingOpponent: string;
    activePointsDuels: string;
    potLabel: string;
    watchDuel: string;
    waitingOpponentInvite: string;
    cancelWager: string;
    finalizeWager: string;
    resolvingWager: string;
    wagerCompleted: string;
    wagerCancelled: string;
    wagerWinnerPot: string;
    pointsWagerArenaDesc: string;
    searchingUsernames: string;
    noUsernameSuggestions: string;
  };
  radio: {
    badge: string;
    title: string;
    subtitle: string;
    keepListening: string;
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    volume: string;
    nowPlaying: string;
    liveBroadcast: string;
    liveOnAir: string;
    loading: string;
    stationOst: string;
    stationOstDesc: string;
    stationLofi: string;
    stationLofiDesc: string;
    pickStation: string;
    activeStation: string;
    openFullPlayer: string;
    streamError: string;
    poweredBy: string;
  };
  legal: {
    reportTitle: string;
    reportIntro: string;
    reportLoginRequired: string;
    reportLoginHint: string;
    reportSignupHint: string;
    reportVideoId: string;
    reportVideoIdHint: string;
    reportReasonLabel: string;
    reportReasonCopyright: string;
    reportReasonReupload: string;
    reportReasonSpam: string;
    reportReasonOther: string;
    reportDetailsLabel: string;
    reportDetailsOptionalLabel: string;
    reportDetailsHint: string;
    reportOriginalLinkLabel: string;
    reportOriginalLinkHint: string;
    reportOriginalLinkHelp: string;
    reportOriginalLinkRequired: string;
    reportOriginalLinkInvalid: string;
    reportSubmit: string;
    reportSubmitting: string;
    reportSubmitted: string;
    reportFailed: string;
    reportVideoRequired: string;
    reportDmcaHint: string;
  };
  auth: {
    logIn: string;
    signUp: string;
    signOut: string;
    confirmSignOut: string;
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
    signupLegalBefore: string;
    signupLegalAnd: string;
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
    verifiedBadge: string;
    displayNameCooldown: string;
    displayNameCooldownDays: string;
  };
  points: {
    systemTitle: string;
    hunterRank: string;
    bountyRewardsTitle: string;
    bountyRewardsHint: string;
    bountyUnlocked: string;
    bountyLocked: string;
    bountyLogTitle: string;
    bountyLogEmpty: string;
    currentPositionTitle: string;
    youAreHere: string;
    globalRankPosition: string;
    pointsInRank: string;
    readyToRankUp: string;
    levelSyncNote: string;
    rank: string;
    pointsLabel: string;
    totalPoints: string;
    nextLevel: string;
    pointsToNext: string;
    maxLevelReached: string;
    perksTitle: string;
    howToEarn: string;
    referralTitle: string;
    referralHint: string;
    copyReferral: string;
    linkCopied: string;
    verificationTitle: string;
    verificationHint: string;
    verificationPlaceholder: string;
    requestVerification: string;
    verificationSubmitting: string;
    verificationSubmitted: string;
    alreadyVerified: string;
    legendAutoVerify: string;
    communitySubtitle: string;
    communityPostLabel: string;
    communityPostPlaceholder: string;
    communityPostReward: string;
    communityPostSubmit: string;
    communityPosting: string;
    communityPostSuccess: string;
    communitySignupHint: string;
    communityLoading: string;
    communityEmpty: string;
    levels: {
      rookie: string;
      challenger: string;
      elite: string;
      legend: string;
    };
    perks: {
      voteComment: string;
      upload: string;
      doubleVote: string;
      legend: string;
    };
    earn: {
      referralClick: string;
      referralSignup: string;
      videoLike: string;
      videoUpload: string;
      communityPost: string;
      trendingBonus: string;
    };
    transactionReasons: {
      referral_click: string;
      referral_signup: string;
      video_like: string;
      video_upload: string;
      community_post: string;
      trending_bonus: string;
      video_duel_challenge: string;
      points_duel_stake: string;
      points_duel_win: string;
      points_duel_refund: string;
    };
  };
  communityFeed: {
    postPublished: string;
    postLevelRequired: string;
    animeOnlyNotice: string;
    postPlaceholder: string;
    addImage: string;
    removeImage: string;
    invalidImage: string;
    imageTooLarge: string;
    uploadFailed: string;
    policyCheckbox: string;
    policyCheckboxSuffix: string;
    policyRequired: string;
    deletePost: string;
    confirmDeletePost: string;
    confirmDeleteComment: string;
    deleteComment: string;
    report: string;
    reportTitle: string;
    reportIntro: string;
    reportReasonLabel: string;
    reportReasonOffTopic: string;
    reportReasonAdult: string;
    reportReasonSpam: string;
    reportReasonHarassment: string;
    reportReasonOther: string;
    reportDetailsLabel: string;
    reportDetailsHint: string;
    reportSubmit: string;
    reportSubmitting: string;
    reportSubmitted: string;
    loginToReport: string;
    loginToComment: string;
    commentsTitle: string;
    commentsCountLabel: string;
    backToCommunity: string;
    postNotFound: string;
    loadingComments: string;
    noComments: string;
    commentPlaceholder: string;
    postComment: string;
    postingComment: string;
    actionFailed: string;
    imagePostPreview: string;
  };
  stickers: {
    loading: string;
    empty: string;
    searchPlaceholder: string;
    searchResults: string;
    searchHint: string;
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
    levelRequired: string;
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
    downloadVideo: string;
    delete: string;
    confirmDeleteVideo: string;
    ban: string;
    unban: string;
    banned: string;
    active: string;
    verified: string;
    verify: string;
    unverify: string;
    points: string;
    level: string;
    verificationRequests: string;
    approveVerification: string;
    rejectVerification: string;
    viewChannel: string;
    suspicionScore: string;
    globalRank: string;
    inClashTop: string;
    rejectionReason: string;
    reportReason: string;
    reportedBy: string;
    anonymous: string;
    unknownVideo: string;
    unknownCommunityPost: string;
    communityPostReport: string;
    videoReport: string;
    openCommunityModeration: string;
    communityTitle: string;
    communitySubtitle: string;
    noCommunityPosts: string;
    confirmDeleteCommunityPost: string;
    imageOnlyPost: string;
    stickersTitle: string;
    stickersSubtitle: string;
    createPack: string;
    stickerPackSlug: string;
    stickerPackNameEn: string;
    stickerPackNameAr: string;
    stickerPackNameJa: string;
    uploadSticker: string;
    uploadStickerHint: string;
    stickerSlug: string;
    stickerLabel: string;
    stickerFile: string;
    noStickerPacks: string;
    noStickers: string;
    stickerCountLabel: string;
    packCreated: string;
    stickerCreated: string;
    confirmDeleteSticker: string;
    stickerTooLarge: string;
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
    animeRadioSettings: string;
    animeRadioEnabled: string;
    animeRadioEnabledDesc: string;
    animeRadioAutoplay: string;
    animeRadioAutoplayDesc: string;
    animeRadioDefaultVolume: string;
    autoApproveEnabled: string;
    autoApproveEnabledDesc: string;
    reviewNewCreators: string;
    reviewNewCreatorsDesc: string;
    rejectSuspiciousUploads: string;
    rejectSuspiciousUploadsDesc: string;
    moderationLogTitle: string;
    moderationLogSubtitle: string;
    noModerationLog: string;
    moderationActions: {
      approve: string;
      reject: string;
      review: string;
      delete: string;
      verify_channel: string;
      unverify_channel: string;
      ban_user: string;
      unban_user: string;
    };
    nav: {
      dashboard: string;
      users: string;
      videos: string;
      community: string;
      stickers: string;
      reports: string;
      moderationLog: string;
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
      activeHunters: string;
      pendingVerifications: string;
      communityPosts: string;
      bountyEvents: string;
      clipChallenges: string;
      pointsWagerDuels: string;
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
      animeRadioSettings: string;
      animeRadioSettingsDesc: string;
      exclusivesFeatures: string;
      exclusivesFeaturesDesc: string;
      clipChallenges: string;
      clipChallengesDesc: string;
      pointsWagerDuels: string;
      pointsWagerDuelsDesc: string;
    };
    table: {
      user: string;
      role: string;
      videos: string;
      status: string;
      actions: string;
      views: string;
      time: string;
      action: string;
      staff: string;
      video: string;
      target: string;
      statusChange: string;
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
      music: "Anime Radio",
      exclusives: "Exclusives",
      hunterSystem: "Bounty Hunter System",
      bountyRewards: "Latest bounty rewards",
      inviteFriends: "Invite friends",
      channelSettings: "Channel settings",
      myVideos: "Your videos",
      settings: "Settings",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "The top 10 videos worldwide by real-time engagement. Reach global rank #10 to enter Clash.",
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
      inClashTop: "In Clash",
      trendingDuel: "Trending Duel",
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
      signupToComment: "to like, comment, share, or report videos.",
      reply: "Reply",
      replyingTo: "Replying to",
      viewReplies: "View replies ({count})",
      hideReplies: "Hide replies",
      commentLikes: "likes",
      pinComment: "Pin",
      unpinComment: "Unpin",
      pinned: "Pinned",
      addEmoji: "Add emoji",
      addSticker: "Add anime sticker",
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
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      communityGuidelines: "Community Guidelines",
      dmca: "DMCA",
      reportContent: "Report Content",
    },
    pages: {
      videosTitle: "All Videos",
      videosSubtitle:
        "All approved videos, newest first. Each card shows its global rank. Top 10 also appear in Clash.",
      exclusivesTitle: "Exclusives",
      exclusivesSubtitle: "Clips from verified creators on ClashAnime.",
      communityTitle: "Anime Community",
      communitySubtitle: "Follow creators, comment on duels, and climb the grid together.",
      communityBody:
        "Community features are expanding soon. Explore channels from video cards, follow creators, and join the conversation on each clip.",
      musicTitle: "Music",
      musicSubtitle: "Anime OST radio and lofi beats while you browse.",
      musicBody:
        "Start the player below and keep listening as you explore videos, community posts, and your channel.",
      emptyVideos: "No approved videos yet.",
      emptyExclusives: "No exclusive clips from verified creators yet.",
    },
    exclusives: {
      dailyHallBadge: "Daily Hall of Fame",
      dailyHallTitle: "Daily Hall of Fame",
      dailyHallSubtitle: "The hunter who earned the most interaction points today leads the arena.",
      interactionKing: "Interaction King Today",
      pointsToday: "pts today",
      noDailyLeader: "No daily champion yet. Like, comment, post, and invite friends to claim the crown.",
      randomDuelBadge: "Random Duel",
      randomDuelTitle: "Random Duel",
      randomDuelDesc: "Jump into a surprise head-to-head between two clips and vote for your favorite.",
      startRandomDuel: "Start random duel",
      randomDuelPageDesc: "Pick the stronger clip. Your vote shifts the global clash instantly.",
      vs: "VS",
      watchAndVote: "Watch & vote",
      shuffleDuel: "Shuffle duel",
      noDuelVideos: "Not enough approved videos for a duel yet.",
      backToExclusives: "Back to Exclusives",
      challengeClipButton: "Challenge this clip",
      challengeClipModalTitle: "Quick clip challenge",
      challengeClipModalDesc: "Pick one of your approved clips to duel this video head-to-head.",
      pickYourClip: "Pick your clip",
      startChallengeDuel: "Start duel",
      creatingChallengeDuel: "Creating duel...",
      loadingClips: "Loading your clips...",
      noClipsToChallenge: "Upload an approved clip first to challenge others.",
      loginToChallenge: "Sign up to challenge clips and earn duel points.",
      challengeFailed: "Could not start the duel. Try another clip.",
      challengeDuelBadge: "Quick Challenge",
      challengeDuelTitle: "Clip Challenge",
      challengeDuelPageDesc: "Two creators, one arena. Vote with likes and comments to crown the stronger clip.",
      clipChallengeExclusivesDesc:
        "Under every approved clip you'll find Challenge this clip. Pick your video and spawn a head-to-head duel instantly.",
      browseVideosToChallenge: "Browse clips to challenge",
      clipChallengeSectionTitle: "Clips ready to challenge",
      clipChallengeSectionDesc:
        "Tap Challenge this clip under any video below to duel it with one of your approved uploads.",
      pointsWagerBadge: "Points Wager",
      pointsWagerTitle: "Challenge for points",
      pointsWagerDesc:
        "Invite another hunter, stake your points, and duel clips head-to-head. The winner takes the full pot.",
      startPointsWager: "Open points challenge",
      creatingPointsWager: "Creating challenge...",
      pointsWagerModalTitle: "New points challenge",
      pointsWagerModalDesc:
        "Call a hunter by username, lock your wager, and pick the clip you want to defend.",
      loginToPointsWager: "Sign up to stake points and challenge other hunters.",
      yourBalance: "Your balance",
      inviteOpponent: "Opponent username",
      wagerAmount: "Wager (points)",
      wagerPotPreview: "Winner pot: {pot} points",
      pointsWagerFailed: "Could not complete the points challenge. Check balance and try again.",
      incomingWagerInvites: "Invitations waiting for you",
      wagerInviteFrom: "Challenge for {wager} points — accept with your clip",
      acceptWagerDuel: "Accept & stake",
      acceptingWager: "Accepting...",
      yourOpenWagers: "Your open challenges",
      waitingOpponent: "Waiting",
      activePointsDuels: "Live points duels",
      potLabel: "Pot {pot} pts",
      watchDuel: "Watch duel",
      waitingOpponentInvite: "Waiting for {user} to accept and match your wager.",
      cancelWager: "Cancel & refund",
      finalizeWager: "Finalize — crown winner",
      resolvingWager: "Finalizing...",
      wagerCompleted: "Points duel completed",
      wagerCancelled: "Challenge cancelled",
      wagerWinnerPot: "Winner took the {pot} point pot.",
      pointsWagerArenaDesc:
        "Vote with likes on both clips. When ready, either hunter can finalize — higher likes wins the {pot} point pot.",
      searchingUsernames: "Searching hunters...",
      noUsernameSuggestions: "No matching hunters found.",
    },
    radio: {
      badge: "24/7 stream",
      title: "Anime Radio",
      subtitle:
        "Stream anime openings, soundtracks, and lofi beats without leaving Clash Anime.",
      keepListening: "Keep listening while you browse videos, community, and your profile.",
      play: "Play radio",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      volume: "Volume",
      nowPlaying: "Now playing",
      liveBroadcast: "Live broadcast",
      liveOnAir: "On air",
      loading: "Connecting...",
      stationOst: "Anime OST & Openings",
      stationOstDesc: "24/7 anime openings and soundtracks.",
      stationLofi: "Lofi Anime Beats",
      stationLofiDesc: "Chill retro beats for studying, editing, and browsing.",
      pickStation: "Pick your vibe",
      activeStation: "Live",
      openFullPlayer: "Open radio",
      streamError: "Could not connect to the stream. Try again in a moment.",
      poweredBy: "Anime OST stream by LISTEN.moe. Lofi beats via Nightwave Plaza.",
    },
    legal: {
      reportTitle: "Report Content",
      reportIntro:
        "Report copyright issues, stolen re-uploads, spam, or other policy violations. Verified reports are reviewed in the admin panel.",
      reportLoginRequired: "Sign up to submit a report.",
      reportLoginHint: "to submit a content report.",
      reportSignupHint: "to submit a content report.",
      reportVideoId: "Video ID or URL",
      reportVideoIdHint: "Paste the video ID from the URL (e.g. clashanime.com/video/abc-123)",
      reportReasonLabel: "Reason",
      reportReasonCopyright: "Copyright infringement",
      reportReasonReupload: "Stolen / re-upload",
      reportReasonSpam: "Spam or abuse",
      reportReasonOther: "Other",
      reportDetailsLabel: "Details (optional)",
      reportDetailsOptionalLabel: "Extra details (optional)",
      reportDetailsHint: "Timestamps, channel name, or any extra context.",
      reportOriginalLinkLabel: "Original source link (required)",
      reportOriginalLinkHint: "https://youtube.com/watch?v=... or TikTok/Instagram link",
      reportOriginalLinkHelp:
        "Required for stolen or copyright reports so moderators can compare the original video.",
      reportOriginalLinkRequired: "Enter the original source link for stolen or copyright reports.",
      reportOriginalLinkInvalid: "Enter a valid http or https link to the original video.",
      reportSubmit: "Submit report",
      reportSubmitting: "Submitting...",
      reportSubmitted: "Report submitted. Our team will review it.",
      reportFailed: "Could not submit the report. Check the video ID and try again.",
      reportVideoRequired: "Enter a video ID.",
      reportDmcaHint: "For formal DMCA notices, see the DMCA page.",
    },
    auth: {
      logIn: "Log In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      confirmSignOut: "Are you sure you want to sign out?",
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
      signupLegalBefore: "By creating an account, you agree to our",
      signupLegalAnd: "and",
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
      verifiedBadge: "Verified channel",
      displayNameCooldown: "You can change your channel name again in {days} day(s).",
      displayNameCooldownDays: "Channel name can only be changed once every 14 days.",
    },
    points: {
      systemTitle: "Bounty Hunter Rewards",
      hunterRank: "Your Hunter Rank",
      bountyRewardsTitle: "Rank bounties",
      bountyRewardsHint: "Unlock exclusive rewards as you climb the hunter ranks.",
      bountyUnlocked: "Unlocked",
      bountyLocked: "Locked",
      bountyLogTitle: "Recent bounty earnings",
      bountyLogEmpty: "No bounty earnings yet. Start inviting friends or posting in Community.",
      currentPositionTitle: "Your current rank",
      youAreHere: "You are here",
      globalRankPosition: "Rank {current} of {total}",
      pointsInRank: "{current} / {max} points in this rank",
      readyToRankUp: "Ready to rank up to {rank}!",
      levelSyncNote: "Your rank is syncing from your latest points.",
      rank: "Rank",
      pointsLabel: "points",
      totalPoints: "Total points",
      nextLevel: "Next rank",
      pointsToNext: "{count} points to reach {rank}",
      maxLevelReached: "Maximum rank reached.",
      perksTitle: "Rank perks",
      howToEarn: "How to earn points",
      referralTitle: "Invite friends",
      referralHint: "Share your link. You earn points when someone visits and when they sign up.",
      copyReferral: "Copy link",
      linkCopied: "Link copied",
      verificationTitle: "Channel verification",
      verificationHint: "Request manual verification for your channel. Legend rank unlocks automatic verification.",
      verificationPlaceholder: "Tell us why your channel should be verified...",
      requestVerification: "Request verification",
      verificationSubmitting: "Submitting...",
      verificationSubmitted: "Verification request sent to the admin team.",
      alreadyVerified: "Your channel is verified.",
      legendAutoVerify: "Legend rank unlocks automatic verification.",
      communitySubtitle: "Share updates with the community and earn points for every post.",
      communityPostLabel: "Write a post",
      communityPostPlaceholder: "Share your thoughts, clips, or updates...",
      communityPostReward: "+50 points per post",
      communityPostSubmit: "Publish",
      communityPosting: "Publishing...",
      communityPostSuccess: "Post published. +50 points added.",
      communitySignupHint: "to view posts, comment, and interact in the community.",
      communityLoading: "Loading community posts...",
      communityEmpty: "No community posts yet. Be the first to publish.",
      levels: {
        rookie: "Rookie",
        challenger: "Challenger",
        elite: "Elite",
        legend: "Legend",
      },
      perks: {
        voteComment: "Vote and comment on videos",
        upload: "Upload duel clips",
        doubleVote: "Double-weight votes (Elite)",
        legend: "Legend badge and ranking priority",
      },
      earn: {
        referralClick: "Unique visit from your invite link",
        referralSignup: "Friend signs up through your link",
        videoLike: "Like a video",
        videoUpload: "Upload an approved original clip",
        communityPost: "Publish in Community",
        trendingBonus: "Your clip reaches the trending grid",
      },
      transactionReasons: {
        referral_click: "Invite link visit",
        referral_signup: "Friend signed up",
        video_like: "Video like",
        video_upload: "Approved upload",
        community_post: "Community post",
        trending_bonus: "Trending bounty",
        video_duel_challenge: "Clip challenge duel",
        points_duel_stake: "Points duel stake",
        points_duel_win: "Points duel win",
        points_duel_refund: "Points duel refund",
      },
    },
    communityFeed: {
      postPublished: "Post published.",
      postLevelRequired:
        "Publishing in the community is limited to Hunter ranks A and S (5000+ points). You can still view posts and comment.",
      animeOnlyNotice: "Community posts must be anime-related only. Off-topic, political, or adult content is prohibited.",
      postPlaceholder:
        "The clash arena is open.. share your favorite moment in the anime world!",
      addImage: "Add image",
      removeImage: "Remove",
      invalidImage: "Please choose a valid image file.",
      imageTooLarge: "Image must be 5 MB or smaller.",
      uploadFailed: "Could not upload image. Try again.",
      policyCheckbox: "I confirm this post is anime-related only and complies with the",
      policyCheckboxSuffix: "(required).",
      policyRequired: "You must accept the anime-only community policy before posting.",
      deletePost: "Delete",
      confirmDeletePost: "Delete this post permanently?",
      confirmDeleteComment: "Delete this comment?",
      deleteComment: "Delete",
      report: "Report",
      reportTitle: "Report community post",
      reportIntro: "Help us keep the community anime-focused and safe.",
      reportReasonLabel: "Reason",
      reportReasonOffTopic: "Not anime-related / off-topic",
      reportReasonAdult: "Adult or sexual content",
      reportReasonSpam: "Spam or scam",
      reportReasonHarassment: "Harassment or hate",
      reportReasonOther: "Other violation",
      reportDetailsLabel: "Details",
      reportDetailsHint: "Explain what violates the community guidelines...",
      reportSubmit: "Submit report",
      reportSubmitting: "Submitting...",
      reportSubmitted: "Report submitted. Our team will review it.",
      loginToReport: "to report posts.",
      loginToComment: "Sign in to comment on community posts.",
      commentsTitle: "Comments",
      commentsCountLabel: "comments",
      backToCommunity: "Back to Community",
      postNotFound: "This post is no longer available.",
      loadingComments: "Loading comments...",
      noComments: "No comments yet. Be the first.",
      commentPlaceholder: "Write a comment...",
      postComment: "Post comment",
      postingComment: "Posting...",
      actionFailed: "Could not save. Try again.",
      imagePostPreview: "Community image post",
    },
    stickers: {
      loading: "Loading stickers...",
      empty: "No anime stickers yet.",
      searchPlaceholder: "Search anime or reaction...",
      searchResults: "{count} stickers found",
      searchHint: "Use search to browse all anime series.",
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
      levelRequired: "Reach Challenger rank (1000+ points) to upload videos.",
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
      usersSubtitle: "Manage roles, bans, verification, and channel access.",
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
      downloadVideo: "Download",
      delete: "Delete",
      confirmDeleteVideo: "Delete this video permanently?",
      ban: "Ban",
      unban: "Unban",
      banned: "Banned",
      active: "Active",
      verified: "Verified",
      verify: "Verify",
      unverify: "Remove verification",
      points: "Points",
      level: "Level",
      verificationRequests: "Verification requests",
      approveVerification: "Approve verification",
      rejectVerification: "Reject verification",
      viewChannel: "View channel",
      suspicionScore: "Suspicion score",
      globalRank: "Global rank",
      inClashTop: "In Clash top 10",
      rejectionReason: "Rejection reason",
      reportReason: "Reason",
      reportedBy: "Reported by",
      anonymous: "anonymous",
      unknownVideo: "Unknown video",
      unknownCommunityPost: "Unknown post",
      communityPostReport: "Community post report",
      videoReport: "Video report",
      openCommunityModeration: "Open community moderation",
      communityTitle: "Community posts",
      communitySubtitle: "Review, preview, or remove community feed posts.",
      noCommunityPosts: "No community posts yet.",
      confirmDeleteCommunityPost: "Delete this community post?",
      imageOnlyPost: "Image-only post",
      stickersTitle: "Anime stickers",
      stickersSubtitle: "Upload curated anime GIFs and stickers for posts and comments.",
      createPack: "Create pack",
      stickerPackSlug: "Pack slug",
      stickerPackNameEn: "Pack name (English)",
      stickerPackNameAr: "Pack name (Arabic)",
      stickerPackNameJa: "Pack name (Japanese)",
      uploadSticker: "Upload sticker",
      uploadStickerHint: "Use anime-only GIF, WEBP, or PNG files up to 2 MB.",
      stickerSlug: "Sticker slug",
      stickerLabel: "Sticker label",
      stickerFile: "Sticker file",
      noStickerPacks: "No sticker packs yet.",
      noStickers: "No stickers in this pack yet.",
      stickerCountLabel: "stickers",
      packCreated: "Sticker pack created.",
      stickerCreated: "Sticker uploaded.",
      confirmDeleteSticker: "Delete this sticker permanently?",
      stickerTooLarge: "Sticker must be 2 MB or smaller.",
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
      animeRadioSettings: "Anime Radio",
      animeRadioEnabled: "Enable anime radio",
      animeRadioEnabledDesc: "Shows the mini player and allows streaming across the site.",
      animeRadioAutoplay: "Autoplay on visit",
      animeRadioAutoplayDesc: "Starts the radio quietly when someone opens the site.",
      animeRadioDefaultVolume: "Default radio volume",
      autoApproveEnabled: "Auto-approve clean uploads",
      autoApproveEnabledDesc: "Approve uploads that pass duplicate and suspicion checks.",
      reviewNewCreators: "Review new creators",
      reviewNewCreatorsDesc: "Hold first uploads from new accounts for manual review.",
      rejectSuspiciousUploads: "Reject suspicious uploads",
      rejectSuspiciousUploadsDesc: "Block likely re-uploads from YouTube and other platforms.",
      moderationLogTitle: "Moderation log",
      moderationLogSubtitle: "Audit trail of staff approve, reject, delete, verify, and ban actions.",
      noModerationLog: "No moderation actions recorded yet.",
      moderationActions: {
        approve: "Approved",
        reject: "Rejected",
        review: "Sent to review",
        delete: "Deleted",
        verify_channel: "Verified channel",
        unverify_channel: "Removed verification",
        ban_user: "Banned user",
        unban_user: "Unbanned user",
      },
      nav: {
        dashboard: "Dashboard",
        users: "Subscribers",
        videos: "Videos",
        community: "Community",
        stickers: "Stickers",
        reports: "Reports",
        moderationLog: "Moderation log",
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
        activeHunters: "Active hunters",
        pendingVerifications: "Verification requests",
        communityPosts: "Community posts",
        bountyEvents: "Bounty events",
        clipChallenges: "Clip challenge duels",
        pointsWagerDuels: "Points wager duels",
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
        animeRadioSettings: "Anime radio",
        animeRadioSettingsDesc: "Control autoplay, volume, and the mini player.",
        exclusivesFeatures: "Exclusives arena",
        exclusivesFeaturesDesc: "Daily Hall of Fame, clip challenges, trending duels, and random clash.",
        clipChallenges: "Clip challenges",
        clipChallengesDesc: "Users duel clips head-to-head. Challenge button appears under every approved video.",
        pointsWagerDuels: "Points wager arena",
        pointsWagerDuelsDesc: "Hunters stake points, invite rivals, and the winner takes the pot on /exclusives.",
      },
      table: {
        user: "User",
        role: "Role",
        videos: "Videos",
        status: "Status",
        actions: "Actions",
        views: "Views",
        time: "Time",
        action: "Action",
        staff: "Staff",
        video: "Video",
        target: "Target",
        statusChange: "Status change",
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
      music: "アニメラジオ",
      exclusives: "限定",
      hunterSystem: "賞金ハンターシステム",
      bountyRewards: "最新の報酬",
      inviteFriends: "友達を招待",
      channelSettings: "チャンネル設定",
      myVideos: "あなたの動画",
      settings: "設定",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "リアルタイムのエンゲージメントで世界トップ10の動画のみ表示。世界10位に到達するとクラッシュに入ります。",
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
      inClashTop: "クラッシュ入り",
      trendingDuel: "🔥 熱い対決",
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
      signupToComment: "して動画にいいね、コメント、共有、報告。",
      reply: "返信",
      replyingTo: "返信先",
      viewReplies: "返信を表示 ({count})",
      hideReplies: "返信を非表示",
      commentLikes: "いいね",
      pinComment: "固定",
      unpinComment: "固定解除",
      pinned: "固定済み",
      addEmoji: "絵文字を追加",
      addSticker: "アニメステッカーを追加",
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
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      communityGuidelines: "コミュニティガイドライン",
      dmca: "DMCA",
      reportContent: "コンテンツを報告",
    },
    pages: {
      videosTitle: "すべての動画",
      videosSubtitle:
        "承認済みの全動画を新しい順に表示。各カードに世界ランクを表示。トップ10はクラッシュにも表示されます。",
      exclusivesTitle: "限定",
      exclusivesSubtitle: "認証済みクリエイターのクリップ。",
      communityTitle: "アニメコミュニティ",
      communitySubtitle: "クリエイターをフォローし、コメントしてグリッドを競おう。",
      communityBody:
        "コミュニティ機能は近日拡張予定です。動画カードからチャンネルを探索し、各クリップで会話に参加してください。",
      musicTitle: "ミュージック",
      musicSubtitle: "アニメOSTラジオとLofiビーツを流しながらサイト内を回れます。",
      musicBody: "下のプレイヤーを開始して、動画やコミュニティを見ながら聴き続けられます。",
      emptyVideos: "承認済みの動画はまだありません。",
      emptyExclusives: "認証済みクリエイターの限定クリップはまだありません。",
    },
    exclusives: {
      dailyHallBadge: "デイリー殿堂",
      dailyHallTitle: "デイリー殿堂",
      dailyHallSubtitle: "今日いちばんポイントを獲得したハンターが頂点に立ちます。",
      interactionKing: "今日の交流王",
      pointsToday: "pt 今日",
      noDailyLeader: "まだ今日の王者はいません。いいね、投稿、招待で王座を狙おう。",
      randomDuelBadge: "ランダム対決",
      randomDuelTitle: "ランダム対決",
      randomDuelDesc: "2本のクリップが突然マッチ。好きな方に投票しよう。",
      startRandomDuel: "ランダム対決を開始",
      randomDuelPageDesc: "強い方を選べ。投票がクラッシュ順位を動かします。",
      vs: "VS",
      watchAndVote: "視聴して投票",
      shuffleDuel: "別の対決",
      noDuelVideos: "対決に必要な承認済み動画がまだ足りません。",
      backToExclusives: "限定へ戻る",
      challengeClipButton: "この動画に挑戦",
      challengeClipModalTitle: "クイック挑戦",
      challengeClipModalDesc: "承認済みの自分の動画を選んで、この動画と対決しましょう。",
      pickYourClip: "自分の動画を選ぶ",
      startChallengeDuel: "対決を開始",
      creatingChallengeDuel: "対決を作成中...",
      loadingClips: "動画を読み込み中...",
      noClipsToChallenge: "挑戦するには、まず承認済みの動画をアップロードしてください。",
      loginToChallenge: "登録して動画に挑戦し、デュエルポイントを獲得しましょう。",
      challengeFailed: "対決を開始できませんでした。別の動画を選んでください。",
      challengeDuelBadge: "クイック挑戦",
      challengeDuelTitle: "クリップ対決",
      challengeDuelPageDesc: "2人のクリエイター、1つの舞台。いいねとコメントでより強い動画を決めよう。",
      clipChallengeExclusivesDesc:
        "承認済み動画の下に「この動画に挑戦」ボタンがあります。自分の動画を選んで即座に対決を開始できます。",
      browseVideosToChallenge: "挑戦できる動画を見る",
      clipChallengeSectionTitle: "挑戦できるクリップ",
      clipChallengeSectionDesc:
        "下の動画から「この動画に挑戦」を押して、承認済みの自分の動画で対決しましょう。",
      pointsWagerBadge: "ポイント賭け",
      pointsWagerTitle: "ポイント対決",
      pointsWagerDesc:
        "別のハンターを招待し、ポイントを賭けてクリップ対決。勝者が賞金ポットを獲得します。",
      startPointsWager: "ポイント挑戦を開始",
      creatingPointsWager: "挑戦を作成中...",
      pointsWagerModalTitle: "新しいポイント挑戦",
      pointsWagerModalDesc: "ユーザー名で相手を呼び出し、賭けポイントをロックしてクリップを選びます。",
      loginToPointsWager: "登録してポイントを賭け、他のハンターに挑戦しましょう。",
      yourBalance: "残高",
      inviteOpponent: "相手のユーザー名",
      wagerAmount: "賭けポイント",
      wagerPotPreview: "勝者ポット: {pot} pt",
      pointsWagerFailed: "ポイント挑戦を完了できませんでした。残高を確認してください。",
      incomingWagerInvites: "あなたへの招待",
      wagerInviteFrom: "{wager} pt の挑戦 — クリップで受け入れ",
      acceptWagerDuel: "受け入れて賭ける",
      acceptingWager: "受け入れ中...",
      yourOpenWagers: "あなたの公開中の挑戦",
      waitingOpponent: "待機中",
      activePointsDuels: "進行中のポイント対決",
      potLabel: "ポット {pot} pt",
      watchDuel: "対決を見る",
      waitingOpponentInvite: "{user} が同額を賭けて受け入れるのを待っています。",
      cancelWager: "キャンセルして返金",
      finalizeWager: "確定 — 勝者を決める",
      resolvingWager: "確定中...",
      wagerCompleted: "ポイント対決完了",
      wagerCancelled: "挑戦キャンセル",
      wagerWinnerPot: "勝者が {pot} pt のポットを獲得。",
      pointsWagerArenaDesc:
        "両方のクリップにいいねで投票。準備ができたらどちらかが確定 — いいねが多い方が {pot} pt を獲得。",
      searchingUsernames: "ハンターを検索中...",
      noUsernameSuggestions: "一致するハンターが見つかりません。",
    },
    radio: {
      badge: "24/7 配信",
      title: "アニメラジオ",
      subtitle: "Clash Animeから離れずに、アニメOP・OST・Lofiを聴けます。",
      keepListening: "動画、コミュニティ、プロフィールを見ながら再生を続けられます。",
      play: "再生",
      pause: "一時停止",
      mute: "ミュート",
      unmute: "ミュート解除",
      volume: "音量",
      nowPlaying: "再生中",
      liveBroadcast: "ライブ配信",
      liveOnAir: "オンエア",
      loading: "接続中...",
      stationOst: "アニメOST & OP",
      stationOstDesc: "24時間のアニメOP・サントラ。",
      stationLofi: "Lofi Anime Beats",
      stationLofiDesc: "作業・閲覧向けのチルなレトロビート。",
      pickStation: "ステーションを選ぶ",
      activeStation: "再生中",
      openFullPlayer: "ラジオを開く",
      streamError: "ストリームに接続できませんでした。しばらくして再試行してください。",
      poweredBy: "OST配信: LISTEN.moe / Lofi: Nightwave Plaza",
    },
    legal: {
      reportTitle: "コンテンツを報告",
      reportIntro: "著作権、再アップロード、スパムなどの違反を報告してください。",
      reportLoginRequired: "報告には登録が必要です。",
      reportLoginHint: "してコンテンツを報告。",
      reportSignupHint: "してコンテンツを報告。",
      reportVideoId: "動画IDまたはURL",
      reportVideoIdHint: "URLの動画IDを貼り付け（例: clashanime.com/video/abc-123）",
      reportReasonLabel: "理由",
      reportReasonCopyright: "著作権侵害",
      reportReasonReupload: "盗用 / 再アップロード",
      reportReasonSpam: "スパムまたは虐待",
      reportReasonOther: "その他",
      reportDetailsLabel: "詳細（任意）",
      reportDetailsOptionalLabel: "追加詳細（任意）",
      reportDetailsHint: "タイムスタンプ、チャンネル名、補足情報。",
      reportOriginalLinkLabel: "元ソースへのリンク（必須）",
      reportOriginalLinkHint: "https://youtube.com/watch?v=... または TikTok/Instagram のリンク",
      reportOriginalLinkHelp: "盗用・著作権報告では、元動画との比較のためリンクが必要です。",
      reportOriginalLinkRequired: "盗用または著作権報告には元ソースのリンクが必要です。",
      reportOriginalLinkInvalid: "有効な http/https リンクを入力してください。",
      reportSubmit: "報告を送信",
      reportSubmitting: "送信中...",
      reportSubmitted: "報告を送信しました。チームが確認します。",
      reportFailed: "報告を送信できませんでした。動画IDを確認してください。",
      reportVideoRequired: "動画IDを入力してください。",
      reportDmcaHint: "正式なDMCA通知はDMCAページをご覧ください。",
    },
    auth: {
      logIn: "ログイン",
      signUp: "新規登録",
      signOut: "ログアウト",
      confirmSignOut: "ログアウトしますか？",
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
      signupLegalBefore: "アカウント作成により、次に同意したものとみなされます：",
      signupLegalAnd: "および",
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
      verifiedBadge: "認証済みチャンネル",
      displayNameCooldown: "チャンネル名はあと {days} 日で変更できます。",
      displayNameCooldownDays: "チャンネル名は14日に1回だけ変更できます。",
    },
    points: {
      systemTitle: "バウンティハンター報酬",
      hunterRank: "ハンターランク",
      bountyRewardsTitle: "ランク報酬",
      bountyRewardsHint: "ハンターランクを上げて限定報酬を解放。",
      bountyUnlocked: "解放済み",
      bountyLocked: "未解放",
      bountyLogTitle: "最近の報酬獲得",
      bountyLogEmpty: "まだ報酬がありません。友達を招待するかコミュニティに投稿してください。",
      currentPositionTitle: "現在のランク",
      youAreHere: "現在地",
      globalRankPosition: "全 {total} ランク中 {current}",
      pointsInRank: "このランク {current} / {max} pt",
      readyToRankUp: "{rank} へ昇格可能！",
      levelSyncNote: "最新ポイントからランクを同期中です。",
      rank: "ランク",
      pointsLabel: "ポイント",
      totalPoints: "合計ポイント",
      nextLevel: "次のランク",
      pointsToNext: "次のランク {rank} まで {count} pt",
      maxLevelReached: "最高ランクに到達しました。",
      perksTitle: "ランク特典",
      howToEarn: "ポイントの獲得方法",
      referralTitle: "友達を招待",
      referralHint: "リンクを共有すると、訪問と登録の両方でポイントを獲得できます。",
      copyReferral: "リンクをコピー",
      linkCopied: "コピーしました",
      verificationTitle: "チャンネル認証",
      verificationHint: "手動認証をリクエストできます。Legendランクで自動認証されます。",
      verificationPlaceholder: "認証してほしい理由を入力...",
      requestVerification: "認証をリクエスト",
      verificationSubmitting: "送信中...",
      verificationSubmitted: "認証リクエストを送信しました。",
      alreadyVerified: "このチャンネルは認証済みです。",
      legendAutoVerify: "Legendランクで自動認証されます。",
      communitySubtitle: "コミュニティで投稿して、投稿ごとにポイントを獲得。",
      communityPostLabel: "投稿を書く",
      communityPostPlaceholder: "感想、クリップ、更新情報を共有...",
      communityPostReward: "投稿ごとに +50 pt",
      communityPostSubmit: "公開",
      communityPosting: "公開中...",
      communityPostSuccess: "投稿しました。+50 pt 獲得。",
      communitySignupHint: "して投稿を見たり、コメントしたり、交流できます。",
      communityLoading: "投稿を読み込み中...",
      communityEmpty: "まだ投稿がありません。最初の投稿者になりましょう。",
      levels: {
        rookie: "ルーキー",
        challenger: "チャレンジャー",
        elite: "エリート",
        legend: "レジェンド",
      },
      perks: {
        voteComment: "動画への投票とコメント",
        upload: "デュエルクリップのアップロード",
        doubleVote: "投票が2倍カウント（エリート）",
        legend: "レジェンドバッジとランキング優先",
      },
      earn: {
        referralClick: "招待リンクからのユニーク訪問",
        referralSignup: "招待リンク経由の新規登録",
        videoLike: "動画にいいね",
        videoUpload: "承認されたオリジナル動画のアップロード",
        communityPost: "コミュニティへの投稿",
        trendingBonus: "トレンドグリッド入り",
      },
      transactionReasons: {
        referral_click: "招待リンク訪問",
        referral_signup: "友達の新規登録",
        video_like: "動画いいね",
        video_upload: "承認済みアップロード",
        community_post: "コミュニティ投稿",
        trending_bonus: "トレンド報酬",
        video_duel_challenge: "クリップ挑戦デュエル",
        points_duel_stake: "ポイント対決の賭け",
        points_duel_win: "ポイント対決の勝利",
        points_duel_refund: "ポイント対決の返金",
      },
    },
    communityFeed: {
      postPublished: "投稿しました。",
      postLevelRequired:
        "コミュニティへの投稿はハンターランク A と S（5000pt以上）のみ可能です。投稿の閲覧とコメントはできます。",
      animeOnlyNotice: "コミュニティ投稿はアニメ関連のみ。政治・成人・無関係な内容は禁止です。",
      postPlaceholder: "決闘場は開いています.. アニメ世界の最高の瞬間を共有しよう！",
      addImage: "画像を追加",
      removeImage: "削除",
      invalidImage: "有効な画像ファイルを選択してください。",
      imageTooLarge: "画像は5MB以下にしてください。",
      uploadFailed: "画像をアップロードできませんでした。",
      policyCheckbox: "この投稿がアニメ関連のみであり、",
      policyCheckboxSuffix: "に同意します（必須）。",
      policyRequired: "投稿前にアニメ専用ポリシーへの同意が必要です。",
      deletePost: "削除",
      confirmDeletePost: "この投稿を完全に削除しますか？",
      confirmDeleteComment: "このコメントを削除しますか？",
      deleteComment: "削除",
      report: "報告",
      reportTitle: "コミュニティ投稿を報告",
      reportIntro: "アニメ中心で安全なコミュニティのためにご協力ください。",
      reportReasonLabel: "理由",
      reportReasonOffTopic: "アニメと無関係 / 話題外",
      reportReasonAdult: "成人向け・性的コンテンツ",
      reportReasonSpam: "スパム・詐欺",
      reportReasonHarassment: "嫌がらせ・ヘイト",
      reportReasonOther: "その他の違反",
      reportDetailsLabel: "詳細",
      reportDetailsHint: "ガイドライン違反の内容を説明...",
      reportSubmit: "報告を送信",
      reportSubmitting: "送信中...",
      reportSubmitted: "報告を受け付けました。",
      loginToReport: "で投稿を報告。",
      loginToComment: "コメントするにはサインインしてください。",
      commentsTitle: "コメント",
      commentsCountLabel: "件のコメント",
      backToCommunity: "コミュニティに戻る",
      postNotFound: "この投稿は利用できません。",
      loadingComments: "コメントを読み込み中...",
      noComments: "まだコメントはありません。",
      commentPlaceholder: "コメントを書く...",
      postComment: "コメント投稿",
      postingComment: "投稿中...",
      actionFailed: "保存できませんでした。",
      imagePostPreview: "コミュニティ画像投稿",
    },
    stickers: {
      loading: "ステッカーを読み込み中...",
      empty: "アニメステッカーはまだありません。",
      searchPlaceholder: "アニメやリアクションを検索...",
      searchResults: "{count} 件見つかりました",
      searchHint: "検索ですべての作品を探せます。",
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
      levelRequired: "Challengerランク（1000pt以上）でアップロードできます。",
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
      usersSubtitle: "ロール、停止、認証、チャンネル管理。",
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
      downloadVideo: "ダウンロード",
      delete: "削除",
      confirmDeleteVideo: "この動画を完全に削除しますか？",
      ban: "停止",
      unban: "停止解除",
      banned: "停止中",
      active: "有効",
      verified: "認証済み",
      verify: "認証する",
      unverify: "認証を解除",
      points: "ポイント",
      level: "レベル",
      verificationRequests: "認証リクエスト",
      approveVerification: "認証を承認",
      rejectVerification: "認証を却下",
      viewChannel: "チャンネルを見る",
      suspicionScore: "疑わしさスコア",
      globalRank: "世界ランク",
      inClashTop: "クラッシュ上位10",
      rejectionReason: "拒否理由",
      reportReason: "理由",
      reportedBy: "報告者",
      anonymous: "匿名",
      unknownVideo: "不明な動画",
      unknownCommunityPost: "不明な投稿",
      communityPostReport: "コミュニティ投稿の報告",
      videoReport: "動画の報告",
      openCommunityModeration: "コミュニティ審査を開く",
      communityTitle: "コミュニティ投稿",
      communitySubtitle: "フィード投稿の確認、プレビュー、削除。",
      noCommunityPosts: "コミュニティ投稿はまだありません。",
      confirmDeleteCommunityPost: "この投稿を削除しますか？",
      imageOnlyPost: "画像のみの投稿",
      stickersTitle: "アニメステッカー",
      stickersSubtitle: "投稿とコメント用のアニメGIF・ステッカーを管理します。",
      createPack: "パック作成",
      stickerPackSlug: "パックスラッグ",
      stickerPackNameEn: "パック名（英語）",
      stickerPackNameAr: "パック名（アラビア語）",
      stickerPackNameJa: "パック名（日本語）",
      uploadSticker: "ステッカーをアップロード",
      uploadStickerHint: "アニメ専用のGIF/WEBP/PNG（最大2MB）を使用してください。",
      stickerSlug: "ステッカースラッグ",
      stickerLabel: "ステッカーラベル",
      stickerFile: "ステッカーファイル",
      noStickerPacks: "ステッカーパックがありません。",
      noStickers: "このパックにステッカーがありません。",
      stickerCountLabel: "件",
      packCreated: "パックを作成しました。",
      stickerCreated: "ステッカーをアップロードしました。",
      confirmDeleteSticker: "このステッカーを完全に削除しますか？",
      stickerTooLarge: "ステッカーは2MB以下にしてください。",
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
      animeRadioSettings: "アニメラジオ",
      animeRadioEnabled: "アニメラジオを有効化",
      animeRadioEnabledDesc: "ミニプレイヤーを表示し、サイト全体で再生できます。",
      animeRadioAutoplay: "訪問時に自動再生",
      animeRadioAutoplayDesc: "サイトを開いたときに小音量でラジオを開始します。",
      animeRadioDefaultVolume: "デフォルト音量",
      autoApproveEnabled: "問題ないアップロードを自動承認",
      autoApproveEnabledDesc: "重複と疑わしさチェックを通過した投稿を承認します。",
      reviewNewCreators: "新規クリエイターを審査",
      reviewNewCreatorsDesc: "新規アカウントの最初の投稿を手動審査に回します。",
      rejectSuspiciousUploads: "疑わしいアップロードを拒否",
      rejectSuspiciousUploadsDesc: "YouTubeなどからの再アップロードをブロックします。",
      moderationLogTitle: "モデレーションログ",
      moderationLogSubtitle: "承認・拒否・削除・認証・停止の監査記録。",
      noModerationLog: "まだ記録がありません。",
      moderationActions: {
        approve: "承認",
        reject: "拒否",
        review: "審査待ちへ",
        delete: "削除",
        verify_channel: "チャンネル認証",
        unverify_channel: "認証解除",
        ban_user: "ユーザー停止",
        unban_user: "停止解除",
      },
      nav: {
        dashboard: "ダッシュボード",
        users: "登録者",
        videos: "動画",
        community: "コミュニティ",
        stickers: "ステッカー",
        reports: "報告",
        moderationLog: "モデレーションログ",
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
        activeHunters: "アクティブハンター",
        pendingVerifications: "認証リクエスト",
        communityPosts: "コミュニティ投稿",
        bountyEvents: "報酬イベント",
        clipChallenges: "クリップ挑戦デュエル",
        pointsWagerDuels: "ポイント賭け対決",
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
        animeRadioSettings: "アニメラジオ",
        animeRadioSettingsDesc: "自動再生、音量、ミニプレイヤーを管理します。",
        exclusivesFeatures: "限定アリーナ",
        exclusivesFeaturesDesc: "デイリー殿堂、クリップ挑戦、熱い対決、ランダムクラッシュ。",
        clipChallenges: "クリップ挑戦",
        clipChallengesDesc: "承認済み動画の下に挑戦ボタンが表示され、ユーザー同士が対決できます。",
        pointsWagerDuels: "ポイント賭けアリーナ",
        pointsWagerDuelsDesc: "ハンターがポイントを賭け、招待し、勝者がポットを獲得します。",
      },
      table: {
        user: "ユーザー",
        role: "ロール",
        videos: "動画",
        status: "状態",
        actions: "操作",
        views: "視聴",
        time: "日時",
        action: "操作内容",
        staff: "担当",
        video: "動画",
        target: "対象",
        statusChange: "状態変更",
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
      music: "راديو الأنمي",
      exclusives: "حصري",
      hunterSystem: "نظام صياد الجوائز",
      bountyRewards: "آخر مكافآت الجوائز",
      inviteFriends: "ادعُ أصدقاءك",
      channelSettings: "إعدادات القناة",
      myVideos: "فيديوهاتك",
      settings: "الإعدادات",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "أقوى ١٠ فيديوهات عالمياً حسب التفاعل الفوري. عند الوصول للمركز ١٠ يرتفع المقطع إلى النزالات.",
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
      inClashTop: "في النزالات",
      trendingDuel: "نزال مشتعل",
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
      signupToComment: "للإعجاب أو التعليق أو المشاركة أو الإبلاغ عن الفيديوهات.",
      reply: "رد",
      replyingTo: "الرد على",
      viewReplies: "عرض الردود ({count})",
      hideReplies: "إخفاء الردود",
      commentLikes: "إعجاب",
      pinComment: "تثبيت",
      unpinComment: "إلغاء التثبيت",
      pinned: "مثبّت",
      addEmoji: "إضافة إيموجي",
      addSticker: "إضافة ستيكر أنمي",
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
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      communityGuidelines: "إرشادات المجتمع",
      dmca: "DMCA",
      reportContent: "الإبلاغ عن محتوى",
    },
    pages: {
      videosTitle: "كل الفيديوهات",
      videosSubtitle:
        "كل الفيديوهات المعتمدة من الأحدث، مع رقم المركز العالمي. المركز ١–١٠ يظهر أيضاً في النزالات.",
      exclusivesTitle: "حصري",
      exclusivesSubtitle: "مقاطع من القنوات الموثّقة على ClashAnime.",
      communityTitle: "مجتمع الأنمي",
      communitySubtitle: "تابع المبدعين، علّق على النزالات، وتسلّق الشبكة معاً.",
      communityBody:
        "ميزات المجتمع قيد التوسع قريباً. استكشف القنوات من بطاقات الفيدio وشارك في النقاش على كل مقطع.",
      musicTitle: "الموسيقى",
      musicSubtitle: "راديو أنمي OST وإيقاعات Lofi أثناء تصفحك للموقع.",
      musicBody: "شغّل المشغّل أدناه واستمر بالاستماع أثناء مشاهدة الفيديوهات والمجتمع وقناتك.",
      emptyVideos: "لا توجد فيدioهات معتمدة بعد.",
      emptyExclusives: "لا توجد مقاطع حصرية من قنوات موثّقة بعد.",
    },
    exclusives: {
      dailyHallBadge: "لوحة الشرف اليومية",
      dailyHallTitle: "لوحة الشرف اليومية",
      dailyHallSubtitle: "من يجمع أكثر نقاط تفاعل اليوم يتصدر الساحة.",
      interactionKing: "ملك التفاعلات اليوم",
      pointsToday: "نقطة اليوم",
      noDailyLeader: "لا بطل اليوم بعد. تفاعل، انشر، وادعُ أصدقاءك لتتوج.",
      randomDuelBadge: "نزال عشوائي",
      randomDuelTitle: "التحدي العشوائي",
      randomDuelDesc: "انتقل فوراً لمواجهة بين فيديوين مختارين عشوائياً وصوّت لأقوى مقطع.",
      startRandomDuel: "ابدأ النزال العشوائي",
      randomDuelPageDesc: "اختر المقطع الأقوى — صوتك يحرّك النزال العالمي فوراً.",
      vs: "VS",
      watchAndVote: "شاهد وصوّت",
      shuffleDuel: "نزال آخر",
      noDuelVideos: "لا توجد فيديوهات كافية لبدء نزال بعد.",
      backToExclusives: "العودة إلى حصري",
      challengeClipButton: "تحدي هذا المقطع",
      challengeClipModalTitle: "التحدي السريع",
      challengeClipModalDesc: "اختر أحد مقاطعك المعتمدة لينافس هذا المقطع وجهاً لوجه.",
      pickYourClip: "اختر مقطعك",
      startChallengeDuel: "ابدأ النزال",
      creatingChallengeDuel: "جارٍ إنشاء النزال...",
      loadingClips: "جارٍ تحميل مقاطعك...",
      noClipsToChallenge: "ارفع مقطعاً معتمداً أولاً لتتمكن من تحدي الآخرين.",
      loginToChallenge: "سجّل للانضمام وتحدي المقاطع واكسب نقاط النزال.",
      challengeFailed: "تعذّر بدء النزال. جرّب مقطعاً آخر.",
      challengeDuelBadge: "التحدي السريع",
      challengeDuelTitle: "نزال المقطع",
      challengeDuelPageDesc: "منشئان و ساحة واحدة. صوّت بالإعجاب والتعليقات لتتوّج بالمقطع الأقوى.",
      clipChallengeExclusivesDesc:
        "ستجد زر «تحدي هذا المقطع» تحت أي فيديو معتمد. اختر مقطعك وابدأ نزالاً فورياً وجهاً لوجه.",
      browseVideosToChallenge: "تصفّح المقاطع للتحدي",
      clipChallengeSectionTitle: "مقاطع جاهزة للتحدي",
      clipChallengeSectionDesc:
        "اضغط «تحدي هذا المقطع» تحت أي فيديو أدناه ونافسه بأحد مقاطعك المعتمدة.",
      pointsWagerBadge: "تحدي النقاط",
      pointsWagerTitle: "تحدي مقابل نقاط",
      pointsWagerDesc:
        "ادعُ صياداً آخر، راهن بنقاطك، ونافسه مقطعاً مقابل مقطع. الفائز يأخذ الجائزة كاملة.",
      startPointsWager: "افتح تحدي نقاط",
      creatingPointsWager: "جارٍ إنشاء التحدي...",
      pointsWagerModalTitle: "تحدي نقاط جديد",
      pointsWagerModalDesc: "استدعِ صياداً باسم المستخدم، ثبّت رهانك، واختر المقطع الذي تدافع عنه.",
      loginToPointsWager: "سجّل لتراهن بنقاطك وتتحدى الصيادين.",
      yourBalance: "رصيدك",
      inviteOpponent: "اسم المستخدم للخصم",
      wagerAmount: "الرهان (نقاط)",
      wagerPotPreview: "جائزة الفائز: {pot} نقطة",
      pointsWagerFailed: "تعذّر إكمال تحدي النقاط. تحقق من رصيدك وحاول مجدداً.",
      incomingWagerInvites: "دعوات بانتظارك",
      wagerInviteFrom: "تحدي بـ {wager} نقطة — اقبل بمقطعك",
      acceptWagerDuel: "اقبل واراهن",
      acceptingWager: "جارٍ القبول...",
      yourOpenWagers: "تحدياتك المفتوحة",
      waitingOpponent: "بانتظار الخصم",
      activePointsDuels: "نزالات نقاط مباشرة",
      potLabel: "جائزة {pot} نقطة",
      watchDuel: "شاهد النزال",
      waitingOpponentInvite: "بانتظار {user} لقبول التحدي ومطابقة رهانك.",
      cancelWager: "إلغاء واسترداد",
      finalizeWager: "إنهاء — تتويج الفائز",
      resolvingWager: "جارٍ الإنهاء...",
      wagerCompleted: "اكتمل تحدي النقاط",
      wagerCancelled: "تم إلغاء التحدي",
      wagerWinnerPot: "الفائز أخذ جائزة {pot} نقطة.",
      pointsWagerArenaDesc:
        "صوّت بالإعجاب على المقطعين. عند الجاهزية، أي طرف ينهي النزال — الأكثر إعجاباً يفوز بـ {pot} نقطة.",
      searchingUsernames: "جارٍ البحث عن الصيادين...",
      noUsernameSuggestions: "لم يُعثر على صياد مطابق.",
    },
    radio: {
      badge: "بث مباشر 24/7",
      title: "راديو الأنمي",
      subtitle: "استمع إلى موسيقى الأنمي وOST وإيقاعات Lofi دون مغادرة Clash Anime.",
      keepListening: "استمر بالاستماع أثناء تصفح الفيديوهات والمجتمع وملفك الشخصي.",
      play: "تشغيل الراديو",
      pause: "إيقاف مؤقت",
      mute: "كتم",
      unmute: "إلغاء الكتم",
      volume: "الصوت",
      nowPlaying: "يُشغَّل الآن",
      liveBroadcast: "بث مباشر",
      liveOnAir: "على الهواء",
      loading: "جارٍ الاتصال...",
      stationOst: "OST وافتتاحيات الأنمي",
      stationOstDesc: "افتتاحيات وموسيقى أنمي على مدار الساعة.",
      stationLofi: "Lofi Anime Beats",
      stationLofiDesc: "إيقاعات هادئة للدراسة والتصفح والمونتاج.",
      pickStation: "اختر المحطة",
      activeStation: "مباشر",
      openFullPlayer: "فتح الراديو",
      streamError: "تعذّر الاتصال بالبث. حاول مرة أخرى بعد قليل.",
      poweredBy: "بث OST من LISTEN.moe · إيقاعات Lofi من Nightwave Plaza.",
    },
    legal: {
      reportTitle: "الإبلاغ عن محتوى",
      reportIntro:
        "أبلغ عن انتهاك حقوق النشر، أو إعادة رفع مسروق، أو spam، أو مخالفات أخرى. البلاغات تُراجع في لوحة التحكم.",
      reportLoginRequired: "أنشئ حساباً لإرسال بلاغ.",
      reportLoginHint: "لإرسال بلاغ عن محتوى.",
      reportSignupHint: "لإرسال بلاغ عن محتوى.",
      reportVideoId: "معرّف الفيديو أو الرابط",
      reportVideoIdHint: "الصق معرّف الفيديو من الرابط (مثال: clashanime.com/video/abc-123)",
      reportReasonLabel: "السبب",
      reportReasonCopyright: "انتهاك حقوق النشر",
      reportReasonReupload: "مسروق / إعادة رفع",
      reportReasonSpam: "spam أو إساءة",
      reportReasonOther: "أخرى",
      reportDetailsLabel: "تفاصيل (اختياري)",
      reportDetailsOptionalLabel: "تفاصيل إضافية (اختياري)",
      reportDetailsHint: "توقيت، اسم القناة، أو أي سياق إضافي.",
      reportOriginalLinkLabel: "رابط المصدر الأصلي (مطلوب)",
      reportOriginalLinkHint: "https://youtube.com/watch?v=... أو رابط TikTok/Instagram",
      reportOriginalLinkHelp:
        "مطلوب عند الإبلاغ عن محتوى مسروق أو انتهاك حقوق النشر لمقارنة الفيديو الأصلي.",
      reportOriginalLinkRequired: "أدخل رابط المصدر الأصلي للبلاغات عن سرقة أو حقوق النشر.",
      reportOriginalLinkInvalid: "أدخل رابطاً صالحاً يبدأ بـ http أو https.",
      reportSubmit: "إرسال البلاغ",
      reportSubmitting: "جارٍ الإرسال...",
      reportSubmitted: "تم إرسال البلاغ. سيراجعه فريقنا.",
      reportFailed: "تعذّر إرسال البلاغ. تحقق من معرّف الفيديو وحاول مجدداً.",
      reportVideoRequired: "أدخل معرّف الفيديو.",
      reportDmcaHint: "لإشعارات DMCA الرسمية، راجع صفحة DMCA.",
    },
    auth: {
      logIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      confirmSignOut: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
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
      signupLegalBefore: "بإنشاء حساب، فإنك توافق على",
      signupLegalAnd: "و",
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
      verifiedBadge: "قناة موثّقة",
      displayNameCooldown: "يمكنك تغيير اسم القناة بعد {days} يوماً.",
      displayNameCooldownDays: "يمكن تغيير اسم القناة مرة واحدة كل 14 يوماً فقط.",
    },
    points: {
      systemTitle: "نظام صياد الجوائز",
      hunterRank: "رتبة الصياد",
      bountyRewardsTitle: "جوائز الرتب",
      bountyRewardsHint: "افتح مكافآت حصرية كلما ارتفعت في رتب الصياد.",
      bountyUnlocked: "مفتوحة",
      bountyLocked: "مقفلة",
      bountyLogTitle: "آخر مكافآت الجوائز",
      bountyLogEmpty: "لا توجد مكافآت بعد. ادعُ أصدقاءك أو انشر في المجتمع.",
      currentPositionTitle: "مركزك الحالي",
      youAreHere: "أنت هنا",
      globalRankPosition: "الرتبة {current} من {total}",
      pointsInRank: "{current} / {max} نقطة في هذه الرتبة",
      readyToRankUp: "جاهز للترقية إلى {rank}!",
      levelSyncNote: "يتم مزامنة رتبتك من أحدث نقاطك.",
      rank: "الرتبة",
      pointsLabel: "نقطة",
      totalPoints: "إجمالي النقاط",
      nextLevel: "الرتبة التالية",
      pointsToNext: "{count} نقطة للوصول إلى {rank}",
      maxLevelReached: "وصلت إلى أعلى رتبة.",
      perksTitle: "مزايا الرتبة",
      howToEarn: "كيف تكسب النقاط",
      referralTitle: "ادعُ أصدقاءك",
      referralHint: "شارك رابطك. تكسب نقاطاً عند كل زيارة وعند تسجيل صديق.",
      copyReferral: "نسخ الرابط",
      linkCopied: "تم نسخ الرابط",
      verificationTitle: "توثيق القناة",
      verificationHint: "اطلب توثيقاً يدوياً لقناتك. رتبة Legend تمنح توثيقاً تلقائياً.",
      verificationPlaceholder: "اشرح لماذا تستحق توثيق قناتك...",
      requestVerification: "طلب التوثيق",
      verificationSubmitting: "جارٍ الإرسال...",
      verificationSubmitted: "تم إرسال طلب التوثيق إلى فريق الإدارة.",
      alreadyVerified: "قناتك موثّقة.",
      legendAutoVerify: "رتبة Legend تمنح توثيقاً تلقائياً.",
      communitySubtitle: "انشر في المجتمع واكسب نقاطاً على كل منشور.",
      communityPostLabel: "اكتب منشوراً",
      communityPostPlaceholder: "شارك أفكارك أو مقاطعك أو تحديثاتك...",
      communityPostReward: "+50 نقطة لكل منشور",
      communityPostSubmit: "نشر",
      communityPosting: "جارٍ النشر...",
      communityPostSuccess: "تم النشر. +50 نقطة.",
      communitySignupHint: "لمشاهدة المنشورات والتعليق والتفاعل في المجتمع.",
      communityLoading: "جارٍ تحميل منشورات المجتمع...",
      communityEmpty: "لا توجد منشورات بعد. كن أول من ينشر.",
      levels: {
        rookie: "مبتدئ",
        challenger: "منافس",
        elite: "نخبة",
        legend: "أسطورة",
      },
      perks: {
        voteComment: "التصويت والتعليق على الفيديوهات",
        upload: "رفع مقاطع النزال",
        doubleVote: "صوت بقيمة مضاعفة (نخبة)",
        legend: "شارة أسطورة وأولوية في الترتيب",
      },
      earn: {
        referralClick: "زيارة فريدة من رابط دعوتك",
        referralSignup: "تسجيل صديق عبر رابطك",
        videoLike: "الإعجاب بفيديو",
        videoUpload: "رفع مقطع أصلي معتمد",
        communityPost: "نشر في صفحة المجتمع",
        trendingBonus: "وصول مقطعك إلى شبكة الترند",
      },
      transactionReasons: {
        referral_click: "زيارة رابط الدعوة",
        referral_signup: "تسجيل صديق",
        video_like: "إعجاب بفيديو",
        video_upload: "رفع معتمد",
        community_post: "منشور مجتمع",
        trending_bonus: "جائزة الترند",
        video_duel_challenge: "نزال تحدي مقطع",
        points_duel_stake: "رهان نزال نقاط",
        points_duel_win: "فوز نزال نقاط",
        points_duel_refund: "استرداد نزال نقاط",
      },
    },
    communityFeed: {
      postPublished: "تم النشر.",
      postLevelRequired:
        "الساحة حصرية لأبطال الرتبة A و S فقط. استمر في التفاعل والمشاركة لتُثبت جدارتك وتنضم للنخبة!",
      animeOnlyNotice: "منشورات المجتمع يجب أن تكون مرتبطة بالأنمي فقط. يُمنع المحتوى السياسي أو الإباحي أو خارج الموضوع.",
      postPlaceholder: "ساحة النزال مفتوحة.. شاركنا لحظتك المفضلة في عالم الأنمي!",
      addImage: "إضافة صورة",
      removeImage: "إزالة",
      invalidImage: "اختر ملف صورة صالحاً.",
      imageTooLarge: "يجب ألا تتجاوز الصورة 5 ميغابايت.",
      uploadFailed: "تعذّر رفع الصورة. حاول مرة أخرى.",
      policyCheckbox: "أؤكد أن هذا المنشور مرتبط بالأنمي فقط ويلتزم",
      policyCheckboxSuffix: "(إلزامي).",
      policyRequired: "يجب قبول سياسة الأنمي فقط قبل النشر.",
      deletePost: "حذف",
      confirmDeletePost: "حذف هذا المنشور نهائياً؟",
      confirmDeleteComment: "حذف هذا التعليق؟",
      deleteComment: "حذف",
      report: "إبلاغ",
      reportTitle: "الإبلاغ عن منشور",
      reportIntro: "ساعدنا في إبقاء المجتمع مركزاً على الأنمي وآمناً.",
      reportReasonLabel: "السبب",
      reportReasonOffTopic: "خارج موضوع الأنمي",
      reportReasonAdult: "محتوى إباحي أو جنسي",
      reportReasonSpam: "سبام أو احتيال",
      reportReasonHarassment: "تحرش أو كراهية",
      reportReasonOther: "مخالفة أخرى",
      reportDetailsLabel: "التفاصيل",
      reportDetailsHint: "اشرح ما يخالف إرشادات المجتمع...",
      reportSubmit: "إرسال البلاغ",
      reportSubmitting: "جارٍ الإرسال...",
      reportSubmitted: "تم إرسال البلاغ. سيقوم فريقنا بمراجعته.",
      loginToReport: "للإبلاغ عن المنشورات.",
      loginToComment: "سجّل الدخول للتعليق على منشورات المجتمع.",
      commentsTitle: "التعليقات",
      commentsCountLabel: "تعليق",
      backToCommunity: "العودة إلى المجتمع",
      postNotFound: "هذا المنشور لم يعد متاحاً.",
      loadingComments: "جارٍ تحميل التعليقات...",
      noComments: "لا توجد تعليقات بعد.",
      commentPlaceholder: "اكتب تعليقاً...",
      postComment: "نشر التعليق",
      postingComment: "جارٍ النشر...",
      actionFailed: "تعذّر الحفظ. حاول مرة أخرى.",
      imagePostPreview: "منشور صورة في المجتمع",
    },
    stickers: {
      loading: "جارٍ تحميل الستيكرات...",
      empty: "لا توجد ستيكرات أنمي بعد.",
      searchPlaceholder: "ابحث عن أنمي أو رد فعل...",
      searchResults: "تم العثور على {count} ستيكر",
      searchHint: "استخدم البحث للتنقل بين كل الأنمي.",
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
      levelRequired: "تحتاج رتبة منافس (1000+ نقطة) لرفع الفيديوهات.",
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
      usersSubtitle: "إدارة الأدوار والحظر والتوثيق والقنوات.",
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
      downloadVideo: "تنزيل",
      delete: "حذف",
      confirmDeleteVideo: "حذف هذا الفيديو نهائياً؟",
      ban: "حظر",
      unban: "إلغاء الحظر",
      banned: "محظور",
      active: "نشط",
      verified: "موثّق",
      verify: "توثيق",
      unverify: "إلغاء التوثيق",
      points: "النقاط",
      level: "المستوى",
      verificationRequests: "طلبات التوثيق",
      approveVerification: "قبول التوثيق",
      rejectVerification: "رفض التوثيق",
      viewChannel: "عرض القناة",
      suspicionScore: "درجة الاشتباه",
      globalRank: "المركز العالمي",
      inClashTop: "في النزالات (أفضل 10)",
      rejectionReason: "سبب الرفض",
      reportReason: "السبب",
      reportedBy: "بلّغ بواسطة",
      anonymous: "مجهول",
      unknownVideo: "فيديو غير معروف",
      unknownCommunityPost: "منشور غير معروف",
      communityPostReport: "بلاغ منشور مجتمع",
      videoReport: "بلاغ فيديو",
      openCommunityModeration: "فتح إدارة المجتمع",
      communityTitle: "منشورات المجتمع",
      communitySubtitle: "مراجعة أو معاينة أو حذف منشورات المجتمع.",
      noCommunityPosts: "لا توجد منشورات بعد.",
      confirmDeleteCommunityPost: "حذف هذا المنشور؟",
      imageOnlyPost: "منشور صورة فقط",
      stickersTitle: "ستيكرات الأنمي",
      stickersSubtitle: "ارفع GIF وستيكرات أنمي معتمدة للمنشورات والتعليقات.",
      createPack: "إنشاء حزمة",
      stickerPackSlug: "معرّف الحزمة",
      stickerPackNameEn: "اسم الحزمة (إنجليزي)",
      stickerPackNameAr: "اسم الحزمة (عربي)",
      stickerPackNameJa: "اسم الحزمة (ياباني)",
      uploadSticker: "رفع ستيكر",
      uploadStickerHint: "استخدم ملفات GIF أو WEBP أو PNG للأنمي فقط (حتى 2 ميغابايت).",
      stickerSlug: "معرّف الستيكر",
      stickerLabel: "اسم الستيكر",
      stickerFile: "ملف الستيكر",
      noStickerPacks: "لا توجد حزم ستيكرات بعد.",
      noStickers: "لا توجد ستيكرات في هذه الحزمة.",
      stickerCountLabel: "ستيكر",
      packCreated: "تم إنشاء الحزمة.",
      stickerCreated: "تم رفع الستيكر.",
      confirmDeleteSticker: "حذف هذا الستيكر نهائياً؟",
      stickerTooLarge: "يجب ألا يتجاوز الستيكر 2 ميغابايت.",
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
      animeRadioSettings: "راديو الأنمي",
      animeRadioEnabled: "تفعيل راديو الأنمي",
      animeRadioEnabledDesc: "يعرض الشريط السفلي ويسمح بالبث في جميع صفحات الموقع.",
      animeRadioAutoplay: "تشغيل تلقائي عند الزيارة",
      animeRadioAutoplayDesc: "يبدأ الراديو بصوت خفيف عند فتح الموقع.",
      animeRadioDefaultVolume: "مستوى الصوت الافتراضي",
      autoApproveEnabled: "قبول تلقائي للرفعات النظيفة",
      autoApproveEnabledDesc: "قبول المقاطع التي تجتاز فحص التكرار والاشتباه.",
      reviewNewCreators: "مراجعة المبدعين الجدد",
      reviewNewCreatorsDesc: "إبقاء أول رفع لكل حساب جديد قيد المراجعة.",
      rejectSuspiciousUploads: "رفض الرفعات المشبوهة",
      rejectSuspiciousUploadsDesc: "حظر إعادة رفع المحتوى من YouTube ومنصات أخرى.",
      moderationLogTitle: "سجل المراجعة",
      moderationLogSubtitle: "سجل قرارات الموافقة والرفض والحذف والتوثيق والحظر.",
      noModerationLog: "لا توجد قرارات مسجّلة بعد.",
      moderationActions: {
        approve: "موافقة",
        reject: "رفض",
        review: "إرسال للمراجعة",
        delete: "حذف",
        verify_channel: "توثيق القناة",
        unverify_channel: "إلغاء التوثيق",
        ban_user: "حظر مستخدم",
        unban_user: "إلغاء الحظر",
      },
      nav: {
        dashboard: "لوحة المعلومات",
        users: "المشتركون",
        videos: "الفيديوهات",
        community: "المجتمع",
        stickers: "الستيكرات",
        reports: "البلاغات",
        moderationLog: "سجل المراجعة",
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
        activeHunters: "صيادون نشطون",
        pendingVerifications: "طلبات التوثيق",
        communityPosts: "منشورات المجتمع",
        bountyEvents: "أحداث الجوائز",
        clipChallenges: "نزالات تحدي المقاطع",
        pointsWagerDuels: "نزالات رهان النقاط",
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
        animeRadioSettings: "راديو الأنمي",
        animeRadioSettingsDesc: "التحكم بالتشغيل التلقائي والصوت والشريط السفلي.",
        exclusivesFeatures: "ساحة حصري",
        exclusivesFeaturesDesc: "لوحة الشرف اليومية، تحدي المقاطع، نزالات مشتعلة، وتحدي عشوائي.",
        clipChallenges: "تحدي المقاطع",
        clipChallengesDesc: "زر «تحدي هذا المقطع» يظهر تحت كل فيديو معتمد ويُنشئ نزالات تلقائياً بين المستخدمين.",
        pointsWagerDuels: "ساحة رهان النقاط",
        pointsWagerDuelsDesc: "الصيادون يراهنون بنقاطهم ويدعون منافسين — الفائز يأخذ الجائزة في صفحة حصري.",
      },
      table: {
        user: "المستخدم",
        role: "الدور",
        videos: "الفيديوهات",
        status: "الحالة",
        actions: "إجراءات",
        views: "المشاهدات",
        time: "الوقت",
        action: "الإجراء",
        staff: "الموظف",
        video: "الفيديو",
        target: "الهدف",
        statusChange: "تغيير الحالة",
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
