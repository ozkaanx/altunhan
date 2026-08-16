"use client";

import {
  changeReservationRoom,
  getAvailableRooms,
  getReceiptSignedUrl,
} from "@/app/admin/reservations/action";

import { useReservationDetailState } from "@/hooks/admin/use-reservation-detail-state";

import type { ReservationDetailDrawerProps } from "@/types/admin-reservation-detail";

type UseReservationDetailParams = Pick<
  ReservationDetailDrawerProps,
  "reservation" | "onApprove" | "onReject" | "onCancel"
>;

export function useReservationDetail({
  reservation,
  onApprove,
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
    setIsApproving,
    setApproveError,
    setIsOpeningReceipt,
    setReceiptError,
    setRoomModalOpen,
    setAvailableRooms,
    selectedRoomId,
    setSelectedRoomId,
    setIsLoadingRooms,
    setIsChangingRoom,
    setRoomError,
  } = state;

  const closeActionModal = () => {
    if (isActionLoading) {
      return;
    }

    setActionModal(null);
    setReason("");
    setActionError(null);
  };

  const handleOpenReceipt = async () => {
    if (!reservation?.receipt_storage_path) {
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
      const result = await getReceiptSignedUrl(reservation.receipt_storage_path);

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

  const handleApprove = async () => {
    if (!reservation) {
      return;
    }

    setApproveError(null);
    setIsApproving(true);

    try {
      const result = await onApprove(reservation);

      if (!result.success) {
        setApproveError(result.message ?? "Rezervasyon onaylanamadı.");
      }
    } catch (error) {
      console.error(error);

      setApproveError("Rezervasyon onaylanırken beklenmeyen bir hata oluştu.");
    } finally {
      setIsApproving(false);
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

  return {
    ...state,
    closeActionModal,
    handleOpenReceipt,
    handleApprove,
    handleModalAction,
    handleOpenRoomModal,
    handleChangeRoom,
  };
}
