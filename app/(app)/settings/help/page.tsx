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
          {lang === "en" ? "How to add entries" : "হিচাপ কেনেকৈ যোগ কৰিব"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "Tap the + button at the bottom to add income or expense. Fill in the details and tap Save."
            : "আয় বা ব্যয় যোগ কৰিবলৈ তলত থকা + বুটামটো টিপক। সবিশেষ পূৰণ কৰি ছেভ কৰক।"}
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">
          {lang === "en"
            ? "How balance/pending works"
            : "পাবলগীয়া বাকী ধনৰ হিচাপ কেনেকৈ হয়"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "When you add income, enter the total amount and how much was received. The balance (pending amount) is calculated automatically. You can track who still owes you money in the Dashboard."
            : "আয় যোগ কৰোঁতে মুঠ পৰিমাণ আৰু কিমান ধন পালে সেয়া লিখক। বাকী থকা ধন স্বয়ংক্ৰিয়ভাৱে হিচাপ হ'ব। আপুনি কাৰ পৰা ধন পাবলৈ বাকী আছে, সেয়া ডেশ্ববৰ্ডত চাব পাৰিব।"}
        </p>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="font-semibold">
          {lang === "en" ? "Contact/Support" : "যোগাযোগ/সহায়"}
        </h3>
        <p className="text-muted-dark">
          {lang === "en"
            ? "For support, please contact us at support@tractorhisaab.com"
            : "সহায়ৰ বাবে অনুগ্ৰহ কৰি support@tractorhisaab.com ত আমাৰ সৈতে যোগাযোগ কৰক"}
        </p>
      </div>
    </div>
  );
}
