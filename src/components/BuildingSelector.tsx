import { Building2, Factory, Home } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { BuildingType } from "@/services/fireCodeApi";
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
  floors: number;
  onFloorsChange: (v: number) => void;
  occupants: number;
  onOccupantsChange: (v: number) => void;
  ceilingHeight: number;
  onCeilingHeightChange: (v: number) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}

export function BuildingSelector({
  value, onChange,
  area, onAreaChange,
  context, onContextChange,
  floors, onFloorsChange,
  occupants, onOccupantsChange,
  ceilingHeight, onCeilingHeightChange,
  volume, onVolumeChange,
}: Props) {
  const { tr } = useLang();
  const types: { id: BuildingType; icon: typeof Home; label: string }[] = [
    { id: BuildingType.residencial, icon: Home,      label: tr.residencial },
    { id: BuildingType.comercial,   icon: Building2, label: tr.comercial   },
    { id: BuildingType.industrial,  icon: Factory,   label: tr.industrial  },
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

      <div className="grid grid-cols-2 gap-3">
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
            Uso
          </Label>
          <Input
            id="ctx"
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="restaurante, bodega…"
            className="mt-2 bg-input/60"
          />
        </div>
        <div>
          <Label htmlFor="floors" className="text-xs uppercase tracking-wider text-muted-foreground">{tr.floors}</Label>
          <Input
            id="floors"
            type="number"
            min={1}
            value={floors || ""}
            onChange={(e) => onFloorsChange(Number(e.target.value))}
            placeholder="1"
            className="mt-2 bg-input/60"
          />
        </div>
        <div>
          <Label htmlFor="occupants" className="text-xs uppercase tracking-wider text-muted-foreground">{tr.occupants}</Label>
          <Input
            id="occupants"
            type="number"
            min={0}
            value={occupants || ""}
            onChange={(e) => onOccupantsChange(Number(e.target.value))}
            placeholder="50"
            className="mt-2 bg-input/60"
          />
        </div>
        <div>
          <Label htmlFor="ceiling" className="text-xs uppercase tracking-wider text-muted-foreground">{tr.ceilingHeight}</Label>
          <Input
            id="ceiling"
            type="number"
            min={0}
            step={0.1}
            value={ceilingHeight || ""}
            onChange={(e) => onCeilingHeightChange(Number(e.target.value))}
            placeholder="3.5"
            className="mt-2 bg-input/60"
          />
        </div>
        <div>
          <Label htmlFor="volume" className="text-xs uppercase tracking-wider text-muted-foreground">{tr.volume}</Label>
          <Input
            id="volume"
            type="number"
            min={0}
            value={volume || ""}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            placeholder="840"
            className="mt-2 bg-input/60"
          />
        </div>
      </div>
    </div>
  );
}
