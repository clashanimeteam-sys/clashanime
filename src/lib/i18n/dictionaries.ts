import type { Locale } from "@/lib/types";

export type Dictionary = {
  brand: {
    name: string;
    tagline: string;
  };
  common: {
    back: string;
    backToHome: string;
    pageNotFoundTitle: string;
    pageNotFoundBadge: string;
    pageNotFoundDesc: string;
    unexpectedErrorTitle: string;
    unexpectedErrorDesc: string;
    tryAgain: string;
  };
  nav: {
    clash: string;
    videos: string;
    community: string;
    music: string;
    exclusives: string;
    animeTracker: string;
    hunterSystem: string;
    bountyRewards: string;
    inviteFriends: string;
    channelSettings: string;
    channel: string;
    myVideos: string;
    settings: string;
    clashWallet: string;
    clashCoins: string;
    mobileBottomNav: string;
    more: string;
  };
  home: {
    titlePrimary: string;
    titleSecondary: string;
    subtitle: string;
    liveClashCounterTitle: string;
    liveClashCounter: string;
    gridLabel: string;
    clashLive: string;
    podiumLabel: string;
    challengersLabel: string;
    cashPrizeTitle: string;
    cashPrizeSubtitle: string;
    cashPrizeRank1: string;
    cashPrizeRank2: string;
    cashPrizeRank3: string;
    cashPrizeRankNumber: string;
    cashPrizeRankWord: string;
    cashPrizeRankSuffix: string;
    cashPrizeRevealLabel: string;
    cashPrizeRevealHint: string;
    cashPrizeTapHint: string;
    clashCoinsTitle: string;
    clashCoinsSubtitle: string;
    clashCoinsExchange: string;
    clashCoinsMinPayout: string;
    clashCoinsOpenWallet: string;
    seasonCountdownLabel: string;
    seasonDays: string;
    seasonHours: string;
    seasonMinutes: string;
    seasonSeconds: string;
    seasonEnded: string;
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
    previousInFeed: string;
    nextInFeed: string;
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
  mobileApp: {
    menuTitle: string;
    menuSubtitle: string;
    closeMenu: string;
    preferences: string;
    brandTitle: string;
    brandWordClash: string;
    brandWordAnime: string;
    installTitle: string;
    installSubtitle: string;
    installAction: string;
    installDismiss: string;
    installIosSteps: string;
    installShare: string;
    pullToRefresh: string;
    pullToRefreshRelease: string;
    refreshing: string;
  };
  legalHub: {
    pageTitle: string;
    badge: string;
    subtitle: string;
    rulesIntro: string;
    contactIntro: string;
    viewAll: string;
  };
  footer: {
    tagline: string;
    discoverHeading: string;
    informationHeading: string;
    socialHeading: string;
    contact: string;
    copyright: string;
    about: string;
    privacy: string;
    cookies: string;
    disclaimer: string;
    eula: string;
    terms: string;
    communityGuidelines: string;
    dmca: string;
    reportContent: string;
    arenaGuide: string;
  };
  blog: {
    hubBadge: string;
    hubTitle: string;
    hubSubtitle: string;
    heroTagline: string;
    heroCarouselLabel: string;
    heroPrev: string;
    heroNext: string;
    heroGoToSlide: string;
    navHome: string;
    navAccount: string;
    backToGuide: string;
    published: string;
    minRead: string;
    relatedArticles: string;
    notFound: string;
    categories: {
      "user-guide": string;
      "radar-analysis": string;
      "winner-stories": string;
      "platform-updates": string;
      "earnings-prizes": string;
      faq: string;
    };
    categoryHint: {
      "user-guide": string;
      "radar-analysis": string;
      "winner-stories": string;
      "platform-updates": string;
      "earnings-prizes": string;
      faq: string;
    };
    animeNews: {
      hubTitle: string;
      hubSubtitle: string;
      sourceNote: string;
      badge: string;
      backToNews: string;
      sourceLabel: string;
      readOnCrunchyroll: string;
      latestHeading: string;
      topNewsHeading: string;
      relatedHeading: string;
      empty: string;
      viewAll: string;
      storyHeading: string;
      watchNowHeading: string;
      watchNowCta: string;
      openTracker: string;
      watchNowPageSubtitle: string;
      watchNowEmpty: string;
      openTrackerPage: string;
      backToWatchNow: string;
      watchNowStoryHeading: string;
      watchNowTrailerHeading: string;
      watchTrailer: string;
      hideTrailer: string;
      spotlightHeading: string;
      spotlightSubtitle: string;
      spotlightCategories: {
        legends: string;
        action: string;
        mystery: string;
        isekai: string;
        sports: string;
        romance: string;
        classics: string;
      };
    };
    seasonalGuide: {
      hubTitle: string;
      hubSubtitle: string;
      badge: string;
      sourceNote: string;
      readFullGuide: string;
      lineupHeading: string;
      lineupCount: string;
      categoryNew: string;
      categoryReturning: string;
      categoryContinuing: string;
      categoryComingSoon: string;
      comingSoon: string;
      weeklySimulcast: string;
      moreTitles: string;
      lineupLoading: string;
    };
  };
  pages: {
    videosTitle: string;
    videosSubtitle: string;
    exclusivesTitle: string;
    exclusivesSubtitle: string;
    animeTrackerTitle: string;
    animeTrackerSubtitle: string;
    communityTitle: string;
    communitySubtitle: string;
    communityBody: string;
    musicTitle: string;
    musicSubtitle: string;
    musicBody: string;
    emptyVideos: string;
    emptyExclusives: string;
    videosSearchPlaceholder: string;
    videosSearchResults: string;
    emptyVideoSearch: string;
  };
  videosPage: {
    shelfNew: string;
    shelfTrending: string;
    shelfLatestAnime: string;
    shelfComingSoon: string;
    shelfUserDuels: string;
    newBadge: string;
    comingSoonBadge: string;
    duelDefender: string;
    duelChallenger: string;
    duelVersus: string;
    watchDuel: string;
    searchResultsTitle: string;
    emptyDuels: string;
  };
  hashtag: {
    statsLine: string;
    emptyVideos: string;
    allTab: string;
  };
  animeTracker: {
    badge: string;
    todayTitle: string;
    upcomingTitle: string;
    activeClashesTitle: string;
    liveClashBadge: string;
    enterClash: string;
    clipCount: string;
    noToday: string;
    noUpcoming: string;
    episodeLabel: string;
    scheduledHint: string;
    backToTracker: string;
    clashSubtitle: string;
    uploadClip: string;
    matchTagsHint: string;
    copyHashtag: string;
    copyHashtagDone: string;
    leaderboardTitle: string;
    noClipsYet: string;
    bannerBadge: string;
    bannerTitle: string;
    jikanSource: string;
    storyTitle: string;
    trendingSpotlightTitle: string;
    trendingClashBadge: string;
    episodesTotalLabel: string;
    trendingSyncPending: string;
    scoreLabel: string;
    rankLabel: string;
    malLink: string;
    instantEpisodeBadge: string;
    instantEpisodeTitle: string;
    instantEpisodeSubtitle: string;
    instantEpisodeRewards: string;
    instantEpisodeCountdown: string;
    instantEpisodeHours: string;
    instantEpisodeMinutes: string;
    instantEpisodeSeconds: string;
    instantEpisodeCta: string;
    instantEpisodeEnded: string;
  };
  exclusives: {
    dailyHallBadge: string;
    dailyHallTitle: string;
    dailyHallSubtitle: string;
    interactionKing: string;
    pointsToday: string;
    noDailyLeader: string;
    hallOfLegendsBadge: string;
    hallOfLegendsTitle: string;
    hallOfLegendsSubtitle: string;
    noHallOfLegends: string;
    seasonWinnerRank: string;
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
    cannotChallengeOwnClip: string;
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
    pointsWagerInviteAlertTitle: string;
    pointsWagerInviteAlertBody: string;
    rejectWagerDuel: string;
    rejectingWager: string;
    viewWagerOnExclusives: string;
    pointsWagerAlertSoundHint: string;
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
    closePlayer: string;
    streamError: string;
    poweredBy: string;
  };
  lounge: {
    badge: string;
    title: string;
    subtitle: string;
    tabRadio: string;
    tabLounge: string;
    keepListening: string;
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    volume: string;
    nowPlaying: string;
    playing: string;
    communityPlaylist: string;
    pickTrack: string;
    previous: string;
    next: string;
    closePlayer: string;
    playlistTitle: string;
    emptyPlaylist: string;
    voteTrack: string;
    loginToVote: string;
    nowPlayingBadge: string;
    submitTitle: string;
    submitDesc: string;
    trackTitlePlaceholder: string;
    artistPlaceholder: string;
    animePlaceholder: string;
    youtubePlaceholder: string;
    coverPlaceholder: string;
    coverFromLibrary: string;
    coverOrLink: string;
    coverRemove: string;
    coverUploadFailed: string;
    submitButton: string;
    submitting: string;
    submitSuccess: string;
    loginToSubmit: string;
    errorTitleRequired: string;
    errorArtistRequired: string;
    errorYoutubeRequired: string;
    errorYoutubeInvalid: string;
    errorCoverInvalid: string;
    playbackError: string;
    audioOnlyBadge: string;
    backgroundListening: string;
    unlockAudio: string;
    audioSourceHint: string;
    playerLoading: string;
    mySubmissionsTitle: string;
    mySubmissionsDesc: string;
    mySubmissionsEmpty: string;
    mySubmissionsLoading: string;
    deleteTrack: string;
    deletingTrack: string;
    deleteTrackConfirm: string;
    deleteTrackSuccess: string;
    deleteTrackFailed: string;
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
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
  contact: {
    pageTitle: string;
    pageSubtitle: string;
    formTitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    whatsappLabel: string;
    whatsappPlaceholder: string;
    optional: string;
    required: string;
    submit: string;
    submitting: string;
    success: string;
    failed: string;
    emailInvalid: string;
    messageTooShort: string;
    supportCardTitle: string;
    supportCardDesc: string;
    responseTime: string;
    helpTitle: string;
    helpGlobal: string;
    helpWallet: string;
    helpAccount: string;
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
    signupCountryHint: string;
  };
  profile: {
    loading: string;
    loadFailed: string;
    retry: string;
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
    channelCommunity: string;
    channelAbout: string;
    channelStats: string;
    noChannelVideos: string;
    noChannelPosts: string;
    postNowToCommunity: string;
    viewCommunityPost: string;
    channelPreviewTitle: string;
    channelPreviewDesc: string;
    editChannelSettings: string;
    viewPublicChannel: string;
    channelAboutTab: string;
    channelMoreInfo: string;
    channelJoinedDate: string;
    channelFollowersStat: string;
    channelVideosStat: string;
    channelViewsStat: string;
    channelLifetimePointsStat: string;
    shareChannel: string;
    reportUser: string;
    reportUserHint: string;
    channelLinkCopied: string;
    channelShareFailed: string;
    profileCountry: string;
    profileSocialLink: string;
    profileSocialPlaceholder: string;
    profileSocialHint: string;
    profileSocialDetected: string;
    profileSocialSavedLinks: string;
    profileSocialRemove: string;
    socialPlatforms: {
      youtube: string;
      instagram: string;
      tiktok: string;
      twitter: string;
      website: string;
    };
    profileCountryRequired: string;
    completeProfileTitle: string;
    completeProfileDesc: string;
    manageChannel: string;
    verifiedBadge: string;
    displayNameCooldown: string;
    displayNameCooldownDays: string;
    username: string;
    usernameCooldown: string;
    usernameCooldownDays: string;
    usernameTaken: string;
    usernameInvalid: string;
    deleteAccountTitle: string;
    deleteAccountWarning: string;
    deleteAccountCheckbox: string;
    deleteAccountTypeWord: string;
    deleteAccountButton: string;
    deleteAccountDeleting: string;
    deleteAccountFailed: string;
    deleteAccountWordMismatch: string;
    deleteAccountConfirmRequired: string;
    editVideo: string;
    deleteVideo: string;
    saveVideo: string;
    savingVideo: string;
    deletingVideo: string;
    cancelEdit: string;
    confirmDeleteVideo: string;
    videoUpdated: string;
    videoDeleted: string;
    videoSaveFailed: string;
    videoDeleteFailed: string;
  };
  notifications: {
    bellLabel: string;
    title: string;
    subtitle: string;
    markAllRead: string;
    enableInApp: string;
    loading: string;
    disabledHint: string;
    empty: string;
    settingsLabel: string;
    settingsHint: string;
    mentionTitle: string;
    mentionPreviewCommunity: string;
    mentionPreviewComment: string;
    types: {
      follow: { label: string; title: string; body: string };
      new_video: { label: string; title: string; body: string };
      admin_video_review: { label: string; title: string; body: string };
      new_music: { label: string; title: string; body: string };
      community_post: { label: string; title: string; body: string; bodyWithPreview: string };
      video_duel: { label: string; title: string; body: string };
      points_duel: { label: string; title: string; body: string };
      points_duel_accepted: { label: string; title: string; body: string };
      season_start: { label: string; title: string; body: string };
      season_end: { label: string; title: string; body: string };
      anime_release_clash: { label: string; title: string; body: string };
      episode_clash_winner: { label: string; title: string; body: string };
      episode_clash_crowned: { label: string; title: string; body: string };
      video_like: { label: string; title: string; body: string; bodyWithTitle: string };
      video_comment: { label: string; title: string; body: string; bodyWithPreview: string };
      comment_reply: { label: string; title: string; body: string; bodyWithPreview: string };
      comment_like: { label: string; title: string; body: string };
      mention: { label: string };
      broadcast: { label: string };
      system: { label: string };
      referral_signup: { label: string; title: string; body: string };
      referral_welcome: { label: string; title: string; body: string };
      signup_welcome: { label: string; title: string; body: string };
      referral_milestone: { label: string; title: string; body: string };
      referral_tier_up: { label: string; title: string; body: string };
    };
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
    referralHintV2: string;
    referralSystemLabel: string;
    referralDoubleSidedTitle: string;
    referralStatsTitle: string;
    referralStatsTotal: string;
    referralStatsWeek: string;
    referralStatsVideoBonus: string;
    referralStatsBattleBonus: string;
    referralMilestoneTitle: string;
    referralMaxTier: string;
    referralCosmeticHint: string;
    referralFlashActive: string;
    referralLeaderboardTitle: string;
    referralLeaderboardWeek: string;
    referralLeaderboardAll: string;
    referralLeaderboardEmpty: string;
    referralLeaderboardInvites: string;
    referralTiers: {
      scout: string;
      recruit: string;
      leader: string;
    };
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
      referralSignupYou: string;
      referralSignupFriend: string;
      signupWelcome: string;
      referralFirstVideo: string;
      referralFirstBattle: string;
      videoLike: string;
      videoUpload: string;
      communityPost: string;
      trendingBonus: string;
    };
    transactionReasons: {
      referral_click: string;
      referral_signup: string;
      referral_welcome: string;
      signup_welcome: string;
      referral_first_video: string;
      referral_first_battle: string;
      video_like: string;
      video_upload: string;
      community_post: string;
      trending_bonus: string;
      video_duel_challenge: string;
      points_duel_stake: string;
      points_duel_win: string;
      points_duel_refund: string;
      clash_coin_conversion: string;
    };
  };
  wallet: {
    title: string;
    subtitle: string;
    description: string;
    balanceLabel: string;
    exchangeRateTitle: string;
    exchangeRateValue: string;
    minPayoutTitle: string;
    hunterPointsLabel: string;
    convertTitle: string;
    convertDesc: string;
    convertAmountLabel: string;
    convertPreview: string;
    convertButton: string;
    convertSuccess: string;
    convertFailed: string;
    convertMinError: string;
    withdrawTitle: string;
    withdrawDesc: string;
    withdrawAmountLabel: string;
    selectPaymentMethod: string;
    bankTransferTitle: string;
    bankTransferDesc: string;
    paypalTitle: string;
    paypalDesc: string;
    paypalEmailLabel: string;
    paypalEmailPlaceholder: string;
    usdtTitle: string;
    usdtDesc: string;
    usdtWalletLabel: string;
    usdtWalletPlaceholder: string;
    usdtNetworkLabel: string;
    ibanLabel: string;
    ibanPlaceholder: string;
    accountHolderLabel: string;
    accountHolderPlaceholder: string;
    recipientEmailLabel: string;
    recipientEmailPlaceholder: string;
    kycAcknowledgement: string;
    kycRequired: string;
    kycApprovalRequired: string;
    kycWithdrawLocked: string;
    kycTitle: string;
    kycDesc: string;
    kycFirstNameLabel: string;
    kycFirstNamePlaceholder: string;
    kycLastNameLabel: string;
    kycLastNamePlaceholder: string;
    kycCountryLabel: string;
    kycPhoneLabel: string;
    kycPhoneLocalPlaceholder: string;
    kycWhatsappTitle: string;
    kycWhatsappDesc: string;
    kycWhatsappNumberLabel: string;
    kycWhatsappPlaceholder: string;
    kycWhatsappHint: string;
    kycAddressLabel: string;
    kycAddressPlaceholder: string;
    kycIdLabel: string;
    kycIdHint: string;
    kycIdRequired: string;
    kycInvalidImage: string;
    kycImageTooLarge: string;
    kycSubmitButton: string;
    kycSubmitSuccess: string;
    kycSubmitFailed: string;
    kycLoading: string;
    kycPendingTitle: string;
    kycPendingDesc: string;
    kycApprovedTitle: string;
    kycApprovedDesc: string;
    kycRejectedTitle: string;
    kycRejectedDesc: string;
    withdrawButton: string;
    withdrawProcessingTime: string;
    withdrawFailed: string;
    withdrawMinError: string;
    withdrawPendingNotice: string;
    fraudBlocked: string;
    processing: string;
    paymentOptionsTitle: string;
    paymentMethodLabels: {
      bank_transfer: string;
      paypal: string;
      crypto_usdt: string;
    };
    historyTitle: string;
    loadingHistory: string;
    noHistory: string;
    legalNote: string;
    withdrawalStatuses: {
      pending: string;
      reviewing: string;
      completed: string;
      rejected: string;
      fraud_blocked: string;
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
    publishedLive: string;
    scanFailed: string;
    uploadFailed: string;
    r2UploadBlocked: string;
    uploadsDisabled: string;
    accountBanned: string;
    levelRequired: string;
    clashUploadTitle: string;
    clashUploadHint: string;
    backToClash: string;
    hashtagUsageCount: string;
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
    lifetimePoints: string;
    level: string;
    verificationRequests: string;
    approveVerification: string;
    rejectVerification: string;
    viewChannel: string;
    channelHasCover: string;
    channelHasBio: string;
    channelHasYoutube: string;
    channelHasInstagram: string;
    channelHasTiktok: string;
    channelHasTwitter: string;
    channelHasWebsite: string;
    suspicionScore: string;
    globalRank: string;
    clashRank: string;
    awaitingAdminReview: string;
    markReviewed: string;
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
    withdrawalsTitle: string;
    withdrawalsSubtitle: string;
    noWithdrawals: string;
    kycTitle: string;
    kycSubtitle: string;
    noKycSubmissions: string;
    approveKyc: string;
    rejectKyc: string;
    kycRejectNotesPrompt: string;
    kycStatuses: {
      pending: string;
      approved: string;
      rejected: string;
    };
    contactTitle: string;
    contactSubtitle: string;
    noContactMessages: string;
    contactReply: string;
    contactReplyPlaceholder: string;
    saveContactReply: string;
    markContactReplied: string;
    markContactClosed: string;
    sendContactReplyEmail: string;
    sendingContactReply: string;
    contactReplySent: string;
    contactReplyFailed: string;
    contactStatuses: {
      open: string;
      replied: string;
      closed: string;
    };
    emailsTitle: string;
    emailsSubtitle: string;
    noEmails: string;
    emailsFilterAll: string;
    emailStatuses: {
      pending: string;
      sent: string;
      failed: string;
    };
    emailsTable: {
      when: string;
      to: string;
      type: string;
      locale: string;
      status: string;
      user: string;
      actions: string;
    };
    emailRetry: string;
    emailRetrying: string;
    emailRetrySuccess: string;
    emailRetryFailed: string;
    accountDeletionsTitle: string;
    noAccountDeletions: string;
    accountDeletionsTable: {
      when: string;
      email: string;
      name: string;
      farewell: string;
    };
    inAppNotificationsTitle: string;
    inAppNotificationsFilterAll: string;
    noInAppNotifications: string;
    inAppNotificationsTable: {
      when: string;
      user: string;
      type: string;
      title: string;
      read: string;
    };
    broadcastTitle: string;
    broadcastSubtitle: string;
    broadcastComposeTitle: string;
    broadcastSubjectLabel: string;
    broadcastMessageLabel: string;
    broadcastPersonalizeHint: string;
    broadcastCtaLabel: string;
    broadcastCtaUrlLabel: string;
    broadcastConfirmCheckbox: string;
    broadcastSendButton: string;
    broadcastSending: string;
    broadcastUsersTitle: string;
    broadcastNoUsers: string;
    broadcastUsersTable: {
      email: string;
      name: string;
    };
    broadcastConfirm: string;
    broadcastSendSuccess: string;
    broadcastSendFailed: string;
    broadcastLoadFailed: string;
    broadcastHistoryTitle: string;
    broadcastNoHistory: string;
    broadcastHistoryTable: {
      when: string;
      subject: string;
      sent: string;
      failed: string;
      status: string;
    };
    approveWithdrawal: string;
    rejectWithdrawal: string;
    markReviewing: string;
    clashCoins: string;
    paymentMethod: string;
    paymentDestination: string;
    fraudFlags: string;
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
      withdrawals: string;
      kyc: string;
      seasons: string;
      legends: string;
      beatsLounge: string;
      animeTracker: string;
      blog: string;
      animeNews: string;
      contact: string;
      emails: string;
      referrals: string;
      broadcast: string;
    };
    referrals: {
      title: string;
      subtitle: string;
      totalSignups: string;
      weekSignups: string;
      activeFlash: string;
      flashEventsTitle: string;
      flashEventsEmpty: string;
      createFlashTitle: string;
      titleEn: string;
      titleAr: string;
      titleJa: string;
      multiplier: string;
      startsAt: string;
      endsAt: string;
      createButton: string;
      creating: string;
      created: string;
      deactivate: string;
      leaderboardTitle: string;
      periodWeek: string;
      periodAll: string;
      table: {
        title: string;
        multiplier: string;
        window: string;
        status: string;
        actions: string;
      };
    };
    seasons: {
      title: string;
      subtitle: string;
      activeNow: string;
      noActive: string;
      createTitle: string;
      quickStartTitle: string;
      quickStartDesc: string;
      listTitle: string;
      nameLabel: string;
      startsAtLabel: string;
      endsAtLabel: string;
      durationDaysLabel: string;
      activateOnCreate: string;
      createButton: string;
      startNewButton: string;
      editButton: string;
      activateButton: string;
      endButton: string;
      autoNamePlaceholder: string;
      editNamePrompt: string;
      editStartPrompt: string;
      editEndPrompt: string;
      empty: string;
      created: string;
      updated: string;
      activated: string;
      ended: string;
      startedNew: string;
      prizeSectionTitle: string;
      prizeRank1Label: string;
      prizeRank2Label: string;
      prizeRank3Label: string;
      prizeSaveButton: string;
      prizesSaved: string;
      statusLabels: {
        scheduled: string;
        active: string;
        ended: string;
      };
    };
    legends: {
      title: string;
      subtitle: string;
      statsArchived: string;
      statsEnded: string;
      statsWinners: string;
      seasonListTitle: string;
      openSeasons: string;
      emptySeasons: string;
      winnersCount: string;
      viewWinners: string;
      snapshotButton: string;
      resnapshotButton: string;
      winnersTitle: string;
      noWinners: string;
      deleteWinner: string;
      deleteConfirm: string;
      deleted: string;
      snapshotSuccess: string;
    };
    beatsLounge: {
      title: string;
      subtitle: string;
      pendingCount: string;
      approvedCount: string;
      totalVotes: string;
      addTrackTitle: string;
      titleLabel: string;
      artistLabel: string;
      animeLabel: string;
      youtubeLabel: string;
      sortLabel: string;
      addButton: string;
      queueTitle: string;
      empty: string;
      approveButton: string;
      rejectButton: string;
      deleteButton: string;
      deleteConfirm: string;
      created: string;
      approved: string;
      rejected: string;
    };
    animeTracker: {
      title: string;
      subtitle: string;
      todayCount: string;
      upcomingCount: string;
      activeClashes: string;
      syncButton: string;
      syncTrendingButton: string;
      syncing: string;
      syncSuccess: string;
      syncTrendingSuccess: string;
      syncFailed: string;
      syncTrendingFailed: string;
      trendingListTitle: string;
      lastAutoSyncLabel: string;
      autoSyncHint: string;
      addTitle: string;
      titleLabel: string;
      titleArLabel: string;
      titleJaLabel: string;
      synopsisEnLabel: string;
      synopsisArLabel: string;
      synopsisJaLabel: string;
      episodeLabel: string;
      posterLabel: string;
      tagsLabel: string;
      openClashNow: string;
      addButton: string;
      listTitle: string;
      empty: string;
      openClashButton: string;
      viewClash: string;
      deleteButton: string;
      deleteConfirm: string;
      created: string;
      clashOpened: string;
      seoTitle: string;
      seoAnimeCount: string;
      seoKeywordCount: string;
      instantEpisodeHint: string;
      instantEpisodeRewards: string;
      instantEpisodeActiveTitle: string;
      instantEpisodeHistoryTitle: string;
      clashClosesAt: string;
      clashWinner: string;
      clashNoWinner: string;
      clashEnded: string;
      clashStatusActive: string;
    };
    blog: {
      title: string;
      subtitle: string;
      staticNote: string;
      heroSlides: {
        title: string;
        subtitle: string;
        displayTitle: string;
        displaySubtitle: string;
        carouselEnabled: string;
        showTextOverlay: string;
        overlayOpacity: string;
        autoPlaySeconds: string;
        objectPosition: string;
        objectCenter: string;
        objectTop: string;
        objectBottom: string;
        objectLeft: string;
        objectRight: string;
        previewOnSite: string;
        save: string;
        saving: string;
        saved: string;
        loading: string;
        upload: string;
        uploading: string;
        uploaded: string;
        remove: string;
        enabled: string;
        emptySlot: string;
        slotLabel: string;
        slotsMeta: string;
      };
      articlesCount: string;
      category: string;
      published: string;
      readingTime: string;
      viewOnSite: string;
      openHub: string;
    };
    animeNews: {
      title: string;
      subtitle: string;
      syncNow: string;
      syncing: string;
      syncSuccess: string;
      featuredGuideSynced: string;
      featuredLineupSynced: string;
      spotlightSynced: string;
      featuredBadge: string;
      viewOnBlog: string;
      saved: string;
      saving: string;
      saveDraft: string;
      publish: string;
      edit: string;
      collapse: string;
      viewOnSite: string;
      sourceLink: string;
      openHub: string;
      loading: string;
      empty: string;
      meta: string;
      lastSync: string;
      needsTranslation: string;
      titlePlaceholder: string;
      excerptPlaceholder: string;
      storyPlaceholder: string;
      topics: string;
      lineupCount: string;
      lineupPreview: string;
      lineupMore: string;
    };
    hashtags: {
      title: string;
      subtitle: string;
      viewPage: string;
      empty: string;
    };
    videoOwnerEvents: {
      title: string;
      subtitle: string;
      empty: string;
      updated: string;
      deleted: string;
      viewVideo: string;
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
      pendingWagerInvites: string;
    pendingWithdrawals: string;
    pendingKyc: string;
    openContactMessages: string;
    welcomeEmailsSent: string;
    accountDeletions: string;
    inAppNotifications: string;
    legendWinners: string;
    referralSignups: string;
    referralWeekSignups: string;
  };
    platformHealth: {
      title: string;
      subtitle: string;
      adsense: string;
      databaseSchema: string;
      configured: string;
      missingEnv: string;
      active: string;
      inactive: string;
      checking: string;
      healthy: string;
      needsMigration: string;
      ok: string;
      actionNeeded: string;
      monetizationApi: string;
      schemaApi: string;
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
      reviewWithdrawals: string;
      reviewWithdrawalsDesc: string;
      reviewKyc: string;
      reviewKycDesc: string;
      reviewContact: string;
      reviewContactDesc: string;
    };
    table: {
      user: string;
      role: string;
      videos: string;
      communityPosts: string;
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
    common: {
      back: "Back",
      backToHome: "Back to home",
      pageNotFoundTitle: "Page not found",
      pageNotFoundBadge: "404",
      pageNotFoundDesc: "The page you are looking for does not exist or has been moved.",
      unexpectedErrorTitle: "Something went wrong",
      unexpectedErrorDesc: "An unexpected error occurred. Please try again or return to the home page.",
      tryAgain: "Try again",
    },
    nav: {
      clash: "Clash",
      videos: "Videos",
      community: "Community",
      music: "Anime Radio",
      exclusives: "Exclusives",
      animeTracker: "Anime Tracker",
      hunterSystem: "Bounty Hunter System",
      bountyRewards: "Latest bounty rewards",
      inviteFriends: "Invite friends",
      channelSettings: "Channel settings",
      channel: "Channel",
      myVideos: "Your videos",
      settings: "Settings",
      clashWallet: "ClashCoins wallet",
      clashCoins: "ClashCoins",
      mobileBottomNav: "Main navigation",
      more: "More",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "The top 12 videos worldwide by real-time engagement. Reach global rank #12 to enter Clash.",
      liveClashCounterTitle: "Live Clash Counter",
      liveClashCounter:
        "In the arena now: {battles} blazing battles.. {fighters} heroes fighting!",
      gridLabel: "Clash Anime grid",
      clashLive: "Live Clash",
      podiumLabel: "Podium",
      challengersLabel: "Clash challengers",
      cashPrizeTitle: "Cash prizes for Clash winners",
      cashPrizeSubtitle: "Top ranked clips earn real rewards every season.",
      cashPrizeRank1: "#1 Gold",
      cashPrizeRank2: "#2 Silver",
      cashPrizeRank3: "#3 Bronze",
      cashPrizeRankNumber: "Rank {rank}",
      cashPrizeRankWord: "Rank",
      cashPrizeRankSuffix: "",
      cashPrizeRevealLabel: "Rank {rank} prize",
      cashPrizeRevealHint: "Paid to the season winner after manual review.",
      cashPrizeTapHint: "Tap a rank to reveal the cash prize",
      clashCoinsTitle: "ClashCoins — your digital wallet",
      clashCoinsSubtitle: "Turn hunter points into redeemable ClashCoins and cash out like a digital asset.",
      clashCoinsExchange: "10,000 points = $10",
      clashCoinsMinPayout: "Minimum payout: $10.00",
      clashCoinsOpenWallet: "Open wallet",
      seasonCountdownLabel: "Season ends in",
      seasonDays: "Days",
      seasonHours: "Hours",
      seasonMinutes: "Min",
      seasonSeconds: "Sec",
      seasonEnded: "Season ended",
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
      previousInFeed: "Previous video",
      nextInFeed: "Next video",
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
    mobileApp: {
      menuTitle: "Explore Clash Anime",
      menuSubtitle: "All features in one place",
      closeMenu: "Close menu",
      preferences: "Language & theme",
      brandTitle: "Clash Anime",
      brandWordClash: "Clash",
      brandWordAnime: "Anime",
      installTitle: "Install Clash Anime",
      installSubtitle:
        "Add the app to your home screen for faster access and a full-screen experience.",
      installAction: "Install app",
      installDismiss: "Not now",
      installIosSteps:
        'Tap {share}, then choose "Add to Home Screen".',
      installShare: "Share",
      pullToRefresh: "Pull down to refresh",
      pullToRefreshRelease: "Release to refresh",
      refreshing: "Refreshing...",
    },
    legalHub: {
      pageTitle: "Information & Legal",
      badge: "Policies",
      subtitle: "Read our rules, privacy policies, and community guidelines in one place.",
      rulesIntro: "Terms, privacy, cookies, DMCA, and platform rules.",
      contactIntro: "Reach the team, report content, or browse the arena guide.",
      viewAll: "View all policies",
    },
    footer: {
      tagline: "Anime duels ranked by real-time community engagement.",
      discoverHeading: "Discover",
      informationHeading: "Information",
      socialHeading: "Social Media",
      contact: "Contact",
      copyright: "© 2026 Clash Anime. All rights reserved.",
      about: "About Us",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      disclaimer: "Disclaimer",
      eula: "End-User License Agreement",
      terms: "Terms of Use",
      communityGuidelines: "Community Guidelines",
      dmca: "Digital Millennium Copyright Act",
      reportContent: "Report Content",
      arenaGuide: "Heroes' Arena Guide",
    },
    blog: {
      hubBadge: "Knowledge hub",
      hubTitle: "Heroes' Arena Guide",
      hubSubtitle:
        "Guides, radar analysis, winner stories, platform updates, prizes, and FAQ — built to help you rank higher and earn on ClashAnime.",
      heroTagline: "Enter the arena. Raise your clash. Become the legend.",
      heroCarouselLabel: "Heroes Guide cover carousel",
      heroPrev: "Previous slide",
      heroNext: "Next slide",
      heroGoToSlide: "Go to slide {n}",
      navHome: "Home",
      navAccount: "Account",
      backToGuide: "Back to Arena Guide",
      published: "Published",
      minRead: "{minutes} min read",
      relatedArticles: "Related articles",
      notFound: "Article not found.",
      categories: {
        "user-guide": "User guide",
        "radar-analysis": "Radar analysis",
        "winner-stories": "Winner stories",
        "platform-updates": "Platform updates",
        "earnings-prizes": "Prizes & earnings",
        faq: "FAQ",
      },
      categoryHint: {
        "user-guide": "Learn clashes, uploads, invites, and hunter points.",
        "radar-analysis": "Trending anime and clip patterns from the Radar.",
        "winner-stories": "How Top 12 creators climb the arena.",
        "platform-updates": "New features like instant 24-hour episode clashes.",
        "earnings-prizes": "Points, ClashCoins, seasons, and payouts explained.",
        faq: "Global availability, KYC, taxes, and common questions.",
      },
      animeNews: {
        hubTitle: "Latest anime news",
        hubSubtitle:
          "Curated headlines from the anime world — rewritten for ClashAnime in English, Arabic, and Japanese.",
        sourceNote: "Headlines sourced from Crunchyroll News. Summaries are editorial on ClashAnime.",
        badge: "Anime news",
        backToNews: "Back to anime news",
        sourceLabel: "Original source",
        readOnCrunchyroll: "Read full story on Crunchyroll",
        latestHeading: "More latest anime news",
        topNewsHeading: "Top news",
        relatedHeading: "Related articles",
        empty: "No published anime news yet. Open Admin → Anime news and run Sync RSS now.",
        viewAll: "View all anime news",
        storyHeading: "Anime story",
        watchNowHeading: "Watch now",
        watchNowCta: "Start watching",
        openTracker: "View all watch now →",
        watchNowPageSubtitle:
          "Trailers, posters, and the full curated spotlight across legends, action, romance, and more.",
        watchNowEmpty: "The watch-now spotlight is loading. Check back shortly.",
        openTrackerPage: "Open anime tracker",
        backToWatchNow: "Back to watch now",
        watchNowStoryHeading: "Story",
        watchNowTrailerHeading: "Trailer",
        watchTrailer: "Watch trailer",
        hideTrailer: "Hide trailer",
        spotlightHeading: "Essential anime spotlight",
        spotlightSubtitle:
          "Legendary series, modern hits, and fan favorites — always updated with posters and trailers.",
        spotlightCategories: {
          legends: "Legends & long-running hits",
          action: "Action & new generation",
          mystery: "Mystery, mind games & thrillers",
          isekai: "Isekai & fantasy adventures",
          sports: "Sports anime",
          romance: "Romance, slice of life & drama",
          classics: "Classics & timeless masterpieces",
        },
      },
      seasonalGuide: {
        hubTitle: "Seasonal anime guide",
        hubSubtitle:
          "Full simulcast lineup and release calendar — curated from Crunchyroll's Summer 2026 seasonal guide.",
        badge: "Seasonal guide",
        sourceNote: "Crunchyroll Summer 2026 lineup",
        readFullGuide: "Read full seasonal guide",
        lineupHeading: "Full simulcast lineup",
        lineupCount: "{count} titles",
        categoryNew: "New premieres",
        categoryReturning: "Returning seasons",
        categoryContinuing: "Continuing from spring",
        categoryComingSoon: "Coming soon",
        comingSoon: "Coming soon",
        weeklySimulcast: "Weekly simulcast",
        moreTitles: "+{count} more titles in the full guide",
        lineupLoading: "Loading posters and anime stories from Jikan…",
      },
    },
    pages: {
      videosTitle: "All Videos",
      videosSubtitle:
        "Browse new uploads, trending clips, latest anime drops, coming soon, and live creator duels.",
      exclusivesTitle: "Exclusives",
      exclusivesSubtitle: "Clips from verified creators on ClashAnime.",
      animeTrackerTitle: "Anime Tracker",
      animeTrackerSubtitle:
        "Live schedule from Jikan (MyAnimeList). See what drops today and jump into release clashes for the best clips.",
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
      videosSearchPlaceholder: "Search anime...",
      videosSearchResults: "{count} videos found",
      emptyVideoSearch: 'No videos found for "{query}".',
    },
    videosPage: {
      shelfNew: "New uploads",
      shelfTrending: "Trending now",
      shelfLatestAnime: "Latest anime releases",
      shelfComingSoon: "Coming soon",
      shelfUserDuels: "Creator challenges",
      newBadge: "New",
      comingSoonBadge: "Soon",
      duelDefender: "Clip",
      duelChallenger: "You",
      duelVersus: "vs {title}",
      watchDuel: "Watch duel",
      searchResultsTitle: "Search results",
      emptyDuels: "No creator challenges yet. Challenge a clip from any video card.",
    },
    hashtag: {
      statsLine: "{videos} videos · {channels} channels",
      emptyVideos: 'No approved videos tagged "#{tag}" yet.',
      allTab: "All",
    },
    animeTracker: {
      badge: "New release radar",
      todayTitle: "Releasing today",
      upcomingTitle: "Coming soon",
      activeClashesTitle: "Live release clashes",
      liveClashBadge: "Release clash live",
      enterClash: "Enter clash",
      clipCount: "{count} clips competing",
      noToday: "No anime episodes scheduled for today yet. Sync AniList or add releases in admin.",
      noUpcoming: "No upcoming releases in the next 14 days.",
      episodeLabel: "Episode {episode}",
      scheduledHint: "A special clash opens automatically on release day.",
      backToTracker: "Back to Anime Tracker",
      clashSubtitle: "Upload clips tagged with this anime. You have 24 hours — highest engagement wins +2,000 points.",
      uploadClip: "Upload your clip",
      matchTagsHint: "Use hashtags like {tags} on your upload to join this clash.",
      copyHashtag: "Copy",
      copyHashtagDone: "Copied",
      leaderboardTitle: "Best clips right now",
      noClipsYet: "No clips yet. Be the first to drop a scene from this release.",
      bannerBadge: "Trending release",
      bannerTitle: "{title} just dropped — join the release clash",
      jikanSource: "MAL",
      storyTitle: "Story",
      trendingSpotlightTitle: "10 anime dominating trends and the arena right now",
      trendingClashBadge: "Trending clash",
      episodesTotalLabel: "{count} episodes",
      trendingSyncPending: "Sync trending spotlight from admin to load posters, scores, and clashes.",
      scoreLabel: "Score {score}",
      rankLabel: "Rank #{rank}",
      malLink: "View on MyAnimeList →",
      instantEpisodeBadge: "24-hour episode clash",
      instantEpisodeTitle: "{title} · Episode {episode}",
      instantEpisodeSubtitle:
        "Upload your best scene now. Only clips from the last 24 hours count — highest engagement wins.",
      instantEpisodeRewards: "Winner: +{points} points",
      instantEpisodeCountdown: "Time left",
      instantEpisodeHours: "hrs",
      instantEpisodeMinutes: "min",
      instantEpisodeSeconds: "sec",
      instantEpisodeCta: "Join the clash",
      instantEpisodeEnded: "This clash window has closed.",
    },
    exclusives: {
      dailyHallBadge: "Daily Hall of Fame",
      dailyHallTitle: "Daily Hall of Fame",
      dailyHallSubtitle: "The hunter who earned the most interaction points today leads the arena.",
      interactionKing: "Interaction King Today",
      pointsToday: "pts today",
      noDailyLeader: "No daily champion yet. Like, comment, post, and invite friends to claim the crown.",
      hallOfLegendsBadge: "Hall of Legends",
      hallOfLegendsTitle: "Hall of Legends",
      hallOfLegendsSubtitle:
        "A permanent gallery of past season champions. These creators earned the podium and inspire the next wave of hunters.",
      noHallOfLegends:
        "No archived season champions yet. When a season ends, top-ranked clips are preserved here forever.",
      seasonWinnerRank: "Rank #{rank}",
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
      cannotChallengeOwnClip: "You cannot challenge your own clip.",
      loginToChallenge: "Sign up to challenge clips and earn duel points.",
      challengeFailed: "Could not start the duel. Try another clip.",
      challengeDuelBadge: "Quick Challenge",
      challengeDuelTitle: "Clip Challenge",
      challengeDuelPageDesc: "Two creators, one arena. Vote with likes and comments to crown the stronger clip.",
      clipChallengeExclusivesDesc:
        "Open the Videos page and tap Challenge this clip under any approved clip that is not yours.",
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
      pointsWagerInviteAlertTitle: "Points challenge incoming!",
      pointsWagerInviteAlertBody:
        "{user} challenged you for {wager} points. Winner takes {pot} points.",
      rejectWagerDuel: "Reject",
      rejectingWager: "Rejecting...",
      viewWagerOnExclusives: "View on Exclusives",
      pointsWagerAlertSoundHint: "Alert sound stops when you accept or reject.",
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
      closePlayer: "Close radio",
      streamError: "Could not connect to the stream. Try again in a moment.",
      poweredBy: "Anime OST stream by LISTEN.moe. Lofi beats via Nightwave Plaza.",
    },
    lounge: {
      badge: "Anime Beats Lounge",
      title: "Anime Beats Lounge",
      subtitle:
        "A community-curated playlist of the best anime music. Vote for your favorites and keep listening while you browse Clash Anime.",
      tabRadio: "Live Radio",
      tabLounge: "Beats Lounge",
      keepListening: "Keep listening while you browse videos, community, and your profile.",
      play: "Play playlist",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      volume: "Volume",
      nowPlaying: "Now playing",
      playing: "Playing",
      communityPlaylist: "Community playlist",
      pickTrack: "Pick a track to start",
      previous: "Previous",
      next: "Next",
      closePlayer: "Close player",
      playlistTitle: "Community playlist",
      emptyPlaylist: "No approved tracks yet. Submit a song or wait for staff to curate the lounge.",
      voteTrack: "Vote for this track",
      loginToVote: "Sign in to vote",
      nowPlayingBadge: "Now",
      submitTitle: "Suggest a track",
      submitDesc: "Share a YouTube link to an anime song the community should hear next.",
      trackTitlePlaceholder: "Song title",
      artistPlaceholder: "Artist",
      animePlaceholder: "Anime name (optional)",
      youtubePlaceholder: "YouTube URL or video ID",
      coverPlaceholder: "Cover image URL (optional)",
      coverFromLibrary: "Choose from library",
      coverOrLink: "Or paste image link",
      coverRemove: "Remove cover",
      coverUploadFailed: "Could not upload cover image. Try again.",
      submitButton: "Submit for review",
      submitting: "Submitting...",
      submitSuccess: "Track submitted! Staff will review it for the lounge.",
      loginToSubmit: "Sign in to suggest tracks for the community playlist.",
      errorTitleRequired: "Enter the song title.",
      errorArtistRequired: "Enter the artist name.",
      errorYoutubeRequired: "Paste a YouTube link or video ID.",
      errorYoutubeInvalid: "That YouTube link does not look valid.",
      errorCoverInvalid: "That cover image link must start with http:// or https://.",
      playbackError:
        "This track could not play (embedding may be blocked). Skipping to the next track — try another song.",
      audioOnlyBadge: "Audio only",
      backgroundListening:
        "Audio keeps playing in the background while you browse videos, community, and your profile.",
      unlockAudio: "Tap here to start audio",
      audioSourceHint: "If you don't hear sound, tap the unlock button above.",
      playerLoading: "Loading player…",
      mySubmissionsTitle: "Your submissions",
      mySubmissionsDesc: "Tracks you suggested. You can delete them anytime before or after review.",
      mySubmissionsEmpty: "You have not submitted any tracks yet.",
      mySubmissionsLoading: "Loading your tracks...",
      deleteTrack: "Delete",
      deletingTrack: "Deleting...",
      deleteTrackConfirm: "Delete this track from your submissions?",
      deleteTrackSuccess: "Track deleted.",
      deleteTrackFailed: "Could not delete this track. Try again.",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
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
    contact: {
      pageTitle: "Contact Us",
      pageSubtitle:
        "Tell us about your issue and we will get back to you. Include as much detail as possible so we can help faster.",
      formTitle: "Contact form",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      messageLabel: "Describe your issue",
      messagePlaceholder: "What happened? Include steps, links, or error messages if you have them.",
      whatsappLabel: "WhatsApp / Phone",
      whatsappPlaceholder: "+966 5XX XXX XXXX",
      optional: "Optional",
      required: "Required",
      submit: "Send message",
      submitting: "Sending...",
      success: "Message sent. Our team will reply as soon as possible.",
      failed: "Could not send your message. Please try again.",
      emailInvalid: "Enter a valid email address.",
      messageTooShort: "Please write at least 10 characters about your issue.",
      supportCardTitle: "ClashAnime Support",
      supportCardDesc: "We help with accounts, uploads, ClashCoins, and technical issues.",
      responseTime: "Typical response within 24–48 hours.",
      helpTitle: "How we can help",
      helpGlobal: "Global platform — Arabic, English, and Japanese support.",
      helpWallet: "ClashCoins, withdrawals, and KYC payout questions.",
      helpAccount: "Login, verification, bans, and account security.",
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
      signupCountryHint: "Your country appears on your public channel About tab.",
    },
    profile: {
      loading: "Loading your channel...",
      loadFailed: "Could not load your channel.",
      retry: "Try again",
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
      channelCommunity: "Anime Community",
      channelAbout: "About",
      channelStats: "{followers} followers · {videos} videos · {posts} posts",
      noChannelVideos: "This channel has no videos yet.",
      noChannelPosts: "No anime community posts yet.",
      postNowToCommunity: "Post now",
      viewCommunityPost: "View post",
      channelPreviewTitle: "Your channel",
      channelPreviewDesc: "This is how visitors see your public channel page.",
      editChannelSettings: "Edit channel settings",
      viewPublicChannel: "View public channel",
      channelAboutTab: "About",
      channelMoreInfo: "More information",
      channelJoinedDate: "Joined: {date}",
      channelFollowersStat: "{count} followers",
      channelVideosStat: "{count} videos",
      channelViewsStat: "{count} views",
      channelLifetimePointsStat: "{count} lifetime points earned",
      shareChannel: "Share channel",
      reportUser: "Report user",
      reportUserHint: "Report user channel",
      channelLinkCopied: "Channel link copied.",
      channelShareFailed: "Could not share the channel.",
      profileCountry: "Country",
      profileSocialLink: "Social media link",
      profileSocialPlaceholder: "https://youtube.com/@channel, instagram.com/you, tiktok.com/@you…",
      profileSocialHint: "Paste any link — YouTube, Instagram, TikTok, X, or your website. We detect the platform automatically.",
      profileSocialDetected: "Detected: {platform}",
      profileSocialSavedLinks: "Saved links",
      profileSocialRemove: "Remove",
      socialPlatforms: {
        youtube: "YouTube",
        instagram: "Instagram",
        tiktok: "TikTok",
        twitter: "X (Twitter)",
        website: "Website",
      },
      profileCountryRequired: "Please select your country.",
      completeProfileTitle: "Complete your profile",
      completeProfileDesc: "Choose your country so it appears on your public channel.",
      manageChannel: "Manage your channel",
      verifiedBadge: "Verified channel",
      displayNameCooldown: "You can change your channel name again in {days} day(s).",
      displayNameCooldownDays: "Channel name can only be changed once every 14 days.",
      username: "Username (@handle)",
      usernameCooldown: "You can change your username again in {days} day(s).",
      usernameCooldownDays: "Username can only be changed once every 30 days.",
      usernameTaken: "This username is already taken.",
      usernameInvalid: "Username must be at least 3 characters (a-z, 0-9, _).",
      deleteAccountTitle: "Delete account",
      deleteAccountWarning:
        "This permanently deletes your account, videos, points, wallet data, and all associated records. You cannot recover your account after deletion.",
      deleteAccountCheckbox:
        "I understand that deleting my account is permanent and cannot be undone.",
      deleteAccountTypeWord: 'Type "{word}" to confirm',
      deleteAccountButton: "Delete my account permanently",
      deleteAccountDeleting: "Deleting account...",
      deleteAccountFailed: "Could not delete your account. Please try again or contact support.",
      deleteAccountWordMismatch: "Confirmation word does not match.",
      deleteAccountConfirmRequired: "Please check the confirmation box first.",
      editVideo: "Edit video",
      deleteVideo: "Delete",
      saveVideo: "Save video",
      savingVideo: "Saving...",
      deletingVideo: "Deleting...",
      cancelEdit: "Cancel",
      confirmDeleteVideo: "Delete this video permanently? This cannot be undone.",
      videoUpdated: "Video updated.",
      videoDeleted: "Video deleted.",
      videoSaveFailed: "Could not save video changes.",
      videoDeleteFailed: "Could not delete this video.",
    },
    notifications: {
      bellLabel: "Notifications",
      title: "Notifications",
      subtitle: "Updates from ClashAnime",
      markAllRead: "Mark all read",
      enableInApp: "Enable in-app notifications",
      loading: "Loading notifications...",
      disabledHint: "Turn on notifications to see updates here.",
      empty: "No notifications yet.",
      settingsLabel: "Notification settings",
      settingsHint: "The number shows unread notifications. Opening one marks it as read.",
      mentionTitle: "You were mentioned",
      mentionPreviewCommunity: "mentioned you in a community post.",
      mentionPreviewComment: "mentioned you in a comment.",
      types: {
        follow: { label: "Follow", title: "New follower", body: "{name} started following you" },
        new_video: { label: "Video", title: "New video", body: "{channel} published: {title}" },
        admin_video_review: {
          label: "Admin",
          title: "Video needs review",
          body: "{channel} published: {title}",
        },
        new_music: { label: "Music", title: "New music", body: "{channel} added a track: {title}" },
        community_post: {
          label: "Community",
          title: "Community post",
          body: "{channel} posted in Community",
          bodyWithPreview: "{channel} posted: {preview}",
        },
        video_duel: { label: "Challenge", title: "Clip challenge", body: "{name} challenged your clip" },
        points_duel: { label: "Points duel", title: "Points duel challenge", body: "{name} challenged you for {points} points" },
        points_duel_accepted: { label: "Duel accepted", title: "Duel accepted", body: "{name} accepted your points duel" },
        season_start: { label: "Season start", title: "New season started", body: "{season} is now live. Climb the ranks!" },
        season_end: { label: "Season end", title: "Season ended", body: "{season} has ended. Check the Hall of Legends!" },
        anime_release_clash: {
          label: "Episode clash",
          title: "Instant episode clash — 24 hours",
          body: "{anime} is live for 24 hours! Use {hashtags} and upload your best scene. Winner earns +2,000 points.",
        },
        episode_clash_winner: {
          label: "Episode king",
          title: "You are the episode king!",
          body: "You won {anime} Ep {episode} with +{points} points.",
        },
        episode_clash_crowned: {
          label: "Episode crowned",
          title: "Episode king crowned",
          body: "{name} won {anime} Ep {episode} — the 24-hour window is closed.",
        },
        video_like: {
          label: "Like",
          title: "New like",
          body: "{name} liked your clip",
          bodyWithTitle: "{name} liked your clip: {title}",
        },
        video_comment: {
          label: "Comment",
          title: "New comment",
          body: "{name} commented on your clip",
          bodyWithPreview: "{name} commented: {preview}",
        },
        comment_reply: {
          label: "Reply",
          title: "New reply",
          body: "{name} replied to your comment",
          bodyWithPreview: "{name} replied: {preview}",
        },
        comment_like: { label: "Comment like", title: "Comment liked", body: "{name} liked your comment" },
        mention: { label: "Mention" },
        broadcast: { label: "Broadcast" },
        system: { label: "System" },
        referral_signup: {
          label: "Referral signup",
          title: "Friend joined",
          body: "{name} signed up via your invite link (+{points} pts)",
        },
        referral_welcome: {
          label: "Welcome bonus",
          title: "Invite bonus",
          body: "You earned +{points} points for joining via @{username}",
        },
        signup_welcome: {
          label: "Signup bonus",
          title: "Welcome to ClashAnime",
          body: "You earned +{points} points for creating your account",
        },
        referral_milestone: {
          label: "Referral milestone",
          title: "Friend milestone",
          body: "{name} {milestone} (+{points} pts)",
        },
        referral_tier_up: {
          label: "Referral rank",
          title: "New referral rank",
          body: "You reached {tier} rank with {count} invites",
        },
      },
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
      referralHintV2:
        "Share your link. Every new account earns welcome points; you and friends earn extra when they join via your link.",
      referralSystemLabel: "Referral program",
      referralDoubleSidedTitle: "Rewards for you and your friends",
      referralStatsTitle: "Your referral stats",
      referralStatsTotal: "Total invites",
      referralStatsWeek: "This week",
      referralStatsVideoBonus: "First-video bonuses",
      referralStatsBattleBonus: "First-battle bonuses",
      referralMilestoneTitle: "Referral rank progress",
      referralMaxTier: "Max rank reached",
      referralCosmeticHint: "Higher ranks unlock special name colors and avatar frames on your channel.",
      referralFlashActive: "Flash event active: {multiplier}x signup points for you",
      referralLeaderboardTitle: "Referral leaderboard",
      referralLeaderboardWeek: "This week",
      referralLeaderboardAll: "All time",
      referralLeaderboardEmpty: "No referrals yet. Be the first on the board.",
      referralLeaderboardInvites: "invites",
      referralTiers: {
        scout: "Scout · 5 invites",
        recruit: "Recruit · 20 invites",
        leader: "Leader · 50 invites",
      },
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
        referralSignupYou: "When a friend signs up via your link",
        referralSignupFriend: "When you sign up via a friend's link (+50 extra)",
        signupWelcome: "When you create a new account",
        referralFirstVideo: "When your invited friend uploads their first video",
        referralFirstBattle: "When your invited friend joins their first battle",
        videoLike: "Like a video",
        videoUpload: "Upload an approved original clip",
        communityPost: "Publish in Community",
        trendingBonus: "Your clip reaches the trending grid",
      },
      transactionReasons: {
        referral_click: "Invite link visit",
        referral_signup: "Friend signed up",
        referral_welcome: "Invite welcome bonus",
        signup_welcome: "Account welcome bonus",
        referral_first_video: "Friend's first video",
        referral_first_battle: "Friend's first battle",
        video_like: "Video like",
        video_upload: "Approved upload",
        community_post: "Community post",
        trending_bonus: "Trending bounty",
        video_duel_challenge: "Clip challenge duel",
        points_duel_stake: "Points duel stake",
        points_duel_win: "Points duel win",
        points_duel_refund: "Points duel refund",
        clash_coin_conversion: "Converted to ClashCoins",
      },
    },
    wallet: {
      title: "ClashCoins",
      subtitle: "Digital wallet",
      description:
        "Your redeemable dollar balance. Convert hunter points to $, keep the total in your wallet, and withdraw via bank transfer, PayPal, or USDT.",
      balanceLabel: "Wallet balance",
      exchangeRateTitle: "Exchange rate",
      exchangeRateValue: "10,000 points = $10.00",
      minPayoutTitle: "Minimum payout",
      hunterPointsLabel: "Hunter points available",
      convertTitle: "Convert points to $ balance",
      convertDesc: "Exchange hunter points at a fixed rate. Your wallet balance is stored in USD with cents.",
      convertAmountLabel: "Points to convert",
      convertPreview: "You will receive {amount}",
      convertButton: "Convert now",
      convertSuccess: "Points converted to your $ balance successfully.",
      convertFailed: "Could not convert points. Check your balance and try again.",
      convertMinError: "Minimum conversion is 100 points ($0.10).",
      withdrawTitle: "Request payout",
      withdrawDesc: "Withdraw your $ balance. Choose bank transfer, PayPal, or USDT. Payouts are reviewed manually for safety.",
      withdrawAmountLabel: "Amount to withdraw ($)",
      selectPaymentMethod: "Payout method",
      bankTransferTitle: "Bank transfer",
      bankTransferDesc: "Enter your IBAN, the name on your bank card, and the recipient email.",
      paypalTitle: "PayPal",
      paypalDesc: "Receive the payout to your PayPal account email.",
      paypalEmailLabel: "PayPal email",
      paypalEmailPlaceholder: "your@paypal.com",
      usdtTitle: "Crypto USDT",
      usdtDesc: "Receive USDT to your wallet. Double-check the network before submitting.",
      usdtWalletLabel: "USDT wallet address",
      usdtWalletPlaceholder: "Wallet address",
      usdtNetworkLabel: "Network",
      ibanLabel: "IBAN",
      ibanPlaceholder: "DE89 3704 0044 0532 0130 00",
      accountHolderLabel: "Name on bank card",
      accountHolderPlaceholder: "Full name as shown on your bank account",
      recipientEmailLabel: "Recipient email",
      recipientEmailPlaceholder: "name@email.com",
      kycAcknowledgement:
        "I confirm the identity information I submitted is accurate and I accept the payout KYC policy in the Terms of Use.",
      kycRequired: "Please confirm the KYC policy notice before submitting.",
      kycApprovalRequired: "Identity verification (KYC) must be approved before you can request a payout.",
      kycWithdrawLocked: "Complete and get KYC approved once per account before requesting any payout.",
      kycTitle: "Identity verification (KYC)",
      kycDesc:
        "Required once per account and channel before any ClashCoins payout. Submit your name, phone, and full address.",
      kycFirstNameLabel: "First name",
      kycFirstNamePlaceholder: "First name on ID",
      kycLastNameLabel: "Last name",
      kycLastNamePlaceholder: "Last name on ID",
      kycCountryLabel: "Country",
      kycPhoneLabel: "Phone number",
      kycPhoneLocalPlaceholder: "501234567",
      kycWhatsappTitle: "WhatsApp",
      kycWhatsappDesc: "WhatsApp — so we can contact you about KYC and payouts.",
      kycWhatsappNumberLabel: "WhatsApp number",
      kycWhatsappPlaceholder: "Same as phone or enter another number",
      kycWhatsappHint: "Leave empty to use your phone number above on WhatsApp.",
      kycAddressLabel: "Full address",
      kycAddressPlaceholder: "Street, city, country, postal code",
      kycIdLabel: "Government ID photo",
      kycIdHint: "Upload a clear photo of your passport, national ID, or driver's license (JPEG/PNG/WebP, max 10 MB).",
      kycIdRequired: "Please upload your ID photo.",
      kycInvalidImage: "Please choose a valid image file.",
      kycImageTooLarge: "ID image must be 10 MB or smaller.",
      kycSubmitButton: "Submit KYC for review",
      kycSubmitSuccess: "KYC submitted. Our team will review it before payouts are enabled.",
      kycSubmitFailed: "Could not submit KYC. Try again.",
      kycLoading: "Loading KYC status...",
      kycPendingTitle: "KYC under review",
      kycPendingDesc: "Your identity documents are being reviewed. Payout requests unlock after approval.",
      kycApprovedTitle: "KYC approved",
      kycApprovedDesc: "Your identity is verified for this account. You can now request payouts.",
      kycRejectedTitle: "KYC rejected",
      kycRejectedDesc: "Your KYC was rejected. Update your details and submit again.",
      withdrawButton: "Request payout",
      withdrawProcessingTime:
        "Payouts are reviewed manually. After approval, funds typically arrive within 24–72 hours.",
      withdrawFailed: "Could not submit withdrawal request.",
      withdrawMinError: "Minimum withdrawal is $10.00.",
      withdrawPendingNotice:
        "Your request is under review. After approval, payout usually arrives within 24–72 hours.",
      fraudBlocked:
        "This request was flagged for review due to unusual point activity. Our team will investigate.",
      processing: "Processing...",
      paymentOptionsTitle: "Payout methods",
      paymentMethodLabels: {
        bank_transfer: "Bank transfer",
        paypal: "PayPal",
        crypto_usdt: "Crypto USDT",
      },
      historyTitle: "Withdrawal history",
      loadingHistory: "Loading history...",
      noHistory: "No withdrawal requests yet.",
      legalNote: "Payouts are subject to anti-fraud checks and tax reporting requirements.",
      withdrawalStatuses: {
        pending: "Pending review",
        reviewing: "Under review",
        completed: "Paid out",
        rejected: "Rejected",
        fraud_blocked: "Fraud review",
      },
    },
    communityFeed: {
      postPublished: "Post published.",
      postLevelRequired:
        "Publishing in the community is limited to Hunter ranks C, A, and S (1000+ points). You can still view posts and comment.",
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
      title: "Upload video",
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
      publishedLive:
        "Your video is live! Our team may review it later.",
      scanFailed: "Could not verify this file. Try again with a different export.",
      uploadFailed: "Could not upload files. Try again in a moment.",
      r2UploadBlocked:
        "Upload to Cloudflare R2 was blocked. Check bucket CORS for clashanime.com and www.clashanime.com, then try again.",
      uploadsDisabled: "Video uploads are temporarily disabled.",
      accountBanned: "Your account is suspended and cannot upload videos.",
      levelRequired: "Reach Challenger rank (1000+ points) to upload videos.",
      clashUploadTitle: "Uploading for {anime} release clash",
      clashUploadHint: "These hashtags are added automatically: {tags}",
      backToClash: "Back to clash",
      hashtagUsageCount: "{count} videos",
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
      lifetimePoints: "Lifetime earned",
      level: "Level",
      verificationRequests: "Verification requests",
      approveVerification: "Approve verification",
      rejectVerification: "Reject verification",
      viewChannel: "View channel",
      channelHasCover: "Cover",
      channelHasBio: "Bio",
      channelHasYoutube: "YouTube",
      channelHasInstagram: "Instagram",
      channelHasTiktok: "TikTok",
      channelHasTwitter: "X",
      channelHasWebsite: "Website",
      suspicionScore: "Suspicion score",
      globalRank: "Global rank",
      clashRank: "Clash rank",
      awaitingAdminReview: "Awaiting review",
      markReviewed: "Mark reviewed",
      inClashTop: "In Clash top 12",
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
      withdrawalsTitle: "ClashCoin withdrawals",
      withdrawalsSubtitle: "Review payout requests, fraud flags, and payment details.",
      noWithdrawals: "No withdrawal requests match this filter.",
      kycTitle: "Payout KYC verification",
      kycSubtitle: "Review identity documents, phone numbers, and addresses before enabling payouts.",
      noKycSubmissions: "No matching KYC submissions.",
      approveKyc: "Approve KYC",
      rejectKyc: "Reject KYC",
      kycRejectNotesPrompt: "Reason for rejection (shown to user if provided):",
      kycStatuses: {
        pending: "Pending review",
        approved: "Approved",
        rejected: "Rejected",
      },
      contactTitle: "Contact messages",
      contactSubtitle: "Read and reply to support messages from users.",
      noContactMessages: "No contact messages match this filter.",
      contactReply: "Staff reply / notes",
      contactReplyPlaceholder: "Internal reply notes or summary of your response...",
      saveContactReply: "Save reply",
      markContactReplied: "Mark replied",
      markContactClosed: "Close",
      sendContactReplyEmail: "Send reply by email",
      sendingContactReply: "Sending...",
      contactReplySent: "Reply email sent to the user.",
      contactReplyFailed: "Could not send the reply email.",
      contactStatuses: {
        open: "Open",
        replied: "Replied",
        closed: "Closed",
      },
      emailsTitle: "Transactional emails",
      emailsSubtitle: "Welcome emails and other automated messages sent to users.",
      noEmails: "No emails logged yet.",
      emailsFilterAll: "All",
      emailStatuses: {
        pending: "Pending",
        sent: "Sent",
        failed: "Failed",
      },
      emailsTable: {
        when: "When",
        to: "To",
        type: "Type",
        locale: "Locale",
        status: "Status",
        user: "User",
        actions: "Actions",
      },
      emailRetry: "Retry send",
      emailRetrying: "Retrying...",
      emailRetrySuccess: "Email sent successfully.",
      emailRetryFailed: "Could not resend this email.",
      accountDeletionsTitle: "Deleted accounts",
      noAccountDeletions: "No account deletions logged yet.",
      accountDeletionsTable: {
        when: "When",
        email: "Email",
        name: "Name",
        farewell: "Farewell email",
      },
      inAppNotificationsTitle: "In-app notifications",
      inAppNotificationsFilterAll: "All types",
      noInAppNotifications: "No in-app notifications logged yet.",
      inAppNotificationsTable: {
        when: "When",
        user: "User",
        type: "Type",
        title: "Title",
        read: "Read",
      },
      broadcastTitle: "Broadcast email",
      broadcastSubtitle: "Send a branded email to every registered user in one click.",
      broadcastComposeTitle: "Compose campaign",
      broadcastSubjectLabel: "Subject",
      broadcastMessageLabel: "Message",
      broadcastPersonalizeHint: "Use {user_name} to personalize each email.",
      broadcastCtaLabel: "Button label (optional)",
      broadcastCtaUrlLabel: "Button link",
      broadcastConfirmCheckbox: "I understand this will email every user on the platform.",
      broadcastSendButton: "Send to all users",
      broadcastSending: "Sending...",
      broadcastUsersTitle: "All users",
      broadcastNoUsers: "No users with email addresses found.",
      broadcastUsersTable: {
        email: "Email",
        name: "Name",
      },
      broadcastConfirm: "Send this email to {count} users now?",
      broadcastSendSuccess: "Sent {sent}/{total} emails. Failed: {failed}.",
      broadcastSendFailed: "Could not send the broadcast.",
      broadcastLoadFailed: "Could not load users.",
      broadcastHistoryTitle: "Broadcast history",
      broadcastNoHistory: "No broadcasts sent yet.",
      broadcastHistoryTable: {
        when: "When",
        subject: "Subject",
        sent: "Sent",
        failed: "Failed",
        status: "Status",
      },
      approveWithdrawal: "Mark paid",
      rejectWithdrawal: "Reject & refund",
      markReviewing: "Mark reviewing",
      clashCoins: "ClashCoins",
      paymentMethod: "Payment method",
      paymentDestination: "Destination",
      fraudFlags: "Fraud flags",
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
        withdrawals: "Withdrawals",
        kyc: "Payout KYC",
        seasons: "Clash seasons",
        legends: "Hall of Legends",
        beatsLounge: "Anime Beats Lounge",
        animeTracker: "Anime Tracker",
        blog: "Arena Guide",
        animeNews: "Anime news",
        contact: "Contact inbox",
        emails: "Emails",
        referrals: "Referrals",
        broadcast: "Broadcast",
      },
      referrals: {
        title: "Referral program",
        subtitle: "Track invite performance, weekly leaders, and flash multiplier events.",
        totalSignups: "Total referral signups",
        weekSignups: "Signups this week",
        activeFlash: "Active flash events",
        flashEventsTitle: "Flash referral events",
        flashEventsEmpty: "No flash events yet.",
        createFlashTitle: "Create flash event",
        titleEn: "Title (English)",
        titleAr: "Title (Arabic)",
        titleJa: "Title (Japanese)",
        multiplier: "Multiplier",
        startsAt: "Starts at",
        endsAt: "Ends at",
        createButton: "Create event",
        creating: "Creating...",
        created: "Flash event created.",
        deactivate: "Deactivate",
        leaderboardTitle: "Top referrers",
        periodWeek: "This week",
        periodAll: "All time",
        table: {
          title: "Title",
          multiplier: "Multiplier",
          window: "Window",
          status: "Status",
          actions: "Actions",
        },
      },
      seasons: {
        title: "Clash seasons",
        subtitle: "Control season start, end, and the countdown on the battles page.",
        activeNow: "Active season",
        noActive: "No active season. Start one to show the countdown on the battles page.",
        createTitle: "Create season",
        quickStartTitle: "Start new season",
        quickStartDesc: "Ends the current season and starts a new 30-day active season immediately.",
        listTitle: "All seasons",
        nameLabel: "Season name",
        startsAtLabel: "Start date",
        endsAtLabel: "End date",
        durationDaysLabel: "Duration (days)",
        activateOnCreate: "Activate immediately",
        createButton: "Create season",
        startNewButton: "Start new season now",
        editButton: "Edit dates",
        activateButton: "Activate",
        endButton: "End season",
        autoNamePlaceholder: "Auto name if empty",
        editNamePrompt: "Season name",
        editStartPrompt: "Start (YYYY-MM-DDTHH:mm)",
        editEndPrompt: "End (YYYY-MM-DDTHH:mm)",
        empty: "No seasons yet.",
        created: "Season created.",
        updated: "Season updated.",
        activated: "Season activated.",
        ended: "Season ended.",
        startedNew: "New season started.",
        prizeSectionTitle: "Cash prizes (USD)",
        prizeRank1Label: "Rank 1 prize ($)",
        prizeRank2Label: "Rank 2 prize ($)",
        prizeRank3Label: "Rank 3 prize ($)",
        prizeSaveButton: "Save prizes",
        prizesSaved: "Prize amounts saved.",
        statusLabels: {
          scheduled: "Scheduled",
          active: "Active",
          ended: "Ended",
        },
      },
      legends: {
        title: "Hall of Legends",
        subtitle: "Archive past season winners and keep champions visible across the site.",
        statsArchived: "Archived seasons",
        statsEnded: "Ended seasons",
        statsWinners: "Total winners",
        seasonListTitle: "Season archive",
        openSeasons: "Open seasons panel",
        emptySeasons: "No seasons yet.",
        winnersCount: "{count} winners archived",
        viewWinners: "View winners",
        snapshotButton: "Archive winners",
        resnapshotButton: "Re-archive winners",
        winnersTitle: "Winners — {season}",
        noWinners: "No winners archived for this season yet.",
        deleteWinner: "Remove",
        deleteConfirm: "Remove this winner from the Hall of Legends?",
        deleted: "Winner removed.",
        snapshotSuccess: "Archived {count} winners.",
      },
      beatsLounge: {
        title: "Anime Beats Lounge",
        subtitle: "Review community submissions and manage the curated playlist on /music.",
        pendingCount: "Pending submissions",
        approvedCount: "Approved tracks",
        totalVotes: "Community votes",
        addTrackTitle: "Add track directly",
        titleLabel: "Song title",
        artistLabel: "Artist",
        animeLabel: "Anime (optional)",
        youtubeLabel: "YouTube URL or ID",
        sortLabel: "Sort order (higher = earlier)",
        addButton: "Add to lounge",
        queueTitle: "All lounge tracks",
        empty: "No tracks yet.",
        approveButton: "Approve",
        rejectButton: "Reject",
        deleteButton: "Delete",
        deleteConfirm: "Delete this track from the lounge?",
        created: "Track added.",
        approved: "Track approved.",
        rejected: "Track rejected.",
      },
      animeTracker: {
        title: "Anime Tracker",
        subtitle: "Manage release schedule, sync Jikan (MyAnimeList), and open 24-hour instant episode clashes when episodes drop.",
        todayCount: "Releases today",
        upcomingCount: "Upcoming (14 days)",
        activeClashes: "Active release clashes",
        syncButton: "Sync Jikan + trending",
        syncTrendingButton: "Sync trending spotlight only",
        syncing: "Syncing…",
        syncSuccess: "Schedule: {scheduleSynced} synced, {scheduleOpened} clashes opened. Trending: {trendingSynced}/{trendingTotal} synced.",
        syncTrendingSuccess: "Trending spotlight: {synced}/{total} synced from Jikan.",
        syncFailed: "Jikan sync failed.",
        syncTrendingFailed: "Trending spotlight sync failed.",
        trendingListTitle: "Trending spotlight (top 10)",
        lastAutoSyncLabel: "Last auto sync",
        autoSyncHint: "Schedule, trending top-10, finalize, rewards, and daily 24h clashes refresh every 30 minutes via Vercel cron (and GitHub Actions when CRON_SECRET is set). Opening the tracker page also syncs if stale.",
        addTitle: "Add release manually",
        titleLabel: "Anime title",
        titleArLabel: "Arabic title (optional)",
        titleJaLabel: "Japanese title (optional)",
        synopsisEnLabel: "Story in English (optional)",
        synopsisArLabel: "Story in Arabic (optional)",
        synopsisJaLabel: "Story in Japanese (optional)",
        episodeLabel: "Episode number",
        posterLabel: "Poster URL (optional)",
        tagsLabel: "Match hashtags (comma separated, optional)",
        openClashNow: "Open 24-hour instant episode clash immediately",
        addButton: "Add release",
        listTitle: "All releases",
        empty: "No releases yet.",
        openClashButton: "Open clash",
        viewClash: "View clash",
        deleteButton: "Delete",
        deleteConfirm: "Delete this release from the tracker?",
        created: "Release added.",
        clashOpened: "Release clash opened.",
        seoTitle: "Google SEO keywords",
        seoAnimeCount: "{count} anime titles from Jikan/DB feed search metadata (EN/AR/JA).",
        seoKeywordCount: "{count} unique keywords active across public pages.",
        instantEpisodeHint:
          "Instant episode clashes open for 24 hours when an episode drops. The top clip by engagement (likes + comments×2 + shares×3) wins automatically.",
        instantEpisodeRewards: "Winner reward: +{points} points",
        instantEpisodeActiveTitle: "Live instant episode clashes",
        instantEpisodeHistoryTitle: "Recent episode clashes & winners",
        clashClosesAt: "Closes {time}",
        clashWinner: "Winner: {name} (+{points} pts)",
        clashNoWinner: "Ended with no qualifying clips",
        clashEnded: "Ended {time}",
        clashStatusActive: "Active · 24h window",
      },
      blog: {
        title: "Arena Guide (Blog)",
        subtitle: "Static SEO articles published from the codebase — no database CMS.",
        staticNote:
          "Articles are version-controlled files in /blog. Edit content via git deploy; this panel is read-only for visibility.",
        heroSlides: {
          title: "Hero cover carousel",
          subtitle:
            "Upload up to 10 wide banner images for the Heroes Guide hub (/blog). Slides rotate automatically and can be changed manually on the site.",
          displayTitle: "Cover display settings",
          displaySubtitle: "Control whether the carousel appears on the site, text overlay visibility, and how dark the cover looks.",
          carouselEnabled: "Show carousel on site",
          showTextOverlay: "Show center text box",
          overlayOpacity: "Dark overlay strength",
          autoPlaySeconds: "Auto-advance interval",
          objectPosition: "Image crop focus",
          objectCenter: "Center",
          objectTop: "Top",
          objectBottom: "Bottom",
          objectLeft: "Left",
          objectRight: "Right",
          previewOnSite: "Preview on site",
          save: "Save carousel",
          saving: "Saving...",
          saved: "Hero carousel saved.",
          loading: "Loading slides...",
          upload: "Upload image",
          uploading: "Uploading...",
          uploaded: "Slide {n} image uploaded — click Save carousel to publish.",
          remove: "Remove",
          enabled: "Show",
          emptySlot: "No image yet",
          slotLabel: "Slide {n}",
          slotsMeta: "{active} active of {max} slots",
        },
        articlesCount: "{count} published articles",
        category: "Category",
        published: "Published",
        readingTime: "Reading time",
        viewOnSite: "View on site",
        openHub: "Open guide hub",
      },
      animeNews: {
        title: "Anime news hub",
        subtitle:
          "Sync Crunchyroll RSS drafts, write EN/AR/JA summaries in our voice, add topics, then publish on /blog/anime-news.",
        syncNow: "Sync RSS now",
        syncing: "Syncing...",
        syncSuccess: "RSS sync complete — {inserted} new, {updated} updated.",
        featuredGuideSynced: "Seasonal guide synced: {slug}",
        featuredLineupSynced: "{count} lineup titles synced",
        spotlightSynced: "{count} spotlight titles synced ({enriched} with posters)",
        featuredBadge: "Featured · Blog spotlight",
        viewOnBlog: "View on blog",
        saved: "Article saved.",
        saving: "Saving...",
        saveDraft: "Save draft",
        publish: "Publish",
        edit: "Edit",
        collapse: "Collapse",
        viewOnSite: "View on site",
        sourceLink: "Crunchyroll source",
        openHub: "Open public hub",
        loading: "Loading articles...",
        empty: "No articles yet. Run RSS sync to import drafts.",
        meta: "{drafts} drafts · {published} published",
        lastSync: "Last sync:",
        needsTranslation: "Add optional AR/JA translations",
        titlePlaceholder: "Headline",
        excerptPlaceholder: "Short summary in your own words (2–4 sentences)",
        storyPlaceholder: "Full anime story / news body (multiple paragraphs)",
        topics: "Topics (comma separated)",
        lineupCount: "{count} lineup titles",
        lineupPreview: "Seasonal lineup (auto-synced daily)",
        lineupMore: "+{count} more titles",
      },
      hashtags: {
        title: "Top hashtags",
        subtitle: "Most used tags across approved videos. Each tag has a public landing page.",
        viewPage: "Open page",
        empty: "No hashtags in use yet.",
      },
      videoOwnerEvents: {
        title: "Creator video changes",
        subtitle: "Recent edits and deletions from channel owners in Your Videos.",
        empty: "No owner video changes yet.",
        updated: "Updated",
        deleted: "Deleted",
        viewVideo: "View video",
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
        pendingWagerInvites: "Pending wager invites",
        pendingWithdrawals: "Pending withdrawals",
        pendingKyc: "Pending payout KYC",
        openContactMessages: "Open contact messages",
        welcomeEmailsSent: "Welcome emails sent",
        accountDeletions: "Accounts deleted",
        inAppNotifications: "In-app notifications",
        legendWinners: "Hall of Legends winners",
        referralSignups: "Referral signups",
        referralWeekSignups: "Referral signups (week)",
      },
      platformHealth: {
        title: "Platform health",
        subtitle: "AdSense configuration and database migrations.",
        adsense: "Google AdSense",
        databaseSchema: "Database schema",
        configured: "Client ID and slot are set in Vercel.",
        missingEnv: "Set NEXT_PUBLIC_ADSENSE_CLIENT_ID and NEXT_PUBLIC_ADSENSE_SLOT.",
        active: "Active for visitors in production.",
        inactive: "Disabled via env override.",
        checking: "Checking…",
        healthy: "Latest migrations are applied.",
        needsMigration: "Run pending SQL from /api/health/schema.",
        ok: "OK",
        actionNeeded: "Action needed",
        monetizationApi: "Monetization API",
        schemaApi: "Schema API",
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
        exclusivesFeaturesDesc: "Daily Hall of Fame, Hall of Legends, clip challenges, trending duels, and random clash.",
        clipChallenges: "Clip challenges",
        clipChallengesDesc: "Users duel clips head-to-head. Challenge button appears under every approved video.",
        pointsWagerDuels: "Points wager arena",
        pointsWagerDuelsDesc: "Hunters stake points, invite rivals, and the winner takes the pot on /exclusives.",
        reviewWithdrawals: "Review withdrawals",
        reviewWithdrawalsDesc: "Approve or reject ClashCoin payout requests.",
        reviewKyc: "Review payout KYC",
        reviewKycDesc: "Verify identity documents before enabling user payouts.",
        reviewContact: "Contact messages",
        reviewContactDesc: "Read support requests and record your replies.",
      },
      table: {
        user: "User",
        role: "Role",
        videos: "Videos",
        communityPosts: "Community",
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
    common: {
      back: "戻る",
      backToHome: "ホームに戻る",
      pageNotFoundTitle: "ページが見つかりません",
      pageNotFoundBadge: "404",
      pageNotFoundDesc: "お探しのページは存在しないか、移動されました。",
      unexpectedErrorTitle: "問題が発生しました",
      unexpectedErrorDesc: "予期しないエラーが発生しました。もう一度お試しいただくか、ホームに戻ってください。",
      tryAgain: "再試行",
    },
    nav: {
      clash: "クラッシュ",
      videos: "動画",
      community: "コミュニティ",
      music: "アニメラジオ",
      exclusives: "限定",
      animeTracker: "新作アニメレーダー",
      hunterSystem: "賞金ハンターシステム",
      bountyRewards: "最新の報酬",
      inviteFriends: "友達を招待",
      channelSettings: "チャンネル設定",
      channel: "チャンネル",
      myVideos: "あなたの動画",
      settings: "設定",
      clashWallet: "ClashCoinsウォレット",
      clashCoins: "ClashCoins",
      mobileBottomNav: "メインナビ",
      more: "その他",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "リアルタイムのエンゲージメントで世界トップ12の動画のみ表示。世界12位に到達するとクラッシュに入ります。",
      liveClashCounterTitle: "ライブ・クラッシュ・カウンター",
      liveClashCounter:
        "現在アリーナ：{battles} の燃えるバトル.. {fighters} 人のヒーローが戦闘中！",
      gridLabel: "Clash Animeグリッド",
      clashLive: "ライブ・クラッシュ",
      podiumLabel: "表彰台",
      challengersLabel: "挑戦者",
      cashPrizeTitle: "クラッシュ勝者に現金賞",
      cashPrizeSubtitle: "上位ランクのクリップはシーズンごとに報酬を獲得。",
      cashPrizeRank1: "1位 ゴールド",
      cashPrizeRank2: "2位 シルバー",
      cashPrizeRank3: "3位 ブロンズ",
      cashPrizeRankNumber: "第{rank}位",
      cashPrizeRankWord: "第",
      cashPrizeRankSuffix: "位",
      cashPrizeRevealLabel: "第{rank}位の賞金",
      cashPrizeRevealHint: "シーズン終了後、審査を経て勝者に支払われます。",
      cashPrizeTapHint: "順位をタップして賞金額を表示",
      clashCoinsTitle: "ClashCoins — デジタルウォレット",
      clashCoinsSubtitle: "ハンターポイントを換金可能なClashCoinsに変換。",
      clashCoinsExchange: "10,000ポイント = $10",
      clashCoinsMinPayout: "最低出金: $10.00",
      clashCoinsOpenWallet: "ウォレットを開く",
      seasonCountdownLabel: "シーズン終了まで",
      seasonDays: "日",
      seasonHours: "時間",
      seasonMinutes: "分",
      seasonSeconds: "秒",
      seasonEnded: "シーズン終了",
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
      previousInFeed: "前の動画",
      nextInFeed: "次の動画",
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
    mobileApp: {
      menuTitle: "Clash Anime を探索",
      menuSubtitle: "すべての機能にすぐアクセス",
      closeMenu: "メニューを閉じる",
      preferences: "言語とテーマ",
      brandTitle: "Clash Anime",
      brandWordClash: "Clash",
      brandWordAnime: "Anime",
      installTitle: "Clash Anime をインストール",
      installSubtitle:
        "ホーム画面に追加すると、すぐに開けて全画面で楽しめます。",
      installAction: "アプリをインストール",
      installDismiss: "あとで",
      installIosSteps:
        "{share} をタップし、「ホーム画面に追加」を選びます。",
      installShare: "共有",
      pullToRefresh: "下に引いて更新",
      pullToRefreshRelease: "離して更新",
      refreshing: "更新中...",
    },
    legalHub: {
      pageTitle: "情報・規約",
      badge: "ポリシー",
      subtitle: "利用規約、プライバシー、コミュニティガイドラインをまとめて確認できます。",
      rulesIntro: "利用規約、プライバシー、クッキー、DMCA、プラットフォームルール。",
      contactIntro: "お問い合わせ、コンテンツ報告、アリーナガイド。",
      viewAll: "すべてのポリシーを見る",
    },
    footer: {
      tagline: "リアルタイムのコミュニティ参加でランク付けされるアニメデュエル。",
      discoverHeading: "探索",
      informationHeading: "情報",
      socialHeading: "SNS",
      contact: "お問い合わせ",
      copyright: "© 2026 Clash Anime. All rights reserved.",
      about: "私たちについて",
      privacy: "プライバシーポリシー",
      cookies: "クッキーポリシー",
      disclaimer: "免責事項",
      eula: "エンドユーザーライセンス契約",
      terms: "利用規約",
      communityGuidelines: "コミュニティガイドライン",
      dmca: "デジタルミレニアム著作権法",
      reportContent: "コンテンツの報告",
      arenaGuide: "英雄アリーナガイド",
    },
    blog: {
      hubBadge: "ナレッジハブ",
      hubTitle: "英雄アリーナガイド",
      hubSubtitle:
        "ガイド、レーダー分析、勝者ストーリー、アップデート、賞金、FAQ — ClashAnimeで順位アップと収益化のための記事。",
      heroTagline: "アリーナへ。クラッシュを上げろ。伝説になれ。",
      heroCarouselLabel: "英雄ガイドのカバースライダー",
      heroPrev: "前のスライド",
      heroNext: "次のスライド",
      heroGoToSlide: "スライド {n} へ",
      navHome: "ホーム",
      navAccount: "アカウント",
      backToGuide: "ガイド一覧へ",
      published: "公開日",
      minRead: "約{minutes}分",
      relatedArticles: "関連記事",
      notFound: "記事が見つかりません。",
      categories: {
        "user-guide": "ユーザーガイド",
        "radar-analysis": "レーダー分析",
        "winner-stories": "勝者ストーリー",
        "platform-updates": "プラットフォーム更新",
        "earnings-prizes": "賞金と収益",
        faq: "FAQ",
      },
      categoryHint: {
        "user-guide": "クラッシュ、アップロード、招待、ポイントの基本。",
        "radar-analysis": "トレンドアニメとクリップ傾向。",
        "winner-stories": "Top 12クリエイターの戦略。",
        "platform-updates": "24時間インスタントエピソードクラッシュなど。",
        "earnings-prizes": "ポイント、ClashCoins、シーズン賞。",
        faq: "全世界、KYC、税金、よくある質問。",
      },
      animeNews: {
        hubTitle: "最新アニメニュース",
        hubSubtitle:
          "アニメ界の最新ヘッドライン — ClashAnime向けに英語・アラビア語・日本語で編集。",
        sourceNote: "見出しはCrunchyroll News由来。要約はClashAnimeの編集です。",
        badge: "アニメニュース",
        backToNews: "ニュース一覧へ",
        sourceLabel: "原典",
        readOnCrunchyroll: "Crunchyrollで全文を読む",
        latestHeading: "その他の最新ニュース",
        topNewsHeading: "注目ニュース",
        relatedHeading: "関連記事",
        empty: "公開中のニュースはまだありません。管理画面 → アニメニュース で RSS 同期を実行してください。",
        viewAll: "すべてのニュースを見る",
        storyHeading: "アニメのストーリー",
        watchNowHeading: "今すぐ視聴",
        watchNowCta: "視聴を始める",
        openTracker: "今すぐ視聴をすべて見る →",
        watchNowPageSubtitle:
          "予告編、ポスター、伝説・アクション・恋愛などの厳選スポットライトをすべて表示します。",
        watchNowEmpty: "今すぐ視聴のスポットライトを読み込み中です。しばらくしてから再度お試しください。",
        openTrackerPage: "アニメトラッカーを開く",
        backToWatchNow: "今すぐ視聴に戻る",
        watchNowStoryHeading: "あらすじ",
        watchNowTrailerHeading: "予告編",
        watchTrailer: "予告を見る",
        hideTrailer: "予告を隠す",
        spotlightHeading: "定番アニメスポットライト",
        spotlightSubtitle:
          "伝説的作品から最新ヒットまで — ポスターと予告付きで常に更新。",
        spotlightCategories: {
          legends: "伝説 & 長編ヒット",
          action: "アクション & 新世代",
          mystery: "ミステリー・頭脳戦・スリラー",
          isekai: "異世界 & ファンタジー",
          sports: "スポーツアニメ",
          romance: "恋愛・日常・ドラマ",
          classics: "クラシック & 不朽の名作",
        },
      },
      seasonalGuide: {
        hubTitle: "季節アニメガイド",
        hubSubtitle:
          "Simulcastラインナップと配信カレンダー — Crunchyroll 2026年夏シーズンガイドより。",
        badge: "季節ガイド",
        sourceNote: "Crunchyroll 2026年夏ラインナップ",
        readFullGuide: "季節ガイド全文を読む",
        lineupHeading: "Simulcast全作品",
        lineupCount: "{count}作品",
        categoryNew: "新作",
        categoryReturning: "続編",
        categoryContinuing: "春から継続",
        categoryComingSoon: "近日公開",
        comingSoon: "近日公開",
        weeklySimulcast: "週次配信",
        moreTitles: "他 {count} 作品は全文ガイドへ",
        lineupLoading: "Jikanからポスターとストーリーを読み込み中…",
      },
    },
    pages: {
      videosTitle: "すべての動画",
      videosSubtitle:
        "新着、トレンド、最新アニメ配信、近日配信、クリエイター対決を横スクロールで探索。",
      exclusivesTitle: "限定",
      exclusivesSubtitle: "認証済みクリエイターのクリップ。",
      animeTrackerTitle: "新作アニメレーダー",
      animeTrackerSubtitle: "Jikan（MyAnimeList）から取得したライブ放送表。今日の放送とリリースクラッシュをチェック。",
      communityTitle: "アニメコミュニティ",
      communitySubtitle: "クリエイターをフォローし、コメントしてグリッドを競おう。",
      communityBody:
        "コミュニティ機能は近日拡張予定です。動画カードからチャンネルを探索し、各クリップで会話に参加してください。",
      musicTitle: "ミュージック",
      musicSubtitle: "アニメOSTラジオとLofiビーツを流しながらサイト内を回れます。",
      musicBody: "下のプレイヤーを開始して、動画やコミュニティを見ながら聴き続けられます。",
      emptyVideos: "承認済みの動画はまだありません。",
      emptyExclusives: "認証済みクリエイターの限定クリップはまだありません。",
      videosSearchPlaceholder: "アニメを検索...",
      videosSearchResults: "{count} 件の動画",
      emptyVideoSearch: "「{query}」に一致する動画はありません。",
    },
    videosPage: {
      shelfNew: "新着動画",
      shelfTrending: "いま話題",
      shelfLatestAnime: "最新アニメ配信",
      shelfComingSoon: "近日配信",
      shelfUserDuels: "クリエイター対決",
      newBadge: "新着",
      comingSoonBadge: "近日",
      duelDefender: "対象",
      duelChallenger: "挑戦",
      duelVersus: "vs {title}",
      watchDuel: "対決を見る",
      searchResultsTitle: "検索結果",
      emptyDuels: "まだクリエイター対決はありません。動画カードから挑戦してください。",
    },
    hashtag: {
      statsLine: "{videos} 本の動画 · {channels} チャンネル",
      emptyVideos: "「#{tag}」タグの承認済み動画はまだありません。",
      allTab: "すべて",
    },
    animeTracker: {
      badge: "新作レーダー",
      todayTitle: "本日の放送",
      upcomingTitle: "近日公開",
      activeClashesTitle: "開催中のリリースクラッシュ",
      liveClashBadge: "リリースクラッシュ開催中",
      enterClash: "クラッシュへ",
      clipCount: "{count} 本のクリップが参加中",
      noToday: "本日予定の放送はまだありません。",
      noUpcoming: "14日以内の予定はありません。",
      episodeLabel: "第{episode}話",
      scheduledHint: "放送日に自動で特別クラッシュが開始されます。",
      backToTracker: "レーダーに戻る",
      clashSubtitle: "この作品のハッシュタグ付きクリップを24時間以内に投稿。エンゲージメント最高者が+2,000ポイントを獲得。",
      uploadClip: "クリップをアップロード",
      matchTagsHint: "アップロード時に {tags} などのタグを付けて参加。",
      copyHashtag: "コピー",
      copyHashtagDone: "コピー済み",
      leaderboardTitle: "現在のベストクリップ",
      noClipsYet: "まだクリップがありません。最初のシーンを投稿しよう。",
      bannerBadge: "話題の新作",
      bannerTitle: "{title} が公開 — リリースクラッシュに参加",
      jikanSource: "MAL",
      storyTitle: "あらすじ",
      trendingSpotlightTitle: "今、トレンドとアリーナを席巻しているアニメ10選",
      trendingClashBadge: "トレンドクラッシュ",
      episodesTotalLabel: "全{count}話",
      trendingSyncPending: "管理画面からトレンドスポットライトを同期すると、ポスター・評価・クラッシュが表示されます。",
      scoreLabel: "スコア {score}",
      rankLabel: "ランク #{rank}",
      malLink: "MyAnimeListで見る →",
      instantEpisodeBadge: "24時間エピソードクラッシュ",
      instantEpisodeTitle: "{title} · 第{episode}話",
      instantEpisodeSubtitle:
        "今すぐベストシーンを投稿。24時間以内のクリップのみ対象 — エンゲージメント最高者が勝利。",
      instantEpisodeRewards: "勝者: +{points}ポイント",
      instantEpisodeCountdown: "残り時間",
      instantEpisodeHours: "時間",
      instantEpisodeMinutes: "分",
      instantEpisodeSeconds: "秒",
      instantEpisodeCta: "クラッシュに参加",
      instantEpisodeEnded: "このクラッシュの受付は終了しました。",
    },
    exclusives: {
      dailyHallBadge: "デイリー殿堂",
      dailyHallTitle: "デイリー殿堂",
      dailyHallSubtitle: "今日いちばんポイントを獲得したハンターが頂点に立ちます。",
      interactionKing: "今日の交流王",
      pointsToday: "pt 今日",
      noDailyLeader: "まだ今日の王者はいません。いいね、投稿、招待で王座を狙おう。",
      hallOfLegendsBadge: "伝説の殿堂",
      hallOfLegendsTitle: "伝説の殿堂",
      hallOfLegendsSubtitle:
        "過去シーズンの王者を永久保存。ここに名を刻んだクリエイターが次のハンターの目標になる。",
      noHallOfLegends:
        "まだアーカイブされたシーズン王者はいません。シーズン終了時に上位3位がここに保存されます。",
      seasonWinnerRank: "第{rank}位",
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
      cannotChallengeOwnClip: "自分の動画には挑戦できません。",
      loginToChallenge: "登録して動画に挑戦し、デュエルポイントを獲得しましょう。",
      challengeFailed: "対決を開始できませんでした。別の動画を選んでください。",
      challengeDuelBadge: "クイック挑戦",
      challengeDuelTitle: "クリップ対決",
      challengeDuelPageDesc: "2人のクリエイター、1つの舞台。いいねとコメントでより強い動画を決めよう。",
      clipChallengeExclusivesDesc:
        "動画ページを開き、自分以外の承認済み動画の下にある「この動画に挑戦」を押してください。",
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
      pointsWagerInviteAlertTitle: "ポイント挑戦が届きました！",
      pointsWagerInviteAlertBody:
        "{user} が {wager} pt の挑戦を送りました。勝者は {pot} pt を獲得します。",
      rejectWagerDuel: "拒否",
      rejectingWager: "拒否中...",
      viewWagerOnExclusives: "限定ページで見る",
      pointsWagerAlertSoundHint: "受け入れるか拒否すると通知音が止まります。",
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
      closePlayer: "ラジオを閉じる",
      streamError: "ストリームに接続できませんでした。しばらくして再試行してください。",
      poweredBy: "OST配信: LISTEN.moe / Lofi: Nightwave Plaza",
    },
    lounge: {
      badge: "アニメ・ビーツ・ラウンジ",
      title: "アニメ・ビーツ・ラウンジ",
      subtitle: "コミュニティが選んだ最高のアニメ音楽プレイリスト。投票して、サイト内を回りながら聴き続けよう。",
      tabRadio: "ライブラジオ",
      tabLounge: "ビーツ・ラウンジ",
      keepListening: "動画やコミュニティを見ながら聴き続けられます。",
      play: "再生",
      pause: "一時停止",
      mute: "ミュート",
      unmute: "ミュート解除",
      volume: "音量",
      nowPlaying: "再生中",
      playing: "再生中",
      communityPlaylist: "コミュニティプレイリスト",
      pickTrack: "曲を選んで開始",
      previous: "前へ",
      next: "次へ",
      closePlayer: "プレイヤーを閉じる",
      playlistTitle: "コミュニティプレイリスト",
      emptyPlaylist: "承認済みの曲がまだありません。",
      voteTrack: "この曲に投票",
      loginToVote: "投票するにはログイン",
      nowPlayingBadge: "再生中",
      submitTitle: "曲を提案",
      submitDesc: "コミュニティに聴いてほしいアニメ曲のYouTubeリンクを送ってください。",
      trackTitlePlaceholder: "曲名",
      artistPlaceholder: "アーティスト",
      animePlaceholder: "アニメ名（任意）",
      youtubePlaceholder: "YouTube URL または ID",
      coverPlaceholder: "カバー画像URL（任意）",
      coverFromLibrary: "ライブラリから選択",
      coverOrLink: "または画像リンクを貼り付け",
      coverRemove: "カバーを削除",
      coverUploadFailed: "カバー画像をアップロードできませんでした。",
      submitButton: "審査に提出",
      submitting: "送信中...",
      submitSuccess: "提出しました。スタッフが審査します。",
      loginToSubmit: "曲を提案するにはログインしてください。",
      errorTitleRequired: "曲名を入力してください。",
      errorArtistRequired: "アーティスト名を入力してください。",
      errorYoutubeRequired: "YouTubeリンクまたはIDを入力してください。",
      errorYoutubeInvalid: "YouTubeリンクが正しくありません。",
      errorCoverInvalid: "カバー画像URLは http:// または https:// で始めてください。",
      playbackError:
        "この曲は再生できません（埋め込みが制限されている可能性があります）。次の曲へスキップします。",
      audioOnlyBadge: "音声のみ",
      backgroundListening: "動画やコミュニティを見ながらバックグラウンド再生が続きます。",
      unlockAudio: "ここをタップして音声を開始",
      audioSourceHint: "音が出ない場合は上のボタンを押してください。",
      playerLoading: "プレイヤーを読み込み中…",
      mySubmissionsTitle: "あなたの投稿",
      mySubmissionsDesc: "提案した曲です。審査前後を問わずいつでも削除できます。",
      mySubmissionsEmpty: "まだ曲を投稿していません。",
      mySubmissionsLoading: "投稿を読み込み中...",
      deleteTrack: "削除",
      deletingTrack: "削除中...",
      deleteTrackConfirm: "この曲を投稿一覧から削除しますか？",
      deleteTrackSuccess: "曲を削除しました。",
      deleteTrackFailed: "削除できませんでした。もう一度お試しください。",
      statusPending: "審査中",
      statusApproved: "承認済み",
      statusRejected: "却下",
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
    contact: {
      pageTitle: "お問い合わせ",
      pageSubtitle:
        "問題の内容をお送りください。できるだけ早くご返信します。詳細があるほどスムーズに対応できます。",
      formTitle: "お問い合わせフォーム",
      emailLabel: "メールアドレス",
      emailPlaceholder: "you@example.com",
      messageLabel: "問題の内容",
      messagePlaceholder: "何が起きましたか？手順、リンク、エラーメッセージがあれば記載してください。",
      whatsappLabel: "WhatsApp / 電話",
      whatsappPlaceholder: "+81 90 XXXX XXXX",
      optional: "任意",
      required: "必須",
      submit: "送信する",
      submitting: "送信中...",
      success: "送信しました。チームから折り返しご連絡します。",
      failed: "送信できませんでした。もう一度お試しください。",
      emailInvalid: "有効なメールアドレスを入力してください。",
      messageTooShort: "問題の内容を10文字以上入力してください。",
      supportCardTitle: "ClashAnime サポート",
      supportCardDesc: "アカウント、アップロード、ClashCoins、技術的な問題をサポートします。",
      responseTime: "通常24〜48時間以内に返信します。",
      helpTitle: "サポート内容",
      helpGlobal: "グローバル対応 — アラビア語、英語、日本語。",
      helpWallet: "ClashCoins、出金、KYCに関する質問。",
      helpAccount: "ログイン、認証、BAN、アカウントセキュリティ。",
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
      signupCountryHint: "国は公開チャンネルの「概要」タブに表示されます。",
    },
    profile: {
      loading: "チャンネルを読み込み中...",
      loadFailed: "チャンネルを読み込めませんでした。",
      retry: "再試行",
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
      channelCommunity: "アニメコミュニティ",
      channelAbout: "概要",
      channelStats: "{followers} フォロワー · {videos} 本の動画 · {posts} 件の投稿",
      noChannelVideos: "このチャンネルにはまだ動画がありません。",
      noChannelPosts: "アニメコミュニティの投稿はまだありません。",
      postNowToCommunity: "今すぐ投稿",
      viewCommunityPost: "投稿を見る",
      channelPreviewTitle: "あなたのチャンネル",
      channelPreviewDesc: "訪問者に公開されるチャンネルページのプレビューです。",
      editChannelSettings: "チャンネル設定を編集",
      viewPublicChannel: "公開チャンネルを見る",
      channelAboutTab: "概要",
      channelMoreInfo: "詳細情報",
      channelJoinedDate: "参加日: {date}",
      channelFollowersStat: "{count} フォロワー",
      channelVideosStat: "{count} 本の動画",
      channelViewsStat: "{count} 回視聴",
      channelLifetimePointsStat: "累計獲得 {count} pt",
      shareChannel: "チャンネルを共有",
      reportUser: "ユーザーを報告",
      reportUserHint: "チャンネルを報告",
      channelLinkCopied: "チャンネルリンクをコピーしました。",
      channelShareFailed: "チャンネルを共有できませんでした。",
      profileCountry: "国",
      profileSocialLink: "SNSリンク",
      profileSocialPlaceholder: "https://youtube.com/@channel、instagram.com/you、tiktok.com/@you…",
      profileSocialHint: "YouTube、Instagram、TikTok、X、またはウェブサイトのURLを貼り付けてください。自動で判別します。",
      profileSocialDetected: "検出: {platform}",
      profileSocialSavedLinks: "保存済みリンク",
      profileSocialRemove: "削除",
      socialPlatforms: {
        youtube: "YouTube",
        instagram: "Instagram",
        tiktok: "TikTok",
        twitter: "X (Twitter)",
        website: "Website",
      },
      profileCountryRequired: "国を選択してください。",
      completeProfileTitle: "プロフィールを完成させる",
      completeProfileDesc: "公開チャンネルに表示する国を選択してください。",
      manageChannel: "チャンネルを管理",
      verifiedBadge: "認証済みチャンネル",
      displayNameCooldown: "チャンネル名はあと {days} 日で変更できます。",
      displayNameCooldownDays: "チャンネル名は14日に1回だけ変更できます。",
      username: "ユーザー名（@ハンドル）",
      usernameCooldown: "ユーザー名はあと {days} 日で変更できます。",
      usernameCooldownDays: "ユーザー名は30日に1回だけ変更できます。",
      usernameTaken: "このユーザー名は既に使用されています。",
      usernameInvalid: "ユーザー名は3文字以上（a-z、0-9、_）である必要があります。",
      deleteAccountTitle: "アカウント削除",
      deleteAccountWarning:
        "アカウント、動画、ポイント、ウォレットデータ、関連レコードが完全に削除されます。削除後は復元できません。",
      deleteAccountCheckbox: "アカウント削除は永久であり、元に戻せないことを理解しました。",
      deleteAccountTypeWord: "確認のため「{word}」と入力してください",
      deleteAccountButton: "アカウントを完全に削除",
      deleteAccountDeleting: "削除中...",
      deleteAccountFailed: "アカウントを削除できませんでした。もう一度お試しください。",
      deleteAccountWordMismatch: "確認ワードが一致しません。",
      deleteAccountConfirmRequired: "まず確認チェックボックスをオンにしてください。",
      editVideo: "動画を編集",
      deleteVideo: "削除",
      saveVideo: "保存",
      savingVideo: "保存中...",
      deletingVideo: "削除中...",
      cancelEdit: "キャンセル",
      confirmDeleteVideo: "この動画を完全に削除しますか？元に戻せません。",
      videoUpdated: "動画を更新しました。",
      videoDeleted: "動画を削除しました。",
      videoSaveFailed: "動画の保存に失敗しました。",
      videoDeleteFailed: "動画の削除に失敗しました。",
    },
    notifications: {
      bellLabel: "通知",
      title: "通知",
      subtitle: "ClashAnimeからの更新",
      markAllRead: "すべて既読",
      enableInApp: "アプリ内通知を有効にする",
      loading: "通知を読み込み中...",
      disabledHint: "通知をオンにするとここに表示されます。",
      empty: "通知はまだありません。",
      settingsLabel: "通知設定",
      settingsHint: "数字は未読件数です。通知を開くと既読になります。",
      mentionTitle: "メンションされました",
      mentionPreviewCommunity: "がコミュニティ投稿であなたをメンションしました。",
      mentionPreviewComment: "がコメントであなたをメンションしました。",
      types: {
        follow: { label: "フォロー", title: "新しいフォロワー", body: "{name}さんがあなたをフォローしました" },
        new_video: { label: "動画", title: "新しい動画", body: "{channel}が公開: {title}" },
        admin_video_review: {
          label: "管理",
          title: "動画の確認が必要",
          body: "{channel}が公開: {title}",
        },
        new_music: { label: "音楽", title: "新しい音楽", body: "{channel}がトラックを追加: {title}" },
        community_post: {
          label: "コミュニティ",
          title: "コミュニティ投稿",
          body: "{channel}がコミュニティに投稿しました",
          bodyWithPreview: "{channel}の投稿: {preview}",
        },
        video_duel: { label: "挑戦", title: "クリップ挑戦", body: "{name}さんがあなたのクリップに挑戦しました" },
        points_duel: { label: "ポイント対戦", title: "ポイント対戦の挑戦", body: "{name}さんが{points}ポイントで挑戦しました" },
        points_duel_accepted: { label: "対戦承諾", title: "対戦が承諾されました", body: "{name}さんがポイント対戦を承諾しました" },
        season_start: { label: "シーズン開始", title: "新シーズン開始", body: "{season}が開始しました。ランキングを目指そう！" },
        season_end: { label: "シーズン終了", title: "シーズン終了", body: "{season}が終了しました。殿堂をチェック！" },
        anime_release_clash: {
          label: "エピソードクラッシュ",
          title: "24時間エピソードクラッシュ",
          body: "{anime} は24時間限定で開催中！{hashtags} を付けてベストシーンを投稿。勝者は+2,000ポイント。",
        },
        episode_clash_winner: {
          label: "エピソード王",
          title: "あなたがエピソード王！",
          body: "{anime} 第{episode}話で勝利 — +{points}ポイントを獲得。",
        },
        episode_clash_crowned: {
          label: "王座決定",
          title: "エピソード王が決定",
          body: "{name} が {anime} 第{episode}話で勝利 — 24時間の窓は閉じました。",
        },
        video_like: {
          label: "いいね",
          title: "新しいいいね",
          body: "{name}さんがあなたのクリップにいいねしました",
          bodyWithTitle: "{name}さんがいいね: {title}",
        },
        video_comment: {
          label: "コメント",
          title: "新しいコメント",
          body: "{name}さんがあなたのクリップにコメントしました",
          bodyWithPreview: "{name}さん: {preview}",
        },
        comment_reply: {
          label: "返信",
          title: "新しい返信",
          body: "{name}さんがあなたのコメントに返信しました",
          bodyWithPreview: "{name}さん: {preview}",
        },
        comment_like: { label: "コメントいいね", title: "コメントにいいね", body: "{name}さんがあなたのコメントにいいねしました" },
        mention: { label: "メンション" },
        broadcast: { label: "一斉通知" },
        system: { label: "システム" },
        referral_signup: {
          label: "招待登録",
          title: "友達が参加",
          body: "{name}さんが招待リンクから登録しました（+{points} pt）",
        },
        referral_welcome: {
          label: "ウェルカムボーナス",
          title: "招待ボーナス",
          body: "@{username} のリンク経由で +{points} pt を獲得",
        },
        signup_welcome: {
          label: "登録ボーナス",
          title: "ClashAnimeへようこそ",
          body: "アカウント作成で +{points} pt を獲得しました",
        },
        referral_milestone: {
          label: "招待マイルストーン",
          title: "友達のマイルストーン",
          body: "{name} が {milestone}（+{points} pt）",
        },
        referral_tier_up: {
          label: "招待ランク",
          title: "新しい招待ランク",
          body: "{count} 人招待で {tier} ランクに到達",
        },
      },
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
      referralHintV2:
        "リンクを共有しましょう。新規アカウントはウェルカムポイントを獲得し、招待リンク経由なら追加報酬があります。",
      referralSystemLabel: "招待プログラム",
      referralDoubleSidedTitle: "あなたと友達への報酬",
      referralStatsTitle: "招待統計",
      referralStatsTotal: "合計招待",
      referralStatsWeek: "今週",
      referralStatsVideoBonus: "初動画ボーナス",
      referralStatsBattleBonus: "初バトルボーナス",
      referralMilestoneTitle: "招待ランク進捗",
      referralMaxTier: "最高ランク到達",
      referralCosmeticHint: "ランクが上がると名前色とアバター枠が解放されます。",
      referralFlashActive: "フラッシュイベント中: 登録ポイント {multiplier} 倍",
      referralLeaderboardTitle: "招待リーダーボード",
      referralLeaderboardWeek: "今週",
      referralLeaderboardAll: "全期間",
      referralLeaderboardEmpty: "まだ招待がありません。",
      referralLeaderboardInvites: "招待",
      referralTiers: {
        scout: "スカウト · 5人",
        recruit: "リクルート · 20人",
        leader: "リーダー · 50人",
      },
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
        referralSignupYou: "友達がリンク経由で登録したとき",
        referralSignupFriend: "友達のリンク経由で登録（+50 pt 追加）",
        signupWelcome: "新規アカウント作成時",
        referralFirstVideo: "招待した友達が初動画をアップロード",
        referralFirstBattle: "招待した友達が初バトルに参加",
        videoLike: "動画にいいね",
        videoUpload: "承認されたオリジナル動画のアップロード",
        communityPost: "コミュニティへの投稿",
        trendingBonus: "トレンドグリッド入り",
      },
      transactionReasons: {
        referral_click: "招待リンク訪問",
        referral_signup: "友達の新規登録",
        referral_welcome: "招待ウェルカムボーナス",
        signup_welcome: "アカウント登録ボーナス",
        referral_first_video: "友達の初動画",
        referral_first_battle: "友達の初バトル",
        video_like: "動画いいね",
        video_upload: "承認済みアップロード",
        community_post: "コミュニティ投稿",
        trending_bonus: "トレンド報酬",
        video_duel_challenge: "クリップ挑戦デュエル",
        points_duel_stake: "ポイント対決の賭け",
        points_duel_win: "ポイント対決の勝利",
        points_duel_refund: "ポイント対決の返金",
        clash_coin_conversion: "ClashCoinsへ変換",
      },
    },
    wallet: {
      title: "ClashCoins",
      subtitle: "デジタルウォレット",
      description:
        "換金可能なドル残高です。ハンターポイントを$に変換し、銀行振込・PayPal・USDTで出金できます。",
      balanceLabel: "ウォレット残高",
      exchangeRateTitle: "為替レート",
      exchangeRateValue: "10,000ポイント = $10.00",
      minPayoutTitle: "最低出金",
      hunterPointsLabel: "利用可能なハンターポイント",
      convertTitle: "ポイントを$残高に変換",
      convertDesc: "固定レートでポイントを交換します。残高はセント単位で保存されます。",
      convertAmountLabel: "変換するポイント",
      convertPreview: "受け取る金額: {amount}",
      convertButton: "今すぐ変換",
      convertSuccess: "ポイントを$残高に変換しました。",
      convertFailed: "変換できませんでした。残高を確認してください。",
      convertMinError: "最低変換は100ポイント（$0.10）です。",
      withdrawTitle: "出金リクエスト",
      withdrawDesc: "銀行振込、PayPal、USDTから出金方法を選べます。",
      withdrawAmountLabel: "出金額 ($)",
      selectPaymentMethod: "出金方法",
      bankTransferTitle: "銀行振込",
      bankTransferDesc: "IBAN、口座名義、受取人メールを入力してください。",
      paypalTitle: "PayPal",
      paypalDesc: "PayPalアカウントのメールアドレスに送金します。",
      paypalEmailLabel: "PayPalメール",
      paypalEmailPlaceholder: "your@paypal.com",
      usdtTitle: "Crypto USDT",
      usdtDesc: "USDTウォレットに送金します。ネットワークを必ず確認してください。",
      usdtWalletLabel: "USDTウォレットアドレス",
      usdtWalletPlaceholder: "ウォレットアドレス",
      usdtNetworkLabel: "ネットワーク",
      ibanLabel: "IBAN",
      ibanPlaceholder: "DE89 3704 0044 0532 0130 00",
      accountHolderLabel: "口座名義",
      accountHolderPlaceholder: "銀行口座の名義人",
      recipientEmailLabel: "受取人メール",
      recipientEmailPlaceholder: "name@email.com",
      kycAcknowledgement:
        "提出した本人情報が正確であり、利用規約のKYCポリシーに同意します。",
      kycRequired: "KYCポリシーへの同意が必要です。",
      kycApprovalRequired: "出金前に本人確認（KYC）の承認が必要です。",
      kycWithdrawLocked: "出金前にアカウントごとに1回KYCを完了し、承認を受けてください。",
      kycTitle: "本人確認（KYC）",
      kycDesc: "ClashCoins出金前にアカウントごとに1回必要です。氏名、電話番号、住所を提出してください。",
      kycFirstNameLabel: "名",
      kycFirstNamePlaceholder: "身分証の名",
      kycLastNameLabel: "姓",
      kycLastNamePlaceholder: "身分証の姓",
      kycCountryLabel: "国",
      kycPhoneLabel: "電話番号",
      kycPhoneLocalPlaceholder: "9012345678",
      kycWhatsappTitle: "WhatsApp",
      kycWhatsappDesc: "KYCや出金の連絡はWhatsAppでも可能です。",
      kycWhatsappNumberLabel: "WhatsApp番号",
      kycWhatsappPlaceholder: "上と同じ、または別番号",
      kycWhatsappHint: "空欄の場合は上の電話番号をWhatsAppで使用します。",
      kycAddressLabel: "住所",
      kycAddressPlaceholder: "番地、市区町村、国、郵便番号",
      kycIdLabel: "公的身分証の写真",
      kycIdHint: "パスポート、マイナンバーカード、運転免許証などの鮮明な写真（最大10MB）。",
      kycIdRequired: "身分証の写真をアップロードしてください。",
      kycInvalidImage: "有効な画像ファイルを選択してください。",
      kycImageTooLarge: "身分証画像は10MB以下にしてください。",
      kycSubmitButton: "KYCを審査に提出",
      kycSubmitSuccess: "KYCを提出しました。承認後に出金が可能になります。",
      kycSubmitFailed: "KYCを提出できませんでした。",
      kycLoading: "KYCステータスを読み込み中...",
      kycPendingTitle: "KYC審査中",
      kycPendingDesc: "本人書類を確認中です。承認後に出金リクエストが可能になります。",
      kycApprovedTitle: "KYC承認済み",
      kycApprovedDesc: "本人確認が完了しました。出金リクエストが可能です。",
      kycRejectedTitle: "KYC却下",
      kycRejectedDesc: "KYCが却下されました。情報を更新して再提出してください。",
      withdrawButton: "出金をリクエスト",
      withdrawProcessingTime:
        "出金は手動で審査されます。承認後、通常24〜72時間以内にお支払いされます。",
      withdrawFailed: "出金リクエストを送信できませんでした。",
      withdrawMinError: "最低出金は$10.00です。",
      withdrawPendingNotice:
        "リクエストは審査中です。承認後、通常24〜72時間以内にお支払いされます。",
      fraudBlocked: "異常なポイント活動のため審査対象になりました。",
      processing: "処理中...",
      paymentOptionsTitle: "出金方法",
      paymentMethodLabels: {
        bank_transfer: "銀行振込",
        paypal: "PayPal",
        crypto_usdt: "Crypto USDT",
      },
      historyTitle: "出金履歴",
      loadingHistory: "履歴を読み込み中...",
      noHistory: "出金リクエストはまだありません。",
      legalNote: "出金は不正防止チェックと税務記録の対象です。",
      withdrawalStatuses: {
        pending: "審査待ち",
        reviewing: "審査中",
        completed: "支払い済み",
        rejected: "拒否",
        fraud_blocked: "不正審査",
      },
    },
    communityFeed: {
      postPublished: "投稿しました。",
      postLevelRequired:
        "コミュニティへの投稿はハンターランク C・A・S（1000pt以上）のみ可能です。投稿の閲覧とコメントはできます。",
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
      title: "動画をアップロード",
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
      publishedLive:
        "動画が公開されました。後ほどチームが確認する場合があります。",
      scanFailed: "ファイルを検証できませんでした。別の書き出しで再試行してください。",
      uploadFailed: "ファイルをアップロードできませんでした。しばらくして再試行してください。",
      r2UploadBlocked:
        "Cloudflare R2 へのアップロードがブロックされました。バケットの CORS 設定を確認してください。",
      uploadsDisabled: "動画アップロードは一時的に停止されています。",
      accountBanned: "アカウントが停止されているため、アップロードできません。",
      levelRequired: "Challengerランク（1000pt以上）でアップロードできます。",
      clashUploadTitle: "{anime} のリリースクラッシュ用アップロード",
      clashUploadHint: "次のハッシュタグが自動で追加されます: {tags}",
      backToClash: "クラッシュに戻る",
      hashtagUsageCount: "{count} 本の動画",
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
      lifetimePoints: "累計獲得",
      level: "レベル",
      verificationRequests: "認証リクエスト",
      approveVerification: "認証を承認",
      rejectVerification: "認証を却下",
      viewChannel: "チャンネルを見る",
      channelHasCover: "カバー",
      channelHasBio: "概要",
      channelHasYoutube: "YouTube",
      channelHasInstagram: "Instagram",
      channelHasTiktok: "TikTok",
      channelHasTwitter: "X",
      channelHasWebsite: "Website",
      suspicionScore: "疑わしさスコア",
      globalRank: "世界ランク",
      clashRank: "クラッシュ順位",
      awaitingAdminReview: "レビュー待ち",
      markReviewed: "レビュー済みにする",
      inClashTop: "クラッシュ上位12",
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
      withdrawalsTitle: "ClashCoin出金",
      withdrawalsSubtitle: "出金リクエスト、不正フラグ、支払い情報を確認します。",
      noWithdrawals: "該当する出金リクエストがありません。",
      kycTitle: "出金KYC本人確認",
      kycSubtitle: "出金を有効にする前に本人書類、電話、住所を確認します。",
      noKycSubmissions: "該当するKYC提出がありません。",
      approveKyc: "KYCを承認",
      rejectKyc: "KYCを却下",
      kycRejectNotesPrompt: "却下理由（任意・ユーザーに表示）:",
      kycStatuses: {
        pending: "審査待ち",
        approved: "承認済み",
        rejected: "却下",
      },
      contactTitle: "お問い合わせ",
      contactSubtitle: "ユーザーからのサポートメッセージを確認し返信します。",
      noContactMessages: "該当するお問い合わせがありません。",
      contactReply: "スタッフ返信 / メモ",
      contactReplyPlaceholder: "返信内容や対応メモ...",
      saveContactReply: "返信を保存",
      markContactReplied: "返信済みにする",
      markContactClosed: "クローズ",
      sendContactReplyEmail: "メールで返信を送信",
      sendingContactReply: "送信中...",
      contactReplySent: "ユーザーに返信メールを送信しました。",
      contactReplyFailed: "返信メールを送信できませんでした。",
      contactStatuses: {
        open: "未対応",
        replied: "返信済み",
        closed: "クローズ",
      },
      emailsTitle: "トランザクションメール",
      emailsSubtitle: "ウェルカムメールなど、ユーザーへ送った自動メールの記録です。",
      noEmails: "まだメール記録がありません。",
      emailsFilterAll: "すべて",
      emailStatuses: {
        pending: "保留",
        sent: "送信済み",
        failed: "失敗",
      },
      emailsTable: {
        when: "日時",
        to: "宛先",
        type: "種類",
        locale: "言語",
        status: "状態",
        user: "ユーザー",
        actions: "操作",
      },
      emailRetry: "再送信",
      emailRetrying: "再送信中...",
      emailRetrySuccess: "メールを送信しました。",
      emailRetryFailed: "メールを再送信できませんでした。",
      accountDeletionsTitle: "削除されたアカウント",
      noAccountDeletions: "まだ削除記録がありません。",
      accountDeletionsTable: {
        when: "日時",
        email: "メール",
        name: "名前",
        farewell: "お別れメール",
      },
      inAppNotificationsTitle: "アプリ内通知",
      inAppNotificationsFilterAll: "すべての種類",
      noInAppNotifications: "まだアプリ内通知の記録がありません。",
      inAppNotificationsTable: {
        when: "日時",
        user: "ユーザー",
        type: "種類",
        title: "タイトル",
        read: "既読",
      },
      broadcastTitle: "一斉メール",
      broadcastSubtitle: "登録ユーザー全員にブランド付きメールを一括送信します。",
      broadcastComposeTitle: "メール作成",
      broadcastSubjectLabel: "件名",
      broadcastMessageLabel: "本文",
      broadcastPersonalizeHint: "{user_name} で各ユーザーに名前を差し込めます。",
      broadcastCtaLabel: "ボタン文言（任意）",
      broadcastCtaUrlLabel: "ボタンリンク",
      broadcastConfirmCheckbox: "全ユーザーに送信することを理解しました。",
      broadcastSendButton: "全員に送信",
      broadcastSending: "送信中...",
      broadcastUsersTitle: "全ユーザー",
      broadcastNoUsers: "メール付きユーザーが見つかりません。",
      broadcastUsersTable: { email: "メール", name: "名前" },
      broadcastConfirm: "今すぐ {count} 人に送信しますか？",
      broadcastSendSuccess: "{sent}/{total} 件送信。失敗: {failed}",
      broadcastSendFailed: "一斉送信に失敗しました。",
      broadcastLoadFailed: "ユーザーを読み込めませんでした。",
      broadcastHistoryTitle: "送信履歴",
      broadcastNoHistory: "まだ一斉送信はありません。",
      broadcastHistoryTable: {
        when: "日時",
        subject: "件名",
        sent: "送信",
        failed: "失敗",
        status: "状態",
      },
      approveWithdrawal: "支払い済みにする",
      rejectWithdrawal: "拒否して返金",
      markReviewing: "審査中にする",
      clashCoins: "ClashCoins",
      paymentMethod: "支払い方法",
      paymentDestination: "送金先",
      fraudFlags: "不正フラグ",
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
        withdrawals: "出金",
        kyc: "出金KYC",
        seasons: "クラッシュシーズン",
        legends: "伝説の殿堂",
        beatsLounge: "アニメ・ビーツ・ラウンジ",
        animeTracker: "新作アニメレーダー",
        blog: "アリーナガイド",
        animeNews: "アニメニュース",
        contact: "お問い合わせ受信箱",
        emails: "メール",
        referrals: "招待プログラム",
        broadcast: "一斉メール",
      },
      referrals: {
        title: "招待プログラム",
        subtitle: "招待実績、週間リーダー、フラッシュ倍率イベントを管理します。",
        totalSignups: "招待登録の合計",
        weekSignups: "今週の登録",
        activeFlash: "アクティブなフラッシュ",
        flashEventsTitle: "フラッシュ招待イベント",
        flashEventsEmpty: "フラッシュイベントはまだありません。",
        createFlashTitle: "フラッシュイベント作成",
        titleEn: "タイトル（英語）",
        titleAr: "タイトル（アラビア語）",
        titleJa: "タイトル（日本語）",
        multiplier: "倍率",
        startsAt: "開始",
        endsAt: "終了",
        createButton: "イベント作成",
        creating: "作成中...",
        created: "フラッシュイベントを作成しました。",
        deactivate: "無効化",
        leaderboardTitle: "トップ招待者",
        periodWeek: "今週",
        periodAll: "全期間",
        table: {
          title: "タイトル",
          multiplier: "倍率",
          window: "期間",
          status: "状態",
          actions: "操作",
        },
      },
      seasons: {
        title: "クラッシュシーズン",
        subtitle: "シーズンの開始・終了と、バトルページのカウントダウンを管理します。",
        activeNow: "現在のシーズン",
        noActive: "アクティブなシーズンがありません。カウントダウンを表示するには開始してください。",
        createTitle: "シーズン作成",
        quickStartTitle: "新シーズン開始",
        quickStartDesc: "現在のシーズンを終了し、新しい30日シーズンをすぐに開始します。",
        listTitle: "すべてのシーズン",
        nameLabel: "シーズン名",
        startsAtLabel: "開始日",
        endsAtLabel: "終了日",
        durationDaysLabel: "期間（日）",
        activateOnCreate: "すぐに有効化",
        createButton: "シーズン作成",
        startNewButton: "新シーズンを今すぐ開始",
        editButton: "日付を編集",
        activateButton: "有効化",
        endButton: "シーズン終了",
        autoNamePlaceholder: "空欄なら自動命名",
        editNamePrompt: "シーズン名",
        editStartPrompt: "開始 (YYYY-MM-DDTHH:mm)",
        editEndPrompt: "終了 (YYYY-MM-DDTHH:mm)",
        empty: "シーズンがありません。",
        created: "シーズンを作成しました。",
        updated: "シーズンを更新しました。",
        activated: "シーズンを有効化しました。",
        ended: "シーズンを終了しました。",
        startedNew: "新シーズンを開始しました。",
        prizeSectionTitle: "現金賞金（USD）",
        prizeRank1Label: "1位の賞金（$）",
        prizeRank2Label: "2位の賞金（$）",
        prizeRank3Label: "3位の賞金（$）",
        prizeSaveButton: "賞金を保存",
        prizesSaved: "賞金額を保存しました。",
        statusLabels: {
          scheduled: "予定",
          active: "有効",
          ended: "終了",
        },
      },
      legends: {
        title: "伝説の殿堂",
        subtitle: "過去シーズンの王者をアーカイブし、サイト全体で表示します。",
        statsArchived: "アーカイブ済みシーズン",
        statsEnded: "終了シーズン",
        statsWinners: "総勝者数",
        seasonListTitle: "シーズンアーカイブ",
        openSeasons: "シーズン管理を開く",
        emptySeasons: "シーズンがありません。",
        winnersCount: "{count} 人をアーカイブ",
        viewWinners: "勝者を見る",
        snapshotButton: "勝者をアーカイブ",
        resnapshotButton: "再アーカイブ",
        winnersTitle: "勝者 — {season}",
        noWinners: "このシーズンの勝者はまだありません。",
        deleteWinner: "削除",
        deleteConfirm: "この勝者を殿堂から削除しますか？",
        deleted: "勝者を削除しました。",
        snapshotSuccess: "{count} 人の勝者をアーカイブしました。",
      },
      beatsLounge: {
        title: "アニメ・ビーツ・ラウンジ",
        subtitle: "コミュニティ提出を審査し、/music のプレイリストを管理します。",
        pendingCount: "審査待ち",
        approvedCount: "承認済み",
        totalVotes: "投票数",
        addTrackTitle: "曲を直接追加",
        titleLabel: "曲名",
        artistLabel: "アーティスト",
        animeLabel: "アニメ（任意）",
        youtubeLabel: "YouTube URL / ID",
        sortLabel: "並び順（大きいほど先）",
        addButton: "ラウンジに追加",
        queueTitle: "すべての曲",
        empty: "曲がありません。",
        approveButton: "承認",
        rejectButton: "却下",
        deleteButton: "削除",
        deleteConfirm: "この曲を削除しますか？",
        created: "曲を追加しました。",
        approved: "承認しました。",
        rejected: "却下しました。",
      },
      animeTracker: {
        title: "新作アニメレーダー",
        subtitle: "放送スケジュールを管理し、Jikan（MyAnimeList）同期とリリースクラッシュの自動開始を行います。",
        todayCount: "本日の放送",
        upcomingCount: "近日（14日）",
        activeClashes: "開催中のクラッシュ",
        syncButton: "Jikan + トレンド同期",
        syncTrendingButton: "トレンドスポットライトのみ同期",
        syncing: "同期中…",
        syncSuccess: "スケジュール: {scheduleSynced} 件同期、{scheduleOpened} クラッシュ開始。トレンド: {trendingSynced}/{trendingTotal} 件同期。",
        syncTrendingSuccess: "トレンドスポットライト: Jikanから {synced}/{total} 件同期。",
        syncFailed: "Jikan同期に失敗しました。",
        syncTrendingFailed: "トレンドスポットライトの同期に失敗しました。",
        trendingListTitle: "トレンドスポットライト（トップ10）",
        lastAutoSyncLabel: "最終自動同期",
        autoSyncHint: "スケジュール・トレンドTOP10・終了処理・報酬・24時間クラッシュは30分ごとのVercel cronで自動更新（CRON_SECRET設定時はGitHub Actionsも）。レーダー表示時も古ければ同期。",
        addTitle: "手動で追加",
        titleLabel: "アニメタイトル",
        titleArLabel: "アラビア語タイトル（任意）",
        titleJaLabel: "日本語タイトル（任意）",
        synopsisEnLabel: "英語のあらすじ（任意）",
        synopsisArLabel: "アラビア語のあらすじ（任意）",
        synopsisJaLabel: "日本語のあらすじ（任意）",
        episodeLabel: "話数",
        posterLabel: "ポスターURL（任意）",
        tagsLabel: "一致ハッシュタグ（カンマ区切り、任意）",
        openClashNow: "すぐにリリースクラッシュを開始",
        addButton: "追加",
        listTitle: "すべてのリリース",
        empty: "リリースがありません。",
        openClashButton: "クラッシュ開始",
        viewClash: "クラッシュを見る",
        deleteButton: "削除",
        deleteConfirm: "このリリースを削除しますか？",
        created: "リリースを追加しました。",
        clashOpened: "リリースクラッシュを開始しました。",
        seoTitle: "Google SEOキーワード",
        seoAnimeCount: "Jikan/DBの {count} 件のアニメタイトルが検索メタデータに反映（英/阿/日）。",
        seoKeywordCount: "公開ページで {count} 件のユニークキーワードが有効。",
        instantEpisodeHint:
          "エピソード放送時に24時間限定のインスタントクラッシュが開催されます。エンゲージメント最高のクリップが自動で勝利します。",
        instantEpisodeRewards: "勝者報酬: +{points}ポイント",
        instantEpisodeActiveTitle: "開催中の24時間エピソードクラッシュ",
        instantEpisodeHistoryTitle: "最近のエピソードクラッシュと勝者",
        clashClosesAt: "終了 {time}",
        clashWinner: "勝者: {name} (+{points} pt)",
        clashNoWinner: "対象クリップなしで終了",
        clashEnded: "終了 {time}",
        clashStatusActive: "開催中 · 24時間",
      },
      blog: {
        title: "アリーナガイド（ブログ）",
        subtitle: "コードベースの静的SEO記事 — DBのCMSはありません。",
        staticNote: "記事は /blog のファイルです。gitデプロイで更新。このパネルは閲覧のみ。",
        heroSlides: {
          title: "ヒーローカバースライダー",
          subtitle:
            "英雄ガイド（/blog）用のワイドバナーを最大10枚アップロード。サイト上で自動・手動切り替えできます。",
          displayTitle: "カバー表示設定",
          displaySubtitle: "サイトでの表示、テキスト枠、暗いオーバーレイの強さを調整します。",
          carouselEnabled: "サイトでスライダーを表示",
          showTextOverlay: "中央テキスト枠を表示",
          overlayOpacity: "暗いオーバーレイの強さ",
          autoPlaySeconds: "自動切り替え間隔",
          objectPosition: "画像のトリミング位置",
          objectCenter: "中央",
          objectTop: "上",
          objectBottom: "下",
          objectLeft: "左",
          objectRight: "右",
          previewOnSite: "サイトでプレビュー",
          save: "スライダーを保存",
          saving: "保存中...",
          saved: "ヒーロースライダーを保存しました。",
          loading: "スライドを読み込み中...",
          upload: "画像をアップロード",
          uploading: "アップロード中...",
          uploaded: "スライド {n} をアップロードしました — 公開するには保存してください。",
          remove: "削除",
          enabled: "表示",
          emptySlot: "画像なし",
          slotLabel: "スライド {n}",
          slotsMeta: "{max} 枠中 {active} 件が有効",
        },
        articlesCount: "公開記事 {count} 件",
        category: "カテゴリ",
        published: "公開日",
        readingTime: "読了時間",
        viewOnSite: "サイトで見る",
        openHub: "ガイド一覧",
      },
      animeNews: {
        title: "アニメニュースハブ",
        subtitle:
          "Crunchyroll RSSを同期し、EN/AR/JAの要約とトピックを書いて /blog/anime-news に公開します。",
        syncNow: "RSSを同期",
        syncing: "同期中...",
        syncSuccess: "RSS同期完了 — 新規 {inserted}、更新 {updated}。",
        featuredGuideSynced: "季節ガイド同期: {slug}",
        featuredLineupSynced: "ラインナップ {count} 作品を同期",
        spotlightSynced: "スポットライト {count} 作品を同期（ポスター {enriched}）",
        featuredBadge: "注目 · ブログスポット",
        viewOnBlog: "ブログで見る",
        saved: "記事を保存しました。",
        saving: "保存中...",
        saveDraft: "下書き保存",
        publish: "公開",
        edit: "編集",
        collapse: "閉じる",
        viewOnSite: "サイトで見る",
        sourceLink: "Crunchyroll原典",
        openHub: "公開ハブを開く",
        loading: "記事を読み込み中...",
        empty: "記事がありません。RSS同期を実行してください。",
        meta: "下書き {drafts} · 公開 {published}",
        lastSync: "最終同期:",
        needsTranslation: "AR/JA翻訳は任意",
        titlePlaceholder: "見出し",
        excerptPlaceholder: "独自の短い要約（2〜4文）",
        storyPlaceholder: "アニメのストーリー / 本文（複数段落）",
        topics: "トピック（カンマ区切り）",
        lineupCount: "ラインナップ {count} 作品",
        lineupPreview: "季節ラインナップ（毎日自動同期）",
        lineupMore: "他 {count} 作品",
      },
      hashtags: {
        title: "人気ハッシュタグ",
        subtitle: "承認済み動画で最も使われているタグ。各タグに公開ランディングページがあります。",
        viewPage: "ページを開く",
        empty: "使用中のハッシュタグはまだありません。",
      },
      videoOwnerEvents: {
        title: "クリエイターの動画変更",
        subtitle: "「あなたの動画」からの最近の編集・削除。",
        empty: "クリエイターによる変更はまだありません。",
        updated: "更新",
        deleted: "削除",
        viewVideo: "動画を見る",
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
        pendingWagerInvites: "保留中の賭け招待",
        pendingWithdrawals: "保留中の出金",
        pendingKyc: "保留中の出金KYC",
        openContactMessages: "未対応のお問い合わせ",
        welcomeEmailsSent: "送信済みウェルカムメール",
        accountDeletions: "削除されたアカウント",
        inAppNotifications: "アプリ内通知",
        legendWinners: "伝説の殿堂の勝者",
        referralSignups: "招待登録",
        referralWeekSignups: "招待登録（今週）",
      },
      platformHealth: {
        title: "プラットフォーム状態",
        subtitle: "AdSense設定とDBマイグレーション。",
        adsense: "Google AdSense",
        databaseSchema: "データベーススキーマ",
        configured: "Vercel にクライアントIDとスロットが設定済み。",
        missingEnv: "NEXT_PUBLIC_ADSENSE_CLIENT_ID と SLOT を設定してください。",
        active: "本番環境で訪問者向けに有効。",
        inactive: "環境変数で無効化されています。",
        checking: "確認中…",
        healthy: "最新マイグレーション適用済み。",
        needsMigration: "/api/health/schema の SQL を実行してください。",
        ok: "OK",
        actionNeeded: "要対応",
        monetizationApi: "収益化 API",
        schemaApi: "スキーマ API",
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
        reviewWithdrawals: "出金を審査",
        reviewWithdrawalsDesc: "ClashCoin出金リクエストを承認または拒否します。",
        reviewKyc: "出金KYCを審査",
        reviewKycDesc: "出金を有効にする前に本人確認書類を確認します。",
        reviewContact: "お問い合わせ",
        reviewContactDesc: "サポート依頼を確認し返信を記録します。",
      },
      table: {
        user: "ユーザー",
        role: "ロール",
        videos: "動画",
        communityPosts: "コミュニティ",
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
    common: {
      back: "رجوع",
      backToHome: "العودة للرئيسية",
      pageNotFoundTitle: "الصفحة غير موجودة",
      pageNotFoundBadge: "404",
      pageNotFoundDesc: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
      unexpectedErrorTitle: "حدث خطأ",
      unexpectedErrorDesc: "حدث خطأ غير متوقع. حاول مرة أخرى أو عد إلى الصفحة الرئيسية.",
      tryAgain: "حاول مرة أخرى",
    },
    nav: {
      clash: "النزالات",
      videos: "الفيديوهات",
      community: "المجتمع",
      music: "راديو الأنمي",
      exclusives: "حصري",
      animeTracker: "رادار الأنمي الجديد",
      hunterSystem: "نظام صياد الجوائز",
      bountyRewards: "آخر مكافآت الجوائز",
      inviteFriends: "ادعُ أصدقاءك",
      channelSettings: "إعدادات القناة",
      channel: "القناة",
      myVideos: "فيديوهاتك",
      settings: "الإعدادات",
      clashWallet: "محفظة ClashCoins",
      clashCoins: "ClashCoins",
      mobileBottomNav: "التنقل الرئيسي",
      more: "المزيد",
    },
    home: {
      titlePrimary: "Clash",
      titleSecondary: " Anime",
      subtitle:
        "أقوى ١٢ فيديو عالمياً حسب التفاعل الفوري. عند الوصول للمركز ١٢ يرتفع المقطع إلى النزالات.",
      liveClashCounterTitle: "عداد النزالات اللحظي",
      liveClashCounter:
        "حالياً في الساحة: {battles} نزالاً مشتعلاً.. {fighters} بطل يقاتل الآن!",
      gridLabel: "شبكة Clash Anime",
      clashLive: "نزال مباشر",
      podiumLabel: "منصة الصدارة",
      challengersLabel: "منافسو النزال",
      cashPrizeTitle: "جوائز مالية لأبطال النزال",
      cashPrizeSubtitle: "أعلى المراتب تحصل على مكافآت حقيقية كل موسم.",
      cashPrizeRank1: "المركز 1 ذهب",
      cashPrizeRank2: "المركز 2 فضة",
      cashPrizeRank3: "المركز 3 برونز",
      cashPrizeRankNumber: "المركز {rank}",
      cashPrizeRankWord: "المركز",
      cashPrizeRankSuffix: "",
      cashPrizeRevealLabel: "جائزة المركز {rank}",
      cashPrizeRevealHint: "تُصرف للفائز بعد انتهاء الموسم ومراجعة الفريق.",
      cashPrizeTapHint: "اضغط على مركز لعرض الجائزة المالية",
      clashCoinsTitle: "ClashCoins — محفظتك الرقمية",
      clashCoinsSubtitle: "حوّل نقاط الصياد إلى ClashCoins قابلة للسحب كأصول رقمية.",
      clashCoinsExchange: "١٠,٠٠٠ نقطة = ١٠$",
      clashCoinsMinPayout: "الحد الأدنى للسحب: ١٠$",
      clashCoinsOpenWallet: "افتح المحفظة",
      seasonCountdownLabel: "ينتهي الموسم خلال",
      seasonDays: "يوم",
      seasonHours: "ساعة",
      seasonMinutes: "دقيقة",
      seasonSeconds: "ثانية",
      seasonEnded: "انتهى الموسم",
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
      previousInFeed: "الفيديو السابق",
      nextInFeed: "الفيديو التالي",
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
    mobileApp: {
      menuTitle: "استكشف Clash Anime",
      menuSubtitle: "كل المزايا في مكان واحد",
      closeMenu: "إغلاق القائمة",
      preferences: "اللغة والمظهر",
      brandTitle: "كلاش أنمي",
      brandWordClash: "كلاش",
      brandWordAnime: " أنمي",
      installTitle: "ثبّت Clash Anime",
      installSubtitle: "أضف التطبيق إلى الشاشة الرئيسية للوصول السريع وتجربة ملء الشاشة.",
      installAction: "تثبيت التطبيق",
      installDismiss: "ليس الآن",
      installIosSteps: "اضغط {share} ثم اختر «إضافة إلى الشاشة الرئيسية».",
      installShare: "مشاركة",
      pullToRefresh: "اسحب للأسفل للتحديث",
      pullToRefreshRelease: "اترك للتحديث",
      refreshing: "جاري التحديث...",
    },
    legalHub: {
      pageTitle: "معلومات وقوانين",
      badge: "السياسات",
      subtitle: "اقرأ القوانين وسياسات الخصوصية وإرشادات المجتمع في مكان واحد.",
      rulesIntro: "شروط الاستخدام، الخصوصية، ملفات تعريف الارتباط، DMCA، وقواعد المنصة.",
      contactIntro: "تواصل مع الفريق، أبلغ عن محتوى، أو تصفّح دليل الأبطال.",
      viewAll: "عرض كل السياسات",
    },
    footer: {
      tagline: "نزالات أنمي مُرتَّبة حسب تفاعل المجتمع في الوقت الفعلي.",
      discoverHeading: "استكشف",
      informationHeading: "معلومات",
      socialHeading: "التواصل",
      contact: "اتصل بنا",
      copyright: "© 2026 Clash Anime. جميع الحقوق محفوظة.",
      about: "معلومات عنا",
      privacy: "سياسة الخصوصية",
      cookies: "سياسة ملفات تعريف الارتباط",
      disclaimer: "تنصل",
      eula: "اتفاقية ترخيص المستخدم النهائي",
      terms: "شروط الاستخدام",
      communityGuidelines: "إرشادات المجتمع",
      dmca: "قانون الألفية الرقمية لحقوق المؤلف",
      reportContent: "تقرير المحتوى",
      arenaGuide: "دليل الأبطال",
    },
    blog: {
      hubBadge: "مركز المعرفة",
      hubTitle: "دليل الأبطال",
      hubSubtitle:
        "شروحات، تحليلات الرادار، قصص الفائزين، تحديثات المنصة، الجوائز، وأسئلة شائعة — لترتيب أعلى وربح على ClashAnime.",
      heroTagline: "أدخل الساحة. ارفع نزالك. كُن الأسطورة.",
      heroCarouselLabel: "سلايدر غلاف دليل الأبطال",
      heroPrev: "الشريحة السابقة",
      heroNext: "الشريحة التالية",
      heroGoToSlide: "الانتقال إلى الشريحة {n}",
      navHome: "الرئيسية",
      navAccount: "الحساب",
      backToGuide: "العودة لدليل الأبطال",
      published: "نُشر",
      minRead: "{minutes} دقائق قراءة",
      relatedArticles: "مقالات ذات صلة",
      notFound: "المقالة غير موجودة.",
      categories: {
        "user-guide": "دليل المستخدم",
        "radar-analysis": "تحليلات الرادار",
        "winner-stories": "قصص الفائزين",
        "platform-updates": "تحديثات المنصة",
        "earnings-prizes": "الجوائز والربح",
        faq: "أسئلة شائعة",
      },
      categoryHint: {
        "user-guide": "تعلّم النزالات، الرفع، الدعوات، ونقاط الصياد.",
        "radar-analysis": "ترند الأنمي وأنماط اللقطات من الرادار.",
        "winner-stories": "كيف يصعد Top 12 في الساحة.",
        "platform-updates": "ميزات جديدة مثل نزال الحلقة الفوري 24 ساعة.",
        "earnings-prizes": "النقاط و ClashCoins والمواسم والسحب.",
        faq: "التوفر العالمي و KYC والضرائب وأسئلة شائعة.",
      },
      animeNews: {
        hubTitle: "آخر أخبار الأنمي",
        hubSubtitle:
          "عناوين مختارة من عالم الأنمي — بصياغة ClashAnime بالعربية والإنجليزية واليابانية.",
        sourceNote: "العناوين من Crunchyroll News. الملخصات تحرير ClashAnime.",
        badge: "أخبار الأنمي",
        backToNews: "العودة لآخر الأخبار",
        sourceLabel: "المصدر الأصلي",
        readOnCrunchyroll: "اقرأ التفاصيل على Crunchyroll",
        latestHeading: "المزيد من آخر أخبار الأنمي",
        topNewsHeading: "أهم الأخبار",
        relatedHeading: "مقالات ذات صلة",
        empty: "لا توجد أخبار منشورة بعد. افتح Admin → أخبار الأنمي واضغط Sync RSS now.",
        viewAll: "عرض كل الأخبار",
        storyHeading: "قصة الأنمي",
        watchNowHeading: "شاهد الآن",
        watchNowCta: "ابدأ المشاهدة",
        openTracker: "عرض كل شاهد الآن ←",
        watchNowPageSubtitle:
          "الإعلانات والغلافات وقائمة الأنميات المختارة كاملةً — الأساطير والأكشن والرومانس والمزيد.",
        watchNowEmpty: "قائمة شاهد الآن قيد التحميل. حاول مرة أخرى بعد قليل.",
        openTrackerPage: "افتح متتبع الأنمي",
        backToWatchNow: "العودة لشاهد الآن",
        watchNowStoryHeading: "القصة",
        watchNowTrailerHeading: "الإعلان",
        watchTrailer: "شاهد الإعلان",
        hideTrailer: "إخفاء الإعلان",
        spotlightHeading: "أهم الأنميات دائماً",
        spotlightSubtitle:
          "أساطير الأنمي والأعمال الرائجة — محدّثة باستمرار مع الغلافات والفيديوهات القصيرة.",
        spotlightCategories: {
          legends: "أساطير الأنمي والمسلسلات الطويلة",
          action: "أكشن والجيل الجديد",
          mystery: "غموض وذكاء وإثارة",
          isekai: "إيسكاي ومغامرات فانتازيا",
          sports: "أنميات رياضية",
          romance: "رومانسية وحياة يومية ودراما",
          classics: "كلاسيكيات وروائع خالدة",
        },
      },
      seasonalGuide: {
        hubTitle: "الدليل الموسمي",
        hubSubtitle:
          "دليل البث المباشر وتقويم الإصدارات — من دليل Crunchyroll لموسم صيف 2026.",
        badge: "دليل موسمي",
        sourceNote: "تشكيلة Crunchyroll — صيف 2026",
        readFullGuide: "اقرأ الدليل الموسمي كاملاً",
        lineupHeading: "تشكيلة البث المباشر الكاملة",
        lineupCount: "{count} عنوان",
        categoryNew: "انطلاقات جديدة",
        categoryReturning: "مواسم عائدة",
        categoryContinuing: "مستمرة من الربيع",
        categoryComingSoon: "قريباً",
        comingSoon: "قريباً",
        weeklySimulcast: "بث أسبوعي",
        moreTitles: "+{count} عنوان إضافي في الدليل الكامل",
        lineupLoading: "جاري تحميل الصور وقصص الأنمي من Jikan…",
      },
    },
    pages: {
      videosTitle: "كل الفيديوهات",
      videosSubtitle:
        "تصفّح الجديد والترند وآخر إصدارات الأنمي وقريباً وتحديات المستخدمين في صفوف أفقية.",
      exclusivesTitle: "حصري",
      exclusivesSubtitle: "مقاطع من القنوات الموثّقة على ClashAnime.",
      animeTrackerTitle: "رادار الأنمي الجديد",
      animeTrackerSubtitle: "جدول مباشر من Jikan (MyAnimeList). تابع ما يُعرض اليوم وادخل نزالات الإصدار لأفضل اللقطات.",
      communityTitle: "مجتمع الأنمي",
      communitySubtitle: "تابع المبدعين، علّق على النزالات، وتسلّق الشبكة معاً.",
      communityBody:
        "ميزات المجتمع قيد التوسع قريباً. استكشف القنوات من بطاقات الفيدio وشارك في النقاش على كل مقطع.",
      musicTitle: "الموسيقى",
      musicSubtitle: "راديو أنمي OST وإيقاعات Lofi أثناء تصفحك للموقع.",
      musicBody: "شغّل المشغّل أدناه واستمر بالاستماع أثناء مشاهدة الفيديوهات والمجتمع وقناتك.",
      emptyVideos: "لا توجد فيدioهات معتمدة بعد.",
      emptyExclusives: "لا توجد مقاطع حصرية من قنوات موثّقة بعد.",
      videosSearchPlaceholder: "ابحث عن أنمي...",
      videosSearchResults: "تم العثور على {count} فيديو",
      emptyVideoSearch: 'لا توجد فيديوهات لـ "{query}".',
    },
    videosPage: {
      shelfNew: "فيديوهات جديدة",
      shelfTrending: "الترند الآن",
      shelfLatestAnime: "آخر إصدارات الأنمي",
      shelfComingSoon: "قريباً",
      shelfUserDuels: "تحديات بين المستخدمين",
      newBadge: "جديد",
      comingSoonBadge: "قريباً",
      duelDefender: "المقطع",
      duelChallenger: "التحدي",
      duelVersus: "ضد {title}",
      watchDuel: "شاهد النزال",
      searchResultsTitle: "نتائج البحث",
      emptyDuels: "لا توجد تحديات بعد. تحدَّ أي مقطع من بطاقة الفيديو.",
    },
    hashtag: {
      statsLine: "{videos} فيديو · {channels} قناة",
      emptyVideos: 'لا توجد فيديوهات معتمدة بوسم "#{tag}" بعد.',
      allTab: "الكل",
    },
    animeTracker: {
      badge: "رادار الإصدارات",
      todayTitle: "يُعرض اليوم",
      upcomingTitle: "قريباً",
      activeClashesTitle: "نزالات الإصدار المباشرة",
      liveClashBadge: "نزال إصدار مباشر",
      enterClash: "ادخل النزال",
      clipCount: "{count} مقطع يتنافس",
      noToday: "لا توجد حلقات مجدولة لليوم بعد.",
      noUpcoming: "لا إصدارات خلال 14 يوماً القادمة.",
      episodeLabel: "الحلقة {episode}",
      scheduledHint: "يُفتح نزال خاص تلقائياً يوم الإصدار.",
      backToTracker: "العودة للرادار",
      clashSubtitle: "ارفع مقاطعك بوسم هذا الأنمي خلال 24 ساعة — الأعلى تفاعلاً يفوز بـ +2,000 نقطة.",
      uploadClip: "ارفع مقطعك",
      matchTagsHint: "استخدم وسوماً مثل {tags} في رفعك للانضمام لهذا النزال.",
      copyHashtag: "نسخ",
      copyHashtagDone: "تم النسخ",
      leaderboardTitle: "أفضل المقاطع الآن",
      noClipsYet: "لا مقاطع بعد. كن أول من ينشر مشهدًا من هذا الإصدار.",
      bannerBadge: "إصدار رائج",
      bannerTitle: "نزل {title} — انضم لنزال الإصدار",
      jikanSource: "MAL",
      storyTitle: "القصة",
      trendingSpotlightTitle: "10 أنميات تتصدر الترند والساحة حالياً",
      trendingClashBadge: "نزال ترند",
      episodesTotalLabel: "{count} حلقة",
      trendingSyncPending: "زامِن قائمة الترند من لوحة الإدارة لتحميل الصور والتقييمات والنزالات.",
      scoreLabel: "التقييم {score}",
      rankLabel: "الترتيب #{rank}",
      malLink: "عرض على MyAnimeList ←",
      instantEpisodeBadge: "نزال الحلقة — 24 ساعة",
      instantEpisodeTitle: "{title} · الحلقة {episode}",
      instantEpisodeSubtitle:
        "ارفع أفضل مشهد الآن. تُحسب فقط المقاطع خلال 24 ساعة — الأعلى تفاعلاً يفوز.",
      instantEpisodeRewards: "الفائز: +{points} نقطة",
      instantEpisodeCountdown: "الوقت المتبقي",
      instantEpisodeHours: "ساعة",
      instantEpisodeMinutes: "دقيقة",
      instantEpisodeSeconds: "ثانية",
      instantEpisodeCta: "ادخل النزال",
      instantEpisodeEnded: "انتهت نافذة هذا النزال.",
    },
    exclusives: {
      dailyHallBadge: "لوحة الشرف اليومية",
      dailyHallTitle: "لوحة الشرف اليومية",
      dailyHallSubtitle: "من يجمع أكثر نقاط تفاعل اليوم يتصدر الساحة.",
      interactionKing: "ملك التفاعلات اليوم",
      pointsToday: "نقطة اليوم",
      noDailyLeader: "لا بطل اليوم بعد. تفاعل، انشر، وادعُ أصدقاءك لتتوج.",
      hallOfLegendsBadge: "أرشيف الأساطير",
      hallOfLegendsTitle: "أرشيف الأساطير",
      hallOfLegendsSubtitle:
        "معرض دائم لأبطال المواسم السابقة. هؤلاء الفائزون يُلهمون الصيادين الجدد للوصول إلى القمة.",
      noHallOfLegends:
        "لا يوجد أبطال مؤرشفون بعد. عند انتهاء الموسم، يُحفظ أفضل 3 مقاطع هنا إلى الأبد.",
      seasonWinnerRank: "المركز #{rank}",
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
      cannotChallengeOwnClip: "لا يمكنك تحدي مقطعك الخاص.",
      loginToChallenge: "سجّل للانضمام وتحدي المقاطع واكسب نقاط النزال.",
      challengeFailed: "تعذّر بدء النزال. جرّب مقطعاً آخر.",
      challengeDuelBadge: "التحدي السريع",
      challengeDuelTitle: "نزال المقطع",
      challengeDuelPageDesc: "منشئان و ساحة واحدة. صوّت بالإعجاب والتعليقات لتتوّج بالمقطع الأقوى.",
      clipChallengeExclusivesDesc:
        "افتح صفحة الفيديوهات واضغط «تحدي هذا المقطع» تحت أي مقطع معتمد ليس ملكك.",
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
      pointsWagerInviteAlertTitle: "تحدي نقاط جديد!",
      pointsWagerInviteAlertBody:
        "{user} تحداك بـ {wager} نقطة. الفائز يأخذ {pot} نقطة.",
      rejectWagerDuel: "رفض",
      rejectingWager: "جارٍ الرفض...",
      viewWagerOnExclusives: "عرض في حصري",
      pointsWagerAlertSoundHint: "يتوقف صوت التنبيه عند القبول أو الرفض.",
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
      closePlayer: "إغلاق الراديو",
      streamError: "تعذّر الاتصال بالبث. حاول مرة أخرى بعد قليل.",
      poweredBy: "بث OST من LISTEN.moe · إيقاعات Lofi من Nightwave Plaza.",
    },
    lounge: {
      badge: "صالة إيقاعات الأنمي",
      title: "صالة إيقاعات الأنمي الحي",
      subtitle: "قائمة تشغيل يختارها المجتمع لأجمل موسيقى الأنمي. صوّت لالمفضلة واستمر بالاستماع أثناء تصفح الموقع.",
      tabRadio: "راديو مباشر",
      tabLounge: "صالة الإيقاعات",
      keepListening: "استمر بالاستماع أثناء تصفح الفيديوهات والمجتمع وملفك الشخصي.",
      play: "تشغيل القائمة",
      pause: "إيقاف",
      mute: "كتم",
      unmute: "إلغاء الكتم",
      volume: "الصوت",
      nowPlaying: "يشتغل الآن",
      playing: "قيد التشغيل",
      communityPlaylist: "قائمة المجتمع",
      pickTrack: "اختر مقطعاً للبدء",
      previous: "السابق",
      next: "التالي",
      closePlayer: "إغلاق المشغّل",
      playlistTitle: "قائمة تشغيل المجتمع",
      emptyPlaylist: "لا توجد مقاطع معتمدة بعد. اقترح أغنية أو انتظر مراجعة الفريق.",
      voteTrack: "صوّت لهذا المقطع",
      loginToVote: "سجّل الدخول للتصويت",
      nowPlayingBadge: "الآن",
      submitTitle: "اقترح مقطعاً",
      submitDesc: "شارك رابط YouTube لأغنية أنمي ينبغي أن يسمعها المجتمع.",
      trackTitlePlaceholder: "عنوان الأغنية",
      artistPlaceholder: "الفنان",
      animePlaceholder: "اسم الأنمي (اختياري)",
      youtubePlaceholder: "رابط YouTube أو معرف الفيديو",
      coverPlaceholder: "رابط صورة الغلاف (اختياري)",
      coverFromLibrary: "اختر من المكتبة",
      coverOrLink: "أو الصق رابط الصورة",
      coverRemove: "إزالة الغلاف",
      coverUploadFailed: "تعذّر رفع صورة الغلاف. حاول مرة أخرى.",
      submitButton: "إرسال للمراجعة",
      submitting: "جارٍ الإرسال...",
      submitSuccess: "تم الإرسال! سيراجعه الفريق للقائمة.",
      loginToSubmit: "سجّل الدخول لاقتراح مقاطع للمجتمع.",
      errorTitleRequired: "أدخل عنوان الأغنية.",
      errorArtistRequired: "أدخل اسم الفنان.",
      errorYoutubeRequired: "الصق رابط YouTube أو معرف الفيديو.",
      errorYoutubeInvalid: "رابط YouTube غير صالح.",
      errorCoverInvalid: "رابط صورة الغلاف يجب أن يبدأ بـ http:// أو https://.",
      playbackError:
        "تعذّر تشغيل هذا المقطع (قد يكون التضمين محظوراً). سننتقل للمقطع التالي — جرّب أغنية أخرى.",
      audioOnlyBadge: "صوت فقط",
      backgroundListening:
        "يستمر الصوت بالتشغيل في الخلفية أثناء تصفح الفيديوهات والمجتمع وملفك الشخصي.",
      unlockAudio: "اضغط هنا لتشغيل الصوت",
      audioSourceHint: "إذا لم يظهر صوت، اضغط زر تفعيل الصوت أعلاه.",
      playerLoading: "جارٍ تحميل المشغّل…",
      mySubmissionsTitle: "مقاطعك المرفوعة",
      mySubmissionsDesc: "المقاطع التي اقترحتها. يمكنك حذفها في أي وقت قبل أو بعد المراجعة.",
      mySubmissionsEmpty: "لم ترفع أي مقطع بعد.",
      mySubmissionsLoading: "جاري تحميل مقاطعك...",
      deleteTrack: "حذف",
      deletingTrack: "جاري الحذف...",
      deleteTrackConfirm: "هل تريد حذف هذا المقطع من مقاطعك؟",
      deleteTrackSuccess: "تم حذف المقطع.",
      deleteTrackFailed: "تعذّر حذف المقطع. حاول مرة أخرى.",
      statusPending: "قيد المراجعة",
      statusApproved: "مقبول",
      statusRejected: "مرفوض",
    },
    legal: {
      reportTitle: "تقرير المحتوى",
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
    contact: {
      pageTitle: "اتصل بنا",
      pageSubtitle:
        "أخبرنا عن مشكلتك وسنعود إليك في أقرب وقت. كلما زادت التفاصيل، كان بإمكاننا مساعدتك أسرع.",
      formTitle: "نموذج التواصل",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "you@example.com",
      messageLabel: "صف المشكلة",
      messagePlaceholder: "ما الذي حدث؟ أضف الخطوات أو الروابط أو رسائل الخطأ إن وُجدت.",
      whatsappLabel: "واتساب / هاتف",
      whatsappPlaceholder: "+966 5XX XXX XXXX",
      optional: "اختياري",
      required: "إلزامي",
      submit: "إرسال الرسالة",
      submitting: "جارٍ الإرسال...",
      success: "تم إرسال رسالتك. سيرد عليك فريقنا في أقرب وقت.",
      failed: "تعذّر إرسال الرسالة. حاول مرة أخرى.",
      emailInvalid: "أدخل بريداً إلكترونياً صالحاً.",
      messageTooShort: "اكتب 10 أحرف على الأقل عن مشكلتك.",
      supportCardTitle: "دعم ClashAnime",
      supportCardDesc: "نساعدك في الحساب، الرفع، ClashCoins، والمشاكل التقنية.",
      responseTime: "عادةً نرد خلال 24–48 ساعة.",
      helpTitle: "كيف نساعدك",
      helpGlobal: "منصة عالمية — دعم بالعربية والإنجليزية واليابانية.",
      helpWallet: "أسئلة ClashCoins والسحب وتحقق KYC.",
      helpAccount: "تسجيل الدخول، التوثيق، الحظر، وأمان الحساب.",
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
      signupCountryHint: "يظهر بلدك في تبويب «حول» في قناتك العامة.",
    },
    profile: {
      loading: "جارٍ تحميل قناتك...",
      loadFailed: "تعذّر تحميل قناتك.",
      retry: "إعادة المحاولة",
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
      channelCommunity: "مجتمع الأنمي",
      channelAbout: "نبذة",
      channelStats: "{followers} متابع · {videos} فيديو · {posts} منشور",
      noChannelVideos: "لا توجد فيديوهات في هذه القناة بعد.",
      noChannelPosts: "لا توجد منشورات في مجتمع الأنمي بعد.",
      postNowToCommunity: "انشر الآن",
      viewCommunityPost: "عرض المنشور",
      channelPreviewTitle: "قناتك",
      channelPreviewDesc: "هكذا يرى الزوار صفحة قناتك العامة.",
      editChannelSettings: "تعديل إعدادات القناة",
      viewPublicChannel: "عرض القناة العامة",
      channelAboutTab: "حول",
      channelMoreInfo: "مزيد من المعلومات",
      channelJoinedDate: "تاريخ الانضمام: {date}",
      channelFollowersStat: "{count} متابع",
      channelVideosStat: "{count} فيديو",
      channelViewsStat: "{count} مشاهدة",
      channelLifetimePointsStat: "{count} اجمالي نقاط مكتسبة",
      shareChannel: "مشاركة القناة",
      reportUser: "الإبلاغ عن المستخدم",
      reportUserHint: "الإبلاغ عن قناة المستخدم",
      channelLinkCopied: "تم نسخ رابط القناة.",
      channelShareFailed: "تعذّرت مشاركة القناة.",
      profileCountry: "البلد",
      profileSocialLink: "رابط وسائل التواصل",
      profileSocialPlaceholder: "https://youtube.com/@channel أو instagram.com/you أو tiktok.com/@you…",
      profileSocialHint: "الصق أي رابط — YouTube أو Instagram أو TikTok أو X أو موقعك. نكتشف المنصة تلقائياً.",
      profileSocialDetected: "تم التعرف: {platform}",
      profileSocialSavedLinks: "الروابط المحفوظة",
      profileSocialRemove: "إزالة",
      socialPlatforms: {
        youtube: "YouTube",
        instagram: "Instagram",
        tiktok: "TikTok",
        twitter: "X (Twitter)",
        website: "موقع",
      },
      profileCountryRequired: "يرجى اختيار بلدك.",
      completeProfileTitle: "أكمل ملفك الشخصي",
      completeProfileDesc: "اختر بلدك ليظهر في قناتك العامة.",
      manageChannel: "إدارة قناتك",
      verifiedBadge: "قناة موثّقة",
      displayNameCooldown: "يمكنك تغيير اسم القناة بعد {days} يوماً.",
      displayNameCooldownDays: "يمكن تغيير اسم القناة مرة واحدة كل 14 يوماً فقط.",
      username: "اسم المستخدم (@)",
      usernameCooldown: "يمكنك تغيير اسم المستخدم بعد {days} يوماً.",
      usernameCooldownDays: "يمكن تغيير اسم المستخدم مرة واحدة كل 30 يوماً فقط.",
      usernameTaken: "اسم المستخدم موجود بالفعل.",
      usernameInvalid: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل (a-z, 0-9, _).",
      deleteAccountTitle: "حذف الحساب",
      deleteAccountWarning:
        "سيؤدي هذا إلى حذف حسابك ومقاطعك ونقاطك ومحفظة ClashCoins وجميع بياناتك نهائياً. لن تتمكن من استرجاع الحساب بعد الحذف.",
      deleteAccountCheckbox: "أفهم أن حذف الحساب نهائي ولا يمكن التراجع عنه.",
      deleteAccountTypeWord: 'اكتب "{word}" للتأكيد',
      deleteAccountButton: "حذف حسابي نهائياً",
      deleteAccountDeleting: "جارٍ حذف الحساب...",
      deleteAccountFailed: "تعذّر حذف الحساب. حاول مجدداً أو تواصل مع الدعم.",
      deleteAccountWordMismatch: "كلمة التأكيد غير صحيحة.",
      deleteAccountConfirmRequired: "يرجى تفعيل مربع التأكيد أولاً.",
      editVideo: "تعديل الفيديو",
      deleteVideo: "حذف",
      saveVideo: "حفظ الفيديو",
      savingVideo: "جاري الحفظ...",
      deletingVideo: "جاري الحذف...",
      cancelEdit: "إلغاء",
      confirmDeleteVideo: "حذف هذا الفيديو نهائياً؟ لا يمكن التراجع.",
      videoUpdated: "تم تحديث الفيديو.",
      videoDeleted: "تم حذف الفيديو.",
      videoSaveFailed: "تعذّر حفظ تعديلات الفيديو.",
      videoDeleteFailed: "تعذّر حذف هذا الفيديو.",
    },
    notifications: {
      bellLabel: "الإشعارات",
      title: "الإشعارات",
      subtitle: "تحديثات من ClashAnime",
      markAllRead: "تعليم الكل كمقروء",
      enableInApp: "تفعيل الإشعارات داخل التطبيق",
      loading: "جارٍ تحميل الإشعارات...",
      disabledHint: "فعّل الإشعارات لرؤية التحديثات هنا.",
      empty: "لا توجد إشعارات بعد.",
      settingsLabel: "إعدادات الإشعارات",
      settingsHint: "الرقم يوضّح الإشعارات غير المقروءة. عند فتح إشعار ينقص العدد.",
      mentionTitle: "تم ذكرك",
      mentionPreviewCommunity: "ذكرك في منشور بالمجتمع.",
      mentionPreviewComment: "ذكرك في تعليق.",
      types: {
        follow: { label: "متابعة", title: "متابع جديد", body: "{name} بدأ بمتابعتك" },
        new_video: { label: "فيديو", title: "فيديو جديد", body: "{channel} نشر: {title}" },
        admin_video_review: {
          label: "إدارة",
          title: "فيديو يحتاج مراجعة",
          body: "{channel} نشر: {title}",
        },
        new_music: { label: "موسيقى", title: "موسيقى جديدة", body: "{channel} أضاف مقطعاً: {title}" },
        community_post: {
          label: "المجتمع",
          title: "منشور مجتمع",
          body: "{channel} نشر في المجتمع",
          bodyWithPreview: "منشور {channel}: {preview}",
        },
        video_duel: { label: "تحدي", title: "تحدي مقطع", body: "{name} تحدّى مقطعك" },
        points_duel: { label: "تحدي نقاط", title: "تحدي نقاط", body: "{name} تحدّاك بـ {points} نقطة" },
        points_duel_accepted: { label: "قبول التحدي", title: "تم قبول التحدي", body: "{name} قبل تحدي النقاط" },
        season_start: { label: "بداية موسم", title: "موسم جديد", body: "{season} بدأ الآن. تسلّق الترتيب!" },
        season_end: { label: "نهاية موسم", title: "انتهى الموسم", body: "انتهى {season}. راجع قاعة الأساطير!" },
        anime_release_clash: {
          label: "نزال الحلقة",
          title: "نزال الحلقة الفوري — 24 ساعة",
          body: "{anime} مباشر لمدة 24 ساعة! استخدم {hashtags} وارفع أفضل مشهد. الفائز يحصل على +2,000 نقطة.",
        },
        episode_clash_winner: {
          label: "ملك الحلقة",
          title: "أنت ملك الحلقة!",
          body: "فزت في {anime} الحلقة {episode} — +{points} نقطة.",
        },
        episode_clash_crowned: {
          label: "تتويج",
          title: "تُوّج ملك الحلقة",
          body: "{name} فاز في {anime} الحلقة {episode} — انتهت نافذة الـ24 ساعة.",
        },
        video_like: {
          label: "إعجاب",
          title: "إعجاب جديد",
          body: "أعجب {name} بمقطعك",
          bodyWithTitle: "أعجب {name} بمقطعك: {title}",
        },
        video_comment: {
          label: "تعليق",
          title: "تعليق جديد",
          body: "علّق {name} على مقطعك",
          bodyWithPreview: "تعليق {name}: {preview}",
        },
        comment_reply: {
          label: "رد",
          title: "رد جديد",
          body: "رد {name} على تعليقك",
          bodyWithPreview: "رد {name}: {preview}",
        },
        comment_like: { label: "إعجاب تعليق", title: "إعجاب على تعليق", body: "أعجب {name} بتعليقك" },
        mention: { label: "إشارة" },
        broadcast: { label: "بث" },
        system: { label: "النظام" },
        referral_signup: {
          label: "تسجيل دعوة",
          title: "صديق انضم",
          body: "سجّل {name} عبر رابط دعوتك (+{points} نقطة)",
        },
        referral_welcome: {
          label: "مكافأة ترحيب",
          title: "مكافأة الدعوة",
          body: "ربحت +{points} نقطة لانضمامك عبر @{username}",
        },
        signup_welcome: {
          label: "مكافأة التسجيل",
          title: "مرحباً بك في ClashAnime",
          body: "ربحت +{points} نقطة لإنشاء حسابك",
        },
        referral_milestone: {
          label: "إنجاز دعوة",
          title: "إنجاز صديق مدعو",
          body: "{name} {milestone} (+{points} نقطة)",
        },
        referral_tier_up: {
          label: "رتبة دعوة",
          title: "رتبة دعوة جديدة",
          body: "وصلت إلى رتبة {tier} بعد {count} دعوة",
        },
      },
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
      referralHintV2:
        "شارك رابطك. كل حساب جديد يحصل على نقاط ترحib، وعبر رابطك تحصل أنت وصديقك على مكافآت إضافية.",
      referralSystemLabel: "برنامج الدعوة",
      referralDoubleSidedTitle: "مكافآت لك ولصديقك",
      referralStatsTitle: "إحصائيات دعوتك",
      referralStatsTotal: "إجمالي الدعوات",
      referralStatsWeek: "هذا الأسبوع",
      referralStatsVideoBonus: "مكافآت أول فيديو",
      referralStatsBattleBonus: "مكافآت أول نزال",
      referralMilestoneTitle: "تقدّم رتبة الدعوة",
      referralMaxTier: "أعلى رتبة",
      referralCosmeticHint: "الرتب الأعلى تفتح لون اسم وإطاراً مميزاً لصورة ملفك.",
      referralFlashActive: "حدث نشط: نقاط تسجيل ×{multiplier} لك",
      referralLeaderboardTitle: "لوحة صدارة الدعوات",
      referralLeaderboardWeek: "هذا الأسبوع",
      referralLeaderboardAll: "كل الوقت",
      referralLeaderboardEmpty: "لا دعوات بعد. كن الأول على اللوحة.",
      referralLeaderboardInvites: "دعوة",
      referralTiers: {
        scout: "الكشاف · 5 دعوات",
        recruit: "المجند · 20 دعوة",
        leader: "القائد · 50 دعوة",
      },
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
        referralSignupYou: "عند تسجيل صديق عبر رابطك",
        referralSignupFriend: "عند تسجيلك عبر رابط صديق (+50 إضافية)",
        signupWelcome: "عند إنشاء حساب جديد",
        referralFirstVideo: "عند رفع صديقك المدعو أول فيديو",
        referralFirstBattle: "عند مشاركة صديقك المدعو في أول نزال",
        videoLike: "الإعجاب بفيديو",
        videoUpload: "رفع مقطع أصلي معتمد",
        communityPost: "نشر في صفحة المجتمع",
        trendingBonus: "وصول مقطعك إلى شبكة الترند",
      },
      transactionReasons: {
        referral_click: "زيارة رابط الدعوة",
        referral_signup: "تسجيل صديق",
        referral_welcome: "مكافأة ترحيب الدعوة",
        signup_welcome: "مكافأة ترحib الحساب",
        referral_first_video: "أول فيdeo لصديق",
        referral_first_battle: "أول نزال لصديق",
        video_like: "إعجاب بفيديو",
        video_upload: "رفع معتمد",
        community_post: "منشور مجتمع",
        trending_bonus: "جائزة الترند",
        video_duel_challenge: "نزال تحدي مقطع",
        points_duel_stake: "رهان نزال نقاط",
        points_duel_win: "فوز نزال نقاط",
        points_duel_refund: "استرداد نزال نقاط",
        clash_coin_conversion: "تحويل إلى ClashCoins",
      },
    },
    wallet: {
      title: "ClashCoins",
      subtitle: "المحفظة الرقمية",
      description:
        "رصيدك القابل للسحب بالدولار $. حوّل نقاط الصياد إلى $ واحتفظ بالإجمالي في محفظتك، ثم اسحب عبر تحويل بنكي أو PayPal أو USDT.",
      balanceLabel: "رصيد المحفظة",
      exchangeRateTitle: "سعر الصرف",
      exchangeRateValue: "١٠,٠٠٠ نقطة = ١٠$",
      minPayoutTitle: "الحد الأدنى للسحب",
      hunterPointsLabel: "نقاط الصياد المتاحة",
      convertTitle: "تحويل النقاط إلى رصيد $",
      convertDesc: "استبدل نقاط الصيد يُحفظ الرصيد بالدولار.",
      convertAmountLabel: "النقاط للتحويل",
      convertPreview: "ستحصل على {amount}",
      convertButton: "و حوّل الآن",
      convertSuccess: "تم تحويل النقاط إلى رصيد $ بنجاح.",
      convertFailed: "تعذر التحويل. تحقق من رصيدك وحاول مجدداً.",
      convertMinError: "الحد الأدنى للتحويل ١٠٠ نقطة (0.10 US$).",
      withdrawTitle: "طلب سحب",
      withdrawDesc: "اسحب رصيد $ عبر تحويل بنكي أو PayPal أو USDT. تتم مراجعة الطلبات يدوياً للأمان.",
      withdrawAmountLabel: "المبلغ للسحب ($)",
      selectPaymentMethod: "طريقة السحب",
      bankTransferTitle: "تحويل بنكي",
      bankTransferDesc: "أدخل IBAN واسم صاحب البطاقة البنكية وبريد المستلم.",
      paypalTitle: "PayPal",
      paypalDesc: "استلم المبلغ على بريد حساب PayPal الخاص بك.",
      paypalEmailLabel: "بريد PayPal",
      paypalEmailPlaceholder: "your@paypal.com",
      usdtTitle: "Crypto USDT",
      usdtDesc: "استلم USDT على محفظتك. تأكد من الشبكة قبل الإرسال.",
      usdtWalletLabel: "عنوان محفظة USDT",
      usdtWalletPlaceholder: "عنوان المحفظة",
      usdtNetworkLabel: "الشبكة",
      ibanLabel: "IBAN",
      ibanPlaceholder: "DE89 3704 0044 0532 0130 00",
      accountHolderLabel: "اسم صاحب البطاقة البنكية",
      accountHolderPlaceholder: "الاسم كما يظهر في حسابك البنكي",
      recipientEmailLabel: "إيميل المستلم",
      recipientEmailPlaceholder: "name@email.com",
      kycAcknowledgement:
        "أؤكد أن معلومات الهوية التي أرسلتها صحيحة وأوافق على سياسة KYC في شروط الاستخدام.",
      kycRequired: "يرجى تأكيد سياسة KYC قبل الإرسال.",
      kycApprovalRequired: "يجب الموافقة على إثبات الهوية (KYC) قبل طلب السحب.",
      kycWithdrawLocked: "أكمل KYC مرة واحدة لكل حساب وقناة واحصل على الموافقة قبل أي سحب.",
      kycTitle: "إثبات الهوية (KYC)",
      kycDesc:
        "مطلوب مرة واحدة لكل حساب وقناة قبل أي سحب ClashCoins. أرسل الاسم ورقم الهاتف والعنوان الكامل.",
      kycFirstNameLabel: "الاسم الأول",
      kycFirstNamePlaceholder: "الاسم كما في الهوية",
      kycLastNameLabel: "اسم العائلة",
      kycLastNamePlaceholder: "اسم العائلة كما في الهوية",
      kycCountryLabel: "الدولة",
      kycPhoneLabel: "رقم الهاتف",
      kycPhoneLocalPlaceholder: "5XXXXXXXX",
      kycWhatsappTitle: "واتساب",
      kycWhatsappDesc: "واتساب — لنتواصل معك.",
      kycWhatsappNumberLabel: "رقم واتساب",
      kycWhatsappPlaceholder: "نفس رقم الهاتف أو رقم آخر",
      kycWhatsappHint: "اتركه فارغاً لاستخدام رقم الهاتف أعلاه على واتساب.",
      kycAddressLabel: "العنوان الكامل",
      kycAddressPlaceholder: "الشارع، المدينة، الدولة، الرمز البريدي",
      kycIdLabel: "صورة الهوية الرسمية",
      kycIdHint: "ارفع صورة واضحة لجواز السفر أو الهوية أو رخصة القيادة (JPEG/PNG/WebP، حتى 10 ميغابايت).",
      kycIdRequired: "يرجى رفع صورة الهوية.",
      kycInvalidImage: "اختر ملف صورة صالحاً.",
      kycImageTooLarge: "يجب ألا تتجاوز صورة الهوية 10 ميغابايت.",
      kycSubmitButton: "إرسال KYC للمراجعة",
      kycSubmitSuccess: "تم إرسال KYC. سيراجعه فريقنا قبل تفعيل السحب.",
      kycSubmitFailed: "تعذر إرسال KYC. حاول مجدداً.",
      kycLoading: "جارٍ تحميل حالة KYC...",
      kycPendingTitle: "KYC قيد المراجعة",
      kycPendingDesc: "يتم مراجعة مستندات الهوية. يُفعَّل السحب بعد الموافقة.",
      kycApprovedTitle: "تمت الموافقة على KYC",
      kycApprovedDesc: "تم التحقق من هويتك لهذا الحساب. يمكنك الآن طلب السحب.",
      kycRejectedTitle: "تم رفض KYC",
      kycRejectedDesc: "تم رفض KYC. حدّث بياناتك وأعد الإرسال.",
      withdrawButton: "اطلب السحب",
      withdrawProcessingTime:
        "تُراجع جميع الطلبات يدوياً. بعد الموافقة، يصل المبلغ عادةً خلال ٢٤ إلى ٧٢ ساعة.",
      withdrawFailed: "تعذر إرسال طلب السحب.",
      withdrawMinError: "الحد الأدنى للسحب ١٠$.",
      withdrawPendingNotice:
        "طلبك قيد المراجعة. بعد الموافقة، يصل المبلغ عادةً خلال ٢٤ إلى ٧٢ ساعة.",
      fraudBlocked: "تم تعليق الطلب للمراجعة بسبب نشاط نقاط غير اعتيادي.",
      processing: "جارٍ المعالجة...",
      paymentOptionsTitle: "طرق السحب",
      paymentMethodLabels: {
        bank_transfer: "تحويل بنكي",
        paypal: "PayPal",
        crypto_usdt: "Crypto USDT",
      },
      historyTitle: "سجل السحوبات",
      loadingHistory: "جارٍ تحميل السجل...",
      noHistory: "لا توجد طلبات سحب بعد.",
      legalNote: "السحوبات تخضع لفحوصات مكافحة الغش ومتطلبات الضرائب.",
      withdrawalStatuses: {
        pending: "قيد المراجعة",
        reviewing: "تحت المراجعة",
        completed: "تم الدفع",
        rejected: "مرفوض",
        fraud_blocked: "مراجعة احتيال",
      },
    },
    communityFeed: {
      postPublished: "تم النشر.",
      postLevelRequired:
        "الساحة حصرية لأبطال الرتبة C و A و S. استمر في التفاعل والمشاركة لتُثبت جدارتك وتنضم للنخبة!",
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
      title: "رفع فيديو",
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
      publishedLive:
        "فيديوك منشور الآن! قد يراجعه فريقنا لاحقاً.",
      scanFailed: "تعذر التحقق من الملف. جرّب تصديراً مختلفاً للفيديو.",
      uploadFailed: "تعذر رفع الملفات. حاول مرة أخرى بعد قليل.",
      r2UploadBlocked:
        "تعذّر الرفع إلى Cloudflare R2. تحقق من إعدادات CORS في الـ bucket لـ clashanime.com و www.clashanime.com ثم حاول مجدداً.",
      uploadsDisabled: "رفع الفيديوهات متوقف مؤقتاً.",
      accountBanned: "حسابك موقوف ولا يمكنك رفع الفيديوهات.",
      levelRequired: "تحتاج رتبة منافس (1000+ نقطة) لرفع الفيديوهات.",
      clashUploadTitle: "رفع مقطع لنزال {anime}",
      clashUploadHint: "تُضاف هذه الوسوم تلقائياً: {tags}",
      backToClash: "العودة للنزال",
      hashtagUsageCount: "{count} فيديو",
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
      lifetimePoints: "إجمالي المكتسب",
      level: "المستوى",
      verificationRequests: "طلبات التوثيق",
      approveVerification: "قبول التوثيق",
      rejectVerification: "رفض التوثيق",
      viewChannel: "عرض القناة",
      channelHasCover: "غلاف",
      channelHasBio: "نبذة",
      channelHasYoutube: "YouTube",
      channelHasInstagram: "Instagram",
      channelHasTiktok: "TikTok",
      channelHasTwitter: "X",
      channelHasWebsite: "Website",
      suspicionScore: "درجة الاشتباه",
      globalRank: "المركز العالمي",
      clashRank: "مركز النزال",
      awaitingAdminReview: "بانتظار المراجعة",
      markReviewed: "تمت المراجعة",
      inClashTop: "في النزالات (أفضل 12)",
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
      withdrawalsTitle: "سحوبات ClashCoins",
      withdrawalsSubtitle: "مراجعة طلبات السحب وعلامات الاحتيال وتفاصيل الدفع.",
      noWithdrawals: "لا توجد طلبات سحب مطابقة.",
      kycTitle: "تحقق KYC للسحب",
      kycSubtitle: "راجع مستندات الهوية ورقم الهاتف والعنوان قبل تفعيل السحب.",
      noKycSubmissions: "لا توجد طلبات KYC مطابقة.",
      approveKyc: "الموافقة على KYC",
      rejectKyc: "رفض KYC",
      kycRejectNotesPrompt: "سبب الرفض (يظهر للمستخدم إن وُجد):",
      kycStatuses: {
        pending: "قيد المراجعة",
        approved: "موافق عليه",
        rejected: "مرفوض",
      },
      contactTitle: "رسائل التواصل",
      contactSubtitle: "اقرأ رسائل الدعم من المستخدمين وسجّل ردودك.",
      noContactMessages: "لا توجد رسائل تواصل مطابقة.",
      contactReply: "رد الفريق / ملاحظات",
      contactReplyPlaceholder: "ملاحظات الرد أو ملخص ما أرسلته للمستخدم...",
      saveContactReply: "حفظ الرد",
      markContactReplied: "تعيين كمُرد عليه",
      markContactClosed: "إغلاق",
      sendContactReplyEmail: "إرسال الرد بالإيميل",
      sendingContactReply: "جارٍ الإرسال...",
      contactReplySent: "تم إرسال الرد للمستخدم بالإيميل.",
      contactReplyFailed: "تعذّر إرسال الرد بالإيميل.",
      contactStatuses: {
        open: "مفتوحة",
        replied: "تم الرد",
        closed: "مغلقة",
      },
      emailsTitle: "الإيميلات التلقائية",
      emailsSubtitle: "إيميلات الترحيب والرسائل التلقائية الأخرى المرسلة للمستخدمين.",
      noEmails: "لا توجد إيميلات مسجّلة بعد.",
      emailsFilterAll: "الكل",
      emailStatuses: {
        pending: "قيد الإرسال",
        sent: "تم الإرسال",
        failed: "فشل",
      },
      emailsTable: {
        when: "الوقت",
        to: "إلى",
        type: "النوع",
        locale: "اللغة",
        status: "الحالة",
        user: "المستخدم",
        actions: "إجراءات",
      },
      emailRetry: "إعادة الإرسال",
      emailRetrying: "جارٍ الإرسال...",
      emailRetrySuccess: "تم إرسال الإيميل بنجاح.",
      emailRetryFailed: "تعذّر إعادة إرسال هذا الإيميل.",
      accountDeletionsTitle: "الحسابات المحذوفة",
      noAccountDeletions: "لا توجد سجلات حذف بعد.",
      accountDeletionsTable: {
        when: "الوقت",
        email: "البريد",
        name: "الاسم",
        farewell: "إيميل الوداع",
      },
      inAppNotificationsTitle: "الإشعارات داخل التطبيق",
      inAppNotificationsFilterAll: "كل الأنواع",
      noInAppNotifications: "لا توجد إشعارات داخل التطبيق بعد.",
      inAppNotificationsTable: {
        when: "الوقت",
        user: "المستخدم",
        type: "النوع",
        title: "العنوان",
        read: "مقروء",
      },
      broadcastTitle: "إيميل جماعي",
      broadcastSubtitle: "أرسل إيميلاً منسقاً إلى كل المستخدمين المسجّلين بضغطة واحدة.",
      broadcastComposeTitle: "كتابة الرسالة",
      broadcastSubjectLabel: "الموضوع",
      broadcastMessageLabel: "نص الرسالة",
      broadcastPersonalizeHint: "استخدم {user_name} لتخصيص الاسم في كل إيميل.",
      broadcastCtaLabel: "نص الزر (اختياري)",
      broadcastCtaUrlLabel: "رابط الزر",
      broadcastConfirmCheckbox: "أفهم أن هذا سيُرسل إلى كل مستخدم في المنصة.",
      broadcastSendButton: "إرسال للجميع",
      broadcastSending: "جارٍ الإرسال...",
      broadcastUsersTitle: "كل المستخدمين",
      broadcastNoUsers: "لا يوجد مستخدمون ببريد إلكتروني.",
      broadcastUsersTable: { email: "البريد", name: "الاسم" },
      broadcastConfirm: "إرسال هذا الإيميل إلى {count} مستخدم الآن؟",
      broadcastSendSuccess: "تم إرسال {sent}/{total}. فشل: {failed}",
      broadcastSendFailed: "تعذّر الإرسال الجماعي.",
      broadcastLoadFailed: "تعذّر تحميل المستخدمين.",
      broadcastHistoryTitle: "سجل الإرسال الجماعي",
      broadcastNoHistory: "لا يوجد إرسال جماعي بعد.",
      broadcastHistoryTable: {
        when: "الوقت",
        subject: "الموضوع",
        sent: "تم الإرسال",
        failed: "فشل",
        status: "الحالة",
      },
      approveWithdrawal: "تعيين كمدفوع",
      rejectWithdrawal: "رفض واسترداد",
      markReviewing: "وضع قيد المراجعة",
      clashCoins: "ClashCoins",
      paymentMethod: "طريقة الدفع",
      paymentDestination: "وجهة الدفع",
      fraudFlags: "علامات احتيال",
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
        withdrawals: "السحوبات",
        kyc: "KYC السحب",
        seasons: "مواسم النزال",
        legends: "أرشيف الأساطير",
        beatsLounge: "صالة إيقاعات الأنمي",
        animeTracker: "رادار الأنمي الجديد",
        blog: "دليل الأبطال",
        animeNews: "أخبار الأنمي",
        contact: "صندوق التواصل",
        emails: "الإيميلات",
        referrals: "برنامج الدعوة",
        broadcast: "إيميل جماعي",
      },
      referrals: {
        title: "برنامج الدعوة",
        subtitle: "تابع أداء الدعوات ولوحة الأسبوع وأحداث المضاعفة.",
        totalSignups: "إجمالي تسجيلات الدعوة",
        weekSignups: "تسجيلات هذا الأسبوع",
        activeFlash: "أحداث مضاعفة نشطة",
        flashEventsTitle: "أحداث دعوة مضاعفة",
        flashEventsEmpty: "لا توجد أحداث مضاعفة بعد.",
        createFlashTitle: "إنشاء حدث مضاعفة",
        titleEn: "العنوان (إنجليزي)",
        titleAr: "العنوان (عربي)",
        titleJa: "العنوان (ياباني)",
        multiplier: "المضاعف",
        startsAt: "يبدأ في",
        endsAt: "ينتهي في",
        createButton: "إنشاء الحدث",
        creating: "جارٍ الإنشاء...",
        created: "تم إنشاء الحدث.",
        deactivate: "إيقاف",
        leaderboardTitle: "أفضل الداعين",
        periodWeek: "هذا الأسبوع",
        periodAll: "كل الوقت",
        table: {
          title: "العنوان",
          multiplier: "المضاعف",
          window: "الفترة",
          status: "الحالة",
          actions: "إجراءات",
        },
      },
      seasons: {
        title: "مواسم النزال",
        subtitle: "تحكم في بداية ونهاية الموسم والعداد التنازلي في صفحة النزالات.",
        activeNow: "الموسم النشط",
        noActive: "لا يوجد موسم نشط. ابدأ موسماً جديداً لإظهار العداد في صفحة النزالات.",
        createTitle: "إنشاء موسم",
        quickStartTitle: "بدء موسم جديد",
        quickStartDesc: "ينهي الموسم الحالي ويبدأ موسماً جديداً لمدة 30 يوماً فوراً.",
        listTitle: "كل المواسم",
        nameLabel: "اسم الموسم",
        startsAtLabel: "تاريخ البداية",
        endsAtLabel: "تاريخ النهاية",
        durationDaysLabel: "المدة (أيام)",
        activateOnCreate: "تفعيل فوراً",
        createButton: "إنشاء الموسم",
        startNewButton: "ابدأ موسماً جديداً الآن",
        editButton: "تعديل التواريخ",
        activateButton: "تفعيل",
        endButton: "إنهاء الموسم",
        autoNamePlaceholder: "اسم تلقائي إذا تُرك فارغاً",
        editNamePrompt: "اسم الموسم",
        editStartPrompt: "البداية (YYYY-MM-DDTHH:mm)",
        editEndPrompt: "النهاية (YYYY-MM-DDTHH:mm)",
        empty: "لا توجد مواسم بعد.",
        created: "تم إنشاء الموسم.",
        updated: "تم تحديث الموسم.",
        activated: "تم تفعيل الموسم.",
        ended: "تم إنهاء الموسم.",
        startedNew: "تم بدء موسم جديد.",
        prizeSectionTitle: "الجوائز المالية (USD)",
        prizeRank1Label: "جائزة المركز 1 ($)",
        prizeRank2Label: "جائزة المركز 2 ($)",
        prizeRank3Label: "جائزة المركز 3 ($)",
        prizeSaveButton: "حفظ الجوائز",
        prizesSaved: "تم حفظ مبالغ الجوائز.",
        statusLabels: {
          scheduled: "مجدول",
          active: "نشط",
          ended: "منتهٍ",
        },
      },
      legends: {
        title: "أرشيف الأساطير",
        subtitle: "أرشفة فائزي المواسم السابقة وإظهارهم في الموقع.",
        statsArchived: "مواسم مؤرشفة",
        statsEnded: "مواسم منتهية",
        statsWinners: "إجمالي الفائزين",
        seasonListTitle: "أرشيف المواسم",
        openSeasons: "فتح لوحة المواسم",
        emptySeasons: "لا توجد مواسم بعد.",
        winnersCount: "{count} فائز مؤرشف",
        viewWinners: "عرض الفائزين",
        snapshotButton: "أرشفة الفائزين",
        resnapshotButton: "إعادة الأرشفة",
        winnersTitle: "الفائزون — {season}",
        noWinners: "لا يوجد فائزون مؤرشفون لهذا الموسم بعد.",
        deleteWinner: "إزالة",
        deleteConfirm: "إزالة هذا الفائز من أرشيف الأساطير؟",
        deleted: "تمت إزالة الفائز.",
        snapshotSuccess: "تم أرشفة {count} فائز.",
      },
      beatsLounge: {
        title: "صالة إيقاعات الأنمي",
        subtitle: "راجع اقتراحات المجتمع وأدر قائمة التشغيل في /music.",
        pendingCount: "اقتراحات قيد المراجعة",
        approvedCount: "مقاطع معتمدة",
        totalVotes: "أصوات المجتمع",
        addTrackTitle: "إضافة مقطع مباشرة",
        titleLabel: "عنوان الأغنية",
        artistLabel: "الفنان",
        animeLabel: "الأنمي (اختياري)",
        youtubeLabel: "رابط YouTube أو المعرف",
        sortLabel: "ترتيب العرض (الأعلى = أسبق)",
        addButton: "إضافة للصالة",
        queueTitle: "كل مقاطع الصالة",
        empty: "لا توجد مقاطع بعد.",
        approveButton: "اعتماد",
        rejectButton: "رفض",
        deleteButton: "حذف",
        deleteConfirm: "حذف هذا المقطع من الصالة؟",
        created: "تمت إضافة المقطع.",
        approved: "تم اعتماد المقطع.",
        rejected: "تم رفض المقطع.",
      },
      animeTracker: {
        title: "رادار الأنمي الجديد",
        subtitle: "إدارة جدول الإصدارات، مزامنة Jikan (MyAnimeList)، وفتح نزالات الإصدار عند نزول الحلقات.",
        todayCount: "إصدارات اليوم",
        upcomingCount: "قريباً (14 يوم)",
        activeClashes: "نزالات نشطة",
        syncButton: "مزامنة Jikan + الترند",
        syncTrendingButton: "مزامنة قائمة الترند فقط",
        syncing: "جاري المزامنة…",
        syncSuccess: "الجدول: {scheduleSynced} إصدار، {scheduleOpened} نزال. الترند: {trendingSynced}/{trendingTotal} متزامن.",
        syncTrendingSuccess: "قائمة الترند: {synced}/{total} متزامن من Jikan.",
        syncFailed: "فشلت مزامنة Jikan.",
        syncTrendingFailed: "فشلت مزامنة قائمة الترند.",
        trendingListTitle: "قائمة الترند (أفضل 10)",
        lastAutoSyncLabel: "آخر مزامنة تلقائية",
        autoSyncHint: "يُحدَّث الجدول وترند TOP10 والإغلاق والجوائز ونzالات 24 ساعة تلقائياً كل 30 دقيقة عبر Vercel cron (وGitHub Actions عند ضبط CRON_SECRET). فتح الرادار يزامِن إذا مرّ وقت.",
        addTitle: "إضافة إصدار يدوياً",
        titleLabel: "عنوان الأنمي",
        titleArLabel: "العنوان بالعربية (اختياري)",
        titleJaLabel: "العنوان باليابانية (اختياري)",
        synopsisEnLabel: "القصة بالإنجليزية (اختياري)",
        synopsisArLabel: "القصة بالعربية (اختياري)",
        synopsisJaLabel: "القصة باليابانية (اختياري)",
        episodeLabel: "رقم الحلقة",
        posterLabel: "رابط الملصق (اختياري)",
        tagsLabel: "وسوم المطابقة (مفصولة بفاصلة، اختياري)",
        openClashNow: "فتح نزال الإصدار فوراً",
        addButton: "إضافة إصدار",
        listTitle: "كل الإصدارات",
        empty: "لا توجد إصدارات بعد.",
        openClashButton: "فتح النزال",
        viewClash: "عرض النزال",
        deleteButton: "حذف",
        deleteConfirm: "حذف هذا الإصدار من الرادار؟",
        created: "تمت إضافة الإصدار.",
        clashOpened: "تم فتح نزال الإصدار.",
        seoTitle: "كلمات SEO لجوجل",
        seoAnimeCount: "{count} عنوان أنمي من Jikan/قاعدة البيانات يغذّي بيانات البحث (عربي/إنجليزي/ياباني).",
        seoKeywordCount: "{count} كلمة مفتاحية فريدة نشطة على الصفحات العامة.",
        instantEpisodeHint:
          "تُفتح نزالات الحلقة الفورية لمدة 24 ساعة عند نزول الحلقة. أعلى مقطع تفاعلاً يفوز تلقائياً.",
        instantEpisodeRewards: "مكافأة الفائز: +{points} نقطة",
        instantEpisodeActiveTitle: "نزالات الحلقة المباشرة (24 ساعة)",
        instantEpisodeHistoryTitle: "آخر نزالات الحلقة والفائزين",
        clashClosesAt: "يُغلق {time}",
        clashWinner: "الفائز: {name} (+{points} نقطة)",
        clashNoWinner: "انتهى بدون مقاطع مؤهلة",
        clashEnded: "انتهى {time}",
        clashStatusActive: "مباشر · نافذة 24 ساعة",
      },
      blog: {
        title: "دليل الأبطال (المدونة)",
        subtitle: "مقالات SEO ثابتة من الكود — بدون قاعدة بيانات.",
        staticNote: "المقالات ملفات في /blog. التحديث عبر git. هذه اللوحة للعرض فقط.",
        heroSlides: {
          title: "سلايدر غلاف دليل الأبطال",
          subtitle:
            "ارفع حتى 10 صور غلاف عريضة لصفحة دليل الأبطال (/blog). تتحرك تلقائياً ويمكن التنقل يدوياً في الموقع.",
          displayTitle: "إعدادات عرض الغلاف",
          displaySubtitle: "تحكم في ظهور السلايدر على الموقع، صندوق النص، ودرجة التعتيم فوق الصور.",
          carouselEnabled: "عرض السلايدر على الموقع",
          showTextOverlay: "إظهار صندوق النص في الوسط",
          overlayOpacity: "قوة الطبقة الداكنة",
          autoPlaySeconds: "مدة التبديل التلقائي",
          objectPosition: "موضع قص الصورة",
          objectCenter: "الوسط",
          objectTop: "أعلى",
          objectBottom: "أسفل",
          objectLeft: "يسار",
          objectRight: "يمين",
          previewOnSite: "معاينة على الموقع",
          save: "حفظ السلايدر",
          saving: "جاري الحفظ...",
          saved: "تم حفظ سلايدر الغلاف.",
          loading: "جاري تحميل الشرائح...",
          upload: "رفع صورة",
          uploading: "جاري الرفع...",
          uploaded: "تم رفع صورة الشريحة {n} — اضغط حفظ السلايدر للنشر.",
          remove: "إزالة",
          enabled: "عرض",
          emptySlot: "لا توجد صورة بعد",
          slotLabel: "الشريحة {n}",
          slotsMeta: "{active} نشطة من {max} خانات",
        },
        articlesCount: "{count} مقالة منشورة",
        category: "القسم",
        published: "تاريخ النشر",
        readingTime: "وقت القراءة",
        viewOnSite: "عرض في الموقع",
        openHub: "فتح دليل الأبطال",
      },
      animeNews: {
        title: "مركز أخبار الأنمي",
        subtitle:
          "زامِن RSS من Crunchyroll، اكتب ملخصات EN/AR/JA بأسلوبنا، أضف المواضيع، ثم انشر على /blog/anime-news.",
        syncNow: "مزامنة RSS الآن",
        syncing: "جاري المزامنة...",
        syncSuccess: "اكتملت المزامنة — {inserted} جديد، {updated} محدّث.",
        featuredGuideSynced: "تمت مزامنة الدليل الموسمي: {slug}",
        featuredLineupSynced: "تمت مزامنة {count} عنوان من التشكيلة",
        spotlightSynced: "تمت مزامنة {count} عنوان في السبوتلايت ({enriched} مع غلاف)",
        featuredBadge: "مميز · ظهور في البلوج",
        viewOnBlog: "عرض في البلوج",
        saved: "تم حفظ المقالة.",
        saving: "جاري الحفظ...",
        saveDraft: "حفظ مسودة",
        publish: "نشر",
        edit: "تحرير",
        collapse: "إخفاء",
        viewOnSite: "عرض في الموقع",
        sourceLink: "مصدر Crunchyroll",
        openHub: "فتح الصفحة العامة",
        loading: "جاري تحميل المقالات...",
        empty: "لا مقالات بعد. شغّل مزامنة RSS لاستيراد مسودات.",
        meta: "{drafts} مسودات · {published} منشورة",
        lastSync: "آخر مزامنة:",
        needsTranslation: "ترجمة AR/JA اختيارية",
        titlePlaceholder: "العنوان",
        excerptPlaceholder: "ملخص قصير بكلماتك (2–4 جمل)",
        storyPlaceholder: "قصة الأنمي / نص الخبر (فقرات متعددة)",
        topics: "المواضيع (مفصولة بفاصلة)",
        lineupCount: "{count} عنوان في التشكيلة",
        lineupPreview: "تشكيلة الموسم (مزامنة يومية تلقائية)",
        lineupMore: "+{count} عنوان إضافي",
      },
      hashtags: {
        title: "أبرز الهاشتاغات",
        subtitle: "الوسوم الأكثر استخداماً في الفيديوهات المعتمدة. لكل وسم صفحة عامة خاصة.",
        viewPage: "فتح الصفحة",
        empty: "لا توجد هاشتاغات مستخدمة بعد.",
      },
      videoOwnerEvents: {
        title: "تغييرات فيديوهات القنوات",
        subtitle: "آخر عمليات التعديل والحذف من قسم «فيديوهاتك».",
        empty: "لا توجد تغييرات من أصحاب القنوات بعد.",
        updated: "تعديل",
        deleted: "حذف",
        viewVideo: "عرض الفيديو",
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
        pendingWagerInvites: "دعوات رهان بانتظار القبول",
        pendingWithdrawals: "سحوبات قيد المراجعة",
        pendingKyc: "KYC سحب قيد المراجعة",
        openContactMessages: "رسائل تواصل مفتوحة",
        welcomeEmailsSent: "إيميلات ترحيب مرسلة",
        accountDeletions: "حسابات محذوفة",
        inAppNotifications: "إشعارات داخل التطبيق",
        legendWinners: "فائزو أرشيف الأساطير",
        referralSignups: "تسجيلات الدعوة",
        referralWeekSignups: "تسجيلات الدعوة (الأسبوع)",
      },
      platformHealth: {
        title: "صحة المنصة",
        subtitle: "إعداد AdSense وترحيلات قاعدة البيانات.",
        adsense: "Google AdSense",
        databaseSchema: "مخطط قاعدة البيانات",
        configured: "معرّف العميل والفتحة مضبوطان في Vercel.",
        missingEnv: "اضبط NEXT_PUBLIC_ADSENSE_CLIENT_ID و NEXT_PUBLIC_ADSENSE_SLOT.",
        active: "مفعّل للزوار في الإنتاج.",
        inactive: "معطّل عبر متغير البيئة.",
        checking: "جارٍ التحقق…",
        healthy: "آخر الترحيلات مطبّقة.",
        needsMigration: "نفّذ SQL من /api/health/schema.",
        ok: "سليم",
        actionNeeded: "يتطلب إجراء",
        monetizationApi: "API الإيرادات",
        schemaApi: "API المخطط",
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
        reviewWithdrawals: "مراجعة السحوبات",
        reviewWithdrawalsDesc: "قبول أو رفض طلبات سحب ClashCoins.",
        reviewKyc: "مراجعة KYC للسحب",
        reviewKycDesc: "تحقق من مستندات الهوية قبل تفعيل السحب للمستخدم.",
        reviewContact: "رسائل التواصل",
        reviewContactDesc: "اقرأ طلبات الدعم وسجّل ردودك.",
      },
      table: {
        user: "المستخدم",
        role: "الدور",
        videos: "الفيديوهات",
        communityPosts: "المجتمع",
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
