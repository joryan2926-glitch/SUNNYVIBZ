export function SunnyLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-12 shrink-0 place-items-center text-[#ffd978] drop-shadow-[0_0_18px_rgba(255,217,120,0.58)] ${className}`}
      aria-label="Logo SUNNYVIBZ"
    >
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true" className="size-full">
        <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="4" />
        <path
          d="M22 44c18-18 36-19 54-1C55 35 38 36 22 52m76-8c-18-18-36-19-54-1 21-8 38-7 54 9"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M60 42c-11 12-14 25-8 39m8-39c11 12 14 25 8 39"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M25 70h70M31 82h58M40 94h40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
        />
      </svg>
    </span>
  );
}
