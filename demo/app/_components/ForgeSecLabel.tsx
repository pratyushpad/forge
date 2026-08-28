/**
 * Section eyebrow — a small sage leaf, the section numeral set in Playfair
 * italic, the label in tracked-out sans, and a hairline trailing off to the
 * right. Shared by every route.
 *
 * Where the numbers correspond to an actual sequence (the method page's
 * steps) they carry information; elsewhere they're a scan aid. Static
 * markup, no animation: this is a label, not a showpiece.
 */
export default function ForgeSecLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="sec-label">
      <svg
        className="sprig"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 12C4 8 7 5 12 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M6.4 7.6C7.9 4.9 10.4 4 12 4.4C11.2 7.3 8.4 8.6 6.4 7.6Z" fill="currentColor" />
      </svg>
      <span className="sec-num">{num}</span>
      {label}
    </div>
  );
}
