"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Language } from "@/lib/i18n";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: "📊" },
  { key: "addIncome", href: "/add-income", icon: "➕" },
  { key: "history", href: "/history", icon: "📋" },
  { key: "settings", href: "/settings", icon: "⚙️" },
];

export default function BottomNav({ lang }: { lang: Language }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-[var(--surface-dark)] dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-[var(--ink)]"
                  : "text-[var(--text-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">
                {item.key === "addIncome"
                  ? lang === "en"
                    ? "Add"
                    : "যোগ"
                  : t(item.key, lang)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
