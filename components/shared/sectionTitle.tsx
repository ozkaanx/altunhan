type SectionTitleProps = {
  number: string;
  title: string;
};

export function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-semibold tracking-[0.15em] text-[#A8754F]">{number}</span>

      <h2 className="text-sm font-semibold text-[#263A2D]">{title}</h2>
    </div>
  );
}
