import { Phone } from "lucide-react";

import { Field, SectionTitle, inputClass } from "@/components/admin/reservation-form/form-elements";

import type { ReservationSource } from "@/types/admin-reservation";

type ReservationSettingsSectionProps = {
  source: ReservationSource;
  adminNote: string;
  onSourceChange: (source: ReservationSource) => void;
  onAdminNoteChange: (note: string) => void;
};

export function ReservationSettingsSection({
  source,
  adminNote,
  onSourceChange,
  onAdminNoteChange,
}: ReservationSettingsSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionTitle
        icon={Phone}
        title="Rezervasyon Bilgileri"
        description="Rezervasyonun geldiği kanal ve işletme notu."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <Field label="Rezervasyon Kaynağı">
          <select
            value={source}
            onChange={(event) => onSourceChange(event.target.value as ReservationSource)}
            className={inputClass}
          >
            <option value="phone">Telefon</option>

            <option value="whatsapp">WhatsApp</option>

            <option value="walk_in">Resepsiyon / Walk-in</option>

            <option value="admin">Admin</option>
          </select>
        </Field>

        <Field label="Admin Notu">
          <textarea
            value={adminNote}
            onChange={(event) => onAdminNoteChange(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Örn. Telefonla teyit edildi, girişte ödeme yapılacak..."
            className="w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-sm leading-6 text-[#263A2D] outline-none focus:border-[#263A2D]"
          />
        </Field>
      </div>
    </section>
  );
}
