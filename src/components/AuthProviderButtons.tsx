"use client";

import { OAuthAuthButton } from "@/components/OAuthAuthButton";

type AuthProviderButtonsProps = {
  mode: "login" | "signup";
  onError: (message: string) => void;
};

export function AuthProviderButtons({ mode, onError }: AuthProviderButtonsProps) {
  return (
    <div className="space-y-3">
      <OAuthAuthButton provider="google" mode={mode} onError={onError} />
      <OAuthAuthButton provider="github" mode={mode} onError={onError} />
      <OAuthAuthButton provider="facebook" mode={mode} onError={onError} />
    </div>
  );
}
