import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteBackground } from "@/components/site-background";
import { SITE_URL } from "@/lib/constants";

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VibeDrop - Share Prompts & Climb the Trending Feed",
    template: "%s | VibeDrop",
  },
  description: "Drop your best AI prompt vibes, copy what works, remix ideas, and climb the public trending leaderboard.",
  keywords: ["prompts", "AI prompts", "ChatGPT", "Midjourney", "stable diffusion", "vibe coding", "VibeDrop"],
  authors: [{ name: "VibeDrop Team" }],
  creator: "VibeDrop Creator",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VibeDrop - Share prompts & climb the leaderboard",
    description: "Drop your best AI prompt vibes, copy what works, remix ideas, and climb the public trending leaderboard.",
    url: SITE_URL,
    siteName: "VibeDrop",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeDrop - Share prompts & climb the leaderboard",
    description: "Drop your best AI prompt vibes, copy what works, remix ideas, and climb the public trending leaderboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#c8f560",
  width: "device-width",
  initialScale: 1,
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground bg-[#fbfcfa]" id="main-app-shell">
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}
