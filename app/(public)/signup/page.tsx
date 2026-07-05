"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function SignupPage() {
  const { lang, setLang, theme, setTheme } = useLangTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(lang === "en" ? "Passwords do not match" : "পাছৱৰ্ড মিলা নাই");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user?.identities?.length === 0) {
      setError(lang === "en" ? "An account with this email already exists" : "এই ইমেইলৰ সৈতে ইতিমধ্যে এটা একাউণ্ট খোলা আছে");
    } else {
      setMessage(lang === "en"
        ? "Account created! Check your email to confirm, then login."
        : "একাউণ্ট খোলা হ'ল! নিশ্চিত কৰিবলৈ আপোনাৰ ইমেইল চাওক আৰু তাৰ পিছত লগ ইন কৰক।");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--ink)] via-[#3a5f4e] to-[var(--ink-dark)]">
      <div className="w-full max-w-sm">
        {/* Header with toggles */}
        <div className="flex justify-end gap-2 mb-3">
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
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          {/* Logo and Title */}
          <div className="text-center mb-5">
            <img src="/SHlogo.png" alt="Logo" className="w-16 h-16 rounded-xl object-contain mx-auto mb-3 shadow-lg" />
            <h1 className="text-2xl font-bold text-[var(--ink)] font-[family-name:var(--font-dm-serif)]">
              {t("signup", lang)}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {t("appName", lang)}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
                {t("fullName", lang)}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[var(--harvest)] focus:bg-white focus:ring-0 outline-none transition-all text-sm"
                placeholder="Ramesh Das"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
                {t("email", lang)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[var(--harvest)] focus:bg-white focus:ring-0 outline-none transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
                {t("password", lang)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[var(--harvest)] focus:bg-white focus:ring-0 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--ink)] mb-1.5">
                {t("confirmPassword", lang)}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-[var(--harvest)] focus:bg-white focus:ring-0 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded-xl space-y-1">
                <p>{message}</p>
                <Link href="/login" className="inline-block font-semibold underline hover:text-green-700">
                  {t("login", lang)} →
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[var(--ink)] to-[#3a5f4e] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--ink)]/30"
            >
              {loading ? "..." : t("signup", lang)}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              {t("login", lang)}?{" "}
              <Link href="/login" className="text-[var(--harvest)] font-semibold hover:underline">
                {t("login", lang)}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-4">
          {t("footerTagline", lang)}
        </p>
      </div>
    </div>
  );
}
