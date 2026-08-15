"use client";

import { ReservationSettingsSection } from "@/components/admin/reservation-form/reservation-settings-section";
import { GuestInformationSection } from "@/components/admin/reservation-form/guest-information-section";
import { AccommodationSelectionSection } from "@/components/admin/reservation-form/accommodation-selection-section";
import { ReservationFormFooter } from "@/components/admin/reservation-form/reservation-form-footer";
import { useAdminReservationForm } from "@/hooks/admin/use-admin-reservation-form";
import type { AdminReservationFormProps } from "@/types/admin-reservation";

export function AdminReservationForm({
  accommodations,
}: AdminReservationFormProps) {
  const {
    accommodationId,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    adultCount,
    childCount,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestEmail,
    setGuestEmail,
    status,
    setStatus,
    source,
    setSource,
    adminNote,
    setAdminNote,
    availableRooms,
    selectedRoomId,
    setSelectedRoomId,
    isLoadingRooms,
    isSubmitting,
    error,
    success,
    selectedAccommodation,
    totalGuestCount,
    maxAdults,
    maxChildren,
    maxTotalGuests,
    canIncreaseAdult,
    canIncreaseChild,
    nightCount,
    totalPrice,
    today,
    handleAccommodationChange,
    handleAdultCountChange,
    handleChildCountChange,
    resetRooms,
    handleLoadRooms,
    handleSubmit,
    handleCancel,
  } = useAdminReservationForm(accommodations);

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
      <AccommodationSelectionSection
        accommodations={accommodations}
        accommodationId={accommodationId}
        selectedAccommodation={selectedAccommodation}
        checkIn={checkIn}
        checkOut={checkOut}
        today={today}
        maxAdults={maxAdults}
        maxChildren={maxChildren}
        maxTotalGuests={maxTotalGuests}
        availableRooms={availableRooms}
        selectedRoomId={selectedRoomId}
        isLoadingRooms={isLoadingRooms}
        nightCount={nightCount}
        totalPrice={totalPrice}
        onAccommodationChange={handleAccommodationChange}
        onCheckInChange={(value) => {
          setCheckIn(value);
          resetRooms();
        }}
        onCheckOutChange={(value) => {
          setCheckOut(value);
          resetRooms();
        }}
        onLoadRooms={handleLoadRooms}
        onRoomChange={setSelectedRoomId}
      />

      <GuestInformationSection
        guestName={guestName}
        guestPhone={guestPhone}
        guestEmail={guestEmail}
        adultCount={adultCount}
        childCount={childCount}
        maxAdults={maxAdults}
        maxChildren={maxChildren}
        totalGuestCount={totalGuestCount}
        canIncreaseAdult={canIncreaseAdult}
        canIncreaseChild={canIncreaseChild}
        onGuestNameChange={setGuestName}
        onGuestPhoneChange={setGuestPhone}
        onGuestEmailChange={setGuestEmail}
        onAdultCountChange={handleAdultCountChange}
        onChildCountChange={handleChildCountChange}
      />

      <ReservationSettingsSection
        source={source}
        status={status}
        adminNote={adminNote}
        onSourceChange={setSource}
        onStatusChange={setStatus}
        onAdminNoteChange={setAdminNote}
      />
      <ReservationFormFooter
        error={error}
        success={success}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
      />
    </form>
  );
}
