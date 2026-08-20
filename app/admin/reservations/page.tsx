import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ReservationsList } from "@/components/admin/reservations-list";

import type { Reservation, ReservationStatus } from "@/types/reservation";

const PAGE_SIZE = 20;

const activeReservationStatuses: ReservationStatus[] = [
  "pending_payment",
  "pending_approval",
  "confirmed",
];

const allowedStatuses: ReservationStatus[] = [
  "pending_payment",
  "pending_approval",
  "confirmed",
  "rejected",
  "cancelled",
];

type ReservationsPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
};

function parsePage(value?: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function parseStatus(value?: string): ReservationStatus | "all" {
  if (value && allowedStatuses.includes(value as ReservationStatus)) {
    return value as ReservationStatus;
  }

  return "all";
}

function sanitizeSearch(value?: string) {
  return value?.trim().replace(/[,()]/g, " ").replace(/\s+/g, " ").slice(0, 100) ?? "";
}

function createPageUrl({
  page,
  status,
  search,
}: {
  page: number;
  status: ReservationStatus | "all";
  search: string;
}) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", String(page));
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (search) {
    params.set("search", search);
  }

  const query = params.toString();

  return query ? `/admin/reservations?${query}` : "/admin/reservations";
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const params = await searchParams;

  const currentPage = parsePage(params.page);

  const activeStatus = parseStatus(params.status);

  const search = sanitizeSearch(params.search);

  const from = (currentPage - 1) * PAGE_SIZE;

  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let reservationsQuery = supabase.from("reservations").select(
    `
          *,
          accommodations (
            id,
            title
          ),
          rooms (
            id,
            room_name,
            room_number
          ),
          reservation_payments (
            id,
            reservation_id,
            amount,
            requested_amount,
            payment_type,
            payment_method,
            status,
            receipt_storage_path,
            admin_note,
            paid_at,
            created_at
          )
        `,
    {
      count: "exact",
    },
  );

  if (activeStatus === "all") {
    reservationsQuery = reservationsQuery.in("status", activeReservationStatuses);
  } else {
    reservationsQuery = reservationsQuery.eq("status", activeStatus);
  }

  if (search) {
    reservationsQuery = reservationsQuery.or(
      [
        `reservation_code.ilike.%${search}%`,
        `guest_name.ilike.%${search}%`,
        `guest_phone.ilike.%${search}%`,
        `guest_email.ilike.%${search}%`,
      ].join(","),
    );
  }

  const [reservationsResult, pendingResult] = await Promise.all([
    reservationsQuery
      .order("created_at", {
        ascending: false,
      })
      .range(from, to),

    supabase
      .from("reservations")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending_approval"),
  ]);

  const { data, error, count } = reservationsResult;

  if (error) {
    console.error("Rezervasyonlar alınamadı:", error);

    return (
      <section>
        <div className="border border-[#E7D6D1] bg-[#F8EEEA] px-5 py-14 text-center">
          <h2 className="text-sm font-semibold text-[#8A5147]">Rezervasyonlar yüklenemedi</h2>

          <p className="mt-2 text-xs text-[#9B746D]">Veriler alınırken bir hata oluştu.</p>
        </div>
      </section>
    );
  }

  const totalCount = count ?? 0;

  const pendingCount = pendingResult.count ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (currentPage > totalPages && totalCount > 0) {
    redirect(
      createPageUrl({
        page: totalPages,
        status: activeStatus,
        search,
      }),
    );
  }

  return (
    <ReservationsList
      key={search}
      reservations={(data ?? []) as Reservation[]}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      pendingCount={pendingCount}
      activeStatus={activeStatus}
      initialSearch={search}
      pageSize={PAGE_SIZE}
    />
  );
}
