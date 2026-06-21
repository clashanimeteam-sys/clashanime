type IconProps = {
  className?: string;
};

export function BankTransferIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6h6v6M9 10h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PayPalIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#003087"
        d="M8.32 21.97H4.57c-.45 0-.84-.33-.91-.77L2.1 3.96c-.06-.4.24-.77.65-.77h5.58c2.45 0 4.35.56 5.65 1.67 1.22 1.04 1.82 2.54 1.78 4.46-.08 3.85-2.2 6.32-5.96 7.34-.46.13-.95.2-1.48.2H9.1c-.45 0-.84.33-.91.77l-.87 5.34Z"
      />
      <path
        fill="#009cde"
        d="M20.16 7.8c-.19 1.24-.62 2.28-1.28 3.1-.98 1.22-2.45 1.88-4.37 1.97H12.1c-.38 0-.71.28-.77.66l-.73 4.53-.21 1.28c-.06.4.24.77.65.77h2.58c.36 0 .67-.26.73-.62l.05-.27.52-3.28.03-.2c.06-.38.37-.66.73-.66h.46c2.98 0 5.31-.96 6.75-2.77.96-1.18 1.57-2.7 1.82-4.52.07-.48-.29-.9-.77-.9h-2.84c-.45 0-.84.33-.91.77Z"
      />
      <path
        fill="#012169"
        d="M18.8 7.07H14.5c-.45 0-.84.33-.91.77l-1.18 7.46-.04.24c-.06.4.24.77.65.77h2.58c.36 0 .67-.26.73-.62l.05-.27.52-3.28.03-.2c.06-.38.37-.66.73-.66h.46c2.98 0 5.31-.96 6.75-2.77.64-.79 1.1-1.73 1.36-2.8.07-.3-.15-.6-.46-.6Z"
      />
    </svg>
  );
}

export function UsdtIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#26A17B" />
      <path
        fill="#fff"
        d="M13.32 11.01V9.01h2.69V6.52H7.99v2.49h2.69v2c-2.24.1-3.92.55-3.92 1.08 0 .53 1.68.98 3.92 1.08v4.82h2.64v-4.82c2.23-.1 3.9-.55 3.9-1.08 0-.53-1.67-.98-3.9-1.08Zm-.01 1.75c-.14.04-.45.08-.98.11v-1.72c.53.03.84.07.98.11.72.14 1.18.33 1.18.5 0 .17-.46.36-1.18.5Zm-1.98-.61c-.53-.03-.84-.07-.98-.11v1.72c.14-.04.45-.08.98-.11.72-.14 1.18-.33 1.18-.5 0-.17-.46-.36-1.18-.5Z"
      />
    </svg>
  );
}
