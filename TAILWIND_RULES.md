# Altunhan Tailwind Kuralları

## Tasarım token'ları

- Marka renklerinde doğrudan hex değer yazmak yerine `farm-*` token'larını kullan.
- Yeni bir renk eklemeden önce `tailwind.config.ts` içindeki mevcut paleti kontrol et.
- Durum renkleri yalnızca gerçekten durum bildiren alanlarda yerel kalabilir.

## Bileşen sınırları

- Aynı görsel yapı üç veya daha fazla yerde kullanılıyorsa ortak bileşen veya `cva` varyantı oluştur.
- Yalnızca class listesini kısaltmak için bileşen oluşturma.
- Butonlarda `components/ui/button.tsx`, standart inputlarda `components/ui/input.tsx` kullan.
- Koşullu class birleştirmelerinde string template yerine mümkün olduğunda `cn()` kullan.

## Class yerleşimi

- Responsive yerleşim ve bileşene özel ölçüler JSX içinde kalabilir.
- Tekrar eden renk, tipografi ve etkileşim stilleri varyantlara taşınmalıdır.
- `@apply` yalnızca global HTML tabanı gibi istisnai alanlarda kullanılmalıdır.
- Class sırasını elle düzenleme; Prettier Tailwind eklentisinin sıralamasını kullan.

## Değişiklik kontrolü

- Tasarım refactor'unda görsel ölçüler, breakpoint'ler ve etkileşim durumları korunmalıdır.
- Değişiklikten sonra `npm run format:check`, `npm run lint` ve `npm run build` çalıştırılmalıdır.
