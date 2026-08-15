type LocationMapProps = {
  mapsEmbedUrl: string;
};

export function LocationMap({ mapsEmbedUrl }: LocationMapProps) {
  return (
    <div
      className="
        relative
        min-h-[260px]
        overflow-hidden
        border
        border-[#DDD8CC]
        bg-[#E8E4DB]
        sm:min-h-[300px]
        lg:min-h-[340px]
      "
    >
      <iframe
        src={mapsEmbedUrl}
        title="Altunhan Farm konumu"
        className="absolute inset-0 h-full w-full border-0 grayscale-[15%]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div
        className="pointer-events-none absolute inset-0 border border-black/[0.03]"
        aria-hidden="true"
      />
    </div>
  );
}
