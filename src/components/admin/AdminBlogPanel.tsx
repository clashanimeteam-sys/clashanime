"use client";

import Link from "next/link";
import { getAllBlogPosts, getBlogPostCopy } from "@/lib/blog/posts";
import { useLocale } from "@/providers/LocaleProvider";

export function AdminBlogPanel() {
  const { t, locale, formatDateTime } = useLocale();
  const posts = getAllBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.admin.blog.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{t.admin.blog.subtitle}</p>
        </div>
        <Link
          href="/blog"
          className="rounded-full border border-orange-500/40 bg-orange-950/30 px-4 py-2 text-sm font-bold text-orange-200"
        >
          {t.admin.blog.openHub}
        </Link>
      </div>

      <p className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
        {t.admin.blog.staticNote}
      </p>

      <p className="text-sm font-semibold text-zinc-300">
        {t.admin.blog.articlesCount.replace("{count}", String(posts.length))}
      </p>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-start text-sm">
            <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t.admin.blog.category}</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">{t.admin.blog.published}</th>
                <th className="px-4 py-3 font-semibold">{t.admin.blog.readingTime}</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => {
                const copy = getBlogPostCopy(post.slug, locale) ?? getBlogPostCopy(post.slug, "en");
                if (!copy) return null;

                return (
                  <tr key={post.slug} className="bg-zinc-950/40">
                    <td className="px-4 py-3 text-zinc-400">{t.blog.categories[post.category]}</td>
                    <td className="px-4 py-3 font-medium text-white">{copy.title}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {formatDateTime(post.publishedAt, { dateStyle: "medium" })}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {t.blog.minRead.replace("{minutes}", String(post.readingMinutes))}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-bold text-orange-300 hover:underline"
                      >
                        {t.admin.blog.viewOnSite}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
