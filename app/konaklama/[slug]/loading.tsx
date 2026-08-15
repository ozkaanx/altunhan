export default function AccommodationLoading() {
  return (
    <main className="min-h-screen bg-[#F5F1E8]">
      <section className="px-6 py-10 md:px-12 md:py-14 lg:px-16">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_0.5fr]">
            <div className="aspect-[16/10] bg-[#E3DED4] lg:min-h-[620px]" />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <div className="aspect-square bg-[#E3DED4] lg:aspect-auto" />
              <div className="aspect-square bg-[#E3DED4] lg:aspect-auto" />
            </div>
          </div>

          <div className="mt-12 max-w-[700px]">
            <div className="h-3 w-24 bg-[#E3DED4]" />

            <div className="mt-5 h-12 w-3/4 bg-[#E3DED4]" />

            <div className="mt-5 h-4 w-full bg-[#E3DED4]" />

            <div className="mt-2 h-4 w-2/3 bg-[#E3DED4]" />

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="h-24 bg-[#E3DED4]" />
              <div className="h-24 bg-[#E3DED4]" />
              <div className="h-24 bg-[#E3DED4]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
