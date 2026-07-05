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
};

type ExpenseEntry = {
  id: string;
  entry_date: string;
  category: string;
  amount: number;
  description: string | null;
};

type DateRange = "week" | "month" | "season" | "custom";

export default function DashboardPage() {
  const [lang] = useState<Language>("en");
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const now = new Date();
      let startDate: string;

      switch (dateRange) {
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7))
            .toISOString()
            .split("T")[0];
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0];
          break;
        case "season":
          startDate = new Date(now.getFullYear(), 3, 1)
            .toISOString()
            .split("T")[0];
          break;
        default:
          startDate = "2024-01-01";
      }

      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from("income_entries")
          .select("*")
          .gte("entry_date", startDate)
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("*")
          .gte("entry_date", startDate)
          .order("entry_date", { ascending: false }),
      ]);

      setIncomeEntries(incomeRes.data || []);
      setExpenseEntries(expenseRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [session, dateRange, supabase]);

  const totalIncome = incomeEntries.reduce((sum, e) => sum + e.total_amount, 0);
  const totalReceived = incomeEntries.reduce(
    (sum, e) => sum + e.amount_received,
    0
  );
  const totalExpense = expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const pendingBalance = totalIncome - totalReceived;

  const pendingPayments = incomeEntries
    .filter((e) => e.balance > 0)
    .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());

  const recentTransactions = [
    ...incomeEntries.slice(0, 5).map((e) => ({
      ...e,
      type: "income" as const,
    })),
    ...expenseEntries.slice(0, 5).map((e) => ({
      ...e,
      type: "expense" as const,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    )
    .slice(0, 10);

  const expenseByCategory = expenseEntries.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
          {t("dashboard", lang)}
        </h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="px-3 py-1 text-sm rounded-lg border border-gray-300 outline-none"
        >
          <option value="week">{t("thisWeek", lang)}</option>
          <option value="month">{t("thisMonth", lang)}</option>
          <option value="season">{t("thisSeason", lang)}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-[var(--text-muted)]">
            {t("totalIncome", lang)}
          </p>
          <p className="text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-[var(--harvest)]">
            ₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-[var(--text-muted)]">
            {t("totalExpense", lang)}
          </p>
          <p className="text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-[var(--rust)]">
            ₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-[var(--text-muted)]">
            {t("netProfit", lang)}
          </p>
          <p
            className={`text-2xl font-bold font-[family-name:var(--font-jetbrains)] ${
              netProfit >= 0 ? "text-[var(--ink)]" : "text-[var(--rust)]"
            }`}
          >
            ₹{netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="relative bg-white p-4 rounded-xl shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--rust)]/10 rounded-bl-[40px]"></div>
          <p className="text-sm text-[var(--text-muted)]">
            {t("pendingBalance", lang)}
          </p>
          <p className="text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-[var(--rust)]">
            ₹
            {pendingBalance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {expenseByCategory && Object.keys(expenseByCategory).length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">{t("expenseBreakdown", lang)}</h3>
          <div className="space-y-2">
            {Object.entries(expenseByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center">
                <span className="text-sm">
                  {t(cat === "repair_maintenance" ? "repairMaintenance" : cat, lang)}
                </span>
                <span className="font-[family-name:var(--font-jetbrains)] text-sm">
                  ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingPayments.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">{t("pendingPayments", lang)}</h3>
          <div className="space-y-2">
            {pendingPayments.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {entry.customer_name || entry.description}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.village}
                  </p>
                </div>
                <span className="font-[family-name:var(--font-jetbrains)] text-[var(--rust)]">
                  ₹{entry.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentTransactions.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-3">
            {t("recentTransactions", lang)}
          </h3>
          <div className="space-y-2">
            {recentTransactions.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {entry.type === "income"
                      ? (entry as IncomeEntry).customer_name ||
                        entry.description
                      : entry.description || t((entry as ExpenseEntry).category, lang)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {entry.entry_date}
                  </p>
                </div>
                <span
                  className={`font-[family-name:var(--font-jetbrains)] ${
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
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
