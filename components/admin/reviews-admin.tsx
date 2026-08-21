"use client";

import { ReviewForm } from "@/components/admin/reviews/review-form";
import { ReviewsList } from "@/components/admin/reviews/reviews-list";

import { useReviewsAdmin } from "@/hooks/admin/use-reviews-admin";

import type { Review } from "@/types/review";

type ReviewsAdminProps = {
  reviews: Review[];
};

export function ReviewsAdmin({ reviews }: ReviewsAdminProps) {
  const {
    form,
    setForm,
    editingId,
    isSubmitting,
    error,
    resetForm,
    startEditing,
    handleSubmit,
    handleDelete,
    handleToggle,
  } = useReviewsAdmin();

  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
      <ReviewForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />

      <ReviewsList
        reviews={reviews}
        onToggle={handleToggle}
        onEdit={startEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
