import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/lib/supabase/provider";
import { LangThemeProvider } from "@/lib/lang-theme";

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

export const viewport: Viewport = {
  themeColor: "#2F4A3B",
};

export const metadata: Metadata = {
  title: "Sakhir Hichap",
  description: "Track your tractor income and expenses",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hisaab",
  },
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
        <SupabaseProvider>
          <LangThemeProvider>{children}</LangThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
