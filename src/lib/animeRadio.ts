export type RadioStationId = "anime-ost" | "lofi-anime";

export type RadioStation = {
  id: RadioStationId;
  streamUrl: string;
  listenMoeGateway?: string;
};

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "anime-ost",
    streamUrl: "https://listen.moe/stream",
    listenMoeGateway: "wss://listen.moe/gateway_v2",
  },
  {
    id: "lofi-anime",
    streamUrl: "https://radio.plaza.one/mp3",
  },
];

export function getRadioStation(id: RadioStationId): RadioStation {
  return RADIO_STATIONS.find((station) => station.id === id) ?? RADIO_STATIONS[0];
}

export const RADIO_STORAGE_KEY = "clashanime-radio";

export type PersistedRadioState = {
  stationId: RadioStationId;
  volume: number;
  muted: boolean;
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
          : 0.75,
      muted: Boolean(parsed.muted),
    };
  } catch {
    return null;
  }
}

export function writePersistedRadioState(state: PersistedRadioState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RADIO_STORAGE_KEY, JSON.stringify(state));
}
