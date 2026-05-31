import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About — Hamisathi";
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="text-xs uppercase tracking-wider text-ai font-semibold">About</div>
      <h1 className="mt-3 text-5xl font-bold tracking-tight">A new credit lens for emerging markets</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Over 60% of Nepal's small merchants lack the formal credit history banks rely on. Hamisathi replaces that absent paper trail with rich behavioral, transactional and community signals — giving lenders like eSewa the confidence to underwrite responsibly.
      </p>
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {[
          { k: "Our mission", v: "Bring 100M+ merchants into the formal credit system across South Asia." },
          { k: "Our model", v: "Explainable ensembles built on transaction, billing and trust-network data." },
          { k: "Our partners", v: "Working alongside payment networks, MFIs, and cooperative banks." },
        ].map(c => (
          <div key={c.k} className="rounded-2xl border bg-surface p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.k}</div>
            <div className="mt-2 text-sm">{c.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
