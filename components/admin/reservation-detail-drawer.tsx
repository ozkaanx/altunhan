"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Phone,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

type ReservationStatus =
  | "pending_payment"
  | "payment_review"
  | "confirmed"
  | "cancelled"
  | "completed";

export type ReservationDetail = {
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

type ReservationDetailDrawerProps = {
  reservation: ReservationDetail | null;
  open: boolean;
  onClose: () => void;
};

const statusLabels: Record<ReservationStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",
  payment_review: "Ödeme Kontrolünde",
  confirmed: "Onaylandı",
  cancelled: "İptal Edildi",
  completed: "Tamamlandı",
};

function getStatusClasses(status: ReservationStatus) {
  switch (status) {
    case "pending_payment":
      return "bg-[#F5ECDD] text-[#956B35]";

    case "payment_review":
      return "bg-[#E8E6F2] text-[#655E8A]";

    case "confirmed":
      return "bg-[#E6EFE6] text-[#496249]";

    case "cancelled":
      return "bg-[#F3E2DE] text-[#9C5148]";

    case "completed":
      return "bg-[#E7E9EA] text-[#5F676B]";
  }
}

export function ReservationDetailDrawer({
  reservation,
  open,
  onClose,
}: ReservationDetailDrawerProps) {
  const [status, setStatus] = useState<ReservationStatus | null>(
    reservation?.status ?? null,
  );

  if (!reservation) return null;

  const currentStatus = status ?? reservation.status;

  const approvePayment = () => {
    setStatus("confirmed");

    console.log("Ödeme onaylandı:", reservation.id);
  };

  const rejectPayment = () => {
    setStatus("pending_payment");

    console.log("Ödeme reddedildi:", reservation.id);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
  fixed
  right-0
  top-0
  z-50
  h-[100dvh]
  w-full
  overflow-y-auto
  bg-[#F8F6F1]
  shadow-2xl
  transition-transform
  duration-300
  ease-out
  sm:max-w-[520px]
  ${open ? "translate-x-0" : "translate-x-full"}
`}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed
          right-0
          top-0
          z-50
          h-screen
          w-full
          max-w-[520px]
          overflow-y-auto
          bg-[#F8F6F1]
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E3E0D8] bg-[#F8F6F1] px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A8754F]">
              Rezervasyon
            </p>

            <h2 className="mt-1 text-xl font-semibold text-[#263A2D]">
              {reservation.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-9 w-9 items-center justify-center border border-[#DDD9D1] text-[#6A7068] transition-colors hover:border-[#263A2D] hover:text-[#263A2D]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Status */}
          <section className="border border-[#E3E0D8] bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#969990]">
              Durum
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span
                className={`
                  inline-flex
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  ${getStatusClasses(currentStatus)}
                `}
              >
                {statusLabels[currentStatus]}
              </span>

              <select
                value={currentStatus}
                onChange={(event) =>
                  setStatus(event.target.value as ReservationStatus)
                }
                className="h-9 border border-[#DDD9D1] bg-white px-3 text-xs text-[#263A2D] outline-none focus:border-[#263A2D]"
              >
                <option value="pending_payment">Ödeme Bekleniyor</option>

                <option value="payment_review">Ödeme Kontrolünde</option>

                <option value="confirmed">Onaylandı</option>

                <option value="cancelled">İptal Edildi</option>

                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </section>

          {/* Customer */}
          <section className="border border-[#E3E0D8] bg-white">
            <div className="border-b border-[#ECE8E1] px-5 py-4">
              <h3 className="text-sm font-semibold text-[#263A2D]">
                Misafir Bilgileri
              </h3>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <UserRound size={17} className="mt-0.5 text-[#A8754F]" />

                <div>
                  <p className="text-[10px] text-[#969990]">Ad Soyad</p>

                  <p className="mt-1 text-xs font-medium text-[#343A34]">
                    {reservation.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 text-[#A8754F]" />

                <div>
                  <p className="text-[10px] text-[#969990]">Telefon</p>

                  <a
                    href={`tel:${reservation.phone}`}
                    className="mt-1 block text-xs font-medium text-[#343A34]"
                  >
                    {reservation.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 text-[#A8754F]" />

                <div>
                  <p className="text-[10px] text-[#969990]">E-posta</p>

                  <a
                    href={`mailto:${reservation.email}`}
                    className="mt-1 block text-xs font-medium text-[#343A34]"
                  >
                    {reservation.email}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Stay */}
          <section className="border border-[#E3E0D8] bg-white">
            <div className="border-b border-[#ECE8E1] px-5 py-4">
              <h3 className="text-sm font-semibold text-[#263A2D]">
                Konaklama
              </h3>
            </div>

            <div className="p-5">
              <p className="text-sm font-semibold text-[#263A2D]">
                {reservation.accommodation}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#969990]">Giriş</p>

                  <p className="mt-1 text-xs text-[#4D534C]">
                    {reservation.checkIn}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Çıkış</p>

                  <p className="mt-1 text-xs text-[#4D534C]">
                    {reservation.checkOut}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Yetişkin</p>

                  <p className="mt-1 text-xs text-[#4D534C]">
                    {reservation.adultCount}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">Çocuk</p>

                  <p className="mt-1 text-xs text-[#4D534C]">
                    {reservation.childCount}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="border border-[#D9D4C9] bg-[#263A2D] p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/50">
              Toplam Tutar
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {reservation.totalPrice.toLocaleString("tr-TR")} TL
            </p>
          </section>

          {/* Receipt */}
          <section className="border border-[#E3E0D8] bg-white">
            <div className="flex items-center justify-between border-b border-[#ECE8E1] px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-[#263A2D]">
                  Ödeme Dekontu
                </h3>

                <p className="mt-1 text-[10px] text-[#969990]">
                  Misafirin yüklediği banka dekontu
                </p>
              </div>

              <FileText size={20} className="text-[#A8754F]" />
            </div>

            <div className="p-5">
              {reservation.paymentReceiptUrl ? (
                <>
                  <div className="flex min-h-[130px] items-center justify-center border border-dashed border-[#D9D5CD] bg-[#FAF9F6]">
                    <div className="text-center">
                      <FileText size={28} className="mx-auto text-[#A8754F]" />

                      <p className="mt-3 text-xs font-medium text-[#263A2D]">
                        Ödeme Dekontu
                      </p>

                      <p className="mt-1 text-[10px] text-[#969990]">
                        PDF / JPG / PNG
                      </p>
                    </div>
                  </div>

                  <a
                    href={reservation.paymentReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[#DDD9D1] text-xs font-medium text-[#263A2D] transition-colors hover:border-[#263A2D]"
                  >
                    <Download size={15} />
                    Dekontu Görüntüle
                  </a>
                </>
              ) : (
                <div className="border border-dashed border-[#D9D5CD] bg-[#FAF9F6] px-4 py-10 text-center">
                  <FileText size={26} className="mx-auto text-[#B0ADA5]" />

                  <p className="mt-3 text-xs font-medium text-[#686D66]">
                    Henüz dekont yüklenmedi
                  </p>

                  <p className="mt-1 text-[10px] text-[#9B9E97]">
                    Ödeme bekleniyor.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Note */}
          {reservation.note && (
            <section className="border border-[#E3E0D8] bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#969990]">
                Misafir Notu
              </p>

              <p className="mt-3 text-xs leading-5 text-[#5E645D]">
                {reservation.note}
              </p>
            </section>
          )}

          {/* Payment Actions */}
          {reservation.paymentReceiptUrl &&
            currentStatus === "payment_review" && (
              <section className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={approvePayment}
                  className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white transition-colors hover:bg-[#344B3A]"
                >
                  <CheckCircle2 size={16} />
                  Ödemeyi Onayla
                </button>

                <button
                  type="button"
                  onClick={rejectPayment}
                  className="flex h-11 items-center justify-center gap-2 border border-[#CDAFA5] bg-[#F8EEEA] text-xs font-semibold text-[#97594B] transition-colors hover:bg-[#F2E1DA]"
                >
                  <XCircle size={16} />
                  Ödemeyi Reddet
                </button>
              </section>
            )}
        </div>
      </aside>
    </>
  );
}
