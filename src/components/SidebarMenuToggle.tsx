"use client";

type SidebarMenuToggleProps = {
  label: string;
  expanded?: boolean;
  onClick: () => void;
  className?: string;
};

export function SidebarMenuToggle({ label, expanded, onClick, className = "" }: SidebarMenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-white text-black shadow-sm transition hover:border-accent hover:text-accent dark:border-zinc-700 dark:bg-black dark:text-white ${className}`}
      aria-label={label}
      aria-expanded={expanded}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  );
}
