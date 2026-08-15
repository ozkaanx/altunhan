"use client";

import { useState } from "react";

import type {
  ReservationDrawerAction,
  ReservationRoomOption,
} from "@/types/admin-reservation-detail";

export function useReservationDetailState() {
  const [actionModal, setActionModal] = useState<ReservationDrawerAction | null>(null);

  const [reason, setReason] = useState("");

  const [actionError, setActionError] = useState<string | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isApproving, setIsApproving] = useState(false);

  const [approveError, setApproveError] = useState<string | null>(null);

  const [isOpeningReceipt, setIsOpeningReceipt] = useState(false);

  const [receiptError, setReceiptError] = useState<string | null>(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const [availableRooms, setAvailableRooms] = useState<ReservationRoomOption[]>([]);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const [isChangingRoom, setIsChangingRoom] = useState(false);

  const [roomError, setRoomError] = useState<string | null>(null);

  return {
    actionModal,
    setActionModal,
    reason,
    setReason,
    actionError,
    setActionError,
    isActionLoading,
    setIsActionLoading,
    isApproving,
    setIsApproving,
    approveError,
    setApproveError,
    isOpeningReceipt,
    setIsOpeningReceipt,
    receiptError,
    setReceiptError,
    roomModalOpen,
    setRoomModalOpen,
    availableRooms,
    setAvailableRooms,
    selectedRoomId,
    setSelectedRoomId,
    isLoadingRooms,
    setIsLoadingRooms,
    isChangingRoom,
    setIsChangingRoom,
    roomError,
    setRoomError,
  };
}
