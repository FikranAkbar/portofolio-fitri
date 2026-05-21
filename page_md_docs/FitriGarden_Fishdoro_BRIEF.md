# Fishdoro Case Study — Project Brief
*Dokumen ini untuk dibaca sebelum mulai coding.*
*Berisi konteks, keputusan desain, dan cara kerja keseluruhan.*

---

## Apa ini?

Halaman case study Fishdoro adalah bagian dari portfolio Fitri Zahwa di **fitri.world**, dibangun dengan Astro + vanilla JS. Case study ini ditampilkan sebagai **expand view** di dalam Project Page — bukan halaman baru, bukan route baru. Saat card Fishdoro diklik, area kanan berubah dari grid project menjadi konten case study. Sidebar tetap tidak berubah.

---

## Konteks portfolio

Portfolio ini terdiri dari satu layout utama: sidebar fixed di kiri (240px) dan area kanan yang berubah konten tergantung halaman aktif. Semua halaman — Home, Project, About Me, Resume, Visitor Gallery — berbagi sidebar yang sama.

Di Project Page, area kanan normalnya menampilkan grid 2 kolom berisi 4 project card. Ketika salah satu card diklik, grid itu digantikan oleh konten case study. Tombol back di topbar mengembalikan tampilan ke grid.

---

## Fishdoro — ringkasan proyek

Fishdoro adalah Pomodoro timer yang dirancang ulang sebagai mini-game memancing pixel art. Menyelesaikan sesi fokus berarti menangkap ikan piksel kecil. Ini proyek eksplorasi personal — bukan client work.

**Stack:** Electron · HTML · CSS · JavaScript
**Role:** UI/UX Designer sekaligus Developer
**Status:** Core build sudah jalan, masih dalam pengembangan aset

---

## Struktur konten case study

Case study dibagi 6 section berurutan:

| Section | Isi singkat |
|---|---|
| Background | Paradoks productivity tools, pertanyaan awal Fishdoro |
| Discover | Research Reddit, thematic coding, 3 insight |
| Define | 3 design problems, design brief |
| Develop | IA, visual direction, iterasi, build |
| Validation | Status testing, pertanyaan yang belum terjawab |
| Key Takeaways | 4 pelajaran spesifik dari proyek ini |

Konten lengkap per section sudah ada di `FitriGarden_FishdoroCaseStudy_TodoList.md`.

---

## Elemen interaktif

Ada 5 komponen interaktif yang harus diimplementasikan, semua vanilla JS:

| Komponen | Di section mana | Menjawab feedback apa |
|---|---|---|
| Progress bar | Atas content area | Navigasi di long-form page |
| Flip cards | Discover | "Discover terlalu dragging" |
| Scroll reveal | Define | "Tidak ada jaitannya dari Discover ke Define" |
| Before/After slider | Develop | Membuktikan proses iterasi nyata |
| Annotated screen viewer | Develop | "Design outcome hanya visual tanpa konteks" |

Detail implementasi lengkap ada di `FitriGarden_Fishdoro_InteractiveComponents_TodoList.md`.

---

## Screenshot yang dibutuhkan

Total 15 aset visual, 6 di antaranya wajib ada sebelum launch:

**Wajib:**
- Timer screen mid-session (hero)
- Affinity map / thematic coding visual
- Problem framework visual
- Hi-fi timer focus state
- Hi-fi reward reveal
- Figma vs Build side-by-side

Detail lengkap ada di `FitriGarden_Fishdoro_ScreenshotRequirements.md`.

---

## Aturan desain yang harus diikuti

Ini berlaku di seluruh portfolio termasuk case study ini:

- **Font:** Playfair Display (judul/quote) + Inter (semua teks lain)
- **Font size:** semua kelipatan 2 — tidak ada nilai ganjil
- **Background:** `#faf7f2` plain, tidak ada image
- **Card:** `#ffffff` · border `0.5px rgba(154,175,122,0.3)` · border-radius `12px`
- **Button:** outline pill — `border: 1px solid #6b8f4e` · bg `rgba(250,247,242,0.5)` · border-radius `99px`
- **Content max-width:** `640px` centered — sama seperti About Me
- **Elemen interaktif:** vanilla JS saja, tidak perlu library eksternal

---

## Urutan pengerjaan yang disarankan

1. State management — toggle grid ↔ case study, topbar breadcrumb
2. Layout dan CSS dasar case study
3. Konten statis semua section (teks + placeholder gambar)
4. Screenshot — swap placeholder dengan aset nyata
5. Elemen interaktif (dari yang paling simpel):
   progress bar → scroll reveal → flip cards → before/after slider → annotated viewer

---

## File-file terkait

| File | Isi |
|---|---|
| `FitriGarden_Fishdoro_BRIEF.md` | Dokumen ini |
| `FitriGarden_FishdoroCaseStudy_TodoList.md` | Implementasi layout, CSS, konten |
| `FitriGarden_Fishdoro_ScreenshotRequirements.md` | Daftar dan spec semua screenshot |
| `FitriGarden_Fishdoro_InteractiveComponents_TodoList.md` | HTML/CSS/JS semua komponen interaktif |
| `FitriGarden_DOCUMENTATION.md` | Design system global portfolio |

---

*Brief ini cukup dibaca sekali di awal. Untuk detail teknis, buka to-do list yang relevan.*
