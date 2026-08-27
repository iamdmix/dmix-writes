import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: { default: "dmix writes", template: "%s · dmix writes" },
  description: "Engineering notes by dmix — systems, software, and the odd sharp edge.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

