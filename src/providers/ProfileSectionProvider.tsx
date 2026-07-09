"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ProfileSection =
  | "settings"
  | "violations"
  | "channel"
  | "my-videos"
  | "hunter-system"
  | "bounty-log"
  | "referral"
  | "wallet";

export function parseProfileSection(hash: string): ProfileSection {
  if (
    hash === "violations" ||
    hash === "channel" ||
    hash === "my-videos" ||
    hash === "hunter-system" ||
    hash === "bounty-log" ||
    hash === "referral" ||
    hash === "wallet"
  ) {
    return hash;
  }
  return "settings";
}

function sectionToUrl(section: ProfileSection) {
  return section === "settings" ? "/profile" : `/profile#${section}`;
}

type ProfileSectionContextValue = {
  section: ProfileSection;
  setSection: (section: ProfileSection) => void;
  isProfilePage: boolean;
};

const ProfileSectionContext = createContext<ProfileSectionContextValue>({
  section: "settings",
  setSection: () => {},
  isProfilePage: false,
});

export function ProfileSectionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile";
  const [section, setSectionState] = useState<ProfileSection>("settings");

  const setSection = useCallback((next: ProfileSection) => {
    setSectionState(next);
    if (typeof window === "undefined") return;
    window.history.pushState(null, "", sectionToUrl(next));
  }, []);

  useEffect(() => {
    if (!isProfilePage) return;

    const syncFromLocation = () => {
      setSectionState(parseProfileSection(window.location.hash.replace(/^#/, "")));
    };

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [isProfilePage, pathname]);

  const value = useMemo(
    () => ({ section, setSection, isProfilePage }),
    [section, setSection, isProfilePage],
  );

  return (
    <ProfileSectionContext.Provider value={value}>{children}</ProfileSectionContext.Provider>
  );
}

export function useProfileSection() {
  return useContext(ProfileSectionContext);
}
