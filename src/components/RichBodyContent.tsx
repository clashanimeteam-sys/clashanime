"use client";

import Image from "next/image";
import { useMemo } from "react";
import { splitBodyWithStickers } from "@/lib/stickers";
import { useStickers } from "@/providers/StickersProvider";

type RichBodyContentProps = {
  body: string;
  className?: string;
};

export function RichBodyContent({ body, className }: RichBodyContentProps) {
  const { stickerMap } = useStickers();
  const segments = useMemo(() => splitBodyWithStickers(body), [body]);

  if (!body) return null;

  return (
    <div className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <span key={`text-${index}`} className="whitespace-pre-wrap">
              {segment.value}
            </span>
          );
        }

        const sticker = stickerMap.get(segment.value);
        if (!sticker) return null;

        return (
          <Image
            key={`sticker-${segment.value}-${index}`}
            src={sticker.image_url}
            alt={sticker.label || sticker.slug}
            width={80}
            height={80}
            unoptimized
            className="mx-0.5 inline-block h-20 w-20 align-middle object-contain"
          />
        );
      })}
    </div>
  );
}
