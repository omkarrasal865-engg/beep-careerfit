import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "Beep CareerFit", description: "Know what to learn next — not everything you could learn." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${sans.variable} font-sans`}>{children}</body></html>);
}
