"use client";

import { Check, Eye, EyeOff, Pencil, Plus, Star, Trash2, X } from "lucide-react";

import { useMemo, useState } from "react";

import {
  createReview,
  deleteReview,
  toggleReviewStatus,
  updateReview,
} from "@/app/admin/reviews/action";

import type { Review } from "@/types/review";

type ReviewsAdminProps = {
  reviews: Review[];
};

type FormState = {
  guestName: string;
  reviewText: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
};

const initialFormState: FormState = {
  guestName: "",
  reviewText: "",
  rating: 5,
  isActive: true,
  sortOrder: 0,
};

export function ReviewsAdmin({ reviews }: ReviewsAdminProps) {
  const [form, setForm] = useState<FormState>(initialFormState);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const activeCount = useMemo(() => reviews.filter((review) => review.is_active).length, [reviews]);

  function resetForm() {
    setForm(initialFormState);

    setEditingId(null);

    setError(null);
  }

  function startEditing(review: Review) {
    setEditingId(review.id);

    setForm({
      guestName: review.guest_name,

      reviewText: review.review_text,

      rating: review.rating,

      isActive: review.is_active,

      sortOrder: review.sort_order,
    });

    setError(null);
  }

  async function handleSubmit() {
    if (!form.guestName.trim() || !form.reviewText.trim()) {
      setError("Misafir adı ve yorum alanı zorunludur.");

      return;
    }

    try {
      setIsSubmitting(true);

      setError(null);

      if (editingId) {
        await updateReview(editingId, form);
      } else {
        await createReview(form);
      }

      resetForm();

      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const approved = window.confirm("Bu yorumu silmek istediğinize emin misiniz?");

    if (!approved) {
      return;
    }

    try {
      await deleteReview(id);

      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Yorum silinemedi.");
    }
  }

  async function handleToggle(review: Review) {
    try {
      await toggleReviewStatus(review.id, !review.is_active);

      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Durum değiştirilemedi.");
    }
  }

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
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
              onClick={resetForm}
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
            onClick={handleSubmit}
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

      <section className="border border-[#E3E0D8] bg-white">
        <div className="flex items-center justify-between border-b border-[#ECE8E1] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-[#263A2D]">Tüm Yorumlar</h2>

            <p className="mt-1 text-[10px] text-[#92968E]">
              {reviews.length} yorum · {activeCount} yayında
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-semibold text-[#263A2D]">Henüz yorum yok</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EFECE6]">
            {reviews.map((review) => (
              <article key={review.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-[#263A2D]">{review.guest_name}</p>

                      <span
                        className={`px-2 py-1 text-[9px] font-semibold ${
                          review.is_active
                            ? "bg-[#E7EFE5] text-[#4E684D]"
                            : "bg-[#E7E9EA] text-[#686D68]"
                        }`}
                      >
                        {review.is_active ? "Yayında" : "Pasif"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-[#B9823F]">
                      {Array.from({
                        length: review.rating,
                      }).map((_, index) => (
                        <Star key={index} size={13} fill="currentColor" />
                      ))}
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#686E67]">
                      {review.review_text}
                    </p>

                    <p className="mt-3 text-[10px] text-[#9A9E97]">Sıra: {review.sort_order}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(review)}
                      className="flex h-9 w-9 items-center justify-center border border-[#DDD9D1] text-[#596058]"
                    >
                      {review.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditing(review)}
                      className="flex h-9 w-9 items-center justify-center border border-[#DDD9D1] text-[#596058]"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      className="flex h-9 w-9 items-center justify-center border border-[#E8D8D4] text-[#A3574D]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
