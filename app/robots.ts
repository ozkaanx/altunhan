import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://altunhan-beta.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",

        allow: ["/", "/konaklama/", "/rezervasyon"],

        disallow: ["/admin/", "/auth/", "/protected/", "/rezervasyon/takip"],
      },
    ],

    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
