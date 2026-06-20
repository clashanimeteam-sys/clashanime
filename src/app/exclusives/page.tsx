import { ExclusivesPageContent } from "@/components/ExclusivesPageContent";
import { getVerifiedCreatorVideos } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function ExclusivesPage() {
  const videos = await getVerifiedCreatorVideos();
  return <ExclusivesPageContent videos={videos} />;
}
