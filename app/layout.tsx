import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUNNYVIBZ | Pôle Art & Culture",
  description:
    "Plateforme premium SUNNYVIBZ pour réservations, communauté, marketplace, événements, formation et gestion culturelle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
