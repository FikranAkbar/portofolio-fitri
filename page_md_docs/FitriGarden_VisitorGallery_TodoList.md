# Fitri's Garden — Visitor Gallery Page To-Do List
*Redesign spec untuk halaman Visitor Gallery*
*Style konsisten dengan Home Page, Project Page, About Me, dan Leave Your Bloom*

---

## Aturan yang tidak boleh diubah

- Font: `Playfair Display` untuk nama jika ada, `Inter` untuk semua teks lainnya
- Semua font size kelipatan 2
- Sidebar identik dengan halaman lain — gunakan komponen yang sama
- Background main area: plain `#faf7f2`, no image
- Aset bunga (SVG/PNG) tidak boleh diubah sama sekali
- Icon pakai library yang sudah ada di kode aslinya

---

## Masalah utama yang harus diselesaikan

**Garden di Visitor Gallery harus terlihat identik dengan garden di Leave Your Bloom.**

Saat ini ada inkonsistensi visual antara dua page ini padahal keduanya menampilkan garden yang sama. Yang perlu disamakan:

1. Background color garden area
2. Border dan border-radius container garden
3. Ukuran dan render bunga (scale, spacing)
4. Background color bloom cards panel
5. Typography bloom cards
6. Semua font sizes ke kelipatan 2
7. Background image di main area dihapus

---

## To-Do 1 — Samakan garden area dengan Leave Your Bloom

Cari selector CSS yang mengatur garden container di Visitor Gallery,
lalu samakan nilainya dengan yang ada di Leave Your Bloom:

```css
/* Visitor Gallery garden area — samakan dengan Leave Your Bloom */
.garden-area {
  background: #f2ede4;                              /* sama persis */
  border-radius: 14px;                              /* sama persis */
  border: 1px solid rgba(154, 175, 122, 0.3);      /* sama persis */
  position: relative;
  overflow: hidden;
}
```

**Yang perlu dicek langsung di kode:**
- Cari className/id yang dipakai garden di Visitor Gallery
- Cari className/id yang dipakai garden di Leave Your Bloom
- Bandingkan: `background`, `border`, `border-radius`, `overflow`
- Samakan semua nilai yang berbeda

---

## To-Do 2 — Samakan render bunga

Aset bunga tidak boleh diubah, tapi pastikan cara mereka dirender konsisten:

```css
/* Tiap bunga yang dirender di garden */
.flower-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  /* Samakan ukuran render dengan Leave Your Bloom */
}

.flower-emoji {
  font-size: 24px;    /* cek dan samakan dengan Leave Your Bloom */
  line-height: 1;
}
```

**Yang perlu dicek:**
- Ukuran bunga di Visitor Gallery vs Leave Your Bloom — samakan `font-size` atau `width/height`
- Pastikan sistem koordinat bunga sama (posisi relatif 0–1, bukan pixel absolut)
- Pastikan tidak ada CSS override yang mengubah warna atau filter bunga

---

## To-Do 3 — Layout page

```css
.page-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #faf7f2;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #faf7f2;    /* plain, no image */
}
```

---

## To-Do 4 — Topbar

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
}

/* "My corner" button di kanan topbar */
.topbar-action {
  margin-left: auto;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #2d4a1e;
  background: rgba(250, 247, 242, 0.5);
  border: 1px solid #6b8f4e;
  border-radius: 99px;
  padding: 5px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease;
}

.topbar-action:hover {
  background: rgba(155, 175, 122, 0.15);
}
```

---

## To-Do 5 — Content layout (garden + bloom panel)

### 5.1 Desktop & Tablet — garden kiri, panel kanan

```css
.gallery-layout {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  overflow: hidden;
}

/* Garden area */
.garden-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Bloom cards panel */
.bloom-panel {
  width: 220px;
  min-width: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bloom-panel::-webkit-scrollbar { display: none; }

@media (max-width: 1024px) {
  .gallery-layout { padding: 14px 20px; gap: 14px; }
  .bloom-panel { width: 200px; min-width: 200px; }
}
```

### 5.2 Android — garden atas, panel jadi bottom drawer

```css
@media (max-width: 480px) {
  .gallery-layout {
    flex-direction: column;
    padding: 12px 16px;
    gap: 0;
    position: relative;
  }

  .garden-wrapper {
    flex: 1;
  }

  /* Bottom drawer */
  .bloom-panel {
    width: 100%;
    min-width: unset;
    height: 50vh;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #faf7f2;
    border-top: 0.5px solid rgba(154, 175, 122, 0.3);
    border-radius: 16px 16px 0 0;
    padding: 12px 16px;
    transform: translateY(calc(100% - 48px));  /* collapsed: hanya handle terlihat */
    transition: transform 0.3s ease;
    z-index: 20;
    overflow-y: auto;
  }

  .bloom-panel.open {
    transform: translateY(0);
  }

  /* Drag handle */
  .bloom-panel-handle {
    width: 36px;
    height: 4px;
    background: rgba(154, 175, 122, 0.4);
    border-radius: 99px;
    margin: 0 auto 12px;
    cursor: pointer;
    flex-shrink: 0;
  }
}
```

---

## To-Do 6 — Bloom cards (panel kanan)

```html
<div class="bloom-card">
  <div class="bloom-card-left">
    <div class="bloom-flower-preview">
      <!-- gambar bunga kecil — jangan diubah asetnya -->
    </div>
  </div>
  <div class="bloom-card-body">
    <div class="bloom-card-header">
      <span class="bloom-type">Sakura Bloom</span>
      <button class="bloom-edit-btn" aria-label="Edit bloom">✏️</button>
    </div>
    <span class="bloom-by">by haha</span>
    <p class="bloom-message">sasa</p>
    <div class="bloom-card-footer">
      <span class="bloom-date">May 18, 2026</span>
      <span class="bloom-number">No. 1797</span>
      <span class="bloom-name-tag">haha</span>
    </div>
  </div>
</div>
```

```css
.bloom-card {
  background: #ffffff;
  border: 0.5px solid rgba(154, 175, 122, 0.3);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.bloom-card:hover {
  border-color: rgba(107, 143, 78, 0.5);
}

.bloom-flower-preview {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bloom-card-body {
  flex: 1;
  min-width: 0;
}

.bloom-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.bloom-type {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #2d4a1e;
}

.bloom-edit-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: #9aaf7a;
  padding: 0;
  line-height: 1;
}

.bloom-by {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #9aaf7a;
  display: block;
  margin-bottom: 3px;
}

.bloom-message {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #5a7040;
  line-height: 1.5;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bloom-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.bloom-date {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #9aaf7a;
}

.bloom-number {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #b0c890;
}

.bloom-name-tag {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #9aaf7a;
  margin-left: auto;
}
```

---

## To-Do 7 — Page header (judul + bloom count)

```html
<div class="gallery-header">
  <h1 class="gallery-title">Visitor Gallery</h1>
  <span class="bloom-count-badge">107 Blooms Planted</span>
</div>
```

```css
.gallery-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px 0;
  flex-shrink: 0;
}

.gallery-title {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #2d4a1e;
}

.bloom-count-badge {
  font-family: 'Inter', sans-serif;
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

## To-Do 8 — Footer bar bawah garden

```html
<div class="garden-footer">
  <div class="garden-footer-stat">
    <span class="footer-number">107</span>
    <span class="footer-label">Blooms planted so far</span>
  </div>
  <div class="garden-footer-tagline">
    Every flower here was planted<br>by a visitor with a kind heart.
  </div>
  <!-- Di Android, hint ini dihilangkan -->
  <div class="garden-footer-hint">
    <span class="hint-icon">🦋</span>
    <span class="hint-text">Hover a bloom<br>to read its story</span>
  </div>
</div>
```

```css
.garden-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 0.5px solid rgba(154, 175, 122, 0.2);
  background: #faf7f2;
  flex-shrink: 0;
}

.footer-number {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 700;
  color: #2d4a1e;
  display: block;
  line-height: 1.1;
}

.footer-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #9aaf7a;
}

.garden-footer-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #9aaf7a;
  text-align: center;
  line-height: 1.6;
}

.garden-footer-hint {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #9aaf7a;
  line-height: 1.5;
}

/* Android: sembunyikan hint hover */
@media (max-width: 480px) {
  .garden-footer-hint { display: none; }
  .garden-footer { justify-content: space-between; }
}
```

---

## To-Do 9 — Bloom count badge di garden

```css
/* Dot hijau di topbar tengah */
.garden-dot-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6b8f4e;
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
}
```

---

## To-Do 10 — Responsive ringkasan

### Breakpoints

```
Desktop:  min-width 1025px  → garden + panel kanan
Tablet:   481px – 1024px    → garden + panel kanan (lebih sempit)
Android:  max-width 480px   → garden full width + bottom drawer
```

### Font sizes per breakpoint — semua kelipatan 2

| Element | Desktop | Tablet | Android |
|---|---|---|---|
| Gallery title | 20px | 20px | 18px |
| Bloom count badge | 12px | 12px | 12px |
| Bloom type | 12px | 12px | 12px |
| Bloom message | 12px | 12px | 12px |
| Bloom date/number | 10px | 10px | 10px |
| Footer number | 20px | 20px | 18px |
| Footer tagline | 12px | 12px | 12px |
| Topbar title | 14px | 14px | 12px |

---

## To-Do 11 — Prompt Copilot

```
Redesign the "Visitor Gallery" page of "Fitri's Garden" portfolio in Astro.
Use the same sidebar component as all other pages.
Style must match the warm palette — especially the garden area must be
IDENTICAL to the Leave Your Bloom page garden.

FONT RULE: all font sizes must be multiples of 2.
BACKGROUND: plain #faf7f2, no image.
FLOWER ASSETS: do not change SVG/PNG flower assets at all.

THE MOST IMPORTANT TASK:
Make the garden container in Visitor Gallery look identical to Leave Your Bloom:
- background: #f2ede4
- border-radius: 14px
- border: 1px solid rgba(154, 175, 122, 0.3)
- overflow: hidden
- Flower render size must match Leave Your Bloom exactly

PAGE LAYOUT:
- display flex, height 100vh, overflow hidden
- Left: Sidebar component (same as all pages)
- Right: main area (flex 1, flex-direction column, bg #faf7f2)

TOPBAR (same structure as other pages):
- Traffic lights + "Visitor Gallery" (Inter 500 14px #2d4a1e)
  + "Bloomed with love" (Inter 400 14px #9aaf7a)
- Right side: "My corner" button — same pill style as homepage CTA:
  border 1px solid #6b8f4e, border-radius 99px,
  bg rgba(250,247,242,0.5), color #2d4a1e, Inter 400 12px,
  hover bg rgba(155,175,122,0.15)

GALLERY HEADER (padding 14px 24px 0):
- "Visitor Gallery" — Inter 500 20px #2d4a1e
- Bloom count badge: "107 Blooms Planted"
  Inter 400 12px color #4e7a30, bg rgba(200,219,160,0.3),
  border 0.5px solid rgba(107,143,78,0.3), border-radius 99px, padding 3px 10px

CONTENT LAYOUT (.gallery-layout, flex 1, padding 16px 24px, gap 16px):
  Desktop + Tablet: flex-direction row
    Garden (flex 1) + Bloom panel (width 220px desktop / 200px tablet)

  Android (≤480px): bloom panel becomes bottom drawer
    - position fixed, bottom 0, full width
    - border-radius 16px 16px 0 0, border-top 0.5px solid rgba(154,175,122,0.3)
    - collapsed: transform translateY(calc(100% - 48px))
    - open: transform translateY(0), transition 0.3s ease
    - drag handle: 36px wide, 4px tall, bg rgba(154,175,122,0.4), border-radius 99px

GARDEN AREA (flex 1, min-height 0):
  IDENTICAL to Leave Your Bloom:
  bg #f2ede4, border-radius 14px, border 1px solid rgba(154,175,122,0.3),
  overflow hidden, position relative

GARDEN FOOTER (border-top 0.5px solid rgba(154,175,122,0.2), padding 10px 16px):
  - Left: bloom count number (Playfair Display 700 20px #2d4a1e)
    + label (Inter 300 10px #9aaf7a)
  - Center: tagline (Inter 300 12px #9aaf7a, text-align center)
  - Right: hover hint icon + text (Inter 300 12px #9aaf7a)
    — HIDE on Android (display none)

BLOOM CARDS PANEL (overflow-y auto, gap 8px, hide scrollbar):
  Each card: bg #ffffff, border 0.5px solid rgba(154,175,122,0.3),
  border-radius 10px, padding 10px 12px, display flex, gap 10px
  hover: border-color rgba(107,143,78,0.5)
  - Left: flower preview 36px square (do not change flower asset)
  - Right body:
    header row: bloom type (Inter 500 12px #2d4a1e) + edit btn (pencil icon 12px #9aaf7a)
    "by [name]" (Inter 300 10px #9aaf7a)
    message text (Inter 300 12px #5a7040, truncate with ellipsis)
    footer row: date (Inter 300 10px #9aaf7a) + No. (Inter 300 10px #b0c890)
      + name tag (Inter 400 10px #9aaf7a, margin-left auto)

Google Fonts: Playfair Display (700) + Inter (300, 400, 500)
```

---

## Checklist

- [ ] **PRIORITAS UTAMA: samakan garden container dengan Leave Your Bloom**
  - [ ] background: `#f2ede4`
  - [ ] border-radius: `14px`
  - [ ] border: `1px solid rgba(154,175,122,0.3)`
  - [ ] cek dan samakan ukuran render bunga
- [ ] Hapus background image dari main area
- [ ] Gunakan komponen Sidebar yang sama
- [ ] "My corner" button: pill style identik dengan CTA homepage
- [ ] Bloom count badge: rounded pill, warm green palette
- [ ] Bloom cards: style konsisten dengan cards di halaman lain
- [ ] Garden footer: sembunyikan hover hint di Android
- [ ] Bottom drawer di Android dengan drag handle
- [ ] Font sizes semua kelipatan 2
- [ ] Test breakpoint desktop / tablet / Android
- [ ] Test sidebar footer tetap di bawah viewport

---

*Garden area harus terlihat identik antara Visitor Gallery dan Leave Your Bloom.*
