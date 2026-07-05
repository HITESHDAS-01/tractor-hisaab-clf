"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";
import Link from "next/link";

export default function SettingsPage() {
  const { lang, setLang, theme, setTheme } = useLangTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (session) {
      setEmail(session.user.email || "");
      (async () => {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", session.user.id)
            .single();
          if (data) setFullName(data.full_name || "");
        } catch {}
      })();
    }
  }, [session, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", session?.user.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage(t("profileUpdated", lang));
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(t("passwordUpdated", lang));
      setNewPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
        {t("settings", lang)}
      </h2>

      <div className="bg-card p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="font-semibold">{t("settings", lang)}</h3>
        <button
          onClick={() => setLang(lang === "en" ? "as" : "en")}
          className="w-full flex justify-between items-center py-2"
        >
          <span>{lang === "en" ? "Language: English" : "Language: Assamese"}</span>
          <span className="text-muted-dark">→</span>
        </button>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full flex justify-between items-center py-2"
        >
          <span>{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</span>
          <span className="text-muted-dark">→</span>
        </button>
      </div>

      <form onSubmit={handleUpdateProfile} className="bg-card p-4 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">{t("fullName", lang)}</h3>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
        />
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("email", lang)}
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-input opacity-60 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : t("save", lang)}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="bg-card p-4 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">{t("changePassword", lang)}</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t("password", lang)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
        />
        <button
          type="submit"
          disabled={loading || !newPassword}
          className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : t("changePassword", lang)}
        </button>
      </form>

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-[var(--rust)] text-sm">{error}</p>}

      <div className="bg-card p-4 rounded-xl shadow-sm space-y-2">
        <Link
          href="/settings/about"
          className="block py-2 hover:underline"
        >
          {t("about", lang)}
        </Link>
        <Link
          href="/settings/help"
          className="block py-2 hover:underline"
        >
          {t("help", lang)}
        </Link>
      </div>
    </div>
  );
}
