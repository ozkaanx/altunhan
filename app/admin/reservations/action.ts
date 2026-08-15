"use server";

import {
  createAdminReservation as createAdminReservationAction,
  type CreateAdminReservationInput,
} from "@/app/admin/reservations/actions/create-actions";

import { getReceiptSignedUrl as getReceiptSignedUrlAction } from "@/app/admin/reservations/actions/receipt-actions";

import {
  changeReservationRoom as changeReservationRoomAction,
  getAvailableRooms as getAvailableRoomsAction,
  getAvailableRoomsForDates as getAvailableRoomsForDatesAction,
} from "@/app/admin/reservations/actions/room-actions";

import {
  approveReservation as approveReservationAction,
  cancelReservation as cancelReservationAction,
  rejectReservation as rejectReservationAction,
} from "@/app/admin/reservations/actions/status-actions";

export type { CreateAdminReservationInput };

export async function createAdminReservation(values: CreateAdminReservationInput) {
  return createAdminReservationAction(values);
}

export async function getReceiptSignedUrl(storagePath: string) {
  return getReceiptSignedUrlAction(storagePath);
}

export async function changeReservationRoom(reservationId: number, roomId: number) {
  return changeReservationRoomAction(reservationId, roomId);
}

export async function getAvailableRooms(reservationId: number) {
  return getAvailableRoomsAction(reservationId);
}

export async function getAvailableRoomsForDates(
  accommodationId: number,
  checkIn: string,
  checkOut: string,
) {
  return getAvailableRoomsForDatesAction(accommodationId, checkIn, checkOut);
}

export async function approveReservation(id: number) {
  return approveReservationAction(id);
}

export async function cancelReservation(id: number, reason: string) {
  return cancelReservationAction(id, reason);
}

export async function rejectReservation(id: number, reason: string) {
  return rejectReservationAction(id, reason);
}
