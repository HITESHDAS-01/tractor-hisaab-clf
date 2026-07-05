"use client";

import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function AboutPage() {
  const { lang } = useLangTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
        {t("about", lang)}
      </h2>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">{t("appName", lang)}</h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "A digital ledger for tractor owners to track income from field plowing services and expenses, replacing the traditional paper notebook."
            : "হল চাষৰ সেৱাৰ পৰা আয় আৰু খৰচ ট্ৰেক কৰিবলৈ ট্ৰেক্টৰ মালিকৰ বাবে এটা ডিজিটেল খাতা, পৰম্পৰাগত কাগজৰ খাতাৰ সলনি।"}
        </p>
        <div className="pt-4 border-t border-dark space-y-2">
          <p className="text-sm text-muted-dark">
            {t("version", lang)}: 1.0.0
          </p>
          <p className="text-sm text-muted-dark">
            {lang === "en" ? "Developed by" : "উন্নয়নকৰ্তা"}: <span className="font-semibold text-[var(--ink)]">Pranjit Das</span>
          </p>
        </div>
      </div>
    </div>
  );
}
