import type { Metadata } from "next";
import { DM_Serif_Display, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/lib/supabase/provider";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  variable: "--font-hind",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Tractor Seva Hisaab",
  description: "Track your tractor income and expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-hind)] bg-[var(--bg-light)] text-[var(--ink)] dark:bg-[var(--ink-dark)] dark:text-white">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
