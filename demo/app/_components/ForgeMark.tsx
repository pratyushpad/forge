/**
 * Scalable Forge brand mark — the chamfered-F glyph geometry from
 * `app/icon.svg`, lifted out of its favicon tile so it can stand alone from
 * 16px (nav) up to hero scale. No client-only hooks, so this renders fine
 * from a Server Component too.
 *
 * Fills with `currentColor` — wrap it in something that sets `color` and the
 * mark follows. `accent={true}` fills with the brand accent instead, for the
 * one or two spots (the nav wordmark) that want it to read as the mark
 * rather than blend into surrounding text.
 */
export default function ForgeMark({
  size = 24,
  accent = false,
  className,
}: {
  /** Rendered width/height in px. */
  size?: number;
  /** Fill with var(--accent) instead of currentColor. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Forge"
      className={className}
    >
      <g fill={accent ? "var(--accent)" : "currentColor"}>
        <path d="M11 9 H17 V27 L14 31 L11 27 Z" />
        <path d="M11 9 H30 L24 16 H11 Z" />
        <path d="M11 19 H26 L20 25 H11 Z" />
      </g>
    </svg>
  );
}
