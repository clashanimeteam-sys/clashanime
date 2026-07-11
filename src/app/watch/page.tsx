import { redirect } from "next/navigation";
import { WatchLaunchPage } from "@/components/watch/WatchLaunchPage";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { getWatchAccess } from "@/lib/watchAccess";
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

  const access = await getWatchAccess(supabase, user.id);
  if (!access.allowed) {
    redirect("/earn?next=%2Fwatch");
  }

  return <WatchLaunchPage />;
}
