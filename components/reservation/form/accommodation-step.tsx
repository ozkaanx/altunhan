"use client";

import {
  CheckCircle2,
  Users,
} from "lucide-react";

import type {
  PublicAccommodation,
} from "@/types/public-reservation";

type AccommodationStepProps = {
  accommodations: PublicAccommodation[];
  accommodationId: number | null;

  onChange: (
    accommodation: PublicAccommodation,
  ) => void;
};

export function AccommodationStep({
  accommodations,
  accommodationId,
  onChange,
}: AccommodationStepProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white p-4 sm:p-6">
      <SectionTitle
        number="01"
        title="Konaklama Seçimi"
      />

      <p className="mt-2 text-[11px] leading-5 text-[#8A8E88]">
        Konaklamak istediğiniz oda tipini seçin.
      </p>

      {accommodations.length === 0 ? (
        <div className="mt-5 border border-[#E7D8C0] bg-[#FAF5EA] p-4 text-xs leading-5 text-[#88662F]">
          Şu anda rezervasyona açık konaklama bulunmuyor.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {accommodations.map(
            (accommodation) => {
              const isSelected =
                accommodation.id ===
                accommodationId;

              const price =
                Number(
                  accommodation.price,
                );

              return (
                <button
                  key={
                    accommodation.id
                  }
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    onChange(
                      accommodation,
                    )
                  }
                  className={[
                    "relative flex min-h-[150px] w-full flex-col border p-4 text-left transition",
                    isSelected
                      ? "border-[#263A2D] bg-[#F4F7F2]"
                      : "border-[#E3E0D8] bg-[#FAF9F6] hover:border-[#B8B3A8] hover:bg-white",
                  ].join(" ")}
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={[
                          "font-serif text-xl leading-tight",
                          isSelected
                            ? "text-[#263A2D]"
                            : "text-[#414740]",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          accommodation.title
                        }
                      </p>

                      {accommodation.short_description && (
                        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#858A83]">
                          {
                            accommodation.short_description
                          }
                        </p>
                      )}
                    </div>

                    <SelectionIndicator
                      selected={
                        isSelected
                      }
                    />
                  </div>

                  <div className="mt-auto flex w-full items-end justify-between gap-3 pt-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#858A83]">
                      <Users
                        size={14}
                      />

                      Maks.{" "}
                      {
                        accommodation.capacity
                      }{" "}
                      kişi
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-[#A1A49E]">
                        Gecelik
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#263A2D]">
                        {price.toLocaleString(
                          "tr-TR",
                        )}{" "}
                        TL
                      </p>
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}

function SelectionIndicator({
  selected,
}: {
  selected: boolean;
}) {
  if (selected) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#263A2D] text-white">
        <CheckCircle2
          size={14}
        />
      </span>
    );
  }

  return (
    <span className="h-6 w-6 shrink-0 rounded-full border border-[#CBC7BE] bg-white" />
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.15em] text-[#A8754F]">
        {number}
      </span>

      <h2 className="text-sm font-semibold text-[#263A2D]">
        {title}
      </h2>
    </div>
  );
}