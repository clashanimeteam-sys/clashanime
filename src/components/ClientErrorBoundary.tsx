"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type ClientErrorBoundaryProps = {
  children: ReactNode;
};

type ClientErrorBoundaryState = {
  error: Error | null;
};

export class ClientErrorBoundary extends Component<
  ClientErrorBoundaryProps,
  ClientErrorBoundaryState
> {
  state: ClientErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ClientErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ClashAnime] client render error", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 text-center dark:bg-black">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full bg-zinc-100 text-5xl dark:bg-zinc-900"
            aria-hidden
          >
            🐱
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#e85d4c]">
            Error
          </p>
          <p className="mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            Something went wrong. Please try again or return to the home page.
          </p>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            If Google Translate or Edge translation is enabled for this site, turn it off and use the
            AR language button inside ClashAnime instead.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-black dark:border-zinc-700 dark:text-white"
            >
              Back to home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
