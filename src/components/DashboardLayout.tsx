import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Flame, LayoutDashboard, FolderKanban, Sparkles, LogOut, Languages } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
];

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 border border-primary/30">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            FireCode <span className="text-primary">CR</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Evaluator">
                  <NavLink to="/demo" className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Evaluator</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserBlock />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserBlock() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const email = (user?.signInDetails?.loginId as string | undefined) ?? user?.username ?? "";

  return (
    <div className="px-2 py-2 space-y-2">
      <div className="text-xs text-muted-foreground truncate group-data-[collapsible=icon]:hidden" title={email}>
        {email}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={async () => {
          await signOut();
          navigate("/login", { replace: true });
        }}
      >
        <LogOut className="h-4 w-4" />
        <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
      </Button>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const location = useLocation();
  const title = items.find((i) => location.pathname === i.url || location.pathname.startsWith(i.url + "/"))?.title
    ?? "Dashboard";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur px-3">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="gap-2"
            >
              <Languages className="h-4 w-4" />
              {lang === "es" ? "EN" : "ES"}
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container max-w-6xl py-6 px-4 sm:px-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
