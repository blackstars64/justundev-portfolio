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

const BASE_URL = 'https://www.justundev.fr';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Just'un Dev — Développeur Full-Stack & Data Viz",
    template: "%s | Just'un Dev",
  },
  description:
    "Développeur freelance Full-Stack TypeScript — Next.js, Node.js, D3.js. E-commerce, sites vitrine, logiciels sur-mesure et data viz.",
  keywords: ['développeur freelance', 'next.js', 'typescript', 'data viz', 'd3.js', 'react', 'node.js', 'fullstack'],
  authors: [{ name: 'Blackstars64', url: BASE_URL }],
  creator: 'Blackstars64',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: "Just'un Dev",
    title: "Just'un Dev — Développeur Full-Stack & Data Viz",
    description:
      "Développeur freelance Full-Stack TypeScript — Next.js, Node.js, D3.js. E-commerce, sites vitrine, logiciels sur-mesure et data viz.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Just'un Dev — Développeur Full-Stack & Data Viz",
    description:
      "Développeur freelance Full-Stack TypeScript — Next.js, Node.js, D3.js. E-commerce, sites vitrine, logiciels sur-mesure et data viz.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
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
