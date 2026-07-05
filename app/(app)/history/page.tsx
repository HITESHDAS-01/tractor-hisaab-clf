"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { t, type Language } from "@/lib/i18n";
import Link from "next/link";

type IncomeEntry = {
  id: string;
  entry_date: string;
  description: string;
  total_amount: number;
  amount_received: number;
  balance: number;
  payment_mode: string;
  customer_name: string | null;
  village: string | null;
  land_area: string | null;
  type: "income";
};

type ExpenseEntry = {
  id: string;
  entry_date: string;
  category: string;
  amount: number;
  description: string | null;
  type: "expense";
};

type Entry = IncomeEntry | ExpenseEntry;

export default function HistoryPage() {
  const [lang] = useState<Language>("en");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (!session) return;

    const fetchEntries = async () => {
      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from("income_entries")
          .select("*")
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("*")
          .order("entry_date", { ascending: false }),
      ]);

      const allEntries: Entry[] = [
        ...(incomeRes.data || []).map((e) => ({ ...e, type: "income" as const })),
        ...(expenseRes.data || []).map((e) => ({ ...e, type: "expense" as const })),
      ].sort(
        (a, b) =>
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
      );

      setEntries(allEntries);
      setLoading(false);
    };

    fetchEntries();
  }, [session, supabase]);

  const filteredEntries = entries.filter((entry) => {
    if (filter !== "all" && entry.type !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        entry.description?.toLowerCase().includes(searchLower) ||
        entry.entry_date.includes(searchLower) ||
        (entry.type === "income" &&
          (entry.customer_name?.toLowerCase().includes(searchLower) ||
            entry.village?.toLowerCase().includes(searchLower))) ||
        (entry.type === "expense" &&
          entry.category.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    return true;
  });

  const handleDelete = async (entry: Entry) => {
    if (!confirm("Delete this entry?")) return;

    const table =
      entry.type === "income" ? "income_entries" : "expense_entries";
    const { error } = await supabase.from(table).delete().eq("id", entry.id);

    if (!error) {
      setEntries(entries.filter((e) => e.id !== entry.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
        {t("history", lang)}
      </h2>

      <div className="flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none"
        >
          <option value="all">All</option>
          <option value="income">{t("addIncome", lang)}</option>
          <option value="expense">{t("addExpense", lang)}</option>
        </select>

        <input
          type="text"
          placeholder={t("description", lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 outline-none"
        />
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-muted)]">
          {t("noEntriesYet", lang)}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {entry.type === "income"
                      ? (entry as IncomeEntry).customer_name ||
                        entry.description
                      : entry.description ||
                        t((entry as ExpenseEntry).category, lang)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.entry_date}
                  </p>
                  {entry.type === "income" && (entry as IncomeEntry).village && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {(entry as IncomeEntry).village}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className={`font-[family-name:var(--font-jetbrains)] font-bold ${
                      entry.type === "income"
                        ? "text-[var(--harvest)]"
                        : "text-[var(--rust)]"
                    }`}
                  >
                    {entry.type === "income" ? "+" : "-"}₹
                    {(
                      entry.type === "income"
                        ? (entry as IncomeEntry).total_amount
                        : (entry as ExpenseEntry).amount
                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  {entry.type === "income" &&
                    (entry as IncomeEntry).balance > 0 && (
                      <p className="text-xs text-[var(--rust)]">
                        {t("balance", lang)}: ₹
                        {(entry as IncomeEntry).balance.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditingEntry(entry)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)]"
                >
                  {t("edit", lang)}
                </button>
                <button
                  onClick={() => handleDelete(entry)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--rust)]"
                >
                  {t("delete", lang)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
