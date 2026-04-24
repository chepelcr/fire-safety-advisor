import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, FileText, BookOpen, MapPin, MessageSquare, Printer, Layers, Clock, AlertTriangle, BookOpenCheck, Sparkles, Bot, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useLang } from "@/contexts/LangContext";

const Landing = () => {
  const { tr } = useLang();

  const problems = [
    { icon: BookOpen, t: tr.problem_1_t, d: tr.problem_1_d },
    { icon: Clock, t: tr.problem_2_t, d: tr.problem_2_d },
    { icon: AlertTriangle, t: tr.problem_3_t, d: tr.problem_3_d },
  ];

  const solutions = [
    { icon: Bot, t: tr.sol_1_t, d: tr.sol_1_d },
    { icon: Zap, t: tr.sol_2_t, d: tr.sol_2_d },
    { icon: Layers, t: tr.sol_3_t, d: tr.sol_3_d },
  ];

  const features = [
    { icon: Sparkles, t: tr.feat_1_t, d: tr.feat_1_d },
    { icon: BookOpenCheck, t: tr.feat_2_t, d: tr.feat_2_d },
    { icon: MapPin, t: tr.feat_3_t, d: tr.feat_3_d },
    { icon: Layers, t: tr.feat_4_t, d: tr.feat_4_d },
    { icon: MessageSquare, t: tr.feat_5_t, d: tr.feat_5_d },
    { icon: Printer, t: tr.feat_6_t, d: tr.feat_6_d },
  ];

  const steps = [
    { icon: FileText, t: tr.how_1_t, d: tr.how_1_d },
    { icon: Workflow, t: tr.how_2_t, d: tr.how_2_d },
    { icon: ShieldCheck, t: tr.how_3_t, d: tr.how_3_d },
  ];

  const demoButton = (
    <Button asChild size="sm" className="gap-2">
      <Link to="/demo">
        {tr.nav_demo} <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  type Card = { icon: typeof Zap; t: string; d: string };
  const renderCard = (
    { icon: Icon, t, d }: Card,
    opts: { tone?: "primary" | "destructive"; index?: number } = {}
  ) => {
    const tone = opts.tone ?? "primary";
    const toneCls =
      tone === "destructive"
        ? "bg-destructive/10 border-destructive/30 text-destructive"
        : "bg-primary/10 border-primary/30 text-primary";
    return (
      <div key={t} className="relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
        {opts.index !== undefined && (
          <div className="absolute top-3 right-3 text-xs font-mono text-primary bg-background border border-primary/30 px-2 py-0.5 rounded">
            0{opts.index + 1}
          </div>
        )}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-muted/30">
          <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${toneCls}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-sm font-semibold">{t}</div>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header chatButton={demoButton} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(800px 400px at 70% -10%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(600px 300px at 10% 10%, hsl(var(--primary) / 0.10), transparent 60%)",
          }}
        />
        <div className="container py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {tr.hero_badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              {tr.hero_title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              {tr.hero_sub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  {tr.hero_cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">{tr.hero_cta2}</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{tr.hero_trust}</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">{tr.problem_eyebrow}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{tr.problem_title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {problems.map((c) => renderCard(c, { tone: "destructive" }))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b border-border bg-muted/20">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">{tr.solution_eyebrow}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{tr.solution_title}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{tr.solution_sub}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((c) => renderCard(c))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">{tr.features_eyebrow}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{tr.features_title}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((c) => renderCard(c))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-border bg-muted/20">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl mb-12">
            <div className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">{tr.how_eyebrow}</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{tr.how_title}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((c, i) => renderCard(c, { index: i }))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-28">
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-10 md:p-16 text-center">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 0%, hsl(var(--primary) / 0.18), transparent 70%)",
              }}
            />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{tr.cta_title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{tr.cta_sub}</p>
            <div className="mt-8">
              <Button asChild size="lg" className="gap-2">
                <Link to="/demo">
                  {tr.cta_button} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {tr.appName} CR. {tr.footer_rights}
          </div>
          <Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {tr.footer_demo}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
