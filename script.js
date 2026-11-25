/* =========================================================
   IYAA STUDIO — script.js
   Dipakai di semua halaman. Setiap bagian dicek dulu
   keberadaannya, jadi tidak error kalau elemennya tidak ada.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ============ 1. MENU DI LAYAR KECIL ============ */
  var tombolNav = document.getElementById("navToggle");
  var navUtama  = document.getElementById("navUtama");

  if (tombolNav && navUtama) {
    tombolNav.addEventListener("click", function () {
      var terbuka = navUtama.classList.toggle("nav-buka");
      tombolNav.setAttribute("aria-expanded", terbuka ? "true" : "false");
    });

    // tutup menu setelah salah satu tautan diklik
    navUtama.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navUtama.classList.remove("nav-buka");
        tombolNav.setAttribute("aria-expanded", "false");
      }
    });
  }


  /* ============ 2. SARINGAN KATALOG ============ */
  var daftarProduk = document.getElementById("daftarProduk");

  if (daftarProduk) {
    var tombolSaring = document.querySelectorAll(".saring-tombol");
    var semuaProduk  = daftarProduk.querySelectorAll(".produk");
    var pesanKosong  = document.getElementById("kosong");

    function jalankanSaringan(pilihan) {
      var terlihat = 0;
      semuaProduk.forEach(function (kartu) {
        var cocok = (pilihan === "semua") || (kartu.dataset.kategori === pilihan);
        kartu.classList.toggle("produk-sembunyi", !cocok);
        if (cocok) { terlihat++; }
      });
      if (pesanKosong) { pesanKosong.hidden = (terlihat > 0); }
    }

    tombolSaring.forEach(function (tombol) {
      tombol.addEventListener("click", function () {
        tombolSaring.forEach(function (t) {
          t.classList.remove("saring-aktif");
          t.setAttribute("aria-pressed", "false");
        });
        tombol.classList.add("saring-aktif");
        tombol.setAttribute("aria-pressed", "true");
        jalankanSaringan(tombol.dataset.saring);
      });
    });

    // kalau URL-nya katalog.html#template, langsung saring
    var dariTautan = window.location.hash.replace("#", "");
    if (dariTautan) {
      var tombolCocok = document.querySelector('.saring-tombol[data-saring="' + dariTautan + '"]');
      if (tombolCocok) { tombolCocok.click(); }
    }
  }


  /* ============ 3. GALERI PRODUK (geser langsung) ============
     Gambar besar bisa digeser dengan jari (HP), trackpad, ditarik
     dengan mouse, atau pakai panah dan titik di bawahnya.       */
  var galeri = document.querySelector("[data-galeri]");

  if (galeri) {
    var jalur   = galeri.querySelector(".galeri-jalur");
    var slide   = galeri.querySelectorAll(".galeri-slide");
    var titik   = galeri.querySelectorAll(".titik");
    var tombolPrev = galeri.querySelector(".galeri-prev");
    var tombolNext = galeri.querySelector(".galeri-next");
    var jumlah  = slide.length;

    function indeksKini() {
      return Math.round(jalur.scrollLeft / jalur.clientWidth);
    }

    function tandai() {
      var i = indeksKini();
      titik.forEach(function (t, n) {
        t.classList.toggle("titik-aktif", n === i);
        t.setAttribute("aria-current", n === i ? "true" : "false");
      });
      if (tombolPrev) { tombolPrev.disabled = (i <= 0); }
      if (tombolNext) { tombolNext.disabled = (i >= jumlah - 1); }
    }

    function keSlide(i) {
      i = Math.max(0, Math.min(jumlah - 1, i));
      jalur.scrollTo({ left: i * jalur.clientWidth, behavior: "smooth" });
    }

    jalur.addEventListener("scroll", tandai, { passive: true });
    window.addEventListener("resize", tandai);

    if (tombolPrev) { tombolPrev.addEventListener("click", function () { keSlide(indeksKini() - 1); }); }
    if (tombolNext) { tombolNext.addEventListener("click", function () { keSlide(indeksKini() + 1); }); }
    titik.forEach(function (t, n) { t.addEventListener("click", function () { keSlide(n); }); });

    // panah kiri/kanan di keyboard saat galeri difokus
    jalur.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); keSlide(indeksKini() + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); keSlide(indeksKini() - 1); }
    });

    // tarik dengan mouse (di layar sentuh, browser sudah mengurusnya)
    var sedangTarik = false, mulaiX = 0, mulaiScroll = 0, mulaiIndeks = 0;

    jalur.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) { return; }
      sedangTarik = true;
      mulaiX = e.clientX;
      mulaiScroll = jalur.scrollLeft;
      mulaiIndeks = indeksKini();
      jalur.classList.add("galeri-tarik");
    });

    window.addEventListener("pointermove", function (e) {
      if (!sedangTarik) { return; }
      jalur.scrollLeft = mulaiScroll - (e.clientX - mulaiX);
    });

    window.addEventListener("pointerup", function (e) {
      if (!sedangTarik) { return; }
      sedangTarik = false;
      var selisih = e.clientX - mulaiX;
      var tujuan = mulaiIndeks;
      if (selisih < -50) { tujuan = mulaiIndeks + 1; }
      else if (selisih > 50) { tujuan = mulaiIndeks - 1; }
      jalur.classList.remove("galeri-tarik");
      keSlide(tujuan);
    });

    tandai();
  }

});
