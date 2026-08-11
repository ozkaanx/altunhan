"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BedDouble,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";

type Accommodation = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  isActive: boolean;
};

const accommodations: Accommodation[] = [
  {
    id: 1,
    title: "Bungalov",
    slug: "bungalov",
    description:
      "Doğanın içerisinde sakin ve konforlu bir konaklama deneyimi.",
    price: 5200,
    capacity: 2,
    image: "/images/bungalow.jpg",
    isActive: true,
  },
  {
    id: 2,
    title: "Taş Oda",
    slug: "tas-oda",
    description:
      "Doğal taş mimarisiyle tasarlanmış huzurlu ve ferah odalar.",
    price: 4500,
    capacity: 4,
    image: "/images/stone-room.jpg",
    isActive: true,
  },
];

export default function AccommodationsPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(accommodations);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.title
        .toLocaleLowerCase("tr")
        .includes(search.toLocaleLowerCase("tr")),
    );
  }, [items, search]);

  const toggleStatus = (id: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              isActive: !item.isActive,
            }
          : item,
      ),
    );
  };

  return (
    <section>
      {/* Heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-[#8B8E87]">
            Konaklama Yönetimi
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Konaklamalar
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#71756E]">
            Konaklama seçeneklerini, fiyatlarını ve
            yayın durumlarını yönetin.
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

      {/* Toolbar */}
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

      {/* Mobile Cards */}
      <div className="mt-5 space-y-4 md:hidden">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden border border-[#E3E0D8] bg-white"
          >
            {/* Image */}
            <div className="relative aspect-[16/9] bg-[#EAE7DF]">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-3 top-3">
                <span
                  className={`
                    inline-flex
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-semibold
                    ${
                      item.isActive
                        ? "bg-[#263A2D] text-white"
                        : "bg-[#E8E5DE] text-[#777B74]"
                    }
                  `}
                >
                  {item.isActive ? "Yayında" : "Pasif"}
                </span>
              </div>

              <button
                type="button"
                aria-label="Diğer işlemler"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white text-[#263A2D] shadow-sm"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#263A2D]">
                    {item.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777B74]">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="mt-4 flex items-center gap-5 border-y border-[#EEEAE3] py-3">
                <div className="flex items-center gap-2">
                  <Users
                    size={15}
                    className="text-[#A8754F]"
                  />

                  <span className="text-xs text-[#626860]">
                    {item.capacity} kişi
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BedDouble
                    size={15}
                    className="text-[#A8754F]"
                  />

                  <span className="text-xs text-[#626860]">
                    Konaklama
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                    Gecelik
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                    {item.price.toLocaleString("tr-TR")} TL
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

              {/* Active */}
              <div className="mt-4 flex items-center justify-between border-t border-[#EEEAE3] pt-4">
                <div>
                  <p className="text-xs font-medium text-[#40463F]">
                    Yayın Durumu
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#969990]">
                    Ana sayfada göster
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  aria-label={
                    item.isActive
                      ? "Konaklamayı pasif yap"
                      : "Konaklamayı aktif yap"
                  }
                  className={`
                    relative
                    h-7
                    w-12
                    rounded-full
                    transition-colors
                    ${
                      item.isActive
                        ? "bg-[#263A2D]"
                        : "bg-[#D8D6D0]"
                    }
                  `}
                >
                  <span
                    className={`
                      absolute
                      top-1
                      h-5
                      w-5
                      rounded-full
                      bg-white
                      shadow-sm
                      transition-all
                      ${
                        item.isActive
                          ? "left-6"
                          : "left-1"
                      }
                    `}
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="mt-6 hidden overflow-hidden border border-[#E3E0D8] bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-[#ECE8E1]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Konaklama
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Kapasite
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Gecelik
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Durum
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  İşlem
                </th>
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
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#263A2D]">
                          {item.title}
                        </p>

                        <p className="mt-1 max-w-[280px] truncate text-[11px] text-[#92968E]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-[#626860]">
                    {item.capacity} kişi
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                    {item.price.toLocaleString("tr-TR")} TL
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleStatus(item.id)}
                      className={`
                        px-2.5
                        py-1.5
                        text-[10px]
                        font-medium
                        ${
                          item.isActive
                            ? "bg-[#E6EFE6] text-[#496249]"
                            : "bg-[#E7E9EA] text-[#686D68]"
                        }
                      `}
                    >
                      {item.isActive
                        ? "Yayında"
                        : "Pasif"}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/accommodations/${item.id}`}
                        className="flex h-9 items-center gap-2 border border-[#DDD9D1] px-3 text-xs text-[#263A2D] transition-colors hover:border-[#263A2D]"
                      >
                        Düzenle
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="mt-5 border border-[#E3E0D8] bg-white px-5 py-14 text-center">
          <p className="text-sm font-semibold text-[#263A2D]">
            Konaklama bulunamadı
          </p>

          <p className="mt-1 text-xs text-[#969990]">
            Arama kriterini değiştirmeyi deneyin.
          </p>
        </div>
      )}
    </section>
  );
}