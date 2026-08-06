import { redirect } from "next/navigation";

/** Public entry point: latest anime news (copyright-safe editorial hub). */
export default function Home() {
  redirect("/blog/anime-news");
}
