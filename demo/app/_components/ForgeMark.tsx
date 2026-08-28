/**
 * Forge mark — a sprig that reads as an "F": one gently curving stem with
 * two leaves where the F's arms would be. Same geometry as `app/icon.svg`,
 * lifted out of its favicon tile so it can stand alone from 16px (nav) up to
 * hero scale. The stem is stroked and the leaves are filled, so the mark
 * holds together at favicon size instead of dissolving into hairlines.
 *
 * Inherits `currentColor` — wrap it in something that sets `color` and the
 * mark follows. No client-only hooks, so it renders from a Server Component.
 */
export default function ForgeMark({
  size = 24,
  className,
}: {
  /** Rendered width/height in px. */
  size?: number;
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
      <path
        d="M13.5 35 C13 27 13.2 17 15 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M15.2 13.2 C20.5 5.5 28.5 4.2 34 6.4 C31.6 13.6 23.2 16.8 15.2 13.2 Z"
        fill="currentColor"
      />
      <path
        d="M14.1 23.6 C18.2 17.9 24.4 16.9 28.6 18.6 C26.8 24.1 20.3 26.4 14.1 23.6 Z"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>
  );
}
