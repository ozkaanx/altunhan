"use client";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Home,
  Loader2,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  findReservation,
} from "@/app/rezervasyon/takip/action";

import type {
  PublicReservationStatus,
  ReservationTrackingResult,
} from "@/types/reservation-tracking";

type TimelineStep = {
  title: string;
  description: string;

  state:
    | "completed"
    | "active"
    | "waiting"
    | "failed";
};

const statusLabels: Record<
  PublicReservationStatus,
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

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T00:00:00`,
    ),
  );
}

function getTimeline(
  reservation: ReservationTrackingResult,
): TimelineStep[] {
  if (
    reservation.status ===
    "rejected"
  ) {
    return [
      {
        title:
          "Rezervasyon Talebi",
        description:
          "Rezervasyon talebiniz alındı.",
        state:
          "completed",
      },

      {
        title:
          "Dekont",
        description:
          reservation.hasReceipt
            ? "Ödeme dekontunuz sisteme yüklendi."
            : "Ödeme dekontu yüklenmedi.",
        state:
          reservation.hasReceipt
            ? "completed"
            : "waiting",
      },

      {
        title:
          "Ödeme Kontrolü",
        description:
          "Rezervasyonunuz yapılan inceleme sonucunda onaylanamadı.",
        state:
          "failed",
      },

      {
        title:
          "Rezervasyon Onayı",
        description:
          "Rezervasyon kesinleşmedi.",
        state:
          "failed",
      },
    ];
  }

  if (
    reservation.status ===
    "cancelled"
  ) {
    return [
      {
        title:
          "Rezervasyon Talebi",
        description:
          "Rezervasyon talebiniz oluşturuldu.",
        state:
          "completed",
      },

      {
        title:
          "Rezervasyon İptal Edildi",
        description:
          "Bu rezervasyon artık aktif değil.",
        state:
          "failed",
      },
    ];
  }

  if (
    reservation.status ===
    "confirmed"
  ) {
    return [
      {
        title:
          "Rezervasyon Talebi",
        description:
          "Rezervasyon talebiniz alındı.",
        state:
          "completed",
      },

      {
        title:
          "Dekont Yüklendi",
        description:
          "Ödeme belgeniz tarafımıza ulaştı.",
        state:
          "completed",
      },

      {
        title:
          "Ödeme Onaylandı",
        description:
          "Ödemeniz kontrol edilerek onaylandı.",
        state:
          "completed",
      },

      {
        title:
          "Rezervasyon Kesinleşti",
        description:
          "Rezervasyonunuz başarıyla onaylandı.",
        state:
          "completed",
      },
    ];
  }

  if (
    reservation.status ===
    "pending_approval"
  ) {
    return [
      {
        title:
          "Rezervasyon Talebi",
        description:
          "Rezervasyon talebiniz alındı.",
        state:
          "completed",
      },

      {
        title:
          "Dekont Yüklendi",
        description:
          "Ödeme belgeniz tarafımıza ulaştı.",
        state:
          "completed",
      },

      {
        title:
          "Ödeme Kontrol Ediliyor",
        description:
          "Dekontunuz Altunhan Farm tarafından kontrol ediliyor.",
        state:
          "active",
      },

      {
        title:
          "Rezervasyon Onayı",
        description:
          "Kontrol tamamlandıktan sonra rezervasyonunuz kesinleşecek.",
        state:
          "waiting",
      },
    ];
  }

  return [
    {
      title:
        "Rezervasyon Talebi",
      description:
        "Rezervasyon talebiniz alındı.",
      state:
        "completed",
    },

    {
      title:
        "Ödeme Bekleniyor",
      description:
        "Rezervasyonunuz için ödeme dekontunuzu yüklemeniz gerekiyor.",
      state:
        "active",
    },

    {
      title:
        "Ödeme Kontrolü",
      description:
        "Dekont yükledikten sonra ödeme kontrol edilecek.",
      state:
        "waiting",
    },

    {
      title:
        "Rezervasyon Onayı",
      description:
        "Ödeme onayından sonra rezervasyonunuz kesinleşecek.",
      state:
        "waiting",
    },
  ];
}

function getStatusBox(
  status: PublicReservationStatus,
) {
  switch (status) {
    case "confirmed":
      return {
        icon:
          CheckCircle2,

        className:
          "border-[#CBDDC8] bg-[#EAF2E8] text-[#456044]",

        title:
          "Rezervasyonunuz Onaylandı",

        description:
          "Rezervasyonunuz kesinleşti. Altunhan Farm sizi bekliyor.",
      };

    case "rejected":
      return {
        icon:
          XCircle,

        className:
          "border-[#E4C6BF] bg-[#F7EBE8] text-[#98584E]",

        title:
          "Rezervasyon Onaylanamadı",

        description:
          "Rezervasyonunuz yapılan kontrol sonucunda onaylanamadı.",
      };

    case "cancelled":
      return {
        icon:
          XCircle,

        className:
          "border-[#DEDCD6] bg-[#EEEEEB] text-[#666B65]",

        title:
          "Rezervasyon İptal Edildi",

        description:
          "Bu rezervasyon artık aktif değil.",
      };

    case "pending_approval":
      return {
        icon:
          Clock3,

        className:
          "border-[#DDD4E8] bg-[#F0EDF6] text-[#655D8A]",

        title:
          "Ödeme Kontrol Ediliyor",

        description:
          "Dekontunuz bize ulaştı. Rezervasyonunuz yönetici onayı bekliyor.",
      };

    default:
      return {
        icon:
          ReceiptText,

        className:
          "border-[#E5D8BE] bg-[#F7F0E3] text-[#88662F]",

        title:
          "Ödeme Bekleniyor",

        description:
          "Rezervasyonunuz oluşturuldu. Dekont yüklemeniz gerekiyor.",
      };
  }
}

export function ReservationTracking() {
  const [
    reservationCode,
    setReservationCode,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    reservation,
    setReservation,
  ] =
    useState<ReservationTrackingResult | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setError(null);
      setReservation(
        null,
      );

      setIsLoading(true);

      try {
        const result =
          await findReservation(
            reservationCode,
            phone,
          );

        if (
          !result.success
        ) {
          setError(
            result.message,
          );

          return;
        }

        setReservation(
          result.reservation,
        );
      } catch (error) {
        console.error(
          error,
        );

        setError(
          "Rezervasyon sorgulanırken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsLoading(
          false,
        );
      }
    };

  const resetSearch =
    () => {
      setReservation(
        null,
      );

      setError(null);
    };

  if (reservation) {
    const timeline =
      getTimeline(
        reservation,
      );

    const statusBox =
      getStatusBox(
        reservation.status,
      );

    const StatusIcon =
      statusBox.icon;

    return (
      <div className="mx-auto max-w-[760px]">
        <button
          type="button"
          onClick={
            resetSearch
          }
          className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-[#777C75]"
        >
          <ArrowLeft
            size={14}
          />

          Başka Rezervasyon
          Sorgula
        </button>

        <div className="border border-[#E3E0D8] bg-white">
          <div className="border-b border-[#EEEAE3] p-5 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
              Rezervasyon
              Durumu
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-serif text-3xl text-[#263A2D]">
                  {
                    reservation.guestName
                  }
                </h1>

                <p className="mt-2 text-xs font-semibold tracking-[0.08em] text-[#7D817B]">
                  {
                    reservation.reservationCode
                  }
                </p>
              </div>

              <span className="w-fit bg-[#F0EFEA] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#60665F]">
                {
                  statusLabels[
                    reservation.status
                  ]
                }
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div
              className={`flex gap-3 border p-4 ${statusBox.className}`}
            >
              <StatusIcon
                size={22}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold">
                  {
                    statusBox.title
                  }
                </p>

                <p className="mt-1 text-xs leading-5 opacity-80">
                  {
                    statusBox.description
                  }
                </p>
              </div>
            </div>

            {reservation.status ===
              "rejected" &&
              reservation.rejectionReason && (
                <div className="mt-4 border border-[#E4C6BF] bg-[#FFF8F6] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
                    Açıklama
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#6D625F]">
                    {
                      reservation.rejectionReason
                    }
                  </p>
                </div>
              )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Detail
                icon={Home}
                label="Konaklama"
                value={
                  reservation.accommodationTitle
                }
              />

              <Detail
                icon={
                  Users
                }
                label="Misafir"
                value={`${reservation.guestCount} kişi`}
              />

              <Detail
                icon={
                  CalendarDays
                }
                label="Giriş"
                value={formatDate(
                  reservation.checkIn,
                )}
              />

              <Detail
                icon={
                  CalendarDays
                }
                label="Çıkış"
                value={formatDate(
                  reservation.checkOut,
                )}
              />
            </div>

            <div className="mt-3 border border-[#E8E4DC] bg-[#FAF9F6] p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] text-[#969990]">
                    Konaklama
                    Süresi
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#263A2D]">
                    {
                      reservation.nightCount
                    }{" "}
                    gece
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-[#969990]">
                    Toplam
                  </p>

                  <p className="mt-1 text-xl font-semibold text-[#263A2D]">
                    {reservation.totalPrice.toLocaleString(
                      "tr-TR",
                    )}{" "}
                    TL
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-[#A8754F]"
                />

                <h2 className="text-sm font-semibold text-[#263A2D]">
                  Rezervasyon
                  Süreci
                </h2>
              </div>

              <div className="mt-5">
                {timeline.map(
                  (
                    step,
                    index,
                  ) => (
                    <TimelineItem
                      key={
                        step.title
                      }
                      step={
                        step
                      }
                      last={
                        index ===
                        timeline.length -
                          1
                      }
                    />
                  ),
                )}
              </div>
            </div>

            {reservation.status ===
              "pending_payment" && (
              <Link
                href="/rezervasyon"
                className="mt-7 flex h-12 w-full items-center justify-center bg-[#263A2D] text-xs font-semibold text-white"
              >
                Ödeme / Dekont
                İşlemine Dön
              </Link>
            )}

            {(reservation.status ===
              "rejected" ||
              reservation.status ===
                "cancelled") && (
              <Link
                href="/#contact"
                className="mt-7 flex h-12 w-full items-center justify-center border border-[#263A2D] text-xs font-semibold text-[#263A2D]"
              >
                Altunhan Farm
                ile İletişime Geç
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="border border-[#E3E0D8] bg-white p-5 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center bg-[#F0EFEA] text-[#A8754F]">
          <Search
            size={21}
          />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Altunhan Farm
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
          Rezervasyonunu
          Takip Et
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#747972]">
          Rezervasyon
          numaranız ve
          rezervasyon sırasında
          kullandığınız telefon
          numarası ile güncel
          durumunuzu
          görüntüleyebilirsiniz.
        </p>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >
          <div>
            <label
              htmlFor="reservation-code"
              className="text-xs font-medium text-[#40463F]"
            >
              Rezervasyon No
            </label>

            <div className="relative mt-2">
              <ReceiptText
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <input
                id="reservation-code"
                required
                value={
                  reservationCode
                }
                onChange={(
                  event,
                ) =>
                  setReservationCode(
                    event.target.value.toUpperCase(),
                  )
                }
                placeholder="AF-20260811-X7K2"
                className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] pl-10 pr-3 text-sm font-medium uppercase tracking-wide text-[#263A2D] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-[#A3A69F] focus:border-[#263A2D]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reservation-phone"
              className="text-xs font-medium text-[#40463F]"
            >
              Telefon
              Numarası
            </label>

            <div className="relative mt-2">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
              />

              <input
                id="reservation-phone"
                type="tel"
                required
                value={phone}
                onChange={(
                  event,
                ) =>
                  setPhone(
                    event.target.value,
                  )
                }
                placeholder="05__ ___ __ __"
                className="h-12 w-full border border-[#DDD9D1] bg-[#FAF9F6] pl-10 pr-3 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]"
              />
            </div>
          </div>

          {error && (
            <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs leading-5 text-[#98584E]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isLoading
            }
            className="flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Search
                size={15}
              />
            )}

            {isLoading
              ? "Sorgulanıyor..."
              : "Rezervasyonumu Bul"}
          </button>
        </form>

        <p className="mt-5 text-center text-[10px] leading-5 text-[#989C96]">
          Rezervasyon
          numaranızı ödeme
          ekranında size
          gösterilen numaradan
          bulabilirsiniz.
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  step,
  last,
}: {
  step: TimelineStep;
  last: boolean;
}) {
  const completed =
    step.state ===
    "completed";

  const active =
    step.state ===
    "active";

  const failed =
    step.state ===
    "failed";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            completed
              ? "bg-[#263A2D] text-white"
              : active
                ? "border-2 border-[#A8754F] bg-[#F7F1EA] text-[#A8754F]"
                : failed
                  ? "bg-[#F2DEDA] text-[#98584E]"
                  : "border border-[#DDD9D1] bg-white text-[#A4A7A1]"
          }`}
        >
          {completed ? (
            <Check
              size={14}
            />
          ) : failed ? (
            <XCircle
              size={14}
            />
          ) : (
            <Clock3
              size={14}
            />
          )}
        </div>

        {!last && (
          <div
            className={`min-h-12 w-px flex-1 ${
              completed
                ? "bg-[#263A2D]"
                : "bg-[#E2DED6]"
            }`}
          />
        )}
      </div>

      <div className="pb-6">
        <p
          className={`text-sm font-semibold ${
            failed
              ? "text-[#98584E]"
              : "text-[#263A2D]"
          }`}
        >
          {step.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#858A83]">
          {
            step.description
          }
        </p>
      </div>
    </div>
  );
}

function Detail({
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
    <div className="flex items-center gap-3 border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white text-[#A8754F]">
        <Icon
          size={16}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-[#969990]">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-[#263A2D]">
          {value}
        </p>
      </div>
    </div>
  );
}