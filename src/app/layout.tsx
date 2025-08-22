import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Aplication } from "@/shared/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestão Loja Água Mineral",
  description: "Sistema completo de gestão para loja de água mineral - pedidos, estoque, clientes e vendas",
  keywords: ["gestão", "água mineral", "pedidos", "estoque", "vendas", "clientes"],
  authors: [{ name: "AquaGestão Team" }],
  creator: "AquaGestão",
  publisher: "AquaGestão",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aquagestao.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AquaGestão - Sistema de Gestão",
    description: "Sistema completo de gestão para loja de água mineral",
    url: 'https://aquagestao.com',
    siteName: 'AquaGestão',
    images: [
      {
        url: '/icon-512x512.svg',
        width: 512,
        height: 512,
        alt: 'AquaGestão Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AquaGestão - Sistema de Gestão",
    description: "Sistema completo de gestão para loja de água mineral",
    images: ['/icon-512x512.svg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0ea5e9' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AquaGestão',
  },
  applicationName: 'AquaGestão',
  category: 'business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Aplication>{children}</Aplication>
      </body>
    </html>
  );
}
