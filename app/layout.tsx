import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Important: Use Next.js Script component
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Resume Builder | Free Professional CV",
  description: "Create your winning resume with AI in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Adsterra Monetization Script */}
        <Script
          src="https://pl29138792.profitablecpmratenetwork.com/cf/de/f6/cfdef67649704ea0630a71981e572443.js"
          strategy="lazyOnload" // Loads after the page is fully interactive for better SEO
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
