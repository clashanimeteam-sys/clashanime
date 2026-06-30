"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  DEFAULT_BLOG_HERO_DISPLAY,
  type BlogHeroDisplaySettings,
  type BlogHeroSlide,
} from "@/lib/blog/heroSlides";

type BlogHeroContextValue = {
  slides: BlogHeroSlide[];
  display: BlogHeroDisplaySettings;
};

const BlogHeroContext = createContext<BlogHeroContextValue>({
  slides: [],
  display: DEFAULT_BLOG_HERO_DISPLAY,
});

type BlogHeroProviderProps = {
  children: ReactNode;
  initialSlides: BlogHeroSlide[];
  initialDisplay: BlogHeroDisplaySettings;
};

export function BlogHeroProvider({
  children,
  initialSlides,
  initialDisplay,
}: BlogHeroProviderProps) {
  return (
    <BlogHeroContext.Provider value={{ slides: initialSlides, display: initialDisplay }}>
      {children}
    </BlogHeroContext.Provider>
  );
}

export function useBlogHero() {
  return useContext(BlogHeroContext);
}
