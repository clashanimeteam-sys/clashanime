"use client";

import { OAuthAuthButton } from "@/components/OAuthAuthButton";

type AuthProviderButtonsProps = {
  mode: "login" | "signup";
};

export function AuthProviderButtons({ mode }: AuthProviderButtonsProps) {
  return (
    <div className="space-y-3">
      <OAuthAuthButton provider="google" mode={mode} />
      <OAuthAuthButton provider="github" mode={mode} />
    </div>
  );
}
