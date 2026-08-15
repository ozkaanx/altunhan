"use client";

import { useCallback, useRef } from "react";

type ScrollDirection = "prev" | "next";

const SLIDER_GAP = 16;

export function useReviewSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = useCallback((direction: ScrollDirection) => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const firstCard = slider.firstElementChild as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    const scrollAmount = firstCard.offsetWidth + SLIDER_GAP;

    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  return {
    sliderRef,
    scrollSlider,
  };
}
