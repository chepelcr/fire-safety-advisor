import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ThemeToggle";

type Mode = "signin" | "signup" | "confirm";

export default function Login() {
  const { user, signIn, signUp, confirmSignUp, resendCode, loading: authLoading } = useAuth();
  const { tr } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user) return <Navigate to={from} replace />;

  const handleError = (e: unknown) => {
    const msg = e instanceof Error ? e.message : tr.something_wrong;
    setError(msg);
  };

  const onSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (e) { handleError(e); } finally { setSubmitting(false); }
  };

  const onSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      const { needsConfirmation } = await signUp(email.trim(), password);
      if (needsConfirmation) {
        setMode("confirm");
        setInfo(tr.code_sent);
      } else {
        await signIn(email.trim(), password);
        navigate(from, { replace: true });
      }
    } catch (e) { handleError(e); } finally { setSubmitting(false); }
  };

  const onConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await confirmSignUp(email.trim(), code.trim());
      if (password) {
        await signIn(email.trim(), password);
        navigate(from, { replace: true });
      } else {
        setMode("signin");
        setInfo(tr.email_confirmed);
      }
    } catch (e) { handleError(e); } finally { setSubmitting(false); }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    try {
      await resendCode(email.trim());
      setInfo(tr.new_code_sent);
    } catch (e) { handleError(e); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-10 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-6">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/30 glow-red">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="text-lg font-bold tracking-tight">
            FireCode <span className="text-primary">CR</span>
          </div>
        </Link>

        <Card className="p-6">
          {mode === "confirm" ? (
            <form onSubmit={onConfirm} className="space-y-4">
              <div>
                <h1 className="text-xl font-semibold">{tr.confirm_email}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {tr.confirm_email_sub} <span className="font-medium">{email}</span>.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">{tr.verification_code}</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  inputMode="numeric"
                  required
                  autoFocus
                />
              </div>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              {info && <Alert><AlertDescription>{info}</AlertDescription></Alert>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {tr.confirm}
              </Button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={onResend} className="text-primary hover:underline">
                  {tr.resend_code}
                </button>
                <button type="button" onClick={() => setMode("signin")} className="text-muted-foreground hover:underline">
                  {tr.back_to_signin}
                </button>
              </div>
            </form>
          ) : (
            <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setError(null); setInfo(null); }}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">{tr.sign_in}</TabsTrigger>
                <TabsTrigger value="signup">{tr.sign_up}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <form onSubmit={onSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-in">{tr.email}</Label>
                    <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-in">{tr.password}</Label>
                    <Input id="password-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                  {info && <Alert><AlertDescription>{info}</AlertDescription></Alert>}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {tr.sign_in}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form onSubmit={onSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-up">{tr.email}</Label>
                    <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-up">{tr.password}</Label>
                    <Input id="password-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
                    <p className="text-xs text-muted-foreground">{tr.min_chars}</p>
                  </div>
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                  {info && <Alert><AlertDescription>{info}</AlertDescription></Alert>}
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {tr.sign_up}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">{tr.back_home}</Link>
        </p>
      </div>
    </div>
  );
}
