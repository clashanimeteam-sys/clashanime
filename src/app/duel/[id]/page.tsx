import { notFound } from "next/navigation";
import { ChallengeDuelContent } from "@/components/duel/ChallengeDuelContent";
import { getVideoDuelById } from "@/lib/videoDuelsServer";

export const dynamic = "force-dynamic";

type DuelPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DuelPage({ params }: DuelPageProps) {
  const { id } = await params;
  const duel = await getVideoDuelById(id);

  if (!duel) {
    notFound();
  }

  return <ChallengeDuelContent duel={duel} />;
}
