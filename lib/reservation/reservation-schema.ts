import { z } from "zod";
import { getTurkeyToday } from "@/lib/reservation/date-utils";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const reservationDateSchema = z
  .string()
  .regex(DATE_PATTERN, "Tarih formatı geçersiz.")
  .refine(isValidDate, "Geçerli bir tarih seçin.");

export const publicReservationSchema = z
  .object({
    accommodationId: z
      .number()
      .int("Konaklama bilgisi geçersiz.")
      .positive("Lütfen bir konaklama seçin."),

    checkIn: reservationDateSchema,
    checkOut: reservationDateSchema,

    adultCount: z
      .number()
      .int("Yetişkin sayısı geçersiz.")
      .min(1, "En az 1 yetişkin seçilmelidir."),

    childCount: z.number().int("Çocuk sayısı geçersiz.").min(0, "Çocuk sayısı geçersiz."),

    guestName: z
      .string()
      .trim()
      .min(2, "Ad soyad en az 2 karakter olmalıdır.")
      .max(100, "Ad soyad en fazla 100 karakter olabilir."),

    guestPhone: z
      .string()
      .trim()
      .min(10, "Lütfen geçerli bir telefon numarası girin.")
      .max(20, "Telefon numarası en fazla 20 karakter olabilir."),

    guestEmail: z
      .string()
      .trim()
      .email("Lütfen geçerli bir e-posta adresi girin.")
      .max(254, "E-posta adresi çok uzun.")
      .transform((value) => value.toLowerCase()),
  })
  .superRefine((values, context) => {
    const today = getTurkeyToday();

    if (values.checkIn < today) {
      context.addIssue({
        code: "custom",
        path: ["checkIn"],
        message: "Geçmiş bir tarih için rezervasyon oluşturulamaz.",
      });
    }

    if (values.checkOut <= values.checkIn) {
      context.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Çıkış tarihi giriş tarihinden sonra olmalıdır.",
      });
    }
  });

export type PublicReservationValues = z.infer<typeof publicReservationSchema>;
