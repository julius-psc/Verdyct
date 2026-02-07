import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

import CookieConsent from "./components/landing/CookieConsent";
import { CSPostHogProvider } from "./providers";
import TopLoader from "@/components/TopLoader";
import GlobalAnalysisNotifier from "./components/GlobalAnalysisNotifier";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

export const metadata: Metadata = {
  title: "Verdyct - AI Business Analyst for Startups",
  description: "Validate your startup idea in minutes with Verdyct's AI agents. Get market analysis, competitor insights, and a personalized roadmap.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  // await params is required in Next.js 15+
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to backend API for faster requests */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"} />
      </head>
      <body className={`${sourceSans3.variable} antialiased`}>
        <TopLoader />
        <NextIntlClientProvider messages={messages}>
          <CSPostHogProvider>
            {children}
            <GlobalAnalysisNotifier />
            <CookieConsent />
          </CSPostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}