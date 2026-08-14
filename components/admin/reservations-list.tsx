"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import {
  approveReservation,
  cancelReservation,
  rejectReservation,
} from "@/app/admin/reservations/action";

import { ReservationDetailDrawer } from "@/components/admin/reservation-detail-drawer";

import type { Reservation, ReservationStatus } from "@/types/reservation";

type ReservationsListProps = {
  reservations: Reservation[];

  currentPage: number;

  totalPages: number;

  totalCount: number;

  pendingCount: number;

  activeStatus: ReservationStatus | "all";

  initialSearch: string;

  pageSize: number;
};

const statusLabels: Record<ReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",

  pending_approval: "Onay Bekliyor",

  confirmed: "Onaylandı",

  rejected: "Reddedildi",

  cancelled: "İptal Edildi",
};

const filters: Array<ReservationStatus | "all"> = [
  "all",
  "pending_approval",
  "pending_payment",
  "confirmed",
  "rejected",
  "cancelled",
];

function getStatusClass(status: ReservationStatus) {
  switch (status) {
    case "pending_payment":
      return "bg-[#F4EBDC] text-[#8A642F]";

    case "pending_approval":
      return "bg-[#EAE6F4] text-[#655D8A]";

    case "confirmed":
      return "bg-[#E6EFE6] text-[#486348]";

    case "rejected":
      return "bg-[#F3E2DE] text-[#9C5148]";

    case "cancelled":
      return "bg-[#E7E9EA] text-[#5F676B]";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function StatusIcon({ status }: { status: ReservationStatus }) {
  if (status === "confirmed") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "rejected" || status === "cancelled") {
    return <XCircle size={14} />;
  }

  return <Clock3 size={14} />;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
}

export function ReservationsList({
  reservations,
  currentPage,
  totalPages,
  totalCount,
  pendingCount,
  activeStatus,
  initialSearch,
  pageSize,
}: ReservationsListProps) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const value = search.trim();

      if (value === initialSearch) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search, initialSearch, pathname, router, searchParams]);

  const changeFilter = (filter: ReservationStatus | "all") => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (filter === "all") {
      params.delete("status");
    } else {
      params.set("status", filter);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: true,
    });
  };

  const handleApprove = async (reservation: Reservation) => {
    const result = await approveReservation(reservation.id);

    if (!result.success) {
      return result;
    }

    setSelectedReservation(null);

    router.refresh();

    return {
      success: true,
    };
  };

  const handleReject = async (reservation: Reservation, reason: string) => {
    const result = await rejectReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    setSelectedReservation(null);

    router.refresh();

    return {
      success: true,
    };
  };

  const handleCancel = async (reservation: Reservation, reason: string) => {
    const result = await cancelReservation(reservation.id, reason);

    if (!result.success) {
      return result;
    }

    setSelectedReservation(null);

    router.refresh();

    return {
      success: true,
    };
  };

  const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastItem = Math.min(currentPage * pageSize, totalCount);

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <>
      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[#8B8E87]">Rezervasyon Yönetimi</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
              Rezervasyonlar
            </h1>

            <p className="mt-2 text-sm text-[#71756E]">
              Gelen rezervasyonları ve ödeme durumlarını yönetin.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <button
              type="button"
              onClick={() => router.push("/admin/reservations/new")}
              className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] px-5 text-xs font-semibold text-white"
            >
              <Plus size={15} />
              Yeni Rezervasyon
            </button>

            {pendingCount > 0 && (
              <div className="flex w-fit items-center gap-2 bg-[#EAE6F4] px-3 py-2 text-xs font-medium text-[#655D8A]">
                <Clock3 size={15} />
                {pendingCount} ödeme kontrol bekliyor
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative max-w-[420px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92968E]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Misafir, telefon, e-posta veya rezervasyon kodu ara..."
              className="h-11 w-full min-w-0 border border-[#DDD9D1] bg-white pl-10 pr-4 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => changeFilter(filter)}
                className={`shrink-0 border px-3 py-2 text-[11px] font-medium ${
                  activeStatus === filter
                    ? "border-[#263A2D] bg-[#263A2D] text-white"
                    : "border-[#DDD9D1] bg-white text-[#6D726B]"
                }`}
              >
                {filter === "all" ? "Tümü" : statusLabels[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1 text-xs text-[#858A83] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Toplam{" "}
            <span className="font-semibold text-[#263A2D]">{totalCount}</span>{" "}
            rezervasyon
          </p>

          {totalCount > 0 && (
            <p>
              {firstItem}–{lastItem} arası gösteriliyor
            </p>
          )}
        </div>

        {reservations.length === 0 && (
          <div className="mt-5 border border-[#E3E0D8] bg-white px-5 py-16 text-center">
            <p className="text-sm font-semibold text-[#263A2D]">
              Rezervasyon bulunamadı
            </p>

            <p className="mt-1 text-xs text-[#969990]">
              Arama veya filtreye uygun rezervasyon bulunmuyor.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-3 md:hidden">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="border border-[#E3E0D8] bg-white p-4"
            >
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="break-all text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
                    {reservation.reservation_code}
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-[#263A2D]">
                    {reservation.guest_name}
                  </h2>

                  <p className="mt-1 text-[11px] text-[#8B8E87]">
                    {reservation.guest_phone}
                  </p>
                </div>

                <span
                  className={`flex w-fit shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium ${getStatusClass(
                    reservation.status,
                  )}`}
                >
                  <StatusIcon status={reservation.status} />

                  {statusLabels[reservation.status]}
                </span>
              </div>

              <div className="mt-4 border-y border-[#EEEAE3] py-4">
                <p className="text-sm font-semibold text-[#263A2D]">
                  {reservation.accommodations?.title ?? "Konaklama"}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-[#969990]">Giriş</p>

                    <p className="mt-1 text-xs font-medium text-[#4C524B]">
                      {formatDate(reservation.check_in)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#969990]">Çıkış</p>

                    <p className="mt-1 text-xs font-medium text-[#4C524B]">
                      {formatDate(reservation.check_out)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#969990]">Süre</p>

                    <p className="mt-1 text-xs font-medium text-[#4C524B]">
                      {reservation.night_count} gece
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#969990]">Misafir</p>

                    <p className="mt-1 text-xs font-medium text-[#4C524B]">
                      {reservation.adult_count} yetişkin
                      {reservation.child_count > 0
                        ? ` · ${reservation.child_count} çocuk`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                    Toplam
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                    {Number(reservation.total_price).toLocaleString("tr-TR")} TL
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReservation(reservation)}
                  className="flex h-10 shrink-0 items-center gap-2 bg-[#263A2D] px-4 text-xs font-medium text-white"
                >
                  <Eye size={15} />
                  Görüntüle
                </button>
              </div>
            </article>
          ))}
        </div>

        {reservations.length > 0 && (
          <div className="mt-6 hidden overflow-x-auto border border-[#E3E0D8] bg-white md:block">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#ECE8E1]">
                  <TableHead>Rezervasyon</TableHead>

                  <TableHead>Misafir</TableHead>

                  <TableHead>Konaklama</TableHead>

                  <TableHead>Tarih</TableHead>

                  <TableHead>Tutar</TableHead>

                  <TableHead>Durum</TableHead>

                  <TableHead align="right">İşlem</TableHead>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-[#F0EDE7] last:border-0"
                  >
                    <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                      {reservation.reservation_code}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-[#343A34]">
                        {reservation.guest_name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#969990]">
                        {reservation.guest_phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#646A63]">
                      {reservation.accommodations?.title ?? "—"}
                    </td>

                    <td className="px-5 py-4 text-xs text-[#646A63]">
                      {formatDate(reservation.check_in)}

                      {" → "}

                      {formatDate(reservation.check_out)}
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                      {Number(reservation.total_price).toLocaleString("tr-TR")}{" "}
                      TL
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1.5 text-[10px] font-medium ${getStatusClass(
                          reservation.status,
                        )}`}
                      >
                        {statusLabels[reservation.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReservation(reservation)}
                        className="inline-flex h-9 items-center gap-2 border border-[#DDD9D1] px-3 text-xs text-[#263A2D]"
                      >
                        <Eye size={14} />
                        Görüntüle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 border-t border-[#E3E0D8] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#8B8E87]">
              Sayfa{" "}
              <span className="font-semibold text-[#263A2D]">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                className="flex h-9 items-center gap-1 border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />

                <span className="hidden sm:inline">Önceki</span>
              </button>

              {visiblePages.map((page, index) => {
                const previous = visiblePages[index - 1];

                const showDots = previous && page - previous > 1;

                return (
                  <div key={page} className="flex items-center gap-1.5">
                    {showDots && (
                      <span className="px-1 text-xs text-[#969990]">…</span>
                    )}

                    <button
                      type="button"
                      onClick={() => changePage(page)}
                      className={`flex h-9 min-w-9 items-center justify-center border px-2 text-xs font-medium ${
                        page === currentPage
                          ? "border-[#263A2D] bg-[#263A2D] text-white"
                          : "border-[#DDD9D1] bg-white text-[#263A2D]"
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="flex h-9 items-center gap-1 border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Sonraki</span>

                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      <ReservationDetailDrawer
        reservation={selectedReservation}
        open={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
      />
    </>
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
