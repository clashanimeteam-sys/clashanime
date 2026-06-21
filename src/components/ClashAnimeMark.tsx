type ClashAnimeMarkProps = {
  className?: string;
};

export function ClashAnimeMark({ className = "h-full w-full" }: ClashAnimeMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role="img"
      aria-label="Clash Anime"
      className={className}
    >
      <defs>
        <linearGradient id="ca-red-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="45%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="ca-red-edge" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="ca-metal-face" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="35%" stopColor="#3f3f46" />
          <stop offset="70%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="ca-metal-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#52525b" />
        </linearGradient>
        <filter id="ca-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#b91c1c" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#ca-glow)">
        {/* Red outer ring */}
        <path
          d="M356 168c18 44 12 98-18 136-30 38-82 54-128 40-46-14-78-58-78-108 0-36 16-70 44-92"
          fill="none"
          stroke="url(#ca-red-edge)"
          strokeWidth="34"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M356 168c18 44 12 98-18 136-30 38-82 54-128 40-46-14-78-58-78-108 0-36 16-70 44-92"
          fill="none"
          stroke="url(#ca-red-face)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Red crossbar */}
        <path
          d="M176 248h160"
          fill="none"
          stroke="url(#ca-red-edge)"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M176 248h160"
          fill="none"
          stroke="url(#ca-red-face)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Red tail swoosh */}
        <path
          d="M332 332c34 18 58 46 62 78"
          fill="none"
          stroke="url(#ca-red-edge)"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M332 332c34 18 58 46 62 78"
          fill="none"
          stroke="url(#ca-red-face)"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>

      {/* Metallic A */}
      <path
        d="M256 108 L332 372 L292 372 L274 312 L238 312 L220 372 L180 372 Z"
        fill="url(#ca-metal-edge)"
      />
      <path
        d="M256 124 L316 356 L292 356 L276 296 L236 296 L220 356 L196 356 Z"
        fill="url(#ca-metal-face)"
      />
      <path
        d="M256 108 L332 372 L292 372 L274 312 L238 312 L220 372 L180 372 Z"
        fill="none"
        stroke="#09090b"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Subtle highlight on A apex */}
      <path
        d="M256 124 L268 168 L244 168 Z"
        fill="#a1a1aa"
        opacity="0.35"
      />

      {/* Tail tip highlight — intentional sparkle on red line only */}
      <circle cx="392" cy="408" r="5" fill="#fca5a5" opacity="0.85" />
      <circle cx="392" cy="408" r="2.5" fill="#fef2f2" opacity="0.9" />
    </svg>
  );
}
