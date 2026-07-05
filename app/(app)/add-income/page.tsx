"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/provider";
import { t, type Language } from "@/lib/i18n";

export default function AddIncomePage() {
  const [lang] = useState<Language>("en");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [amountReceived, setAmountReceived] = useState("0");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [village, setVillage] = useState("");
  const [landArea, setLandArea] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const balance =
    (parseFloat(totalAmount) || 0) - (parseFloat(amountReceived) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("income_entries").insert({
      owner_id: session?.user.id,
      entry_date: entryDate,
      description,
      total_amount: parseFloat(totalAmount),
      amount_received: parseFloat(amountReceived),
      payment_mode: paymentMode,
      customer_name: customerName || null,
      village: village || null,
      land_area: landArea || null,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-dm-serif)] text-[var(--ink)]">
        {t("addIncome", lang)}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("date", lang)}
          </label>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("description", lang)}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("totalAmount", lang)}
          </label>
          <input
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none font-[family-name:var(--font-jetbrains)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("amountReceived", lang)}
          </label>
          <input
            type="number"
            step="0.01"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none font-[family-name:var(--font-jetbrains)]"
          />
        </div>

        <div className="p-4 bg-[var(--harvest)]/10 rounded-lg">
          <span className="text-sm text-[var(--text-muted)]">
            {t("balance", lang)}:
          </span>
          <span className="ml-2 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-[var(--harvest)]">
            ₹{balance.toFixed(2)}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("paymentMode", lang)}
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          >
            <option value="cash">{t("cash", lang)}</option>
            <option value="upi">{t("upi", lang)}</option>
            <option value="bank_transfer">{t("bankTransfer", lang)}</option>
            <option value="other">{t("other", lang)}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("customerName", lang)}
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("village", lang)}
          </label>
          <input
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("landArea", lang)}
          </label>
          <input
            type="text"
            value={landArea}
            onChange={(e) => setLandArea(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--ink)] focus:border-transparent outline-none"
          />
        </div>

        {error && <p className="text-[var(--rust)] text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[var(--ink)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "..." : t("save", lang)}
        </button>
      </form>
    </div>
  );
}
