import { Suspense } from "react";
import { UploadVideoForm, type UploadClashContext } from "@/components/UploadVideoForm";
import { getAnimeReleaseClashDetail } from "@/lib/animeTracker.server";
import { UploadPageGate } from "@/components/upload/UploadPageGate";

export const dynamic = "force-dynamic";

type UploadPageProps = {
  searchParams: Promise<{ clash?: string }>;
};

async function UploadPageInner({ clashId }: { clashId?: string }) {
  let clashContext: UploadClashContext | null = null;

  if (clashId) {
    const clash = await getAnimeReleaseClashDetail(clashId);
    if (clash) {
      clashContext = {
        clashId: clash.clashId,
        animeTitle: clash.animeTitle,
        matchTags: clash.matchTags,
      };
    }
  }

  return <UploadVideoForm clashContext={clashContext} />;
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const { clash: clashId } = await searchParams;

  return (
    <UploadPageGate>
      <Suspense fallback={null}>
        <UploadPageInner clashId={clashId} />
      </Suspense>
    </UploadPageGate>
  );
}
