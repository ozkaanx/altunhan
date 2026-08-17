import type { ReactNode } from "react";

type SliderButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

export function SliderButton({ label, onClick, children }: SliderButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center border border-[#C9C3B7] text-[#263A2D] transition-colors duration-300 hover:border-[#263A2D] hover:bg-[#263A2D] hover:text-white"
    >
      {children}
    </button>
  );
}
