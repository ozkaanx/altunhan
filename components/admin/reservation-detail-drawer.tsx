"use client";

import {
  CalendarDays,
  Check,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  getReceiptSignedUrl,
} from "@/app/admin/reservations/action";

import type {
  Reservation,
} from "@/types/reservation";

type ActionResult = {
  success: boolean;
  message?: string;
};

type ReservationDetailDrawerProps = {
  reservation:
    | Reservation
    | null;

  open: boolean;

  onClose: () => void;

  onApprove: (
    reservation: Reservation,
  ) => Promise<ActionResult>;

  onReject: (
    reservation: Reservation,
    reason: string,
  ) => Promise<ActionResult>;
};

export function ReservationDetailDrawer({
  reservation,
  open,
  onClose,
  onApprove,
  onReject,
}: ReservationDetailDrawerProps) {
  const [
    isOpeningReceipt,
    setIsOpeningReceipt,
  ] =
    useState(false);

  const [
    receiptError,
    setReceiptError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isApproving,
    setIsApproving,
  ] =
    useState(false);

  const [
    approveError,
    setApproveError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    rejectModalOpen,
    setRejectModalOpen,
  ] =
    useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] =
    useState("");

  const [
    rejectError,
    setRejectError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isRejecting,
    setIsRejecting,
  ] =
    useState(false);

  if (!reservation) {
    return null;
  }

  const handleOpenReceipt =
    async () => {
      if (
        !reservation.receipt_storage_path
      ) {
        return;
      }

      setReceiptError(
        null,
      );

      setIsOpeningReceipt(
        true,
      );

      try {
        const result =
          await getReceiptSignedUrl(
            reservation.receipt_storage_path,
          );

        if (
          !result.success ||
          !result.url
        ) {
          setReceiptError(
            result.message,
          );

          return;
        }

        window.open(
          result.url,
          "_blank",
          "noopener,noreferrer",
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setReceiptError(
          "Dekont açılırken bir hata oluştu.",
        );
      } finally {
        setIsOpeningReceipt(
          false,
        );
      }
    };

  const handleApprove =
    async () => {
      setApproveError(
        null,
      );

      setIsApproving(
        true,
      );

      try {
        const result =
          await onApprove(
            reservation,
          );

        if (
          !result.success
        ) {
          setApproveError(
            result.message ??
              "Rezervasyon onaylanamadı.",
          );
        }
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setApproveError(
          "Rezervasyon onaylanırken bir hata oluştu.",
        );
      } finally {
        setIsApproving(
          false,
        );
      }
    };

  const openRejectModal =
    () => {
      setRejectError(
        null,
      );

      setRejectionReason(
        "",
      );

      setRejectModalOpen(
        true,
      );
    };

  const closeRejectModal =
    () => {
      if (
        isRejecting
      ) {
        return;
      }

      setRejectModalOpen(
        false,
      );

      setRejectError(
        null,
      );

      setRejectionReason(
        "",
      );
    };

  const handleReject =
    async () => {
      const reason =
        rejectionReason.trim();

      if (
        reason.length < 5
      ) {
        setRejectError(
          "Lütfen en az 5 karakterlik bir red sebebi yazın.",
        );

        return;
      }

      setRejectError(
        null,
      );

      setIsRejecting(
        true,
      );

      try {
        const result =
          await onReject(
            reservation,
            reason,
          );

        if (
          !result.success
        ) {
          setRejectError(
            result.message ??
              "Rezervasyon reddedilemedi.",
          );

          return;
        }

        setRejectModalOpen(
          false,
        );

        setRejectionReason(
          "",
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setRejectError(
          "Rezervasyon reddedilirken bir hata oluştu.",
        );
      } finally {
        setIsRejecting(
          false,
        );
      }
    };

  return (
    <>
      <button
        type="button"
        onClick={
          onClose
        }
        aria-label="Detayı kapat"
        className={`
          fixed
          inset-0
          z-40
          bg-black/30
          transition-opacity
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      <aside
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
          sm:max-w-[520px]
          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E1D8] bg-white px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
              {
                reservation.reservation_code
              }
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#263A2D]">
              {
                reservation.guest_name
              }
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-10 w-10 items-center justify-center border border-[#DDD9D1]"
          >
            <X
              size={
                18
              }
            />
          </button>
        </header>

        <div className="space-y-4 p-4">
          <section className="border border-[#E3E0D8] bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8B8E87]">
              Misafir
              Bilgileri
            </h3>

            <div className="mt-4 space-y-3">
              <InfoRow
                icon={
                  User
                }
                label="Ad Soyad"
                value={
                  reservation.guest_name
                }
              />

              <InfoRow
                icon={
                  Phone
                }
                label="Telefon"
                value={
                  reservation.guest_phone
                }
              />

              {reservation.guest_email && (
                <InfoRow
                  icon={
                    Mail
                  }
                  label="E-posta"
                  value={
                    reservation.guest_email
                  }
                />
              )}
            </div>
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8B8E87]">
              Konaklama
            </h3>

            <div className="mt-4 space-y-4">
              <InfoRow
                icon={
                  CalendarDays
                }
                label="Konaklama"
                value={
                  reservation
                    .accommodations
                    ?.title ??
                  "—"
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-[#969990]">
                    Giriş
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#263A2D]">
                    {
                      reservation.check_in
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">
                    Çıkış
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#263A2D]">
                    {
                      reservation.check_out
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">
                    Gece
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#263A2D]">
                    {
                      reservation.night_count
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-[#969990]">
                    Misafir
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#263A2D]">
                    {
                      reservation.guest_count
                    }{" "}
                    kişi
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8B8E87]">
              Ödeme
            </h3>

            <div className="mt-4">
              <p className="text-[10px] text-[#969990]">
                Toplam
              </p>

              <p className="mt-1 text-2xl font-semibold text-[#263A2D]">
                {Number(
                  reservation.total_price,
                ).toLocaleString(
                  "tr-TR",
                )}{" "}
                TL
              </p>

              <p className="mt-2 text-xs text-[#777B74]">
                {
                  reservation.night_count
                }{" "}
                gece ×{" "}
                {Number(
                  reservation.nightly_price,
                ).toLocaleString(
                  "tr-TR",
                )}{" "}
                TL
              </p>
            </div>

            <div className="mt-4 border-t border-[#EEEAE3] pt-4">
              {reservation.receipt_storage_path ? (
                <div>
                  <div className="flex items-center justify-between gap-3 bg-[#EAF1E8] px-3 py-3">
                    <div>
                      <p className="text-xs font-semibold text-[#567054]">
                        Dekont
                        yüklendi
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#71866F]">
                        Ödeme
                        belgesini
                        kontrol
                        edin.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        isOpeningReceipt
                      }
                      onClick={
                        handleOpenReceipt
                      }
                      className="flex h-9 shrink-0 items-center gap-2 bg-[#263A2D] px-3 text-[10px] font-semibold text-white disabled:opacity-60"
                    >
                      {isOpeningReceipt ? (
                        <Loader2
                          size={
                            14
                          }
                          className="animate-spin"
                        />
                      ) : (
                        <ExternalLink
                          size={
                            14
                          }
                        />
                      )}

                      {isOpeningReceipt
                        ? "Açılıyor..."
                        : "Dekontu Gör"}
                    </button>
                  </div>

                  {receiptError && (
                    <p className="mt-2 text-[10px] text-[#9C5148]">
                      {
                        receiptError
                      }
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-[#F4EBDC] px-3 py-3 text-xs font-medium text-[#8A642F]">
                  Dekont henüz
                  yüklenmedi
                </div>
              )}
            </div>
          </section>

          {reservation.status ===
            "rejected" &&
            reservation.rejection_reason && (
              <section className="border border-[#E4C6BF] bg-[#FFF8F6] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
                  Red Sebebi
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6D625F]">
                  {
                    reservation.rejection_reason
                  }
                </p>
              </section>
            )}

          {approveError && (
            <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
              {
                approveError
              }
            </div>
          )}

          {reservation.status ===
            "pending_approval" && (
            <section className="grid grid-cols-2 gap-3 pb-4">
              <button
                type="button"
                disabled={
                  isApproving
                }
                onClick={
                  openRejectModal
                }
                className="flex h-12 items-center justify-center gap-2 border border-[#D9B8B2] bg-white text-xs font-semibold text-[#9C5148] disabled:opacity-50"
              >
                <XCircle
                  size={
                    16
                  }
                />

                Reddet
              </button>

              <button
                type="button"
                disabled={
                  isApproving
                }
                onClick={
                  handleApprove
                }
                className="flex h-12 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-60"
              >
                {isApproving ? (
                  <Loader2
                    size={
                      16
                    }
                    className="animate-spin"
                  />
                ) : (
                  <Check
                    size={
                      16
                    }
                  />
                )}

                {isApproving
                  ? "Onaylanıyor..."
                  : "Onayla"}
              </button>
            </section>
          )}
        </div>
      </aside>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Modalı kapat"
            onClick={
              closeRejectModal
            }
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full bg-white p-5 shadow-2xl sm:max-w-[480px] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9C5148]">
                  Rezervasyonu
                  Reddet
                </p>

                <h3 className="mt-2 text-xl font-semibold text-[#263A2D]">
                  Red sebebi
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#7D817B]">
                  Yazdığınız
                  açıklama
                  müşterinin
                  rezervasyon
                  takip ekranında
                  gösterilecek.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  isRejecting
                }
                onClick={
                  closeRejectModal
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#DDD9D1] disabled:opacity-50"
              >
                <X
                  size={
                    16
                  }
                />
              </button>
            </div>

            <div className="mt-5">
              <label
                htmlFor="rejection-reason"
                className="text-xs font-medium text-[#40463F]"
              >
                Müşteriye
                gösterilecek
                açıklama
              </label>

              <textarea
                id="rejection-reason"
                value={
                  rejectionReason
                }
                maxLength={
                  500
                }
                rows={5}
                disabled={
                  isRejecting
                }
                onChange={(
                  event,
                ) => {
                  setRejectionReason(
                    event
                      .target
                      .value,
                  );

                  setRejectError(
                    null,
                  );
                }}
                placeholder="Örneğin: Gönderilen ödeme tutarı rezervasyon tutarıyla eşleşmiyor."
                className="mt-2 w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#9C5148]"
              />

              <div className="mt-1 flex items-center justify-between">
                <p className="text-[10px] text-[#969990]">
                  Minimum 5
                  karakter
                </p>

                <p className="text-[10px] text-[#969990]">
                  {
                    rejectionReason.length
                  }
                  /500
                </p>
              </div>
            </div>

            {rejectError && (
              <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]">
                {
                  rejectError
                }
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={
                  isRejecting
                }
                onClick={
                  closeRejectModal
                }
                className="h-11 border border-[#DDD9D1] bg-white text-xs font-semibold text-[#60655F] disabled:opacity-50"
              >
                Vazgeç
              </button>

              <button
                type="button"
                disabled={
                  isRejecting ||
                  rejectionReason
                    .trim()
                    .length <
                    5
                }
                onClick={
                  handleReject
                }
                className="flex h-11 items-center justify-center gap-2 bg-[#9C5148] px-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRejecting ? (
                  <Loader2
                    size={
                      15
                    }
                    className="animate-spin"
                  />
                ) : (
                  <XCircle
                    size={
                      15
                    }
                  />
                )}

                {isRejecting
                  ? "Reddediliyor..."
                  : "Rezervasyonu Reddet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon:
    React.ElementType;

  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
        <Icon
          size={
            16
          }
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-[#969990]">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs font-medium text-[#263A2D]">
          {value}
        </p>
      </div>
    </div>
  );
}