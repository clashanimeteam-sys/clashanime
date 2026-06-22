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
import { trackArtwork } from "@/lib/animeBeatsLounge";
import { createBrowserClient } from "@/lib/supabase/client";

type YoutubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  loadVideoById: (videoId: string) => void;
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
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: () => void;
          };
        },
      ) => YoutubePlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_SCRIPT_ID = "youtube-iframe-api";
const YT_ENDED = 0;

type BeatsLoungeContextValue = {
  playlist: BeatsTrack[];
  currentIndex: number;
  currentTrack: BeatsTrack | null;
  isPlaying: boolean;
  isReady: boolean;
  hasStarted: boolean;
  volume: number;
  muted: boolean;
  setPlaylist: (tracks: BeatsTrack[]) => void;
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

export function BeatsLoungeProvider({
  children,
  initialPlaylist = [],
}: BeatsLoungeProviderProps) {
  const playerRef = useRef<YoutubePlayer | null>(null);
  const hostIdRef = useRef(`beats-youtube-${Math.random().toString(36).slice(2)}`);
  const playlistRef = useRef<BeatsTrack[]>(initialPlaylist);
  const currentIndexRef = useRef(0);

  const [playlist, setPlaylistState] = useState<BeatsTrack[]>(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolumeState] = useState(0.55);
  const [muted, setMuted] = useState(false);

  playlistRef.current = playlist;
  currentIndexRef.current = currentIndex;

  const currentTrack = playlist[currentIndex] ?? null;

  const applyVolume = useCallback((nextVolume: number, nextMuted: boolean) => {
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(Math.round(nextVolume * 100));
    if (nextMuted) player.mute();
    else player.unMute();
  }, []);

  const loadVideoAtIndex = useCallback(
    (index: number, autoplay: boolean) => {
      const track = playlistRef.current[index];
      if (!track || !playerRef.current) return;

      setCurrentIndex(index);
      currentIndexRef.current = index;
      playerRef.current.loadVideoById(track.youtubeVideoId);
      applyVolume(volume, muted);

      if (autoplay) {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setHasStarted(true);
      }
    },
    [applyVolume, muted, volume],
  );

  const playNext = useCallback(() => {
    if (playlistRef.current.length === 0) return;
    const nextIndex = (currentIndexRef.current + 1) % playlistRef.current.length;
    loadVideoAtIndex(nextIndex, true);
  }, [loadVideoAtIndex]);

  useEffect(() => {
    let cancelled = false;

    void loadYoutubeApi().then(() => {
      if (cancelled || !window.YT || playerRef.current) return;

      const firstTrack = playlistRef.current[0];
      playerRef.current = new window.YT.Player(hostIdRef.current, {
        height: "0",
        width: "0",
        videoId: firstTrack?.youtubeVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (cancelled) return;
            setIsReady(true);
            applyVolume(volume, muted);
          },
          onStateChange: (event) => {
            if (event.data === YT_ENDED) {
              playNext();
            } else if (event.data === window.YT?.PlayerState.PLAYING) {
              setIsPlaying(true);
              setHasStarted(true);
            } else if (event.data === window.YT?.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            playNext();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [applyVolume, muted, playNext, volume]);

  const setPlaylist = useCallback((tracks: BeatsTrack[]) => {
    setPlaylistState(tracks);
    playlistRef.current = tracks;
    if (tracks.length === 0) {
      setCurrentIndex(0);
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
    if (!player || !currentTrack) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
      return;
    }

    player.playVideo();
    setIsPlaying(true);
    setHasStarted(true);
  }, [currentTrack, isPlaying]);

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
      setMuted(clamped === 0);
      applyVolume(clamped, clamped === 0);
    },
    [applyVolume],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      applyVolume(volume, next);
      return next;
    });
  }, [applyVolume, volume]);

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
      volume,
      muted,
      setPlaylist,
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
      volume,
      muted,
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
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0">
        <div id={hostIdRef.current} />
      </div>
      {children}
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

export function useBeatsLoungeArtwork(track: BeatsTrack | null) {
  return track ? trackArtwork(track) : null;
}
