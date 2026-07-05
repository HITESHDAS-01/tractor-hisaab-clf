"use client";

import { useState } from "react";
import Link from "next/link";
import { t, type Language } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<Language>("en");

  return (
    <div className="min-h-screen bg-[var(--bg-light)]">
      <header className="flex justify-between items-center p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
          {t("appName", lang)}
        </h1>
        <button
          onClick={() => setLang(lang === "en" ? "as" : "en")}
          className="px-3 py-1 text-sm rounded-full border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"
        >
          {lang === "en" ? "অসমীয়া" : "English"}
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
            {t("landingTitle", lang)}
          </h2>
          <p className="text-lg text-[var(--text-muted)] mb-8">
            {t("landingSubtitle", lang)}
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t("getStarted", lang)}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--harvest)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-semibold mb-2">{t("totalIncome", lang)}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {lang === "en"
                ? "Track all plowing income in one place"
                : "সকলো হল চাষৰ আয় এটাত ট্ৰেক কৰক"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--rust)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📉</span>
            </div>
            <h3 className="font-semibold mb-2">{t("totalExpense", lang)}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {lang === "en"
                ? "Log fuel, driver, and maintenance costs"
                : "জ্বালানী, চালক আৰু মেৰামতি খৰচ লগ কৰক"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
            <div className="w-12 h-12 bg-[var(--ink)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold mb-2">{t("pendingBalance", lang)}</h3>
            <p className="text-sm text-[var(--text-muted)]">
              {lang === "en"
                ? "Know who owes you money"
                : "কোনে আপোনাক ধন দিব পৰা জানক"}
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[var(--text-muted)] mb-4">
            {lang === "en"
              ? "Already have an account?"
              : "ইতিমধ্যে এটা একাউণ্ট আছে?"}
          </p>
          <Link
            href="/login"
            className="text-[var(--ink)] font-medium hover:underline"
          >
            {t("login", lang)}
          </Link>
        </div>
      </main>
    </div>
  );
}
