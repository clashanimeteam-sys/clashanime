"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/providers/LocaleProvider";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  profileReady: boolean;
  refreshProfile: (options?: { silent?: boolean }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = useMemo(() => createBrowserClient(), []);
  const { locale } = useLocale();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(!supabase);
  const profileUserIdRef = useRef<string | null>(null);
  const welcomeEmailRequestedRef = useRef<string | null>(null);
  const signupBonusRequestedRef = useRef<string | null>(null);

  const requestSignupWelcomeBonus = useCallback((user: { id: string }) => {
    if (signupBonusRequestedRef.current === user.id) return;
    signupBonusRequestedRef.current = user.id;

    void fetch("/api/auth/signup-welcome-bonus", { method: "POST" }).catch(() => {
      signupBonusRequestedRef.current = null;
    });
  }, []);

  const requestWelcomeEmail = useCallback(
    (user: { id: string }) => {
      if (welcomeEmailRequestedRef.current === user.id) return;
      welcomeEmailRequestedRef.current = user.id;

      async function attempt(allowRetry: boolean) {
        try {
          const response = await fetch("/api/auth/welcome-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale }),
          });
          const data = (await response.json()) as {
            sent?: boolean;
            skipped?: string | null;
          };

          if (data.sent || data.skipped === "already_sent") {
            return;
          }

          if (allowRetry) {
            await new Promise((resolve) => window.setTimeout(resolve, 2500));
            return attempt(false);
          }

          welcomeEmailRequestedRef.current = null;
        } catch {
          welcomeEmailRequestedRef.current = null;
        }
      }

      void attempt(true);
    },
    [locale],
  );

  const refreshProfile = useCallback(async (options?: { silent?: boolean }) => {
    const userId = session?.user?.id;
    if (!supabase || !userId) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    if (!options?.silent) {
      setProfileLoading(true);
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setProfile(data);
    setProfileLoading(false);
  }, [supabase, session?.user?.id]);

  useEffect(() => {
    if (!supabase) return;

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      // Supabase already updates the client token; skip React state to avoid profile UI flashes.
      if (event === "TOKEN_REFRESHED") return;
      setSession(nextSession);
      setLoading(false);

      if (nextSession?.user?.id) {
        const createdAt = nextSession.user.created_at;
        const isRecentSignup =
          !createdAt ||
          Date.now() - new Date(createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

        if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && isRecentSignup)) {
          requestSignupWelcomeBonus(nextSession.user);
          requestWelcomeEmail(nextSession.user);
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, requestSignupWelcomeBonus, requestWelcomeEmail]);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      setProfileReady(true);
      profileUserIdRef.current = null;
      return;
    }

    if (profileUserIdRef.current === userId) return;

    profileUserIdRef.current = userId;
    setProfileReady(false);
    setProfileLoading(true);
    void refreshProfile({ silent: true }).finally(() => {
      setProfileReady(true);
    });
  }, [session?.user?.id, refreshProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setProfileReady(true);
    profileUserIdRef.current = null;
  }, [supabase]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      loading,
      profileLoading,
      profileReady,
      refreshProfile,
      signOut,
    }),
    [session, profile, loading, profileLoading, profileReady, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
