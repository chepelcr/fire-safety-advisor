import { Flame, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";

interface HeaderProps {
  chatButton?: React.ReactNode;
}

export function Header({ chatButton }: HeaderProps) {
  const { lang, setLang, tr } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/30 glow-red">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">{tr.appName} <span className="text-primary">CR</span></div>
            <div className="text-xs text-muted-foreground">{tr.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chatButton}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            {lang === "es" ? "EN" : "ES"}
          </Button>
        </div>
      </div>
    </header>
  );
}
