import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
      <body className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
          {/* Footer bar */}
          <div className="border-t border-slate-200 bg-white px-6 py-2 text-xs text-slate-400 flex items-center justify-between mt-8">
            <span>ExportReady — compliance evidence platform for Indian manufacturers</span>
            <span className="text-slate-400">All data shown is fictional demo data.</span>
          </div>
        </main>
      </body>
    </html>
  );
}
