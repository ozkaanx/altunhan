import type {
  MetadataRoute,
} from "next";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "https://altunhan-beta.vercel.app";

  const supabase =
    await createClient();

  const {
    data: accommodations,
  } = await supabase
    .from("accommodations")
    .select(`
      slug,
      updated_at
    `)
    .eq("is_active", true);

  const staticPages: MetadataRoute.Sitemap =
    [
      {
        url: siteUrl,

        changeFrequency:
          "weekly",

        priority: 1,
      },

      {
        url:
          `${siteUrl}/rezervasyon`,

        changeFrequency:
          "weekly",

        priority: 0.9,
      },
    ];

  const accommodationPages: MetadataRoute.Sitemap =
    (
      accommodations ??
      []
    )
      .filter(
        (item) =>
          Boolean(
            item.slug,
          ),
      )
      .map(
        (item) => ({
          url:
            `${siteUrl}/konaklama/${item.slug}`,

          lastModified:
            item.updated_at
              ? new Date(
                  item.updated_at,
                )
              : undefined,

          changeFrequency:
            "weekly" as const,

          priority:
            0.8,
        }),
      );

  return [
    ...staticPages,
    ...accommodationPages,
  ];
}