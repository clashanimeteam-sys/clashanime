"use client";

import type { ReactNode } from "react";
import { BlogArenaNav } from "@/components/blog/BlogArenaNav";
import { BlogHeroBanner } from "@/components/blog/BlogHeroBanner";

type BlogPageShellProps = {
  children: ReactNode;
  heroCompact?: boolean;
  articleTitle?: string;
};

export function BlogPageShell({ children, heroCompact = false, articleTitle }: BlogPageShellProps) {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <BlogArenaNav />
      <BlogHeroBanner compact={heroCompact} articleTitle={articleTitle} />
      {children}
    </div>
  );
}
