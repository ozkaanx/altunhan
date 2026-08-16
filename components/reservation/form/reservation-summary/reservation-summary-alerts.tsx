type ReservationSummaryAlertsProps = {
  dateError: string | null;
  error: string | null;
};

export function ReservationSummaryAlerts({ dateError, error }: ReservationSummaryAlertsProps) {
  return (
    <>
      {dateError && <SummaryAlert>{dateError}</SummaryAlert>}
      {error && error !== dateError && <SummaryAlert>{error}</SummaryAlert>}
    </>
  );
}

function SummaryAlert({ children }: { children: string }) {
  return (
    <div className="mt-4 border border-[#E5C7C0] bg-[#F8EEEA] p-3 text-[10px] leading-5 text-[#98584E]">
      {children}
    </div>
  );
}
