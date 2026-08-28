"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ForgeMark from "./ForgeMark";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/playground", label: "Playground" },
  { href: "/method", label: "Method" },
  { href: "/results", label: "Results" },
  { href: "/traces", label: "Traces" },
];

/**
 * Primary navigation. Desktop shows the horizontal rail; below 800px it
 * collapses to a hamburger that opens a full-viewport sheet.
 *
 * The sheet is always in the DOM and toggled with a class, so both the
 * open and the close animate (a CSS transition, interruptible, rather than
 * a keyframe that restarts from zero on a fast double-tap). `visibility:
 * hidden` in the closed state keeps its links out of the tab order and out
 * of the accessibility tree without needing aria-hidden.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Close on route change — the sheet's own links navigate.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes; the page behind must not scroll while the sheet is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      // Closing hides the sheet, which would silently drop keyboard focus to
      // <body>; hand it back to the toggle instead (WCAG 2.4.3).
      const active = document.activeElement;
      if (
        active === document.body ||
        (active instanceof Node && sheetRef.current?.contains(active))
      ) {
        toggleRef.current?.focus();
      }
    };
  }, [open]);

  return (
    <nav className="sitenav" aria-label="Primary">
      <div className="sitenav-inner">
        <Link href="/" className="wordmark">
          <ForgeMark size={26} />
          Forge
        </Link>

        <ul className="navlinks">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`navlink${active ? " active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="nav-toggle"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path
              d="M1 1h16M1 6h16M1 11h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className={`nav-sheet${open ? " open" : ""}`} id="nav-sheet" ref={sheetRef}>
        <button
          type="button"
          className="nav-sheet-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <ul>
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
