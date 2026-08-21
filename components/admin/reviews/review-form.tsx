"use client";

import { Check, Plus, X } from "lucide-react";

import type { Dispatch, SetStateAction } from "react";

import type { ReviewFormState } from "@/hooks/admin/use-reviews-admin";

type ReviewFormProps = {
  form: ReviewFormState;
  setForm: Dispatch<SetStateAction<ReviewFormState>>;
  editingId: number | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: () => void | Promise<void>;
  onReset: () => void;
};

export function ReviewForm({
  form,
  setForm,
  editingId,
  isSubmitting,
  error,
  onSubmit,
  onReset,
}: ReviewFormProps) {
  return (
    <aside className="border border-[#E3E0D8] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#263A2D]">
            {editingId ? "Yorumu Düzenle" : "Yeni Yorum"}
          </h2>

          <p className="mt-1 text-[11px] text-[#91958E]">
            Ana sayfada gösterilecek yorum bilgilerini girin.
          </p>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={onReset}
            className="flex h-8 w-8 items-center justify-center border border-[#DDD9D1] text-[#6D726B]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
            Misafir Adı
          </label>

          <input
            value={form.guestName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                guestName: event.target.value,
              }))
            }
            className="mt-2 h-11 w-full border border-[#DDD9D1] px-3 text-sm text-[#263A2D] outline-none focus:border-[#263A2D]"
            placeholder="Örn. Buse K."
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
            Yorum
          </label>

          <textarea
            value={form.reviewText}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                reviewText: event.target.value,
              }))
            }
            rows={6}
            className="mt-2 w-full resize-none border border-[#DDD9D1] px-3 py-3 text-sm leading-6 text-[#263A2D] outline-none focus:border-[#263A2D]"
            placeholder="Misafir yorumunu yazın..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
              Puan
            </label>

            <select
              value={form.rating}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rating: Number(event.target.value),
                }))
              }
              className="mt-2 h-11 w-full border border-[#DDD9D1] bg-white px-3 text-sm text-[#263A2D] outline-none"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} yıldız
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#777C75]">
              Sıra
            </label>

            <input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sortOrder: Number(event.target.value),
                }))
              }
              className="mt-2 h-11 w-full border border-[#DDD9D1] px-3 text-sm text-[#263A2D] outline-none"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between border border-[#E4E1DA] px-3 py-3">
          <div>
            <p className="text-xs font-medium text-[#263A2D]">Yayında</p>

            <p className="mt-1 text-[10px] text-[#969A93]">Aktif yorumlar ana sayfada görünür.</p>
          </div>

          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isActive: event.target.checked,
              }))
            }
          />
        </label>

        {error && (
          <div className="border border-[#ECD4CE] bg-[#FAF0ED] px-3 py-3 text-xs text-[#9A544A]">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="flex h-11 w-full items-center justify-center gap-2 bg-[#263A2D] text-xs font-semibold text-white disabled:opacity-50"
        >
          {editingId ? (
            <>
              <Check size={15} />
              Kaydet
            </>
          ) : (
            <>
              <Plus size={15} />
              Yorum Ekle
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
