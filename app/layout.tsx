import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Altunhan Farm | Saros'ta Doğayla İç İçe Konaklama",

    template:
      "%s | Altunhan Farm",
  },

  description:
    "Altunhan Farm, Saros Körfezi'nin kıyısında doğayla iç içe konaklama deneyimi sunar. Konaklama seçeneklerini keşfedin ve rezervasyonunuzu oluşturun.",

  keywords: [
    "Altunhan Farm",
    "Saros konaklama",
    "Keşan konaklama",
    "Edirne konaklama",
    "Saros tatil",
    "bungalov Saros",
    "doğa tatili",
    "Altunhan",
  ],

  authors: [
    {
      name: "Altunhan Farm",
    },
  ],

  creator:
    "Altunhan Farm",

  publisher:
    "Altunhan Farm",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",

    locale: "tr_TR",

    url: "/",

    siteName:
      "Altunhan Farm",

    title:
      "Altunhan Farm | Saros'ta Doğayla İç İçe Konaklama",

    description:
      "Saros Körfezi'nin kıyısında, doğayla iç içe sakin ve özel bir konaklama deneyimi.",

    images: [
      {
        url: "/images/hero/altunhan-farm.jpg",

        width: 1200,

        height: 630,

        alt: "Altunhan Farm",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Altunhan Farm | Saros'ta Doğayla İç İçe Konaklama",

    description:
      "Saros Körfezi'nin kıyısında, doğayla iç içe konaklama deneyimi.",

    images: [
      "/images/hero/altunhan-farm.jpg",
    ],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview":
        "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category:
    "travel",
};

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    display:
      "swap",

    subsets: [
      "latin",
    ],
  });

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}