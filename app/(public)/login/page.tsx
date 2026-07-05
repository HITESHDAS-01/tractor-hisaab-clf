"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  const { lang, setLang } = useLangTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
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
          {t("login", lang)}
        </h1>
        <p className="text-center text-muted-dark mb-6">
          {t("appName", lang)}
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("password", lang)}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
            />
          </div>

          {error && (
            <p className="text-[var(--rust)] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : t("login", lang)}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <Link
            href="/reset-password"
            className="text-sm text-muted-dark hover:underline"
          >
            {t("forgotPassword", lang)}
          </Link>
          <p className="text-sm text-muted-dark">
            {t("signup", lang)}?{" "}
            <Link href="/signup" className="text-[var(--ink)] font-medium hover:underline">
              {t("getStarted", lang)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
