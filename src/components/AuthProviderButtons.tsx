"use client";

import { OAuthAuthButton } from "@/components/OAuthAuthButton";

type AuthProviderButtonsProps = {
  mode: "login" | "signup";
  disabled?: boolean;
  onError: (message: string) => void;
};

export function AuthProviderButtons({ mode, disabled = false, onError }: AuthProviderButtonsProps) {
  return (
    <div className="space-y-3">
      <OAuthAuthButton provider="google" mode={mode} disabled={disabled} onError={onError} />
      <OAuthAuthButton provider="github" mode={mode} disabled={disabled} onError={onError} />
      <OAuthAuthButton provider="facebook" mode={mode} disabled={disabled} onError={onError} />
    </div>
  );
}
