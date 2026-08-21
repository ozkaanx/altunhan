"use client";

import { useState } from "react";

import {
  createReview,
  deleteReview,
  toggleReviewStatus,
  updateReview,
} from "@/app/admin/reviews/action";

import type { Review } from "@/types/review";

export type ReviewFormState = {
  guestName: string;
  reviewText: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
};

const initialFormState: ReviewFormState = {
  guestName: "",
  reviewText: "",
  rating: 5,
  isActive: true,
  sortOrder: 0,
};

export function useReviewsAdmin() {
  const [form, setForm] = useState<ReviewFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
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
  };
}
