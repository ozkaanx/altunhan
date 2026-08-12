import LegalPage, {
  LegalSection,
} from "@/components/shared/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Altunhan Farm"
      title="Gizlilik Politikası"
      description="Web sitemizi ve rezervasyon hizmetlerimizi kullanırken paylaştığınız bilgilerin işlenmesine ilişkin genel bilgilendirme."
    >
      <LegalSection title="Toplanan Bilgiler">
        <p>
          Rezervasyon işlemleri sırasında
          ad, telefon numarası, e-posta
          adresi, konaklama tarihleri ve
          rezervasyonla ilgili diğer
          bilgiler alınabilir.
        </p>
      </LegalSection>

      <LegalSection title="Bilgilerin Kullanımı">
        <p>
          Paylaşılan bilgiler rezervasyon
          talebinin oluşturulması,
          konaklama sürecinin yönetilmesi
          ve gerektiğinde sizinle iletişim
          kurulması amacıyla kullanılabilir.
        </p>
      </LegalSection>

      <LegalSection title="Bilgilerin Güvenliği">
        <p>
          Kişisel verilere erişimin
          sınırlandırılması ve yetkisiz
          erişimin önlenmesi amacıyla
          teknik ve organizasyonel
          tedbirler uygulanmaktadır.
        </p>
      </LegalSection>

      <LegalSection title="İletişim">
        <p>
          Gizlilik ve kişisel verilerinizle
          ilgili talepleriniz için Altunhan
          Farm ile iletişime
          geçebilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}