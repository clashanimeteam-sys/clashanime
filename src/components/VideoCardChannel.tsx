"use client";

import Image from "next/image";
import Link from "next/link";
import type { VideoChannel } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type VideoCardChannelProps = {
  channel: VideoChannel;
};

export function VideoCardChannel({ channel }: VideoCardChannelProps) {
  const label = channel.display_name?.trim() || channel.username;

  return (
    <Link
      href={`/channel/${channel.username}`}
      className="group/channel flex items-center gap-2 rounded-lg py-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950"
    >
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        {channel.avatar_url ? (
          <Image
            src={channel.avatar_url}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-500">
            {getInitials(label)}
          </div>
        )}
      </div>
      <span className="font-channel min-w-0 truncate text-xs font-semibold text-zinc-800 transition-colors group-hover/channel:text-accent dark:text-zinc-100">
        {label}
      </span>
    </Link>
  );
}

export function profileToVideoChannel(profile: {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}): VideoChannel {
  return {
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
  };
}
