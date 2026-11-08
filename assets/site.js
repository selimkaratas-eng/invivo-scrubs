/* InVivo Scrubs, demo site davranışları */
(function () {
  "use strict";

  // Canlıya alırken buraya form ucu yazılır (Google Apps Script web app, Formspree vb.).
  // Boş kalırsa ön sipariş sadece bu tarayıcıda tutulur (demo).
  var FORM_ENDPOINT = "";

  // Demo fiyatları, lansmanda kesinleşir. null yapılırsa "Lansmanda" yazar.
  var URUNLER = [
    { id: "takim", ad: "Vivo Takım", fiyat: 1999, ust: true, alt: true },
    { id: "ust", ad: "Vivo Üst", fiyat: 1099, ust: true, alt: false },
    { id: "alt", ad: "Vivo Alt", fiyat: 999, ust: false, alt: true }
  ];
  var KALIPLAR = ["Kadın", "Erkek"];
  var BEDENLER = ["XS", "S", "M", "L", "XL", "XXL"];
  var PACALAR = ["Kısa", "Standart", "Uzun"];
  var RENKLER = [
    { id: "vivo", ad: "Vivo Mavi", hex: "#9BCBEB", koyu: false },
    { id: "derin", ad: "Derin Su", hex: "#69B3E7", koyu: false },
    { id: "sis", ad: "Sis", hex: "#C1C6C8", koyu: false },
    { id: "beyaz", ad: "Klinik Beyaz", hex: "#F8F8F6", koyu: false },
    { id: "lacivert", ad: "Gece Laciverti", hex: "#24344F", koyu: true },
    { id: "bordo", ad: "Bordo", hex: "#6B2232", koyu: true }
  ];

  function bul(liste, id) {
    for (var i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i];
    return liste[0];
  }
  function tl(n) { return n == null ? "Lansmanda" : "₺" + n.toLocaleString("tr-TR"); }
  function $(id) { return document.getElementById(id); }

  // Kıyafet çizimleri
  function ustSvg(r) {
    var c = r.koyu ? "rgba(255,255,255,.28)" : "rgba(38,52,61,.2)";
    var ic = r.koyu ? "rgba(0,0,0,.25)" : "rgba(38,52,61,.09)";
    var nakis = r.koyu || r.id === "derin" ? "assets/invivo-isaret-beyaz.svg" : "assets/invivo-isaret.svg";
    return '<svg class="ust-parca" viewBox="0 0 300 340" role="img" aria-label="' + r.ad + ' forma üstü">' +
      '<path fill="' + r.hex + '" stroke="' + c + '" stroke-width="1.5" d="M96 30 L126 20 C134 52 166 52 174 20 L204 30 L272 70 Q280 76 276 86 L254 138 Q250 146 241 143 L218 134 L222 318 Q222 326 214 327 Q150 334 86 327 Q78 326 78 318 L82 134 L59 143 Q50 146 46 138 L24 86 Q20 76 28 70 Z"/>' +
      '<path fill="' + ic + '" d="M128 22 Q150 32 172 22 L150 86 Z"/>' +
      '<path fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" d="M126 20 L150 88 L174 20 M50 132 L74 122 M250 132 L226 122 M86 300 L86 326 M214 300 L214 326"/>' +
      '<rect x="176" y="112" width="34" height="40" rx="3" fill="none" stroke="' + c + '" stroke-width="1.6"/>' +
      '<path stroke="' + c + '" stroke-width="1.6" d="M186 112 L186 132"/>' +
      '<rect x="96" y="226" width="46" height="54" rx="4" fill="none" stroke="' + c + '" stroke-width="1.6"/>' +
      '<rect x="158" y="226" width="46" height="54" rx="4" fill="none" stroke="' + c + '" stroke-width="1.6"/>' +
      '<image href="' + nakis + '" x="100" y="112" width="30" height="24" opacity=".95"/>' +
      "</svg>";
  }

  function altSvg(r) {
    var c = r.koyu ? "rgba(255,255,255,.28)" : "rgba(38,52,61,.2)";
    var bel = r.koyu ? "rgba(0,0,0,.18)" : "rgba(38,52,61,.07)";
    return '<svg class="alt-parca" viewBox="0 0 220 340" role="img" aria-label="' + r.ad + ' forma altı">' +
      '<path fill="' + r.hex + '" stroke="' + c + '" stroke-width="1.5" d="M38 36 L182 36 L198 322 Q198 330 190 330 L124 330 Q117 330 116 322 L110 150 L104 322 Q103 330 96 330 L30 330 Q22 330 22 322 Z"/>' +
      '<rect x="36" y="12" width="148" height="28" rx="6" fill="' + r.hex + '" stroke="' + c + '" stroke-width="1.5"/>' +
      '<rect x="36" y="12" width="148" height="28" rx="6" fill="' + bel + '"/>' +
      '<path fill="none" stroke="' + c + '" stroke-width="1.6" stroke-linecap="round" d="M104 26 Q100 50 94 64 M116 26 Q120 50 126 64 M44 50 Q62 66 60 96 M176 50 Q158 66 160 96 M30 316 L104 316 M116 316 L190 316 M110 40 L110 150"/>' +
      '<rect x="152" y="170" width="32" height="46" rx="3" fill="none" stroke="' + c + '" stroke-width="1.6"/>' +
      "</svg>";
  }

  // Hero
  var hero = $("hero-kiyafet");
  if (hero) hero.innerHTML = ustSvg(bul(RENKLER, "vivo")) + altSvg(bul(RENKLER, "derin"));

  // Ön sipariş seçimi
  var secim = { urun: "takim", kalip: "Kadın", ust: "vivo", alt: "derin", beden: "", paca: "Standart", adet: 1 };

  function segment(kutuId, degerler, alan, etiket) {
    var kutu = $(kutuId);
    degerler.forEach(function (d) {
      var deger = typeof d === "string" ? d : d.id;
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.dataset.deger = deger;
      b.innerHTML = etiket ? etiket(d) : d;
      b.addEventListener("click", function () { secim[alan] = deger; ciz(); });
      kutu.appendChild(b);
    });
  }
  segment("urun-secim", URUNLER, "urun", function (u) { return u.ad.replace("Vivo ", "") + "<small>" + tl(u.fiyat) + "</small>"; });
  segment("kalip-secim", KALIPLAR, "kalip");
  segment("beden-secim", BEDENLER, "beden");
  segment("paca-secim", PACALAR, "paca");

  ["ust", "alt"].forEach(function (p) {
    var kutu = $(p + "-renkler");
    RENKLER.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "renk";
      b.dataset.deger = r.id;
      b.innerHTML = '<i style="background:' + r.hex + '"></i>' + r.ad;
      b.addEventListener("click", function () { secim[p] = r.id; ciz(); });
      kutu.appendChild(b);
    });
  });

  $("adet-eksi").addEventListener("click", function () { secim.adet = Math.max(1, secim.adet - 1); ciz(); });
  $("adet-arti").addEventListener("click", function () { secim.adet = Math.min(10, secim.adet + 1); ciz(); });

  function urun() { return bul(URUNLER, secim.urun); }
  function toplam() { var u = urun(); return u.fiyat == null ? null : u.fiyat * secim.adet; }

  function ozetMetni() {
    var u = urun(), parca = [u.ad, secim.kalip + " kalıp", secim.beden || "beden seçilmedi"];
    if (u.ust) parca.push(bul(RENKLER, secim.ust).ad + (u.alt ? " üst" : ""));
    if (u.alt) parca.push(bul(RENKLER, secim.alt).ad + (u.ust ? " alt" : ""), secim.paca + " paça");
    return parca.join(" · ") + (secim.adet > 1 ? " · " + secim.adet + " adet" : "");
  }

  var sahne = $("sahne");
  function ciz() {
    var u = urun(), us = bul(RENKLER, secim.ust), al = bul(RENKLER, secim.alt);
    Array.prototype.slice.call(sahne.querySelectorAll("svg")).forEach(function (s) { s.remove(); });
    sahne.insertAdjacentHTML("beforeend", (u.ust ? ustSvg(us) : "") + (u.alt ? altSvg(al) : ""));
    $("kombin-adi").textContent = u.ust && u.alt ? us.ad + " üst · " + al.ad + " alt" : (u.ust ? us.ad : al.ad);
    $("ust-secici").hidden = !u.ust;
    $("alt-secici").hidden = !u.alt;
    $("paca-secici").hidden = !u.alt;
    $("ust-ad").textContent = us.ad;
    $("alt-ad").textContent = al.ad;

    var kurala = u.ust && u.alt && secim.ust === "beyaz" && (secim.alt === "lacivert" || secim.alt === "bordo");
    $("kural-notu").innerHTML = kurala
      ? "<b>Bu kombin okul kuralına uygun.</b> Beyaz üst ile lacivert ya da bordo alt isteyen klinikler için."
      : "<b>Okulunda renk kuralı mı var?</b> <button type='button' class='metin-baglanti' id='kural-kombini'>Beyaz üst + lacivert alt kombinini dene</button>";
    var kb = $("kural-kombini");
    if (kb) kb.addEventListener("click", function () { secim.urun = "takim"; secim.ust = "beyaz"; secim.alt = "lacivert"; ciz(); });

    [["urun-secim", "urun"], ["kalip-secim", "kalip"], ["beden-secim", "beden"], ["paca-secim", "paca"]].forEach(function (x) {
      Array.prototype.slice.call($(x[0]).children).forEach(function (b) {
        b.setAttribute("aria-checked", b.dataset.deger === secim[x[1]] ? "true" : "false");
      });
    });
    ["ust", "alt"].forEach(function (p) {
      Array.prototype.slice.call($(p + "-renkler").children).forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.deger === secim[p] ? "true" : "false");
      });
    });
    $("adet").textContent = secim.adet;
    $("tutar").textContent = tl(toplam());
    $("mobil-tutar").textContent = "· " + tl(urun().fiyat);
  }
  ciz();

  // Adımlar
  var adimSecim = $("adim-secim"), adimBilgi = $("adim-bilgi");
  $("devam").addEventListener("click", function () {
    if (!secim.beden) {
      $("secim-hata").textContent = "Bedenini seçer misin? Emin değilsen beden rehberine bak.";
      $("beden-secim").querySelector("button").focus();
      return;
    }
    $("secim-hata").textContent = "";
    $("sepet").innerHTML = "<div><b>Ön siparişin</b>" + ozetMetni() + "</div><div class='fiyat'>" + tl(toplam()) + "</div>";
    adimSecim.hidden = true;
    adimBilgi.hidden = false;
    $("ad").focus({ preventScroll: true });
    $("siparis").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("geri").addEventListener("click", function () { adimBilgi.hidden = true; adimSecim.hidden = false; });

  // Sayaç ve takvim (İstanbul saatiyle gün farkı)
  function gunFarki(isoTarih) {
    var hedef = new Date(isoTarih + "T00:00:00+03:00").getTime();
    return Math.ceil((hedef - Date.now()) / 86400000);
  }
  var sayac = $("sayac-metni");
  var dhg = gunFarki("2026-11-22");
  if (dhg > 1) sayac.textContent = "İlk seri ön siparişte · Diş Hekimleri Günü’ne " + dhg + " gün";
  else if (dhg === 1) sayac.textContent = "Yarın Diş Hekimleri Günü · ilk seri ön siparişte";
  else if (dhg === 0) sayac.textContent = "Diş Hekimleri Günü kutlu olsun · ön sipariş açık";
  var adimlar = document.querySelectorAll("#takvim-adimlar .adim");
  for (var i = 0; i < adimlar.length; i++) {
    if (gunFarki(adimlar[i].dataset.tarih) >= 0) { adimlar[i].classList.add("simdi"); break; }
  }
  $("yil").textContent = new Date().getFullYear();

  // Menü
  var menuDugme = document.querySelector(".menu-dugme");
  var menu = $("menu");
  menuDugme.addEventListener("click", function () {
    var acik = menu.classList.toggle("acik");
    menuDugme.setAttribute("aria-expanded", acik ? "true" : "false");
    menuDugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("acik"); menuDugme.setAttribute("aria-expanded", "false"); }
  });
  var ust = $("ust");
  window.addEventListener("scroll", function () { ust.classList.toggle("kaydi", window.scrollY > 8); }, { passive: true });

  // Belirme, ve sipariş alanı görünürken mobil düğmeyi gizle
  var mobilCta = $("mobil-cta");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) { if (g.isIntersecting) { g.target.classList.add("gorundu"); io.unobserve(g.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".belir").forEach(function (el) { io.observe(el); });
    new IntersectionObserver(function (g) { mobilCta.classList.toggle("gizli", g[0].isIntersecting); })
      .observe($("siparis"));
  } else {
    document.querySelectorAll(".belir").forEach(function (el) { el.classList.add("gorundu"); });
  }

  // Yasal metinler ve beden rehberi (yasal metinler taslak, lansman öncesi hukukçu kontrolü gerekir)
  var BELGELER = {
    beden: "<h2 id='belge-baslik'>Beden rehberi</h2>" +
      "<p>Kadın kalıbı, taslak ölçüler. Numune provasından sonra kesinleşecek, erkek kalıbı lansmanla eklenecek.</p>" +
      "<div class='tablo-sar' style='margin-top:16px'><table class='beden-tablo'><thead><tr><th>Beden</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>XXL</th></tr></thead><tbody>" +
      "<tr><th>Göğüs</th><td>80-84</td><td>85-89</td><td>90-95</td><td>96-101</td><td>102-108</td><td>109-115</td></tr>" +
      "<tr><th>Bel</th><td>62-66</td><td>67-71</td><td>72-77</td><td>78-83</td><td>84-90</td><td>91-97</td></tr>" +
      "<tr><th>Basen</th><td>88-92</td><td>93-97</td><td>98-103</td><td>104-109</td><td>110-116</td><td>117-123</td></tr>" +
      "</tbody></table></div><p style='margin-top:14px'>Ölçüler santimetre. Paça boyu: kısa 160 cm altı, standart 160-172 cm, uzun 172 cm üstü boy için.</p>",
    kvkk: "<h2 id='belge-baslik'>KVKK aydınlatma metni</h2>" +
      "<p>Bu metin taslaktır, lansman öncesi hukuki kontrolden geçirilecektir.</p>" +
      "<p><b>Veri sorumlusu:</b> InVivo Scrubs (şirket kuruluşu tamamlandığında unvan ve adres bilgisi eklenecektir).</p>" +
      "<p><b>İşlenen veriler:</b> Ad soyad, e-posta, telefon, okul ya da klinik, meslek grubu ve ön sipariş seçimleri.</p>" +
      "<p><b>Amaç:</b> Ön siparişini kaydetmek, ilk seri hazır olduğunda onayını almak, ürün planlamasında beden ve renk talebini ölçmek.</p>" +
      "<p><b>Hukuki sebep:</b> Sözleşmenin kurulması için gerekli olması ve açık rıza (KVKK md. 5). Rızanı dilediğin an geri alabilirsin.</p>" +
      "<p><b>Aktarım:</b> Veriler yalnızca hizmet aldığımız e-posta ve form altyapısı sağlayıcılarıyla, bu amaçla sınırlı olarak paylaşılır.</p>" +
      "<p><b>Haklar:</b> KVKK md. 11 kapsamındaki başvurularını lansmanla açılacak iletişim adresine iletebilirsin.</p>",
    cerez: "<h2 id='belge-baslik'>Çerez politikası</h2>" +
      "<p>Bu demo sürüm reklam ya da analiz çerezi kullanmaz. Ön sipariş taslağı yalnızca senin tarayıcında saklanır.</p>" +
      "<p>Canlı sürümde ölçüm araçları eklendiğinde, zorunlu olmayan çerezler için açık onay istenecektir.</p>",
    satis: "<h2 id='belge-baslik'>Mesafeli satış ve iade</h2>" +
      "<p>Ön sipariş ödeme içermez ve bağlayıcı değildir. Satış başladığında ön bilgilendirme formu, mesafeli satış sözleşmesi ve iade koşulları bu alanda yayınlanacak.</p>" +
      "<ul><li>Teslimden sonra 14 gün içinde gerekçesiz cayma hakkı</li><li>Ön siparişlerde teslim süresi en geç 30 gün</li><li>Kişiye özel nakışlı ürünlerde cayma hakkı istisnası</li></ul>"
  };
  var dialog = $("belge");
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-belge]");
    if (!t) return;
    $("belge-icerik").innerHTML = BELGELER[t.dataset.belge] || "";
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
  });
  dialog.querySelector(".kapat").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  // Ön sipariş formu
  var form = $("siparis-formu");
  var hata = $("hata");
  var siteAdresi = location.origin + location.pathname;

  function oku(anahtar) { try { return JSON.parse(localStorage.getItem(anahtar) || "null"); } catch (e) { return null; } }
  function yaz(anahtar, deger) { try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) { /* gizli sekme */ } }

  function basariGoster(ad) {
    adimBilgi.hidden = true;
    var ilkAd = (ad || "").trim().split(/\s+/)[0];
    $("basari-baslik").textContent = ilkAd ? "Ön siparişin alındı, " + ilkAd + "." : "Ön siparişin alındı.";
    $("basari-ozet").textContent = ozetMetni() + " · " + tl(toplam());
    var metin = "Diş hekimliği için tasarlanan forma markası InVivo’nun ilk serisinden ön sipariş verdim. Ödeme yok, sen de yerini ayırt: " + siteAdresi;
    $("wa-paylas").href = "https://wa.me/?text=" + encodeURIComponent(metin);
    $("basari").classList.add("goster");
  }

  $("link-kopyala").addEventListener("click", function () {
    var b = this;
    var bitti = function () { b.textContent = "Kopyalandı"; setTimeout(function () { b.textContent = "Linki kopyala"; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(siteAdresi).then(bitti, bitti); else bitti();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hata.textContent = "";
    var ad = form.ad, eposta = form.eposta, telefon = form.telefon, rol = form.rol, kvkk = $("kvkk");
    [ad, eposta, telefon, rol].forEach(function (x) { x.removeAttribute("aria-invalid"); });
    var eksik = null;
    if (!ad.value.trim()) eksik = ad;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.value.trim())) eksik = eposta;
    else if (telefon.value.replace(/\D/g, "").length < 10) eksik = telefon;
    else if (!rol.value) eksik = rol;
    if (eksik) {
      eksik.setAttribute("aria-invalid", "true");
      eksik.focus();
      hata.textContent = eksik === eposta ? "E-posta adresini kontrol eder misin?"
        : eksik === telefon ? "Telefon numaranı kontrol eder misin?" : "Bu alanı doldurur musun?";
      return;
    }
    if (!kvkk.checked) { hata.textContent = "Devam etmek için aydınlatma metnini onaylaman gerekiyor."; return; }

    var u = urun();
    var kayit = {
      ad: ad.value.trim(),
      eposta: eposta.value.trim(),
      telefon: telefon.value.trim(),
      rol: rol.value,
      kurum: form.kurum.value.trim(),
      urun: u.ad,
      kalip: secim.kalip,
      beden: secim.beden,
      ust_renk: u.ust ? bul(RENKLER, secim.ust).ad : "",
      alt_renk: u.alt ? bul(RENKLER, secim.alt).ad : "",
      paca: u.alt ? secim.paca : "",
      adet: secim.adet,
      tutar: toplam(),
      tarih: new Date().toISOString(),
      kaynak: new URLSearchParams(location.search).get("utm_source") || "dogrudan"
    };

    var dugme = $("gonder");
    dugme.disabled = true;
    dugme.textContent = "Gönderiliyor";

    var kaydet = FORM_ENDPOINT
      ? fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(kayit) })
      : Promise.resolve();

    kaydet.then(function () {
      var liste = oku("invivo-on-siparis") || [];
      liste.push(kayit);
      yaz("invivo-on-siparis", liste);
      basariGoster(kayit.ad);
    }).catch(function () {
      dugme.disabled = false;
      dugme.textContent = "Ön siparişi tamamla";
      hata.textContent = "Bağlantı sorunu oldu, birazdan tekrar dener misin?";
    });
  });
})();
