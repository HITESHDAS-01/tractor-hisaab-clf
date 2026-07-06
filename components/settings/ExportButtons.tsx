// components/settings/ExportButtons.tsx
//
// Drop this into the Settings page. Plain <a> tags pointing at the API
// routes — the browser handles the download natively via the
// Content-Disposition header, no client-side JS/fetch/blob handling
// needed. Works reliably on mobile browsers, including slower ones.
//
// This component's own labels are left in English intentionally, per
// requirement that exported reports and their trigger UI stay English-only
// even when the rest of the app is in Assamese mode. If you'd rather this
// button follow the app language toggle instead, swap the hardcoded
// strings below for your t() i18n helper.

export function ExportButtons() {
  return (
    <div className="export-buttons" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <a
        href="/api/export/pdf"
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
        href="/api/export/csv"
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
