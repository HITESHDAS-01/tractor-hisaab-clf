"use client";

import { useState } from "react";
import { t, type Language } from "@/lib/i18n";

export default function AboutPage() {
  const [lang] = useState<Language>("en");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
        {t("about", lang)}
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">{t("appName", lang)}</h3>
        <p className="text-[var(--text-muted)]">
          {lang === "en"
            ? "A digital ledger for tractor owners to track income from field plowing services and expenses, replacing the traditional paper notebook."
            : "হল চাষৰ সেৱাৰ পৰা আয় আৰু খৰচ ট্ৰেক কৰিবলৈ ট্ৰেক্টৰ মালিকৰ বাবে এটা ডিজিটেল খাতা, পৰম্পৰাগত কাগজৰ খাতাৰ সলনি।"}
        </p>
        <div className="pt-4 border-t">
          <p className="text-sm text-[var(--text-muted)]">
            {t("version", lang)}: 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
