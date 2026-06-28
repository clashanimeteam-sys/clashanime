import type { SocialPlatform } from "@/lib/socialLinks";

type SocialLinkIconProps = {
  platform: SocialPlatform;
  className?: string;
};

export function SocialLinkIcon({ platform, className = "h-5 w-5" }: SocialLinkIconProps) {
  if (platform === "youtube") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z" />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M16.5 3c.4 2.2 1.8 4 3.9 4.7V12c-2.6 0-5-.9-6.9-2.4v6.8c0 3.8-3 6.9-6.7 6.9S0 20.2 0 16.4 3 9.5 6.7 9.5c.6 0 1.1.1 1.7.2v3.6a3.2 3.2 0 1 0 2.5 3.1V3h5.6z" />
      </svg>
    );
  }

  if (platform === "twitter") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M17.3 3h3.3l-7.2 8.2 8.5 11.1h-6.7l-5.2-6.8-6 6.8H.7l7.7-8.8L0 3h6.9l4.7 6.2L17.3 3zm-1.2 17.2h1.8L6.6 4.8H4.6l11.5 15.4z" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
    </svg>
  );
}
