import { ChannelProfileContent } from "@/components/ChannelProfileContent";

type ChannelPageProps = {
  params: Promise<{ username: string }>;
};

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { username } = await params;

  return <ChannelProfileContent username={username} />;
}
