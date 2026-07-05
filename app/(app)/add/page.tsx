"use client";

import Link from "next/link";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function AddPage() {
  const { lang } = useLangTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
        {t("addEntry", lang)}
      </h2>

      <Link
        href="/add-income"
        className="block bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--harvest)] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("addIncome", lang)}</h3>
            <p className="text-sm text-muted-dark">
              {t("plowingService", lang)}
            </p>
          </div>
          <svg className="w-5 h-5 text-muted-dark ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <Link
        href="/add-expense"
        className="block bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[var(--rust)] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("addExpense", lang)}</h3>
            <p className="text-sm text-muted-dark">
              {t("logExpenses", lang)}
            </p>
          </div>
          <svg className="w-5 h-5 text-muted-dark ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
