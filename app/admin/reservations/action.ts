"use server";

import {
  createAdminReservation as createAdminReservationAction,
  type CreateAdminReservationInput,
} from "@/app/admin/reservations/actions/create-actions";

import { updateReservationAdminNote as updateReservationAdminNoteAction } from "@/app/admin/reservations/actions/note-actions";

import { getReceiptSignedUrl as getReceiptSignedUrlAction } from "@/app/admin/reservations/actions/receipt-actions";

import {
  recordReservationPayment as recordReservationPaymentAction,
  recordReservationRefund as recordReservationRefundAction,
  rejectReservationPayment as rejectReservationPaymentAction,
  verifyReservationPayment as verifyReservationPaymentAction,
  voidReservationPayment as voidReservationPaymentAction,
} from "@/app/admin/reservations/actions/payment-actions";

import {
  changeReservationRoom as changeReservationRoomAction,
  getAvailableRooms as getAvailableRoomsAction,
  getAvailableRoomsForDates as getAvailableRoomsForDatesAction,
  getAvailableRoomsForReservationDates as getAvailableRoomsForReservationDatesAction,
  updateReservationDates as updateReservationDatesAction,
} from "@/app/admin/reservations/actions/room-actions";

import {
  cancelReservation as cancelReservationAction,
  rejectReservation as rejectReservationAction,
} from "@/app/admin/reservations/actions/status-actions";

export type { CreateAdminReservationInput };

export async function createAdminReservation(values: CreateAdminReservationInput) {
  return createAdminReservationAction(values);
}

export async function updateReservationAdminNote(reservationId: number, adminNote: string) {
  return updateReservationAdminNoteAction(reservationId, adminNote);
}

export async function getReceiptSignedUrl(storagePath: string) {
  return getReceiptSignedUrlAction(storagePath);
}

export async function verifyReservationPayment(paymentId: number, receivedAmount: number) {
  return verifyReservationPaymentAction(paymentId, receivedAmount);
}

export async function rejectReservationPayment(paymentId: number, reason: string) {
  return rejectReservationPaymentAction(paymentId, reason);
}

export async function recordReservationPayment(
  reservationId: number,
  amount: number,
  paymentMethod: import("@/types/reservation").ReservationPaymentMethod,
  adminNote: string,
) {
  return recordReservationPaymentAction(reservationId, amount, paymentMethod, adminNote);
}

export async function recordReservationRefund(
  reservationId: number,
  amount: number,
  paymentMethod: import("@/types/reservation").ReservationPaymentMethod,
  reason: string,
) {
  return recordReservationRefundAction(reservationId, amount, paymentMethod, reason);
}

export async function voidReservationPayment(paymentId: number, reason: string) {
  return voidReservationPaymentAction(paymentId, reason);
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

export async function getAvailableRoomsForReservationDates(
  reservationId: number,
  checkIn: string,
  checkOut: string,
) {
  return getAvailableRoomsForReservationDatesAction(reservationId, checkIn, checkOut);
}

export async function updateReservationDates(
  reservationId: number,
  checkIn: string,
  checkOut: string,
  roomId: number,
) {
  return updateReservationDatesAction(reservationId, checkIn, checkOut, roomId);
}

export async function cancelReservation(id: number, reason: string) {
  return cancelReservationAction(id, reason);
}

export async function rejectReservation(id: number, reason: string) {
  return rejectReservationAction(id, reason);
}
