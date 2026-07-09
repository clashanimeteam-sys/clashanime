import Image from "next/image";

type NavIconProps = {
  icon: string;
  className?: string;
};

export function NavIcon({ icon, className = "h-5 w-5 shrink-0 object-contain" }: NavIconProps) {
  if (icon === "clash") {
    return <Image src="/icons/clash-vs.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "video") {
    return <Image src="/icons/videos-play.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "users") {
    return <Image src="/icons/community.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "music") {
    return <Image src="/icons/anime-radio.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "trophy") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
        <path d="M5 4H3v2a4 4 0 0 0 4 4" />
        <path d="M19 4h2v2a4 4 0 0 1-4 4" />
      </svg>
    );
  }
  if (icon === "coins") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <ellipse cx="8" cy="8" rx="6" ry="3" />
        <path d="M2 8v6c0 1.7 2.7 3 6 3s6-1.3 6-3V8" />
        <path d="M14 10c0 1.7 2.7 3 6 3s6-1.3 6-3" />
        <path d="M14 16c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
      </svg>
    );
  }
  if (icon === "wallet") {
    return <Image src="/icons/clash-coins.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "earn") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 10h.01M18 14h.01" />
      </svg>
    );
  }
  if (icon === "invite") {
    return <Image src="/icons/invite-friends.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "radar") {
    return <Image src="/icons/anime-radar.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "settings") {
    return <Image src="/icons/settings.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  if (icon === "profile") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (icon === "channel") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="12" cy="11" r="3" />
        <path d="M8 20v-1a4 4 0 0 1 8 0v1" />
      </svg>
    );
  }
  if (icon === "star") {
    return <Image src="/icons/exclusives.png" alt="" width={20} height={20} className={className} aria-hidden />;
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
    </svg>
  );
}
