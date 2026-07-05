"use client";

import { useSupabase } from "@/lib/supabase/provider";
import { useRouter } from "next/navigation";
import { t, type Language } from "@/lib/i18n";

export default function TopBar({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}: {
  lang: Language;
  onToggleLang: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--ink)] border-b border-[var(--ink)]">
      <div className="flex justify-between items-center px-4 h-14 max-w-lg mx-auto">
        <h1 className="text-lg font-bold font-[family-name:var(--font-dm-serif)] text-white">
          {t("appName", lang)}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="px-2 py-1 text-xs rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors"
          >
            {lang === "en" ? "অ" : "En"}
          </button>
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            title={theme === "light" ? t("darkMode", lang) : t("lightMode", lang)}
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white"
          >
            {t("logout", lang)}
          </button>
        </div>
      </div>
    </header>
  );
}
