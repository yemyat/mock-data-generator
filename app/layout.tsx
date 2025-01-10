import type { Metadata } from "next";
import { Instrument_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { JSONProvider } from "@/contexts/JSONContext";
import { Toaster } from "@/components/ui/toaster";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Mock Data Generator",
  description: "Generate mock data from your JSON schema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      <body
        className={`${instrumentSans.variable} ${firaCode.variable} antialiased`}
      >
        <JSONProvider>
          <div className="flex flex-col h-screen bg-background">
            <NavBar />
            {children}
          </div>
          <Toaster />
        </JSONProvider>
      </body>
    </html>
  );
}
