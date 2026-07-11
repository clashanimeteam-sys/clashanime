import { redirect } from "next/navigation";
import { createWatchGateToken, watchSiteUrl } from "@/lib/watchGate";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { createServerClient } from "@/lib/supabase/server";

export const metadata = buildPageMetadata("watch");
export const dynamic = "force-dynamic";

export default async function WatchPage() {
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

  let token: string;
  try {
    token = await createWatchGateToken(user.id);
  } catch {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 text-center text-sm text-zinc-500">
        Watch gate is not configured. Set WATCH_GATE_SECRET on clashanime.com and watchclashanime.com.
      </div>
    );
  }

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
