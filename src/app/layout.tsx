import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "ExportReady — India Export Passport",
  description: "ExportReady - Digital Product Passport & Compliance Evidence Platform for Indian Manufacturers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} font-sans flex h-screen overflow-hidden bg-cream text-charcoal`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
          {/* Footer bar */}
          <div className="border-t border-sand bg-cream-light px-6 py-4 text-xs text-stone-500 flex items-center justify-between mt-8">
            <span className="font-serif italic">ExportReady — compliance evidence platform for Indian manufacturers</span>
            <span>All data shown is fictional demo data.</span>
          </div>
        </main>
      </body>
    </html>
  );
}
