"use client";

import Image from "next/image";
import type { RadioStation } from "@/lib/animeRadio";

type AnimeRadioBackdropProps = {
  station: RadioStation;
  displayArt: string;
  isPlaying: boolean;
  trackKey: string;
};

const SPEED_LINES = [0, 1, 2, 3];

export function AnimeRadioBackdrop({
  station,
  displayArt,
  isPlaying,
  trackKey,
}: AnimeRadioBackdropProps) {
  const secondaryArt = station.backdropImages[1] ?? station.coverImage;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 ${isPlaying ? "animate-[ken-burns_20s_ease-in-out_infinite_alternate]" : ""}`}
      >
        <div className="relative h-full w-full scale-105">
          <Image
            src={station.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      </div>

      <div
        key={trackKey}
        className={`absolute inset-0 ${isPlaying ? "animate-[backdrop-crossfade_8s_ease-in-out_infinite_alternate]" : "opacity-30"}`}
      >
        <div className="relative h-full w-full">
          <Image
            src={displayArt}
            alt=""
            fill
            className="scale-110 object-cover opacity-50 blur-[2px]"
            sizes="100vw"
            unoptimized
          />
        </div>
      </div>

      <div
        className={`absolute -left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl ${isPlaying ? "animate-[aurora-drift_10s_ease-in-out_infinite]" : "opacity-40"}`}
        style={{
          background: `radial-gradient(circle, ${station.accentFrom}66 0%, transparent 70%)`,
        }}
      />
      <div
        className={`absolute -right-1/4 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl ${isPlaying ? "animate-[aurora-drift_12s_ease-in-out_infinite_reverse]" : "opacity-30"}`}
        style={{
          background: `radial-gradient(circle, ${station.accentTo}55 0%, transparent 72%)`,
        }}
      />

      <div className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.35)_2px,rgba(255,255,255,0.35)_3px)]" />

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

      <div
        className={`absolute -left-6 top-[18%] hidden sm:block ${isPlaying ? "animate-[radio-float_6s_ease-in-out_infinite]" : "opacity-25"}`}
      >
        <div className="relative h-36 w-28 rotate-[-12deg] overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40">
          <Image src={secondaryArt} alt="" fill className="object-cover" sizes="112px" unoptimized />
          <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
        </div>
      </div>

      <div
        className={`absolute -right-4 top-[12%] hidden md:block ${isPlaying ? "animate-[radio-float_5.5s_ease-in-out_infinite]" : "opacity-20"}`}
        style={{ animationDelay: "0.6s" }}
      >
        <div className="relative h-44 w-32 rotate-[10deg] overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/40">
          <Image src={displayArt} alt="" fill className="object-cover" sizes="128px" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-600/30 to-transparent" />
        </div>
      </div>

      {station.backdropCharacter ? (
        <div
          className={`absolute -bottom-2 end-0 hidden sm:block ${isPlaying ? "animate-[character-bob_5.5s_ease-in-out_infinite]" : "opacity-15"}`}
        >
          <div className="relative h-52 w-40 opacity-35 lg:h-64 lg:w-48">
            <Image
              src={station.backdropCharacter}
              alt=""
              fill
              className="object-contain object-bottom drop-shadow-[0_0_28px_rgba(249,115,22,0.45)]"
              sizes="192px"
              unoptimized
            />
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/75 to-black/90" />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${station.accentFrom}18 0%, transparent 45%, ${station.accentTo}14 100%)`,
        }}
      />
    </div>
  );
}
