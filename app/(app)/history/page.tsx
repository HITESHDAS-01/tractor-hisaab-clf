"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

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
  const { lang } = useLangTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editForm, setEditForm] = useState<Partial<Entry>>({});
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

      if (incomeRes.error) console.error("Income query error:", incomeRes.error);
      if (expenseRes.error) console.error("Expense query error:", expenseRes.error);

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
    if (startDate && entry.entry_date < startDate) return false;
    if (endDate && entry.entry_date > endDate) return false;
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
    const msg = lang === "en" ? "Delete this entry?" : "এই প্ৰবিষ্টি মচি পেলাবলৈ নেকি?";
    if (!confirm(msg)) return;

    const table =
      entry.type === "income" ? "income_entries" : "expense_entries";
    const { error } = await supabase.from(table).delete().eq("id", entry.id);

    if (error) {
      const errMsg = lang === "en" ? "Failed to delete entry" : "প্ৰবিষ্টি মচিবলৈ ব্যৰ্থ";
      alert(errMsg);
    } else {
      setEntries(entries.filter((e) => e.id !== entry.id));
    }
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setEditForm({ ...entry });
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    const table =
      editingEntry.type === "income" ? "income_entries" : "expense_entries";
    const updateData =
      editingEntry.type === "income"
        ? {
            entry_date: editForm.entry_date,
            description: editForm.description,
            total_amount: (editForm as IncomeEntry).total_amount,
            amount_received: (editForm as IncomeEntry).amount_received,
            customer_name: (editForm as IncomeEntry).customer_name,
            village: (editForm as IncomeEntry).village,
          }
        : {
            entry_date: editForm.entry_date,
            description: editForm.description,
            amount: (editForm as ExpenseEntry).amount,
            category: (editForm as ExpenseEntry).category,
          };

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", editingEntry.id);

    if (error) {
      const errMsg = lang === "en" ? "Failed to save changes" : "পৰিবৰ্তন সংৰক্ষণ কৰিবলৈ ব্যৰ্থ";
      alert(errMsg);
    } else {
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id
            ? ({ ...e, ...updateData } as Entry)
            : e
        )
      );
      setEditingEntry(null);
      setEditForm({});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-dark">{t("loading", lang)}...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
        {t("history", lang)}
      </h2>

      <div className="flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
        >
          <option value="all">{t("all", lang)}</option>
          <option value="income">{t("addIncome", lang)}</option>
          <option value="expense">{t("addExpense", lang)}</option>
        </select>

        <input
          type="text"
          placeholder={t("description", lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder={t("startDate", lang)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder={t("endDate", lang)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
        />
      </div>

      {editingEntry && (
        <div className="bg-card p-4 rounded-xl shadow-sm space-y-3">
          <h3 className="font-semibold">{t("edit", lang)}</h3>
          <input
            type="date"
            value={editForm.entry_date || ""}
            onChange={(e) => setEditForm({ ...editForm, entry_date: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input outline-none"
          />
          <input
            type="text"
            value={editForm.description || ""}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            placeholder={t("description", lang)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input outline-none"
          />
          <input
            type="number"
            step="0.01"
            value={editingEntry.type === "income" ? (editForm as IncomeEntry).total_amount || "" : (editForm as ExpenseEntry).amount || ""}
            onChange={(e) =>
              editingEntry.type === "income"
                ? setEditForm({ ...editForm, total_amount: parseFloat(e.target.value) } as any)
                : setEditForm({ ...editForm, amount: parseFloat(e.target.value) } as any)
            }
            placeholder={t("amount", lang)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input outline-none font-[family-name:var(--font-jetbrains)]"
          />
          {editingEntry.type === "income" && (
            <>
              <input
                type="text"
                value={(editForm as IncomeEntry).customer_name || ""}
                onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value } as any)}
                placeholder={t("customerName", lang)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input outline-none"
              />
              <input
                type="text"
                value={(editForm as IncomeEntry).village || ""}
                onChange={(e) => setEditForm({ ...editForm, village: e.target.value } as any)}
                placeholder={t("village", lang)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-input outline-none"
              />
            </>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-2 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90"
            >
              {t("save", lang)}
            </button>
            <button
              onClick={() => { setEditingEntry(null); setEditForm({}); }}
              className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              {t("cancel", lang)}
            </button>
          </div>
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 text-muted-dark">
          {t("noEntriesYet", lang)}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card p-4 rounded-xl shadow-sm"
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
                  <p className="text-xs text-muted-dark">
                    {entry.entry_date}
                  </p>
                  {entry.type === "income" && (entry as IncomeEntry).village && (
                    <p className="text-xs text-muted-dark">
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
                  onClick={() => handleEdit(entry)}
                  className="text-xs text-muted-dark hover:underline"
                >
                  {t("edit", lang)}
                </button>
                <button
                  onClick={() => handleDelete(entry)}
                  className="text-xs text-muted-dark hover:text-[var(--rust)] hover:underline"
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
