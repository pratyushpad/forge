// Single motion vocabulary for the demo. Every duration/easing used in TS or
// CSS lives here (CSS mirrors these as --dur-* / --ease-* tokens in tokens.css).
//
// Register: botanical. Movement is slow, graceful and heavily eased out —
// plants swaying, not panels snapping. Nothing here is a bounce or a spring.

export const duration = {
  press: 160, // press feedback (deliberately faster than the design scale)
  fast: 300, // hovers, link colours
  base: 500, // card lifts, transforms
  slow: 700, // scroll reveals, bar fills
  slower: 1000, // the one or two dramatic draws
} as const;

export const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";
export const easeInOut = "cubic-bezier(0.65, 0, 0.35, 1)";

// GSAP-format companions to the CSS curves above — GSAP's core ease parser
// doesn't accept raw `cubic-bezier()` strings, so primitives that hand an ease
// to gsap.to/quickTo/etc. use these named exports instead of inlining ease
// tokens ad hoc. `expo.out` matches cubic-bezier(0.16, 1, 0.3, 1) closely:
// entrances and settles. `power2.inOut` for continuous on-screen movement
// (progressive draws, disclosure heights).
export const gsapEaseOut = "expo.out";
export const gsapEaseInOut = "power2.inOut";

export const staggerStepMs = 80; // entrance cascade — top of the 30–80ms band, unhurried but not sluggish

// GSAP word-stagger step for HeadlineReveal — the serif headline unfurls one
// word at a time rather than cascading like a list. Kept at 60ms so an
// eight-word headline still settles inside the 1.2s first-impression budget.
export const wordStaggerStep = 0.06;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type TimedOutput = { reasoning: string; latency_s?: number };

// Replay duration derived from each output's real measured latency_s, slowed to
// reading speed. Floored/capped by text length so pacing stays readable, and
// latency clamped positive (one cached value is negative from clock skew).
export function replayDuration(out: TimedOutput): number {
  const len = out.reasoning.length;
  const lat = Math.max(0.4, out.latency_s ?? 0);
  let ms = lat * 3500;
  ms = Math.max(ms, (len / 260) * 1000);
  ms = Math.min(ms, (len / 70) * 1000);
  return Math.min(6000, Math.max(1200, ms));
}
