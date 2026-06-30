"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BlogHeroSlideFrame } from "@/components/blog/BlogHeroSlideFrame";
import {
  clampFocal,
  rotateSlideClockwise,
  rotateSlideCounterClockwise,
  type BlogHeroRotation,
} from "@/lib/blog/heroSlides";
import { useLocale } from "@/providers/LocaleProvider";

type BlogHeroSlidePositionEditorProps = {
  imageUrl: string;
  focalX: number;
  focalY: number;
  rotation: BlogHeroRotation;
  onChange: (patch: { focalX?: number; focalY?: number; rotation?: BlogHeroRotation }) => void;
};

export function BlogHeroSlidePositionEditor({
  imageUrl,
  focalX,
  focalY,
  rotation,
  onChange,
}: BlogHeroSlidePositionEditorProps) {
  const { t } = useLocale();
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const slide = { imageUrl, focalX, focalY, objectPosition: "center" as const, rotation };

  const moveByPointer = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      const frame = frameRef.current;
      if (!drag || !frame) return;

      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaX = clientX - drag.startX;
      const deltaY = clientY - drag.startY;
      const nextX = clampFocal(drag.originX - (deltaX / rect.width) * 100);
      const nextY = clampFocal(drag.originY - (deltaY / rect.height) * 100);

      onChange({ focalX: nextX, focalY: nextY });
    },
    [onChange],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: focalX,
      originY: focalY,
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    moveByPointer(event.clientX, event.clientY);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 5 : 1;
      let nextX = focalX;
      let nextY = focalY;

      switch (event.key) {
        case "ArrowLeft":
          nextX = clampFocal(focalX - step);
          break;
        case "ArrowRight":
          nextX = clampFocal(focalX + step);
          break;
        case "ArrowUp":
          nextY = clampFocal(focalY - step);
          break;
        case "ArrowDown":
          nextY = clampFocal(focalY - step);
          break;
        default:
          return;
      }

      event.preventDefault();
      onChange({ focalX: nextX, focalY: nextY });
    };

    const frame = frameRef.current;
    if (!frame) return;

    frame.addEventListener("keydown", onKeyDown);
    return () => frame.removeEventListener("keydown", onKeyDown);
  }, [focalX, focalY, onChange]);

  return (
    <div className="space-y-2">
      <p className="text-xs text-zinc-400">{t.admin.blog.heroSlides.objectPosition}</p>

      <BlogHeroSlideFrame
        slide={slide}
        sizes="(max-width: 768px) 100vw, 360px"
        className={`rounded-lg outline-none border ${
          dragging ? "cursor-grabbing border-orange-500/60" : "cursor-grab border-zinc-700 hover:border-orange-500/40"
        }`}
      >
        <div
          ref={frameRef}
          tabIndex={0}
          role="application"
          aria-label={t.admin.blog.heroSlides.dragHint}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="absolute inset-0 z-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.35))]" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
            <div className="rounded-lg border border-white/20 bg-black/55 px-3 py-2 text-center text-[11px] leading-relaxed text-white backdrop-blur-sm">
              <span className="mb-1 block text-base" aria-hidden>
                ✥
              </span>
              {t.admin.blog.heroSlides.dragHint}
            </div>
          </div>

          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-orange-300 bg-orange-500/80 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
            style={{ left: `${focalX}%`, top: `${focalY}%` }}
            aria-hidden
          />
        </div>
      </BlogHeroSlideFrame>

      <p className="text-[11px] text-zinc-500">
        {t.admin.blog.heroSlides.focalMeta
          .replace("{x}", String(focalX))
          .replace("{y}", String(focalY))}
        {" · "}
        {t.admin.blog.heroSlides.rotationMeta.replace("{deg}", String(rotation))}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange({ rotation: rotateSlideCounterClockwise(rotation) })}
          className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 transition hover:border-orange-500/40"
          title={t.admin.blog.heroSlides.rotateLeft}
        >
          ↺ {t.admin.blog.heroSlides.rotateLeft}
        </button>
        <button
          type="button"
          onClick={() => onChange({ rotation: rotateSlideClockwise(rotation) })}
          className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 transition hover:border-orange-500/40"
          title={t.admin.blog.heroSlides.rotateRight}
        >
          ↻ {t.admin.blog.heroSlides.rotateRight}
        </button>
      </div>
    </div>
  );
}
