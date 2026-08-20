"use client";

import type { FormEvent } from "react";

import { useRouter } from "next/navigation";

import { createAdminReservation, getAvailableRoomsForDates } from "@/app/admin/reservations/action";

import { useAdminReservationFormState } from "@/hooks/admin/use-admin-reservation-form-state";

import { normalizeTurkishMobilePhone } from "@/lib/phone";
import { isValidTckn } from "@/lib/identity/tckn";

import type { AdminReservationAccommodation } from "@/types/admin-reservation";

export function useAdminReservationForm(accommodations: AdminReservationAccommodation[]) {
  const router = useRouter();

  const form = useAdminReservationFormState(accommodations);

  const {
    accommodationId,
    setAccommodationId,
    checkIn,
    checkOut,
    adultCount,
    setAdultCount,
    childCount,
    setChildCount,
    guestName,
    guestIdentityNumber,
    guestPhone,
    guestEmail,
    source,
    adminNote,
    hasInitialPayment,
    initialPaymentAmount,
    initialPaymentMethod,
    initialPaymentNote,
    setAvailableRooms,
    selectedRoomId,
    setSelectedRoomId,
    setIsLoadingRooms,
    setIsSubmitting,
    setError,
    setSuccess,
    selectedAccommodation,
    totalGuestCount,
    totalPrice,
  } = form;

  const resetRooms = () => {
    setAvailableRooms([]);
    setSelectedRoomId(null);
  };

  const handleAccommodationChange = (id: number) => {
    setAccommodationId(id);

    resetRooms();

    const accommodation = accommodations.find((item) => item.id === id);

    if (accommodation) {
      const nextAdultCount = Math.max(
        1,
        Math.min(adultCount, accommodation.max_adults, accommodation.max_total_guests),
      );

      const remainingCapacity = Math.max(0, accommodation.max_total_guests - nextAdultCount);

      const nextChildCount = Math.min(childCount, accommodation.max_children, remainingCapacity);

      setAdultCount(nextAdultCount);
      setChildCount(nextChildCount);
    }

    setError(null);
  };

  const handleAdultCountChange = (value: number) => {
    if (!selectedAccommodation) {
      return;
    }

    const maximumAllowed = Math.min(
      selectedAccommodation.max_adults,
      selectedAccommodation.max_total_guests - childCount,
    );

    setAdultCount(Math.max(1, Math.min(value, maximumAllowed)));

    setError(null);
  };

  const handleChildCountChange = (value: number) => {
    if (!selectedAccommodation) {
      return;
    }

    const maximumAllowed = Math.min(
      selectedAccommodation.max_children,
      selectedAccommodation.max_total_guests - adultCount,
    );

    setChildCount(Math.max(0, Math.min(value, maximumAllowed)));

    setError(null);
  };

  const handleLoadRooms = async () => {
    if (!accommodationId) {
      setError("Lütfen oda tipi seçin.");

      return;
    }

    if (!checkIn || !checkOut) {
      setError("Önce giriş ve çıkış tarihlerini seçin.");

      return;
    }

    if (checkOut <= checkIn) {
      setError("Çıkış tarihi giriş tarihinden sonra olmalıdır.");

      return;
    }

    setError(null);
    resetRooms();
    setIsLoadingRooms(true);

    try {
      const result = await getAvailableRoomsForDates(accommodationId, checkIn, checkOut);

      if (!result.success) {
        setError(result.message ?? "Müsait odalar alınamadı.");

        return;
      }

      setAvailableRooms(result.rooms);
    } catch (error) {
      console.error(error);

      setError("Müsait odalar alınırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!accommodationId || !selectedAccommodation) {
      setError("Lütfen oda tipi seçin.");

      return;
    }

    if (!checkIn || !checkOut) {
      setError("Lütfen giriş ve çıkış tarihlerini seçin.");

      return;
    }

    if (checkOut <= checkIn) {
      setError("Çıkış tarihi giriş tarihinden sonra olmalıdır.");

      return;
    }

    if (adultCount < 1) {
      setError("En az 1 yetişkin seçilmelidir.");

      return;
    }

    if (adultCount > selectedAccommodation.max_adults) {
      setError(`Bu oda tipinde en fazla ${selectedAccommodation.max_adults} yetişkin kalabilir.`);

      return;
    }

    if (childCount > selectedAccommodation.max_children) {
      setError(`Bu oda tipinde en fazla ${selectedAccommodation.max_children} çocuk kalabilir.`);

      return;
    }

    if (totalGuestCount > selectedAccommodation.max_total_guests) {
      setError(
        `Bu oda tipinin maksimum toplam kapasitesi ${selectedAccommodation.max_total_guests} kişidir.`,
      );

      return;
    }

    if (!guestName.trim()) {
      setError("Misafir adı zorunludur.");

      return;
    }

    if (!isValidTckn(guestIdentityNumber)) {
      setError("Geçerli bir T.C. kimlik numarası girin.");

      return;
    }

    if (!normalizeTurkishMobilePhone(guestPhone)) {
      setError("Telefon numarasını 5XX XXX XX XX biçiminde girin.");

      return;
    }

    const parsedInitialPaymentAmount = hasInitialPayment ? Number(initialPaymentAmount) : 0;

    if (
      hasInitialPayment &&
      (!Number.isFinite(parsedInitialPaymentAmount) || parsedInitialPaymentAmount <= 0)
    ) {
      setError("Alınan ödeme tutarı sıfırdan büyük olmalıdır.");

      return;
    }

    if (parsedInitialPaymentAmount > totalPrice) {
      setError("Alınan ödeme rezervasyonun toplam tutarından fazla olamaz.");

      return;
    }

    if (initialPaymentNote.trim().length > 500) {
      setError("Ödeme notu en fazla 500 karakter olabilir.");

      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAdminReservation({
        accommodationId,
        roomId: selectedRoomId,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        guestName,
        guestIdentityNumber,
        guestPhone,
        guestEmail,
        source,
        adminNote,
        initialPaymentAmount: parsedInitialPaymentAmount,
        initialPaymentMethod: hasInitialPayment ? initialPaymentMethod : null,
        initialPaymentNote: hasInitialPayment ? initialPaymentNote : "",
      });

      if (!result.success) {
        setError(result.message ?? "Rezervasyon oluşturulamadı.");

        return;
      }

      setSuccess(`Rezervasyon oluşturuldu: ${result.reservation.reservationCode}`);

      window.setTimeout(() => {
        router.push("/admin/reservations");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setError("Rezervasyon oluşturulurken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/reservations");
  };

  return {
    ...form,
    handleAccommodationChange,
    handleAdultCountChange,
    handleChildCountChange,
    resetRooms,
    handleLoadRooms,
    handleSubmit,
    handleCancel,
  };
}
