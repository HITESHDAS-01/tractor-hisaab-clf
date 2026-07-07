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

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {lang === "en" ? "What is Sakhir Hichap?" : "সাখিৰ হিচাপ কি?"}
          </h3>
          <p className="text-muted-dark">
            {lang === "en"
              ? "Sakhir Hichap is a simple bookkeeping app built for tractor owners and operators. It helps you keep a clear record of all income earned and expenses incurred from plowing and field work — all in one place."
              : "সাখিৰ হিচাপ হৈছে ট্ৰেক্টৰ মালিক আৰু চালকসকলৰ বাবে নিৰ্মাণ কৰা এটা সহজ হিচাপ অ্যাপ। ই পথাৰ চহোৱা আৰু মাদৰ কামৰ পৰা উপাৰ্জিত সকলো আয় আৰু খৰচৰ পৰিষ্কাৰ হিচাপ ৰাখিবলৈ সহায় কৰে।"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            {lang === "en" ? "Why was it built?" : "কিয় নিৰ্মাণ কৰা হৈছে?"}
          </h3>
          <p className="text-muted-dark">
            {lang === "en"
              ? "Managing tractor finances often means scattered notes, mental math, and forgotten entries. Sakhir Hichap replaces all of that with a clean, easy-to-use digital ledger — so you always know where your money is going and who owes you."
              : "ট্ৰেক্টৰৰ আৰ্থিক ব্যৱস্থাপনা প্ৰায়ে খোলা-পোলা নোট, মানসিক গণনা আৰু পাহৰি যোৱা হিচাপৰ সৈতে জড়িত। সাখিৰ হিচাপ ই সকলো সলনি কৰি এটা পৰিষ্কাৰ, সহজে ব্যৱহাৰ কৰিব পৰা ডিজিটেল বহী দিয়ে।"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            {lang === "en" ? "Key Features" : "মুখ্য বৈশিষ্ট্য"}
          </h3>
          <ul className="space-y-2">
            {[
              {
                num: "1.",
                color: "text-[var(--harvest)]",
                title: { en: "Income Tracking", as: "আয়ৰ হিচাপ" },
                desc: {
                  en: "Log plowing jobs with customer name, village, land area, amount, and payment status.",
                  as: "গ্ৰাহকৰ নাম, গাঁও, জমিৰ ক্ষেত্ৰফল, পৰিমাণ আৰু পেমেণ্ট স্থিতিৰ সৈতে পথাৰ কামৰ হিচাপ ৰাখক।",
                },
              },
              {
                num: "2.",
                color: "text-[var(--rust)]",
                title: { en: "Expense Tracking", as: "খৰচৰ হিচাপ" },
                desc: {
                  en: "Record costs for fuel, driver, helper, repairs, and other expenses by category.",
                  as: "ইন্ধন, চালক, সহায়ক, মেৰামতি আৰু অন্যান্য খৰচৰ খতিয়ান ৰাখক।",
                },
              },
              {
                num: "3.",
                color: "text-[var(--ink)]",
                title: { en: "Dashboard", as: "ডেশ্ববোৰ্ড" },
                desc: {
                  en: "View total income, total expenses, net profit, and pending balances at a glance with date filters.",
                  as: "মুঠ আয়, মুঠ খৰচ, প্ৰকৃত লাভ আৰু বকেয়া বাকী একে ঠাইতে দেখক।",
                },
              },
              {
                num: "4.",
                color: "text-emerald-600",
                title: { en: "Pending Payments", as: "বকেয়া ধন" },
                desc: {
                  en: "Quickly see who still owes you money.",
                  as: "কাৰ পৰা ধন পাবলৈ বাকী আছে সোনকালে চাওক।",
                },
              },
              {
                num: "5.",
                color: "text-violet-600",
                title: { en: "History & Search", as: "ইতিহাস আৰু সন্ধান" },
                desc: {
                  en: "Browse, search, and edit all past entries in one place.",
                  as: "পূৰ্বৰ সকলো হিচাপ একে ঠাইতে চাওক, সন্ধান কৰক আৰু সম্পাদনা কৰক।",
                },
              },
              {
                num: "6.",
                color: "text-amber-600",
                title: { en: "PDF Reports", as: "PDF ৰিপ'ৰ্ট" },
                desc: {
                  en: "Generate and share detailed income/expense reports.",
                  as: "বিস্তাৰিত আয়/খৰচ ৰিপ'ৰ্ট তৈয়াৰ কৰক আৰু শ্বেয়াৰ কৰক।",
                },
              },
              {
                num: "7.",
                color: "text-rose-600",
                title: { en: "Bilingual", as: "দ্বিভাষিক" },
                desc: {
                  en: "Available in English and Assamese.",
                  as: "ইংৰাজী আৰু অসমীয়াত উপলব্ধ।",
                },
              },
            ].map((item) => (
              <li key={item.num} className="flex gap-3">
                <span className={`${item.color} font-bold mt-0.5`}>{item.num}</span>
                <span>
                  <strong>{item.title[lang]}</strong> — {item.desc[lang]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            {lang === "en" ? "Who is it for?" : "কাক বাবে?"}
          </h3>
          <p className="text-muted-dark">
            {lang === "en"
              ? "Anyone who operates a tractor for plowing or field work — whether you own one tractor or a fleet. It is designed to be straightforward enough that no technical knowledge is needed."
              : "যি কোনো ব্যক্তিয়ে পথাৰ চহোৱা বা মাদৰ কামৰ বাবে ট্ৰেক্টৰ চলায় — আপোনাৰ এটা ট্ৰেক্টৰ থাকক বা বেছি। কোনো প্ৰযুক্তিগত জ্ঞানৰ প্ৰয়োজন নাথাকে ই সোঁৱৰি কৰিব পৰা পৰিকল্পনা কৰা হৈছে।"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            {lang === "en" ? "Data & Privacy" : "তথ্য আৰু গোপনীয়তা"}
          </h3>
          <p className="text-muted-dark">
            {lang === "en"
              ? "Your data is stored securely and linked to your account. Only you can see your records. Nothing is shared with third parties."
              : "আপোনাৰ তথ্য নিৰাপদভাবে সংৰক্ষণ কৰা হৈছে আৰু আপোনাৰ একাউণ্টৰ সৈতে সংযুক্ত। কেৱল আপোনেই আপোনাৰ হিচাপ চাব পাৰে। তৃতীয় পক্ষৰ সৈতে কিবো শ্বেয়াৰ কৰা নহয়।"}
          </p>
        </div>

        <div className="pt-4 border-t border-dark space-y-1">
          <p className="text-sm text-muted-dark">
            {t("version", lang)}: 1.0.0
          </p>
          <p className="text-sm text-muted-dark">
            {lang === "en" ? "Developed by" : "নিৰ্মাণ কৰিছে"}: <span className="font-semibold text-[var(--ink)]">Pranjit Das</span>
          </p>
        </div>
      </div>
    </div>
  );
}
