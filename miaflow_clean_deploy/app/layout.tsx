import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiaFlow",
  description: "AI agents that help small businesses run smarter."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
