import { BadgeCheck, Banknote, Clock3, UsersRound } from "lucide-react";

export const informationItems = [
  {
    icon: Banknote,
    title: "Fiyatlandırma",
    description:
      "Rezervasyon ekranında seçtiğiniz tarih ve gece sayısına göre toplam konaklama tutarını talep oluşturmadan önce görebilirsiniz.",
  },
  {
    icon: BadgeCheck,
    title: "Ödeme ve Onay",
    description:
      "Rezervasyon talebinizden sonra Havale/EFT ve dekont adımları gösterilir. Rezervasyon, ödeme ve işletme onayından sonra kesinleşir.",
  },
  {
    icon: Clock3,
    title: "Geçici Ayırma",
    description:
      "Talebiniz oluşturulduğunda uygun konaklama 1 saat boyunca geçici olarak sizin için ayrılır.",
  },
  {
    icon: UsersRound,
    title: "Misafir Kapasitesi",
    description:
      "Yetişkin ve çocuk sayısı seçtiğiniz konaklamanın kapasitesine göre kontrol edilir.",
  },
] as const;

export const faqItems = [
  {
    question: "Rezervasyonum ne zaman kesinleşir?",
    answer:
      "Rezervasyon talebinizi oluşturmanız tek başına kesin rezervasyon anlamına gelmez. Ödeme/dekont adımı tamamlandıktan ve işletme tarafından onaylandıktan sonra rezervasyonunuz kesinleşir.",
  },
  {
    question: "Konaklama ne kadar süre benim için ayrılır?",
    answer:
      "Rezervasyon talebi oluşturulduktan sonra seçtiğiniz konaklama 1 saat boyunca geçici olarak tutulur. Bu süre sonrasında da dekont yükleyebilirsiniz; ancak müsaitlik yeniden kontrol edilir.",
  },
  {
    question: "Ödemeyi nasıl yapabilirim?",
    answer:
      "Rezervasyon talebiniz oluşturulduktan sonra banka bilgileri ekranda gösterilir. Havale/EFT işleminizin ardından dekontunuzu sistem üzerinden yükleyebilirsiniz.",
  },
  {
    question: "Giriş ve çıkış saatlerini nereden öğrenebilirim?",
    answer:
      "Giriş-çıkış saatleri ile erken giriş veya geç çıkış gibi özel taleplerinizi rezervasyon öncesinde işletmeyle iletişime geçerek netleştirebilirsiniz.",
  },
  {
    question: "Rezervasyonumu iptal etmek veya değiştirmek istersem ne yapmalıyım?",
    answer:
      "İptal ve tarih değişikliği koşullarını ödeme yapmadan önce işletmeden teyit etmenizi öneririz. Mevcut rezervasyonunuzla ilgili destek için rezervasyon numaranızla iletişime geçebilirsiniz.",
  },
  {
    question: "Çocuklarla konaklama yapabilir miyiz?",
    answer:
      "Evet. Rezervasyon ekranında yetişkin ve çocuk sayılarını ayrı ayrı seçebilirsiniz. Sistem, seçtiğiniz konaklamanın yetişkin, çocuk ve toplam misafir kapasitesini otomatik olarak kontrol eder.",
  },
] as const;
