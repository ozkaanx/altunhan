"use client";

import {
  CheckCircle2,
  Clock3,
  Eye,
  Search,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  useMemo,
  useState,
} from "react";

import {
  approveReservation,
  rejectReservation,
} from "@/app/admin/reservations/action";

import {
  ReservationDetailDrawer,
} from "@/components/admin/reservation-detail-drawer";

import type {
  Reservation,
  ReservationStatus,
} from "@/types/reservation";

type ReservationsListProps = {
  reservations: Reservation[];
};

const statusLabels: Record<
  ReservationStatus,
  string
> = {
  pending_payment:
    "Ödeme Bekleniyor",

  pending_approval:
    "Onay Bekliyor",

  confirmed:
    "Onaylandı",

  rejected:
    "Reddedildi",

  cancelled:
    "İptal Edildi",
};

const filters: Array<
  ReservationStatus | "all"
> = [
  "all",
  "pending_approval",
  "pending_payment",
  "confirmed",
  "rejected",
  "cancelled",
];

function getStatusClass(
  status: ReservationStatus,
) {
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

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

function StatusIcon({
  status,
}: {
  status: ReservationStatus;
}) {
  if (
    status === "confirmed"
  ) {
    return (
      <CheckCircle2
        size={14}
      />
    );
  }

  if (
    status === "rejected" ||
    status === "cancelled"
  ) {
    return (
      <XCircle
        size={14}
      />
    );
  }

  return (
    <Clock3
      size={14}
    />
  );
}

export function ReservationsList({
  reservations,
}: ReservationsListProps) {
  const router =
    useRouter();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<
    ReservationStatus | "all"
  >("all");

  const [
    selectedReservation,
    setSelectedReservation,
  ] =
    useState<Reservation | null>(
      null,
    );

  const filteredReservations =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLocaleLowerCase(
            "tr",
          );

      return reservations.filter(
        (
          reservation,
        ) => {
          const matchesSearch =
            !searchValue ||
            reservation.guest_name
              .toLocaleLowerCase(
                "tr",
              )
              .includes(
                searchValue,
              ) ||
            reservation.reservation_code
              .toLocaleLowerCase(
                "tr",
              )
              .includes(
                searchValue,
              ) ||
            reservation.guest_phone.includes(
              searchValue,
            ) ||
            reservation.accommodations?.title
              ?.toLocaleLowerCase(
                "tr",
              )
              .includes(
                searchValue,
              );

          const matchesFilter =
            activeFilter ===
              "all" ||
            reservation.status ===
              activeFilter;

          return (
            matchesSearch &&
            matchesFilter
          );
        },
      );
    }, [
      reservations,
      search,
      activeFilter,
    ]);

  const pendingCount =
    reservations.filter(
      (
        reservation,
      ) =>
        reservation.status ===
        "pending_approval",
    ).length;

  const handleApprove =
    async (
      reservation: Reservation,
    ) => {
      const result =
        await approveReservation(
          reservation.id,
        );

      if (
        !result.success
      ) {
        return result;
      }

      setSelectedReservation(
        null,
      );

      router.refresh();

      return {
        success: true,
      };
    };

  const handleReject =
    async (
      reservation: Reservation,
      reason: string,
    ) => {
      const result =
        await rejectReservation(
          reservation.id,
          reason,
        );

      if (
        !result.success
      ) {
        return result;
      }

      setSelectedReservation(
        null,
      );

      router.refresh();

      return {
        success: true,
      };
    };

  return (
    <>
      <section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[#8B8E87]">
              Rezervasyon Yönetimi
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
              Rezervasyonlar
            </h1>

            <p className="mt-2 text-sm text-[#71756E]">
              Gelen rezervasyonları
              ve ödeme durumlarını
              yönetin.
            </p>
          </div>

          {pendingCount >
            0 && (
            <div className="flex w-fit items-center gap-2 bg-[#EAE6F4] px-3 py-2 text-xs font-medium text-[#655D8A]">
              <Clock3
                size={15}
              />

              {pendingCount} ödeme
              kontrol bekliyor
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92968E]"
            />

            <input
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event
                    .target
                    .value,
                )
              }
              placeholder="Misafir, telefon veya rezervasyon kodu ara..."
              className="h-11 w-full border border-[#DDD9D1] bg-white pl-10 pr-4 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:max-w-[420px]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map(
              (
                filter,
              ) => (
                <button
                  key={
                    filter
                  }
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter,
                    )
                  }
                  className={`shrink-0 border px-3 py-2 text-[11px] font-medium ${
                    activeFilter ===
                    filter
                      ? "border-[#263A2D] bg-[#263A2D] text-white"
                      : "border-[#DDD9D1] bg-white text-[#6D726B]"
                  }`}
                >
                  {filter ===
                  "all"
                    ? "Tümü"
                    : statusLabels[
                        filter
                      ]}
                </button>
              ),
            )}
          </div>
        </div>

        {filteredReservations.length ===
          0 && (
          <div className="mt-5 border border-[#E3E0D8] bg-white px-5 py-16 text-center">
            <p className="text-sm font-semibold text-[#263A2D]">
              Rezervasyon
              bulunamadı
            </p>

            <p className="mt-1 text-xs text-[#969990]">
              Henüz rezervasyon
              bulunmuyor veya
              filtre kriterine
              uygun kayıt yok.
            </p>
          </div>
        )}

        {/* MOBILE */}
        <div className="mt-5 space-y-3 md:hidden">
          {filteredReservations.map(
            (
              reservation,
            ) => (
              <article
                key={
                  reservation.id
                }
                className="border border-[#E3E0D8] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
                      {
                        reservation.reservation_code
                      }
                    </p>

                    <h2 className="mt-1 text-base font-semibold text-[#263A2D]">
                      {
                        reservation.guest_name
                      }
                    </h2>

                    <p className="mt-1 text-[11px] text-[#8B8E87]">
                      {
                        reservation.guest_phone
                      }
                    </p>
                  </div>

                  <span
                    className={`flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium ${getStatusClass(
                      reservation.status,
                    )}`}
                  >
                    <StatusIcon
                      status={
                        reservation.status
                      }
                    />

                    {
                      statusLabels[
                        reservation.status
                      ]
                    }
                  </span>
                </div>

                <div className="mt-4 border-y border-[#EEEAE3] py-4">
                  <p className="text-sm font-semibold text-[#263A2D]">
                    {reservation
                      .accommodations
                      ?.title ??
                      "Konaklama"}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-[#969990]">
                        Giriş
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#4C524B]">
                        {formatDate(
                          reservation.check_in,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#969990]">
                        Çıkış
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#4C524B]">
                        {formatDate(
                          reservation.check_out,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#969990]">
                        Süre
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#4C524B]">
                        {
                          reservation.night_count
                        }{" "}
                        gece
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-[#969990]">
                        Misafir
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#4C524B]">
                        {
                          reservation.guest_count
                        }{" "}
                        kişi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
                      Toplam
                    </p>

                    <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                      {Number(
                        reservation.total_price,
                      ).toLocaleString(
                        "tr-TR",
                      )}{" "}
                      TL
                    </p>

                    {reservation.receipt_storage_path && (
                      <p className="mt-1 text-[10px] font-medium text-[#60795F]">
                        ✓ Dekont
                        yüklendi
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReservation(
                        reservation,
                      )
                    }
                    className="flex h-10 items-center gap-2 bg-[#263A2D] px-4 text-xs font-medium text-white"
                  >
                    <Eye
                      size={
                        15
                      }
                    />

                    Görüntüle
                  </button>
                </div>
              </article>
            ),
          )}
        </div>

        {/* DESKTOP */}
        {filteredReservations.length >
          0 && (
          <div className="mt-6 hidden overflow-x-auto border border-[#E3E0D8] bg-white md:block">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#ECE8E1]">
                  <TableHead>
                    Rezervasyon
                  </TableHead>

                  <TableHead>
                    Misafir
                  </TableHead>

                  <TableHead>
                    Konaklama
                  </TableHead>

                  <TableHead>
                    Tarih
                  </TableHead>

                  <TableHead>
                    Tutar
                  </TableHead>

                  <TableHead>
                    Durum
                  </TableHead>

                  <TableHead align="right">
                    İşlem
                  </TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map(
                  (
                    reservation,
                  ) => (
                    <tr
                      key={
                        reservation.id
                      }
                      className="border-b border-[#F0EDE7] last:border-0"
                    >
                      <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                        {
                          reservation.reservation_code
                        }
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[#343A34]">
                          {
                            reservation.guest_name
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-[#969990]">
                          {
                            reservation.guest_phone
                          }
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#646A63]">
                        {reservation
                          .accommodations
                          ?.title ??
                          "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#646A63]">
                        {formatDate(
                          reservation.check_in,
                        )}

                        {" → "}

                        {formatDate(
                          reservation.check_out,
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-[#263A2D]">
                        {Number(
                          reservation.total_price,
                        ).toLocaleString(
                          "tr-TR",
                        )}{" "}
                        TL
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1.5 text-[10px] font-medium ${getStatusClass(
                            reservation.status,
                          )}`}
                        >
                          {
                            statusLabels[
                              reservation.status
                            ]
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReservation(
                              reservation,
                            )
                          }
                          className="inline-flex h-9 items-center gap-2 border border-[#DDD9D1] px-3 text-xs text-[#263A2D]"
                        >
                          <Eye
                            size={
                              14
                            }
                          />

                          Görüntüle
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ReservationDetailDrawer
        reservation={
          selectedReservation
        }
        open={Boolean(
          selectedReservation,
        )}
        onClose={() =>
          setSelectedReservation(
            null,
          )
        }
        onApprove={
          handleApprove
        }
        onReject={
          handleReject
        }
      />
    </>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children:
    React.ReactNode;

  align?:
    | "left"
    | "right";
}) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990] ${
        align ===
        "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}