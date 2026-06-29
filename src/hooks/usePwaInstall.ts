"use client";

import { useCallback, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  dismissInstallPrompt,
  isAppInstalled,
  isIOSDevice,
  isIOSSafari,
  registerInstallServiceWorker,
  wasInstallPromptDismissed,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa/installPrompt";

export function usePwaInstall() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  const canShow =
    isMobile && !isAppInstalled() && !wasInstallPromptDismissed();

  useEffect(() => {
    if (!canShow) return;

    void registerInstallServiceWorker();

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const timer = window.setTimeout(() => {
      if (!isAppInstalled() && !wasInstallPromptDismissed()) {
        setVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.clearTimeout(timer);
    };
  }, [canShow]);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const showIosSteps = isIOSDevice() && isIOSSafari();
  const showNativeInstall = Boolean(deferredPrompt);

  return {
    visible: visible && canShow,
    dismiss,
    install,
    installing,
    showIosSteps,
    showNativeInstall,
  };
}
