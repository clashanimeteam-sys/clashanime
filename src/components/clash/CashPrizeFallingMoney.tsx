type FallingParticle = {
  kind: "emoji" | "bill" | "coin";
  left: string;
  delay: string;
  duration: string;
  size: string;
  emoji?: string;
};

const PARTICLES: FallingParticle[] = [
  { kind: "emoji", emoji: "💵", left: "6%", delay: "0s", duration: "5.5s", size: "text-xl" },
  { kind: "coin", left: "14%", delay: "1.2s", duration: "6.8s", size: "text-lg" },
  { kind: "bill", left: "22%", delay: "0.6s", duration: "5.2s", size: "text-xs" },
  { kind: "emoji", emoji: "🪙", left: "31%", delay: "2.4s", duration: "7.1s", size: "text-base" },
  { kind: "emoji", emoji: "💰", left: "39%", delay: "0.3s", duration: "6.2s", size: "text-lg" },
  { kind: "bill", left: "48%", delay: "1.8s", duration: "5.8s", size: "text-[10px]" },
  { kind: "coin", left: "56%", delay: "3.1s", duration: "6.5s", size: "text-sm" },
  { kind: "emoji", emoji: "💵", left: "64%", delay: "0.9s", duration: "5.4s", size: "text-base" },
  { kind: "bill", left: "72%", delay: "2.7s", duration: "6.9s", size: "text-xs" },
  { kind: "emoji", emoji: "🪙", left: "80%", delay: "1.5s", duration: "5.9s", size: "text-lg" },
  { kind: "coin", left: "88%", delay: "3.6s", duration: "7.4s", size: "text-base" },
  { kind: "emoji", emoji: "💵", left: "94%", delay: "2.1s", duration: "6.1s", size: "text-sm" },
  { kind: "bill", left: "18%", delay: "4.2s", duration: "7.8s", size: "text-[10px]" },
  { kind: "coin", left: "43%", delay: "4.8s", duration: "6.7s", size: "text-sm" },
  { kind: "emoji", emoji: "💰", left: "58%", delay: "5.1s", duration: "7.2s", size: "text-base" },
  { kind: "bill", left: "76%", delay: "5.5s", duration: "6.4s", size: "text-xs" },
];

function renderParticle(particle: FallingParticle, index: number) {
  const animationClass = `animate-[prize-money-fall_${particle.duration}_linear_infinite]`;

  if (particle.kind === "bill") {
    return (
      <span
        key={index}
        className={`absolute top-0 inline-flex items-center justify-center rounded-sm border border-emerald-400/30 bg-emerald-700/35 px-1.5 py-0.5 font-bold text-emerald-100 shadow-[0_2px_8px_rgba(16,185,129,0.25)] ${particle.size} ${animationClass}`}
        style={{ left: particle.left, animationDelay: particle.delay }}
      >
        $
      </span>
    );
  }

  if (particle.kind === "coin") {
    return (
      <span
        key={index}
        className={`absolute top-0 inline-flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 text-[10px] font-black text-amber-950 shadow-[0_2px_10px_rgba(251,191,36,0.35)] ${animationClass}`}
        style={{ left: particle.left, animationDelay: particle.delay }}
      >
        $
      </span>
    );
  }

  return (
    <span
      key={index}
      className={`absolute top-0 select-none opacity-80 ${particle.size} ${animationClass}`}
      style={{ left: particle.left, animationDelay: particle.delay }}
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
