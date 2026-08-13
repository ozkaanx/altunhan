"use client";

import {
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Phone,
  Save,
  User,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createAdminReservation,
  getAvailableRoomsForDates,
} from "@/app/admin/reservations/action";

type Accommodation = {
  id: number;
  title: string;
  capacity: number;
  price: number;
};

type AvailableRoom = {
  id: number;
  roomName: string;
  roomNumber: string | null;
};

type AdminReservationFormProps = {
  accommodations: Accommodation[];
};

type ReservationStatus =
  | "pending_payment"
  | "pending_approval"
  | "confirmed";

type ReservationSource =
  | "phone"
  | "whatsapp"
  | "walk_in"
  | "admin";

function getTurkeyToday() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "Europe/Istanbul",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    },
  ).format(
    new Date(),
  );
}

export function AdminReservationForm({
  accommodations,
}: AdminReservationFormProps) {
  const router =
    useRouter();

  const [
    accommodationId,
    setAccommodationId,
  ] =
    useState<number | null>(
      accommodations[0]
        ?.id ??
        null,
    );

  const [
    checkIn,
    setCheckIn,
  ] = useState("");

  const [
    checkOut,
    setCheckOut,
  ] = useState("");

  const [
    guestCount,
    setGuestCount,
  ] = useState(2);

  const [
    guestName,
    setGuestName,
  ] = useState("");

  const [
    guestPhone,
    setGuestPhone,
  ] = useState("");

  const [
    guestEmail,
    setGuestEmail,
  ] = useState("");

  const [
    status,
    setStatus,
  ] =
    useState<ReservationStatus>(
      "confirmed",
    );

  const [
    source,
    setSource,
  ] =
    useState<ReservationSource>(
      "phone",
    );

  const [
    adminNote,
    setAdminNote,
  ] = useState("");

  const [
    availableRooms,
    setAvailableRooms,
  ] =
    useState<
      AvailableRoom[]
    >([]);

  const [
    selectedRoomId,
    setSelectedRoomId,
  ] =
    useState<
      number | null
    >(null);

  const [
    isLoadingRooms,
    setIsLoadingRooms,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    success,
    setSuccess,
  ] =
    useState<
      string | null
    >(null);

  const selectedAccommodation =
    useMemo(
      () =>
        accommodations.find(
          (
            accommodation,
          ) =>
            accommodation.id ===
            accommodationId,
        ) ??
        null,
      [
        accommodations,
        accommodationId,
      ],
    );

  const nightCount =
    useMemo(
      () => {
        if (
          !checkIn ||
          !checkOut ||
          checkOut <= checkIn
        ) {
          return 0;
        }

        const start =
          new Date(
            `${checkIn}T00:00:00Z`,
          );

        const end =
          new Date(
            `${checkOut}T00:00:00Z`,
          );

        const nights =
          Math.round(
            (
              end.getTime() -
              start.getTime()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              ),
          );

        return Math.max(
          0,
          nights,
        );
      },
      [
        checkIn,
        checkOut,
      ],
    );

  const totalPrice =
    selectedAccommodation
      ? Number(
          selectedAccommodation.price,
        ) *
        nightCount
      : 0;

  const today =
    getTurkeyToday();

  const handleAccommodationChange =
    (
      id: number,
    ) => {
      setAccommodationId(
        id,
      );

      setAvailableRooms(
        [],
      );

      setSelectedRoomId(
        null,
      );

      const accommodation =
        accommodations.find(
          (
            item,
          ) =>
            item.id ===
            id,
        );

      if (
        accommodation
      ) {
        setGuestCount(
          Math.min(
            guestCount,
            accommodation.capacity,
          ),
        );
      }

      setError(
        null,
      );
    };

  const handleLoadRooms =
    async () => {
      if (
        !accommodationId
      ) {
        setError(
          "Lütfen oda tipi seçin.",
        );

        return;
      }

      if (
        !checkIn ||
        !checkOut
      ) {
        setError(
          "Önce giriş ve çıkış tarihlerini seçin.",
        );

        return;
      }

      if (
        checkOut <= checkIn
      ) {
        setError(
          "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
        );

        return;
      }

      setError(
        null,
      );

      setSelectedRoomId(
        null,
      );

      setAvailableRooms(
        [],
      );

      setIsLoadingRooms(
        true,
      );

      try {
        const result =
          await getAvailableRoomsForDates(
            accommodationId,
            checkIn,
            checkOut,
          );

        if (
          !result.success
        ) {
          setError(
            result.message ??
              "Müsait odalar alınamadı.",
          );

          return;
        }

        setAvailableRooms(
          result.rooms,
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setError(
          "Müsait odalar alınırken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsLoadingRooms(
          false,
        );
      }
    };

  const handleSubmit =
    async (
      event:
        React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      setError(
        null,
      );

      setSuccess(
        null,
      );

      if (
        !accommodationId
      ) {
        setError(
          "Lütfen oda tipi seçin.",
        );

        return;
      }

      if (
        !checkIn ||
        !checkOut
      ) {
        setError(
          "Lütfen giriş ve çıkış tarihlerini seçin.",
        );

        return;
      }

      if (
        checkOut <= checkIn
      ) {
        setError(
          "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
        );

        return;
      }

      if (
        !guestName.trim()
      ) {
        setError(
          "Misafir adı zorunludur.",
        );

        return;
      }

      if (
        !guestPhone.trim()
      ) {
        setError(
          "Telefon numarası zorunludur.",
        );

        return;
      }

      if (
        selectedAccommodation &&
        guestCount >
          selectedAccommodation.capacity
      ) {
        setError(
          `Bu oda tipinin maksimum kapasitesi ${selectedAccommodation.capacity} kişidir.`,
        );

        return;
      }

      setIsSubmitting(
        true,
      );

      try {
        const result =
          await createAdminReservation(
            {
              accommodationId,

              roomId:
                selectedRoomId,

              checkIn,

              checkOut,

              guestCount,

              guestName,

              guestPhone,

              guestEmail,

              status,

              source,

              adminNote,
            },
          );

        if (
          !result.success
        ) {
          setError(
            result.message ??
              "Rezervasyon oluşturulamadı.",
          );

          return;
        }

        setSuccess(
          `Rezervasyon oluşturuldu: ${result.reservation.reservationCode}`,
        );

        window.setTimeout(
          () => {
            router.push(
              "/admin/reservations",
            );

            router.refresh();
          },
          800,
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        setError(
          "Rezervasyon oluşturulurken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-7 space-y-5"
    >
      {/* KONAKLAMA */}
      <section className="border border-[#E3E0D8] bg-white">
        <SectionTitle
          icon={
            BedDouble
          }
          title="Konaklama Bilgileri"
          description="Oda tipi, tarih ve fiziksel oda seçimi."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <Field
            label="Oda Tipi"
          >
            <select
              value={
                accommodationId ??
                ""
              }
              onChange={(
                event,
              ) =>
                handleAccommodationChange(
                  Number(
                    event
                      .target
                      .value,
                  ),
                )
              }
              className={
                inputClass
              }
            >
              {accommodations.map(
                (
                  accommodation,
                ) => (
                  <option
                    key={
                      accommodation.id
                    }
                    value={
                      accommodation.id
                    }
                  >
                    {
                      accommodation.title
                    }
                  </option>
                ),
              )}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Giriş Tarihi"
            >
              <input
                type="date"
                min={
                  today
                }
                value={
                  checkIn
                }
                onChange={(
                  event,
                ) => {
                  setCheckIn(
                    event
                      .target
                      .value,
                  );

                  setAvailableRooms(
                    [],
                  );

                  setSelectedRoomId(
                    null,
                  );
                }}
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="Çıkış Tarihi"
            >
              <input
                type="date"
                min={
                  checkIn ||
                  today
                }
                value={
                  checkOut
                }
                onChange={(
                  event,
                ) => {
                  setCheckOut(
                    event
                      .target
                      .value,
                  );

                  setAvailableRooms(
                    [],
                  );

                  setSelectedRoomId(
                    null,
                  );
                }}
                className={
                  inputClass
                }
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={
              handleLoadRooms
            }
            disabled={
              isLoadingRooms ||
              !checkIn ||
              !checkOut
            }
            className="flex h-11 w-full items-center justify-center gap-2 border border-[#D7D3CA] bg-[#FAF9F6] px-4 text-xs font-semibold text-[#263A2D] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isLoadingRooms ? (
              <Loader2
                size={
                  15
                }
                className="animate-spin"
              />
            ) : (
              <CalendarDays
                size={
                  15
                }
              />
            )}

            Müsait Odaları Kontrol Et
          </button>

          {availableRooms.length >
            0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-[#40463F]">
                Fiziksel Oda
              </p>

              <select
                value={
                  selectedRoomId ??
                  ""
                }
                onChange={(
                  event,
                ) =>
                  setSelectedRoomId(
                    event
                      .target
                      .value
                      ? Number(
                          event
                            .target
                            .value,
                        )
                      : null,
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  Otomatik oda ata
                </option>

                {availableRooms.map(
                  (
                    room,
                  ) => (
                    <option
                      key={
                        room.id
                      }
                      value={
                        room.id
                      }
                    >
                      {
                        room.roomName
                      }
                      {room.roomNumber
                        ? ` · ${room.roomNumber}`
                        : ""}
                    </option>
                  ),
                )}
              </select>

              <p className="mt-2 text-[10px] leading-5 text-[#969990]">
                Oda seçmezseniz sistem uygun fiziksel odayı otomatik atar.
              </p>
            </div>
          )}

          {checkIn &&
            checkOut &&
            nightCount >
              0 && (
              <div className="grid gap-3 bg-[#FAF8F4] p-4 sm:grid-cols-3">
                <SummaryItem
                  label="Gece"
                  value={`${nightCount}`}
                />

                <SummaryItem
                  label="Gecelik"
                  value={`${Number(
                    selectedAccommodation?.price ??
                      0,
                  ).toLocaleString(
                    "tr-TR",
                  )} TL`}
                />

                <SummaryItem
                  label="Toplam"
                  value={`${totalPrice.toLocaleString(
                    "tr-TR",
                  )} TL`}
                />
              </div>
            )}
        </div>
      </section>

      {/* MİSAFİR */}
      <section className="border border-[#E3E0D8] bg-white">
        <SectionTitle
          icon={
            User
          }
          title="Misafir Bilgileri"
          description="Telefonla veya mesaj üzerinden alınan müşteri bilgileri."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <Field
            label="Ad Soyad"
          >
            <input
              value={
                guestName
              }
              onChange={(
                event,
              ) =>
                setGuestName(
                  event.target
                    .value,
                )
              }
              placeholder="Misafir adı soyadı"
              className={
                inputClass
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Telefon"
            >
              <input
                type="tel"
                value={
                  guestPhone
                }
                onChange={(
                  event,
                ) =>
                  setGuestPhone(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="+90 5__ ___ __ __"
                className={
                  inputClass
                }
              />
            </Field>

            <Field
              label="E-posta"
            >
              <input
                type="email"
                value={
                  guestEmail
                }
                onChange={(
                  event,
                ) =>
                  setGuestEmail(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Opsiyonel"
                className={
                  inputClass
                }
              />
            </Field>
          </div>

          <Field
            label="Misafir Sayısı"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setGuestCount(
                    Math.max(
                      1,
                      guestCount -
                        1,
                    ),
                  )
                }
                className="h-11 w-11 border border-[#DDD9D1] text-lg text-[#263A2D]"
              >
                −
              </button>

              <div className="flex h-11 min-w-[90px] items-center justify-center gap-2 border border-[#DDD9D1] bg-[#FAF9F6] px-4 text-sm font-semibold text-[#263A2D]">
                <Users
                  size={
                    15
                  }
                />

                {
                  guestCount
                }
              </div>

              <button
                type="button"
                onClick={() =>
                  setGuestCount(
                    Math.min(
                      selectedAccommodation
                        ?.capacity ??
                        99,

                      guestCount +
                        1,
                    ),
                  )
                }
                className="h-11 w-11 border border-[#DDD9D1] text-lg text-[#263A2D]"
              >
                +
              </button>

              {selectedAccommodation && (
                <span className="text-[10px] text-[#969990]">
                  Maksimum{" "}
                  {
                    selectedAccommodation.capacity
                  }{" "}
                  kişi
                </span>
              )}
            </div>
          </Field>
        </div>
      </section>

      {/* REZERVASYON */}
      <section className="border border-[#E3E0D8] bg-white">
        <SectionTitle
          icon={
            Phone
          }
          title="Rezervasyon Bilgileri"
          description="Rezervasyonun geldiği kanal ve başlangıç durumu."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Rezervasyon Kaynağı"
            >
              <select
                value={
                  source
                }
                onChange={(
                  event,
                ) =>
                  setSource(
                    event.target
                      .value as ReservationSource,
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="phone">
                  Telefon
                </option>

                <option value="whatsapp">
                  WhatsApp
                </option>

                <option value="walk_in">
                  Resepsiyon / Walk-in
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </Field>

            <Field
              label="Rezervasyon Durumu"
            >
              <select
                value={
                  status
                }
                onChange={(
                  event,
                ) =>
                  setStatus(
                    event.target
                      .value as ReservationStatus,
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="confirmed">
                  Onaylandı
                </option>

                <option value="pending_payment">
                  Ödeme Bekliyor
                </option>

                <option value="pending_approval">
                  Onay Bekliyor
                </option>
              </select>
            </Field>
          </div>

          {status ===
            "pending_payment" && (
            <div className="border border-[#E3D5B8] bg-[#FAF5E9] p-3 text-xs leading-5 text-[#846B38]">
              Ödeme bekleyen manuel rezervasyonlar da mevcut sistemde 1 saatlik oda tutma kuralına tabidir.
            </div>
          )}

          <Field
            label="Admin Notu"
          >
            <textarea
              value={
                adminNote
              }
              onChange={(
                event,
              ) =>
                setAdminNote(
                  event.target
                    .value,
                )
              }
              rows={
                4
              }
              maxLength={
                500
              }
              placeholder="Örn. Telefonla teyit edildi, girişte ödeme yapılacak..."
              className="w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none focus:border-[#263A2D]"
            />
          </Field>
        </div>
      </section>

      {error && (
        <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-4 text-xs leading-5 text-[#98584E]">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 border border-[#CBDDC8] bg-[#EAF2E8] p-4 text-[#456044]">
          <CheckCircle2
            size={
              18
            }
          />

          <p className="text-xs font-medium">
            {success}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/reservations",
            )
          }
          disabled={
            isSubmitting
          }
          className="h-12 border border-[#DDD9D1] bg-white px-6 text-xs font-semibold text-[#263A2D]"
        >
          Vazgeç
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="flex h-12 items-center justify-center gap-2 bg-[#263A2D] px-7 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2
              size={
                16
              }
              className="animate-spin"
            />
          ) : (
            <Save
              size={
                16
              }
            />
          )}

          {isSubmitting
            ? "Oluşturuluyor..."
            : "Rezervasyonu Oluştur"}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon:
    React.ElementType;

  title:
    string;

  description:
    string;
}) {
  return (
    <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon
            size={
              17
            }
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#263A2D]">
            {title}
          </h2>

          <p className="mt-1 text-[10px] leading-4 text-[#969990]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#40463F]">
        {label}
      </label>

      {children}
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#969990]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#263A2D]">
        {value}
      </p>
    </div>
  );
}

const inputClass =
  "h-11 w-full min-w-0 border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-base text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm";