"use client";

import { useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function ResetPasswordPage() {
  const { lang, setLang } = useLangTheme();
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLang(lang === "en" ? "as" : "en")}
            className="px-3 py-1 text-sm rounded-full border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors"
          >
            {lang === "en" ? "অসমীয়া" : "English"}
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 font-[family-name:var(--font-dm-serif)]">
          {t("resetPassword", lang)}
        </h1>
        <p className="text-center text-muted-dark mb-6">
          {t("appName", lang)}
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("email", lang)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
            />
          </div>

          {error && (
            <p className="text-[var(--rust)] text-sm">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : t("resetPassword", lang)}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-dark hover:underline"
          >
            ← {t("login", lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
