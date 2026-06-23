"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CommunityPostActions } from "@/components/CommunityPostActions";
import { CommunityReportModal } from "@/components/CommunityReportModal";
import { RichBodyContent } from "@/components/RichBodyContent";
import { useLocale } from "@/providers/LocaleProvider";

export type ChannelCommunityPost = {
  id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  dislikes_count: number;
  comments_count: number;
  shares_count: number;
};

type ChannelCommunityPostsProps = {
  posts: ChannelCommunityPost[];
};

export function ChannelCommunityPosts({ posts }: ChannelCommunityPostsProps) {
  const { t, formatDateTime } = useLocale();
  const [activeReportPost, setActiveReportPost] = useState<ChannelCommunityPost | null>(null);

  if (posts.length === 0) {
    return <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noChannelPosts}</p>;
  }

  return (
    <>
      <div className="mt-5 space-y-4">
        {posts.map((post) => {
          const preview = post.body || t.communityFeed.imagePostPreview;
          return (
            <article
              key={post.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <time className="text-xs text-zinc-500" dateTime={post.created_at}>
                  {formatDateTime(post.created_at)}
                </time>
                <Link
                  href={`/community/post/${post.id}`}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  {t.profile.viewCommunityPost}
                </Link>
              </div>

              {post.body ? (
                <RichBodyContent
                  body={post.body}
                  className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200"
                />
              ) : null}

              {post.image_url ? (
                <Link href={`/community/post/${post.id}`} className="mt-3 block">
                  <div className="relative aspect-video max-h-80 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    <Image src={post.image_url} alt="" fill className="object-cover" unoptimized />
                  </div>
                </Link>
              ) : null}

              <div className="mt-4">
                <CommunityPostActions
                  postId={post.id}
                  postPreview={preview}
                  initialLikes={post.likes_count}
                  initialDislikes={post.dislikes_count}
                  initialComments={post.comments_count}
                  initialShares={post.shares_count}
                  onReportOpen={() => setActiveReportPost(post)}
                />
              </div>
            </article>
          );
        })}
      </div>

      <CommunityReportModal
        open={Boolean(activeReportPost)}
        onClose={() => setActiveReportPost(null)}
        postId={activeReportPost?.id ?? ""}
        postPreview={activeReportPost?.body || activeReportPost?.image_url || undefined}
      />
    </>
  );
}
