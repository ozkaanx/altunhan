"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

import type { SiteSettings } from "@/types/site-settings";

import { formatReservationDate } from "@/lib/reservation/date-utils";
import { CHECK_IN_POLICY_TEXT, CHECK_OUT_POLICY_TEXT } from "@/lib/reservation/stay-policy";

import type { CreatedReservation } from "@/types/reservation-ui";

import { ReservationDetailCard } from "@/components/reservation/payment/reservation-detail-card";

import { BankInformation } from "@/components/reservation/payment/bank-information";

import { ReceiptUpload } from "@/components/reservation/payment/receipt-upload";

import { useReceiptUpload } from "@/hooks/reservation/use-receipt-upload";

import { formatPrice } from "@/lib/formatters/price";

type ReservationPaymentProps = {
  reservation: CreatedReservation;
  settings: SiteSettings | null;
};

export function ReservationPayment({ reservation, settings }: ReservationPaymentProps) {
  const { receipt, error, isUploading, selectReceipt, clearReceipt, uploadReceipt } =
    useReceiptUpload(reservation);

  const hasBankInformation =
    Boolean(settings?.iban?.trim()) &&
    Boolean(settings?.bank_name?.trim()) &&
    Boolean(settings?.bank_account_holder?.trim());

  const isSingleNight = reservation.nightCount === 1;

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="border border-[#E1DED6] bg-white p-5 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE6] text-[#496449]">
          <CheckCircle2 size={24} />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8754F]">
          Rezervasyon Talebiniz Alındı
        </p>

        <h1 className="mt-2 font-serif text-3xl text-[#263A2D] sm:text-4xl">
          {hasBankInformation
            ? "Kapora ödemenizi tamamlayın."
            : "Rezervasyon talebiniz oluşturuldu."}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#70756F]">
          {hasBankInformation
            ? isSingleNight
              ? "Bir gecelik konaklamanız için toplam tutarın yarısını kapora olarak gönderip dekontunuzu yükleyin."
              : "Rezervasyonunuzu kesinleştirmek için bir gecelik konaklama bedelini kapora olarak gönderip dekontunuzu yükleyin."
            : "Ödeme bilgileri henüz hazırlanmadığı için şu anda ödeme alınmamaktadır. Rezervasyon bilgileriniz aşağıda yer almaktadır."}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <ReservationDetailCard label="Rezervasyon No" value={reservation.reservationCode} />

          <ReservationDetailCard label="Konaklama" value={reservation.accommodationTitle} />

          <ReservationDetailCard
            label="Giriş"
            value={`${formatReservationDate(reservation.checkIn)} · ${CHECK_IN_POLICY_TEXT}`}
          />

          <ReservationDetailCard
            label="Çıkış"
            value={`${formatReservationDate(reservation.checkOut)} · ${CHECK_OUT_POLICY_TEXT}`}
          />

          <ReservationDetailCard
            label="Konaklama Süresi"
            value={`${reservation.nightCount} gece`}
          />

          <ReservationDetailCard label="Toplam Tutar" value={formatPrice(reservation.totalPrice)} />

          <ReservationDetailCard
            label="Şimdi Ödenecek Kapora"
            value={formatPrice(reservation.amountDueNow)}
          />

          <ReservationDetailCard
            label="Kapora Sonrası Kalan"
            value={formatPrice(reservation.remainingPaymentAmount)}
          />
        </div>

        {hasBankInformation ? (
          <>
            <div className="mt-7 border border-[#E7DCCB] bg-[#FAF6EE] p-4 sm:p-5">
              <div className="flex gap-3">
                <AlertTriangle size={19} className="mt-0.5 shrink-0 text-[#A8754F]" />

                <div>
                  <p className="text-sm font-semibold text-[#263A2D]">
                    Odanız 1 saat boyunca sizin için ayrılır
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#777B74]">
                    Rezervasyon oluşturulduktan sonraki 1 saat boyunca seçilen oda geçici olarak
                    tutulur. Bu süre geçtikten sonra da dekont yükleyebilirsiniz ancak müsaitlik
                    yeniden kontrol edilir.
                  </p>
                </div>
              </div>
            </div>
            <BankInformation settings={settings} reservationCode={reservation.reservationCode} />

            <div className="mt-5 border border-[#CBDDC8] bg-[#EAF2E8] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#496449]">
                Gönderilecek Tutar
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#263A2D]">
                {formatPrice(reservation.amountDueNow)}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#5E6F5D]">
                Havale açıklamasına {reservation.reservationCode} rezervasyon numarasını yazın.
                Farklı bir tutar gönderirseniz admin, banka hesabına geçen gerçek tutarı kaydeder.
              </p>
            </div>

            <ReceiptUpload
              receipt={receipt}
              error={error}
              isUploading={isUploading}
              onSelect={selectReceipt}
              onRemove={clearReceipt}
              onUpload={uploadReceipt}
              amountDueNow={reservation.amountDueNow}
            />
          </>
        ) : (
          <div className="mt-7 flex gap-3 border border-[#E7DCCB] bg-[#FAF6EE] p-4 sm:p-5">
            <AlertTriangle size={19} className="mt-0.5 shrink-0 text-[#A8754F]" />

            <div>
              <p className="text-sm font-semibold text-[#263A2D]">Ödeme bilgileri hazırlanıyor</p>

              <p className="mt-1 text-xs leading-5 text-[#777B74]">
                Banka ve ödeme bilgileri sisteme eklendiğinde Havale/EFT ve dekont yükleme işlemleri
                kullanılabilir hale gelecektir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
