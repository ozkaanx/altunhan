"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { ReservationDetailDrawer } from "@/components/admin/reservation-detail-drawer";

type ReservationStatus =
  | "pending_payment"
  | "payment_review"
  | "confirmed"
  | "cancelled"
  | "completed";

type Reservation = {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  accommodation: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  status: ReservationStatus;
  paymentReceiptUrl: string | null;
  note?: string | null;
};

const reservations: Reservation[] = [
  {
    id: "RSV-1001",
    customerName: "Ahmet Yılmaz",
    phone: "+90 532 111 22 33",
    email: "ahmet@example.com",
    accommodation: "Bungalov",
    checkIn: "12 Ağustos 2026",
    checkOut: "15 Ağustos 2026",
    adultCount: 2,
    childCount: 0,
    totalPrice: 15600,
    status: "payment_review",
    paymentReceiptUrl: "/mock/dekont.pdf",
    note: "Mümkünse deniz tarafına yakın bir bungalov tercih ediyoruz.",
  },
  {
    id: "RSV-1002",
    customerName: "Mehmet Kaya",
    phone: "+90 535 444 55 66",
    accommodation: "Taş Oda",
    checkIn: "14 Ağustos 2026",
    checkOut: "17 Ağustos 2026",
    guestCount: 3,
    totalPrice: 13500,
    status: "Bekliyor",
  },
  {
    id: "RSV-1003",
    customerName: "Ayşe Demir",
    phone: "+90 545 222 33 44",
    accommodation: "Bungalov",
    checkIn: "18 Ağustos 2026",
    checkOut: "21 Ağustos 2026",
    guestCount: 2,
    totalPrice: 15600,
    status: "Onaylandı",
  },
  {
    id: "RSV-1004",
    customerName: "Selin Arslan",
    phone: "+90 532 987 65 43",
    accommodation: "Taş Oda",
    checkIn: "20 Ağustos 2026",
    checkOut: "22 Ağustos 2026",
    guestCount: 2,
    totalPrice: 9000,
    status: "İptal Edildi",
  },
  {
    id: "RSV-1005",
    customerName: "Burak Çetin",
    phone: "+90 530 444 77 88",
    accommodation: "Bungalov",
    checkIn: "22 Ağustos 2026",
    checkOut: "25 Ağustos 2026",
    guestCount: 4,
    totalPrice: 17400,
    status: "Tamamlandı",
  },
];

const filters: ReservationStatus[] = [
  "pending_payment",
  "payment_review",
  "confirmed",
  "cancelled",
  "completed",
];

function getStatusStyles(status: ReservationStatus) {
  switch (status) {
    case "pending_payment":
      return "bg-[#E6EFE6] text-[#486348]";

    case "payment_review":
      return "bg-[#F4EBDC] text-[#9A6D32]";

    case "cancelled":
      return "bg-[#F3E2DE] text-[#9C5148]";

    case "completed":
      return "bg-[#E7E9EA] text-[#5F676B]";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statusLabels: Record<ReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",
  payment_review: "Ödeme Kontrolünde",
  confirmed: "Onaylandı",
  cancelled: "İptal Edildi",
  completed: "Tamamlandı",
};

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "Tümü">(
    "Tümü",
  );

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.customerName
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr")) ||
        reservation.id
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr")) ||
        reservation.accommodation
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr"));

      const matchesFilter =
        activeFilter === "Tümü" || reservation.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <section>
      {/* Heading */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs text-[#8B8E87]">Rezervasyon Yönetimi</p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Rezervasyonlar
          </h2>

          <p className="mt-2 text-sm text-[#71756E]">
            Gelen rezervasyonları görüntüleyin ve durumlarını yönetin.
          </p>
        </div>

        <button
          type="button"
          className="
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            bg-[#263A2D]
            px-4
            text-xs
            font-medium
            text-white
            transition-colors
            hover:bg-[#344B3A]
          "
        >
          <CalendarDays size={16} />
          Yeni Rezervasyon
        </button>
      </div>

      {/* Toolbar */}
      <div className="mt-8 border border-[#E3E0D8] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#ECE8E1] p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-[360px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#92968E]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Misafir, rezervasyon no veya konaklama ara..."
              className="
                h-10
                w-full
                border
                border-[#DDD9D1]
                bg-[#FAF9F6]
                pl-9
                pr-3
                text-xs
                text-[#263A2D]
                outline-none
                transition-colors
                placeholder:text-[#A3A69F]
                focus:border-[#263A2D]
              "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("Tümü")}
              className={`px-3 py-2 text-[11px] font-medium transition-colors ${
                activeFilter === "Tümü"
                  ? "bg-[#263A2D] text-white"
                  : "border border-[#DDD9D1] text-[#6D726B] hover:border-[#263A2D]"
              }`}
            >
              Tümü
            </button>

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-2 text-[11px] font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-[#263A2D] text-white"
                    : "border border-[#DDD9D1] text-[#6D726B] hover:border-[#263A2D]"
                }`}
              >
                {statusLabels[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {filteredReservations.map((reservation) => (
            <article
              key={reservation.id}
              className="border border-[#E3E0D8] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
                    {reservation.id}
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-[#263A2D]">
                    {reservation.customerName}
                  </h3>

                  <p className="mt-1 text-[11px] text-[#8B8E87]">
                    {reservation.phone}
                  </p>
                </div>

                <span
                  className={`
            inline-flex
            shrink-0
            px-2.5
            py-1
            text-[10px]
            font-medium
            ${getStatusStyles(reservation.status)}
          `}
                >
                  {statusLabels[reservation.status]}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-y border-[#EEEAE3] py-4">
                <div>
                  <p className="text-[10px] text-[#969990]">Konaklama</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.accommodation}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Misafir</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.adultCount + reservation.childCount} kişi
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Giriş</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.checkIn}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Çıkış</p>

                  <p className="mt-1 text-xs font-medium text-[#4C524B]">
                    {reservation.checkOut}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#969990]">Toplam</p>

                  <p className="mt-1 text-base font-semibold text-[#263A2D]">
                    {reservation.totalPrice.toLocaleString("tr-TR")} TL
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReservation(reservation)}
                  className="inline-flex h-9 items-center gap-2 bg-[#263A2D] px-4 text-[11px] font-medium text-white"
                >
                  <Eye size={14} />
                  Görüntüle
                </button>
              </div>
            </article>
          ))}

          {filteredReservations.length === 0 && (
            <div className="border border-[#E3E0D8] bg-white px-4 py-12 text-center">
              <p className="text-sm font-medium text-[#263A2D]">
                Rezervasyon bulunamadı
              </p>

              <p className="mt-1 text-xs text-[#969990]">
                Filtre veya arama kriterlerini değiştirmeyi deneyin.
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#ECE8E1]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Rezervasyon
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Misafir
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Konaklama
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Tarih
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Kişi
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-[#969990]">
                  Tutar
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
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="border-b border-[#F0EDE7] transition-colors last:border-b-0 hover:bg-[#FAF9F6]"
                >
                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-[#263A2D]">
                      {reservation.id}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-[#343A34]">
                      {reservation.customerName}
                    </p>

                    <p className="mt-1 text-[10px] text-[#969990]">
                      {reservation.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-xs text-[#646A63]">
                    {reservation.accommodation}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-[#646A63]">
                      {reservation.checkIn}
                    </p>

                    <p className="mt-1 text-[10px] text-[#969990]">
                      {reservation.checkOut}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-xs text-[#646A63]">
                    {reservation.guestCount}
                  </td>

                  <td className="px-5 py-4 text-xs font-medium text-[#343A34]">
                    {reservation.totalPrice.toLocaleString("tr-TR")} TL
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${getStatusStyles(reservation.status)}
                      `}
                    >
                      {reservation.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReservation(reservation)}
                        aria-label="Rezervasyonu görüntüle"
                        className="
    flex
    h-8
    w-8
    items-center
    justify-center
    border
    border-[#DDD9D1]
    text-[#6A7068]
    transition-colors
    hover:border-[#263A2D]
    hover:text-[#263A2D]
  "
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label="Rezervasyon işlemleri"
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          border
                          border-[#DDD9D1]
                          text-[#6A7068]
                          transition-colors
                          hover:border-[#263A2D]
                          hover:text-[#263A2D]
                        "
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-sm font-medium text-[#263A2D]">
                      Rezervasyon bulunamadı
                    </p>

                    <p className="mt-1 text-xs text-[#969990]">
                      Arama veya filtre kriterlerini değiştirmeyi deneyin.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#ECE8E1] px-5 py-4">
          <p className="text-[11px] text-[#8D918A]">
            Toplam {filteredReservations.length} rezervasyon
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border border-[#DDD9D1] px-3 py-2 text-[11px] text-[#767B74]"
            >
              Önceki
            </button>

            <span className="flex h-8 w-8 items-center justify-center bg-[#263A2D] text-[11px] text-white">
              1
            </span>

            <button
              type="button"
              className="border border-[#DDD9D1] px-3 py-2 text-[11px] text-[#767B74]"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
      <ReservationDetailDrawer
        open={Boolean(selectedReservation)}
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </section>
  );
}
