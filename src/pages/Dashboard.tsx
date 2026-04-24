import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { FolderKanban, Plus, Sparkles, ArrowRight } from "lucide-react";
import { BuildingType } from "@/services/fireCodeApi";

const BUILDING_LABEL: Record<number, string> = {
  [BuildingType.residencial]: "Residential",
  [BuildingType.comercial]: "Commercial",
  [BuildingType.industrial]: "Industrial",
};

export default function Dashboard() {
  const { projects, loading } = useProjects();
  const { user } = useAuth();
  const email = (user?.signInDetails?.loginId as string | undefined) ?? user?.username ?? "";
  const recent = projects.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "—" : projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Stored in your workspace</p>
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-sm font-medium">New evaluation</CardTitle>
              <CardDescription>Run the FireCode CR evaluator</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full gap-2">
                <Link to="/demo">
                  <Sparkles className="h-4 w-4" />
                  Open evaluator
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Create project</CardTitle>
              <CardDescription>Save building data and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full gap-2">
                <Link to="/projects/new">
                  <Plus className="h-4 w-4" />
                  New project
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent projects</CardTitle>
              <CardDescription>Your latest saved evaluations</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link to="/projects">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : recent.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-border rounded-md">
                <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No projects yet</p>
                <Button asChild size="sm">
                  <Link to="/projects/new">Create your first project</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {recent.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/projects/${p.id}`}
                      className="flex items-center justify-between py-3 hover:bg-muted/30 px-2 -mx-2 rounded"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {BUILDING_LABEL[p.building_type]} · {p.usage} · {p.area_m2} m²
                        </div>
                      </div>
                      <RiskBadge level={p.risk} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
