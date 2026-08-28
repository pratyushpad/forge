import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <section className="fail">
        <div className="bar" />
        <div className="fail-code">404</div>
        <h2>
          That page <i>doesn&apos;t exist</i>
        </h2>
        <p className="prose">
          The five routes that do exist are below.
        </p>
        <ul className="fail-links">
          <li>
            <Link href="/">Overview</Link>, the headline result
          </li>
          <li>
            <Link href="/playground">Playground</Link>, live base-vs-tuned inference
          </li>
          <li>
            <Link href="/method">Method</Link>, how GRPO works and the bug worth reading about
          </li>
          <li>
            <Link href="/results">Results</Link>, every number with its source
          </li>
          <li>
            <Link href="/traces">Traces</Link>, full reasoning including the failures
          </li>
        </ul>
      </section>
    </div>
  );
}
