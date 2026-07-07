// lib/reports/get-report-data.ts
//
// Shared data-fetching used by both the PDF and CSV export routes.
// Fetches income_entries and expense_entries for the currently
// authenticated owner, with optional date range filtering.
// If startDate/endDate are provided, only records within that range
// are included. Otherwise, all records are exported.

import { createClient } from "@/lib/supabase/server";
import { readFileSync } from "fs";
import { join } from "path";

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
  dateRange: { start: string; end: string } | null;
  summary: ReportSummary;
  incomeEntries: IncomeRow[];
  expenseEntries: ExpenseRow[];
  logoBase64: string;
}

/**
 * Throws if there is no authenticated user — the calling route handler
 * is responsible for catching this and returning a 401.
 */
export async function getReportData(startDate?: string, endDate?: string): Promise<ReportData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("UNAUTHENTICATED");
  }

  let incomeQuery = supabase
    .from("income_entries")
    .select(
      "entry_date, description, total_amount, amount_received, balance, payment_mode, customer_name, village, land_area"
    )
    .eq("owner_id", user.id)
    .order("entry_date", { ascending: true });

  let expenseQuery = supabase
    .from("expense_entries")
    .select("entry_date, category, amount, description")
    .eq("owner_id", user.id)
    .order("entry_date", { ascending: true });

  if (startDate) {
    incomeQuery = incomeQuery.gte("entry_date", startDate);
    expenseQuery = expenseQuery.gte("entry_date", startDate);
  }
  if (endDate) {
    incomeQuery = incomeQuery.lte("entry_date", endDate);
    expenseQuery = expenseQuery.lte("entry_date", endDate);
  }

  const [{ data: profile }, { data: incomeData, error: incomeError }, { data: expenseData, error: expenseError }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
      incomeQuery,
      expenseQuery,
    ]);

  if (incomeError) throw incomeError;
  if (expenseError) throw expenseError;

  const incomeEntries: IncomeRow[] = incomeData ?? [];
  const expenseEntries: ExpenseRow[] = expenseData ?? [];

  const totalIncome = incomeEntries.reduce((sum, row) => sum + Number(row.total_amount), 0);
  const totalExpense = expenseEntries.reduce((sum, row) => sum + Number(row.amount), 0);
  const pendingBalance = incomeEntries.reduce((sum, row) => sum + Number(row.balance), 0);

  const logoBuffer = readFileSync(join(process.cwd(), "public", "SHlogo.png"));
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const dateRange = startDate && endDate ? { start: startDate, end: endDate } : null;

  return {
    ownerName: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Tractor Owner",
    generatedDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    dateRange,
    summary: {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingBalance,
    },
    incomeEntries,
    expenseEntries,
    logoBase64,
  };
}
