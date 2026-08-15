export default function ReservationTrackingLoading() {
  return (
    <main className="min-h-screen bg-[#F4F2ED]">
      <div className="border-b border-[#E2DED6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse bg-[#E8E5DE]" />
        </div>
      </div>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[560px] border border-[#E3E0D8] bg-white p-6 sm:p-8">
          <div className="h-12 w-12 animate-pulse bg-[#EEECE6]" />

          <div className="mt-6 h-3 w-28 animate-pulse bg-[#E5E2DB]" />

          <div className="mt-3 h-10 w-72 animate-pulse bg-[#DDDAD3]" />

          <div className="mt-4 h-4 w-full animate-pulse bg-[#E8E5DE]" />

          <div className="mt-8 space-y-5">
            <div>
              <div className="h-3 w-28 animate-pulse bg-[#E5E2DB]" />
              <div className="mt-2 h-12 w-full animate-pulse bg-[#F0EEE9]" />
            </div>

            <div>
              <div className="h-3 w-24 animate-pulse bg-[#E5E2DB]" />
              <div className="mt-2 h-12 w-full animate-pulse bg-[#F0EEE9]" />
            </div>

            <div className="h-12 w-full animate-pulse bg-[#D9DDD7]" />
          </div>
        </div>
      </section>
    </main>
  );
}
