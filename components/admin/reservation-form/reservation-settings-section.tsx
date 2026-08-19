import { Phone } from "lucide-react";

import { Field, SectionTitle, inputClass } from "@/components/admin/reservation-form/form-elements";

import type { AdminReservationStatus, ReservationSource } from "@/types/admin-reservation";
import type { ReservationPaymentPlan } from "@/types/reservation";

type ReservationSettingsSectionProps = {
  source: ReservationSource;
  status: AdminReservationStatus;
  paymentPlan: ReservationPaymentPlan;
  adminNote: string;
  onSourceChange: (source: ReservationSource) => void;
  onStatusChange: (status: AdminReservationStatus) => void;
  onPaymentPlanChange: (paymentPlan: ReservationPaymentPlan) => void;
  onAdminNoteChange: (note: string) => void;
};

export function ReservationSettingsSection({
  source,
  status,
  paymentPlan,
  adminNote,
  onSourceChange,
  onStatusChange,
  onPaymentPlanChange,
  onAdminNoteChange,
}: ReservationSettingsSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionTitle
        icon={Phone}
        title="Rezervasyon Bilgileri"
        description="Rezervasyonun geldiği kanal ve başlangıç durumu."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
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
          <Field label="Rezervasyon Durumu">
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as AdminReservationStatus)}
              className={inputClass}
            >
              <option value="confirmed">Onaylandı</option>

              <option value="pending_payment">Ödeme Bekliyor</option>

              <option value="pending_approval">Onay Bekliyor</option>
            </select>
          </Field>
        </div>

        <Field label="Ödeme Planı">
          <select
            value={paymentPlan}
            onChange={(event) =>
              onPaymentPlanChange(event.target.value as ReservationPaymentPlan)
            }
            className={inputClass}
          >
            <option value="deposit">%50 Kapora</option>
            <option value="full">Tam Ödeme</option>
          </select>
        </Field>

        {status === "pending_payment" && (
          <div className="border border-[#E3D5B8] bg-[#FAF5E9] p-3 text-xs leading-5 text-[#846B38]">
            Ödeme bekleyen manuel rezervasyonlar da mevcut sistemde 1 saatlik oda tutma kuralına
            tabidir.
          </div>
        )}

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
