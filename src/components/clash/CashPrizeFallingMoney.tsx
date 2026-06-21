type FallingParticle = {
  kind: "emoji" | "bill" | "coin" | "sack";
  left: string;
  delay: string;
  duration: string;
  size: string;
  sway: string;
  fast?: boolean;
  emoji?: string;
};

const PARTICLES: FallingParticle[] = [
  { kind: "emoji", emoji: "💵", left: "4%", delay: "0s", duration: "2.8s", size: "text-2xl", sway: "22px" },
  { kind: "coin", left: "11%", delay: "0.4s", duration: "3.1s", size: "h-6 w-6 text-[11px]", sway: "-18px" },
  { kind: "bill", left: "18%", delay: "1.1s", duration: "2.5s", size: "text-sm", sway: "16px", fast: true },
  { kind: "emoji", emoji: "🪙", left: "25%", delay: "0.2s", duration: "3.4s", size: "text-xl", sway: "24px" },
  { kind: "sack", left: "32%", delay: "1.6s", duration: "3.2s", size: "text-xl", sway: "-20px" },
  { kind: "emoji", emoji: "💰", left: "39%", delay: "0.7s", duration: "2.9s", size: "text-2xl", sway: "18px" },
  { kind: "bill", left: "46%", delay: "2s", duration: "2.6s", size: "text-xs", sway: "-14px", fast: true },
  { kind: "coin", left: "53%", delay: "0.9s", duration: "3.3s", size: "h-5 w-5 text-[10px]", sway: "20px" },
  { kind: "emoji", emoji: "💵", left: "60%", delay: "1.4s", duration: "2.7s", size: "text-lg", sway: "-22px" },
  { kind: "bill", left: "67%", delay: "2.3s", duration: "3s", size: "text-sm", sway: "15px" },
  { kind: "emoji", emoji: "🪙", left: "74%", delay: "0.5s", duration: "3.5s", size: "text-2xl", sway: "26px" },
  { kind: "coin", left: "81%", delay: "1.8s", duration: "2.8s", size: "h-6 w-6 text-[11px]", sway: "-16px", fast: true },
  { kind: "sack", left: "88%", delay: "1s", duration: "3.1s", size: "text-lg", sway: "19px" },
  { kind: "emoji", emoji: "💵", left: "95%", delay: "2.6s", duration: "2.9s", size: "text-base", sway: "-24px" },
  { kind: "bill", left: "8%", delay: "3.2s", duration: "3.2s", size: "text-xs", sway: "12px" },
  { kind: "coin", left: "21%", delay: "3.6s", duration: "2.7s", size: "h-5 w-5 text-[10px]", sway: "-18px" },
  { kind: "emoji", emoji: "💰", left: "44%", delay: "3.9s", duration: "3.4s", size: "text-xl", sway: "21px" },
  { kind: "bill", left: "58%", delay: "4.2s", duration: "2.5s", size: "text-sm", sway: "-12px", fast: true },
  { kind: "coin", left: "71%", delay: "4.5s", duration: "3s", size: "h-6 w-6 text-[11px]", sway: "17px" },
  { kind: "emoji", emoji: "🪙", left: "84%", delay: "4.8s", duration: "2.8s", size: "text-lg", sway: "-20px" },
];

function renderParticle(particle: FallingParticle, index: number) {
  const animationName = particle.fast ? "prize-money-fall-fast" : "prize-money-fall";
  const motionClass = "will-change-[top,transform,opacity]";

  const style = {
    left: particle.left,
    animation: `${animationName} ${particle.duration} linear infinite`,
    animationDelay: particle.delay,
    ["--sway" as string]: particle.sway,
  };

  if (particle.kind === "bill") {
    return (
      <span
        key={index}
        className={`absolute inline-flex min-w-[1.35rem] items-center justify-center rounded-sm border border-emerald-300/40 bg-gradient-to-br from-emerald-500/50 to-emerald-800/60 px-1.5 py-0.5 font-bold text-emerald-50 shadow-[0_4px_12px_rgba(16,185,129,0.35)] ${particle.size} ${motionClass}`}
        style={style}
      >
        $
      </span>
    );
  }

  if (particle.kind === "coin") {
    return (
      <span
        key={index}
        className={`absolute inline-flex items-center justify-center rounded-full border border-amber-200/50 bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 font-black text-amber-950 shadow-[0_4px_14px_rgba(251,191,36,0.45)] ${particle.size} ${motionClass}`}
        style={style}
      >
        $
      </span>
    );
  }

  if (particle.kind === "sack") {
    return (
      <span
        key={index}
        className={`absolute select-none drop-shadow-[0_4px_10px_rgba(251,191,36,0.35)] ${particle.size} ${motionClass}`}
        style={style}
      >
        💰
      </span>
    );
  }

  return (
    <span
      key={index}
      className={`absolute select-none drop-shadow-[0_4px_10px_rgba(16,185,129,0.25)] ${particle.size} ${motionClass}`}
      style={style}
    >
      {particle.emoji}
    </span>
  );
}

export function CashPrizeFallingMoney() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PARTICLES.map(renderParticle)}
    </div>
  );
}
