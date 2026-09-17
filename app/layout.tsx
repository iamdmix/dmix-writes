import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

const siteDescription = "Engineering notes by dmix — systems, software, and the odd sharp edge.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "dmix writes", template: "%s · dmix writes" },
  description: siteDescription,
  applicationName: "dmix writes",
  authors: [{ name: "dmix", url: siteUrl }],
  creator: "dmix",
  publisher: "dmix",
  category: "technology",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "dmix writes",
    title: "dmix writes",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "dmix writes",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E10" },
  ],
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
