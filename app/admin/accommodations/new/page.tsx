import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AccommodationForm } from "@/components/admin/accommodation-form";

export default function NewAccommodationPage() {
  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/accommodations"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F] transition-colors hover:text-[#263A2D]"
        >
          <ArrowLeft size={15} />
          Konaklamalara Dön
        </Link>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Yeni Konaklama
        </h1>

        <p className="mt-2 text-sm text-[#71756E]">
          Web sitesinde gösterilecek yeni bir konaklama seçeneği oluşturun.
        </p>
      </div>

      <AccommodationForm />
    </section>
  );
}
