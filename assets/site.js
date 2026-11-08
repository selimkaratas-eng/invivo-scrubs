/* InVivo Scrubs, demo site davranışları */
(function () {
  "use strict";

  // Canlıya alırken buraya form ucu yazılır (Google Apps Script web app, Formspree vb.).
  // Boş kalırsa kayıt sadece bu tarayıcıda tutulur (demo).
  var FORM_ENDPOINT = "";

  var RENKLER = [
    { id: "vivo", ad: "Vivo Mavi", hex: "#9BCBEB", koyu: false },
    { id: "derin", ad: "Derin Su", hex: "#69B3E7", koyu: false },
    { id: "sis", ad: "Sis", hex: "#C1C6C8", koyu: false },
    { id: "beyaz", ad: "Klinik Beyaz", hex: "#F8F8F6", koyu: false },
    { id: "lacivert", ad: "Gece Laciverti", hex: "#24344F", koyu: true },
    { id: "bordo", ad: "Bordo", hex: "#6B2232", koyu: true }
  ];
  var BEDENLER = ["XS", "S", "M", "L", "XL", "XXL", "Emin değilim"];

  function renk(id) {
    for (var i = 0; i < RENKLER.length; i++) if (RENKLER[i].id === id) return RENKLER[i];
    return RENKLER[0];
  }

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
  var hero = document.getElementById("hero-kiyafet");
  if (hero) hero.innerHTML = ustSvg(renk("vivo")) + altSvg(renk("derin"));

  // Renk stüdyosu
  var secim = { ust: "vivo", alt: "derin" };
  var sahne = document.getElementById("sahne");
  var kombinAdi = document.getElementById("kombin-adi");
  var kuralNotu = document.getElementById("kural-notu");

  function sahneyiCiz() {
    if (!sahne) return;
    var u = renk(secim.ust), a = renk(secim.alt);
    Array.prototype.slice.call(sahne.querySelectorAll("svg")).forEach(function (s) { s.remove(); });
    sahne.insertAdjacentHTML("beforeend", ustSvg(u) + altSvg(a));
    kombinAdi.textContent = u.ad + " üst · " + a.ad + " alt";
    var kurala = secim.ust === "beyaz" && (secim.alt === "lacivert" || secim.alt === "bordo");
    kuralNotu.innerHTML = kurala
      ? "<b>Bu kombin okul kuralına uygun.</b> Beyaz üst ile lacivert ya da bordo alt isteyen klinikler için."
      : "<b>Okulunda renk kuralı mı var?</b> Beyaz üstü lacivert ya da bordo altla eşleştir, parçalar ayrı satılıyor.";
    ["ust", "alt"].forEach(function (p) {
      Array.prototype.slice.call(document.querySelectorAll("#" + p + "-renkler .renk")).forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.id === secim[p] ? "true" : "false");
      });
    });
  }

  ["ust", "alt"].forEach(function (p) {
    var kutu = document.getElementById(p + "-renkler");
    if (!kutu) return;
    RENKLER.forEach(function (r) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "renk";
      b.dataset.id = r.id;
      b.innerHTML = '<i style="background:' + r.hex + '"></i>' + r.ad;
      b.addEventListener("click", function () { secim[p] = r.id; sahneyiCiz(); });
      kutu.appendChild(b);
    });
  });
  var kuralDugme = document.getElementById("kural-kombini");
  if (kuralDugme) kuralDugme.addEventListener("click", function () {
    secim = { ust: "beyaz", alt: secim.alt === "lacivert" ? "bordo" : "lacivert" };
    sahneyiCiz();
  });
  sahneyiCiz();

  // Form seçenekleri
  var bedenKutu = document.getElementById("beden-secenek");
  BEDENLER.forEach(function (b) {
    bedenKutu.insertAdjacentHTML("beforeend",
      '<label><input type="radio" name="beden" value="' + b + '"><span>' + b + "</span></label>");
  });
  var oyKutu = document.getElementById("renk-oyu");
  RENKLER.forEach(function (r) {
    oyKutu.insertAdjacentHTML("beforeend",
      '<label><input type="checkbox" name="renk" value="' + r.ad + '"><span><i style="background:' + r.hex + '"></i>' + r.ad + "</span></label>");
  });
  oyKutu.addEventListener("change", function (e) {
    var secili = oyKutu.querySelectorAll("input:checked");
    if (secili.length > 2) e.target.checked = false;
  });

  // Sayaç ve takvim (İstanbul saatiyle gün farkı)
  function gunFarki(isoTarih) {
    var hedef = new Date(isoTarih + "T00:00:00+03:00").getTime();
    return Math.ceil((hedef - Date.now()) / 86400000);
  }
  var sayac = document.getElementById("sayac-metni");
  var dhg = gunFarki("2026-11-22");
  if (sayac) {
    if (dhg > 1) sayac.textContent = "22 Kasım Diş Hekimleri Günü · " + dhg + " gün kaldı";
    else if (dhg === 1) sayac.textContent = "Yarın Diş Hekimleri Günü";
    else if (dhg === 0) sayac.textContent = "İyi ki varsınız, Diş Hekimleri Günü kutlu olsun";
    else sayac.textContent = "Kurucu listesi açık";
  }
  var adimlar = document.querySelectorAll("#takvim-adimlar .adim");
  for (var i = 0; i < adimlar.length; i++) {
    if (gunFarki(adimlar[i].dataset.tarih) >= 0) { adimlar[i].classList.add("simdi"); break; }
  }
  document.getElementById("yil").textContent = new Date().getFullYear();

  // Menü
  var menuDugme = document.querySelector(".menu-dugme");
  var menu = document.getElementById("menu");
  menuDugme.addEventListener("click", function () {
    var acik = menu.classList.toggle("acik");
    menuDugme.setAttribute("aria-expanded", acik ? "true" : "false");
    menuDugme.setAttribute("aria-label", acik ? "Menüyü kapat" : "Menüyü aç");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("acik"); menuDugme.setAttribute("aria-expanded", "false"); }
  });
  var ust = document.getElementById("ust");
  window.addEventListener("scroll", function () { ust.classList.toggle("kaydi", window.scrollY > 8); }, { passive: true });

  // Belirme
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) { if (g.isIntersecting) { g.target.classList.add("gorundu"); io.unobserve(g.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".belir").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".belir").forEach(function (el) { el.classList.add("gorundu"); });
  }

  // Yasal metinler (taslak, lansman öncesi hukukçu kontrolü gerekir)
  var BELGELER = {
    kvkk: "<h2 id='belge-baslik'>KVKK aydınlatma metni</h2>" +
      "<p>Bu metin taslaktır, lansman öncesi hukuki kontrolden geçirilecektir.</p>" +
      "<p><b>Veri sorumlusu:</b> InVivo Scrubs (şirket kuruluşu tamamlandığında unvan ve adres bilgisi eklenecektir).</p>" +
      "<p><b>İşlenen veriler:</b> Ad soyad, e-posta, isteğe bağlı telefon, okul ya da klinik, meslek grubu, beden ve renk tercihi.</p>" +
      "<p><b>Amaç:</b> Kurucu listesindeki kişilere lansman, ön sipariş ve numune etkinlikleri hakkında bilgi vermek, ürün planlamasında beden ve renk talebini ölçmek.</p>" +
      "<p><b>Hukuki sebep:</b> Açık rıza (KVKK md. 5/1). Rızanı dilediğin an geri alabilirsin.</p>" +
      "<p><b>Aktarım:</b> Veriler yalnızca hizmet aldığımız e-posta ve form altyapısı sağlayıcılarıyla, bu amaçla sınırlı olarak paylaşılır.</p>" +
      "<p><b>Haklar:</b> KVKK md. 11 kapsamındaki başvurularını lansmanla açılacak iletişim adresine iletebilirsin.</p>",
    cerez: "<h2 id='belge-baslik'>Çerez politikası</h2>" +
      "<p>Bu demo sürüm reklam ya da analiz çerezi kullanmaz. Form taslağı yalnızca senin tarayıcında saklanır.</p>" +
      "<p>Canlı sürümde ölçüm araçları eklendiğinde, zorunlu olmayan çerezler için açık onay istenecektir.</p>",
    satis: "<h2 id='belge-baslik'>Mesafeli satış ve iade</h2>" +
      "<p>Satış henüz başlamadı. Ön sipariş açıldığında ön bilgilendirme formu, mesafeli satış sözleşmesi ve iade koşulları bu alanda yayınlanacak.</p>" +
      "<ul><li>14 gün içinde gerekçesiz cayma hakkı</li><li>Ön siparişlerde teslim süresi en geç 30 gün</li><li>Kişiye özel nakışlı ürünlerde cayma hakkı istisnası</li></ul>"
  };
  var dialog = document.getElementById("belge");
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-belge]");
    if (!t) return;
    document.getElementById("belge-icerik").innerHTML = BELGELER[t.dataset.belge] || "";
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
  });
  dialog.querySelector(".kapat").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  // Kurucu listesi formu
  var form = document.getElementById("liste-formu");
  var hata = document.getElementById("hata");
  var siteAdresi = location.origin + location.pathname;

  function oku(anahtar) { try { return JSON.parse(localStorage.getItem(anahtar) || "null"); } catch (e) { return null; } }
  function yaz(anahtar, deger) { try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) { /* gizli sekme */ } }

  function basariGoster(ad) {
    form.style.display = "none";
    var ilkAd = (ad || "").trim().split(/\s+/)[0];
    document.getElementById("basari-baslik").textContent = ilkAd ? "Listedesin, " + ilkAd + "." : "Listedesin.";
    var metin = "Diş hekimliği için tasarlanan forma markası InVivo’nun kurucu listesine katıldım. Sen de katıl: " + siteAdresi;
    document.getElementById("wa-paylas").href = "https://wa.me/?text=" + encodeURIComponent(metin);
    document.getElementById("basari").classList.add("goster");
  }

  document.getElementById("link-kopyala").addEventListener("click", function () {
    var b = this;
    var bitti = function () { b.textContent = "Kopyalandı"; setTimeout(function () { b.textContent = "Linki kopyala"; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(siteAdresi).then(bitti, bitti); else bitti();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hata.textContent = "";
    var ad = form.ad, eposta = form.eposta, rol = form.rol, kvkk = form.querySelector("#kvkk");
    [ad, eposta, rol].forEach(function (x) { x.removeAttribute("aria-invalid"); });
    var eksik = null;
    if (!ad.value.trim()) eksik = ad;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.value.trim())) eksik = eposta;
    else if (!rol.value) eksik = rol;
    if (eksik) {
      eksik.setAttribute("aria-invalid", "true");
      eksik.focus();
      hata.textContent = eksik === eposta ? "E-posta adresini kontrol eder misin?" : "Bu alanı doldurur musun?";
      return;
    }
    if (!kvkk.checked) { hata.textContent = "Devam etmek için aydınlatma metnini onaylaman gerekiyor."; return; }

    var kayit = {
      ad: ad.value.trim(),
      eposta: eposta.value.trim(),
      telefon: form.telefon.value.trim(),
      rol: rol.value,
      kurum: form.kurum.value.trim(),
      beden: (form.querySelector("input[name=beden]:checked") || {}).value || "",
      renkler: Array.prototype.map.call(form.querySelectorAll("input[name=renk]:checked"), function (x) { return x.value; }),
      tarih: new Date().toISOString(),
      kaynak: new URLSearchParams(location.search).get("utm_source") || "dogrudan"
    };

    var dugme = document.getElementById("gonder");
    dugme.disabled = true;
    dugme.textContent = "Gönderiliyor";

    var kaydet = FORM_ENDPOINT
      ? fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(kayit) })
      : Promise.resolve();

    kaydet.then(function () {
      var liste = oku("invivo-kurucu-listesi") || [];
      liste.push(kayit);
      yaz("invivo-kurucu-listesi", liste);
      basariGoster(kayit.ad);
    }).catch(function () {
      dugme.disabled = false;
      dugme.textContent = "Listeye katıl";
      hata.textContent = "Bağlantı sorunu oldu, birazdan tekrar dener misin?";
    });
  });
})();
