# Fitri's Garden — "Leave Your Bloom" Page To-Do List
*Redesign spec lengkap untuk dikerjakan dengan Google Copilot di VS Code + Astro*

---

## Aturan yang TIDAK boleh diubah

1. **Desain gambar bunga** — jangan ubah apapun dari kode bunga yang sudah ada (aset, emoji, ukuran, style render). Hanya posisi dan label-nya yang boleh diatur ulang.
2. **Style CTA button** — "Plant My Bloom →" harus identik dengan button homepage: `border: 1px solid #6b8f4e`, `border-radius: 99px`, `background: rgba(250,247,242,0.5)`, `color: #2d4a1e`, `hover: rgba(155,175,122,0.15)`. Bukan solid green seperti di versi sekarang.
3. **Equal height** — garden area dan sidebar card harus selalu sama tingginya di semua breakpoint desktop dan tablet (lihat To-Do 3.4).

---

## Masalah yang ditemukan di versi sekarang

1. **Dummy data harus dihapus** — garden penuh bunga fiktif yang overlap dan bertumpukan
2. **Garden kosong perlu empty state** yang jelas dan welcoming
3. **Label nama + tanggal bunga** terlalu kecil dan saling bertabrakan
4. **Panel "Your Bloom Story"** warnanya tidak menyatu dengan warm palette
5. **Flower picker** ukurannya tidak konsisten dan terlalu rapat
6. **Spacing antar elemen** tidak konsisten — terlalu padat di beberapa area
7. **Font sizes** tidak mengikuti aturan kelipatan 2
8. **Visitor counter** tampil bahkan saat dummy data belum dihapus
9. **Button style** tidak konsisten dengan homepage — sekarang solid green, seharusnya outline pill

---

## Breakpoints (sama dengan homepage)

```
Desktop:  min-width 1025px
Tablet:   481px – 1024px
Android:  max-width 480px
```

---

## To-Do 1 — Hapus dummy data & buat empty state garden

### 1.1 Hapus semua dummy data
Cari dan hapus array/data hardcoded yang berisi nama-nama visitor fiktif (Yoga, Niko, Putri, dll) beserta koordinat bunga mereka. Garden harus dimulai dari kondisi kosong.

```js
// HAPUS ini (atau apapun yang mirip):
const dummyFlowers = [
  { name: "Yoga", date: "Mar 11, 2026", x: 80, y: 260, type: "lavender" },
  { name: "Niko", date: "Apr 25, 2026", x: 430, y: 170, type: "forget-me-not" },
  // dst...
]
```

### 1.2 Buat empty state yang welcoming
Tampilkan pesan ini saat garden masih kosong (belum ada bunga dari real visitors):

```html
<div class="garden-empty-state">
  <p class="garden-empty-icon">🌱</p>
  <p class="garden-empty-text">
    This is our growing garden.<br>
    Every bloom here was planted<br>
    by someone who visited.
  </p>
</div>
```

```css
.garden-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px 24px;
}

.garden-empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.garden-empty-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;           /* kelipatan 2 */
  font-weight: 300;
  color: #9aaf7a;
  line-height: 1.7;
}
```

### 1.3 Kondisi logic garden
```js
// Tampilkan empty state jika belum ada bunga real
if (realFlowers.length === 0) {
  showEmptyState();
} else {
  renderGarden(realFlowers);
}
```

---

## To-Do 2 — Typography: semua kelipatan 2

### 2.1 Page eyebrow — "WELCOME, VISITOR."

| Breakpoint | Font size |
|---|---|
| Desktop | `12px` |
| Tablet | `12px` |
| Android | `10px` |

```css
.page-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.16em;
  color: #9aaf7a;
  text-transform: uppercase;
  margin-bottom: 6px;
}
```

### 2.2 Page title — "Leave Your Bloom"

| Breakpoint | Font size |
|---|---|
| Desktop | `48px` |
| Tablet | `38px` |
| Android | `30px` |

```css
.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  color: #2d4a1e;
  line-height: 1.1;
  margin-bottom: 8px;

  font-size: 48px;           /* Desktop */
}

@media (max-width: 1024px) {
  .page-title { font-size: 38px; }
}

@media (max-width: 480px) {
  .page-title { font-size: 30px; }
}
```

### 2.3 Page subtitle

| Breakpoint | Font size |
|---|---|
| Desktop | `14px` |
| Tablet | `14px` |
| Android | `12px` |

```css
.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  color: #5a7040;
  line-height: 1.6;

  font-size: 14px;           /* Desktop & Tablet */
}

@media (max-width: 480px) {
  .page-subtitle { font-size: 12px; }
}
```

### 2.4 Nav items (Back + Skip this step)

```css
.nav-back, .nav-skip {
  font-family: 'Inter', sans-serif;
  font-size: 12px;           /* Desktop & Tablet */
  font-weight: 400;
  letter-spacing: 0.08em;
}

@media (max-width: 480px) {
  .nav-back, .nav-skip { font-size: 12px; }
}
```

### 2.5 Sidebar form labels

```css
.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b8f4e;
  display: block;
  margin-bottom: 4px;
}
```

### 2.6 Sidebar form inputs

```css
.form-input, .form-textarea {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #3a5030;
  background: rgba(250, 247, 242, 0.8);
  border: 1px solid rgba(154, 175, 122, 0.4);
  border-radius: 8px;
  padding: 8px 10px;
  width: 100%;
}

.form-input::placeholder, .form-textarea::placeholder {
  color: #b0c890;
}

.form-textarea {
  resize: none;
  height: 72px;
  line-height: 1.5;
}
```

### 2.7 Visitor counter

```css
.visitor-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9aaf7a;
}

.visitor-number {
  font-family: 'Playfair Display', serif;
  font-size: 32px;           /* Desktop */
  font-weight: 700;
  color: #2d4a1e;
  line-height: 1.2;
}

.visitor-thanks {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #9aaf7a;
  font-style: italic;
}

@media (max-width: 480px) {
  .visitor-number { font-size: 28px; }
}
```

### 2.8 Flower picker labels

```css
.flower-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #6b8f4e;
}

.flower-picker-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9aaf7a;
  text-align: center;
  margin-bottom: 14px;
}
```

### 2.9 CTA Button — "Plant My Bloom →"

| Breakpoint | Font size | Padding |
|---|---|---|
| Desktop | `14px` | `10px 28px` |
| Tablet | `14px` | `10px 28px` |
| Android | `14px` | `10px 24px` |

```css
.plant-btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #2d4a1e;
  background: rgba(250, 247, 242, 0.5);
  border: 1px solid #6b8f4e;
  border-radius: 99px;
  padding: 10px 28px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  text-decoration: none;
  transition: background 0.2s ease;
}

/* Identik dengan CTA homepage — jangan ubah ke solid bg */
.plant-btn:hover {
  background: rgba(155, 175, 122, 0.15);
}

.plant-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-style: italic;
  color: #9aaf7a;
  text-align: center;
  margin-top: 8px;
}
```

---

## To-Do 3 — Layout Responsive

### 3.1 Page wrapper

```css
.page-wrapper {
  background: #faf7f2;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
```

### 3.2 Top navigation

```css
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-bottom: 0.5px solid rgba(107, 143, 78, 0.2);
}

@media (max-width: 480px) {
  .top-nav { padding: 14px 20px; }
}
```

### 3.3 Page header

```css
.page-header {
  text-align: center;
  padding: 28px 24px 20px;
}

@media (max-width: 480px) {
  .page-header { padding: 20px 20px 16px; }
}
```

### 3.4 Main layout — KUNCI RESPONSIVE

```css
/* Desktop & Tablet: garden kiri, sidebar kanan */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  padding: 0 32px 24px;
  align-items: stretch;   /* KUNCI equal height garden & sidebar */
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr 260px;
    padding: 0 24px 20px;
    gap: 16px;
  }
}

/* Android: sidebar pindah ke bawah garden */
@media (max-width: 480px) {
  .main-layout {
    grid-template-columns: 1fr;
    padding: 0 20px 20px;
    gap: 14px;
  }

  /* Garden tetap di atas, sidebar turun ke bawah */
  .garden-area { order: 1; }
  .sidebar     { order: 2; }
}
```

### 3.5 Garden area

```css
.garden-area {
  background: #f2ede4;
  border-radius: 14px;
  border: 1px solid rgba(154, 175, 122, 0.3);
  position: relative;
  overflow: hidden;
  cursor: crosshair;

  /* Equal height: garden selalu setinggi sidebar */
  min-height: 420px;         /* Desktop — fallback minimum */
}

/* Sidebar juga harus stretch penuh */
.sidebar {
  display: flex;
  flex-direction: column;
}

.sidebar-card {
  flex: 1;                   /* mengisi sisa tinggi sidebar */
}

@media (max-width: 1024px) {
  .garden-area { min-height: 360px; }
}

@media (max-width: 480px) {
  /* Di Android tidak perlu equal height karena stacked */
  .garden-area { min-height: 280px; }
  .sidebar-card { flex: unset; }
}

.garden-hint {
  position: absolute;
  bottom: 12px;
  left: 0; right: 0;
  text-align: center;
  font-size: 12px;
  color: #b0c890;
  letter-spacing: 0.06em;
  pointer-events: none;
}
```

### 3.6 Sidebar card

```css
.sidebar-card {
  background: #f5f0e8;
  border-radius: 12px;
  border: 1px solid rgba(154, 175, 122, 0.25);
  padding: 16px;
}

.sidebar-card-title {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9aaf7a;
  margin-bottom: 14px;
  text-align: center;
}

.form-group {
  margin-bottom: 10px;
}

.visitor-divider {
  border: none;
  border-top: 0.5px solid rgba(154, 175, 122, 0.3);
  margin: 12px 0 10px;
}
```

### 3.7 Flower picker

```css
.bottom-section {
  padding: 4px 32px 32px;
}

@media (max-width: 1024px) {
  .bottom-section { padding: 4px 24px 28px; }
}

@media (max-width: 480px) {
  .bottom-section { padding: 4px 20px 28px; }
}

.flower-picker {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.flower-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.flower-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: rgba(250, 247, 242, 0.9);
  border: 1.5px solid rgba(154, 175, 122, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: border-color 0.15s ease, background 0.15s ease;
}

/* State: selected */
.flower-option.selected .flower-icon-wrap {
  border-color: #6b8f4e;
  background: rgba(200, 219, 160, 0.3);
  outline: 2px solid rgba(107, 143, 78, 0.2);
  outline-offset: 2px;
}

/* State: hover */
.flower-option:hover .flower-icon-wrap {
  border-color: #9aaf7a;
  background: rgba(220, 235, 190, 0.2);
}

@media (max-width: 480px) {
  .flower-icon-wrap { width: 46px; height: 46px; font-size: 20px; }
  .flower-picker { gap: 8px; }
}
```

---

## To-Do 4 — Bunga real visitors: cara render yang benar

> **PENTING:** Jangan ubah apapun dari kode aset bunga yang sudah ada
> (SVG, PNG, emoji, class, style, ukuran render). Hanya koordinat posisi
> dan tooltip label-nya yang boleh diatur ulang sesuai spec di bawah.

Saat real visitors mulai menanam, setiap bunga harus ditampilkan dengan cara yang rapi — tidak overlap sembarangan.

### 4.1 Struktur data bunga

```js
// Struktur tiap bunga yang ditanam visitor
const flower = {
  id: "uuid",
  name: "Fitri",
  date: "May 18, 2026",
  message: "Hello from here!",
  type: "sakura",         // sakura | lavender | daisy | sunflower | babysbreath | forgetmenot | cosmos | rose
  x: 0.45,               // posisi relatif (0–1) bukan pixel absolut
  y: 0.60,               // posisi relatif (0–1)
}
```

**Kenapa pakai posisi relatif (0–1)?** Supaya posisi bunga tetap proporsional saat garden di-resize di berbagai ukuran layar. Kalau pakai pixel absolut, bunga akan bergeser saat viewport berubah.

### 4.2 Render bunga

```js
function renderFlower(flower, gardenEl) {
  const el = document.createElement('div');
  el.className = 'flower-pin';
  el.style.left = `${flower.x * 100}%`;
  el.style.top  = `${flower.y * 100}%`;
  el.innerHTML = `
    <div class="flower-emoji">${getFlowerEmoji(flower.type)}</div>
    <div class="flower-tooltip">
      <span class="tooltip-name">${flower.name}</span>
      <span class="tooltip-date">${flower.date}</span>
    </div>
  `;
  gardenEl.appendChild(el);
}
```

### 4.3 CSS untuk bunga pin

```css
.flower-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 1;
}

.flower-emoji {
  font-size: 24px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.flower-pin:hover .flower-emoji {
  transform: scale(1.2);
}

/* Tooltip muncul saat hover */
.flower-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(45, 74, 30, 0.9);
  color: #faf7f2;
  border-radius: 6px;
  padding: 5px 8px;
  white-space: nowrap;
  pointer-events: none;
}

.flower-pin:hover .flower-tooltip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.tooltip-name {
  font-size: 12px;
  font-weight: 500;
}

.tooltip-date {
  font-size: 10px;
  opacity: 0.8;
}
```

---

## To-Do 5 — Color palette (konsisten dengan homepage)

```css
:root {
  /* Dari homepage — tidak berubah */
  --color-bg:          #faf7f2;
  --color-title:       #2d4a1e;
  --color-accent:      #7a58a8;
  --color-green-dark:  #4e7a30;
  --color-green-mid:   #6b8f4e;
  --color-green-sub:   #5a7040;
  --color-green-light: #9aaf7a;

  /* Tambahan khusus garden page */
  --color-garden-bg:   #f2ede4;  /* background area garden */
  --color-sidebar-bg:  #f5f0e8;  /* background sidebar card */
  --color-flower-hint: #b0c890;  /* teks hint drag garden */
  --color-btn-hover:   #3a5a22;  /* hover state plant button */
}
```

---

## To-Do 6 — Prompt Copilot untuk page ini

```
Redesign the "Leave Your Bloom" page in Astro.
The page uses the same warm palette and fonts as the homepage
(Playfair Display for titles, Inter for everything else).
Background: #faf7f2.

FONT RULE: all font sizes must be multiples of 2.

PAGE STRUCTURE (top to bottom):

1. Top navigation bar:
   - padding: 16px 32px (desktop/tablet), 14px 20px (mobile)
   - border-bottom: 0.5px solid rgba(107,143,78,0.2)
   - Left: "← Back" — Inter 400, 12px, color #6b8f4e
   - Right: "Skip this step →" — Inter 400, 12px, color #9aaf7a

2. Page header (text-align center, padding 28px 24px 20px):
   - Eyebrow: "Welcome, visitor." — Inter 400, 12px, uppercase,
     letter-spacing 0.16em, color #9aaf7a
   - Title: "Leave Your Bloom" — Playfair Display 700,
     48px desktop / 38px tablet / 30px mobile, color #2d4a1e
   - Subtitle: "Plant a flower anywhere in the garden
     and leave a little piece of you here."
     Inter 300, 14px desktop+tablet / 12px mobile, color #5a7040

3. Main layout (CSS grid):
   Desktop + Tablet: grid-template-columns 1fr 280px, gap 20px,
   padding 0 32px 24px, align-items stretch (equal height)
   Android: grid-template-columns 1fr (stack vertically),
   sidebar moves BELOW garden

   LEFT — Garden area:
   - background #f2ede4, border-radius 14px,
     border 1px solid rgba(154,175,122,0.3)
   - min-height: 420px desktop / 360px tablet / 280px mobile
   - position relative, overflow hidden, cursor crosshair
   - Show empty state when no real flowers:
     centered emoji 🌱 + Inter 300 14px text "#9aaf7a"
     "This is our growing garden. Every bloom here was planted
     by someone who visited."
   - Bottom hint: "✦ drag to explore the garden ✦"
     Inter 12px, color #b0c890, position absolute bottom 12px

   RIGHT — Sidebar card:
   - background #f5f0e8, border-radius 12px,
     border 1px solid rgba(154,175,122,0.25), padding 16px
   - Title: "— Your Bloom Story —" 10px uppercase ls 0.14em #9aaf7a
   - Form fields (label 10px uppercase #6b8f4e + input):
     * Name (text input)
     * Today's date (date input, pre-filled)
     * How are you today? (textarea, height 72px,
       placeholder "Share a mood, a thought, or a little message...")
   - Inputs: bg rgba(250,247,242,0.8), border rgba(154,175,122,0.4),
     border-radius 8px, padding 8px 10px, font Inter 300 14px
   - Visitor counter (after hr divider):
     label "You are visitor" 10px uppercase #9aaf7a
     number "No. —" Playfair Display 700 32px #2d4a1e
     thanks "Thank you for being here ♡" Inter 12px italic #9aaf7a

4. Bottom section (padding 4px 32px 32px desktop):
   - Label: "— Choose a flower to plant —"
     Inter 12px uppercase ls 0.14em #9aaf7a, text-align center,
     margin-bottom 14px
   - Flower picker: flexbox centered, gap 10px, flex-wrap wrap
     Each option: circle 52px (border-radius 50%), emoji 22px inside,
     label Inter 12px #6b8f4e below
     Selected state: border-color #6b8f4e, bg rgba(200,219,160,0.3)
     Flowers: Sakura 🌸, Lavender 💜, Daisy 🌼, Sunflower 🌻,
     Baby's Breath 🤍, Forget-me-not 💙, Cosmos 🌺, Rose 🌹
   - CTA button "Plant My Bloom →":
     IDENTIK dengan homepage button — jangan pakai solid bg.
     border: 1px solid #6b8f4e, border-radius 99px,
     background rgba(250,247,242,0.5), color #2d4a1e,
     Inter 400 14px ls 0.05em, padding 10px 28px,
     display block margin auto,
     hover: background rgba(155,175,122,0.15), transition 0.2s ease.
     Flower design assets (SVG/PNG/emoji) tidak boleh diubah —
     hanya posisi dan tooltip label yang diatur ulang.
   - Tagline: "Your bloom will be part of this garden forever."
     Inter 12px italic #9aaf7a, text-align center, margin-top 8px
```

---

## Ringkasan font sizes — kelipatan 2

| Element | Desktop | Tablet | Android |
|---|---|---|---|
| Nav (back/skip) | 12px | 12px | 12px |
| Eyebrow | 12px | 12px | 10px |
| Page title | 48px | 38px | 30px |
| Subtitle | 14px | 14px | 12px |
| Form labels | 10px | 10px | 10px |
| Form inputs | 14px | 14px | 14px |
| Visitor number | 32px | 32px | 28px |
| Flower names | 12px | 12px | 12px |
| CTA button | 14px | 14px | 14px |
| Tagline | 12px | 12px | 12px |

---

## Checklist

- [ ] Hapus semua dummy/hardcoded flower data
- [ ] Buat empty state garden yang welcoming
- [ ] Implementasi posisi bunga relatif (0–1), bukan pixel absolut
- [ ] Ubah grid layout: sidebar ke bawah di Android (≤480px)
- [ ] Sesuaikan semua font sizes ke kelipatan 2
- [ ] Samakan warna sidebar (#f5f0e8) dengan warm palette
- [ ] Visitor counter hanya tampil setelah data real tersedia
- [ ] Flower picker: selected state yang jelas dengan border + bg
- [ ] Garden hint "drag to explore" di posisi absolute bottom
- [ ] Test di tiga breakpoint: 1280px / 768px / 390px

---

*Style mengikuti warm palette dan font rules yang sama dengan homepage.*
