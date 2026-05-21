# Fitri's Garden — Design Improvement Documentation

_Dokumentasi lengkap redesign & improvement seluruh halaman_
_Dibuat bersama Claude — May 2026_

---

## Daftar Isi

1. [Design System — Aturan Global](#design-system)
2. [Intro Page](#intro-page)
3. [Home Page](#home-page)
4. [Leave Your Bloom](#leave-your-bloom)
5. [Project Page](#project-page)
6. [About Me](#about-me)
7. [Visitor Gallery](#visitor-gallery)
8. [Referensi File](#referensi-file)

---

## Design System — Aturan Global

Semua halaman mengikuti aturan yang sama. Ini adalah sumber kebenaran tunggal untuk seluruh proyek.

### Font

| Penggunaan               | Font               | Catatan                                  |
| ------------------------ | ------------------ | ---------------------------------------- |
| Judul besar, nama, quote | `Playfair Display` | 700, dan 700 italic untuk aksen          |
| Semua teks lainnya       | `Inter`            | 300 (light), 400 (regular), 500 (medium) |

**Google Fonts import (pasang di semua layout):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

### Aturan Font Size — Kelipatan 2

Semua font size harus kelipatan 2. Tidak ada nilai ganjil (9px, 11px, 13px, dst).

Skala yang dipakai: `8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 36 · 38 · 40 · 42 · 48 · 52 · 54 · 56 · 58 · 72 · 74 · 76 · 78`

### Color Palette

```css
:root {
  /* Background */
  --color-bg: #faf7f2; /* main background — warm cream */
  --color-sidebar-bg: #ffffff; /* sidebar background — putih */
  --color-garden-bg: #f2ede4; /* garden area background */
  --color-card-bg: #ffffff; /* semua card background */
  --color-sidebar-card: #f5f0e8; /* sidebar card di Leave Your Bloom */

  /* Text */
  --color-title: #2d4a1e; /* judul, nama, teks penting */
  --color-accent: #7a58a8; /* aksen purple — italic title intro */
  --color-body: #5a7040; /* body text, deskripsi */

  /* Green family */
  --color-green-dark: #4e7a30; /* button bg, strong green */
  --color-green-mid: #6b8f4e; /* eyebrow, icon, border button */
  --color-green-sub: #5a7040; /* subtitle, nav item */
  --color-green-light: #9aaf7a; /* divider, nav arrow, muted text */
  --color-green-muted: #b0c890; /* drag hint, node number */

  /* Interactive */
  --color-nav-active: rgba(200, 219, 160, 0.35);
  --color-nav-hover: rgba(200, 219, 160, 0.15);
  --color-btn-bg: rgba(250, 247, 242, 0.5);
  --color-btn-hover: rgba(155, 175, 122, 0.15);

  /* Borders */
  --border-garden: 1px solid rgba(154, 175, 122, 0.3);
  --border-card: 0.5px solid rgba(154, 175, 122, 0.3);
  --border-sidebar: 0.5px solid rgba(154, 175, 122, 0.25);
  --border-divider: 0.5px solid rgba(154, 175, 122, 0.2);
}
```

### Button Style — Berlaku di Semua Halaman

```css
.btn-primary {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #2d4a1e;
  background: rgba(250, 247, 242, 0.5);
  border: 1px solid #6b8f4e;
  border-radius: 99px;
  padding: 10px 28px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: rgba(155, 175, 122, 0.15);
}
```

### Breakpoints

```css
/* Desktop:  min-width 1025px  */
/* Tablet:   481px – 1024px    */
/* Android:  max-width 480px   */
```

### Sidebar — Komponen Bersama

Sidebar adalah satu komponen yang dipakai di semua halaman. Tidak duplikasi.

```css
.sidebar {
  width: 240px; /* Desktop */
  background: #ffffff;
  border-right: 0.5px solid rgba(154, 175, 122, 0.25);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 0;
  scrollbar-width: none;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 0.5px solid rgba(154, 175, 122, 0.2);
  background: #ffffff;
  flex-shrink: 0; /* selalu di bawah viewport */
}

@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    border-right: none;
    border-top: 0.5px solid rgba(154, 175, 122, 0.3);
    z-index: 100;
  }
  .sidebar-scroll {
    display: none;
  }
}
```

**Isi sidebar (dari atas ke bawah):**

1. Avatar (52px circle, border 2px `#9aaf7a`, online dot `#6b8f4e`)
2. Nama — Playfair Display 700 22px `#2d4a1e`
3. Role — Inter 400 10px uppercase `#6b8f4e`
4. Bio — Inter 300 12px `#5a7040`
5. Section label "EXPLORE" — Inter 500 10px uppercase `#9aaf7a`
6. Nav list — icon + label (Inter 400 14px) + arrow
7. Section label "FIND ME AT"
8. Social links — Inter 400 12px `#5a7040`
9. **Footer (sticky bottom):** live clock (Inter 400 14px) + status dot + "All systems operational"

### Topbar — Konsisten di Semua Halaman

```css
.page-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 0.5px solid rgba(154, 175, 122, 0.2);
  background: #faf7f2;
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}
```

Traffic lights: merah `#ff5f57` + 2x abu `#d9d9d9`, 10px circle, gap 5px.

### Card Style — Konsisten di Semua Halaman

```css
.card {
  background: #ffffff;
  border: 0.5px solid rgba(154, 175, 122, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.card:hover {
  border-color: rgba(107, 143, 78, 0.5);
}
```

### Section Pills — Konsisten di Semua Halaman

```css
.section-pill {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #4e7a30;
  background: rgba(200, 219, 160, 0.25);
  border: 1px solid rgba(107, 143, 78, 0.35);
  border-radius: 99px;
  padding: 5px 16px;
}
```

### Tags — Konsisten di Semua Halaman

```css
.tag {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #4e7a30;
  background: rgba(200, 219, 160, 0.3);
  border: 0.5px solid rgba(107, 143, 78, 0.3);
  border-radius: 99px;
  padding: 3px 10px;
}
```

---

## Intro Page

**File:** `FitriGarden_IntroPage_TodoList.md`

**Deskripsi:** Halaman pertama yang dilihat visitor saat membuka portfolio. Full viewport height, centered content, no sidebar.

### Ringkasan perubahan

- Background: `#faf7f2` plain (tidak ada dot pattern, tidak ada image)
- Font judul: Playfair Display 700 — "Fitri's" normal, "Garden" italic `#7a58a8`
- Font semua teks lain: Inter
- CTA button: outline pill style

### Font sizes

| Element    | Desktop | Tablet | Android |
| ---------- | ------- | ------ | ------- |
| Eyebrow    | 14px    | 12px   | 10px    |
| "Fitri's"  | 74px    | 54px   | 38px    |
| "Garden"   | 78px    | 58px   | 42px    |
| Subtitle   | 16px    | 14px   | 14px    |
| CTA button | 16px    | 14px   | 14px    |
| Nav        | 14px    | 12px   | 10px    |

---

## Home Page

**File:** `FitriGarden_HomePage_TodoList.md`

**Deskripsi:** Halaman utama portfolio dengan sidebar kiri dan mind map di tengah.

### Ringkasan perubahan

- Hapus background image — ganti `#faf7f2` plain
- Sidebar background: `#ffffff` (bukan abu-abu/hijau)
- Nav active card: `rgba(200,219,160,0.35)` — rounded, hijau muda
- "Find me at" naik mengikuti nav (tidak ada spacer)
- "All systems operational" fixed di bottom sidebar (`flex-shrink: 0`)
- Mind map: hanya naikkan font size, jangan ubah style lain
- Grid background mind map: dipertahankan dari kode aslinya

### Font sizes mind map

| Element         | Size |
| --------------- | ---- |
| Node label      | 14px |
| Node number     | 12px |
| Center label    | 14px |
| Center sublabel | 12px |

---

## Leave Your Bloom

**File:** `FitriGarden_LeaveYourBloom_TodoList.md`

**Deskripsi:** Halaman untuk visitor menanam bunga di garden. Satu-satunya page yang punya sidebar kanan (Your Bloom Story form).

### Ringkasan perubahan

- Hapus semua dummy/hardcoded flower data
- Empty state garden saat belum ada bunga real
- Garden area dan sidebar card harus **equal height** (`align-items: stretch` + `flex: 1`)
- Sidebar card background: `#f5f0e8` (warm, bukan sage green)
- Posisi bunga: koordinat relatif 0–1, bukan pixel absolut
- Button "Plant My Bloom": identik dengan CTA homepage (outline pill, bukan solid green)
- Aset bunga tidak diubah sama sekali

### Layout responsive

| Breakpoint       | Layout                                            |
| ---------------- | ------------------------------------------------- |
| Desktop + Tablet | Garden kiri, sidebar kanan (equal height)         |
| Android          | Garden atas, sidebar pindah ke bawah (`order: 2`) |

### Aturan tidak boleh diubah

- Desain gambar bunga — jangan ubah apapun
- Style CTA button — outline pill identik dengan homepage
- Equal height garden + sidebar card

---

## Project Page

**File:** `FitriGarden_ProjectPage_TodoList.md`

**Deskripsi:** Halaman menampilkan 4 case study/project dalam grid 2 kolom. Card expand saat hover.

### Ringkasan perubahan

- Hapus background image
- Hapus tombol solid "View case study" — tidak diganti apapun
- Cursor sudah ada di kode aslinya — tidak diubah
- Hover expand behavior sudah ada di kode aslinya — tidak diubah
- `align-items: start` di card grid — wajib untuk expand behavior
- Card style: `#ffffff`, border 0.5px, border-radius 12px
- Tag: rounded pill, warm green palette

### Font sizes card

| Element          | Size |
| ---------------- | ---- |
| Card title       | 16px |
| Card description | 14px |
| Tag              | 12px |
| Meta label       | 10px |
| Meta value       | 14px |

### Layout responsive

| Breakpoint       | Kolom   |
| ---------------- | ------- |
| Desktop + Tablet | 2 kolom |
| Android          | 1 kolom |

---

## About Me

**File:** `FitriGarden_AboutMe_TodoList.md`

**Deskripsi:** Halaman panjang berisi bio, quote, experience, organization, courses, dan testimonials.

### Ringkasan perubahan

- Hapus background image
- `max-width: 640px` di content area untuk readability
- Semua konten disimpan di data object JS (karena konten masih akan berubah)
- Section pills: rounded pill, warm green
- Blockquote: `border-left` dengan `border-radius: 0`
- Entry header: flex row di desktop, column di Android
- Testimonial cards: style konsisten dengan project cards

### Struktur data JS

```js
const aboutData = {
  quote: { author, text, response },
  bio: { intro, paragraphs[] },
  experience: [{ company, role, period, description }],
  organization: [{ name, role, period, description }],
  courses: [{ name, role, period, description }],
  testimonials: [{ stars, text, name, location }]
}
```

### Font sizes

| Element           | Font                        | Size |
| ----------------- | --------------------------- | ---- |
| Quote             | Playfair Display 700 italic | 18px |
| Bio intro         | Inter 500                   | 16px |
| Bio body          | Inter 300                   | 14px |
| Entry title       | Inter 500                   | 16px |
| Entry date        | Inter 300                   | 12px |
| Entry desc        | Inter 300                   | 14px |
| Testimonial quote | Inter 300 italic            | 14px |

---

## Visitor Gallery

**File:** `FitriGarden_VisitorGallery_TodoList.md`

**Deskripsi:** Halaman menampilkan semua visitor yang sudah menanam bunga. Garden identik dengan Leave Your Bloom.

### Ringkasan perubahan

- **PRIORITAS UTAMA: samakan garden container dengan Leave Your Bloom**
  - `background: #f2ede4`
  - `border-radius: 14px`
  - `border: 1px solid rgba(154,175,122,0.3)`
- Hapus background image
- "My corner" button: outline pill identik dengan CTA homepage
- Bloom cards: style konsisten dengan card halaman lain
- Footer bar: sembunyikan "hover hint" di Android
- Aset bunga tidak diubah sama sekali

### Layout responsive

| Breakpoint       | Layout                                                 |
| ---------------- | ------------------------------------------------------ |
| Desktop + Tablet | Garden kiri, bloom panel kanan (200–220px)             |
| Android          | Garden atas, bloom panel jadi bottom drawer (swipe up) |

### Aturan tidak boleh diubah

- Aset bunga (SVG/PNG)
- Logika drag garden
- Hover behavior bunga
- Cursor yang sudah ada

---

## Referensi File

| Halaman          | File To-Do List                          |
| ---------------- | ---------------------------------------- |
| Intro Page       | `FitriGarden_IntroPage_TodoList.md`      |
| Home Page        | `FitriGarden_HomePage_TodoList.md`       |
| Leave Your Bloom | `FitriGarden_LeaveYourBloom_TodoList.md` |
| Project Page     | `FitriGarden_ProjectPage_TodoList.md`    |
| About Me         | `FitriGarden_AboutMe_TodoList.md`        |
| Visitor Gallery  | `FitriGarden_VisitorGallery_TodoList.md` |
| Reference Image  | `FitriGarden_Homepage_Reference.png`     |

---

## Quick Reference — Hal yang Paling Sering Salah

1. **Font size ganjil** — selalu cek apakah kelipatan 2 sebelum commit
2. **Background image tidak dihapus** — semua halaman harus `#faf7f2` plain
3. **Sidebar diduplikasi** — gunakan satu komponen yang sama di semua halaman
4. **Sidebar footer tidak sticky** — harus `flex-shrink: 0`, bukan `position: fixed`
5. **Garden style beda antar halaman** — Leave Your Bloom dan Visitor Gallery harus identik
6. **Button style tidak konsisten** — selalu outline pill, bukan solid
7. **Card border-radius salah** — card pakai `12px`, sidebar form input pakai `8px`
8. **`align-items` di Project grid** — harus `start`, bukan `stretch`
9. **Posisi bunga pakai pixel absolut** — harus koordinat relatif 0–1
10. **Dummy data tidak dihapus** — pastikan Leave Your Bloom mulai dari empty state

---

_Dokumentasi ini adalah ringkasan dari sesi redesign Fitri's Garden — May 2026._
_Tiap halaman punya file to-do list tersendiri dengan spec lengkap dan prompt Copilot._
