"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";

type AccommodationInput = {
  title: string;
  shortDescription: string;
  description: string;

  price: number;

  maxAdults: number;
  maxChildren: number;
  maxTotalGuests: number;

  bedCount: number;
  bathroomCount: number;

  amenities: string[];
  isActive: boolean;
};

function createSlug(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateAccommodationInput(values: AccommodationInput) {
  const title = values.title.trim();

  if (!title) {
    return "Konaklama adı zorunludur.";
  }

  if (!Number.isFinite(values.price) || values.price < 0) {
    return "Gecelik fiyat geçerli olmalıdır.";
  }

  if (!Number.isInteger(values.maxAdults) || values.maxAdults < 1) {
    return "Maksimum yetişkin sayısı en az 1 olmalıdır.";
  }

  if (!Number.isInteger(values.maxChildren) || values.maxChildren < 0) {
    return "Maksimum çocuk sayısı 0 veya daha büyük olmalıdır.";
  }

  if (!Number.isInteger(values.maxTotalGuests) || values.maxTotalGuests < 1) {
    return "Maksimum toplam misafir sayısı en az 1 olmalıdır.";
  }

  if (values.maxAdults > values.maxTotalGuests) {
    return "Maksimum yetişkin sayısı toplam kapasiteden büyük olamaz.";
  }

  if (values.maxChildren > values.maxTotalGuests) {
    return "Maksimum çocuk sayısı toplam kapasiteden büyük olamaz.";
  }

  if (!Number.isInteger(values.bedCount) || values.bedCount < 1) {
    return "Yatak sayısı en az 1 olmalıdır.";
  }

  if (!Number.isInteger(values.bathroomCount) || values.bathroomCount < 1) {
    return "Banyo sayısı en az 1 olmalıdır.";
  }

  return null;
}

function revalidateAccommodationPaths(id: number, slug: string) {
  revalidatePath("/");
  revalidatePath("/rezervasyon");
  revalidatePath("/admin/accommodations");
  revalidatePath(`/admin/accommodations/${id}`);
  revalidatePath(`/konaklama/${slug}`);
}

export async function createAccommodation(values: AccommodationInput) {
  const admin = await requireAdmin();

  if (!admin.success) {
    return {
      success: false as const,
      message: admin.message,
    };
  }

  const validationError = validateAccommodationInput(values);

  if (validationError) {
    return {
      success: false as const,
      message: validationError,
    };
  }

  const { supabase } = admin;

  const title = values.title.trim();

  const slug = createSlug(title);

  if (!slug) {
    return {
      success: false as const,
      message: "Konaklama adı geçerli bir URL oluşturmak için uygun değil.",
    };
  }

  const { data, error } = await supabase
    .from("accommodations")
    .insert({
      title,
      slug,

      short_description: values.shortDescription.trim() || null,

      description: values.description.trim() || null,

      price: values.price,

      /*
       * Legacy capacity alanını
       * yeni toplam kapasiteyle
       * senkron tutuyoruz.
       */
      capacity: values.maxTotalGuests,

      max_adults: values.maxAdults,

      max_children: values.maxChildren,

      max_total_guests: values.maxTotalGuests,

      bed_count: values.bedCount,

      bathroom_count: values.bathroomCount,

      amenities: values.amenities,

      is_active: values.isActive,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Konaklama eklenemedi:", error);

    return {
      success: false as const,
      message: error?.message ?? "Konaklama kaydedilemedi.",
    };
  }

  revalidateAccommodationPaths(Number(data.id), slug);

  return {
    success: true as const,
    accommodationId: Number(data.id),
  };
}

export async function updateAccommodation(
  id: number,
  values: AccommodationInput,
) {
  const admin = await requireAdmin();

  if (!admin.success) {
    return {
      success: false as const,
      message: admin.message,
    };
  }

  if (!Number.isInteger(id) || id < 1) {
    return {
      success: false as const,
      message: "Geçersiz konaklama kaydı.",
    };
  }

  const validationError = validateAccommodationInput(values);

  if (validationError) {
    return {
      success: false as const,
      message: validationError,
    };
  }

  const { supabase } = admin;

  const title = values.title.trim();

  const slug = createSlug(title);

  if (!slug) {
    return {
      success: false as const,
      message: "Konaklama adı geçerli bir URL oluşturmak için uygun değil.",
    };
  }

  const { data, error } = await supabase
    .from("accommodations")
    .update({
      title,
      slug,

      short_description: values.shortDescription.trim() || null,

      description: values.description.trim() || null,

      price: values.price,

      capacity: values.maxTotalGuests,

      max_adults: values.maxAdults,

      max_children: values.maxChildren,

      max_total_guests: values.maxTotalGuests,

      bed_count: values.bedCount,

      bathroom_count: values.bathroomCount,

      amenities: values.amenities,

      is_active: values.isActive,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Konaklama güncellenemedi:", error);

    return {
      success: false as const,
      message: error.message,
    };
  }

  if (!data?.length) {
    return {
      success: false as const,
      message: "Kayıt güncellenemedi. UPDATE yetkisini kontrol edin.",
    };
  }

  revalidateAccommodationPaths(id, slug);

  return {
    success: true as const,
  };
}
