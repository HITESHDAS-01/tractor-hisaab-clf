"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const { lang, setLang, theme, setTheme } = useLangTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the reset link");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--ink)] via-[#3a5f4e] to-[var(--ink-dark)]">
      <div className="w-full max-w-md">
        {/* Header with toggles */}
        <div className="flex justify-end gap-2 mb-4">
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

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--ink)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-[var(--harvest)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--ink)] font-[family-name:var(--font-dm-serif)]">
              {t("resetPassword", lang)}
            </h1>
            <p className="text-[var(--text-muted)] mt-1">
              {t("appName", lang)}
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-2">
                {t("email", lang)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[var(--harvest)] focus:bg-white focus:ring-0 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[var(--ink)] to-[#3a5f4e] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--ink)]/30"
            >
              {loading ? "..." : t("resetPassword", lang)}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--ink)] transition-colors"
            >
              ← {t("login", lang)}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          Track your tractor earnings digitally
        </p>
      </div>
    </div>
  );
}
