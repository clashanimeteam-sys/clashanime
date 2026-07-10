import { redirect } from "next/navigation";
import { createWatchGateToken, watchSiteUrl } from "@/lib/watchGate";
import { createServerClient } from "@/lib/supabase/server";

export async function WatchAnimeFrame() {
  if (!process.env.WATCH_GATE_SECRET?.trim()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-sm text-zinc-500">
        Watch Anime is not configured yet. Add WATCH_GATE_SECRET and WATCH_SITE_URL in Vercel.
      </div>
    );
  }

  const supabase = await createServerClient();
  if (!supabase) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-sm text-zinc-500">
        Watch Anime is not available right now.
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=%2Fwatch");
  }

  const token = await createWatchGateToken(user.id);
  const entryUrl = `${watchSiteUrl()}/api/gate/accept?token=${encodeURIComponent(token)}&next=${encodeURIComponent("/?embed=1")}`;

  return (
    <div className="fixed inset-0 top-0 z-20 bg-[#f4f6f8] md:start-60">
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
