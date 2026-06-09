import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/shared/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkySense | Dashboard",
  description: "Advanced IoT Rain Sensing System for Smart Laundry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-100 selection:bg-blue-500/30">
        {/* ClientProvider membungkus seluruh konten untuk Preloader & State Management */}
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
