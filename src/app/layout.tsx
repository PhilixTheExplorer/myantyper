import type { Metadata, Viewport } from "next";
import {
  Courier_Prime,
  Cutive_Mono,
  IBM_Plex_Mono,
  JetBrains_Mono,
  Special_Elite,
} from "next/font/google";
import "./../styles/globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HistoryProvider } from "@/components/providers/HistoryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { JsonLd } from "@/components/ui/JsonLd";
import { GITHUB_REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const cutiveMono = Cutive_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cutive-mono",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-elite",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MyanTyper: Free Open-Source Burmese Typing Practice",
    template: "%s · MyanTyper",
  },
  description:
    "Free, open-source Burmese typing practice and Myanmar Unicode lessons. Test speed and accuracy on the Windows Myanmar keyboard—no ads, tracking, or required account.",
  applicationName: SITE_NAME,
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    url: "/",
    title: "MyanTyper: Free Open-Source Burmese Typing Practice",
    description:
      "Free, open-source Burmese typing practice, Myanmar Unicode lessons, and a typing speed and accuracy test.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyanTyper: Free Open-Source Burmese Typing Practice",
    description:
      "Free, open-source Burmese typing practice, Myanmar Unicode lessons, and a typing speed and accuracy test.",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1e7d0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${courierPrime.variable} ${cutiveMono.variable} ${specialElite.variable} ${ibmPlexMono.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            description:
              "Free, open-source Burmese typing practice, Myanmar Unicode lessons, and typing tests for the Windows Myanmar keyboard.",
            inLanguage: ["en", "my"],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/android-chrome-512x512.png`,
            sameAs: [GITHUB_REPO_URL],
          }}
        />
        <ThemeProvider>
          <HistoryProvider>
            <div className="min-h-dvh relative">
              <div className="mx-auto flex min-h-dvh max-w-screen-xl flex-col px-4 pb-8 pt-3 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8">
                <AppHeader />
                {children}
                <ChromeGate>
                  <SiteFooter />
                </ChromeGate>
              </div>
            </div>
          </HistoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
