"use client";

import { useMemo, useState } from "react";

import { getDefaultAdultCount, getTurkeyToday } from "@/lib/admin/reservation-form-utils";
import { calculateDepositAmount } from "@/lib/reservation/reservation-utils";

import type {
  AdminAvailableRoom,
  AdminInitialPaymentMethod,
  AdminReservationAccommodation,
  ReservationSource,
} from "@/types/admin-reservation";

export function useAdminReservationFormState(accommodations: AdminReservationAccommodation[]) {
  const initialAccommodation = accommodations[0] ?? null;

  const [accommodationId, setAccommodationId] = useState<number | null>(
    initialAccommodation?.id ?? null,
  );

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adultCount, setAdultCount] = useState(() => getDefaultAdultCount(initialAccommodation));

  const [childCount, setChildCount] = useState(0);

  const [guestName, setGuestName] = useState("");
  const [guestIdentityNumber, setGuestIdentityNumber] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [source, setSource] = useState<ReservationSource>("phone");

  const [adminNote, setAdminNote] = useState("");

  const [hasInitialPayment, setHasInitialPayment] = useState(false);
  const [initialPaymentAmount, setInitialPaymentAmount] = useState("");
  const [initialPaymentMethod, setInitialPaymentMethod] =
    useState<AdminInitialPaymentMethod>("bank_transfer");
  const [initialPaymentNote, setInitialPaymentNote] = useState("");

  const [availableRooms, setAvailableRooms] = useState<AdminAvailableRoom[]>([]);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const selectedAccommodation = useMemo(
    () => accommodations.find((accommodation) => accommodation.id === accommodationId) ?? null,
    [accommodations, accommodationId],
  );

  const totalGuestCount = adultCount + childCount;

  const maxAdults = selectedAccommodation?.max_adults ?? 1;

  const maxChildren = selectedAccommodation?.max_children ?? 0;

  const maxTotalGuests = selectedAccommodation?.max_total_guests ?? 1;

  const canIncreaseAdult =
    Boolean(selectedAccommodation) && adultCount < maxAdults && totalGuestCount < maxTotalGuests;

  const canIncreaseChild =
    Boolean(selectedAccommodation) && childCount < maxChildren && totalGuestCount < maxTotalGuests;

  const nightCount = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return 0;
    }

    const start = new Date(`${checkIn}T00:00:00Z`);

    const end = new Date(`${checkOut}T00:00:00Z`);

    const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return Math.max(0, nights);
  }, [checkIn, checkOut]);

  const totalPrice = selectedAccommodation ? Number(selectedAccommodation.price) * nightCount : 0;

  const depositTargetAmount = calculateDepositAmount(
    Number(selectedAccommodation?.price ?? 0),
    nightCount,
    totalPrice,
  );

  const receivedPaymentAmount = hasInitialPayment ? Number(initialPaymentAmount) || 0 : 0;

  const depositRemainingAmount = Math.max(depositTargetAmount - receivedPaymentAmount, 0);
  const totalRemainingAmount = Math.max(totalPrice - receivedPaymentAmount, 0);
  const willBeConfirmed = depositTargetAmount > 0 && receivedPaymentAmount >= depositTargetAmount;

  const today = getTurkeyToday();

  return {
    accommodationId,
    setAccommodationId,

    checkIn,
    setCheckIn,

    checkOut,
    setCheckOut,

    adultCount,
    setAdultCount,

    childCount,
    setChildCount,

    guestName,
    setGuestName,

    guestIdentityNumber,
    setGuestIdentityNumber,

    guestPhone,
    setGuestPhone,

    guestEmail,
    setGuestEmail,

    source,
    setSource,

    adminNote,
    setAdminNote,

    hasInitialPayment,
    setHasInitialPayment,

    initialPaymentAmount,
    setInitialPaymentAmount,

    initialPaymentMethod,
    setInitialPaymentMethod,

    initialPaymentNote,
    setInitialPaymentNote,

    availableRooms,
    setAvailableRooms,

    selectedRoomId,
    setSelectedRoomId,

    isLoadingRooms,
    setIsLoadingRooms,

    isSubmitting,
    setIsSubmitting,

    error,
    setError,

    success,
    setSuccess,

    selectedAccommodation,
    totalGuestCount,

    maxAdults,
    maxChildren,
    maxTotalGuests,

    canIncreaseAdult,
    canIncreaseChild,

    nightCount,
    totalPrice,
    depositTargetAmount,
    receivedPaymentAmount,
    depositRemainingAmount,
    totalRemainingAmount,
    willBeConfirmed,
    today,
  };
}
