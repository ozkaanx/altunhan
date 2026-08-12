import {
  MessageSquareText,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { ReviewsAdmin } from "@/components/admin/reviews-admin";

import type {
  Review,
} from "@/types/review";

export default async function AdminReviewsPage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("reviews")
    .select("*")
    .order(
      "sort_order",
      {
        ascending: true,
      },
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  if (error) {
    console.error(
      "Yorumlar alınamadı:",
      error,
    );
  }

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-[#8B8E87]">
            İçerik Yönetimi
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
            Yorumlar
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#71756E]">
            Ana sayfada gösterilen misafir
            yorumlarını buradan yönetebilirsiniz.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center bg-[#EEF0EA] text-[#526048]">
          <MessageSquareText
            size={18}
          />
        </div>
      </div>

      <ReviewsAdmin
        reviews={
          (data ??
            []) as Review[]
        }
      />
    </section>
  );
}