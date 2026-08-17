type AccommodationSectionHeaderProps = {
  label: string;
  title: string;
  description: string;
};

export function AccommodationSectionHeader({
  label,
  title,
  description,
}: AccommodationSectionHeaderProps) {
  return (
    <div className="mb-10 text-center md:mb-14">
      <span className="mb-4 block text-[9px] font-medium uppercase tracking-[0.3em] text-[#A8754F]">
        {label}
      </span>

      <h2 className="font-serif text-[34px] leading-[1.05] text-[#263A2D] sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 max-w-[560px] text-xs leading-6 text-[#6E746C] md:text-sm">
        {description}
      </p>
    </div>
  );
}
