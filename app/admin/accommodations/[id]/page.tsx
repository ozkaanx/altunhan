import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AccommodationForm } from "@/components/admin/accommodation-form";

type EditAccommodationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const mockAccommodations = [
  {
    id: "1",
    title: "Bungalov",
    shortDescription:
      "Doğanın içerisinde sakin ve konforlu bir konaklama deneyimi.",
    description:
      "Altunhan Farm bungalovları doğayla iç içe, sakin ve konforlu bir konaklama deneyimi sunar.",
    price: 5200,
    capacity: 2,
    bedCount: 1,
    bathroomCount: 1,
    isActive: true,
    amenities: [
      "wifi",
      "air_conditioning",
      "private_bathroom",
      "sea_view",
    ],
    images: [
      "/images/bungalow.jpg",
    ],
  },
  {
    id: "2",
    title: "Taş Oda",
    shortDescription:
      "Doğal taş mimarisiyle tasarlanmış huzurlu ve ferah odalar.",
    description:
      "Doğal taş dokusu, ferah yaşam alanı ve sakin atmosferiyle Altunhan Farm taş odaları.",
    price: 4500,
    capacity: 4,
    bedCount: 2,
    bathroomCount: 1,
    isActive: true,
    amenities: [
      "wifi",
      "air_conditioning",
      "private_bathroom",
      "breakfast",
    ],
    images: [
      "/images/stone-room.jpg",
    ],
  },
];

export default async function EditAccommodationPage({
  params,
}: EditAccommodationPageProps) {
  const { id } = await params;

  const accommodation = mockAccommodations.find(
    (item) => item.id === id,
  );

  if (!accommodation) {
    return (
      <section>
        <Link
          href="/admin/accommodations"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F]"
        >
          <ArrowLeft size={15} />
          Konaklamalara Dön
        </Link>

        <div className="mt-6 border border-[#E3E0D8] bg-white px-5 py-16 text-center">
          <h1 className="text-lg font-semibold text-[#263A2D]">
            Konaklama bulunamadı
          </h1>

          <p className="mt-2 text-sm text-[#8B8E87]">
            Bu konaklama silinmiş veya mevcut olmayabilir.
          </p>
        </div>
      </section>
    );
  }

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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-[#A8754F]">
              Konaklama #{accommodation.id}
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
              {accommodation.title}
            </h1>

            <p className="mt-2 text-sm text-[#71756E]">
              Konaklama bilgilerini ve yayın durumunu düzenleyin.
            </p>
          </div>

          <span
            className={`
              inline-flex
              w-fit
              px-3
              py-1.5
              text-[10px]
              font-semibold
              ${
                accommodation.isActive
                  ? "bg-[#E6EFE6] text-[#496249]"
                  : "bg-[#E7E9EA] text-[#686D68]"
              }
            `}
          >
            {accommodation.isActive
              ? "Yayında"
              : "Pasif"}
          </span>
        </div>
      </div>

      <AccommodationForm
        initialValues={accommodation}
        submitLabel="Değişiklikleri Kaydet"
      />
    </section>
  );
}