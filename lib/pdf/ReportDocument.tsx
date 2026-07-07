// lib/pdf/ReportDocument.tsx
//
// PDF layout for the "Complete Records" export, built with @react-pdf/renderer.
// English only, per requirement — no i18n branching here.
//
// Install: npm install @react-pdf/renderer

import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { ReportData } from "@/lib/reports/get-report-data";

// Design-system colors (matches the app's CSS tokens)
const COLORS = {
  ink: "#2F4A3B", // paddy-field green
  harvest: "#C99A3C", // income accent
  rust: "#A8503F", // expense / pending accent
  bgLight: "#F6F4EE",
  textMuted: "#6B7A70",
  border: "#D8D3C6",
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1A1A1A",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    borderBottom: `2 solid ${COLORS.ink}`,
    paddingBottom: 10,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  appName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
  },
  reportLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  metaText: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 20,
  },
  summaryCard: {
    width: "23%",
    padding: 8,
    backgroundColor: COLORS.bgLight,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginTop: 16,
    marginBottom: 6,
  },
  table: {
    width: "100%",
    borderTop: `1 solid ${COLORS.border}`,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${COLORS.border}`,
    paddingVertical: 5,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.bgLight,
    paddingVertical: 5,
    fontFamily: "Helvetica-Bold",
  },
  cell: {
    fontSize: 8,
    paddingHorizontal: 3,
  },
  emptyState: {
    fontSize: 9,
    color: COLORS.textMuted,
    paddingVertical: 10,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: COLORS.textMuted,
    borderTop: `1 solid ${COLORS.border}`,
    paddingTop: 6,
  },
});

// Column widths for each table (must add up to 100%)
const incomeCols = {
  date: "10%",
  description: "22%",
  customer: "16%",
  village: "12%",
  total: "12%",
  received: "12%",
  balance: "10%",
  mode: "6%",
};

const expenseCols = {
  date: "15%",
  category: "20%",
  description: "45%",
  amount: "20%",
};

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ReportDocument({ data }: { data: ReportData }) {
  const { ownerName, generatedDate, dateRange, summary, incomeEntries, expenseEntries, logoBase64 } = data;

  return (
    <Document title="Sakhir Hichap - Complete Records">
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ width: "25%" }} />
          <View style={styles.headerCenter}>
            <Image src={logoBase64} style={styles.logo} />
            <Text style={styles.appName}>Sakhir Hichap</Text>
            <Text style={styles.reportLabel}>
              {dateRange ? "Records" : "Complete Records"}
            </Text>
            {dateRange && (
              <Text style={styles.metaText}>
                {formatDate(dateRange.start)} to {formatDate(dateRange.end)}
              </Text>
            )}
          </View>
          <View style={{ width: "25%", alignItems: "flex-end" }}>
            <Text style={styles.metaText}>Owner: {ownerName}</Text>
            <Text style={styles.metaText}>Generated: {generatedDate}</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TOTAL INCOME</Text>
            <Text style={[styles.summaryValue, { color: COLORS.harvest }]}>
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TOTAL EXPENSE</Text>
            <Text style={[styles.summaryValue, { color: COLORS.rust }]}>
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>NET PROFIT</Text>
            <Text style={[styles.summaryValue, { color: COLORS.ink }]}>
              {formatCurrency(summary.netProfit)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>PENDING BALANCE</Text>
            <Text style={[styles.summaryValue, { color: COLORS.rust }]}>
              {formatCurrency(summary.pendingBalance)}
            </Text>
          </View>
        </View>

        {/* Income table */}
        <Text style={styles.sectionTitle}>Income Records ({incomeEntries.length})</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cell, { width: incomeCols.date }]}>Date</Text>
            <Text style={[styles.cell, { width: incomeCols.description }]}>Description</Text>
            <Text style={[styles.cell, { width: incomeCols.customer }]}>Customer</Text>
            <Text style={[styles.cell, { width: incomeCols.village }]}>Village</Text>
            <Text style={[styles.cell, { width: incomeCols.total }]}>Total</Text>
            <Text style={[styles.cell, { width: incomeCols.received }]}>Received</Text>
            <Text style={[styles.cell, { width: incomeCols.balance }]}>Balance</Text>
            <Text style={[styles.cell, { width: incomeCols.mode }]}>Mode</Text>
          </View>
          {incomeEntries.length === 0 && <Text style={styles.emptyState}>No income records found.</Text>}
          {incomeEntries.map((row, i) => (
            <View style={styles.tableRow} key={`income-${i}`} wrap={false}>
              <Text style={[styles.cell, { width: incomeCols.date }]}>{formatDate(row.entry_date)}</Text>
              <Text style={[styles.cell, { width: incomeCols.description }]}>{row.description}</Text>
              <Text style={[styles.cell, { width: incomeCols.customer }]}>{row.customer_name ?? "-"}</Text>
              <Text style={[styles.cell, { width: incomeCols.village }]}>{row.village ?? "-"}</Text>
              <Text style={[styles.cell, { width: incomeCols.total }]}>{formatCurrency(row.total_amount)}</Text>
              <Text style={[styles.cell, { width: incomeCols.received }]}>
                {formatCurrency(row.amount_received)}
              </Text>
              <Text style={[styles.cell, { width: incomeCols.balance, color: row.balance > 0 ? COLORS.rust : undefined }]}>
                {formatCurrency(row.balance)}
              </Text>
              <Text style={[styles.cell, { width: incomeCols.mode }]}>{row.payment_mode}</Text>
            </View>
          ))}
        </View>

        {/* Expense table */}
        <Text style={styles.sectionTitle}>Expense Records ({expenseEntries.length})</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.cell, { width: expenseCols.date }]}>Date</Text>
            <Text style={[styles.cell, { width: expenseCols.category }]}>Category</Text>
            <Text style={[styles.cell, { width: expenseCols.description }]}>Description</Text>
            <Text style={[styles.cell, { width: expenseCols.amount }]}>Amount</Text>
          </View>
          {expenseEntries.length === 0 && <Text style={styles.emptyState}>No expense records found.</Text>}
          {expenseEntries.map((row, i) => (
            <View style={styles.tableRow} key={`expense-${i}`} wrap={false}>
              <Text style={[styles.cell, { width: expenseCols.date }]}>{formatDate(row.entry_date)}</Text>
              <Text style={[styles.cell, { width: expenseCols.category }]}>
                {row.category.replace("_", " / ")}
              </Text>
              <Text style={[styles.cell, { width: expenseCols.description }]}>{row.description ?? "-"}</Text>
              <Text style={[styles.cell, { width: expenseCols.amount }]}>{formatCurrency(row.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Footer with page numbers */}
        <View style={styles.footer} fixed>
          <Text>Generated via Sakhir Hichap</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
