"use client";

import { ReservationSettingsSection } from "@/components/admin/reservation-form/reservation-settings-section";
import { GuestInformationSection } from "@/components/admin/reservation-form/guest-information-section";
import { AccommodationSelectionSection } from "@/components/admin/reservation-form/accommodation-selection-section";
import { ReservationFormFooter } from "@/components/admin/reservation-form/reservation-form-footer";
import { InitialPaymentSection } from "@/components/admin/reservation-form/initial-payment-section";
import { useAdminReservationForm } from "@/hooks/admin/use-admin-reservation-form";
import type { AdminReservationFormProps } from "@/types/admin-reservation";

export function AdminReservationForm({ accommodations }: AdminReservationFormProps) {
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
    receivedPaymentAmount,
    totalRemainingAmount,
    willBeConfirmed,
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
        totalGuestCount={totalGuestCount}
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
        guestIdentityNumber={guestIdentityNumber}
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
        onGuestIdentityNumberChange={setGuestIdentityNumber}
        onGuestPhoneChange={setGuestPhone}
        onGuestEmailChange={setGuestEmail}
        onAdultCountChange={handleAdultCountChange}
        onChildCountChange={handleChildCountChange}
      />

      <ReservationSettingsSection
        source={source}
        adminNote={adminNote}
        onSourceChange={setSource}
        onAdminNoteChange={setAdminNote}
      />

      <InitialPaymentSection
        hasInitialPayment={hasInitialPayment}
        initialPaymentAmount={initialPaymentAmount}
        initialPaymentMethod={initialPaymentMethod}
        initialPaymentNote={initialPaymentNote}
        totalPrice={totalPrice}
        receivedPaymentAmount={receivedPaymentAmount}
        totalRemainingAmount={totalRemainingAmount}
        willBeConfirmed={willBeConfirmed}
        onHasInitialPaymentChange={(value) => {
          setHasInitialPayment(value);

          if (!value) {
            setInitialPaymentAmount("");
            setInitialPaymentNote("");
          }
        }}
        onInitialPaymentAmountChange={setInitialPaymentAmount}
        onInitialPaymentMethodChange={setInitialPaymentMethod}
        onInitialPaymentNoteChange={setInitialPaymentNote}
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
