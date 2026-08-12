export default function ReservationLoading() {
  return (
    <main className="min-h-screen bg-[#F4F2ED]">
      <div className="border-b border-[#E2DED6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse bg-[#E8E5DE]" />
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="max-w-[680px]">
          <div className="h-3 w-28 animate-pulse bg-[#E1DED7]" />
          <div className="mt-4 h-12 w-72 animate-pulse bg-[#DDDAD3]" />
          <div className="mt-4 h-4 w-full max-w-[520px] animate-pulse bg-[#E5E2DB]" />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse border border-[#E3E0D8] bg-white"
              />
            ))}
          </div>

          <div className="h-80 animate-pulse border border-[#E3E0D8] bg-white" />
        </div>
      </section>
    </main>
  );
}