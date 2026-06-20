"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { getCurrentPath, getSignupUrl } from "@/lib/subscriptionGate";

export function useRequireSubscription() {
  const router = useRouter();
  const { user, loading } = useAuth();

  function requireSubscription(nextPath?: string): boolean {
    if (loading) return false;
    if (user) return true;

    router.push(getSignupUrl(nextPath ?? getCurrentPath()));
    return false;
  }

  return { user, loading, requireSubscription, isSubscribed: Boolean(user) };
}
