# InVivo Scrubs, demo site

Diş hekimliği için tasarlanan medikal forma markası InVivo Scrubs'ın lansman öncesi demo sitesi.

- Site: https://selimkaratas-eng.github.io/invivo-scrubs/
- Sunum ekranı (QR'lı, 16:9 ve 9:16): https://selimkaratas-eng.github.io/invivo-scrubs/sunum.html

## Sitenin işi

Satış ve şirket 2027 başında açılıyor. Site şimdiden gerçek mağaza gibi çalışan bir **ön sipariş** akışı sunuyor, ama ödeme almıyor ve bağlayıcı değil:

1. Parça (takım, üst, alt), kalıp, üst ve alt rengi, beden, paça boyu ve adet seçilir, tutar canlı hesaplanır.
2. Ad, e-posta, telefon, rol ve okul alınır. Bu veri atölye ve kumaş görüşmelerinde talep kanıtı olur, ilk serinin beden ve renk dağılımını belirler.
3. 20 Kasım okul etkinliği için `sunum.html` sahne ekranı ve Instagram hikayesi formatında QR veriyor. QR `utm_source=okul-sunumu` ile geldiği için kayıtlarda kaynak ayrı görünür. Başka kanal için `sunum.html?kaynak=instagram` gibi kullanılır.
4. Sipariş sonrası WhatsApp'ta paylaşma düğmesi çıkıyor.

Global örneklerden alınanlar: kumaşa marka adı ve iki kelimelik fayda (FIGS FIONx, Jaanuu UltraSOFT), "bir doktor kurdu" kurucu hikayesi (Jaanuu), öğrenci ve toplu sipariş bölümü (FIGS, Jaanuu), çekirdek ve sınırlı renk ayrımı, mobilde sabit satın al düğmesi.

"Kurucu" kelimesi sadece Melisa için kullanılır.

## Marka

| Öğe | Değer |
|---|---|
| İşaret | B3 (fırça darbeli I + V + baş), `assets/invivo-isaret.svg`. Grafiker vektörü gelince aynı adla değiştirilir |
| İşaret rengi | Pantone 292 C `#69B3E7`, açık ton 291 C `#9BCBEB` |
| Yazı | Pantone 428 C `#C1C6C8` büyük boyda, küçük boyda okunurluk için 430 C `#7C878E` |
| Zemin | Krem `#FAF6F1` |
| Font | Jost (başlık ve logo yazısı), DM Sans (gövde) |

## Canlıya alırken yapılacaklar

- [ ] **Fiyatlar.** `assets/site.js` içindeki `URUNLER` fiyatları (takım 1.999, üst 1.099, alt 999 TL) demo, maliyet tablosu çıkınca kesinleşir. `null` yazılırsa "Lansmanda" görünür. Öğrenci fiyatı ve 48 saat onay kuralı da karar bekliyor.
- [ ] **Form ucu.** `assets/site.js` içindeki `FORM_ENDPOINT` boş, ön siparişler şu an sadece ziyaretçinin tarayıcısında kalıyor. Google Apps Script web app (Sheet'e yazar) ya da Formspree adresi buraya yazılınca kayıtlar gerçekten toplanır.
- [ ] **Logo.** Grafikerin temiz vektörü `assets/invivo-isaret.svg`, `-beyaz` ve `-koyu` sürümleriyle değiştirilir. `favicon.svg`, `assets/og.png` ve `assets/apple-touch-icon.png` yeniden üretilir.
- [ ] **Alan adı.** Alınınca `og:image` adresi ve paylaşım metni yeni adrese çevrilir.
- [ ] **Model fotoğrafları.** `assets/foto/` altındaki dört görsel Gemini ile üretildi (kadın Vivo Mavi, erkek Derin Su, klinikte beyaz üst + lacivert alt, ikili). Göğüs ve koldaki InVivo işareti sonradan nakış efektiyle işlendi, orijinaller yerelde scratchpad yedeğinde. Gerçek numune çekimi yapılınca aynı adlarla değiştirilir. Yapay zeka görseli olduğu için reklamda kullanılacaksa platform etiket kuralları kontrol edilir.
- [ ] **Melisa'nın fotoğrafı.** Hikaye bölümündeki mavi alan fotoğrafla değiştirilir.
- [ ] **Yasal metinler.** KVKK, çerez ve mesafeli satış metinleri taslak. Şirket unvanı ve adresi girilip hukukçuya kontrol ettirilir.
- [ ] **Ölçüm.** Meta Pixel ve GA4 eklenecekse çerez onayı ile birlikte eklenir.
- [ ] **Arama motoru.** Lansmana kadar `noindex` ve `robots.txt` kapalı. Duyurudan sonra ikisi kaldırılır.
- [ ] **Beden tablosu ve paça boyları.** Taslak, numune provasından sonra kesinleşir.
- [ ] **Kumaş adları.** VivoGuard, EğilBel, ElCep, VivoFlex çalışma adı, marka başvurusuna eklenmeden ™ kullanılmaz.

## Yapı

Tek sayfa statik site, derleme adımı yok. `index.html`, `assets/style.css`, `assets/site.js`. Shopify, ikas ya da başka bir altyapıya geçişte metinler, renk tokenları ve bölüm sırası aynen taşınabilir.
