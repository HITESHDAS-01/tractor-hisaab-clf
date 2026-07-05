"use client";

import { useLangTheme } from "@/lib/lang-theme";
import { t } from "@/lib/i18n";

export default function HelpPage() {
  const { lang } = useLangTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-dm-serif)]">
        {t("help", lang)}
      </h2>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">
          {lang === "en" ? "How to add entries" : "প্ৰবিষ্টি কেনেকৈ যোগ কৰিব"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "Tap the + button at the bottom to add income or expense. Fill in the details and tap Save."
            : "আয় বা খৰচ যোগ কৰিবলৈ তলৰ + বুটামটো টিপক। বিৱৰণসমূহ পূৰ কৰক আৰু সাঁচি থওক টিপক।"}
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">
          {lang === "en"
            ? "How balance/pending works"
            : "বাকী/পেণ্ডিং কেনেকৈ কাম কৰে"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "When you add income, enter the total amount and how much was received. The balance (pending amount) is calculated automatically. You can track who still owes you money in the Dashboard."
            : "আয় যোগ কৰোতে, মুঠ ধন আৰু পোৱা ধন লিখক। বাকী ধন স্বয়ংক্ৰিয়ভাবে গণনা হয়। ডেচব'ৰ্ডত কে এতিয়াও আপোনাক ধন দিব পৰা জানিব পাৰে।"}
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">
          {lang === "en" ? "Contact/Support" : "যোগাযোগ/সহায়"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "For support, please contact us at support@tractorhisaab.com"
            : "সহায়ৰ বাবে, অনুগ্ৰহ কৰি আমাক support@tractorhisaab.com ত যোগাযোগ কৰক"}
        </p>
      </div>
    </div>
  );
}
