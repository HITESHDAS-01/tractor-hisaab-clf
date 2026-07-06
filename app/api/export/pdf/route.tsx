// app/api/export/pdf/route.ts
//
// GET /api/export/pdf
// Generates the complete-records PDF for the authenticated owner and
// streams it back with a download disposition, so a plain <a href> to
// this route triggers a native browser download — no client JS needed.

import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/pdf/ReportDocument";
import { getReportData } from "@/lib/reports/get-report-data";

export async function GET() {
  try {
    const data = await getReportData();
    const buffer = await renderToBuffer(<ReportDocument data={data} />);
    const uint8 = new Uint8Array(buffer);

    const dateStamp = new Date()
      .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/\s/g, "");

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sakhir-hichap-complete-report-${dateStamp}.pdf"`,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return new Response("Unauthorized", { status: 401 });
    }
    console.error("PDF export failed:", err);
    return new Response("Failed to generate report", { status: 500 });
  }
}
