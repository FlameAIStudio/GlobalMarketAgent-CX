import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Market Agent",
  description: "AI-powered market research agent for GTM decisions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
