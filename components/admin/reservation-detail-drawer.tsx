"use client";

import {
  Ban,
  CalendarDays,
  Check,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  User,
  X,
  XCircle,
  BedDouble,
} from "lucide-react";

import { useState } from "react";

import {
  getReceiptSignedUrl,
  changeReservationRoom,
  getAvailableRooms,
} from "@/app/admin/reservations/action";

import type { Reservation } from "@/types/reservation";

type AvailableRoom = {
  id: number;
  roomName: string;
  roomNumber: string | null;
  isCurrent: boolean;
  isAvailable: boolean;
};

type ActionResult = {
  success: boolean;

  message?: string;
};

type ReservationDetailDrawerProps = {
  reservation: Reservation | null;

  open: boolean;

  onClose: () => void;

  onApprove: (reservation: Reservation) => Promise<ActionResult>;

  onReject: (
    reservation: Reservation,

    reason: string,
  ) => Promise<ActionResult>;

  onCancel: (
    reservation: Reservation,

    reason: string,
  ) => Promise<ActionResult>;
};

export function ReservationDetailDrawer({
  reservation,
  open,
  onClose,
  onApprove,
  onReject,
  onCancel,
}: ReservationDetailDrawerProps) {
  const [actionModal, setActionModal] = useState<"reject" | "cancel" | null>(
    null,
  );

  const [reason, setReason] = useState("");

  const [actionError, setActionError] = useState<string | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);

  const [isApproving, setIsApproving] = useState(false);

  const [approveError, setApproveError] = useState<string | null>(null);

  const [isOpeningReceipt, setIsOpeningReceipt] = useState(false);

  const [receiptError, setReceiptError] = useState<string | null>(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);

  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  const [isChangingRoom, setIsChangingRoom] = useState(false);

  const [roomError, setRoomError] = useState<string | null>(null);

  if (!reservation) {
    return null;
  }

  const closeActionModal = () => {
    if (isActionLoading) {
      return;
    }

    setActionModal(null);

    setReason("");

    setActionError(null);
  };

  const handleOpenReceipt = async () => {
    if (!reservation.receipt_storage_path) {
      return;
    }

    setReceiptError(null);

    setIsOpeningReceipt(true);

    try {
      const result = await getReceiptSignedUrl(
        reservation.receipt_storage_path,
      );

      if (!result.success || !result.url) {
        setReceiptError(result.message ?? "Dekont açılamadı.");

        return;
      }

      window.open(result.url, "_blank", "noopener,noreferrer");
    } finally {
      setIsOpeningReceipt(false);
    }
  };

  const handleApprove = async () => {
    setApproveError(null);

    setIsApproving(true);

    try {
      const result = await onApprove(reservation);

      if (!result.success) {
        setApproveError(result.message ?? "Rezervasyon onaylanamadı.");
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleModalAction = async () => {
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
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenRoomModal = async () => {
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
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleChangeRoom = async () => {
    if (!selectedRoomId) {
      return;
    }

    setRoomError(null);
    setIsChangingRoom(true);

    try {
      const result = await changeReservationRoom(
        reservation.id,
        selectedRoomId,
      );

      if (!result.success) {
        setRoomError(result.message ?? "Oda değiştirilemedi.");

        return;
      }

      setRoomModalOpen(false);

      window.location.reload();
    } finally {
      setIsChangingRoom(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/30
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      <aside
        className={`
          fixed right-0 top-0 z-50
          h-[100dvh] w-full
          overflow-y-auto
          bg-[#F8F6F1]
          shadow-2xl
          transition-transform
          duration-300
          sm:max-w-[520px]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E1D8] bg-white px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8754F]">
              {reservation.reservation_code}
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#263A2D]">
              {reservation.guest_name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-[#DDD9D1]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-4 p-4">
          <section className="border border-[#E3E0D8] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
              Misafir
            </p>

            <InfoRow
              icon={User}
              label="Ad Soyad"
              value={reservation.guest_name}
            />

            <InfoRow
              icon={Phone}
              label="Telefon"
              value={reservation.guest_phone}
            />

            {reservation.guest_email && (
              <InfoRow
                icon={Mail}
                label="E-posta"
                value={reservation.guest_email}
              />
            )}
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
              Konaklama
            </p>

            <InfoRow
              icon={CalendarDays}
              label="Oda Tipi"
              value={reservation.accommodations?.title ?? "—"}
            />

            <InfoRow
              icon={BedDouble}
              label="Atanan Fiziksel Oda"
              value={
                reservation.rooms
                  ? reservation.rooms.room_number
                    ? `${reservation.rooms.room_name} · ${reservation.rooms.room_number}`
                    : reservation.rooms.room_name
                  : "Henüz oda atanmamış"
              }
            />

            <button
              type="button"
              onClick={handleOpenRoomModal}
              disabled={isLoadingRooms}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-[#D7D3CA] bg-white text-xs font-semibold text-[#263A2D]"
            >
              {isLoadingRooms ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <BedDouble size={15} />
              )}
              Odayı Değiştir
            </button>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <MiniInfo label="Giriş" value={reservation.check_in} />

              <MiniInfo label="Çıkış" value={reservation.check_out} />

              <MiniInfo label="Gece" value={`${reservation.night_count}`} />

              <MiniInfo
                label="Misafir"
                value={
                  reservation.child_count > 0
                    ? `${reservation.adult_count} yetişkin · ${reservation.child_count} çocuk`
                    : `${reservation.adult_count} yetişkin`
                }
              />
            </div>
          </section>

          <section className="border border-[#E3E0D8] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
              Ödeme
            </p>

            <p className="mt-3 text-2xl font-semibold text-[#263A2D]">
              {Number(reservation.total_price).toLocaleString("tr-TR")} TL
            </p>

            {reservation.receipt_storage_path && (
              <button
                type="button"
                onClick={handleOpenReceipt}
                disabled={isOpeningReceipt}
                className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
              >
                {isOpeningReceipt ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ExternalLink size={15} />
                )}
                Dekontu Gör
              </button>
            )}

            {receiptError && (
              <p className="mt-2 text-xs text-[#98584E]">{receiptError}</p>
            )}
          </section>

          {reservation.status === "rejected" &&
            reservation.rejection_reason && (
              <section className="border border-[#E5C7C0] bg-[#FFF8F6] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#98584E]">
                  Red Sebebi
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6D625F]">
                  {reservation.rejection_reason}
                </p>
              </section>
            )}

          {reservation.status === "cancelled" &&
            reservation.cancellation_reason && (
              <section className="border border-[#DDD9D1] bg-[#F3F2EF] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#646A63]">
                  İptal Sebebi
                </p>

                <p className="mt-2 text-sm leading-6 text-[#666B65]">
                  {reservation.cancellation_reason}
                </p>
              </section>
            )}

          {approveError && (
            <div className="border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
              {approveError}
            </div>
          )}

          {reservation.status === "pending_approval" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionModal("reject")}
                className="flex h-12 items-center justify-center gap-2 border border-[#D9B8B2] bg-white text-xs font-semibold text-[#9C5148]"
              >
                <XCircle size={16} />
                Reddet
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving}
                className="flex h-12 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white"
              >
                {isApproving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Onayla
              </button>
            </div>
          )}

          {reservation.status === "confirmed" && (
            <button
              type="button"
              onClick={() => setActionModal("cancel")}
              className="flex h-12 w-full items-center justify-center gap-2 border border-[#C7C5BF] bg-white text-xs font-semibold text-[#626660]"
            >
              <Ban size={16} />
              Rezervasyonu İptal Et
            </button>
          )}
        </div>
      </aside>

      {actionModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={closeActionModal}
          />

          <div className="relative z-10 w-full bg-white p-5 shadow-2xl sm:max-w-[480px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#98584E]">
              {actionModal === "reject"
                ? "Rezervasyonu Reddet"
                : "Rezervasyonu İptal Et"}
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#263A2D]">
              {actionModal === "reject" ? "Red sebebi" : "İptal sebebi"}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#7D817B]">
              Bu açıklama müşterinin rezervasyon takip ekranında gösterilecek.
            </p>

            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);

                setActionError(null);
              }}
              maxLength={500}
              rows={5}
              className="mt-5 w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm text-[#263A2D] outline-none"
              placeholder={
                actionModal === "reject"
                  ? "Red sebebini yazın..."
                  : "İptal sebebini yazın..."
              }
            />

            {actionError && (
              <div className="mt-3 bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
                {actionError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={isActionLoading}
                className="h-11 border border-[#DDD9D1] text-xs font-semibold"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleModalAction}
                disabled={isActionLoading || reason.trim().length < 5}
                className="flex h-11 items-center justify-center gap-2 bg-[#98584E] text-xs font-semibold text-white disabled:opacity-50"
              >
                {isActionLoading && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {actionModal === "reject" ? "Reddet" : "İptal Et"}
              </button>
            </div>
          </div>
        </div>
      )}

      {roomModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => {
              if (!isChangingRoom) {
                setRoomModalOpen(false);
              }
            }}
          />

          <div className="relative z-10 w-full bg-white p-5 shadow-2xl sm:max-w-[520px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8754F]">
              Fiziksel Oda
            </p>

            <h3 className="mt-2 text-xl font-semibold text-[#263A2D]">
              Odayı Değiştir
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#7D817B]">
              Sadece bu rezervasyon tarihleri için müsait olan aynı tipteki
              odalar seçilebilir.
            </p>

            <div className="mt-5 space-y-2">
              {availableRooms.map((room) => {
                const disabled = !room.isAvailable && !room.isCurrent;

                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`flex w-full items-center justify-between border p-3 text-left ${
                      selectedRoomId === room.id
                        ? "border-[#263A2D] bg-[#F3F5F1]"
                        : "border-[#E3E0D8] bg-white"
                    } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#263A2D]">
                        {room.roomName}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#969990]">
                        {room.roomNumber ?? "—"}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold ${
                        room.isCurrent
                          ? "text-[#A8754F]"
                          : room.isAvailable
                            ? "text-[#4F6A4F]"
                            : "text-[#98584E]"
                      }`}
                    >
                      {room.isCurrent
                        ? "Mevcut"
                        : room.isAvailable
                          ? "Müsait"
                          : "Dolu"}
                    </span>
                  </button>
                );
              })}
            </div>

            {roomError && (
              <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-xs text-[#98584E]">
                {roomError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRoomModalOpen(false)}
                disabled={isChangingRoom}
                className="h-11 border border-[#DDD9D1] text-xs font-semibold text-[#263A2D]"
              >
                Vazgeç
              </button>

              <button
                type="button"
                onClick={handleChangeRoom}
                disabled={isChangingRoom || !selectedRoomId}
                className="flex h-11 items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
              >
                {isChangingRoom && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Odayı Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;

  label: string;

  value: string;
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F1EFE9] text-[#A8754F]">
        <Icon size={16} />
      </div>

      <div>
        <p className="text-[10px] text-[#969990]">{label}</p>

        <p className="mt-1 text-xs font-medium text-[#263A2D]">{value}</p>
      </div>
    </div>
  );
}

function MiniInfo({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] text-[#969990]">{label}</p>

      <p className="mt-1 text-xs font-medium text-[#263A2D]">{value}</p>
    </div>
  );
}
