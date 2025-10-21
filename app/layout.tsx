import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BottomNavbar from "@/components/layout/BottomNavbar";

export const metadata: Metadata = {
  title: "Finora - AI-Powered Budget Tracking",
  description: "Track your spending with AI insights and smart categorization",
  // Cache bust v2
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${jakarta.variable} antialiased bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] font-sans`}>
        <div className="flex min-h-screen flex-col pb-20">
          <main className="flex-1">{children}</main>
          <BottomNavbar />
        </div>
      </body>
    </html>
  );
}
