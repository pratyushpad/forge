"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { duration, easeOut, prefersReducedMotion, staggerStepMs } from "../../../lib/motion";

/**
 * Generalizes RevealBars' "fill once scrolled into view" pattern to arbitrary
 * children: each direct child fades + rises in, staggered, the first time the
 * wrapper crosses into the viewport (IntersectionObserver, fires once).
 * Transform/opacity only. Reduced motion renders every child in its final,
 * static state immediately, no observer involved.
 *
 * `inView` starts false on both server and client renders (so hydration never
 * mismatches) and is only ever flipped true from an effect after mount.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = true,
  rootMargin = "0px 0px -10% 0px",
}: {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "article";
  className?: string;
  /** Stagger direct children by staggerStepMs. Set false to reveal them together. */
  stagger?: boolean;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Reduced motion, or no observer to rely on: show the final state now.
    // Nothing that starts at opacity 0 may depend on an API that might not
    // be there to turn it back on.
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect(); // once
        }
      },
      // threshold 0, not a ratio: these wrappers hold whole sections, and a
      // block taller than the viewport can never reach a ratio threshold —
      // it would stay invisible forever. rootMargin already delays the
      // reveal until the block is properly on screen.
      { rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const items = Array.isArray(children) ? children : [children];

  return (
    <Tag ref={ref as never} className={className}>
      {items.map((child, i) => (
        <span
          key={i}
          className="motion-reveal-item"
          style={
            {
              display: "block",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transitionProperty: "opacity, transform",
              transitionDuration: `${duration.slow}ms`,
              transitionTimingFunction: easeOut,
              transitionDelay: stagger ? `${i * staggerStepMs}ms` : "0ms",
            } as CSSProperties
          }
        >
          {child}
        </span>
      ))}
    </Tag>
  );
}
