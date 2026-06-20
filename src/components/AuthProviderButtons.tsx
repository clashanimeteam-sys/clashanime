"use client";

import { OAuthAuthButton } from "@/components/OAuthAuthButton";

type AuthProviderButtonsProps = {
  mode: "login" | "signup";
  disabled?: boolean;
  redirectNext?: string;
  onError: (message: string) => void;
};

export function AuthProviderButtons({
  mode,
  disabled = false,
  redirectNext = "/profile",
  onError,
}: AuthProviderButtonsProps) {
  return (
    <div className="space-y-3">
      <OAuthAuthButton provider="google" mode={mode} disabled={disabled} redirectNext={redirectNext} onError={onError} />
      <OAuthAuthButton provider="github" mode={mode} disabled={disabled} redirectNext={redirectNext} onError={onError} />
      <OAuthAuthButton provider="facebook" mode={mode} disabled={disabled} redirectNext={redirectNext} onError={onError} />
    </div>
  );
}
