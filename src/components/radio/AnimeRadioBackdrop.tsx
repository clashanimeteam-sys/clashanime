"use client";

import Image from "next/image";
import { RADIO_ACTION_CLIPS, RADIO_ACTION_IMAGES, type RadioActionClip, type RadioStation } from "@/lib/animeRadio";

type AnimeRadioBackdropProps = {
  station: RadioStation;
  displayArt: string;
  isPlaying: boolean;
  trackKey: string;
};

const SPEED_LINES = [0, 1, 2, 3];

const CLIP_LAYOUT: Record<
  RadioActionClip["position"],
  string
> = {
  left: "start-[4%] top-[14%] h-44 w-32 sm:h-52 sm:w-40",
  right: "end-[4%] top-[10%] h-48 w-36 sm:h-56 sm:w-44",
  center: "start-1/2 top-[38%] h-40 w-56 -translate-x-1/2 sm:h-48 sm:w-72",
};

export function AnimeRadioBackdrop({
  station,
  displayArt,
  isPlaying,
  trackKey,
}: AnimeRadioBackdropProps) {
  const heroImage = station.backdropImages[0] ?? RADIO_ACTION_IMAGES[0];
  const secondaryImage = station.backdropImages[1] ?? RADIO_ACTION_IMAGES[1];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 ${isPlaying ? "animate-[ken-burns_20s_ease-in-out_infinite_alternate]" : ""}`}
      >
        <div className="relative h-full w-full scale-110">
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <div
        key={trackKey}
        className={`absolute inset-0 ${isPlaying ? "animate-[backdrop-crossfade_8s_ease-in-out_infinite_alternate]" : "opacity-35"}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={displayArt.startsWith("/") ? displayArt : secondaryImage}
            alt=""
            fill
            className="scale-110 object-cover opacity-60 blur-[1px]"
            sizes="100vw"
            unoptimized={!displayArt.startsWith("/")}
          />
        </div>
      </div>

      {RADIO_ACTION_IMAGES.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 ${isPlaying ? "animate-[backdrop-crossfade_10s_ease-in-out_infinite_alternate]" : "opacity-20"}`}
          style={{
            animationDelay: `${index * 2.5}s`,
            opacity: isPlaying ? undefined : 0.12 + index * 0.04,
          }}
        >
          <Image src={image} alt="" fill className="object-cover opacity-35 mix-blend-screen" sizes="100vw" />
        </div>
      ))}

      {isPlaying
        ? RADIO_ACTION_CLIPS.map((clip) => (
            <div
              key={clip.src}
              className={`absolute hidden overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/50 sm:block ${CLIP_LAYOUT[clip.position]} ${
                isPlaying ? "animate-[radio-float_6s_ease-in-out_infinite]" : "opacity-30"
              }`}
              style={{ animationDelay: clip.delay }}
            >
              <Image
                src={clip.src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40vw, 20vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          ))
        : null}

      <div
        className={`absolute -left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl ${isPlaying ? "animate-[aurora-drift_10s_ease-in-out_infinite]" : "opacity-40"}`}
        style={{
          background: `radial-gradient(circle, ${station.accentFrom}77 0%, transparent 70%)`,
        }}
      />
      <div
        className={`absolute -right-1/4 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl ${isPlaying ? "animate-[aurora-drift_12s_ease-in-out_infinite_reverse]" : "opacity-30"}`}
        style={{
          background: `radial-gradient(circle, ${station.accentTo}66 0%, transparent 72%)`,
        }}
      />

      <div className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.35)_2px,rgba(255,255,255,0.35)_3px)]" />

      {isPlaying
        ? SPEED_LINES.map((line) => (
            <div
              key={line}
              className="absolute inset-y-0 -left-1/3 w-1/3 animate-[speed-lines_2.8s_linear_infinite] opacity-0"
              style={{
                animationDelay: `${line * 0.65}s`,
                background:
                  "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)",
              }}
            />
          ))
        : null}

      {isPlaying ? (
        <div className="absolute inset-x-0 bottom-0 top-1/3 sm:hidden">
          <div className="relative mx-auto h-full w-[88%] overflow-hidden rounded-3xl border border-white/15 opacity-70">
            <Image
              src={RADIO_ACTION_CLIPS[0]?.src ?? "/radio/action-aot.gif"}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/60 to-black/88" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${station.accentFrom}22 0%, transparent 45%, ${station.accentTo}18 100%)`,
        }}
      />
    </div>
  );
}
