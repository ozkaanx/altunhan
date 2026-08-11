"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BedDouble, Eye, Plus, Search, Users } from "lucide-react";

import type { Accommodation } from "@/types/accommodation";

type AccommodationsListProps = {
  accommodations: Accommodation[];
};

function getCoverImage(accommodation: Accommodation) {
  const images = accommodation.accommodation_images ?? [];

  const cover = images.find((image) => image.is_cover);

  if (cover) {
    return cover.image_url;
  }

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return sortedImages[0]?.image_url ?? null;
}

export function AccommodationsList({
  accommodations,
}: AccommodationsListProps) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLocaleLowerCase("tr");

    if (!searchValue) {
      return accommodations;
    }

    return accommodations.filter((item) => {
      return (
        item.title.toLocaleLowerCase("tr").includes(searchValue) ||
        item.slug.toLocaleLowerCase("tr").includes(searchValue)
      );
    });
  }, [accommodations, search]);

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[#8B8E87]">Konaklama Yönetimi</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Konaklamalar
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#71756E]">
            Konaklama seçeneklerini, fiyatlarını ve yayın durumlarını yönetin.
          </p>
        </div>

        <Link
          href="/admin/accommodations/new"
          className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#344B3A] sm:w-auto"
        >
          <Plus size={16} />
          Yeni Konaklama
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative w-full sm:max-w-[380px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92968E]"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Konaklama ara..."
            className="h-11 w-full border border-[#DDD9D1] bg-white pl-10 pr-4 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
          />
        </div>
      </div>
      {filteredItems.length === 0 && (
        <div className="relative aspect-[16/8] overflow-hidden bg-[#E9E6DE]">
          {getCoverImage(item) ? (
            <img
              src={getCoverImage(item)!}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BedDouble
                size={34}
                strokeWidth={1.3}
                className="text-[#AAA69B]"
              />
            </div>
          )}

          <span
            className={`
      absolute
      left-3
      top-3
      inline-flex
      px-2.5
      py-1.5
      text-[10px]
      font-semibold
      ${
        item.is_active
          ? "bg-[#263A2D] text-white"
          : "bg-[#D9D6CF] text-[#666B65]"
      }
    `}
          >
            {item.is_active ? "Yayında" : "Pasif"}
          </span>
        </div>
      )}

      {/* MOBILE */}
      <div className="mt-5 space-y-4 md:hidden">
        {filteredItems.map((item) => (
          <article key={item.id} className="border border-[#E3E0D8] bg-white">
            {/* Şimdilik fotoğraf placeholder */}
            <div className="relative flex aspect-[16/8] items-center justify-center bg-[#E9E6DE]">
              <BedDouble
                size={34}
                strokeWidth={1.3}
                className="text-[#AAA69B]"
              />

              <span
                className={`
                  absolute
                  left-3
                  top-3
                  inline-flex
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-semibold
                  ${
                    item.is_active
                      ? "bg-[#263A2D] text-white"
                      : "bg-[#D9D6CF] text-[#666B65]"
                  }
                `}
              >
                {item.is_active ? "Yayında" : "Pasif"}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#263A2D]">
                {item.title}
              </h3>

              {item.short_description && (
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777B74]">
                  {item.short_description}
                </p>
              )}

              <div className="mt-4 grid grid-cols-3 gap-3 border-y border-[#EEEAE3] py-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[#A8754F]">
                    <Users size={14} />

                    <span className="text-[10px] text-[#969990]">Kapasite</span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-[#4C524B]">
                    {item.capacity} kişi
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#A8754F]">
                    <BedDouble size={14} />

                    <span className="text-[10px] text-[#969990]">Yatak</span>
                  </div>

                  <p className="mt-1 text-xs font-semibold text-[#4C524B]">
                    {item.bed_count}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Banyo</p>

                  <p className="mt-1 text-xs font-semibold text-[#4C524B]">
                    {item.bathroom_count}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                    Gecelik
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                    {Number(item.price).toLocaleString("tr-TR")} TL
                  </p>
                </div>

                <Link
                  href={`/admin/accommodations/${item.id}`}
                  className="inline-flex h-10 items-center gap-2 border border-[#DAD6CE] px-4 text-xs font-medium text-[#263A2D]"
                >
                  <Eye size={15} />
                  Düzenle
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* DESKTOP */}
      {filteredItems.length > 0 && (
        <div className="mt-6 hidden overflow-hidden border border-[#E3E0D8] bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-[#ECE8E1]">
                  <TableHead>Konaklama</TableHead>

                  <TableHead>Kapasite</TableHead>

                  <TableHead>Gecelik</TableHead>

                  <TableHead>Durum</TableHead>

                  <TableHead align="right">İşlem</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#F0EDE7] last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-20 shrink-0 overflow-hidden bg-[#EEEAE3]">
                          {getCoverImage(item) ? (
                            <img
                              src={getCoverImage(item)!}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <BedDouble size={20} className="text-[#AAA69B]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#263A2D]">
                            {item.title}
                          </p>

                          <p className="mt-1 max-w-[300px] truncate text-[11px] text-[#92968E]">
                            {item.short_description ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#626860]">
                      {item.capacity} kişi
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                      {Number(item.price).toLocaleString("tr-TR")} TL
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          px-2.5
                          py-1.5
                          text-[10px]
                          font-medium
                          ${
                            item.is_active
                              ? "bg-[#E6EFE6] text-[#496249]"
                              : "bg-[#E7E9EA] text-[#686D68]"
                          }
                        `}
                      >
                        {item.is_active ? "Yayında" : "Pasif"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/accommodations/${item.id}`}
                        className="inline-flex h-9 items-center border border-[#DDD9D1] px-3 text-xs text-[#263A2D] transition-colors hover:border-[#263A2D]"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
