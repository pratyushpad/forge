// Quiet section eyebrow — a hairline tick, an accent-colored numeral, and a
// muted mono label. Shared by every route. Where the numbers correspond to
// an actual sequence (a real ordered process, like the method page's steps),
// they carry information; elsewhere they're just a scan aid. No drawn
// rule, no stamp animation — this is a static label, not a showpiece.
export default function ForgeSecLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="sec-label">
      <span className="sec-num">{num}</span>
      {label}
    </div>
  );
}
