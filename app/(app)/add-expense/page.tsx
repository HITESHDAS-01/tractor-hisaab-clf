"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

type ExpenseRow = {
  id: number;
  category: string;
  amount: string;
};

let nextId = 2;

export default function AddExpensePage() {
  const { lang } = useLangTheme();
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<ExpenseRow[]>([{ id: 1, category: "", amount: "" }]);
  const [errors, setErrors] = useState<Record<number, { category?: boolean; amount?: boolean }>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const addRow = () => {
    setRows((prev) => [...prev, { id: nextId++, category: "", amount: "" }]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)));
  };

  const updateRow = (id: number, field: "category" | "amount", value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[id]) {
        const rowErrors = { ...next[id] };
        delete rowErrors[field];
        if (Object.keys(rowErrors).length === 0) delete next[id];
        else next[id] = rowErrors;
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors: Record<number, { category?: boolean; amount?: boolean }> = {};
    let hasError = false;

    for (const row of rows) {
      const rowErr: { category?: boolean; amount?: boolean } = {};
      if (!row.category) {
        rowErr.category = true;
        hasError = true;
      }
      if (!row.amount || parseFloat(row.amount) <= 0) {
        rowErr.amount = true;
        hasError = true;
      }
      if (Object.keys(rowErr).length > 0) newErrors[row.id] = rowErr;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const insertRows = rows.map((row) => ({
      owner_id: session?.user.id,
      entry_date: entryDate,
      category: row.category,
      amount: parseFloat(row.amount),
      description: description || null,
    }));

    const { error } = await supabase.from("expense_entries").insert(insertRows);

    if (error) {
      setSubmitError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-dm-serif)]">
        {t("addExpense", lang)}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Shared date + description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("date", lang)}
          </label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {rows.map((row) => {
            const rowErrors = errors[row.id];
            return (
              <div key={row.id} className="flex gap-2 items-start">
                <div className="flex-1 flex gap-2">
                  <select
                    value={row.category}
                    onChange={(e) => updateRow(row.id, "category", e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-lg border bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none ${
                      rowErrors?.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("category", lang)}</option>
                    <option value="fuel">{t("fuel", lang)}</option>
                    <option value="driver">{t("driver", lang)}</option>
                    <option value="helper">{t("helper", lang)}</option>
                    <option value="repair_maintenance">
                      {t("repairMaintenance", lang)}
                    </option>
                    <option value="others">{t("others", lang)}</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="₹"
                    value={row.amount}
                    onChange={(e) => updateRow(row.id, "amount", e.target.value)}
                    className={`w-28 px-4 py-3 rounded-lg border bg-input focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none font-[family-name:var(--font-jetbrains)] ${
                      rowErrors?.amount ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  className="mt-1 p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-muted-dark hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors"
        >
          + {t("addAnother", lang)}
        </button>

        {submitError && <p className="text-[var(--rust)] text-sm">{submitError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : t("saveAll", lang)}
        </button>
      </form>
    </div>
  );
}
