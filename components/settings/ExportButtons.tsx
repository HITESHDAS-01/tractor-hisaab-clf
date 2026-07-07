// components/settings/ExportButtons.tsx
//
// Drop this into the Settings page. Plain <a> tags pointing at the API
// routes — the browser handles the download natively via the
// Content-Disposition header, no client-side JS/fetch/blob handling
// needed. Works reliably on mobile browsers, including slower ones.
//
// This component's own labels are left in English intentionally, per
// requirement that exported reports and their trigger UI stay English-only
// even when the rest of the app is in Assamese mode.

"use client";

import { useState } from "react";

export function ExportButtons() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const buildUrl = (base: string) => {
    if (startDate && endDate) {
      return `${base}?start=${startDate}&end=${endDate}`;
    }
    return base;
  };

  return (
    <div className="export-buttons" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1 text-muted-dark">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1 text-muted-dark">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-input outline-none"
          />
        </div>
      </div>
      <p className="text-xs text-muted-dark">
        {startDate && endDate
          ? `Downloading records from ${startDate} to ${endDate}`
          : "Leave empty to download all records"}
      </p>
      <a
        href={buildUrl("/api/export/pdf")}
        download
        className="export-button export-button--pdf"
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px 16px",
          borderRadius: "8px",
          fontWeight: 600,
          backgroundColor: "var(--ink, #2F4A3B)",
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        Download PDF Report
      </a>
      <a
        href={buildUrl("/api/export/csv")}
        download
        className="export-button export-button--csv"
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px 16px",
          borderRadius: "8px",
          fontWeight: 600,
          backgroundColor: "transparent",
          color: "var(--ink, #2F4A3B)",
          border: "1px solid var(--ink, #2F4A3B)",
          textDecoration: "none",
        }}
      >
        Download CSV (for Excel/Tally)
      </a>
    </div>
  );
}
