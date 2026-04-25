import { Flame, Languages, Home, LayoutDashboard, LogIn, LogOut, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  chatButton?: React.ReactNode;
}

export function Header({ chatButton }: HeaderProps) {
  const { lang, setLang, tr } = useLang();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const onDemo = pathname.startsWith("/demo");
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/30 glow-red">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">{tr.appName} <span className="text-primary">CR</span></div>
            <div className="text-xs text-muted-foreground hidden sm:block">{tr.tagline}</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {onDemo && (
            <Button asChild variant="ghost" size="sm" className="gap-2 hidden sm:inline-flex">
              <Link to="/">
                <Home className="h-4 w-4" />
                {lang === "es" ? "Inicio" : "Home"}
              </Link>
            </Button>
          )}
          {chatButton}
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="gap-2 hidden sm:inline-flex">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  {lang === "es" ? "Panel" : "Dashboard"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hidden sm:inline-flex"
                onClick={async () => { await signOut(); navigate("/"); }}
              >
                <LogOut className="h-4 w-4" />
                {lang === "es" ? "Salir" : "Sign out"}
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="gap-2 hidden sm:inline-flex">
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                {lang === "es" ? "Ingresar" : "Sign in"}
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {lang === "es" ? "EN" : "ES"}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" />
                  {tr.appName} <span className="text-primary">CR</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                <Button asChild variant="ghost" className="justify-start gap-2" onClick={closeMobile}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    {lang === "es" ? "Inicio" : "Home"}
                  </Link>
                </Button>
                {user ? (
                  <>
                    <Button asChild variant="ghost" className="justify-start gap-2" onClick={closeMobile}>
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        {lang === "es" ? "Panel" : "Dashboard"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2"
                      onClick={async () => { closeMobile(); await signOut(); navigate("/"); }}
                    >
                      <LogOut className="h-4 w-4" />
                      {lang === "es" ? "Salir" : "Sign out"}
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="ghost" className="justify-start gap-2" onClick={closeMobile}>
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      {lang === "es" ? "Ingresar" : "Sign in"}
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
