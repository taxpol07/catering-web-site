import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { BUSINESS } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: `${BUSINESS.name} | Used Commercial Catering Equipment UK`,
    template: `%s | ${BUSINESS.name}`,
  },
  description:
    "Browse quality used commercial catering equipment in the UK. Combi ovens, refrigeration, pizza ovens, dishwashers and more. Trade prices, fully tested, nationwide delivery.",
  keywords: [
    "used catering equipment",
    "commercial kitchen equipment UK",
    "second hand combi oven",
    "used refrigeration",
    "catering equipment warehouse",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Used Commercial Catering Equipment`,
    description:
      "Your online warehouse for quality used commercial catering equipment across the UK.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
