import { useState, useEffect } from "react";
import { Sparkles, Send, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const suggestions = ["How can I improve my score?","Why is my score 847?","What affects loan eligibility?","Am I ready for a larger loan?"];

export default function AiCoachPage() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["aiMessages"],
    queryFn: () => api.get("/ai-coach/messages")
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => api.post("/ai-coach/messages", { content: text }),
    onSuccess: (newData) => {
      // Optimistically or by invalidating
      queryClient.setQueryData(["aiMessages"], (old: any) => ({
        messages: old ? [...old.messages, ...newData.messages] : newData.messages
      }));
    }
  });

  useEffect(() => {
    document.title = "AI Credit Coach — Hamisathi";
  }, []);

  const send = (text: string) => {
    if (!text.trim() || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate(text);
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  const messages = data?.messages || [];

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
          {messages.length === 0 && <div className="text-sm text-center text-muted-foreground mt-10">Start a conversation with your AI Coach!</div>}
          {messages.map((m: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="size-8 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center shrink-0"><Sparkles className="size-4" /></div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-lg bg-muted grid place-items-center shrink-0"><User className="size-4" /></div>
              )}
            </motion.div>
          ))}
          {sendMutation.isPending && (
             <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3`}>
               <div className="size-8 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center shrink-0"><Sparkles className="size-4" /></div>
               <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm bg-muted flex items-center gap-2`}>
                 <Loader2 className="size-4 animate-spin" /> Thinking...
               </div>
             </motion.div>
          )}
        </div>
        <div className="border-t p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} disabled={sendMutation.isPending} className="text-xs px-3 py-1.5 rounded-full border bg-surface hover:bg-muted disabled:opacity-50">{s}</button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about your score or eligibility…" disabled={sendMutation.isPending}
              className="flex-1 h-11 px-3 rounded-lg border bg-surface outline-none focus:ring-2 focus:ring-ai/30 disabled:opacity-50" />
            <button disabled={sendMutation.isPending} className="size-11 rounded-lg bg-gradient-ai text-ai-foreground grid place-items-center hover:opacity-90 disabled:opacity-50"><Send className="size-4" /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
