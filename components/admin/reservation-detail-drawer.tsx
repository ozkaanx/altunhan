"use client";

import { ReservationActionModal } from "@/components/admin/reservation-detail/reservation-action-modal";
import { ReservationDateModal } from "@/components/admin/reservation-detail/reservation-date-modal";
import { ReservationRoomModal } from "@/components/admin/reservation-detail/reservation-room-modal";
import { useReservationDetail } from "@/hooks/admin/use-reservation-detail";

import type { ReservationDetailDrawerProps } from "@/types/admin-reservation-detail";
import type { Reservation } from "@/types/reservation";
import { ReservationDrawerHeader } from "@/components/admin/reservation-detail/reservation-drawer-header";
import { ReservationInformation } from "@/components/admin/reservation-detail/reservation-information";
import { ReservationStatusActions } from "@/components/admin/reservation-detail/reservation-status-actions";
import { getTurkeyToday } from "@/lib/reservation/date-utils";

export function ReservationDetailDrawer({
  reservation,
  open,
  onClose,
  onReject,
  onCancel,
  onAdminNoteChange,
}: ReservationDetailDrawerProps) {
  if (!reservation) {
    return null;
  }

  return (
    <ReservationDetailDrawerContent
      reservation={reservation}
      open={open}
      onClose={onClose}
      onReject={onReject}
      onCancel={onCancel}
      onAdminNoteChange={onAdminNoteChange}
    />
  );
}

type ReservationDetailDrawerContentProps = Omit<ReservationDetailDrawerProps, "reservation"> & {
  reservation: Reservation;
};

function ReservationDetailDrawerContent({
  reservation,
  open,
  onClose,
  onReject,
  onCancel,
  onAdminNoteChange,
}: ReservationDetailDrawerContentProps) {
  const {
    actionModal,
    setActionModal,
    reason,
    setReason,
    actionError,
    setActionError,
    isActionLoading,
    isOpeningReceipt,
    receiptError,
    roomModalOpen,
    setRoomModalOpen,
    availableRooms,
    selectedRoomId,
    setSelectedRoomId,
    isLoadingRooms,
    isChangingRoom,
    roomError,
    dateModalOpen,
    dateCheckIn,
    dateCheckOut,
    dateRooms,
    selectedDateRoomId,
    setSelectedDateRoomId,
    checkedDateRange,
    isLoadingDateRooms,
    isUpdatingDates,
    dateError,
    closeActionModal,
    handleOpenReceipt,
    handleModalAction,
    handleOpenRoomModal,
    handleChangeRoom,
    handleOpenDateModal,
    handleCloseDateModal,
    handleDateCheckInChange,
    handleDateCheckOutChange,
    handleLoadDateRooms,
    handleUpdateDates,
  } = useReservationDetail({
    reservation,
    onReject,
    onCancel,
  });

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} `}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-[100dvh] w-full overflow-y-auto bg-[#F8F6F1] shadow-2xl transition-transform duration-300 sm:max-w-[520px] ${open ? "translate-x-0" : "translate-x-full"} `}
      >
        <ReservationDrawerHeader
          reservationCode={reservation.reservation_code}
          guestName={reservation.guest_name}
          onClose={onClose}
          aria-label="Rezervasyon detayını kapat"
        />

        <div className="space-y-4 p-4">
          <ReservationInformation
            reservation={reservation}
            isLoadingRooms={isLoadingRooms}
            isOpeningReceipt={isOpeningReceipt}
            receiptError={receiptError}
            onOpenRoomModal={handleOpenRoomModal}
            onOpenDateModal={handleOpenDateModal}
            onOpenReceipt={handleOpenReceipt}
            onAdminNoteChange={onAdminNoteChange}
          />

          <ReservationStatusActions reservation={reservation} onOpenAction={setActionModal} />
        </div>
      </aside>

      <ReservationActionModal
        action={actionModal}
        reason={reason}
        error={actionError}
        isLoading={isActionLoading}
        onReasonChange={(value) => {
          setReason(value);
          setActionError(null);
        }}
        onClose={closeActionModal}
        onSubmit={handleModalAction}
      />

      <ReservationRoomModal
        open={roomModalOpen}
        rooms={availableRooms}
        selectedRoomId={selectedRoomId}
        error={roomError}
        isChanging={isChangingRoom}
        onSelectRoom={setSelectedRoomId}
        onClose={() => setRoomModalOpen(false)}
        onSubmit={handleChangeRoom}
      />

      <ReservationDateModal
        open={dateModalOpen}
        checkIn={dateCheckIn}
        checkOut={dateCheckOut}
        today={getTurkeyToday()}
        nightlyPrice={Number(reservation.nightly_price)}
        rooms={dateRooms}
        selectedRoomId={selectedDateRoomId}
        error={dateError}
        isLoadingRooms={isLoadingDateRooms}
        isUpdating={isUpdatingDates}
        isAvailabilityCurrent={checkedDateRange === `${dateCheckIn}|${dateCheckOut}`}
        onCheckInChange={handleDateCheckInChange}
        onCheckOutChange={handleDateCheckOutChange}
        onSelectRoom={setSelectedDateRoomId}
        onCheckAvailability={handleLoadDateRooms}
        onClose={handleCloseDateModal}
        onSubmit={handleUpdateDates}
      />
    </>
  );
}
