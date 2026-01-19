import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "../components/layout/BottonNav";

export const metadata: Metadata = {
  title: "Kairos Journal", // [CHANGED] From "Quiet Chronicle"
  description: "Number your days. Gain a heart of wisdom.", // [CHANGED] Matches your README philosophy
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen pb-24">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}