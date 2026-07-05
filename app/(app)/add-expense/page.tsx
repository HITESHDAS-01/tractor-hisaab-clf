"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { t, type Language } from "@/lib/i18n";

export default function AddExpensePage() {
  const [lang] = useState<Language>("en");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("fuel");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("expense_entries").insert({
      owner_id: session?.user.id,
      entry_date: entryDate,
      category,
      amount: parseFloat(amount),
      description: description || null,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
        {t("addExpense", lang)}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("date", lang)}
          </label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("description", lang)}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("amount", lang) || "Amount"}
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none font-[family-name:var(--font-jetbrains)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("fuel", lang)}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          >
            <option value="fuel">{t("fuel", lang)}</option>
            <option value="driver">{t("driver", lang)}</option>
            <option value="helper">{t("helper", lang)}</option>
            <option value="repair_maintenance">
              {t("repairMaintenance", lang)}
            </option>
          </select>
        </div>

        {error && <p className="text-[var(--rust)] text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : t("save", lang)}
        </button>
      </form>
    </div>
  );
}
