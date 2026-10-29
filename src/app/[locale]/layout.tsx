import Script from "next/script";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Provider from "@/app/provider";
import { Locale, locales } from "@/config/i18n-config";
import { getTranslations } from 'next-intl/server';
import { notFound } from "next/navigation";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://cajuscript.tdevs.co/'),
  title: 'CajuScript - Company Website Verification Tool',
  description: 'Quickly verify if companies have official websites with CajuScript. Search, analyze, and validate company web presence in seconds.',
  keywords: [
    'company verification',
    'website checker',
    'business website search',
    'company web presence',
    'official website finder',
    'business validation',
    'company search tool',
    'website verification',
    'business website validator',
    'company lookup',
    'web presence checker',
    'business search engine',
    'company website detector',
    'website authenticity check',
    'business web verification',
    'corporate website finder',
    'online business validation',
    'company web footprint',
    'website legitimacy check',
    'business online presence',
  ],
  openGraph: {
    title: 'CajuScript | Instant Company Website Verification',
    description: 'Verify company legitimacy by finding their official websites. CajuScript helps you quickly determine if a business has an authentic web presence.',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'CajuScript',
    images: [
      {
        url: '/images/cajuscript-og.webp',
        width: 1200,
        height: 630,
        alt: 'CajuScript company website verification tool interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  authors: [{ name: 'CajuScript' }],
  generator: 'Next.js',
  applicationName: 'CajuScript',
  referrer: 'origin-when-cross-origin',
  creator: 'CajuScript',
  publisher: 'CajuScript',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  category: 'Business Tools',
  classification: 'Company Verification',
};

async function getMessages( locale: string ) {
  try {
    const messages = ( await import( `@/messages/${locale}.json` )).default;
    return messages;
  } catch ( error ) {
    console.error( `Failed to load messages for locale ${locale}:`, error );
    return ( await import( `@/messages/en.json` )).default;
  }
}

export default async function RootLayout({
  children,
  params,
}: {
children: ReactNode;
params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if ( !locales.includes( locale as Locale )) {
    notFound();
  }

  const messages = await getMessages( locale );
  await getTranslations({ locale });

  return (
    <html
      lang={locale === 'br' ? 'pt-BR' : locale}
    >
      <body
        className={`scroll-smooth ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider
          locale={locale}
          messages={messages}
        >
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <p>Carregando...</p>
              </div>
            }
          >
            {children}
          </Suspense>
        </Provider>
        <AnalyticsScripts />
      <Script src="/rc-study-modal.js" strategy="afterInteractive" />
</body>
    </html>
  );
}
