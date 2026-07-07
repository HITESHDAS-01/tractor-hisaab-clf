// app/api/export/pdf/route.ts
//
// GET /api/export/pdf?start=2026-04-01&end=2026-07-07
// Generates the records PDF for the authenticated owner.
// Optional query params: start, end (ISO date strings).
// If provided, only records within that range are included.

import { renderToBuffer } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/pdf/ReportDocument";
import { getReportData } from "@/lib/reports/get-report-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    const data = await getReportData(start, end);
    const buffer = await renderToBuffer(<ReportDocument data={data} />);
    const uint8 = new Uint8Array(buffer);

    const dateStamp = new Date()
      .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/\s/g, "");

    const rangeLabel = start && end
      ? `-${start}to${end}`
      : "-complete";

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sakhir-hichap-report${rangeLabel}-${dateStamp}.pdf"`,
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
