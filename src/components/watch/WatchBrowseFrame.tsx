import { createWatchGateToken, watchSiteUrl } from "@/lib/watchGate";

type WatchBrowseFrameProps = {
  userId: string;
};

export async function WatchBrowseFrame({ userId }: WatchBrowseFrameProps) {
  const token = await createWatchGateToken(userId);
  const entryUrl = `${watchSiteUrl()}/api/gate/accept?token=${encodeURIComponent(token)}&next=${encodeURIComponent("/?embed=1")}`;

  return (
    <div className="fixed inset-0 top-0 z-20 bg-[#06060c] md:start-60">
      <iframe
        src={entryUrl}
        title="Watch Anime"
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
