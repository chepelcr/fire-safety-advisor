import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { BuildingSelector } from "@/components/BuildingSelector";
import { CategoryCard } from "@/components/CategoryCard";
import { ChatPanel } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/contexts/LangContext";
import { fireCodeApi, type BuildingType } from "@/services/fireCodeApi";
import { Printer, ShieldAlert, ListChecks, AlertTriangle } from "lucide-react";

const Index = () => {
  const { tr, lang } = useLang();

  const [building, setBuilding] = useState<BuildingType>("comercial");
  const [area, setArea] = useState<number>(0);
  const [context, setContext] = useState<string>("");
  const [floors, setFloors] = useState<number>(0);
  const [occupants, setOccupants] = useState<number>(0);
  const [ceilingHeight, setCeilingHeight] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  const { data: ruleGroups = [], isLoading, isError } = useQuery({
    queryKey: ["rules", building, area, context, floors, occupants, ceilingHeight, volume],
    queryFn: () =>
      fireCodeApi.getRules({
        building_type: building || undefined,
        area_m2: area || undefined,
        usage: context || undefined,
        floors: floors || undefined,
        occupants: occupants || undefined,
        ceiling_height_m: ceilingHeight || undefined,
        volume_m3: volume || undefined,
      }),
    staleTime: 30_000,
  });

  const totalRules = ruleGroups.reduce((acc, g) => acc + g.quantity, 0);
  const highRisk = ruleGroups.reduce(
    (acc, g) => acc + g.rules.filter((r) => r.risk.level === "alto").length,
    0
  );

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
            floors={floors} onFloorsChange={setFloors}
            occupants={occupants} onOccupantsChange={setOccupants}
            ceilingHeight={ceilingHeight} onCeilingHeightChange={setCeilingHeight}
            volume={volume} onVolumeChange={setVolume}
          />
        </section>

        {/* Stats */}
        <section className="flex flex-wrap items-center justify-between gap-4 panel px-5 py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold">{isLoading ? "—" : totalRules}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[hsl(var(--risk-high))]" />
              <span className="text-muted-foreground">{lang === "es" ? "Riesgo alto" : "High risk"}:</span>
              <span className="font-semibold text-[hsl(var(--risk-high))]">{isLoading ? "—" : highRisk}</span>
            </div>
            {ruleGroups.map((g) => (
              <div key={g.type} className="hidden sm:flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full bg-[hsl(var(--cat-${
                    g.type === "iniciacion" ? "initiation"
                    : g.type === "notificacion" ? "notification"
                    : g.type === "monitoreo" ? "monitoring"
                    : "actuation"
                  }))]`}
                />
                <span className="text-xs text-muted-foreground">{tr[g.type as keyof typeof tr]}</span>
                <span className="text-xs font-semibold">{g.quantity}</span>
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
            {isError && (
              <div className="flex items-center gap-3 rounded-md border border-[hsl(var(--risk-high)/0.4)] bg-[hsl(var(--risk-high)/0.1)] p-4 text-sm text-[hsl(var(--risk-high))]">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {lang === "es"
                  ? "Error al cargar las normas. Verifique su conexión e intente de nuevo."
                  : "Error loading standards. Check your connection and try again."}
              </div>
            )}

            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="panel overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="divide-y divide-border">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="px-4 py-3 space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ruleGroups.map((group) => (
                <CategoryCard key={group.type} group={group} />
              ))
            )}
          </div>

          <div className="no-print">
            <ChatPanel
              buildingType={building}
              usage={context}
              areaM2={area || undefined}
              floors={floors || undefined}
              occupants={occupants || undefined}
              ceilingHeight={ceilingHeight || undefined}
              volume={volume || undefined}
            />
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
