"use client";

import type { ReactNode } from "react";
import { BlogAds } from "@/components/ads/BlogAds";
import { BlogArenaNav } from "@/components/blog/BlogArenaNav";
import { BlogHeroBanner } from "@/components/blog/BlogHeroBanner";
import { Footer } from "@/components/Footer";

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlogAds variant="top" />
      </div>
      {children}
      <Footer />
    </div>
  );
}
