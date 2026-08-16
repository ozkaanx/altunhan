import { CalendarDays } from "lucide-react";

type DateFieldProps = {
  label: string;
  value: string;
  min: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function DateField({ label, value, min, disabled, onChange }: DateFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-medium text-[#40463F]">{label}</span>

      <span
        className={`
          mt-2
          flex
          h-[54px]
          w-full
          min-w-0
          items-center
          overflow-hidden
          border
          border-[#D9D5CD]
          bg-white
          transition-colors
          focus-within:border-[#263A2D]

          ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        `}
      >
        <span
          className="
            pointer-events-none
            flex
            h-full
            w-12
            shrink-0
            items-center
            justify-center
            border-r
            border-[#EEEAE3]
          "
        >
          <CalendarDays size={16} strokeWidth={1.5} className="text-[#A8754F]" aria-hidden="true" />
        </span>

        <input
          type="date"
          min={min}
          required
          disabled={disabled}
          value={value}
          onChange={(event) => {
            const value = event.currentTarget.value;

            if (value && value < min) {
              return;
            }

            onChange(value);
          }}
          onClick={(event) => {
            try {
              event.currentTarget.showPicker?.();
            } catch {
              // Bazı tarayıcılar showPicker çağrısını desteklemez.
            }
          }}
          className="
            h-full
            w-0
            min-w-0
            flex-1
            border-0
            bg-transparent
            px-3
            text-base
            text-[#263A2D]
            outline-none
            disabled:cursor-not-allowed
            sm:text-sm
          "
        />
      </span>
    </label>
  );
}
