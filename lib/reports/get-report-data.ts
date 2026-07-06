// lib/reports/get-report-data.ts
//
// Shared data-fetching used by both the PDF and CSV export routes.
// Fetches ALL income_entries and expense_entries for the currently
// authenticated owner (no date filtering — full history export),
// plus their profile, and computes the summary totals.
//
// Adjust the import path below if your Supabase server client
// lives somewhere other than '@/lib/supabase/server'.

import { createClient } from "@/lib/supabase/server";

export interface IncomeRow {
  entry_date: string;
  description: string;
  total_amount: number;
  amount_received: number;
  balance: number;
  payment_mode: string;
  customer_name: string | null;
  village: string | null;
  land_area: string | null;
}

export interface ExpenseRow {
  entry_date: string;
  category: string;
  amount: number;
  description: string | null;
}

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingBalance: number;
}

export interface ReportData {
  ownerName: string;
  generatedDate: string;
  summary: ReportSummary;
  incomeEntries: IncomeRow[];
  expenseEntries: ExpenseRow[];
}

/**
 * Throws if there is no authenticated user — the calling route handler
 * is responsible for catching this and returning a 401.
 */
export async function getReportData(): Promise<ReportData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("UNAUTHENTICATED");
  }

  const [{ data: profile }, { data: incomeData, error: incomeError }, { data: expenseData, error: expenseError }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      supabase
        .from("income_entries")
        .select(
          "entry_date, description, total_amount, amount_received, balance, payment_mode, customer_name, village, land_area"
        )
        .eq("owner_id", user.id)
        .order("entry_date", { ascending: true }),
      supabase
        .from("expense_entries")
        .select("entry_date, category, amount, description")
        .eq("owner_id", user.id)
        .order("entry_date", { ascending: true }),
    ]);

  if (incomeError) throw incomeError;
  if (expenseError) throw expenseError;

  const incomeEntries: IncomeRow[] = incomeData ?? [];
  const expenseEntries: ExpenseRow[] = expenseData ?? [];

  const totalIncome = incomeEntries.reduce((sum, row) => sum + Number(row.total_amount), 0);
  const totalExpense = expenseEntries.reduce((sum, row) => sum + Number(row.amount), 0);
  const pendingBalance = incomeEntries.reduce((sum, row) => sum + Number(row.balance), 0);

  return {
    ownerName: profile?.full_name ?? "Tractor Owner",
    generatedDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    summary: {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingBalance,
    },
    incomeEntries,
    expenseEntries,
  };
}
