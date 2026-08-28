"use client";

import PathDraw from "./PathDraw";

const STEM =
  "M0 46 C 140 12, 260 76, 400 46 S 660 8, 800 44 S 1060 74, 1200 30";

// Leaves sit on the stem at the three points where it flattens out.
const LEAVES = [
  "M330 60 C 342 46, 362 44, 372 49 C 364 63, 344 68, 330 60 Z",
  "M700 30 C 712 16, 732 14, 742 19 C 734 33, 714 38, 700 30 Z",
  "M1010 62 C 1022 48, 1042 46, 1052 51 C 1044 65, 1024 70, 1010 62 Z",
];

/**
 * A decorative meander — one 1px sage line that wanders across the page like
 * a runner between two sections, with three small leaves on it. The stem
 * draws itself in as the rule scrolls into view (PathDraw handles the
 * reduced-motion case by rendering fully drawn).
 *
 * Purely ornamental and aria-hidden. Used once per site, on purpose.
 */
export default function VineRule() {
  return (
    <svg
      className="vine-rule"
      viewBox="0 0 1200 88"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <PathDraw d={STEM} stroke="currentColor" strokeWidth={1} duration={1.6} />
      {LEAVES.map((d) => (
        <path key={d} d={d} fill="currentColor" opacity="0.5" />
      ))}
    </svg>
  );
}
