import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import BottomNavbar from "@/components/layout/BottomNavbar";
import { AppProvider } from "@/lib/context";

export const metadata: Metadata = {
  title: "Finora - AI-Powered Budget Tracking",
  description: "Track your spending with AI insights and smart categorization",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Finora" />
        <meta name="theme-color" content="#0a0e27" />
      </head>
      <body className={`${jakarta.variable} antialiased bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] font-sans overflow-x-hidden`}>
        <AppProvider>
          <div className="flex flex-col w-screen min-h-[100dvh]">
            <main className="flex-1 w-full overflow-y-auto pb-24">{children}</main>
            <BottomNavbar />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
