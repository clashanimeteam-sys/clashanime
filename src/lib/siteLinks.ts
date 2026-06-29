export const informationLinks = [
  { key: "about" as const, href: "/about" },
  { key: "privacy" as const, href: "/privacy" },
  { key: "cookies" as const, href: "/cookies" },
  { key: "disclaimer" as const, href: "/disclaimer" },
  { key: "eula" as const, href: "/eula" },
  { key: "terms" as const, href: "/terms" },
  { key: "communityGuidelines" as const, href: "/community-guidelines" },
  { key: "dmca" as const, href: "/dmca" },
  { key: "reportContent" as const, href: "/report" },
] as const;

export const communicationLinks = [
  { key: "arenaGuide" as const, href: "/blog", icon: "guide" as const },
  { key: "contact" as const, href: "/contact", icon: "mail" as const },
  { key: "reportContent" as const, href: "/report", icon: "report" as const },
] as const;
