"use client";

import { useState } from "react";

import { ReservationDetailDrawer } from "@/components/admin/reservation-detail-drawer";

import type { Reservation } from "@/types/reservation";

import { useReservationsListNavigation } from "@/hooks/admin/use-reservations-list-navigation";

import { useReservationListActions } from "@/hooks/admin/use-reservation-list-actions";
import { ReservationsListToolbar } from "@/components/admin/reservations-list/reservations-list-toolbar";
import { ReservationResults } from "@/components/admin/reservations-list/reservation-results";
import { ReservationsPagination } from "@/components/admin/reservations-list/reservations-pagination";
import type { ReservationsListProps } from "@/types/admin-reservations-list";

export function ReservationsList({
  reservations,
  currentPage,
  totalPages,
  totalCount,
  pendingCount,
  activeStatus,
  initialSearch,
  pageSize,
}: ReservationsListProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const { handleReject, handleCancel } = useReservationListActions({
    onSuccess: () => {
      setSelectedReservation(null);
    },
  });

  const { search, setSearch, changeFilter, changePage } = useReservationsListNavigation({
    initialSearch,
    currentPage,
    totalPages,
  });

  const firstItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <>
      <ReservationsListToolbar
        pendingCount={pendingCount}
        totalCount={totalCount}
        firstItem={firstItem}
        lastItem={lastItem}
        activeStatus={activeStatus}
        search={search}
        onSearchChange={setSearch}
        onFilterChange={changeFilter}
      />

      <ReservationResults reservations={reservations} onSelect={setSelectedReservation} />

      <ReservationDetailDrawer
        reservation={selectedReservation}
        open={Boolean(selectedReservation)}
        onClose={() => setSelectedReservation(null)}
        onReject={handleReject}
        onCancel={handleCancel}
        onAdminNoteChange={(adminNote) =>
          setSelectedReservation((current) =>
            current
              ? {
                  ...current,
                  admin_note: adminNote,
                }
              : current,
          )
        }
      />

      <ReservationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        visiblePages={Array.from({ length: totalPages }, (_, i) => i + 1)}
        onPageChange={changePage}
      />
    </>
  );
}
