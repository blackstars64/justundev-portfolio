import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav/Nav";
import EasterEgg from "@/components/EasterEgg/EasterEgg";
import "../styles/globals.scss";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Just'un Dev — Développeur Full-Stack & Data Viz",
  description: "Portfolio freelance de Blackstars64 — Je crée des applications modernes et des visualisations de données interactives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fontSans.variable} ${fontMono.variable}`} data-scroll-behavior="smooth">
      <body>
        <Nav />
        {children}
        <EasterEgg />
      </body>
    </html>
  );
}
