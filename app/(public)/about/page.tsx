"use client";

import Link from "next/link";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function AboutPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <img
              src="/SHlogo.png"
              alt="Sakhir Hichap Logo"
              className="w-20 h-20 rounded-2xl object-contain mx-auto mb-4 shadow-lg"
            />
            <h2 className="text-3xl font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
              Sakhir Hichap
            </h2>
            <p className="text-[var(--text-muted)] mt-1">
              Tractor Income & Expense Tracker
            </p>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">What is Sakhir Hichap?</h3>
              <p>
                Sakhir Hichap is a simple bookkeeping app built for tractor owners and operators.
                It helps you keep a clear record of all income earned and expenses incurred
                from plowing and field work — all in one place.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Why was it built?</h3>
              <p>
                Managing tractor finances often means scattered notes, mental math, and
                forgotten entries. Sakhir Hichap replaces all of that with a clean, easy-to-use
                digital ledger — so you always know where your money is going and who owes you.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Key Features</h3>
              <ul className="space-y-2 mt-2">
                <li className="flex gap-3">
                  <span className="text-[var(--harvest)] font-bold mt-0.5">1.</span>
                  <span><strong>Income Tracking</strong> — Log plowing jobs with customer name, village, land area, amount, and payment status.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--rust)] font-bold mt-0.5">2.</span>
                  <span><strong>Expense Tracking</strong> — Record costs for fuel, driver, helper, repairs, and other expenses by category.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[var(--ink)] font-bold mt-0.5">3.</span>
                  <span><strong>Dashboard</strong> — View total income, total expenses, net profit, and pending balances at a glance with date filters.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-600 font-bold mt-0.5">4.</span>
                  <span><strong>Pending Payments</strong> — Quickly see who still owes you money.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet-600 font-bold mt-0.5">5.</span>
                  <span><strong>History & Search</strong> — Browse, search, and edit all past entries in one place.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600 font-bold mt-0.5">6.</span>
                  <span><strong>PDF Reports</strong> — Generate and share detailed income/expense reports.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-rose-600 font-bold mt-0.5">7.</span>
                  <span><strong>Bilingual</strong> — Available in English and Assamese.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Who is it for?</h3>
              <p>
                Anyone who operates a tractor for plowing or field work — whether you own one
                tractor or a fleet. It is designed to be straightforward enough that no
                technical knowledge is needed.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">Data & Privacy</h3>
              <p>
                Your data is stored securely and linked to your account. Only you can see
                your records. Nothing is shared with third parties.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-[var(--ink)] text-white rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-[var(--harvest)] text-white rounded-lg font-medium text-center hover:opacity-90 transition-opacity"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
