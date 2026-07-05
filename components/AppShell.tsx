"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { t, type Language } from "@/lib/i18n";
import BottomNav from "@/components/ui/BottomNav";
import TopBar from "@/components/ui/TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { supabase, session } = useSupabase();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      supabase
        .from("profiles")
        .select("preferred_language, theme_preference")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setLang(data.preferred_language as Language);
            setTheme(data.theme_preference as "light" | "dark");
          }
        });
    }
  }, [session, supabase]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (session) {
      await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("id", session.user.id);
    }
  };

  const toggleLang = async () => {
    const newLang = lang === "en" ? "as" : "en";
    setLang(newLang);
    if (session) {
      await supabase
        .from("profiles")
        .update({ preferred_language: newLang })
        .eq("id", session.user.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar lang={lang} />
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full px-4 py-4">
        {children}
      </main>
      <BottomNav lang={lang} />
    </div>
  );
}
