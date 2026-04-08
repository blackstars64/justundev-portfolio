import type { Metadata } from "next";
import "../styles/globals.scss";

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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
