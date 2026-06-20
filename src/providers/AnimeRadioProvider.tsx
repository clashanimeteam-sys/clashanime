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
import {
  DEFAULT_RADIO_VOLUME,
  getRadioStation,
  readPersistedRadioState,
  writePersistedRadioState,
  type RadioStationId,
} from "@/lib/animeRadio";
import { connectListenMoeMetadata, type ListenMoeTrack } from "@/lib/listenMoeMetadata";

export type RadioNowPlaying = ListenMoeTrack & {
  stationLabel?: string;
};

type AnimeRadioContextValue = {
  stationId: RadioStationId;
  isPlaying: boolean;
  isLoading: boolean;
  hasStarted: boolean;
  volume: number;
  muted: boolean;
  nowPlaying: RadioNowPlaying | null;
  error: string | null;
  selectStation: (stationId: RadioStationId) => void;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
};

const AnimeRadioContext = createContext<AnimeRadioContextValue | null>(null);

type AnimeRadioProviderProps = {
  children: ReactNode;
};

export function AnimeRadioProvider({ children }: AnimeRadioProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const persisted = useMemo(() => readPersistedRadioState(), []);

  const [stationId, setStationId] = useState<RadioStationId>(
    persisted?.stationId ?? "anime-ost",
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolumeState] = useState(persisted?.volume ?? DEFAULT_RADIO_VOLUME);
  const [muted, setMuted] = useState(persisted?.muted ?? false);
  const [nowPlaying, setNowPlaying] = useState<RadioNowPlaying | null>(null);
  const [error, setError] = useState<string | null>(null);

  const station = useMemo(() => getRadioStation(stationId), [stationId]);

  const persist = useCallback(
    (next: Partial<{ stationId: RadioStationId; volume: number; muted: boolean }>) => {
      writePersistedRadioState({
        stationId: next.stationId ?? stationId,
        volume: next.volume ?? volume,
        muted: next.muted ?? muted,
      });
    },
    [stationId, volume, muted],
  );

  const attachStream = useCallback(async (nextStationId: RadioStationId) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextStation = getRadioStation(nextStationId);
    setIsLoading(true);
    setError(null);

    audio.pause();
    audio.src = nextStation.streamUrl;
    audio.load();

    try {
      await audio.play();
      setIsPlaying(true);
      setHasStarted(true);
      setIsLoading(false);
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
      setError("stream-error");
    }
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasStarted(true);
    setError(null);

    if (!audio.src) {
      await attachStream(stationId);
      return;
    }

    setIsLoading(true);

    try {
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      await attachStream(stationId);
    }
  }, [attachStream, stationId]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
      return;
    }
    await play();
  }, [isPlaying, pause, play]);

  const selectStation = useCallback(
    (nextStationId: RadioStationId) => {
      setStationId(nextStationId);
      persist({ stationId: nextStationId });

      if (isPlaying || hasStarted) {
        void attachStream(nextStationId);
      } else {
        setNowPlaying(null);
      }
    },
    [attachStream, hasStarted, isPlaying, persist],
  );

  const setVolume = useCallback(
    (nextVolume: number) => {
      const clamped = Math.min(1, Math.max(0, nextVolume));
      setVolumeState(clamped);
      if (clamped > 0) {
        setMuted(false);
      }
      persist({ volume: clamped, muted: clamped > 0 ? false : muted });
    },
    [muted, persist],
  );

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      persist({ muted: next });
      return next;
    });
  }, [persist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError("stream-error");
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (!station.listenMoeGateway) {
      setNowPlaying(null);
      return;
    }

    return connectListenMoeMetadata(station.listenMoeGateway, (track) => {
      setNowPlaying(track);
    });
  }, [station.listenMoeGateway]);

  const value = useMemo(
    () => ({
      stationId,
      isPlaying,
      isLoading,
      hasStarted,
      volume,
      muted,
      nowPlaying,
      error,
      selectStation,
      play,
      pause,
      togglePlay,
      setVolume,
      toggleMute,
    }),
    [
      stationId,
      isPlaying,
      isLoading,
      hasStarted,
      volume,
      muted,
      nowPlaying,
      error,
      selectStation,
      play,
      pause,
      togglePlay,
      setVolume,
      toggleMute,
    ],
  );

  return (
    <AnimeRadioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="none" />
    </AnimeRadioContext.Provider>
  );
}

export function useAnimeRadio() {
  const context = useContext(AnimeRadioContext);
  if (!context) {
    throw new Error("useAnimeRadio must be used within AnimeRadioProvider");
  }
  return context;
}
