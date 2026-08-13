import {
  CalendarDays,
  House,
  MessageSquareQuote,
  Settings,
  SlidersHorizontal,
  UserRoundCog,
  BedDouble
} from "lucide-react";

export const adminNavigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: House,
  },
  {
    label: "Rezervasyonlar",
    href: "/admin/reservations",
    icon: CalendarDays,
  },
  {
    label: "Konaklamalar",
    href: "/admin/accommodations",
    icon: SlidersHorizontal,
  },
    {
  label: "Odalar",
  href: "/admin/rooms",
  icon: BedDouble,
},
  {
    label: "Yorumlar",
    href: "/admin/reviews",
    icon: MessageSquareQuote,
  },
  {
    label: "Ana Sayfa Düzenle",
    href: "/admin/homepage",
    icon: UserRoundCog,
  },
  {
    label: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },

];