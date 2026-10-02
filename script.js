/* =========================================================
   IYAA STUDIO — script.js
   Dipakai di ketiga halaman. Setiap bagian dicek dulu
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
    var teksHitung   = document.getElementById("saringHitung");
    var pesanKosong  = document.getElementById("kosong");

    function jalankanSaringan(pilihan) {
      var terlihat = 0;
      var segera = 0;

      semuaProduk.forEach(function (kartu) {
        var cocok = (pilihan === "semua") || (kartu.dataset.kategori === pilihan);
        kartu.classList.toggle("produk-sembunyi", !cocok);
        if (cocok) {
          terlihat++;
          if (kartu.classList.contains("produk-segera")) { segera++; }
        }
      });

      if (teksHitung) {
        var teks = "Menampilkan " + terlihat + " produk";
        if (segera > 0) {
          teks += " (" + (terlihat - segera) + " siap dibeli, " + segera + " segera hadir)";
        }
        teksHitung.textContent = teks;
      }
      if (pesanKosong) {
        pesanKosong.hidden = (terlihat > 0);
      }
    }

    tombolSaring.forEach(function (tombol) {
      tombol.addEventListener("click", function () {
        // pindahkan status aktif
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


  /* ============ 3. PRATINJAU DI HALAMAN PRODUK ============ */
  var pratinjauUtama = document.getElementById("pratinjauUtama");
  var tombolMini     = document.querySelectorAll("[data-mini]");

  if (pratinjauUtama && tombolMini.length > 0) {
    tombolMini.forEach(function (mini) {
      mini.addEventListener("click", function () {
        // tandai mini yang sedang dipilih
        tombolMini.forEach(function (m) { m.classList.remove("mini-aktif"); });
        mini.classList.add("mini-aktif");

        // salin gambar dari mini ke kotak besar
        var gambarMini = mini.querySelector("img");

        if (gambarMini) {
          // sudah pakai foto asli
          var gambarBesar = pratinjauUtama.querySelector("img");
          if (gambarBesar) {
            gambarBesar.src = gambarMini.src;
            gambarBesar.alt = gambarMini.alt;
          }
        } else {
          // masih pakai kotak warna sementara
          pratinjauUtama.className = "pratinjau-utama " + warnaDari(mini);
        }
      });
    });
  }

  // ambil kelas warna (gambar-a, gambar-b, dst.) dari sebuah elemen
  function warnaDari(elemen) {
    var hasil = "";
    elemen.classList.forEach(function (nama) {
      if (nama.indexOf("gambar-") === 0) { hasil = nama; }
    });
    return hasil;
  }

});
