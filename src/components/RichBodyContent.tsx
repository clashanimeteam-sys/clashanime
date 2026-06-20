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
            width={240}
            height={240}
            unoptimized
            className="my-2 block h-52 w-52 max-w-full object-contain sm:h-60 sm:w-60"
          />
        );
      })}
    </div>
  );
}
