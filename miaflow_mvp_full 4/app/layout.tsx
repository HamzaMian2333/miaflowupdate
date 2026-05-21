import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiaFlow | AI Operations Assistant",
  description: "MiaFlow helps small businesses manage sales insights, restock recommendations, phone-order drafts, and approvals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
