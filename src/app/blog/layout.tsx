import { BlogHeroProvider } from "@/providers/BlogHeroProvider";
import {
  loadBlogHeroDisplaySettings,
  loadEnabledBlogHeroSlides,
} from "@/lib/blog/heroSlides.server";

export const dynamic = "force-dynamic";

type BlogLayoutProps = {
  children: React.ReactNode;
};

export default async function BlogLayout({ children }: BlogLayoutProps) {
  const [slides, display] = await Promise.all([
    loadEnabledBlogHeroSlides(),
    loadBlogHeroDisplaySettings(),
  ]);

  return (
    <BlogHeroProvider initialSlides={slides} initialDisplay={display}>
      {children}
    </BlogHeroProvider>
  );
}
