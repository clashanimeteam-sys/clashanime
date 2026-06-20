export type RadioStationId = "anime-ost" | "lofi-anime";

export type RadioActionClip = {
  src: string;
  position: "left" | "right" | "center";
  delay?: string;
};

export type RadioStation = {
  id: RadioStationId;
  streamUrl: string;
  listenMoeGateway?: string;
  coverImage: string;
  backdropImages: string[];
  backdropCharacter?: string;
  accentFrom: string;
  accentTo: string;
};

/** Static action/thriller anime stills for the radio page backdrop. */
export const RADIO_ACTION_IMAGES = [
  "/radio/action-1.jpg",
  "/radio/action-2.jpg",
  "/radio/action-3.jpg",
] as const;

/** Short action anime loops shown while the radio is playing. */
export const RADIO_ACTION_CLIPS: RadioActionClip[] = [
  { src: "/radio/action-aot.gif", position: "left", delay: "0s" },
  { src: "/radio/action-bleach.gif", position: "right", delay: "0.5s" },
  { src: "/radio/action-86.gif", position: "center", delay: "1s" },
  { src: "/radio/action-akame.gif", position: "right", delay: "1.4s" },
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "anime-ost",
    streamUrl: "https://listen.moe/stream",
    listenMoeGateway: "wss://listen.moe/gateway_v2",
    coverImage: "/radio/action-2.jpg",
    backdropImages: ["/radio/action-1.jpg", "/radio/action-2.jpg", "/radio/action-3.jpg"],
    backdropCharacter: "https://listen.moe/images/girls/chitose.png",
    accentFrom: "#ff015b",
    accentTo: "#ff6b35",
  },
  {
    id: "lofi-anime",
    streamUrl: "https://radio.plaza.one/mp3",
    coverImage: "/radio/action-3.jpg",
    backdropImages: ["/radio/action-3.jpg", "/radio/action-1.jpg", "/radio/action-2.jpg"],
    backdropCharacter: "https://listen.moe/images/girls/chitose.png",
    accentFrom: "#7c3aed",
    accentTo: "#22d3ee",
  },
];

export function getRadioStation(id: RadioStationId): RadioStation {
  return RADIO_STATIONS.find((station) => station.id === id) ?? RADIO_STATIONS[0];
}

export const RADIO_STORAGE_KEY = "clashanime-radio";
export const DEFAULT_RADIO_VOLUME = 0.35;

export type PersistedRadioState = {
  stationId: RadioStationId;
  volume: number;
  muted: boolean;
  pausedByUser?: boolean;
};

export function readPersistedRadioState(): PersistedRadioState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(RADIO_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedRadioState>;
    const stationId = parsed.stationId === "lofi-anime" ? "lofi-anime" : "anime-ost";

    return {
      stationId,
      volume:
        typeof parsed.volume === "number"
          ? Math.min(1, Math.max(0, parsed.volume))
          : DEFAULT_RADIO_VOLUME,
      muted: Boolean(parsed.muted),
      pausedByUser: Boolean(parsed.pausedByUser),
    };
  } catch {
    return null;
  }
}

export function writePersistedRadioState(state: PersistedRadioState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RADIO_STORAGE_KEY, JSON.stringify(state));
}
