"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { searchHashtags } from "@/lib/hashtagSearch";
import { searchProfileUsernames, type ProfileUsernameSuggestion } from "@/lib/profileSearch";
import { createBrowserClient } from "@/lib/supabase/client";
import { useLocale } from "@/providers/LocaleProvider";

type SuggestMode = "both" | "mentions" | "hashtags";

type ActiveToken = {
  type: "mention" | "hashtag";
  query: string;
  start: number;
  end: number;
};

type MentionHashtagTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  mode?: SuggestMode;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  excludeUserId?: string;
  inputRef?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  id?: string;
};

function getActiveToken(value: string, cursor: number): ActiveToken | null {
  const before = value.slice(0, cursor);
  const match = before.match(/(?:^|\s)([@#])([\w\u0600-\u06FF_-]*)$/u);
  if (!match || match.index === undefined) return null;

  const token = match[2] ?? "";
  const trigger = match[1];
  const start = before.length - token.length - 1;
  return {
    type: trigger === "@" ? "mention" : "hashtag",
    query: token,
    start,
    end: cursor,
  };
}

export function MentionHashtagTextarea({
  value,
  onChange,
  mode = "both",
  multiline = true,
  rows = 4,
  maxLength,
  placeholder,
  disabled,
  className,
  excludeUserId,
  inputRef,
  id,
}: MentionHashtagTextareaProps) {
  const { t, formatNumber } = useLocale();
  const supabase = useMemo(() => createBrowserClient(), []);
  const localRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const fieldRef = inputRef ?? localRef;

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeToken, setActiveToken] = useState<ActiveToken | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<ProfileUsernameSuggestion[]>([]);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<Array<{ tag: string; usage_count: number }>>([]);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const suggestions =
    activeToken?.type === "mention"
      ? mentionSuggestions.map((row) => ({
          key: row.id,
          label: `@${row.username}`,
          sublabel: row.display_name,
          avatar_url: row.avatar_url,
          insertValue: `@${row.username} `,
        }))
      : hashtagSuggestions.map((row) => ({
          key: row.tag,
          label: `#${row.tag}`,
          sublabel: t.upload.hashtagUsageCount.replace("{count}", formatNumber(Number(row.usage_count ?? 0))),
          avatar_url: null as string | null,
          insertValue: `#${row.tag} `,
        }));

  const showDropdown = open && activeToken !== null && (loading || suggestions.length > 0);

  useEffect(() => {
    if (!showDropdown || !fieldRef.current) {
      setDropdownPosition(null);
      return;
    }

    function updatePosition() {
      const field = fieldRef.current;
      if (!field) return;
      const rect = field.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showDropdown, value, fieldRef]);

  useEffect(() => {
    if (!supabase || !activeToken || !open) {
      setMentionSuggestions([]);
      setHashtagSuggestions([]);
      setLoading(false);
      return;
    }

    if (
      (activeToken.type === "mention" && mode === "hashtags") ||
      (activeToken.type === "hashtag" && mode === "mentions")
    ) {
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(() => {
      void (async () => {
        if (activeToken.type === "mention") {
          const rows = await searchProfileUsernames(supabase, activeToken.query, {
            excludeUserId,
            limit: 8,
          });
          if (cancelled) return;
          setMentionSuggestions(rows);
          setHashtagSuggestions([]);
          setLoading(false);
          setActiveIndex(rows.length > 0 ? 0 : -1);
        } else {
          const rows = await searchHashtags(supabase, activeToken.query, 8);
          if (cancelled) return;
          setHashtagSuggestions(rows);
          setMentionSuggestions([]);
          setLoading(false);
          setActiveIndex(rows.length > 0 ? 0 : -1);
        }
      })();
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [supabase, activeToken, open, mode, excludeUserId]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (fieldRef.current?.contains(target)) return;
      if (target.closest("[data-mention-hashtag-menu]")) return;
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [fieldRef]);

  function syncToken(nextValue: string, cursor: number) {
    const token = getActiveToken(nextValue, cursor);
    if (!token) {
      setActiveToken(null);
      setOpen(false);
      return;
    }
    setActiveToken(token);
    setOpen(true);
  }

  function handleChange(nextValue: string, cursor: number) {
    onChange(nextValue);
    syncToken(nextValue, cursor);
  }

  function pickSuggestion(insertValue: string) {
    if (!activeToken) return;
    const nextValue =
      value.slice(0, activeToken.start) + insertValue + value.slice(activeToken.end);
    onChange(nextValue);
    setOpen(false);
    setActiveToken(null);

    window.requestAnimationFrame(() => {
      const field = fieldRef.current;
      if (!field) return;
      const nextCursor = activeToken.start + insertValue.length;
      field.focus();
      field.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (!open || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0 && !event.shiftKey) {
      event.preventDefault();
      pickSuggestion(suggestions[activeIndex].insertValue);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const sharedProps = {
    id,
    value,
    disabled,
    placeholder,
    maxLength,
    onKeyDown: handleKeyDown,
    onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      syncToken(event.currentTarget.value, event.currentTarget.selectionStart ?? 0);
    },
    onClick: (event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      syncToken(event.currentTarget.value, event.currentTarget.selectionStart ?? 0);
    },
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleChange(event.target.value, event.target.selectionStart ?? event.target.value.length);
    },
    className:
      className ??
      "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-accent dark:border-zinc-700 dark:bg-black dark:text-white",
    autoComplete: "off" as const,
    spellCheck: false,
    "aria-autocomplete": "list" as const,
    "aria-expanded": showDropdown,
  };

  const dropdown =
    showDropdown && dropdownPosition && mounted ? (
      <div
        data-mention-hashtag-menu
        className="fixed z-[10050] max-h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
        }}
      >
        {loading ? (
          <p className="px-4 py-3 text-sm text-zinc-500">{t.exclusives.searchingUsernames}</p>
        ) : (
          <ul role="listbox" className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pickSuggestion(suggestion.insertValue)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors ${
                    index === activeIndex
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  {suggestion.avatar_url ? (
                    <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={suggestion.avatar_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{suggestion.label}</span>
                    {suggestion.sublabel ? (
                      <span className="block truncate text-xs text-zinc-500">{suggestion.sublabel}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : null;

  return (
    <>
      {multiline ? (
        <textarea
          ref={fieldRef as RefObject<HTMLTextAreaElement>}
          rows={rows}
          {...sharedProps}
        />
      ) : (
        <input
          ref={fieldRef as RefObject<HTMLInputElement>}
          type="text"
          {...sharedProps}
        />
      )}
      {dropdown
        ? createPortal(dropdown, document.getElementById("clashanime-portal") ?? document.body)
        : null}
    </>
  );
}
