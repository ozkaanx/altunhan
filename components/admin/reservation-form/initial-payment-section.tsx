import { WalletCards } from "lucide-react";

import {
  Field,
  SectionTitle,
  SummaryItem,
  inputClass,
} from "@/components/admin/reservation-form/form-elements";

import { formatPrice } from "@/lib/formatters/price";

import type { AdminInitialPaymentMethod } from "@/types/admin-reservation";

type InitialPaymentSectionProps = {
  hasInitialPayment: boolean;
  initialPaymentAmount: string;
  initialPaymentMethod: AdminInitialPaymentMethod;
  initialPaymentNote: string;
  totalPrice: number;
  depositTargetAmount: number;
  receivedPaymentAmount: number;
  depositRemainingAmount: number;
  totalRemainingAmount: number;
  willBeConfirmed: boolean;
  onHasInitialPaymentChange: (value: boolean) => void;
  onInitialPaymentAmountChange: (value: string) => void;
  onInitialPaymentMethodChange: (value: AdminInitialPaymentMethod) => void;
  onInitialPaymentNoteChange: (value: string) => void;
};

export function InitialPaymentSection({
  hasInitialPayment,
  initialPaymentAmount,
  initialPaymentMethod,
  initialPaymentNote,
  totalPrice,
  depositTargetAmount,
  receivedPaymentAmount,
  depositRemainingAmount,
  totalRemainingAmount,
  willBeConfirmed,
  onHasInitialPaymentChange,
  onInitialPaymentAmountChange,
  onInitialPaymentMethodChange,
  onInitialPaymentNoteChange,
}: InitialPaymentSectionProps) {
  return (
    <section className="border border-[#E3E0D8] bg-white">
      <SectionTitle
        icon={WalletCards}
        title="İlk Ödeme"
        description="Alınan kapora veya ödemeyi rezervasyonla birlikte kaydedin."
      />

      <div className="space-y-5 p-4 sm:p-5">
        <div className="grid gap-3 bg-[#FAF8F4] p-4 sm:grid-cols-3">
          <SummaryItem label="Toplam" value={formatPrice(totalPrice)} />
          <SummaryItem label="Kapora Hedefi" value={formatPrice(depositTargetAmount)} />
          <SummaryItem label="Kalan Toplam" value={formatPrice(totalRemainingAmount)} />
        </div>

        <p className="text-[10px] leading-5 text-[#777D75]">
          Bir gecelik konaklamada toplamın yarısı, birden fazla gecede bir gecelik ücret kapora
          hedefidir.
        </p>

        <Field label="Ödeme Durumu">
          <select
            value={hasInitialPayment ? "received" : "not_received"}
            onChange={(event) => onHasInitialPaymentChange(event.target.value === "received")}
            className={inputClass}
          >
            <option value="not_received">Henüz ödeme alınmadı</option>
            <option value="received">Ödeme alındı</option>
          </select>
        </Field>

        {hasInitialPayment ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Alınan Tutar">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  max={totalPrice || undefined}
                  step="0.01"
                  value={initialPaymentAmount}
                  onChange={(event) => onInitialPaymentAmountChange(event.currentTarget.value)}
                  placeholder="Örn. 4000"
                  className={inputClass}
                />
              </Field>

              <Field label="Ödeme Yöntemi">
                <select
                  value={initialPaymentMethod}
                  onChange={(event) =>
                    onInitialPaymentMethodChange(
                      event.currentTarget.value as AdminInitialPaymentMethod,
                    )
                  }
                  className={inputClass}
                >
                  <option value="bank_transfer">Havale / EFT</option>
                  <option value="cash">Nakit</option>
                  <option value="card">Kart</option>
                  <option value="other">Diğer</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-3 border border-[#E3E0D8] bg-[#FAF9F6] p-4 sm:grid-cols-3">
              <SummaryItem label="Alınan" value={formatPrice(receivedPaymentAmount)} />
              <SummaryItem label="Eksik Kapora" value={formatPrice(depositRemainingAmount)} />
              <SummaryItem
                label="Başlangıç Durumu"
                value={willBeConfirmed ? "Onaylandı" : "Ödeme Bekliyor"}
              />
            </div>

            <Field label="Ödeme Notu">
              <textarea
                value={initialPaymentNote}
                onChange={(event) => onInitialPaymentNoteChange(event.currentTarget.value)}
                rows={3}
                maxLength={500}
                placeholder="Örn. Kapora havale ile alındı."
                className="w-full resize-none border border-[#DDD9D1] bg-[#FAF9F6] p-3 text-base leading-6 text-[#263A2D] outline-none placeholder:text-[#A3A69F] focus:border-[#263A2D] sm:text-sm"
              />
            </Field>
          </>
        ) : (
          <div className="border border-[#E3D5B8] bg-[#FAF5E9] p-3 text-xs leading-5 text-[#846B38]">
            Ödeme kaydı oluşturulmaz ve rezervasyon “Ödeme Bekliyor” durumunda açılır.
          </div>
        )}
      </div>
    </section>
  );
}
