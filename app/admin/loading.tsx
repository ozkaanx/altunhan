export default function AdminLoading() {
  return (
    <section>
      <div className="mb-7">
        <div className="h-3 w-28 animate-pulse bg-[#E3E0D8]" />
        <div className="mt-3 h-8 w-48 animate-pulse bg-[#DDDAD3]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse bg-[#E8E5DE]" />
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse border border-[#E3E0D8] bg-white"
          />
        ))}
      </div>

      <div className="mt-6 h-56 animate-pulse border border-[#E3E0D8] bg-white" />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse border border-[#E3E0D8] bg-white" />
        <div className="h-80 animate-pulse border border-[#E3E0D8] bg-white" />
      </div>
    </section>
  );
}