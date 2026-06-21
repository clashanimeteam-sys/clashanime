"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  normalizeUsernameQuery,
  searchProfileUsernames,
  type ProfileUsernameSuggestion,
} from "@/lib/profileSearch";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type UsernameSuggestInputProps = {
  value: string;
  onChange: (username: string) => void;
  excludeUserId?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
};

export function UsernameSuggestInput({
  value,
  onChange,
  excludeUserId,
  placeholder,
  required,
  id,
}: UsernameSuggestInputProps) {
  const { t } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const [suggestions, setSuggestions] = useState<ProfileUsernameSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!supabase || !open) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const query = normalizeUsernameQuery(value);
    if (query.length < 1) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(() => {
      void searchProfileUsernames(supabase, query, { excludeUserId, limit: 8 }).then((rows) => {
        if (cancelled) return;
        setSuggestions(rows);
        setLoading(false);
        setActiveIndex(rows.length > 0 ? 0 : -1);
      });
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [supabase, value, excludeUserId, open]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function pickSuggestion(suggestion: ProfileUsernameSuggestion) {
    onChange(suggestion.username);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      pickSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && normalizeUsernameQuery(value).length > 0;

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        required={required}
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
      />

      {showDropdown ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          {loading ? (
            <p className="px-4 py-3 text-sm text-zinc-500">{t.exclusives.searchingUsernames}</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-500">{t.exclusives.noUsernameSuggestions}</p>
          ) : (
            <ul role="listbox" className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pickSuggestion(suggestion)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors ${
                      index === activeIndex
                        ? "bg-accent/10 text-accent"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      {suggestion.avatar_url ? (
                        <Image
                          src={suggestion.avatar_url}
                          alt={suggestion.username}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-zinc-600 dark:text-zinc-300">
                          {suggestion.username.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-zinc-900 dark:text-white">
                        @{suggestion.username}
                        {suggestion.is_verified ? (
                          <span className="ms-1 text-sky-500" aria-hidden>
                            ✓
                          </span>
                        ) : null}
                      </span>
                      {suggestion.display_name ? (
                        <span className="block truncate text-xs text-zinc-500">{suggestion.display_name}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
