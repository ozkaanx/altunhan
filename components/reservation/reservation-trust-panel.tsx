import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Müsaitlik doğrulaması",
    description: "Tarihleriniz talep oluşturulmadan hemen önce yeniden kontrol edilir.",
  },
  {
    icon: Clock3,
    title: "1 saat geçici ayırma",
    description: "Talebinizden sonra konaklama ödeme işlemi için geçici olarak ayrılır.",
  },
  {
    icon: ShieldCheck,
    title: "Şeffaf ödeme süreci",
    description: "Banka ve dekont adımları talebiniz oluştuktan sonra açıkça gösterilir.",
  },
] as const;

export function ReservationTrustPanel() {
  return (
    <aside
      className="border border-[#D9D4CA] bg-[#FAF8F2] p-5 sm:p-6"
      aria-label="Rezervasyon süreci"
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A8754F]">
        Rezervasyon nasıl ilerler?
      </p>

      <div className="mt-4 space-y-4">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#E9EDE6] text-[#526048]">
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#263A2D]">{item.title}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#777D75]">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
