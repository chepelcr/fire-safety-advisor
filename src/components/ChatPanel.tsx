import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertTriangle, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LangContext";
import { answerQuestion, type ChatAnswer } from "@/lib/engine";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; text: string; answer?: ChatAnswer; }

export function ChatPanel() {
  const { lang, tr } = useLang();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const suggestions = lang === "es"
    ? ["¿Qué sistema necesita un restaurante?", "¿Dónde instalo detectores de humo?", "¿Necesito rociadores en una bodega?"]
    : ["What system does a restaurant need?", "Where do I install smoke detectors?", "Do I need sprinklers in a warehouse?"];

  const ask = (text: string) => {
    if (!text.trim()) return;
    const a = answerQuestion(text);
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: lang === "es" ? a.summary : a.summary_en, answer: a }]);
    setInput("");
  };

  return (
    <div className="panel flex h-[640px] flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <div className="text-sm font-semibold">{tr.assistant}</div>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{tr.chatIntro}</p>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{tr.suggestions}</div>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="block w-full rounded-md border border-border bg-secondary/40 px-3 py-2 text-left text-xs hover:border-primary/40 hover:bg-primary/5 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[90%] rounded-lg px-3 py-2 text-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 border border-border"
              )}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              {m.answer && m.answer.matchedRules.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.answer.references.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="font-semibold">{tr.refLabel}:</span>
                      {m.answer.references.map((r) => (
                        <span key={r} className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">{r}</span>
                      ))}
                    </div>
                  )}
                  <div className="rounded-md border border-border bg-background/40 p-2 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-accent">
                      <MapPin className="h-3.5 w-3.5" /> {tr.crLabel}
                    </div>
                    <ul className="mt-1.5 space-y-1 text-muted-foreground">
                      {m.answer.matchedRules.map((r) => (
                        <li key={r.id}>• {lang === "es" ? r.practical_interpretation : r.practical_interpretation_en}</li>
                      ))}
                    </ul>
                  </div>
                  {m.answer.risk === "alto" && (
                    <div className="flex items-start gap-2 rounded-md border border-[hsl(var(--risk-high)/0.4)] bg-[hsl(var(--risk-high)/0.1)] p-2 text-xs text-[hsl(var(--risk-high))]">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span><strong>{tr.riskWarning}:</strong> {lang === "es" ? "El incumplimiento puede generar paralización de obra y responsabilidad civil." : "Non-compliance may cause work shutdown and civil liability."}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tr.askPlaceholder}
          className="bg-input/60"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
