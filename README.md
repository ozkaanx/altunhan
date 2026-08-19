# Altunhan son rezervasyon güncellemesi

Bu paket üç değişikliği birlikte içerir:

- Rezervasyon detayında yalnızca adminlerin görebildiği ve düzenleyebildiği `Admin Notu`
- Odalar ekranında giriş–çıkış tarih aralığına göre dolu/müsait oda kontrolü
- Yeni müşteri ve admin rezervasyonlarında zorunlu, algoritmik doğrulamalı T.C. kimlik numarası

Müşteri notu alanı eklenmemiştir.

## Kurulum

ZIP dosyasını proje kökünde açın ve aynı adlı dosyaların üzerine yazılmasına izin verin.

Supabase üretim veritabanındaki gerekli alan, doğrulama ve RPC değişiklikleri uygulanmıştır. Mevcut mock rezervasyonların T.C. kimlik alanı boş kalabilir; yalnızca bundan sonra oluşturulan rezervasyonlarda zorunludur.

Ardından çalıştırın:

```powershell
npm run format
npm run lint
npm run build
```

## Hızlı kontrol

1. `/admin/rooms` ekranında giriş `21.08.2026`, çıkış `23.08.2026` seçin. Bu aralıkla çakışan rezervasyonu olan odalar dolu görünmelidir.
2. Çıkışı `23.08.2026` olan bir rezervasyon, `23.08.2026` girişli yeni aralıkla çakışmamalıdır.
3. Yeni rezervasyonda geçersiz T.C. kimlik numarası kabul edilmemeli; geçerli 11 haneli numara kaydedilmelidir.
4. Admin rezervasyon detayında T.C. kimlik numarası ve `Admin Notu` görünmelidir. Not düzenlenip kaydedilebilmelidir.
