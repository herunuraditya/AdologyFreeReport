import type { Metadata } from "next";
import { Inter } from "next/font/google";
// BARIS INI WAJIB ADA:
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adology Dashboard",
  description: "Marketing Insight Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}