import { CommunityPostPageContent } from "@/components/CommunityPostPageContent";

export const dynamic = "force-dynamic";

type CommunityPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityPostPage({ params }: CommunityPostPageProps) {
  const { id } = await params;
  return <CommunityPostPageContent postId={id} />;
}
