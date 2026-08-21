"use client";

import {
  changeReservationRoom,
  getAvailableRooms,
  getAvailableRoomsForReservationDates,
  getReceiptSignedUrl,
  updateReservationDates,
} from "@/app/admin/reservations/action";

import { useReservationDetailState } from "@/hooks/admin/use-reservation-detail-state";

import type { ReservationDetailDrawerProps } from "@/types/admin-reservation-detail";

type UseReservationDetailParams = Pick<
  ReservationDetailDrawerProps,
  "reservation" | "onReject" | "onCancel"
>;

export function useReservationDetail({
  reservation,
  onReject,
  onCancel,
}: UseReservationDetailParams) {
  const state = useReservationDetailState();

  const {
    actionModal,
    setActionModal,
    reason,
    setReason,
    setActionError,
    isActionLoading,
    setIsActionLoading,
    setIsOpeningReceipt,
    setReceiptError,
    setRoomModalOpen,
    setAvailableRooms,
    selectedRoomId,
    setSelectedRoomId,
    setIsLoadingRooms,
    setIsChangingRoom,
    setRoomError,
    dateCheckIn,
    setDateCheckIn,
    dateCheckOut,
    setDateCheckOut,
    setDateModalOpen,
    setDateRooms,
    selectedDateRoomId,
    setSelectedDateRoomId,
    checkedDateRange,
    setCheckedDateRange,
    setIsLoadingDateRooms,
    setIsUpdatingDates,
    setDateError,
  } = state;

  const closeActionModal = () => {
    if (isActionLoading) {
      return;
    }

    setActionModal(null);
    setReason("");
    setActionError(null);
  };

  const handleOpenReceipt = async (storagePath: string) => {
    const cleanStoragePath = storagePath.trim();

    if (!reservation || !cleanStoragePath) {
      return;
    }

    const receiptWindow = window.open("about:blank", "_blank");

    if (!receiptWindow) {
      setReceiptError(
        "Dekont penceresi tarayıcı tarafından engellendi. Lütfen açılır pencerelere izin verin.",
      );

      return;
    }

    receiptWindow.opener = null;

    setReceiptError(null);
    setIsOpeningReceipt(true);

    try {
      const result = await getReceiptSignedUrl(cleanStoragePath);

      if (!result.success || !result.url) {
        receiptWindow.close();

        setReceiptError(result.message ?? "Dekont açılamadı.");

        return;
      }

      receiptWindow.location.replace(result.url);
    } catch (error) {
      console.error(error);

      receiptWindow.close();

      setReceiptError("Dekont açılırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsOpeningReceipt(false);
    }
  };

  const handleModalAction = async () => {
    if (!reservation || !actionModal) {
      return;
    }

    const cleanReason = reason.trim();

    if (cleanReason.length < 5) {
      setActionError("Lütfen en az 5 karakterlik bir açıklama yazın.");

      return;
    }

    setActionError(null);
    setIsActionLoading(true);

    try {
      const result =
        actionModal === "reject"
          ? await onReject(reservation, cleanReason)
          : await onCancel(reservation, cleanReason);

      if (!result.success) {
        setActionError(result.message ?? "İşlem tamamlanamadı.");

        return;
      }

      setActionModal(null);
      setReason("");
    } catch (error) {
      console.error(error);

      setActionError("İşlem sırasında beklenmeyen bir hata oluştu.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenRoomModal = async () => {
    if (!reservation) {
      return;
    }

    setRoomError(null);
    setIsLoadingRooms(true);

    try {
      const result = await getAvailableRooms(reservation.id);

      if (!result.success) {
        setRoomError(result.message ?? "Odalar alınamadı.");

        return;
      }

      setAvailableRooms(result.rooms);

      const current = result.rooms.find((room) => room.isCurrent);

      setSelectedRoomId(current?.id ?? null);
      setRoomModalOpen(true);
    } catch (error) {
      console.error(error);

      setRoomError("Odalar alınırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleChangeRoom = async () => {
    if (!reservation || !selectedRoomId) {
      return;
    }

    setRoomError(null);
    setIsChangingRoom(true);

    try {
      const result = await changeReservationRoom(reservation.id, selectedRoomId);

      if (!result.success) {
        setRoomError(result.message ?? "Oda değiştirilemedi.");

        return;
      }

      setRoomModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);

      setRoomError("Oda değiştirilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsChangingRoom(false);
    }
  };

  const clearDateAvailability = () => {
    setDateRooms([]);
    setSelectedDateRoomId(null);
    setCheckedDateRange(null);
    setDateError(null);
  };

  const handleDateCheckInChange = (value: string) => {
    setDateCheckIn(value);
    clearDateAvailability();

    if (dateCheckOut && value >= dateCheckOut) {
      setDateCheckOut("");
    }
  };

  const handleDateCheckOutChange = (value: string) => {
    setDateCheckOut(value);
    clearDateAvailability();
  };

  const loadDateRooms = async (checkIn: string, checkOut: string) => {
    if (!reservation) {
      return;
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setDateError("Çıkış tarihi giriş tarihinden sonra olmalıdır.");
      return;
    }

    setDateError(null);
    setIsLoadingDateRooms(true);

    try {
      const result = await getAvailableRoomsForReservationDates(
        reservation.id,
        checkIn,
        checkOut,
      );

      if (!result.success) {
        setDateError(result.message ?? "Müsait odalar alınamadı.");
        return;
      }

      setDateRooms(result.rooms);
      setCheckedDateRange(`${checkIn}|${checkOut}`);

      const currentRoom = result.rooms.find((room) => room.isCurrent && room.isAvailable);
      const firstAvailableRoom = result.rooms.find((room) => room.isAvailable);

      setSelectedDateRoomId(currentRoom?.id ?? firstAvailableRoom?.id ?? null);

      if (!firstAvailableRoom) {
        setDateError("Seçilen tarihlerde bu oda tipinde müsait fiziksel oda bulunmuyor.");
      }
    } catch (error) {
      console.error(error);
      setDateError("Müsait odalar alınırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsLoadingDateRooms(false);
    }
  };

  const handleOpenDateModal = () => {
    if (!reservation) {
      return;
    }

    setDateCheckIn(reservation.check_in);
    setDateCheckOut(reservation.check_out);
    setDateRooms([]);
    setSelectedDateRoomId(null);
    setCheckedDateRange(null);
    setDateError(null);
    setDateModalOpen(true);

    void loadDateRooms(reservation.check_in, reservation.check_out);
  };

  const handleCloseDateModal = () => {
    setDateModalOpen(false);
    clearDateAvailability();
  };

  const handleLoadDateRooms = async () => {
    await loadDateRooms(dateCheckIn, dateCheckOut);
  };

  const handleUpdateDates = async () => {
    if (!reservation || !selectedDateRoomId) {
      return;
    }

    if (checkedDateRange !== `${dateCheckIn}|${dateCheckOut}`) {
      setDateError("Önce seçilen tarihler için oda müsaitliğini kontrol edin.");
      return;
    }

    setDateError(null);
    setIsUpdatingDates(true);

    try {
      const result = await updateReservationDates(
        reservation.id,
        dateCheckIn,
        dateCheckOut,
        selectedDateRoomId,
      );

      if (!result.success) {
        setDateError(result.message ?? "Rezervasyon tarihleri güncellenemedi.");
        return;
      }

      setDateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setDateError("Rezervasyon tarihleri güncellenirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsUpdatingDates(false);
    }
  };

  return {
    ...state,
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
  };
}
