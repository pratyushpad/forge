"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "../../../lib/gsap";
import { gsapEaseOut, prefersReducedMotion, wordStaggerStep } from "../../../lib/motion";

const DURATION = 0.75; // seconds, per word
const WATCHDOG_SLACK = 1.5; // seconds past the tween's own runtime

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
 * Two rules keep this safe, both learned the hard way:
 *
 * 1. NO DEPENDENCIES. `children` is a JSX element, so it is a fresh object on
 *    every render. Passing it to useGSAP's `dependencies` made the hook tear
 *    down and re-run on every parent render — and the overview page re-renders
 *    ~30x/second while the typewriter replays a cached completion. The result
 *    was the headline being re-split 30x/second, restarting its tween each
 *    time and never getting past the first ~33ms: one pale ghost word and a
 *    block of invisible-but-still-laid-out ones. The headline text is static
 *    for the life of the route, so it is split exactly once, on mount.
 *
 * 2. `gsap.from` with `immediateRender: false`, never `set(0)` + `to(1)`.
 *    With a `from` tween the resting state is the element's own — full
 *    opacity, no transform — so a tween that is killed or interrupted
 *    mid-flight can never strand a word at opacity 0. Deferring the render
 *    closes the other half: the hidden start state is only ever written on
 *    the tween's first actual tick, so if the ticker never runs (a tab
 *    hidden through load, a throttled rAF) nothing is hidden in the first
 *    place and the headline simply doesn't animate.
 *
 * 3. A watchdog. Belt and braces on top of both: a timer sized to the
 *    tween's own length forces `settle()` even if the animation never
 *    completes, so there is a hard deadline by which this headline is
 *    guaranteed readable. `settle()` reverts the split, so the DOM ends as
 *    the plain, unstyled heading it started as, and it runs on completion,
 *    on the watchdog, on cleanup, and on any SplitText failure.
 *
 * Gated behind `document.fonts.ready`: Playfair Display loads with
 * `display: swap`, so splitting before the real font is ready would measure
 * the fallback's metrics and visibly reflow once it swaps in. Nothing is
 * hidden before that promise resolves, so a font promise that never settles
 * leaves a fully readable headline rather than a blank one.
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
      let tween: gsap.core.Tween | null = null;
      let watchdog: ReturnType<typeof setTimeout> | null = null;
      let cancelled = false;

      // The guaranteed resting state, reachable from every exit path.
      const settle = () => {
        if (watchdog !== null) {
          clearTimeout(watchdog);
          watchdog = null;
        }
        tween?.kill();
        tween = null;
        split?.revert();
        split = null;
        gsap.set(el, { clearProps: "opacity,transform" });
      };

      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        if (cancelled || !ref.current) return;
        try {
          split = new SplitText(el, { type: "words", wordsClass: "reveal-word" });
          tween = gsap.from(split.words, {
            opacity: 0,
            y: "0.35em",
            duration: DURATION,
            ease: gsapEaseOut,
            stagger: wordStaggerStep,
            immediateRender: false,
            onComplete: settle,
          });
          const runtime = DURATION + wordStaggerStep * Math.max(0, split.words.length - 1);
          watchdog = setTimeout(settle, (runtime + WATCHDOG_SLACK) * 1000);
        } catch {
          // A split that throws must not leave the headline half-styled.
          settle();
        }
      });

      // These tweens are created in a microtask, after useGSAP's context has
      // closed its synchronous collection window, so the context cannot
      // revert them for us — tear them down by hand.
      return () => {
        cancelled = true;
        settle();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
