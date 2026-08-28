"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "../../../lib/gsap";
import { gsapEaseOut, prefersReducedMotion, wordStaggerStep } from "../../../lib/motion";

/**
 * Headline reveal: splits the heading into words with SplitText and unfurls
 * them on mount — a slow rise, expo-eased, one word at a time. Word-level,
 * not character-level: a serif headline that reads once per visit should
 * open like a page turning, not cascade like a loading list.
 *
 * Children are ReactNode, not a string, so a headline can carry its one
 * italic word (`<i>reason</i>`). SplitText preserves nested inline elements
 * when it wraps words, so the italic survives the split.
 *
 * Gated behind `document.fonts.ready`: Playfair Display loads with
 * `display: swap`, so splitting before the real font is ready would measure
 * the fallback's metrics and visibly reflow once it swaps in.
 *
 * Reduced motion: renders the same static markup, SplitText never runs.
 */
export default function HeadlineReveal({
  children,
  as: Tag = "h1",
  className,
}: {
  children: ReactNode;
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
        gsap.set(split.words, { opacity: 0, y: "0.35em" });
        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: gsapEaseOut,
          stagger: wordStaggerStep,
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
