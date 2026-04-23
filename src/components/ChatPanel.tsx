import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, AlertTriangle, BookOpen, MapPin, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LangContext";
import { fireCodeApi, BuildingType, type EvaluateResponse } from "@/services/fireCodeApi";
import { cn } from "@/lib/utils";

export interface Msg {
  role: "user" | "assistant";
  text: string;
  answer?: EvaluateResponse;
}

interface Props {
  buildingType: BuildingType;
  usage: string;
  areaM2?: number;
  floors?: number;
  occupants?: number;
  ceilingHeight?: number;
  volume?: number;
  onClose?: () => void;
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
}

export function ChatPanel({ buildingType, usage, areaM2, floors, occupants, ceilingHeight, volume, onClose, messages, setMessages }: Props) {
  const { lang, tr } = useLang();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const suggestions = lang === "es"
    ? ["¿Qué sistema necesita un restaurante?", "¿Dónde instalo detectores de humo?", "¿Necesito rociadores en una bodega?"]
    : ["What system does a restaurant need?", "Where do I install smoke detectors?", "Do I need sprinklers in a warehouse?"];

  const ask = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await fireCodeApi.evaluate({
        building_type: buildingType || BuildingType.comercial,
        usage: usage || text,
        user_query: text,
        area_m2: areaM2 || undefined,
        floors: floors || undefined,
        occupants: occupants || undefined,
        ceiling_height_m: ceilingHeight || undefined,
        volume_m3: volume || undefined,
      });

      const summary = result.matchedRules.length > 0
        ? lang === "es"
          ? `Encontré ${result.matchedRules.length} norma(s) aplicable(s).`
          : `Found ${result.matchedRules.length} applicable standard(s).`
        : result.foundryUsed && result.requirements.length > 0
        ? lang === "es"
          ? "El agente IA proporcionó recomendaciones generales."
          : "The AI agent provided general recommendations."
        : lang === "es"
        ? "No encontré normas específicas para esa consulta."
        : "No specific standards found for that query.";

      setMessages((m) => [...m, { role: "assistant", text: summary, answer: result }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: lang === "es"
            ? "Error al procesar la consulta. Verifique su conexión."
            : "Error processing the request. Please check your connection.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{tr.assistant}</span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              title={lang === "es" ? "Limpiar chat" : "Clear chat"}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              title={lang === "es" ? "Cerrar" : "Close"}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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

              {m.answer && (m.answer.matchedRules.length > 0 || m.answer.foundryUsed) && (
                <div className="mt-3 space-y-2">
                  {m.answer.foundryUsed && m.answer.reference.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="font-semibold">{tr.refLabel}:</span>
                      {m.answer.reference.map((r) => (
                        <span key={r} className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">{r}</span>
                      ))}
                    </div>
                  )}

                  {m.answer.matchedRules.length > 0 && (
                    <div className="rounded-md border border-border bg-background/40 p-2 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-accent">
                        <MapPin className="h-3.5 w-3.5" /> {tr.crLabel}
                      </div>
                      <ul className="mt-1.5 space-y-1 text-muted-foreground">
                        {m.answer.matchedRules.map((r) => (
                          <li key={r.id}>• {r.title} — <span className="opacity-80">{r.description.slice(0, 80)}…</span></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.answer.foundryUsed && m.answer.requirements.length > 0 && (
                    <div className="rounded-md border border-border bg-background/30 p-2 text-xs">
                      <div className="font-semibold text-accent mb-1">{tr.requirements}:</div>
                      <ul className="space-y-0.5 text-muted-foreground">
                        {m.answer.requirements.map((req, ri) => (
                          <li key={ri}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.answer.foundryUsed && m.answer.contextCr.length > 0 && (
                    <div className="rounded-md border border-border bg-background/20 p-2 text-xs text-muted-foreground">
                      <ul className="space-y-0.5">
                        {m.answer.contextCr.map((ctx, ci) => (
                          <li key={ci}>• {ctx}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!m.answer.foundryUsed && (
                    <p className="text-[11px] italic text-muted-foreground">
                      {lang === "es"
                        ? "Evaluación IA no disponible — mostrando resultados determinísticos."
                        : "AI evaluation unavailable — showing deterministic results."}
                    </p>
                  )}

                  {m.answer.risk === "alto" && (
                    <div className="flex items-start gap-2 rounded-md border border-[hsl(var(--risk-high)/0.4)] bg-[hsl(var(--risk-high)/0.1)] p-2 text-xs text-[hsl(var(--risk-high))]">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong>{tr.riskWarning}:</strong>{" "}
                        {lang === "es"
                          ? "El incumplimiento puede generar paralización de obra y responsabilidad civil."
                          : "Non-compliance may cause work shutdown and civil liability."}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
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
          disabled={isLoading}
        />
        <Button type="submit" size="icon" className="shrink-0" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
