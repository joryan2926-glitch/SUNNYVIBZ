import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunnyvibz.fr"),
  title: {
    default: "SUNNYVIBZ | Pôle Art & Culture",
    template: "%s | SUNNYVIBZ",
  },
  description:
    "SUNNYVIBZ est une association Art & Culture dédiée à la création, aux artistes, aux événements, aux ateliers et à la communauté.",
  keywords: [
    "SUNNYVIBZ",
    "art",
    "culture",
    "association culturelle",
    "événements",
    "artistes",
    "galerie",
    "ateliers",
  ],
  openGraph: {
    title: "SUNNYVIBZ | Pôle Art & Culture",
    description:
      "Un écosystème culturel moderne pour créer, exposer, apprendre, rencontrer et soutenir les artistes.",
    url: "https://sunnyvibz.fr",
    siteName: "SUNNYVIBZ",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_8%,rgba(24,242,166,0.20),transparent_30rem),radial-gradient(circle_at_86%_4%,rgba(255,217,120,0.16),transparent_32rem),linear-gradient(135deg,#000_0%,#030403_44%,#06170f_100%)]" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
