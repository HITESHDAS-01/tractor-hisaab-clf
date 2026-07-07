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
  const { lang } = useLangTheme();
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const { supabase, session } = useSupabase();
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0] || "";

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const now = new Date();
      let startDate: string;

      switch (dateRange) {
        case "week": {
          const d = new Date();
          d.setDate(d.getDate() - 7);
          startDate = d.toISOString().split("T")[0];
          break;
        }
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
        case "custom":
          startDate = customStart || "2024-01-01";
          break;
        default:
          startDate = "2024-01-01";
      }

      const [incomeRes, expenseRes] = await Promise.all([
        supabase
          .from("income_entries")
          .select("*")
          .gte("entry_date", startDate)
          .lte("entry_date", customEnd || "2099-12-31")
          .order("entry_date", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("*")
          .gte("entry_date", startDate)
          .lte("entry_date", customEnd || "2099-12-31")
          .order("entry_date", { ascending: false }),
      ]);

      if (incomeRes.error) console.error("Income query error:", incomeRes.error);
      if (expenseRes.error) console.error("Expense query error:", expenseRes.error);

      setIncomeEntries(incomeRes.data || []);
      setExpenseEntries(expenseRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [session, dateRange, customStart, customEnd, supabase]);

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

  const allEntries = [
    ...incomeEntries.map((e) => ({ ...e, type: "income" as const })),
    ...expenseEntries.map((e) => ({ ...e, type: "expense" as const })),
  ].sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );
  const recentTransactions = allEntries.slice(0, 10);

  const expenseByCategory = expenseEntries.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const maxExpense = Math.max(...Object.values(expenseByCategory), 1);

  const dailyData: Record<string, { income: number; expense: number }> = {};
  incomeEntries.forEach((e) => {
    if (!dailyData[e.entry_date]) dailyData[e.entry_date] = { income: 0, expense: 0 };
    dailyData[e.entry_date].income += e.total_amount;
  });
  expenseEntries.forEach((e) => {
    if (!dailyData[e.entry_date]) dailyData[e.entry_date] = { income: 0, expense: 0 };
    dailyData[e.entry_date].expense += e.amount;
  });
  const trendDays = Object.keys(dailyData)
    .sort()
    .slice(-7);
  const maxTrend = Math.max(
    ...trendDays.map((d) => Math.max(dailyData[d].income, dailyData[d].expense)),
    1
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-dark">{t("loading", lang)}...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg text-[var(--text-muted)] mb-1">👋 {t("welcome", lang)}{userName ? `, ${userName}` : ""}</p>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
            {t("dashboard", lang)}
          </h2>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-input outline-none"
        >
          <option value="week">{t("thisWeek", lang)}</option>
          <option value="month">{t("thisMonth", lang)}</option>
          <option value="season">{t("thisSeason", lang)}</option>
          <option value="custom">{t("custom", lang)}</option>
        </select>
      </div>

      {dateRange === "custom" && (
        <div className="flex gap-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
          />
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
          />
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl shadow-sm overflow-hidden">
          <p className="text-sm font-medium text-amber-800 truncate">{t("totalIncome", lang)}</p>
          <p className="text-sm sm:text-lg md:text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-amber-700">
            ₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm overflow-hidden">
          <p className="text-sm font-medium text-red-800 truncate">{t("totalExpense", lang)}</p>
          <p className="text-sm sm:text-lg md:text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-red-600">
            ₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-sm overflow-hidden">
          <p className="text-sm font-medium text-emerald-800 truncate">{t("netProfit", lang)}</p>
          <p
            className={`text-sm sm:text-lg md:text-2xl font-bold font-[family-name:var(--font-jetbrains)] ${
              netProfit >= 0 ? "text-emerald-700" : "text-red-600"
            }`}
          >
            ₹{netProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Pending Balance — Torn Ledger Corner Card */}
        <div className="relative bg-orange-50 border border-orange-100 rounded-xl shadow-sm overflow-hidden">
          {/* Clean paper fold corner */}
          <div className="absolute top-0 right-0 w-0 h-0" style={{
            borderStyle: "solid",
            borderWidth: "0 40px 40px 0",
            borderColor: "transparent var(--bg-light) transparent transparent",
            filter: "drop-shadow(-2px 2px 2px rgba(0,0,0,0.1))",
          }} />
          <div className="absolute top-0 right-0 w-[40px] h-[40px] overflow-hidden">
            <div className="absolute -top-[1px] -right-[1px] w-[56px] h-[56px] origin-top-right rotate-45"
              style={{
                background: "linear-gradient(135deg, transparent 0%, transparent 45%, rgba(168,80,63,0.15) 45%, rgba(168,80,63,0.08) 100%)",
              }}
            />
            <svg className="absolute top-0 right-0" width="40" height="40" viewBox="0 0 40 40">
              <path d="M0 0 L40 0 L40 40 Z" fill="var(--bg-light)" opacity="0.95" />
              <line x1="40" y1="0" x2="0" y2="40" stroke="rgba(168,80,63,0.3)" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="p-4 min-w-0">
            <p className="text-sm font-medium text-orange-800 truncate">{t("pendingBalance", lang)}</p>
            <p className="text-sm sm:text-lg md:text-2xl font-bold font-[family-name:var(--font-jetbrains)] text-orange-600">
              ₹{pendingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Charts row - side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Breakdown Bar Chart */}
      <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">{t("expenseBreakdown", lang)}</h3>
        {Object.keys(expenseByCategory).length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">{t("noEntriesYet", lang)}</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(expenseByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">
                      {t(cat === "repair_maintenance" ? "repairMaintenance" : cat, lang)}
                    </span>
                    <span className="font-[family-name:var(--font-jetbrains)] text-sm">
                      ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--rust)] rounded-full transition-all"
                      style={{ width: `${(amount / maxExpense) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Income vs Expense Trend */}
      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-indigo-800 mb-3">{t("incomeVsExpense", lang)}</h3>
        {trendDays.length === 0 ? (
          <p className="text-sm text-indigo-500 text-center py-4">{t("noEntriesYet", lang)}</p>
        ) : (
          <>
            <div className="flex items-end gap-1 h-40">
              {trendDays.map((day) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="flex gap-0.5 items-end h-32 w-full">
                    <div
                      className="flex-1 bg-[var(--harvest)] rounded-t transition-all"
                      style={{
                        height: `${(dailyData[day].income / maxTrend) * 100}%`,
                        minHeight: dailyData[day].income > 0 ? "4px" : "0",
                      }}
                    />
                    <div
                      className="flex-1 bg-[var(--rust)] rounded-t transition-all"
                      style={{
                        height: `${(dailyData[day].expense / maxTrend) * 100}%`,
                        minHeight: dailyData[day].expense > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-dark">
                    {day.slice(5)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-[var(--harvest)] rounded-sm" />
                {t("totalIncome", lang)}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <span className="w-3 h-3 bg-[var(--rust)] rounded-sm" />
                {t("totalExpense", lang)}
              </span>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Lists row - side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending Payments */}
      <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-rose-800 mb-3">{t("pendingPayments", lang)}</h3>
        {pendingPayments.length === 0 ? (
          <p className="text-sm text-rose-500 text-center py-4">{t("noEntriesYet", lang)}</p>
        ) : (
          <div className="space-y-2">
            {pendingPayments.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center py-2 border-b border-rose-200 last:border-0"
              >
                <div>
                  <p className="font-medium text-rose-900">
                    {entry.customer_name || entry.description}
                  </p>
                  <p className="text-xs text-rose-600">{entry.village}</p>
                </div>
                <span className="font-[family-name:var(--font-jetbrains)] text-rose-700 font-semibold">
                  ₹{entry.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-violet-50 border border-violet-100 p-5 rounded-xl shadow-sm">
        <h3 className="font-semibold text-violet-800 mb-3">{t("recentTransactions", lang)}</h3>
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-violet-500 text-center py-4">{t("noEntriesYet", lang)}</p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center py-2 border-b border-violet-200 last:border-0"
              >
                <div>
                  <p className="font-medium text-violet-900">
                    {entry.type === "income"
                      ? (entry as IncomeEntry).customer_name || entry.description
                      : entry.description || t((entry as ExpenseEntry).category, lang)}
                  </p>
                  <p className="text-xs text-violet-600">{entry.entry_date}</p>
                </div>
                <span
                  className={`font-[family-name:var(--font-jetbrains)] font-semibold ${
                    entry.type === "income" ? "text-emerald-700" : "text-rose-600"
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
        )}
      </div>
      </div>
    </div>
  );
}
