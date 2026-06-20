import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-black">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">...</p>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
