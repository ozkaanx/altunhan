"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ReservationStatus } from "@/types/reservation";

type UseReservationsListNavigationParams = {
  initialSearch: string;
  currentPage: number;
  totalPages: number;
};

export function useReservationsListNavigation({
  initialSearch,
  currentPage,
  totalPages,
}: UseReservationsListNavigationParams) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const value = search.trim();

      if (value === initialSearch) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search, initialSearch, pathname, router, searchParams]);

  const changeFilter = (filter: ReservationStatus | "all") => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (filter === "all") {
      params.delete("status");
    } else {
      params.set("status", filter);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: true,
    });
  };

  return {
    search,
    setSearch,
    changeFilter,
    changePage,
  };
}
