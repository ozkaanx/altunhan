"use client";

import { Eye, EyeOff, Pencil, Star, Trash2 } from "lucide-react";

import type { Review } from "@/types/review";

type ReviewsListProps = {
  reviews: Review[];
  onToggle: (review: Review) => void | Promise<void>;
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void | Promise<void>;
};

export function ReviewsList({ reviews, onToggle, onEdit, onDelete }: ReviewsListProps) {
  const activeCount = reviews.filter((review) => review.is_active).length;

  return (
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
                    {Array.from({ length: review.rating }).map((_, index) => (
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
                    onClick={() => onToggle(review)}
                    className="flex h-9 w-9 items-center justify-center border border-[#DDD9D1] text-[#596058]"
                  >
                    {review.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(review)}
                    className="flex h-9 w-9 items-center justify-center border border-[#DDD9D1] text-[#596058]"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(review.id)}
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
  );
}
