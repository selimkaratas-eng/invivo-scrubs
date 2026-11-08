# InVivo Scrubs, demo site

Diş hekimliği için tasarlanan medikal forma markası InVivo Scrubs'ın lansman öncesi demo sitesi.

- Site: https://selimkaratas-eng.github.io/invivo-scrubs/
- Sunum ekranı (QR'lı, 16:9 ve 9:16): https://selimkaratas-eng.github.io/invivo-scrubs/sunum.html

## Sitenin işi

Satış 2027 başına kadar açılmıyor. Bu yüzden site bir mağaza değil, **kurucu listesi** topluyor:

1. Ad, e-posta, rol, okul ya da klinik, beden ve renk oyu alıyor. Bu veri atölye ve kumaş görüşmelerinde talep kanıtı olur.
2. 20 Kasım okul etkinliği için `sunum.html` sahne ekranı ve Instagram hikayesi formatında QR veriyor. QR `utm_source=okul-sunumu` ile geldiği için kayıtlarda kaynak ayrı görünür. Başka kanal için `sunum.html?kaynak=instagram` gibi kullanılır.
3. Kayıt olan kişiye WhatsApp'ta paylaşma düğmesi çıkıyor.

## Marka

| Öğe | Değer |
|---|---|
| İşaret | B3 (fırça darbeli I + V + baş), `assets/invivo-isaret.svg`. Grafiker vektörü gelince aynı adla değiştirilir |
| İşaret rengi | Pantone 292 C `#69B3E7`, açık ton 291 C `#9BCBEB` |
| Yazı | Pantone 428 C `#C1C6C8` büyük boyda, küçük boyda okunurluk için 430 C `#7C878E` |
| Zemin | Krem `#FAF6F1` |
| Font | Jost (başlık ve logo yazısı), DM Sans (gövde) |

## Canlıya alırken yapılacaklar

- [ ] **Form ucu.** `assets/site.js` içindeki `FORM_ENDPOINT` boş, kayıtlar şu an sadece ziyaretçinin tarayıcısında kalıyor. Google Apps Script web app (Sheet'e yazar) ya da Formspree adresi buraya yazılınca kayıtlar gerçekten toplanır.
- [ ] **Logo.** Grafikerin temiz vektörü `assets/invivo-isaret.svg`, `-beyaz` ve `-koyu` sürümleriyle değiştirilir. `favicon.svg`, `assets/og.png` ve `assets/apple-touch-icon.png` yeniden üretilir.
- [ ] **Alan adı.** Alınınca `og:image` adresi ve paylaşım metni yeni adrese çevrilir.
- [ ] **Kurucu fotoğrafı.** Hikaye bölümündeki mavi alan fotoğrafla değiştirilir.
- [ ] **Yasal metinler.** KVKK, çerez ve mesafeli satış metinleri taslak. Şirket unvanı ve adresi girilip hukukçuya kontrol ettirilir.
- [ ] **Ölçüm.** Meta Pixel ve GA4 eklenecekse çerez onayı ile birlikte eklenir.
- [ ] **Arama motoru.** Lansmana kadar `noindex` ve `robots.txt` kapalı. Duyurudan sonra ikisi kaldırılır.
- [ ] **Beden tablosu.** Taslak, numune provasından sonra kesinleşir.

## Yapı

Tek sayfa statik site, derleme adımı yok. `index.html`, `assets/style.css`, `assets/site.js`. Shopify, ikas ya da başka bir altyapıya geçişte metinler, renk tokenları ve bölüm sırası aynen taşınabilir.
