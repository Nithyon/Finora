import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finora - AI-Powered Budget Tracking",
  description: "Track your spending with AI insights and smart categorization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-gradient-to-br from-[#0a0e27] via-[#141829] to-[#1a1f3a] font-['Plus_Jakarta_Sans']">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
