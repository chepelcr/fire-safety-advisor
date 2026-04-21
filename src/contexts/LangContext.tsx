import { createContext, useContext, useState, ReactNode } from "react";
import { t, type Lang, type Dict } from "@/lib/i18n";

interface Ctx { lang: Lang; setLang: (l: Lang) => void; tr: Dict; }
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  return <LangCtx.Provider value={{ lang, setLang, tr: t[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside provider");
  return c;
}
