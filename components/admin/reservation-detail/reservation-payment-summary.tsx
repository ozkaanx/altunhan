import {
  Banknote,
  CheckCircle2,
  RotateCcw,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { formatPrice } from "@/lib/formatters/price";

type ReservationPaymentSummaryProps = {
  totalPrice: number;
  netCollectedAmount: number;
  refundedAmount: number;
  totalRemaining: number;
};

export function ReservationPaymentSummary({
  totalPrice,
  netCollectedAmount,
  refundedAmount,
  totalRemaining,
}: ReservationPaymentSummaryProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <PaymentSummary label="Toplam" value={totalPrice} icon={WalletCards} />
      <PaymentSummary label="Net Alınan" value={netCollectedAmount} icon={CheckCircle2} />
      <PaymentSummary label="İade" value={refundedAmount} icon={RotateCcw} />
      <PaymentSummary label="Kalan" value={totalRemaining} icon={Banknote} />
    </div>
  );
}

function PaymentSummary({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-[#E8E4DC] bg-[#FAF9F6] p-3">
      <Icon size={15} className="text-[#A8754F]" />
      <p className="mt-2 text-[9px] uppercase tracking-[0.1em] text-[#969990]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#263A2D]">{formatPrice(value)}</p>
    </div>
  );
}
