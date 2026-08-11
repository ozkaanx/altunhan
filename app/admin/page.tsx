import {
  CalendarCheck,
  CalendarClock,
  House,
  MessageSquareQuote,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Toplam Rezervasyon",
    value: "124",
    description: "Bu ay",
    icon: CalendarCheck,
  },
  {
    title: "Bekleyen Rezervasyon",
    value: "8",
    description: "Onay bekliyor",
    icon: CalendarClock,
  },
  {
    title: "Konaklama",
    value: "6",
    description: "Aktif oda",
    icon: House,
  },
  {
    title: "Yorumlar",
    value: "18",
    description: "Yayındaki yorum",
    icon: MessageSquareQuote,
  },
];

const reservations = [
  {
    name: "Ahmet Yılmaz",
    accommodation: "Bungalov",
    checkIn: "12 Ağustos",
    checkOut: "15 Ağustos",
    status: "Onaylandı",
  },
  {
    name: "Mehmet Kaya",
    accommodation: "Taş Oda",
    checkIn: "14 Ağustos",
    checkOut: "17 Ağustos",
    status: "Bekliyor",
  },
  {
    name: "Ayşe Demir",
    accommodation: "Bungalov",
    checkIn: "18 Ağustos",
    checkOut: "21 Ağustos",
    status: "Onaylandı",
  },
];

export default function AdminPage() {
  return (
    <section>
      {/* Page Heading */}
      <div className="mb-8">
        <p className="text-xs text-[#8B8E87]">
          11 Ağustos 2026
        </p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#263A2D]">
          Dashboard
        </h2>

        <p className="mt-2 text-sm text-[#71756E]">
          Altunhan Farm'ın genel durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="border border-[#E3E0D8] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#83877F]">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-semibold tracking-tight text-[#263A2D]">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-[11px] text-[#A0A39C]">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center bg-[#EEF0EA] text-[#526048]">
                  <Icon
                    size={19}
                    strokeWidth={1.6}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.7fr]">
        {/* Recent Reservations */}
        <section className="border border-[#E3E0D8] bg-white">
          <div className="flex items-center justify-between border-b border-[#EAE7E0] px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold text-[#263A2D]">
                Son Rezervasyonlar
              </h3>

              <p className="mt-1 text-[11px] text-[#92958E]">
                Son gelen rezervasyon talepleri
              </p>
            </div>

            <button
              type="button"
              className="text-[11px] font-medium text-[#A8754F]"
            >
              Tümünü Gör
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-[#EFECE6] text-left">
                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
                    Misafir
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
                    Konaklama
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
                    Giriş
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
                    Çıkış
                  </th>

                  <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#969990]">
                    Durum
                  </th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={`${reservation.name}-${reservation.checkIn}`}
                    className="border-b border-[#F0EDE7] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-xs font-medium text-[#343A34]">
                      {reservation.name}
                    </td>

                    <td className="px-5 py-4 text-xs text-[#747971]">
                      {reservation.accommodation}
                    </td>

                    <td className="px-5 py-4 text-xs text-[#747971]">
                      {reservation.checkIn}
                    </td>

                    <td className="px-5 py-4 text-xs text-[#747971]">
                      {reservation.checkOut}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
                          ${
                            reservation.status === "Onaylandı"
                              ? "bg-[#E7EFE7] text-[#496249]"
                              : "bg-[#F5ECDD] text-[#956B35]"
                          }
                        `}
                      >
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Occupancy */}
        <section className="border border-[#E3E0D8] bg-[#263A2D] p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/60">
                Doluluk Oranı
              </p>

              <p className="mt-4 text-5xl font-semibold tracking-tight">
                %74
              </p>
            </div>

            <TrendingUp
              size={24}
              strokeWidth={1.5}
              className="text-[#C9B08A]"
            />
          </div>

          <p className="mt-4 text-xs leading-5 text-white/55">
            Geçtiğimiz aya göre doluluk oranında %12 artış var.
          </p>

          <div className="mt-8">
            <div className="flex justify-between text-[10px] text-white/50">
              <span>Doluluk</span>
              <span>74%</span>
            </div>

            <div className="mt-2 h-1.5 bg-white/10">
              <div className="h-full w-[74%] bg-[#C9B08A]" />
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
              Ağustos
            </p>

            <p className="mt-2 text-sm text-white/80">
              Yoğun dönem
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}