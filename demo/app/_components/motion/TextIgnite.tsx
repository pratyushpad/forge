"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../../../lib/gsap";
import { gsapEaseOut, prefersReducedMotion } from "../../../lib/motion";

const WORD_STAGGER = 0.045;

/**
 * Headline reveal: splits text into words with SplitText and rises them in
 * on mount (power4.out, quiet word-level stagger). Word-level, not
 * char-level — a calmer entrance than a per-letter cascade, appropriate for
 * a headline that reads once per visit, not hundreds of times a day.
 *
 * Gated behind `document.fonts.ready`: Space Grotesk loads with
 * `display: swap`, so splitting before the real font is ready would measure
 * the fallback typeface's metrics and visibly reflow once it swaps in.
 *
 * Reduced motion: renders the same static markup, SplitText never runs.
 */
export default function TextIgnite({
  children,
  as: Tag = "h1",
  className,
}: {
  children: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      let split: InstanceType<typeof SplitText> | null = null;
      let cancelled = false;

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        if (cancelled || !el) return;

        split = new SplitText(el, { type: "words", wordsClass: "reveal-word" });
        gsap.set(split.words, { opacity: 0, y: "0.4em" });
        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: gsapEaseOut,
          stagger: WORD_STAGGER,
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref, dependencies: [children] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
