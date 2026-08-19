"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2, NotebookPen, Pencil, Save, X } from "lucide-react";

import { updateReservationAdminNote } from "@/app/admin/reservations/action";

type ReservationAdminNoteProps = {
  reservationId: number;
  initialNote: string | null;
  onSaved: (adminNote: string | null) => void;
};

export function ReservationAdminNote({
  reservationId,
  initialNote,
  onSaved,
}: ReservationAdminNoteProps) {
  const router = useRouter();

  const [savedNote, setSavedNote] = useState(initialNote ?? "");
  const [draftNote, setDraftNote] = useState(initialNote ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setDraftNote(savedNote);
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isSaving) {
      return;
    }

    setDraftNote(savedNote);
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    try {
      const result = await updateReservationAdminNote(reservationId, draftNote);

      if (!result.success) {
        setError(result.message);
        return;
      }

      const nextNote = result.adminNote ?? "";

      setSavedNote(nextNote);
      setDraftNote(nextNote);
      onSaved(result.adminNote);
      setIsEditing(false);
      router.refresh();
    } catch (saveError) {
      console.error(saveError);
      setError("Admin notu kaydedilirken beklenmeyen bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="border border-[#E3E0D8] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#263A2D]">
          <NotebookPen size={16} strokeWidth={1.6} />

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#969990]">
            Admin Notu
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex h-8 items-center justify-center gap-1.5 border border-[#D7D3CA] px-3 text-[11px] font-semibold text-[#263A2D] transition-colors hover:bg-[#F5F1E8]"
          >
            <Pencil size={13} />
            {savedNote ? "Düzenle" : "Not Ekle"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-4">
          <label htmlFor={`reservation-admin-note-${reservationId}`} className="sr-only">
            Admin notu
          </label>

          <textarea
            id={`reservation-admin-note-${reservationId}`}
            value={draftNote}
            onChange={(event) => setDraftNote(event.target.value)}
            rows={4}
            maxLength={500}
            disabled={isSaving}
            placeholder="Rezervasyonla ilgili yalnızca adminlerin göreceği notu yazın..."
            className="w-full resize-y border border-[#D7D3CA] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none transition-colors placeholder:text-[#969990] focus:border-[#263A2D] disabled:opacity-60"
          />

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-[10px] text-[#969990]">Yalnızca admin panelinde görünür.</p>
            <p className="text-[10px] tabular-nums text-[#969990]">{draftNote.length}/500</p>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-xs text-[#98584E]">
              {error}
            </p>
          )}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex h-9 items-center justify-center gap-1.5 border border-[#D7D3CA] px-3 text-xs font-semibold text-[#5F675E] disabled:opacity-60"
            >
              <X size={14} />
              Vazgeç
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-9 items-center justify-center gap-1.5 bg-[#263A2D] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#344B3A] disabled:opacity-60"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      ) : (
        <p
          className={`mt-3 whitespace-pre-wrap text-sm leading-6 ${savedNote ? "text-[#4F574F]" : "italic text-[#969990]"}`}
        >
          {savedNote || "Henüz admin notu eklenmemiş."}
        </p>
      )}

      {!isEditing && error && (
        <p role="alert" className="mt-2 text-xs text-[#98584E]">
          {error}
        </p>
      )}
    </section>
  );
}
