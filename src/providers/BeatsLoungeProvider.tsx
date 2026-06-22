"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { BeatsTrack } from "@/lib/animeBeatsLounge";
import { createBrowserClient } from "@/lib/supabase/client";

export const BEATS_YOUTUBE_HOST_ID = "beats-lounge-youtube-host";

type YoutubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (
    videoId: string | { videoId: string; startSeconds?: number; endSeconds?: number },
  ) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
  getPlayerState: () => number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YoutubePlayer }) => void;
            onStateChange?: (event: { data: number; target: YoutubePlayer }) => void;
            onError?: (event: { data: number; target: YoutubePlayer }) => void;
          };
        },
      ) => YoutubePlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_SCRIPT_ID = "youtube-iframe-api";

type BeatsLoungeContextValue = {
  playlist: BeatsTrack[];
  currentIndex: number;
  currentTrack: BeatsTrack | null;
  isPlaying: boolean;
  isReady: boolean;
  hasStarted: boolean;
  loungePanelOpen: boolean;
  volume: number;
  muted: boolean;
  playerError: string | null;
  setPlaylist: (tracks: BeatsTrack[]) => void;
  setLoungePanelOpen: (open: boolean) => void;
  playTrack: (index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  refreshVote: (trackId: string, voteCount: number, userHasVoted: boolean) => void;
};

const BeatsLoungeContext = createContext<BeatsLoungeContextValue | null>(null);

type BeatsLoungeProviderProps = {
  children: ReactNode;
  initialPlaylist?: BeatsTrack[];
};

function loadYoutubeApi() {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.YT?.Player) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const existing = document.getElementById(YT_SCRIPT_ID);
    if (existing) {
      if (window.YT?.Player) {
        resolve();
        return;
      }
      const prior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prior?.();
        resolve();
      };
      return;
    }

    window.onYouTubeIframeAPIReady = () => resolve();
    const script = document.createElement("script");
    script.id = YT_SCRIPT_ID;
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
  });
}

/** In-viewport hidden host — off-screen iframes are muted/blocked by browsers. */
export function BeatsLoungeAudioEngine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 start-0 z-0 h-[180px] w-[320px] overflow-hidden opacity-[0.01]"
    >
      <div id={BEATS_YOUTUBE_HOST_ID} className="h-full w-full" />
    </div>
  );
}

export function BeatsLoungeProvider({
  children,
  initialPlaylist = [],
}: BeatsLoungeProviderProps) {
  const playerRef = useRef<YoutubePlayer | null>(null);
  const playlistRef = useRef<BeatsTrack[]>(initialPlaylist);
  const currentIndexRef = useRef(0);
  const pendingAutoplayRef = useRef(false);
  const pendingPlayIndexRef = useRef<number | null>(null);
  const volumeRef = useRef(0.55);
  const mutedRef = useRef(false);

  const [playlist, setPlaylistState] = useState<BeatsTrack[]>(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolumeState] = useState(0.55);
  const [muted, setMuted] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [loungePanelOpen, setLoungePanelOpen] = useState(false);

  playlistRef.current = playlist;
  currentIndexRef.current = currentIndex;
  volumeRef.current = volume;
  mutedRef.current = muted;

  const currentTrack = playlist[currentIndex] ?? null;

  const applyVolume = useCallback((nextVolume: number, nextMuted: boolean) => {
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(Math.round(nextVolume * 100));
    if (nextMuted) player.mute();
    else player.unMute();
  }, []);

  const playNext = useCallback(() => {
    if (playlistRef.current.length === 0) return;
    const nextIndex = (currentIndexRef.current + 1) % playlistRef.current.length;
    const track = playlistRef.current[nextIndex];
    if (!track || !playerRef.current) return;

    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;
    pendingAutoplayRef.current = true;
    playerRef.current.loadVideoById({ videoId: track.youtubeVideoId, startSeconds: 0 });
    applyVolume(volumeRef.current, mutedRef.current);
  }, [applyVolume]);

  const playNextRef = useRef(playNext);
  playNextRef.current = playNext;
  const applyVolumeRef = useRef(applyVolume);
  applyVolumeRef.current = applyVolume;

  const requestPlayback = useCallback((player: YoutubePlayer) => {
    pendingAutoplayRef.current = true;
    try {
      player.playVideo();
    } catch {
      /* user gesture may be required */
    }
    window.requestAnimationFrame(() => {
      try {
        player.playVideo();
      } catch {
        /* retry once on next frame */
      }
    });
  }, []);

  const loadVideoAtIndex = useCallback(
    (index: number, autoplay: boolean) => {
      const track = playlistRef.current[index];
      if (!track) return;

      setCurrentIndex(index);
      currentIndexRef.current = index;
      setPlayerError(null);

      const player = playerRef.current;
      if (!player) {
        if (autoplay) {
          pendingPlayIndexRef.current = index;
          pendingAutoplayRef.current = true;
        }
        return;
      }

      pendingAutoplayRef.current = autoplay;
      pendingPlayIndexRef.current = null;
      player.loadVideoById({ videoId: track.youtubeVideoId, startSeconds: 0 });
      applyVolume(volumeRef.current, mutedRef.current);

      if (autoplay) {
        requestPlayback(player);
      }
    },
    [applyVolume, requestPlayback],
  );

  const loadVideoAtIndexRef = useRef(loadVideoAtIndex);
  loadVideoAtIndexRef.current = loadVideoAtIndex;

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;
    let attempts = 0;

    function mountPlayer() {
      if (cancelled || !window.YT || playerRef.current) return;

      const host = document.getElementById(BEATS_YOUTUBE_HOST_ID);
      if (!host) {
        if (attempts < 80) {
          attempts += 1;
          retryTimer = window.setTimeout(mountPlayer, 250);
        }
        return;
      }

      const firstTrack = playlistRef.current[0];
      const playerVars: Record<string, string | number> = {
        autoplay: 0,
        enablejsapi: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
      };
      if (typeof window !== "undefined") {
        playerVars.origin = window.location.origin;
      }

      playerRef.current = new window.YT.Player(BEATS_YOUTUBE_HOST_ID, {
        height: "100%",
        width: "100%",
        videoId: firstTrack?.youtubeVideoId,
        playerVars,
        events: {
          onReady: (event) => {
            if (cancelled) return;
            playerRef.current = event.target;
            setIsReady(true);
            applyVolumeRef.current(volumeRef.current, mutedRef.current);

            if (firstTrack) {
              setCurrentIndex(0);
              currentIndexRef.current = 0;
            }

            const pendingIndex = pendingPlayIndexRef.current;
            if (pendingIndex !== null && pendingAutoplayRef.current) {
              loadVideoAtIndexRef.current(pendingIndex, true);
            }
          },
          onStateChange: (event) => {
            const YT = window.YT;
            if (!YT) return;

            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setHasStarted(true);
              setPlayerError(null);
              pendingAutoplayRef.current = false;
              pendingPlayIndexRef.current = null;
            } else if (event.data === YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === YT.PlayerState.ENDED) {
              playNextRef.current();
            } else if (
              pendingAutoplayRef.current &&
              (event.data === YT.PlayerState.CUED || event.data === YT.PlayerState.BUFFERING)
            ) {
              requestPlayback(event.target);
            }
          },
          onError: (event) => {
            setPlayerError("playback-error");
            setIsPlaying(false);
            pendingAutoplayRef.current = false;
            pendingPlayIndexRef.current = null;
            if (event.data === 2 || event.data === 100 || event.data === 101 || event.data === 150) {
              playNextRef.current();
            }
          },
        },
      });
    }

    void loadYoutubeApi().then(() => {
      if (cancelled) return;
      mountPlayer();
    });

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    applyVolume(volume, muted);
  }, [applyVolume, volume, muted, isReady]);

  const setPlaylist = useCallback((tracks: BeatsTrack[]) => {
    setPlaylistState(tracks);
    playlistRef.current = tracks;
    if (tracks.length === 0) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      return;
    }
    if (currentIndexRef.current >= tracks.length) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }
  }, []);

  const playTrack = useCallback(
    (index: number) => {
      if (!playlistRef.current[index]) return;
      loadVideoAtIndex(index, true);
    },
    [loadVideoAtIndex],
  );

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    const track = playlistRef.current[currentIndexRef.current];
    if (!player || !track) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
      return;
    }

    setPlayerError(null);
    pendingAutoplayRef.current = true;

    const state = player.getPlayerState();
    const YT = window.YT;
    if (
      YT &&
      (state === YT.PlayerState.CUED ||
        state === YT.PlayerState.PAUSED ||
        state === YT.PlayerState.ENDED ||
        state === YT.PlayerState.UNSTARTED)
    ) {
      requestPlayback(player);
    } else {
      loadVideoAtIndex(currentIndexRef.current, true);
    }
  }, [isPlaying, loadVideoAtIndex, requestPlayback]);

  const playPrevious = useCallback(() => {
    if (playlistRef.current.length === 0) return;
    const prevIndex =
      (currentIndexRef.current - 1 + playlistRef.current.length) % playlistRef.current.length;
    loadVideoAtIndex(prevIndex, true);
  }, [loadVideoAtIndex]);

  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = Math.min(Math.max(nextVolume, 0), 1);
      setVolumeState(clamped);
      volumeRef.current = clamped;
      const nextMuted = clamped === 0;
      setMuted(nextMuted);
      mutedRef.current = nextMuted;
      applyVolume(clamped, nextMuted);
    },
    [applyVolume],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      applyVolume(volumeRef.current, next);
      return next;
    });
  }, [applyVolume]);

  const refreshVote = useCallback((trackId: string, voteCount: number, userHasVoted: boolean) => {
    setPlaylistState((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, voteCount, userHasVoted } : track,
      ),
    );
  }, []);

  useEffect(() => {
    if (initialPlaylist.length > 0) {
      setPlaylist(initialPlaylist);
    }
  }, [initialPlaylist, setPlaylist]);

  useEffect(() => {
    if (initialPlaylist.length > 0) return;

    const supabase = createBrowserClient();
    if (!supabase) return;

    void supabase.rpc("get_anime_beats_playlist").then(({ data }) => {
      if (!data?.length) return;

      setPlaylist(
        (data as Array<{
          id: string;
          title: string;
          artist: string;
          anime_title: string | null;
          youtube_video_id: string;
          artwork_url: string | null;
          vote_count: number;
          sort_order: number;
          user_has_voted: boolean;
        }>).map((row) => ({
          id: row.id,
          title: row.title,
          artist: row.artist,
          animeTitle: row.anime_title,
          youtubeVideoId: row.youtube_video_id,
          artworkUrl: row.artwork_url,
          voteCount: Number(row.vote_count),
          sortOrder: Number(row.sort_order),
          userHasVoted: Boolean(row.user_has_voted),
        })),
      );
    });
  }, [initialPlaylist.length, setPlaylist]);

  const value = useMemo(
    () => ({
      playlist,
      currentIndex,
      currentTrack,
      isPlaying,
      isReady,
      hasStarted,
      loungePanelOpen,
      volume,
      muted,
      playerError,
      setPlaylist,
      setLoungePanelOpen,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      setVolume,
      toggleMute,
      refreshVote,
    }),
    [
      playlist,
      currentIndex,
      currentTrack,
      isPlaying,
      isReady,
      hasStarted,
      loungePanelOpen,
      volume,
      muted,
      playerError,
      setPlaylist,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      setVolume,
      toggleMute,
      refreshVote,
    ],
  );

  return (
    <BeatsLoungeContext.Provider value={value}>
      {children}
      <BeatsLoungeAudioEngine />
    </BeatsLoungeContext.Provider>
  );
}

export function useBeatsLounge() {
  const context = useContext(BeatsLoungeContext);
  if (!context) {
    throw new Error("useBeatsLounge must be used within BeatsLoungeProvider");
  }
  return context;
}
