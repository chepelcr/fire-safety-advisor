import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { ArrowLeft, FileDown, ListChecks, BookOpen, MapPin } from "lucide-react";
import { BuildingType } from "@/services/fireCodeApi";

const BUILDING_LABEL: Record<number, string> = {
  [BuildingType.residencial]: "Residential",
  [BuildingType.comercial]: "Commercial",
  [BuildingType.industrial]: "Industrial",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

function ListBlock({ title, icon: Icon, items }: { title: string; icon: typeof ListChecks; items?: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!items || items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProjectDetail() {
  const { id = "" } = useParams();
  const { get } = useProjects();
  const project = get(id);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-1 -ml-2">
          <Link to="/projects"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        </Button>

        {!project ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">Project not found.</p>
              <Button asChild variant="outline"><Link to="/projects">Back to projects</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
                  <RiskBadge level={project.risk} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Created {new Date(project.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" disabled className="gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Project info</CardTitle>
                  <CardDescription>Building characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <InfoRow label="Building type" value={BUILDING_LABEL[project.building_type]} />
                  <InfoRow label="Usage" value={project.usage} />
                  <InfoRow label="Area" value={`${project.area_m2} m²`} />
                  <InfoRow label="Floors" value={project.floors} />
                  <InfoRow label="Occupants" value={project.occupants} />
                  <InfoRow label="Ceiling height" value={project.ceiling_height_m ? `${project.ceiling_height_m} m` : undefined} />
                  <InfoRow label="Volume" value={project.volume_m3 ? `${project.volume_m3} m³` : undefined} />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 grid gap-4">
                <ListBlock title="Requirements" icon={ListChecks} items={project.requirements} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <ListBlock title="References" icon={BookOpen} items={project.reference} />
                  <ListBlock title="Costa Rica context" icon={MapPin} items={project.contextCr} />
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Checklist</CardTitle>
                    <CardDescription>Coming soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Inspection checklists will be available in an upcoming release.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
