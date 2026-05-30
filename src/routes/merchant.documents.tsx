import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/merchant/documents")({
  head: () => ({ meta: [{ title: "Documents — Hamisathi" }] }),
  component: () => {
    const docs = [
      { name: "Business Registration.pdf", status: "Verified", date: "12 Jan 2026" },
      { name: "Citizenship ID.jpg", status: "Verified", date: "12 Jan 2026" },
      { name: "Bank Statement Q3.pdf", status: "Verified", date: "01 Mar 2026" },
      { name: "Electricity Bill.pdf", status: "Pending", date: "15 May 2026" },
    ];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Documents</h1>
            <p className="text-sm text-muted-foreground">Manage your verified business documents.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 shadow-soft">
            <Upload className="size-4" /> Upload document
          </button>
        </div>
        <div className="rounded-2xl bg-surface border shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr><th className="text-left px-5 py-3">Document</th><th className="text-left px-5 py-3">Uploaded</th><th className="text-left px-5 py-3">Status</th></tr>
            </thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.name} className="border-t">
                  <td className="px-5 py-3 flex items-center gap-2"><FileText className="size-4 text-muted-foreground" />{d.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${d.status === "Verified" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {d.status === "Verified" && <CheckCircle2 className="size-3" />}{d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
