"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Copy,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
  Upload,
  Users,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  createPublicReservation,
  getAccommodationBusyRanges,
  saveReceiptPath,
} from "@/app/rezervasyon/action";

import type { AccommodationBusyRange } from "@/app/rezervasyon/action";

import { createClient } from "@/lib/supabase/client";

import type { PublicAccommodation } from "@/types/public-reservation";
import type { SiteSettings } from "@/types/site-settings";

type ReservationFormProps = {
  accommodations: PublicAccommodation[];
  settings: SiteSettings | null;
  initialAccommodationId?: number | null;
};

type CreatedReservation = {
  id: number;

  reservationCode: string;

  accommodationTitle: string;

  checkIn: string;

  checkOut: string;

  nightCount: number;

  totalPrice: number;
};

function getTurkeyToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",

    year: "numeric",

    month: "2-digit",

    day: "2-digit",
  }).format(new Date());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",

    month: "short",

    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function isDateInsideBusyRange(date: string, range: AccommodationBusyRange) {
  return date >= range.checkIn && date < range.checkOut;
}

function reservationOverlapsRange(
  checkIn: string,
  checkOut: string,
  range: AccommodationBusyRange,
) {
  /*
    Aynı DB constraint mantığı:

    new.checkIn < existing.checkOut
    new.checkOut > existing.checkIn

    [) mantığı kullanıyoruz.

    Örnek:
    Mevcut: 10 -> 13
    Yeni:    13 -> 15

    Çakışma değildir.
  */

  return checkIn < range.checkOut && checkOut > range.checkIn;
}

export function ReservationForm({
  accommodations,
  settings,
  initialAccommodationId,
}: ReservationFormProps) {

  
 const [accommodationId, setAccommodationId] =
  useState<number | null>(
    initialAccommodationId ??
      accommodations[0]?.id ??
      null,
  );

  const [checkIn, setCheckIn] = useState("");

  const [checkOut, setCheckOut] = useState("");

  const [guestCount, setGuestCount] = useState(2);

  const [guestName, setGuestName] = useState("");

  const [guestPhone, setGuestPhone] = useState("");

  const [guestEmail, setGuestEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createdReservation, setCreatedReservation] =
    useState<CreatedReservation | null>(null);

  const [receipt, setReceipt] = useState<File | null>(null);

  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const [receiptSuccess, setReceiptSuccess] = useState(false);

  const [busyRanges, setBusyRanges] = useState<AccommodationBusyRange[]>([]);

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );

  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (accommodation) => accommodation.id === accommodationId,
      ),
    [accommodations, accommodationId],
  );

  const today = getTurkeyToday();

  useEffect(() => {
    let cancelled = false;

    const loadAvailability = async () => {
      if (!accommodationId) {
        setBusyRanges([]);

        return;
      }

      setIsLoadingAvailability(true);

      setAvailabilityError(null);

      try {
        const result = await getAccommodationBusyRanges(accommodationId);

        if (cancelled) {
          return;
        }

        if (!result.success) {
          setBusyRanges([]);

          setAvailabilityError(
            result.message ?? "Müsaitlik bilgisi alınamadı.",
          );

          return;
        }

        setBusyRanges(result.ranges);
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setBusyRanges([]);

          setAvailabilityError("Müsaitlik bilgisi alınamadı.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [accommodationId]);

  const checkInBusyRange = useMemo(() => {
    if (!checkIn) {
      return null;
    }

    return (
      busyRanges.find((range) => isDateInsideBusyRange(checkIn, range)) ?? null
    );
  }, [busyRanges, checkIn]);

  const conflictingRange = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }

    return (
      busyRanges.find((range) =>
        reservationOverlapsRange(checkIn, checkOut, range),
      ) ?? null
    );
  }, [busyRanges, checkIn, checkOut]);

  const dateError = useMemo(() => {
    if (checkIn && checkInBusyRange) {
      return `Seçtiğiniz giriş tarihi dolu. Bu rezervasyon ${formatDate(
        checkInBusyRange.checkIn,
      )} - ${formatDate(
        checkInBusyRange.checkOut,
      )} tarihleri arasını kapsıyor.`;
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      return "Çıkış tarihi giriş tarihinden sonra olmalıdır.";
    }

    if (conflictingRange) {
      return `Seçtiğiniz tarih aralığı dolu bir rezervasyonla çakışıyor: ${formatDate(
        conflictingRange.checkIn,
      )} - ${formatDate(conflictingRange.checkOut)}.`;
    }

    return null;
  }, [checkIn, checkOut, checkInBusyRange, conflictingRange]);

  const estimatedNightCount = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00Z`);

    const end = new Date(`${checkOut}T00:00:00Z`);

    const value = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.max(0, value);
  }, [checkIn, checkOut]);

  const estimatedTotal = selectedAccommodation
    ? Number(selectedAccommodation.price) * estimatedNightCount
    : 0;

  const handleAccommodationChange = (accommodation: PublicAccommodation) => {
    setAccommodationId(accommodation.id);

    /*
        Önceki odanın tarihleri
        yeni oda için geçerli
        olmayabilir.
      */

    setCheckIn("");

    setCheckOut("");

    setError(null);

    setAvailabilityError(null);

    setBusyRanges([]);

    setGuestCount(Math.min(guestCount, accommodation.capacity));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!accommodationId) {
      setError("Lütfen bir konaklama seçin.");

      return;
    }

    if (!checkIn || !checkOut) {
      setError("Lütfen giriş ve çıkış tarihlerini seçin.");

      return;
    }

    if (dateError) {
      setError(dateError);

      return;
    }

    setIsSubmitting(true);

    try {
      /*
          Frontend kontrolünden
          geçmiş olsa bile server
          RPC ve DB constraint
          yeniden kontrol edecek.
        */

      const result = await createPublicReservation({
        accommodationId,

        checkIn,

        checkOut,

        guestCount,

        guestName,

        guestPhone,

        guestEmail,
      });

      if (!result.success) {
        setError(result.message);

        return;
      }

      setCreatedReservation(result.reservation);

      window.scrollTo({
        top: 0,

        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      setError("Rezervasyon oluşturulurken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptUpload = async () => {
    if (!receipt || !createdReservation) {
      return;
    }

    setError(null);

    setIsUploadingReceipt(true);

    try {
      const maxSize = 10 * 1024 * 1024;

      if (receipt.size > maxSize) {
        setError("Dekont en fazla 10 MB olabilir.");

        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];

      if (!allowedTypes.includes(receipt.type)) {
        setError("Sadece JPG, PNG, WEBP veya PDF yükleyebilirsiniz.");

        return;
      }

      const extension = receipt.name.split(".").pop()?.toLowerCase() || "jpg";

      const storagePath = `${createdReservation.reservationCode}/${crypto.randomUUID()}.${extension}`;

      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("reservation-receipts")
        .upload(storagePath, receipt, {
          cacheControl: "3600",

          upsert: false,

          contentType: receipt.type,
        });

      if (uploadError) {
        throw new Error(`Dekont yüklenemedi: ${uploadError.message}`);
      }

      const result = await saveReceiptPath(
        createdReservation.id,
        createdReservation.reservationCode,
        storagePath,
      );

      if (!result.success) {
        await supabase.storage
          .from("reservation-receipts")
          .remove([storagePath]);

        throw new Error(result.message);
      }

      setReceiptSuccess(true);

      setReceipt(null);
    } catch (error) {
      console.error(error);

      setError(error instanceof Error ? error.message : "Dekont yüklenemedi.");
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const copyIban = async () => {
    if (!settings?.iban) {
      return;
    }

    await navigator.clipboard.writeText(settings.iban.replace(/\s/g, ""));
  };

  if (createdReservation) {
    return (
      <div className="mx-auto max-w-[760px]">
        <div className="border border-[#E1DED6] bg-white p-5 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE6] text-[#496449]">
            <CheckCircle2 size={24} />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
            Rezervasyon Talebiniz Alındı
          </p>

          <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
            Ödemenizi tamamlayın.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#70756F]">
            Rezervasyonunuz oluşturuldu. Ödemenizi aşağıdaki hesaba yaptıktan
            sonra dekontunuzu yükleyin.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <DetailCard
              label="Rezervasyon No"
              value={createdReservation.reservationCode}
            />

            <DetailCard
              label="Konaklama"
              value={createdReservation.accommodationTitle}
            />

            <DetailCard
              label="Konaklama Süresi"
              value={`${createdReservation.nightCount} gece`}
            />

            <DetailCard
              label="Toplam Tutar"
              value={`${createdReservation.totalPrice.toLocaleString(
                "tr-TR",
              )} TL`}
            />
          </div>

          <div className="mt-7 border border-[#DDD9D1] bg-[#FAF8F4] p-4 sm:p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A7658]">
              Havale / EFT Bilgileri
            </p>

            <div className="mt-4 space-y-3">
              <BankRow
                label="Hesap Sahibi"
                value={
                  settings?.bank_account_holder ||
                  "Hesap sahibi bilgisi henüz eklenmedi."
                }
              />

              <BankRow
                label="Banka"
                value={settings?.bank_name || "Banka bilgisi henüz eklenmedi."}
              />

              <div>
                <p className="text-[10px] text-[#969990]">IBAN</p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="break-all text-sm font-semibold tracking-wide text-[#263A2D]">
                    {settings?.iban || "IBAN bilgisi henüz eklenmedi."}
                  </p>

                  {settings?.iban && (
                    <button
                      type="button"
                      onClick={copyIban}
                      className="flex h-9 shrink-0 items-center gap-2 border border-[#D7D3CA] bg-white px-3 text-[10px] font-semibold text-[#263A2D]"
                    >
                      <Copy size={13} />
                      Kopyala
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-4 border-t border-[#E5E1D9] pt-4 text-[11px] leading-5 text-[#777B74]">
              Havale açıklamasına{" "}
              <strong className="text-[#263A2D]">
                {createdReservation.reservationCode}
              </strong>{" "}
              yazmanızı rica ederiz.
            </p>
          </div>

          <div className="mt-7">
            <p className="text-sm font-semibold text-[#263A2D]">Dekont Yükle</p>

            <p className="mt-1 text-xs leading-5 text-[#8A8E88]">
              JPG, PNG, WEBP veya PDF. Maksimum 10 MB.
            </p>

            {receiptSuccess ? (
              <div className="mt-4 flex items-center gap-3 bg-[#E8EFE6] p-4 text-sm font-medium text-[#496449]">
                <CheckCircle2 size={18} />
                Dekontunuz başarıyla gönderildi. Rezervasyonunuz yönetici onayı
                bekliyor.
              </div>
            ) : (
              <>
                <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center border border-dashed border-[#CBC7BE] bg-[#FAF9F6] p-4 text-center">
                  <ImagePlus size={27} className="text-[#A8754F]" />

                  <p className="mt-3 text-xs font-semibold text-[#263A2D]">
                    {receipt ? receipt.name : "Dekont Seç"}
                  </p>

                  <p className="mt-1 text-[10px] text-[#969990]">
                    Telefonunuzdan fotoğraf veya PDF seçebilirsiniz.
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(event) =>
                      setReceipt(event.target.files?.[0] ?? null)
                    }
                  />
                </label>

                <button
                  type="button"
                  disabled={!receipt || isUploadingReceipt}
                  onClick={handleReceiptUpload}
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploadingReceipt ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}

                  {isUploadingReceipt
                    ? "Dekont Gönderiliyor..."
                    : "Dekontu Gönder"}
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[900px]">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
            <SectionTitle number="01" title="Konaklamanızı Seçin" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {accommodations.map((accommodation) => {
                const selected = accommodation.id === accommodationId;

                return (
                  <button
                    type="button"
                    key={accommodation.id}
                    onClick={() => handleAccommodationChange(accommodation)}
                    className={`border p-4 text-left transition ${
                      selected
                        ? "border-[#263A2D] bg-[#F0F2EC]"
                        : "border-[#E1DED7] bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#263A2D]">
                      {accommodation.title}
                    </p>

                    {accommodation.short_description && (
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#81857F]">
                        {accommodation.short_description}
                      </p>
                    )}

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.1em] text-[#969990]">
                          Gecelik
                        </p>

                        <p className="mt-1 text-base font-semibold text-[#263A2D]">
                          {Number(accommodation.price).toLocaleString("tr-TR")}{" "}
                          TL
                        </p>
                      </div>

                      <p className="text-[10px] text-[#858A83]">
                        Maks. {accommodation.capacity} kişi
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
            <SectionTitle number="02" title="Tarih ve Misafir" />

            {isLoadingAvailability && (
              <div className="mt-5 flex items-center gap-2 border border-[#E4E1D9] bg-[#F7F6F2] px-3 py-3 text-xs text-[#737871]">
                <Loader2 size={14} className="animate-spin" />
                Müsaitlik kontrol ediliyor...
              </div>
            )}

            {!isLoadingAvailability && busyRanges.length > 0 && (
              <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={17}
                    className="mt-0.5 shrink-0 text-[#9A7041]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-[#765B35]">
                      Dolu Tarihler
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#8B795E]">
                      Aşağıdaki aralıklar rezervasyona kapalıdır.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {busyRanges.slice(0, 8).map((range) => (
                    <span
                      key={`${range.checkIn}-${range.checkOut}`}
                      className="bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#765B35]"
                    >
                      {formatDate(range.checkIn)} → {formatDate(range.checkOut)}
                    </span>
                  ))}
                </div>

                {busyRanges.length > 8 && (
                  <p className="mt-3 text-[10px] text-[#8B795E]">
                    +{busyRanges.length - 8} dolu tarih aralığı daha bulunuyor.
                  </p>
                )}
              </div>
            )}

            {!isLoadingAvailability &&
              busyRanges.length === 0 &&
              !availabilityError && (
                <div className="mt-5 flex items-center gap-2 border border-[#D8E3D5] bg-[#F1F6EF] px-3 py-3 text-xs text-[#526A51]">
                  <CheckCircle2 size={15} />
                  Bu konaklama için yaklaşan dolu tarih bulunmuyor.
                </div>
              )}

            {availabilityError && (
              <div className="mt-5 flex items-start gap-2 border border-[#E7D8C0] bg-[#FAF5EA] p-3 text-xs leading-5 text-[#88662F]">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                {availabilityError} Rezervasyon gönderilirken müsaitlik tekrar
                kontrol edilecek.
              </div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Giriş Tarihi</FieldLabel>

                <div className="relative mt-2">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
                  />

                  <input
                    type="date"
                    min={today}
                    required
                    disabled={isLoadingAvailability}
                    value={checkIn}
                    onChange={(event) => {
                      const value = event.target.value;

                      setCheckIn(value);

                      setError(null);

                      if (checkOut && value >= checkOut) {
                        setCheckOut("");
                      }
                    }}
                    className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Çıkış Tarihi</FieldLabel>

                <div className="relative mt-2">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9E98]"
                  />

                  <input
                    type="date"
                    min={checkIn || today}
                    required
                    disabled={isLoadingAvailability || !checkIn}
                    value={checkOut}
                    onChange={(event) => {
                      setCheckOut(event.target.value);

                      setError(null);
                    }}
                    className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </div>
              </div>
            </div>

            {dateError && (
              <div className="mt-4 flex items-start gap-3 border border-[#E5C7C0] bg-[#F8EEEA] p-4">
                <AlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#98584E]"
                />

                <div>
                  <p className="text-xs font-semibold text-[#98584E]">
                    Bu tarihler müsait değil
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8A635D]">
                    {dateError}
                  </p>

                  <p className="mt-2 text-[10px] text-[#9A746E]">
                    Lütfen farklı giriş veya çıkış tarihi seçin.
                  </p>
                </div>
              </div>
            )}

            {checkIn && checkOut && !dateError && (
              <div className="mt-4 flex items-center gap-2 bg-[#EAF2E8] px-3 py-3 text-xs font-medium text-[#496449]">
                <CheckCircle2 size={15} />
                Seçtiğiniz tarih aralığı şu anda müsait görünüyor.
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[#EEEAE3] pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
                  <Users size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#40463F]">
                    Misafir Sayısı
                  </p>

                  <p className="text-[10px] text-[#969990]">
                    Maksimum {selectedAccommodation?.capacity ?? 1} kişi
                  </p>
                </div>
              </div>

              <div className="flex items-center border border-[#DDD9D1]">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Minus size={14} />
                </button>

                <span className="flex h-10 w-10 items-center justify-center border-x border-[#DDD9D1] text-sm font-semibold text-[#263A2D]">
                  {guestCount}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setGuestCount(
                      Math.min(
                        selectedAccommodation?.capacity ?? 1,

                        guestCount + 1,
                      ),
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
            <SectionTitle number="03" title="İletişim Bilgileriniz" />

            <div className="mt-5 space-y-4">
              <div>
                <FieldLabel>Ad Soyad</FieldLabel>

                <input
                  required
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  placeholder="Adınız ve soyadınız"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Telefon</FieldLabel>

                  <input
                    required
                    type="tel"
                    value={guestPhone}
                    onChange={(event) => setGuestPhone(event.target.value)}
                    placeholder="+90 5__ ___ __ __"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>E-posta</FieldLabel>

                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    placeholder="ornek@mail.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-[#E3E0D8] bg-white p-5 lg:sticky lg:top-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
            Rezervasyon Özeti
          </p>

          <h2 className="mt-2 font-serif text-2xl text-[#263A2D]">
            {selectedAccommodation?.title ?? "Konaklama seçin"}
          </h2>

          <div className="mt-5 space-y-3 border-y border-[#EEEAE3] py-4">
            <SummaryRow
              label="Giriş"
              value={checkIn ? formatDate(checkIn) : "—"}
            />

            <SummaryRow
              label="Çıkış"
              value={checkOut ? formatDate(checkOut) : "—"}
            />

            <SummaryRow label="Misafir" value={`${guestCount} kişi`} />

            <SummaryRow label="Gece" value={`${estimatedNightCount} gece`} />
          </div>

          <div className="mt-5">
            <div className="flex items-end justify-between">
              <p className="text-xs text-[#81857F]">Toplam</p>

              <p className="text-2xl font-semibold text-[#263A2D]">
                {estimatedTotal.toLocaleString("tr-TR")} TL
              </p>
            </div>

            <p className="mt-2 text-[10px] leading-4 text-[#969990]">
              Rezervasyonunuz ödeme ve yönetici onayından sonra kesinleşir.
            </p>
          </div>

          {dateError && (
            <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-[11px] leading-5 text-[#98584E]">
              {dateError}
            </div>
          )}

          {error && error !== dateError && (
            <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-[11px] leading-5 text-[#98584E]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isLoadingAvailability ||
              !accommodationId ||
              !checkIn ||
              !checkOut ||
              Boolean(dateError)
            }
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}

            {isSubmitting
              ? "Rezervasyon Oluşturuluyor..."
              : isLoadingAvailability
                ? "Müsaitlik Kontrol Ediliyor..."
                : dateError
                  ? "Farklı Tarih Seçin"
                  : "Rezervasyon Talebi Oluştur"}
          </button>
        </aside>
      </div>
    </form>
  );
}

const inputClass =
  "mt-2 h-11 w-full border border-[#DDD9D1] bg-[#FAF9F6] px-3 text-sm text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D]";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-[#40463F]">{children}</label>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;

  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.15em] text-[#A8754F]">
        {number}
      </span>

      <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-[#969990]">{label}</span>

      <span className="text-right text-xs font-medium text-[#263A2D]">
        {value}
      </span>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-sm font-semibold text-[#263A2D]">{value}</p>
    </div>
  );
}

function BankRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-sm font-medium text-[#263A2D]">{value}</p>
    </div>
  );
}
