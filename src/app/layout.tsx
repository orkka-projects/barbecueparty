import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "BarbecueParty",
  description: "Organize BBQ parties with friends — no signup required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
