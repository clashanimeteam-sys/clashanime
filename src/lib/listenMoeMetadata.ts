export type ListenMoeTrack = {
  title: string;
  artist: string;
  artworkUrl: string | null;
};

type ListenMoeArtist = {
  name?: string | null;
  image?: string | null;
};

type ListenMoeAlbum = {
  image?: string | null;
};

type ListenMoeSong = {
  title?: string | null;
  artists?: ListenMoeArtist[] | null;
  albums?: ListenMoeAlbum[] | null;
};

type ListenMoePayload = {
  song?: ListenMoeSong | null;
};

type ListenMoeMessage = {
  op: number;
  d?: ListenMoePayload | null;
};

function parseTrack(payload: ListenMoePayload | null | undefined): ListenMoeTrack | null {
  const song = payload?.song;
  if (!song?.title) return null;

  const artist = song.artists?.[0]?.name?.trim() || "Unknown artist";
  const cover = song.albums?.[0]?.image?.trim();
  const artistImage = song.artists?.[0]?.image?.trim();

  let artworkUrl: string | null = null;
  if (cover) {
    artworkUrl = `https://cdn.listen.moe/covers/${cover}`;
  } else if (artistImage) {
    artworkUrl = `https://cdn.listen.moe/artists/${artistImage}`;
  }

  return {
    title: song.title,
    artist,
    artworkUrl,
  };
}

export function connectListenMoeMetadata(
  gatewayUrl: string,
  onTrack: (track: ListenMoeTrack | null) => void,
) {
  let active = true;
  let socket: WebSocket | null = null;
  let reconnectTimer: number | null = null;

  function scheduleReconnect() {
    if (!active || reconnectTimer != null) return;
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, 4000);
  }

  function connect() {
    if (!active) return;

    socket = new WebSocket(gatewayUrl);

    socket.addEventListener("open", () => {
      socket?.send(JSON.stringify({ op: 1, d: null }));
    });

    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(String(event.data)) as ListenMoeMessage;
        if (message.op === 1) {
          onTrack(parseTrack(message.d));
        }
      } catch {
        // Ignore malformed websocket payloads.
      }
    });

    socket.addEventListener("close", () => {
      socket = null;
      scheduleReconnect();
    });

    socket.addEventListener("error", () => {
      socket?.close();
    });
  }

  connect();

  return () => {
    active = false;
    if (reconnectTimer != null) {
      window.clearTimeout(reconnectTimer);
    }
    socket?.close();
  };
}
