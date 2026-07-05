"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import type { Language } from "@/lib/i18n";

type LangThemeContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
};

const Context = createContext<LangThemeContextType | null>(null);

export function LangThemeProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (session) {
      (async () => {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("preferred_language, theme_preference")
            .eq("id", session.user.id)
            .single();
          if (data) {
            setLangState(data.preferred_language as Language);
            setThemeState(data.theme_preference as "light" | "dark");
          }
        } catch {}
      })();
    }
  }, [session, supabase]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setLang = async (l: Language) => {
    setLangState(l);
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .update({ preferred_language: l })
        .eq("id", session.user.id);
      if (error) console.error("Failed to save language:", error);
    }
  };

  const setTheme = async (t: "light" | "dark") => {
    setThemeState(t);
    if (session) {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: t })
        .eq("id", session.user.id);
      if (error) console.error("Failed to save theme:", error);
    }
  };

  return (
    <Context.Provider value={{ lang, setLang, theme, setTheme }}>
      {children}
    </Context.Provider>
  );
}

export function useLangTheme() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useLangTheme must be inside LangThemeProvider");
  return ctx;
}
