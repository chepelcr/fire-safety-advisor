import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { BuildingSelector } from "@/components/BuildingSelector";
import { CategoryCard } from "@/components/CategoryCard";
import { ChatPanel } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";
import { analyze, groupByCategory } from "@/lib/engine";
import type { BuildingType, Category } from "@/data/knowledgeBase";
import { Printer, ShieldAlert, ListChecks } from "lucide-react";

const Index = () => {
  const { tr, lang } = useLang();
  const [building, setBuilding] = useState<BuildingType>("comercial");
  const [area, setArea] = useState<number>(300);
  const [context, setContext] = useState<string>("");

  const rules = useMemo(() => analyze({ buildingType: building, area, context }), [building, area, context]);
  const grouped = useMemo(() => groupByCategory(rules), [rules]);
  const categories: Category[] = ["iniciacion", "notificacion", "monitoreo", "accionamiento"];

  const highRisk = rules.filter((r) => r.risk_level === "alto").length;

  return (
    <div className="min-h-screen scanline">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldAlert className="h-3.5 w-3.5" /> NFPA · Costa Rica
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {lang === "es" ? (
                <>Interprete normas <span className="text-primary">NFPA</span> en lenguaje práctico.</>
              ) : (
                <>Interpret <span className="text-primary">NFPA</span> standards in practical language.</>
              )}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {lang === "es"
                ? "Seleccione el tipo de edificio, ingrese el uso y obtenga los sistemas requeridos clasificados en iniciación, notificación, monitoreo y accionamiento."
                : "Select the building type, enter the occupancy and get required systems classified into initiation, notification, monitoring and actuation."}
            </p>
          </div>
          <BuildingSelector
            value={building} onChange={setBuilding}
            area={area} onAreaChange={setArea}
            context={context} onContextChange={setContext}
          />
        </section>

        {/* Stats + actions */}
        <section className="flex flex-wrap items-center justify-between gap-4 panel px-5 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">{rules.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[hsl(var(--risk-high))]" />
              <span className="text-muted-foreground">{lang === "es" ? "Riesgo alto" : "High risk"}:</span>
              <span className="font-semibold text-[hsl(var(--risk-high))]">{highRisk}</span>
            </div>
            {categories.map((c) => (
              <div key={c} className="hidden sm:flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full bg-[hsl(var(--cat-${c === "iniciacion" ? "initiation" : c === "notificacion" ? "notification" : c === "monitoreo" ? "monitoring" : "actuation"}))]`} />
                <span className="text-xs text-muted-foreground">{tr[c]}</span>
                <span className="text-xs font-semibold">{grouped[c].length}</span>
              </div>
            ))}
          </div>
          <Button onClick={() => window.print()} variant="outline" className="no-print gap-2">
            <Printer className="h-4 w-4" /> {tr.print}
          </Button>
        </section>

        {/* Results + chat */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {categories.map((c) => (
              <CategoryCard key={c} category={c} rules={grouped[c]} />
            ))}
          </div>
          <div className="no-print">
            <ChatPanel />
          </div>
        </section>

        <footer className="pt-4 text-center text-xs text-muted-foreground">
          {tr.disclaimer}
        </footer>
      </main>
    </div>
  );
};

export default Index;
