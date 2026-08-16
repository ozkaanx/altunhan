# Altunhan Farm

**Altunhan Farm**, Saros bölgesindeki konaklama işletmesinin tanıtım, rezervasyon ve operasyon süreçlerini tek uygulama üzerinden yöneten web projesidir.

Proje yalnızca bir tanıtım sitesi değildir. Aynı kod tabanı içerisinde:

- Public web sitesi
- Konaklama detay sayfaları
- Online rezervasyon oluşturma
- Tarih / müsaitlik kontrolü
- Havale / EFT ödeme ve dekont yükleme
- Rezervasyon takip sistemi
- Admin paneli
- Konaklama ve görsel yönetimi
- Rezervasyon operasyonları
- Ana sayfa içerik yönetimi
- Misafir yorumları yönetimi
- İletişim ve banka bilgileri yönetimi
- Opsiyonel e-posta bildirim sistemi
- SEO, sitemap ve robots yapılandırması
  bulunmaktadır.

| Teknoloji                | Kullanım                       |
| ------------------------ | ------------------------------ |
| **Next.js 16**           | Framework / App Router         |
| **React 19**             | UI                             |
| **TypeScript**           | Tip güvenliği                  |
| **Supabase**             | Database, Auth, Storage ve RPC |
| **@supabase/ssr**        | Server-side session yönetimi   |
| **Tailwind CSS**         | Styling                        |
| **shadcn/ui / Radix UI** | UI component altyapısı         |
| **Zod**                  | Form ve server-side validation |
| **Lucide React**         | Icon set                       |
| **React Icons**          | Ek ikonlar                     |
| **ESLint**               | Static code analysis           |
| **Prettier**             | Code formatting                |

# Proje Mimarisi

Proje Next.js App Router yapısını kullanmaktadır.

Genel veri akışı:

```text
Page
 ↓
Component
 ↓
Custom Hook
 ↓
Server Action
 ↓
Supabase
 ↓
PostgreSQL / RPC / Storage
```

Projede mümkün olduğunca sorumluluklar ayrılmıştır.

### `app/`

Route'lar, page'ler ve Server Action'lar burada bulunur.

### `components/`

UI ve feature component'leri.

### `hooks/`

Client-side state ve feature davranışları.

### `lib/`

Framework'ten bağımsız business logic, formatter, auth, notification ve Supabase yardımcıları.

### `types/`

Feature bazlı TypeScript type tanımları.

Bu ayrımı yeni geliştirmelerde de korumaya çalışın.

---

# Ana Sayfalar ve Route'lar

## Public

### `/`

Ana sayfa.

Konaklama seçenekleri, deneyim alanları, lokasyon, yorumlar ve diğer site içeriklerini gösterir.

Ana sayfa içeriklerinin önemli bir bölümü admin panelinden değiştirilebilir.

---

### `/konaklama/[slug]`

Konaklama detay sayfası.

Her konaklama kendi `slug` değeri üzerinden erişilir.

Örnek:

```text
/konaklama/tas-ev
```

Bu sayfada konaklamanın:

- Görselleri
- Açıklaması
- Özellikleri
- Kapasitesi
- Fiyatı
- Rezervasyon CTA'ları

gösterilir.

---

### `/rezervasyon`

Public rezervasyon ekranıdır.

Kullanıcı burada:

1. Konaklama seçer.
2. Giriş / çıkış tarihlerini belirler.
3. Yetişkin / çocuk sayılarını girer.
4. İletişim bilgilerini girer.
5. Rezervasyonu oluşturur.
6. Banka bilgilerini görür.
7. Ödemesini yaptıktan sonra dekont yükleyebilir.

---

### `/rezervasyon/takip`

Rezervasyon takip ekranıdır.

Rezervasyon sorgulaması:

```text
Rezervasyon Kodu + Telefon Numarası
```

ile yapılır.

Rezervasyon tamamlanmamış bir durumdaysa istemci rezervasyon durumunu belirli aralıklarla otomatik olarak tekrar kontrol eder.

Rezervasyon oluşturulduktan sonra kullanıcı bu sayfaya şu şekilde de yönlendirilebilir:

```text
/rezervasyon/takip?code=REZERVASYON_KODU
```

---

## Yasal Sayfalar

```text
/kvkk
/gizlilik
/cerez-politikasi
```

---

## Authentication

```text
/auth/login
/auth/forgot-password
/auth/update-password
/auth/confirm
/auth/error
```

Bu route'lar Supabase Auth ile çalışmaktadır.

---

# Rezervasyon Akışı

Rezervasyon sistemi uygulamanın en kritik alanlarından biridir.

## 1. Konaklama seçimi

Aktif konaklamalar kullanıcıya gösterilir.

Konaklama seçiminde kapasite bilgileri dikkate alınır:

```text
max_adults
max_children
max_total_guests
```

---

## 2. Müsaitlik kontrolü

Konaklama seçildiğinde sistem o konaklamaya ait dolu tarih aralıklarını Supabase'den ister.

Frontend, seçilen tarihlerin mevcut bir rezervasyonla çakışıp çakışmadığını kontrol eder.

Ancak gerçek rezervasyon güvenliği yalnızca frontend kontrolüne bırakılmamalıdır.

Rezervasyon oluşturma işleminin son kontrolü Supabase / PostgreSQL tarafındadır.

---

## 3. Misafir sayısı

Sistem ayrı ayrı:

```text
adult_count
child_count
```

tutar.

Ayrıca toplam misafir sayısı konaklamanın:

```text
max_total_guests
```

kapasitesini geçemez.

---

## 4. İletişim bilgileri

Rezervasyon sırasında:

```text
guest_name
guest_phone
guest_email
```

bilgileri alınır.

Validation hem client tarafında hem Server Action tarafında uygulanmaktadır.

---

## 5. Rezervasyon oluşturma

Public rezervasyon doğrudan `reservations` tablosuna insert edilmez.

Rezervasyon oluşturmak için Supabase RPC kullanılmaktadır:

```text
create_public_reservation_v2
```

RPC aşağıdaki kritik işlemleri database tarafında gerçekleştirir:

- Rezervasyonun oluşturulması
- Rezervasyon kodunun üretilmesi
- Gecelik / toplam fiyat bilgilerinin belirlenmesi
- Tarih ve müsaitlik kurallarının uygulanması

Frontend bu RPC'den oluşturulan rezervasyonun özet bilgisini alır.

---

## 6. Ödeme

Şu anda ödeme modeli:

```text
Banka Havalesi / EFT
```

üzerinden ilerlemektedir.

Banka bilgileri hard-code değildir.

Admin panelindeki:

```text
site_settings
```

kaydı üzerinden yönetilir.

Burada:

- Hesap sahibi
- Banka
- IBAN
- Telefon
- WhatsApp
- E-posta
- Adres

bilgileri saklanmaktadır.

---

## 7. Dekont yükleme

Kullanıcı ödeme yaptıktan sonra dekont yükleyebilir.

Desteklenen formatlar:

```text
JPG
PNG
WEBP
PDF
```

Maksimum dosya boyutu:

```text
10 MB
```

Dosya Supabase Storage'daki:

```text
reservation-receipts
```

bucket'ına yüklenir.

Storage path yapısı yaklaşık olarak:

```text
{reservationCode}/{uuid}.{extension}
```

şeklindedir.

Upload tamamlandıktan sonra dosya rezervasyona:

```text
submit_reservation_receipt
```

RPC'si ile bağlanır.

Database işlemi başarısız olursa yüklenen Storage dosyası temizlenmeye çalışılır.

---

# Rezervasyon Durumları

Rezervasyon sistemi status bazlı ilerlemektedir.

Başlıca durumlar:

```text
pending_approval
confirmed
rejected
cancelled
```

## `pending_approval`

Rezervasyon oluşturulmuş ve yönetici onayı bekliyordur.

## `confirmed`

Admin rezervasyonu onaylamıştır.

## `rejected`

Admin rezervasyonu reddetmiştir.

Red işleminde sebep girilmesi gerekir.

## `cancelled`

Daha önce onaylanmış rezervasyon admin tarafından iptal edilmiştir.

İptal sebebi kayıt altında tutulur.

### Önemli

Status değişikliklerinde yalnızca UI state değiştirilmez.

İşlem Server Action üzerinden database'e yazılır ve ilgili Next.js route'ları `revalidatePath` ile yenilenir.

---

# Admin Paneli

Admin paneli:

```text
/admin
```

altındadır.

Public kullanıcıların erişimine açık değildir.

---

## Dashboard

```text
/admin
```

Dashboard üzerinde operasyon için özet bilgiler gösterilir.

Örnek metrikler:

- Toplam rezervasyon
- Onay bekleyen rezervasyon sayısı
- Aktif konaklama sayısı
- Aylık gelir
- Bugünkü girişler
- Yaklaşan rezervasyonlar
- Son rezervasyonlar
- Operasyon uyarıları

---

## Rezervasyon Yönetimi

```text
/admin/reservations
```

Rezervasyonların listelendiği ana operasyon ekranıdır.

Admin burada rezervasyonları görüntüleyebilir ve durumlarını yönetebilir.

Ayrıca:

```text
/admin/reservations/new
```

üzerinden admin tarafından manuel rezervasyon oluşturulabilir.

Bu özellik telefon, WhatsApp veya işletme üzerinden doğrudan gelen rezervasyonlar için kullanılabilir.

---

## Konaklama Yönetimi

```text
/admin/accommodations
```

Konaklama kayıtlarını yönetir.

Yeni kayıt:

```text
/admin/accommodations/new
```

Düzenleme:

```text
/admin/accommodations/[id]
```

Konaklama modelinde başlıca:

```text
title
slug
short_description
description
price

max_adults
max_children
max_total_guests

bed_count
bathroom_count

amenities
is_active
```

alanları kullanılmaktadır.

`capacity` alanı legacy uyumluluk nedeniyle hâlâ güncellenmektedir ve `max_total_guests` ile senkron tutulur.

---

## Konaklama Görselleri

Konaklama görselleri Supabase Storage'daki:

```text
accommodations
```

bucket'ında tutulur.

Database tarafında metadata:

```text
accommodation_images
```

tablosunda tutulmaktadır.

Görsellerde:

```text
image_url
storage_path
sort_order
is_cover
```

gibi bilgiler vardır.

Desteklenen görsel uzantıları:

```text
jpg
jpeg
png
webp
gif
avif
```

---

## Oda / Doluluk Panosu

```text
/admin/rooms
```

Rezervasyon ve konaklama durumlarının operasyonel olarak takip edildiği paneldir.

Bu bölümde değişiklik yapılırken rezervasyon tarihleri ve status kurallarıyla ilişkisi göz önünde bulundurulmalıdır.

---

## Ana Sayfa İçerik Yönetimi

```text
/admin/homepage
```

Ana sayfadaki metinsel içeriklerin büyük bölümü database üzerinden yönetilir.

Veri kaynağı:

```text
homepage_content
```

Başlıca yönetilebilir alanlar:

- Hero
- Experience
- Feature alanları
- Konaklama bölümü
- Lokasyon
- Yorum başlıkları
- Footer CTA

Ana sayfada metin değiştirmek için mümkün olduğunca component içerisine hard-code eklemek yerine mevcut içerik yönetimi yapısını kullanın.

---

## Yorum Yönetimi

```text
/admin/reviews
```

Veri kaynağı:

```text
reviews
```

Admin:

- Yorum ekleyebilir
- Düzenleyebilir
- Silebilir
- Aktif / pasif yapabilir
- Gösterim sırasını değiştirebilir

---

## Site Ayarları

```text
/admin/settings
```

Veri kaynağı:

```text
site_settings
```

Buradan:

- Banka bilgileri
- IBAN
- Telefon
- WhatsApp
- E-posta
- Adres
- Siteye ait bazı operasyonel bilgiler

yönetilir.

Bu bilgiler rezervasyon ve iletişim ekranları tarafından kullanıldığı için değişiklik sonrası birden fazla route revalidate edilmektedir.

---

# Supabase Yapısı

Supabase projede dört ana görev üstlenmektedir:

```text
PostgreSQL Database
Authentication
Storage
PostgreSQL RPC
```

Kod içerisinde kullanılan önemli tablolar arasında şunlar bulunmaktadır:

```text
accommodations
accommodation_images
reservations
homepage_content
reviews
site_settings
```

Bu liste database'in tamamını ifade etmek zorunda değildir; uygulama kodunun doğrudan kullandığı temel domain tablolarını gösterir.

---

# Storage Bucket'ları

Uygulamanın çalışabilmesi için Supabase Storage tarafında ilgili bucket'ların bulunması gerekir.

## Konaklama görselleri

```text
accommodations
```

## Rezervasyon dekontları

```text
reservation-receipts
```

Storage policy'leri production ortamında ayrıca kontrol edilmelidir.

Özellikle dekontlar kullanıcıya ait ödeme belgeleri olduğu için public erişim politikaları dikkatli yönetilmelidir.

---

# Supabase RPC Bağımlılıkları

Public rezervasyon sistemi bazı önemli PostgreSQL RPC fonksiyonlarına bağımlıdır.

## Rezervasyon oluşturma

```sql
create_public_reservation_v2
```

---

## Dolu tarihleri alma

```sql
get_accommodation_busy_ranges
```

---

## Rezervasyon sorgulama

```sql
get_public_reservation_status_v2
```

Rezervasyon:

```text
reservation_code + guest_phone
```

kombinasyonu üzerinden sorgulanır.

---

## Dekont gönderme

```sql
submit_reservation_receipt
```

### Çok önemli

Bu RPC'lerin implementasyonları uygulama repository'sinin TypeScript kodundan bağımsız olarak Supabase PostgreSQL tarafında bulunmalıdır.

Yeni bir Supabase projesi oluşturup yalnızca frontend repository'sini bağlamak rezervasyon sisteminin çalışması için yeterli değildir.

---

# Authentication ve Admin Yetkilendirmesi

Authentication Supabase Auth üzerinden yapılmaktadır.

Session yönetimi:

```text
@supabase/ssr
```

ile gerçekleştirilir.

Root seviyesindeki:

```text
proxy.ts
```

Supabase session bilgisini günceller.

## Public route'lar

Örnek:

```text
/
/konaklama/*
/rezervasyon
/rezervasyon/takip
```

login gerektirmez.

## Admin route'ları

```text
/admin
/admin/*
```

authentication gerektirir.

Login olmayan kullanıcı:

```text
/auth/login
```

sayfasına yönlendirilir.

---

## Admin Allowlist

Sadece Supabase'te kullanıcı hesabının bulunması admin yetkisi için yeterli değildir.

Kritik admin işlemlerinde:

```text
ADMIN_EMAILS
```

environment variable'ındaki allowlist kontrol edilir.

Örnek:

```env
ADMIN_EMAILS=admin@altunhan.com,yonetici@altunhan.com
```

Yeni admin eklerken:

1. Supabase Auth kullanıcısının bulunması
2. Kullanıcı e-postasının `ADMIN_EMAILS` içerisine eklenmesi

gereklidir.

---

# E-posta Bildirimleri

Projede rezervasyon bildirimleri için opsiyonel **Resend** entegrasyonu bulunmaktadır.

Environment variable'ları boş bırakılırsa:

```text
Rezervasyon sistemi çalışmaya devam eder.
E-posta sistemi devre dışı kalır.
```

Bu nedenle mail servisi uygulamanın rezervasyon oluşturabilmesi için zorunlu değildir.

Mail altyapısı aktif olduğunda rezervasyon süreçlerindeki bazı olaylarda bildirim gönderilebilir.

Örnek:

- Dekont gönderilmesi
- Rezervasyon onayı
- Rezervasyon reddi

Notification kodları:

```text
lib/notifications/
```

altında tutulmaktadır.

---

# Environment Variables

Repository içerisinde örnek environment dosyası:

```text
.env.ex
```

bulunmaktadır.

Local geliştirme için:

```bash
cp .env.ex .env.local
```

veya Windows üzerinde `.env.ex` dosyasını `.env.local` olarak kopyalayın.

Temel yapı:

```env
# ===============================
# SUPABASE
# ===============================

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key


# ===============================
# ADMIN
# ===============================

ADMIN_EMAILS=admin@example.com


# ===============================
# SITE
# ===============================

NEXT_PUBLIC_SITE_URL=http://localhost:3000


# ===============================
# EMAIL - OPTIONAL
# ===============================

RESEND_API_KEY=
RESEND_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAIL=
RESEND_REPLY_TO_EMAIL=
```

## Zorunlu

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ADMIN_EMAILS
NEXT_PUBLIC_SITE_URL
```

## Opsiyonel

```text
RESEND_API_KEY
RESEND_FROM_EMAIL
ADMIN_NOTIFICATION_EMAIL
RESEND_REPLY_TO_EMAIL
```

Gerçek secret değerlerini repository'ye commit etmeyin.

---

# Kurulum

## 1. Repository'yi klonlayın

```bash
git clone https://github.com/ozkaanx/altunhan.git
```

```bash
cd altunhan
```

---

## 2. Dependency'leri yükleyin

```bash
npm install
```

CI veya temiz kurulumlarda:

```bash
npm ci
```

tercih edilebilir.

---

## 3. Environment dosyasını oluşturun

`.env.ex` dosyasını:

```text
.env.local
```

olarak kopyalayın.

Ardından Supabase ve diğer environment değerlerini doldurun.

---

## 4. Development server'ı çalıştırın

```bash
npm run dev
```

Varsayılan olarak:

```text
http://localhost:3000
```

üzerinden erişebilirsiniz.

---

# Geliştirme Komutları

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Production server

```bash
npm run start
```

## ESLint

```bash
npm run lint
```

## ESLint otomatik düzeltme

```bash
npm run lint:fix
```

## Prettier

```bash
npm run format
```

## Format kontrolü

```bash
npm run format:check
```

PR açmadan önce en az:

```bash
npm run lint
npm run format:check
npm run build
```

çalıştırılması önerilir.

---

# Klasör Yapısı

Özet proje yapısı:

```text
altunhan/
│
├── app/
│   ├── admin/
│   │   ├── accommodations/
│   │   ├── homepage/
│   │   ├── reservations/
│   │   ├── reviews/
│   │   ├── rooms/
│   │   └── settings/
│   │
│   ├── auth/
│   ├── konaklama/
│   ├── rezervasyon/
│   │   ├── actions/
│   │   └── takip/
│   │
│   ├── cerez-politikasi/
│   ├── gizlilik/
│   ├── kvkk/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── accommodation/
│   ├── admin/
│   │   ├── accommodation-form/
│   │   ├── dashboard/
│   │   ├── reservation-detail/
│   │   ├── reservation-form/
│   │   ├── reservations-list/
│   │   ├── rooms-board/
│   │   └── settings-form/
│   │
│   ├── reservation/
│   │   ├── form/
│   │   ├── payment/
│   │   └── tracking/
│   │
│   ├── shared/
│   └── ui/
│
├── hooks/
│   ├── admin/
│   ├── reservation/
│   └── shared/
│
├── lib/
│   ├── accommodation/
│   ├── admin/
│   ├── auth/
│   ├── formatters/
│   ├── notifications/
│   ├── reservation/
│   └── supabase/
│
├── public/
│   └── images/
│
├── types/
│
├── proxy.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.ex
```

---

# Kod Organizasyonu

Projede son geliştirmelerde büyük component'ler feature bazlı daha küçük parçalara ayrılmıştır.

Yeni kod eklerken aynı yaklaşımın korunması önerilir.

## Component

Component mümkün olduğunca:

```text
rendering + user interaction
```

sorumluluğunda kalmalıdır.

---

## Hook

Form state'i, async işlem durumu veya client davranışı büyüyorsa:

```text
hooks/{feature}/
```

altına taşınmalıdır.

Örnek:

```text
hooks/reservation/use-reservation-form.ts
hooks/reservation/use-reservation-availability.ts
hooks/reservation/use-reservation-tracking.ts
```

---

## Server Action

Database mutation veya server-side işlem:

```text
app/**/action.ts
app/**/actions/*.ts
```

dosyalarında tutulmaktadır.

Yeni mutation'larda authentication, validation ve error handling'in Server Action tarafında da yapılması önemlidir.

Frontend validation tek başına güvenlik kontrolü değildir.

---

## Business Logic

UI'dan bağımsız hesaplama veya helper:

```text
lib/{feature}/
```

altına eklenmelidir.

Örnek:

```text
lib/reservation/date-utils.ts
lib/reservation/reservation-utils.ts
lib/reservation/status-utils.ts
```

---

## Types

Feature'a özel type'lar:

```text
types/
```

altındadır.

API / database response shape'lerini component içerisinde tekrar tanımlamak yerine mevcut type'ları kullanın veya ilgili `types/*.ts` dosyasını genişletin.

---

# Yeni Geliştirici İçin Başlangıç Noktaları

Projeye ilk kez giren bir geliştiricinin şu sırayla incelemesi önerilir.

## Public site

```text
app/page.tsx
components/shared/
components/accommodation/
```

## Rezervasyon

```text
app/rezervasyon/
components/reservation/
hooks/reservation/
lib/reservation/
types/public-reservation.ts
types/reservation.ts
```

## Admin

```text
app/admin/
components/admin/
hooks/admin/
lib/admin/
```

## Authentication

```text
proxy.ts
lib/supabase/
lib/auth/admin.ts
```

## E-posta

```text
lib/notifications/
```

Bu dosyalar incelendiğinde uygulamanın ana mimarisi büyük ölçüde anlaşılabilir.

---

# SEO

Projede Next.js metadata API kullanılmaktadır.

Root metadata:

```text
app/layout.tsx
```

üzerindedir.

Ayrıca:

```text
app/sitemap.ts
app/robots.ts
```

dosyaları bulunmaktadır.

Konaklama detay sayfaları SEO açısından ayrı route'larda tutulmaktadır:

```text
/konaklama/[slug]
```

Production domain değiştiğinde:

```env
NEXT_PUBLIC_SITE_URL=
```

değerinin doğru olduğundan emin olun.

Canonical, Open Graph, sitemap ve diğer absolute URL'ler bu değerle ilişkili olabilir.

---

# Deployment

Uygulama standart Next.js deployment modeli ile çalışır.

Vercel kullanılacaksa production ortamında environment variable'ların proje ayarlarına ayrıca eklenmesi gerekir.

Özellikle:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ADMIN_EMAILS
NEXT_PUBLIC_SITE_URL
```

değerlerini kontrol edin.

Mail kullanılacaksa Resend environment değerlerini de ekleyin.

Deploy öncesinde:

```bash
npm run lint
npm run format:check
npm run build
```

çalıştırılması önerilir.

---

# Önemli Bakım Notları

## 1. Database schema repository içerisinde version-controlled migration olarak bulunmuyor

Bu repository'de uygulama kodu vardır ancak mevcut Supabase PostgreSQL yapısının tamamını yeniden oluşturacak migration dosyaları bulunmamaktadır.

Bu nedenle yeni ortam kurulurken:

```text
GitHub repository
+
Supabase database/schema
+
RPC functions
+
Storage buckets
+
Storage/RLS policies
+
Auth configuration
```

birlikte düşünülmelidir.

Sadece repository'yi klonlamak production sistemini yeniden oluşturmak için yeterli değildir.

İleride database değişiklikleri yapılacaksa Supabase migration'larının repository altında version control'e alınması önerilir.

---

## 2. RPC isimlerini değiştirirken dikkat edin

Aşağıdaki fonksiyonlar public rezervasyon sisteminin kritik parçalarıdır:

```text
create_public_reservation_v2
get_accommodation_busy_ranges
get_public_reservation_status_v2
submit_reservation_receipt
```

Database'de isim veya signature değişirse ilgili Server Action'lar da güncellenmelidir.

---

## 3. Rezervasyon status'larını kontrolsüz değiştirmeyin

Status değerleri UI, admin operasyonları, rezervasyon takip ekranı ve bildirim sistemi tarafından kullanılmaktadır.

Özellikle:

```text
pending_approval
confirmed
rejected
cancelled
```

değerlerinde değişiklik yapılacaksa tüm kullanım noktaları birlikte incelenmelidir.

---

## 4. Storage dosyası ile database kaydını birlikte düşünün

Konaklama fotoğrafları ve rezervasyon dekontlarında hem Storage hem database kaydı bulunmaktadır.

Dosya silme / güncelleme işlemlerinde yalnızca database veya yalnızca Storage tarafını değiştirmek orphan record / orphan file oluşturabilir.

---

## 5. Admin yetkisi sadece route korumasına bırakılmamalıdır

Yeni kritik Server Action geliştirirken:

```ts
requireAdmin();
```

kontrol modelini kullanın.

Client tarafında butonu gizlemek güvenlik kontrolü değildir.

---

## 6. Public rezervasyon kurallarını yalnızca frontend'e koymayın

Tarih çakışması, kapasite, fiyat veya rezervasyon oluşturma gibi kritik business rule'lar database / server tarafında da doğrulanmalıdır.

Aksi halde client bypass edilerek hatalı rezervasyon oluşturulabilir.

---

## 7. Ana sayfa içeriğini gereksiz yere hard-code etmeyin

Admin panelinden yönetilen alanlarda değişiklik yapılacaksa önce:

```text
homepage_content
site_settings
reviews
```

yapılarını kontrol edin.

---

# Projenin Kısa Özeti

Altunhan Farm uygulamasının ana domain akışı:

```text
Konaklama
    ↓
Müsaitlik
    ↓
Rezervasyon
    ↓
Ödeme / Dekont
    ↓
Admin Kontrolü
    ↓
Onay / Red
    ↓
Misafir Rezervasyon Takibi
```

Public web sitesi ile işletme operasyon paneli aynı Next.js uygulaması içerisinde çalışmaktadır.

Yeni geliştirmelerde mevcut:

```text
Page
→ Component
→ Hook
→ Server Action
→ Supabase
```

sorumluluk ayrımının korunması, projenin sürdürülebilirliği açısından önemlidir.

---

**Altunhan Farm**
Saros'ta doğayla iç içe konaklama.
ozkan.ttr1@gmail.com
