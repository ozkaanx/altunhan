import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ReservationTracking } from "@/components/reservation/reservation-tracking";

export default function ReservationTrackingPage() {
  return (
    <main className="min-h-screen bg-[#F4F2ED]">
      <header className="border-b border-[#E2DED6] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#71766F]"
          >
            <ArrowLeft size={14} />
            Altunhan Farm
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ReservationTracking />
      </section>
    </main>
  );
}