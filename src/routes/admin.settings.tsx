import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Hamisathi" }] }),
  component: () => (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Admin Settings</h1>
      {["Organization","Risk thresholds","Team access","API keys","Audit log"].map(s => (
        <div key={s} className="rounded-2xl bg-surface border shadow-soft p-6 flex items-center justify-between">
          <div>
            <div className="font-medium">{s}</div>
            <div className="text-sm text-muted-foreground mt-0.5">Configure {s.toLowerCase()}.</div>
          </div>
          <button className="px-3 py-2 rounded-lg border text-sm hover:bg-muted">Manage</button>
        </div>
      ))}
    </div>
  ),
});
