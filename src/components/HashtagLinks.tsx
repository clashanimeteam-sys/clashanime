"use client";

import Link from "next/link";
import { Fragment } from "react";
import { buildHashtagPath } from "@/lib/hashtagUrls";

type HashtagLinksProps = {
  tags: string[];
  className?: string;
  linkClassName?: string;
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function HashtagLinks({
  tags,
  className = "",
  linkClassName = "transition-colors hover:text-orange-400 hover:underline",
  onLinkClick,
}: HashtagLinksProps) {
  const visibleTags = tags.filter((tag) => tag.trim().length > 0);
  if (visibleTags.length === 0) return null;

  return (
    <span className={className}>
      {visibleTags.map((tag, index) => (
        <Fragment key={`${tag}-${index}`}>
          {index > 0 ? " " : null}
          <Link
            href={buildHashtagPath(tag)}
            className={linkClassName}
            onClick={onLinkClick}
          >
            #{tag.replace(/^#+/, "")}
          </Link>
        </Fragment>
      ))}
    </span>
  );
}
