import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, User } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/merchant/ai-coach")({
  head: () => ({ meta: [{ title: "AI Credit Coach — Hamisathi" }] }),
  component: Coach,
});

interface Msg { role: "user" | "ai"; text: string; }

const initial: Msg[] = [
  { role: "ai", text: "Hi! I'm your AI Credit Coach. I can explain your score, suggest improvements, and answer lending questions. What would you like to know?" },
];

const suggestions = ["How can I improve my score?","Why is my score 847?","What affects loan eligibility?","Am I ready for a larger loan?"];

const replies: Record<string, string> = {
  "improve": "Three high-impact actions right now: (1) pay your next electricity bill within 7 days of issue (+6 pts), (2) add 2 verified guarantors from your community network (+8 pts), and (3) increase your daily transaction count by 15% over 60 days (+10 pts).",
  "low": "Your score is actually strong at 847 (Excellent tier). The main drivers are excellent bill payment history (91/100) and stable cash flow over 9 consecutive months. The smallest factor holding it back is community trust at 74/100.",
  "847": "847 puts you in the top 18% of merchants on our platform. It reflects 9 months of positive cash flow, 91% on-time bill payments, and 6 years of business stability.",
  "eligibility": "Loan eligibility is calculated from five signals: monthly cash flow consistency (30%), trust score (25%), bill payment history (20%), business stability (15%), and community references (10%).",
  "larger": "Yes — based on your current trust score and 12-month cash flow trend, you are eligible for loans up to Rs. 850,000. I would recommend starting with Rs. 450,000 to optimize your approval-probability-to-amount ratio.",
};

function reply(q: string): string {
  const lower = q.toLowerCase();
  for (const k in replies) if (lower.includes(k)) return replies[k];
  return "Great question. Based on your current profile, I'd recommend focusing on consistent bill payments and growing your verified reference network — these have the highest marginal impact on your trust score right now.";
}

function Coach() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => setMessages(m => [...m, { role: "ai", text: reply(text) }]), 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span className="size-9 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center"><Sparkles className="size-4" /></span>
          AI Credit Coach
        </h1>
        <p className="text-sm text-muted-foreground">Personalized guidance powered by your data.</p>
      </div>

      <div className="rounded-2xl bg-surface border shadow-soft flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && (
                <div className="size-8 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center shrink-0"><Sparkles className="size-4" /></div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-lg bg-muted grid place-items-center shrink-0"><User className="size-4" /></div>
              )}
            </motion.div>
          ))}
        </div>
        <div className="border-t p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border bg-surface hover:bg-muted">{s}</button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about your score or eligibility…"
              className="flex-1 h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30" />
            <button className="size-11 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center hover:opacity-90"><Send className="size-4" /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
