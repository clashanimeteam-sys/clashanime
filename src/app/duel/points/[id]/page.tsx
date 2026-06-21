import { notFound } from "next/navigation";
import { PointsWagerDuelContent } from "@/components/duel/PointsWagerDuelContent";
import { getPointsWagerDuelById } from "@/lib/pointsDuelsServer";

export const dynamic = "force-dynamic";

type PointsWagerDuelPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PointsWagerDuelPage({ params }: PointsWagerDuelPageProps) {
  const { id } = await params;
  const duel = await getPointsWagerDuelById(id);

  if (!duel) {
    notFound();
  }

  return <PointsWagerDuelContent duel={duel} />;
}
