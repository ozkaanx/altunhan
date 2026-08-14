"use client";

import {
  Baby,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Minus,
  Phone,
  Plus,
  Save,
  User,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import {
  createAdminReservation,
  getAvailableRoomsForDates,
} from "@/app/admin/reservations/action";

type Accommodation = {
  id: number;
  title: string;
  capacity: number;
  price: number;

  max_adults: number;
  max_children: number;
  max_total_guests: number;
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
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).format(new Date());
}

function getDefaultAdultCount(
  accommodation:
    | Accommodation
    | null
    | undefined,
) {
  if (!accommodation) {
    return 1;
  }

  return Math.max(
    1,
    Math.min(
      2,
      accommodation.max_adults,
      accommodation.max_total_guests,
    ),
  );
}

export function AdminReservationForm({
  accommodations,
}: AdminReservationFormProps) {
  const router = useRouter();

  const initialAccommodation =
    accommodations[0] ?? null;

  const [
    accommodationId,
    setAccommodationId,
  ] = useState<number | null>(
    initialAccommodation?.id ?? null,
  );

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [adultCount, setAdultCount] =
    useState(
      getDefaultAdultCount(
        initialAccommodation,
      ),
    );

  const [childCount, setChildCount] =
    useState(0);

  const [guestName, setGuestName] =
    useState("");

  const [guestPhone, setGuestPhone] =
    useState("");

  const [guestEmail, setGuestEmail] =
    useState("");

  const [status, setStatus] =
    useState<ReservationStatus>(
      "confirmed",
    );

  const [source, setSource] =
    useState<ReservationSource>(
      "phone",
    );

  const [adminNote, setAdminNote] =
    useState("");

  const [
    availableRooms,
    setAvailableRooms,
  ] = useState<AvailableRoom[]>([]);

  const [
    selectedRoomId,
    setSelectedRoomId,
  ] = useState<number | null>(null);

  const [
    isLoadingRooms,
    setIsLoadingRooms,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const selectedAccommodation =
    useMemo(
      () =>
        accommodations.find(
          (accommodation) =>
            accommodation.id ===
            accommodationId,
        ) ?? null,
      [
        accommodations,
        accommodationId,
      ],
    );

  const totalGuestCount =
    adultCount + childCount;

  const maxAdults =
    selectedAccommodation
      ?.max_adults ?? 1;

  const maxChildren =
    selectedAccommodation
      ?.max_children ?? 0;

  const maxTotalGuests =
    selectedAccommodation
      ?.max_total_guests ?? 1;

  const canIncreaseAdult =
    Boolean(selectedAccommodation) &&
    adultCount < maxAdults &&
    totalGuestCount <
      maxTotalGuests;

  const canIncreaseChild =
    Boolean(selectedAccommodation) &&
    childCount < maxChildren &&
    totalGuestCount <
      maxTotalGuests;

  const nightCount = useMemo(
    () => {
      if (
        !checkIn ||
        !checkOut ||
        checkOut <= checkIn
      ) {
        return 0;
      }

      const start = new Date(
        `${checkIn}T00:00:00Z`,
      );

      const end = new Date(
        `${checkOut}T00:00:00Z`,
      );

      const nights = Math.round(
        (end.getTime() -
          start.getTime()) /
          (1000 *
            60 *
            60 *
            24),
      );

      return Math.max(
        0,
        nights,
      );
    },
    [checkIn, checkOut],
  );

  const totalPrice =
    selectedAccommodation
      ? Number(
          selectedAccommodation.price,
        ) * nightCount
      : 0;

  const today =
    getTurkeyToday();

  const handleAccommodationChange = (
    id: number,
  ) => {
    setAccommodationId(id);

    setAvailableRooms([]);
    setSelectedRoomId(null);

    const accommodation =
      accommodations.find(
        (item) =>
          item.id === id,
      );

    if (accommodation) {
      const nextAdultCount =
        Math.max(
          1,
          Math.min(
            adultCount,
            accommodation.max_adults,
            accommodation.max_total_guests,
          ),
        );

      const remainingCapacity =
        Math.max(
          0,
          accommodation.max_total_guests -
            nextAdultCount,
        );

      const nextChildCount =
        Math.min(
          childCount,
          accommodation.max_children,
          remainingCapacity,
        );

      setAdultCount(
        nextAdultCount,
      );

      setChildCount(
        nextChildCount,
      );
    }

    setError(null);
  };

  const handleAdultCountChange = (
    value: number,
  ) => {
    if (!selectedAccommodation) {
      return;
    }

    const maximumAllowed =
      Math.min(
        selectedAccommodation.max_adults,
        selectedAccommodation.max_total_guests -
          childCount,
      );

    setAdultCount(
      Math.max(
        1,
        Math.min(
          value,
          maximumAllowed,
        ),
      ),
    );

    setError(null);
  };

  const handleChildCountChange = (
    value: number,
  ) => {
    if (!selectedAccommodation) {
      return;
    }

    const maximumAllowed =
      Math.min(
        selectedAccommodation.max_children,
        selectedAccommodation.max_total_guests -
          adultCount,
      );

    setChildCount(
      Math.max(
        0,
        Math.min(
          value,
          maximumAllowed,
        ),
      ),
    );

    setError(null);
  };

  const resetRooms = () => {
    setAvailableRooms([]);
    setSelectedRoomId(null);
  };

  const handleLoadRooms =
    async () => {
      if (!accommodationId) {
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

      setError(null);
      resetRooms();
      setIsLoadingRooms(true);

      try {
        const result =
          await getAvailableRoomsForDates(
            accommodationId,
            checkIn,
            checkOut,
          );

        if (!result.success) {
          setError(
            result.message ??
              "Müsait odalar alınamadı.",
          );

          return;
        }

        setAvailableRooms(
          result.rooms,
        );
      } catch (error) {
        console.error(error);

        setError(
          "Müsait odalar alınırken beklenmeyen bir hata oluştu.",
        );
      } finally {
        setIsLoadingRooms(
          false,
        );
      }
    };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (
      !accommodationId ||
      !selectedAccommodation
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
      adultCount < 1
    ) {
      setError(
        "En az 1 yetişkin seçilmelidir.",
      );

      return;
    }

    if (
      adultCount >
      selectedAccommodation.max_adults
    ) {
      setError(
        `Bu oda tipinde en fazla ${selectedAccommodation.max_adults} yetişkin kalabilir.`,
      );

      return;
    }

    if (
      childCount >
      selectedAccommodation.max_children
    ) {
      setError(
        `Bu oda tipinde en fazla ${selectedAccommodation.max_children} çocuk kalabilir.`,
      );

      return;
    }

    if (
      totalGuestCount >
      selectedAccommodation.max_total_guests
    ) {
      setError(
        `Bu oda tipinin maksimum toplam kapasitesi ${selectedAccommodation.max_total_guests} kişidir.`,
      );

      return;
    }

    if (!guestName.trim()) {
      setError(
        "Misafir adı zorunludur.",
      );

      return;
    }

    if (!guestPhone.trim()) {
      setError(
        "Telefon numarası zorunludur.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        await createAdminReservation(
          {
            accommodationId,

            roomId:
              selectedRoomId,

            checkIn,

            checkOut,

            adultCount,

            childCount,

            guestName,

            guestPhone,

            guestEmail,

            status,

            source,

            adminNote,
          },
        );

      if (!result.success) {
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
    } catch (error) {
      console.error(error);

      setError(
        "Rezervasyon oluşturulurken beklenmeyen bir hata oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 space-y-5"
    >
      {/* KONAKLAMA */}
      <section className="border border-[#E3E0D8] bg-white">
        <SectionTitle
          icon={BedDouble}
          title="Konaklama Bilgileri"
          description="Oda tipi, tarih ve fiziksel oda seçimi."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <Field label="Oda Tipi">
            <select
              value={
                accommodationId ??
                ""
              }
              onChange={(event) =>
                handleAccommodationChange(
                  Number(
                    event.target.value,
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

          {selectedAccommodation && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 bg-[#F7F5EF] px-4 py-3 text-[10px] text-[#747970]">
              <span>
                En fazla{" "}
                <strong className="text-[#263A2D]">
                  {maxAdults}
                </strong>{" "}
                yetişkin
              </span>

              <span>
                <strong className="text-[#263A2D]">
                  {maxChildren}
                </strong>{" "}
                çocuk
              </span>

              <span>
                Toplam{" "}
                <strong className="text-[#263A2D]">
                  {maxTotalGuests}
                </strong>{" "}
                kişi
              </span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Giriş Tarihi">
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(event) => {
                  setCheckIn(
                    event.target.value,
                  );

                  resetRooms();
                }}
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Çıkış Tarihi">
              <input
                type="date"
                min={
                  checkIn ||
                  today
                }
                value={checkOut}
                onChange={(event) => {
                  setCheckOut(
                    event.target.value,
                  );

                  resetRooms();
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
                size={15}
                className="animate-spin"
              />
            ) : (
              <CalendarDays
                size={15}
              />
            )}

            Müsait Odaları
            Kontrol Et
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
                onChange={(event) =>
                  setSelectedRoomId(
                    event.target
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
                  (room) => (
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
                Oda seçmezseniz
                sistem uygun
                fiziksel odayı
                otomatik atar.
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
          icon={User}
          title="Misafir Bilgileri"
          description="Müşteri ve konaklayacak kişi bilgileri."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <Field label="Ad Soyad">
            <input
              value={guestName}
              onChange={(event) =>
                setGuestName(
                  event.target.value,
                )
              }
              placeholder="Misafir adı soyadı"
              className={
                inputClass
              }
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefon">
              <input
                type="tel"
                value={
                  guestPhone
                }
                onChange={(event) =>
                  setGuestPhone(
                    event.target
                      .value,
                  )
                }
                placeholder="+90 5__ ___ __ __"
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="E-posta">
              <input
                type="email"
                value={
                  guestEmail
                }
                onChange={(event) =>
                  setGuestEmail(
                    event.target
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

          <div>
            <p className="mb-3 text-xs font-medium text-[#40463F]">
              Konaklayacak
              Kişiler
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <GuestCounter
                icon={
                  <User
                    size={16}
                  />
                }
                title="Yetişkin"
                description={`En fazla ${maxAdults}`}
                value={
                  adultCount
                }
                decreaseDisabled={
                  adultCount <=
                  1
                }
                increaseDisabled={
                  !canIncreaseAdult
                }
                onDecrease={() =>
                  handleAdultCountChange(
                    adultCount -
                      1,
                  )
                }
                onIncrease={() =>
                  handleAdultCountChange(
                    adultCount +
                      1,
                  )
                }
              />

              <GuestCounter
                icon={
                  <Baby
                    size={16}
                  />
                }
                title="Çocuk"
                description={`En fazla ${maxChildren}`}
                value={
                  childCount
                }
                decreaseDisabled={
                  childCount <=
                  0
                }
                increaseDisabled={
                  !canIncreaseChild
                }
                onDecrease={() =>
                  handleChildCountChange(
                    childCount -
                      1,
                  )
                }
                onIncrease={() =>
                  handleChildCountChange(
                    childCount +
                      1,
                  )
                }
              />
            </div>

            <div className="mt-3 flex items-center justify-between bg-[#F7F5EF] px-4 py-3">
              <span className="flex items-center gap-2 text-[10px] text-[#81857F]">
                <Users
                  size={14}
                />
                Toplam misafir
              </span>

              <span className="text-xs font-semibold text-[#263A2D]">
                {totalGuestCount}{" "}
                kişi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* REZERVASYON */}
      <section className="border border-[#E3E0D8] bg-white">
        <SectionTitle
          icon={Phone}
          title="Rezervasyon Bilgileri"
          description="Rezervasyonun geldiği kanal ve başlangıç durumu."
        />

        <div className="space-y-5 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rezervasyon Kaynağı">
              <select
                value={source}
                onChange={(event) =>
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
                  Resepsiyon /
                  Walk-in
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </Field>

            <Field label="Rezervasyon Durumu">
              <select
                value={status}
                onChange={(event) =>
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
              Ödeme bekleyen
              manuel
              rezervasyonlar da
              mevcut sistemde 1
              saatlik oda tutma
              kuralına tabidir.
            </div>
          )}

          <Field label="Admin Notu">
            <textarea
              value={adminNote}
              onChange={(event) =>
                setAdminNote(
                  event.target
                    .value,
                )
              }
              rows={4}
              maxLength={500}
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
            size={18}
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
              size={16}
              className="animate-spin"
            />
          ) : (
            <Save size={16} />
          )}

          {isSubmitting
            ? "Oluşturuluyor..."
            : "Rezervasyonu Oluştur"}
        </button>
      </div>
    </form>
  );
}

type GuestCounterProps = {
  icon: ReactNode;
  title: string;
  description: string;
  value: number;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function GuestCounter({
  icon,
  title,
  description,
  value,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
}: GuestCounterProps) {
  return (
    <div className="flex items-center justify-between border border-[#E3E0D8] bg-[#FAF9F6] p-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[#A8754F]">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-[#40463F]">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] text-[#969990]">
            {description}
          </p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center border border-[#DDD9D1] bg-white">
        <button
          type="button"
          aria-label={`${title} azalt`}
          disabled={
            decreaseDisabled
          }
          onClick={
            onDecrease
          }
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus size={13} />
        </button>

        <span className="flex h-9 w-9 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
          {value}
        </span>

        <button
          type="button"
          aria-label={`${title} artır`}
          disabled={
            increaseDisabled
          }
          onClick={
            onIncrease
          }
          className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F1EFE9] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#EEEAE3] px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
          <Icon size={17} />
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
  label: string;
  children: ReactNode;
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
  label: string;
  value: string;
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