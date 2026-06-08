import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "ProfitDelta | AI Automation for Profit Optimization",
  description:
    "ProfitDelta helps businesses automate processes, reduce manual work, and optimize profit through measurable AI-driven improvements.",
  openGraph: {
    title: "ProfitDelta | AI Automation for Profit Optimization",
    description:
      "AI automation consultancy for measurable business process improvement and profit optimization.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
