import { Building2, Factory, Home } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import type { BuildingType } from "@/data/knowledgeBase";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: BuildingType;
  onChange: (b: BuildingType) => void;
  area: number;
  onAreaChange: (a: number) => void;
  context: string;
  onContextChange: (c: string) => void;
}

export function BuildingSelector({ value, onChange, area, onAreaChange, context, onContextChange }: Props) {
  const { tr } = useLang();
  const types: { id: BuildingType; icon: typeof Home; label: string }[] = [
    { id: "residencial", icon: Home, label: tr.residencial },
    { id: "comercial", icon: Building2, label: tr.comercial },
    { id: "industrial", icon: Factory, label: tr.industrial },
  ];
  return (
    <div className="panel p-5 space-y-5">
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">{tr.selectBuilding}</Label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {types.map((t) => {
            const active = value === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-md border p-3 transition-all",
                  active
                    ? "border-primary/60 bg-primary/10 glow-red"
                    : "border-border bg-secondary/40 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="area" className="text-xs uppercase tracking-wider text-muted-foreground">{tr.area}</Label>
          <Input
            id="area"
            type="number"
            min={0}
            value={area || ""}
            onChange={(e) => onAreaChange(Number(e.target.value))}
            placeholder="280"
            className="mt-2 bg-input/60"
          />
        </div>
        <div>
          <Label htmlFor="ctx" className="text-xs uppercase tracking-wider text-muted-foreground">
            {/* simple label */}
            {tr === undefined ? "" : "Uso (restaurante, bodega…)"}
          </Label>
          <Input
            id="ctx"
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="restaurante, bodega, oficina…"
            className="mt-2 bg-input/60"
          />
        </div>
      </div>
    </div>
  );
}
