import { CheckCircle2, ShieldCheck } from "lucide-react";

type ReservationSummaryAssuranceProps = {
  checkIn: string;
  checkOut: string;
  dateError: string | null;
};

export function ReservationSummaryAssurance({
  checkIn,
  checkOut,
  dateError,
}: ReservationSummaryAssuranceProps) {
  return (
    <>
      <div className="mt-4 flex items-start gap-3">
        <ShieldCheck size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#526048]" />

        <p className="text-[9px] leading-5 text-[#81867F]">
          Rezervasyon talebiniz oluşturulduğunda seçtiğiniz konaklama 1 saat boyunca geçici olarak
          sizin için ayrılır. Ödeme/dekont işlemini tamamladıktan sonra talebiniz işletme tarafından
          kontrol edilir ve onaylandığında rezervasyonunuz kesinleşir.
        </p>
      </div>

      {checkIn && checkOut && !dateError && (
        <div className="mt-4 flex items-center gap-2 border-t border-[#E2DED5] pt-4 text-[9px] font-medium text-[#526A51]">
          <CheckCircle2 size={13} />
          Tarih seçiminiz uygun görünüyor
        </div>
      )}
    </>
  );
}
