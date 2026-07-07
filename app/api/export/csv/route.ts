// app/api/export/csv/route.ts
//
// GET /api/export/csv?start=2026-04-01&end=2026-07-07
// Generates a single combined CSV (income + expense rows, distinguished
// by a "Type" column) for the authenticated owner, ready for Excel/Tally
// import. Optional query params: start, end (ISO date strings).

import { getReportData, type IncomeRow, type ExpenseRow } from "@/lib/reports/get-report-data";

const HEADERS = [
  "Type",
  "Date",
  "Description",
  "Category",
  "Amount",
  "Amount Received",
  "Balance",
  "Payment Mode",
  "Customer Name",
  "Village",
  "Land Area",
];

/** Wraps a value in quotes and escapes internal quotes, per CSV spec. */
function csvCell(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function incomeToRow(row: IncomeRow): string {
  return [
    csvCell("Income"),
    csvCell(row.entry_date),
    csvCell(row.description),
    csvCell(""), // category not applicable to income
    csvCell(row.total_amount.toFixed(2)),
    csvCell(row.amount_received.toFixed(2)),
    csvCell(row.balance.toFixed(2)),
    csvCell(row.payment_mode),
    csvCell(row.customer_name),
    csvCell(row.village),
    csvCell(row.land_area),
  ].join(",");
}

function expenseToRow(row: ExpenseRow): string {
  return [
    csvCell("Expense"),
    csvCell(row.entry_date),
    csvCell(row.description),
    csvCell(row.category),
    csvCell(row.amount.toFixed(2)),
    csvCell(""), // amount received n/a
    csvCell(""), // balance n/a
    csvCell(""), // payment mode n/a
    csvCell(""), // customer n/a
    csvCell(""), // village n/a
    csvCell(""), // land area n/a
  ].join(",");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    const data = await getReportData(start, end);

    const lines = [
      HEADERS.join(","),
      ...data.incomeEntries.map(incomeToRow),
      ...data.expenseEntries.map(expenseToRow),
    ];

    // Leading BOM so Excel opens UTF-8 CSVs correctly (important for any
    // Assamese-script text typed into description/customer name fields).
    const csvContent = "\uFEFF" + lines.join("\n");

    const dateStamp = new Date()
      .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/\s/g, "");

    const rangeLabel = start && end
      ? `-${start}to${end}`
      : "-complete";

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sakhir-hichap-report${rangeLabel}-${dateStamp}.csv"`,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return new Response("Unauthorized", { status: 401 });
    }
    console.error("CSV export failed:", err);
    return new Response("Failed to generate export", { status: 500 });
  }
}
