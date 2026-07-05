"use client";

import { useLangTheme } from "@/lib/lang-theme";
import BottomNav from "@/components/ui/BottomNav";
import SidebarNav from "@/components/ui/SidebarNav";
import TopBar from "@/components/ui/TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { lang, setLang, theme, setTheme } = useLangTheme();

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <SidebarNav />

      {/* Mobile top bar */}
      <div className="md:hidden">
        <TopBar
          lang={lang}
          onToggleLang={() => setLang(lang === "en" ? "as" : "en")}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>

      {/* Desktop top bar */}
      <div className="hidden md:block md:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 dark:bg-[var(--surface-dark)] dark:border-gray-700">
          <div className="flex justify-end items-center px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(lang === "en" ? "as" : "en")}
                className="px-4 py-1.5 text-sm font-semibold rounded-full border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"
              >
                {lang === "en" ? "অসমীয়া" : "English"}
              </button>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 rounded-full border-2 border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"
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
            </div>
          </div>
        </header>
      </div>

      {/* Main content */}
      <main className="md:ml-64 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

function t(key: string, lang: string) {
  // Inline minimal translation for desktop header
  const translations: Record<string, Record<string, string>> = {
    en: { darkMode: "Dark Mode", lightMode: "Light Mode" },
    as: { darkMode: "আন্ধাৰ ম'ড", lightMode: "পোহৰ ম'ড" },
  };
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
