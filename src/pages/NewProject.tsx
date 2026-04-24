import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fireCodeApi, BuildingType } from "@/services/fireCodeApi";
import type { RiskLevel } from "@/hooks/useProjects";
import { Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function normalizeRisk(raw?: string): RiskLevel | undefined {
  if (!raw) return undefined;
  const r = raw.toLowerCase();
  if (r.includes("alto") || r.includes("high")) return "high";
  if (r.includes("medio") || r.includes("medium")) return "medium";
  if (r.includes("bajo") || r.includes("low")) return "low";
  return undefined;
}

export default function NewProject() {
  const navigate = useNavigate();
  const { create } = useProjects();

  const [name, setName] = useState("");
  const [buildingType, setBuildingType] = useState<BuildingType>(BuildingType.comercial);
  const [usage, setUsage] = useState("");
  const [area, setArea] = useState<number>(100);
  const [floors, setFloors] = useState<number | "">("");
  const [occupants, setOccupants] = useState<number | "">("");
  const [ceiling, setCeiling] = useState<number | "">("");
  const [volume, setVolume] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let evalResult: Awaited<ReturnType<typeof fireCodeApi.evaluate>> | null = null;
      try {
        evalResult = await fireCodeApi.evaluate({
          building_type: buildingType,
          usage,
          user_query: `Save evaluation for project: ${name}`,
          area_m2: area,
          floors: floors === "" ? undefined : Number(floors),
          occupants: occupants === "" ? undefined : Number(occupants),
          ceiling_height_m: ceiling === "" ? undefined : Number(ceiling),
          volume_m3: volume === "" ? undefined : Number(volume),
        });
      } catch {
        // backend evaluation optional; project still saves
      }

      const project = create({
        name: name.trim(),
        building_type: buildingType,
        usage: usage.trim(),
        area_m2: area,
        floors: floors === "" ? undefined : Number(floors),
        occupants: occupants === "" ? undefined : Number(occupants),
        ceiling_height_m: ceiling === "" ? undefined : Number(ceiling),
        volume_m3: volume === "" ? undefined : Number(volume),
        risk: normalizeRisk(evalResult?.risk),
        requirements: evalResult?.requirements,
        reference: evalResult?.reference,
        contextCr: evalResult?.contextCr,
      });

      navigate(`/projects/${project.id}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2">
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>New project</CardTitle>
            <CardDescription>Save building data and run an evaluation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Project name *</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Building type *</Label>
                  <Select value={String(buildingType)} onValueChange={(v) => setBuildingType(Number(v) as BuildingType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(BuildingType.residencial)}>Residential</SelectItem>
                      <SelectItem value={String(BuildingType.comercial)}>Commercial</SelectItem>
                      <SelectItem value={String(BuildingType.industrial)}>Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage">Usage *</Label>
                  <Input id="usage" required placeholder="e.g. restaurant, office" value={usage} onChange={(e) => setUsage(e.target.value)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Area (m²) *</Label>
                  <Input id="area" type="number" min={1} required value={area} onChange={(e) => setArea(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Floors</Label>
                  <Input id="floors" type="number" min={0} value={floors} onChange={(e) => setFloors(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupants">Occupants</Label>
                  <Input id="occupants" type="number" min={0} value={occupants} onChange={(e) => setOccupants(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceiling">Ceiling height (m)</Label>
                  <Input id="ceiling" type="number" step="0.1" min={0} value={ceiling} onChange={(e) => setCeiling(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="volume">Volume (m³)</Label>
                  <Input id="volume" type="number" min={0} value={volume} onChange={(e) => setVolume(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
