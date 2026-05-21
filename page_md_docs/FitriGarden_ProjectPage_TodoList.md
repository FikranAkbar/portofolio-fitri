# Fitri's Garden — Project Page To-Do List
*Redesign spec untuk halaman Project — sidebar + card grid*
*Style konsisten dengan Home Page dan Intro Page*

---

## Aturan yang tidak boleh diubah

- Font: `Playfair Display` untuk nama, `Inter` untuk semua teks lainnya
- Semua font size kelipatan 2
- Sidebar identik dengan Home Page: putih `#ffffff`, fixed di kiri
- Background main area: plain `#faf7f2`, no image
- Sidebar adalah satu komponen yang sama — bukan duplikasi
- Icon pakai library yang sudah ada di kode aslinya

---

## Masalah yang ditemukan di versi sekarang

1. Background image masih ada di main area — perlu dihapus
2. Card spacing tidak konsisten — padding, gap, dan margin perlu dirapikan
5. Font sizes di dalam card tidak mengikuti kelipatan 2
6. Tag style belum konsisten dengan warm palette
7. Topbar "Project / My works" perlu disesuaikan stylenya

---

## To-Do 1 — Layout page

```css
.page-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #faf7f2;
}

/* Sidebar: identik dengan Home Page — gunakan komponen yang sama */

/* Main area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #faf7f2;    /* plain, no image */
}
```

---

## To-Do 2 — Topbar

```html
<div class="page-topbar">
  <div class="traffic-lights">
    <span class="tl tl-red"></span>
    <span class="tl tl-gray"></span>
    <span class="tl tl-gray"></span>
  </div>
  <span class="topbar-title">Project</span>
  <span class="topbar-tab">My works</span>
</div>
```

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

.traffic-lights { display: flex; gap: 5px; }
.tl {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.tl-red   { background: #ff5f57; }
.tl-gray  { background: #d9d9d9; }

.topbar-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #2d4a1e;
}

.topbar-tab {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #9aaf7a;
  cursor: pointer;
}
```

---

## To-Do 3 — Card grid layout

```css
.cards-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;   /* PENTING: biar card expand mendorong card bawahnya */
}

.cards-area::-webkit-scrollbar { display: none; }

@media (max-width: 1024px) {
  .cards-area { padding: 16px 20px; gap: 14px; }
}

@media (max-width: 480px) {
  .cards-area {
    grid-template-columns: 1fr;   /* Android: single column */
    padding: 14px 16px;
  }
}
```

**`align-items: start`** tetap diperlukan supaya grid tidak memaksa card sama tinggi antar kolom.

---

## To-Do 4 — Project card: struktur HTML

```html
<article class="project-card">

  <!-- Cover image area -->
  <div class="card-cover">
    <img src="/path/to/cover.jpg" alt="Project cover" class="card-cover-img" />

    <!-- Overlay: muncul saat hover -->
    <div class="card-cover-overlay" aria-hidden="true">
      <span class="view-label">View case study ↗</span>
    </div>
  </div>

  <!-- Info selalu terlihat -->
  <div class="card-body">
    <div class="card-title-row">
      <h2 class="card-title">Project Title</h2>
      <div class="card-tags">
        <span class="tag">UI/UX</span>
        <span class="tag">Pixel Art</span>
      </div>
    </div>
    <p class="card-desc">Short description of the project.</p>
  </div>

  <!-- Expanded section: muncul saat hover, collapse saat hover hilang -->
  <div class="card-expanded" aria-hidden="true">
    <hr class="card-divider">
    <div class="meta-row">
      <span class="meta-label">Role</span>
      <span class="meta-value">UI/UX Designer</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Team</span>
      <span class="meta-value">Solo project</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Timeframe</span>
      <span class="meta-value">Jan 2025 – Present</span>
    </div>
  </div>

</article>
```

---

## To-Do 5 — Project card: CSS lengkap

### 5.1 Card wrapper

```css
.project-card {
  background: #ffffff;
  border: 0.5px solid rgba(154, 175, 122, 0.3);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.project-card:hover {
  border-color: rgba(107, 143, 78, 0.5);
}
```

### 5.2 Cover image area

```css
.card-cover {
  width: 100%;
  height: 200px;
  background: #e8e2d8;      /* fallback jika image belum ada */
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Placeholder text saat belum ada image */
.card-cover-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #b8b0a2;
}
```

### 5.3 Cursor

Cursor sudah ada di kode aslinya — jangan diubah.

### 5.4 Card body (selalu terlihat)

```css
.card-body {
  padding: 14px 16px 14px;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.card-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;            /* kelipatan 2 */
  font-weight: 500;
  color: #2d4a1e;
  line-height: 1.3;
}

.card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.tag {
  font-family: 'Inter', sans-serif;
  font-size: 12px;            /* kelipatan 2 */
  font-weight: 400;
  color: #4e7a30;
  background: rgba(200, 219, 160, 0.3);
  border: 0.5px solid rgba(107, 143, 78, 0.3);
  border-radius: 99px;
  padding: 3px 10px;
  white-space: nowrap;
}

.card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;            /* kelipatan 2 */
  font-weight: 300;
  color: #5a7040;
  line-height: 1.5;
}
```

### 5.5 Expanded section

Hover expand behavior sudah ada di kode aslinya — jangan diubah.
Hanya sesuaikan style teks meta (label dan value) supaya konsisten:

```css
.meta-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #9aaf7a;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  width: 80px;
  flex-shrink: 0;
}

.meta-value {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #5a7040;
}

.card-divider {
  border: none;
  border-top: 0.5px solid rgba(154, 175, 122, 0.25);
  margin-bottom: 12px;
}
```

---

## To-Do 6 — Hapus tombol "View case study" yang solid

Di versi sekarang ada tombol solid gelap di dalam card expanded. Hapus sepenuhnya:

```css
/* HAPUS elemen ini dari HTML dan CSS: */
/* <button class="view-case-study-btn">View case study ↗</button> */
```

Tidak ada pengganti — cukup cursor yang berubah saat hover card.

---

## To-Do 7 — Prompt Copilot

```
Redesign the Project page of "Fitri's Garden" portfolio in Astro.
Use the same sidebar component as the Home Page (don't duplicate it).
Style must match the rest of the portfolio — warm palette, same fonts.

FONT RULE: all font sizes must be multiples of 2.
BACKGROUND: remove all background images — use plain #faf7f2.

PAGE LAYOUT:
- display flex, height 100vh, overflow hidden
- Left: same Sidebar component as Home Page (width 240px, bg #ffffff)
- Right: main area (flex 1, flex-direction column, bg #faf7f2)

TOPBAR (sticky top, padding 12px 24px, border-bottom 0.5px rgba(154,175,122,0.2)):
- Traffic lights: red (#ff5f57) + 2 gray (#d9d9d9), gap 5px, 10px circles
- "Project" — Inter 500 14px color #2d4a1e
- "My works" — Inter 400 14px color #9aaf7a

CARDS AREA (flex 1, overflow-y auto, padding 20px 24px):
- CSS grid, grid-template-columns 1fr 1fr, gap 16px
- align-items: start — REQUIRED for expand-push behavior
- Mobile (≤480px): single column

EACH PROJECT CARD (.project-card):
- bg #ffffff, border 0.5px solid rgba(154,175,122,0.3), border-radius 12px
- overflow hidden, cursor pointer
- hover: border-color rgba(107,143,78,0.5)

  COVER AREA (.card-cover, height 200px, position relative, overflow hidden):
  - bg #e8e2d8 as fallback
  - NO overlay, NO label, NO button
  - Only cursor change on hover (see cursor spec below)

  CARD BODY (padding 14px 16px, always visible):
  - Title row: card title (Inter 500 16px #2d4a1e) + tags flex-end
  - Tags: Inter 400 12px color #4e7a30,
    bg rgba(200,219,160,0.3), border 0.5px solid rgba(107,143,78,0.3),
    border-radius 99px, padding 3px 10px
  - Description: Inter 300 14px color #5a7040 line-height 1.5

  EXPANDED SECTION: hover expand behavior already exists in codebase — do not touch.
  Only style the meta text:
  - label: Inter 500 10px uppercase ls 0.1em color #9aaf7a, width 80px
  - value: Inter 300 14px color #5a7040
  - divider: border-top 0.5px solid rgba(154,175,122,0.25), margin-bottom 12px

CURSOR: already exists in the codebase — do not touch.

REMOVE the existing solid "View case study" button from HTML and CSS entirely.
No replacement needed.

Google Fonts: Playfair Display (700) + Inter (300, 400, 500)
```

---

## Ringkasan font sizes — kelipatan 2

| Element | Size |
|---|---|
| Topbar title | 14px |
| Card title | 16px |
| Card description | 14px |
| Tag | 12px |
| Meta label | 10px |
| Meta value | 14px |

---

## To-Do 8 — Responsive

### 8.1 Breakpoints

```css
/* Cards area */
.cards-area {
  padding: 20px 24px;
  gap: 16px;
  grid-template-columns: 1fr 1fr;  /* Desktop */
}

@media (max-width: 1024px) {
  .cards-area {
    padding: 16px 20px;             /* Tablet */
    gap: 14px;
  }
  .card-cover { height: 180px; }
}

@media (max-width: 480px) {
  .cards-area {
    grid-template-columns: 1fr;     /* Android — single column */
    padding: 14px 16px;
    gap: 12px;
  }
  .card-cover { height: 160px; }
}
```

### 8.2 Font sizes per breakpoint — semua kelipatan 2

| Element | Desktop | Tablet | Android |
|---|---|---|---|
| Card title | 16px | 16px | 16px |
| Card desc | 14px | 14px | 14px |
| Tag | 12px | 12px | 12px |
| Meta label | 10px | 10px | 10px |
| Meta value | 14px | 14px | 14px |
| Topbar title | 14px | 14px | 12px |

### 8.3 Sidebar responsive

Sidebar mengikuti spec yang sama dengan Home Page:
- Desktop: 240px fixed kiri
- Tablet: 220px fixed kiri
- Android: bottom navigation (sudah ada di Home Page spec)

---

## Checklist

- [ ] Hapus background image dari main area
- [ ] Gunakan komponen Sidebar yang sama dengan Home Page
- [ ] Hapus tombol solid "View case study" dari HTML dan CSS
- [ ] `align-items: start` di card grid — wajib untuk expand behavior
- [ ] Tag style: rounded pill, warm green palette
- [ ] Font sizes semua kelipatan 2
- [ ] Cards grid: 2 kolom desktop/tablet → 1 kolom Android
- [ ] Card cover height: 200px → 180px tablet → 160px Android
- [ ] Test breakpoint tablet (1024px) dan Android (480px)
- [ ] Topbar sticky saat cards area di-scroll

---

*Style konsisten dengan Home Page dan Intro Page.*
