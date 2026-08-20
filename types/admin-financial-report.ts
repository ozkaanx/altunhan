export type FinancialReportPeriod = "day" | "week" | "month";

export type FinancialReportSummary = {
  collectedRevenue: number;
  refundTotal: number;
  paymentCount: number;
  reservationCount: number;
  bookingValue: number;
  outstandingBalance: number;
  soldRoomNights: number;
  availableRoomNights: number;
  occupancyRate: number;
};

export type FinancialReportDay = {
  date: string;
  revenue: number;
  paymentCount: number;
  occupiedRooms: number;
  checkIns: number;
  checkOuts: number;
  occupancyRate: number;
};

export type FinancialReportAccommodation = {
  accommodationId: number;
  title: string;
  activeRoomCount: number;
  soldRoomNights: number;
  revenue: number;
  occupancyRate: number;
};

export type FinancialReportPaymentMethod = {
  method: "bank_transfer" | "cash" | "card" | "other";
  amount: number;
  paymentCount: number;
};

export type FinancialReportPayment = {
  paymentId: number;
  code: string;
  guestName: string;
  amount: number;
  method: FinancialReportPaymentMethod["method"];
  paidAt: string;
};

export type AdminFinancialReport = {
  startDate: string;
  endDate: string;
  summary: FinancialReportSummary;
  daily: FinancialReportDay[];
  accommodations: FinancialReportAccommodation[];
  paymentMethods: FinancialReportPaymentMethod[];
  recentPayments: FinancialReportPayment[];
};

export type FinancialReportRange = {
  period: FinancialReportPeriod;
  anchorDate: string;
  startDate: string;
  endDate: string;
  previousAnchor: string;
  nextAnchor: string;
};
