"use client";

import { useRef, type SVGProps } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../../lib/gsap";
import { gsapEaseInOut, prefersReducedMotion } from "../../../lib/motion";

/**
 * Draws an SVG path in via stroke-dashoffset as it scrolls into view. Renders
 * only the <path> — embed it inside your own <svg viewBox=...> so the caller
 * (a future chart, most likely) keeps full control of the surrounding markup.
 * Measures the path's real length (`getTotalLength`) rather than guessing a
 * percentage, so it draws correctly regardless of curve complexity.
 *
 * Reduced motion: the path renders fully drawn immediately, no ScrollTrigger.
 */
export default function PathDraw({
  d,
  duration = 1.2,
  className,
  ...pathProps
}: {
  d: string;
  /** Draw duration in seconds. */
  duration?: number;
  className?: string;
} & Omit<SVGProps<SVGPathElement>, "d" | "ref">) {
  const pathRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();

      // A zero or non-finite length means the SVG hasn't laid out yet.
      // Leave the path alone rather than hiding something we can't reveal.
      if (!Number.isFinite(length) || length <= 0) return;

      if (prefersReducedMotion()) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
        return;
      }

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        duration,
        ease: gsapEaseInOut,
        scrollTrigger: {
          trigger: path,
          start: "top 85%",
          once: true,
        },
      });

      // If this unmounts before the trigger ever fires, the path must be
      // handed back drawn, not hidden behind a dash offset.
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" });
      };
    },
    { scope: pathRef, dependencies: [d, duration] },
  );

  return <path ref={pathRef} d={d} fill="none" className={className} {...pathProps} />;
}

// Re-exported so consumers can force a manual ScrollTrigger.refresh() after
// injecting a PathDraw into layout that changes post-mount (e.g. a chart
// whose container resizes after data loads).
export { ScrollTrigger };
