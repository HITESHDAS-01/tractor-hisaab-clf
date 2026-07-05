"use client";

import { useSupabase } from "@/lib/supabase/provider";
import { useRouter } from "next/navigation";
import { t, type Language } from "@/lib/i18n";

export default function TopBar({ lang }: { lang: Language }) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-[var(--surface-dark)] dark:border-gray-700">
      <div className="flex justify-between items-center px-4 h-14 max-w-lg mx-auto">
        <h1 className="text-lg font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
          {t("appName", lang)}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--rust)]"
          >
            {t("logout", lang)}
          </button>
        </div>
      </div>
    </header>
  );
}
