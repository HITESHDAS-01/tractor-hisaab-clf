"use client";

import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function LandingPage() {
  const { lang, setLang, theme, setTheme } = useLangTheme();

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-3 max-w-4xl mx-auto bg-[var(--ink)]">
        <h1 className="text-xl font-bold font-[family-name:var(--font-dm-serif)] text-white">
          {t("appName", lang)}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "as" : "en")}
            className="px-3 py-1 text-sm rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors"
          >
            {lang === "en" ? "অসমীয়া" : "English"}
          </button>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-1.5 rounded-full border border-white/30 text-white hover:bg-white/20 transition-colors"
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
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-dm-serif)]">
            {t("landingTitle", lang)}
          </h2>
          <p className="text-lg text-muted-dark mb-8">
            {t("landingSubtitle", lang)}
          </p>
          <a
            href="/signup"
            className="inline-block px-8 py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t("getStarted", lang)}
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card p-5 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--harvest)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("totalIncome", lang)}</h3>
            <p className="text-sm text-muted-dark">
              {lang === "en"
                ? "Track all plowing income in one place"
                : "পথাৰ চহোৱাৰ সকলো আয়ৰ হিচাপ একে ঠাইতে ৰাখক"}
            </p>
          </div>

          <div className="bg-card p-5 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--rust)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("totalExpense", lang)}</h3>
            <p className="text-sm text-muted-dark">
              {lang === "en"
                ? "Log fuel, driver, and maintenance costs"
                : "ইন্ধন, চালক আৰু মেৰামতিৰ খৰচ লিখি ৰাখক"}
            </p>
          </div>

          <div className="bg-card p-5 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--ink)] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">{t("pendingBalance", lang)}</h3>
            <p className="text-sm text-muted-dark">
              {lang === "en"
                ? "Know who owes you money"
                : "কাৰ পৰা ধন পাবলৈ বাকী আছে জানক"}
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-dark mb-4">
            {lang === "en"
              ? "Already have an account?"
              : "ইতিমধ্যে একাউণ্ট আছে নেকি?"}
          </p>
          <a
            href="/login"
            className="text-[var(--ink)] font-medium hover:underline"
          >
            {t("login", lang)}
          </a>
        </div>
      </main>
    </div>
  );
}
