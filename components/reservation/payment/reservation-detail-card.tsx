type ReservationDetailCardProps = {
  label: string;
  value: string;
};

export function ReservationDetailCard({
  label,
  value,
}: ReservationDetailCardProps) {
  return (
    <div className="border border-[#E8E4DC] bg-[#FAF9F6] p-4">
      <p className="text-[10px] text-[#969990]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#263A2D]">
        {value}
      </p>
    </div>
  );
}