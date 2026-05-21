# Fitri's Garden — Home Page To-Do List
*Redesign spec untuk halaman home yang sebenarnya — sidebar + mind map*
*Style konsisten dengan intro page dan Leave Your Bloom page*

---

## Konteks & Aturan Tidak Boleh Diubah

- Font: `Playfair Display` untuk nama, `Inter` untuk semua teks lainnya
- Semua font size kelipatan 2
- Warm palette: background `#faf7f2`, sidebar `#f5f0e8`
- Background image dihapus — diganti warna plain
- Button style (jika ada): outline pill identik dengan intro page
- Mind map jangan diubah stylenya — hanya font size yang diperbesar
- Grid background mind map dipertahankan dari kode aslinya

---

## Masalah yang ditemukan di versi sekarang

1. Background image di main area terlalu ramai, perlu diganti warna plain
2. Sidebar warna putih tidak menyatu dengan warm palette
3. "Find me at" tenggelam ke bawah, perlu naik mengikuti konten
4. "All systems operational" harus selalu fixed di bottom sidebar
5. Spacing nav items tidak konsisten — perlu disesuaikan seperti foto mobile
6. Font sizes tidak konsisten dan tidak mengikuti kelipatan 2
7. Avatar photo placeholder terlalu plain (icon abu-abu)
8. Font size teks di mind map terlalu kecil — perlu diperbesar

---

## Breakpoints

```
Desktop:  min-width 1025px
Tablet:   481px – 1024px
Android:  max-width 480px  → sidebar berubah jadi bottom nav atau drawer
```

---

## To-Do 1 — Hapus background image, ganti warna plain

```css
.main-area {
  background: #faf7f2;        /* warm cream — BUKAN image */
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Hapus semua ini jika ada: */
/* background-image: url(...) */
/* background-size: cover */
/* background-position: center */
```

---

## To-Do 2 — Sidebar: struktur, warna, dan layout

### 2.1 Struktur sidebar — KUNCI "Find me at" naik + status fixed

Sidebar dibagi dua bagian:
- `.sidebar-scroll` → flex: 1, overflow-y: auto, berisi semua konten yang bisa scroll
- `.sidebar-footer` → fixed di bottom, selalu terlihat di viewport

```html
<aside class="sidebar">

  <!-- Bagian scroll: profil + nav + find me at -->
  <div class="sidebar-scroll">
    <div class="avatar-wrap">...</div>
    <h1 class="sidebar-name">Fitri Zahwa</h1>
    <p class="sidebar-role">UI/UX Designer,<br>Illustrator, Pixel Artist</p>
    <p class="sidebar-bio">...</p>

    <p class="section-label">Explore</p>
    <ul class="nav-list">...</ul>

    <!-- "Find me at" ikut naik, langsung setelah nav -->
    <p class="section-label">Find me at</p>
    <ul class="social-list">...</ul>
  </div>

  <!-- Footer: SELALU di bawah viewport, tidak ikut scroll -->
  <div class="sidebar-footer">
    <div class="clock" id="clock">06:29:58 PM</div>
    <div class="status-row">
      <span class="status-dot"></span>
      <span class="status-text">All systems operational</span>
    </div>
  </div>

</aside>
```

### 2.2 CSS sidebar

```css
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #ffffff;
  border-right: 0.5px solid rgba(154, 175, 122, 0.3);
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;

  /* Desktop */
}

.sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px 16px;
  /* "Find me at" otomatis ikut naik karena
     tidak ada spacer/flex-grow di antara nav dan social */
}

/* Sembunyikan scrollbar tapi tetap scrollable */
.sidebar-scroll::-webkit-scrollbar { display: none; }
.sidebar-scroll { scrollbar-width: none; }

.sidebar-footer {
  padding: 12px 16px;
  border-top: 0.5px solid rgba(154, 175, 122, 0.2);
  background: #ffffff;
  flex-shrink: 0;          /* tidak ikut mengecil */
}

@media (max-width: 1024px) {
  .sidebar { width: 220px; min-width: 220px; }
}

@media (max-width: 480px) {
  /* Sidebar jadi bottom navigation di Android */
  .sidebar {
    width: 100%;
    height: auto;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    flex-direction: row;
    border-right: none;
    border-top: 0.5px solid rgba(154, 175, 122, 0.3);
    z-index: 100;
  }
  .sidebar-scroll { display: none; }
  .sidebar-footer { border-top: none; }
}
```

---

## To-Do 3 — Typography sidebar: semua kelipatan 2

### 3.1 Nama

```css
.sidebar-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;           /* Desktop */
  font-weight: 700;
  color: #2d4a1e;
  margin-bottom: 4px;
  line-height: 1.2;
}

@media (max-width: 1024px) {
  .sidebar-name { font-size: 20px; }
}
```

### 3.2 Role / jabatan

```css
.sidebar-role {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #6b8f4e;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.6;
  margin-bottom: 10px;
}
```

### 3.3 Bio

```css
.sidebar-bio {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #5a7040;
  line-height: 1.6;
  margin-bottom: 20px;
}
```

### 3.4 Section labels ("EXPLORE", "FIND ME AT")

```css
.section-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #9aaf7a;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
  margin-top: 4px;
}
```

### 3.5 Nav items — mengikuti style foto mobile (image 2)

Perhatikan di foto mobile: nav item punya icon + label + arrow, dengan active state background hijau muda rounded.

```css
.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #5a7040;
  cursor: pointer;
  transition: background 0.15s ease;
  text-decoration: none;
}

.nav-item:hover {
  background: rgba(200, 219, 160, 0.15);
}

/* Active state */
.nav-item.active {
  background: rgba(200, 219, 160, 0.35);
  color: #2d4a1e;
  font-weight: 500;
}

/* Gunakan icon library yang SUDAH ADA di kode aslinya.
   Jangan import library baru atau ganti icon. */
.nav-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b8f4e;
  font-size: 16px;
  flex-shrink: 0;
}

/* Icon active state */
.nav-item.active .nav-icon {
  color: #4e7a30;
}

.nav-arrow {
  margin-left: auto;
  font-size: 12px;
  color: #9aaf7a;
}
```

### 3.6 Social links ("Find me at")

```css
.social-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.social-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #5a7040;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.15s ease;
}

.social-item:hover {
  color: #2d4a1e;
}

.social-icon {
  width: 16px;
  height: 16px;
  color: #6b8f4e;
  font-size: 14px;
  flex-shrink: 0;
}
```

### 3.7 Clock + status footer

```css
.clock {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #2d4a1e;
  margin-bottom: 4px;
  font-variant-numeric: tabular-nums;  /* supaya angka tidak bergeser saat update */
}

.status-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6b8f4e;
  flex-shrink: 0;
}

.status-text {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #4e7a30;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### 3.8 Clock: live update dengan JS

```js
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hStr = String(h).padStart(2, '0');
  document.getElementById('clock').textContent = `${hStr}:${m}:${s} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000);
```

---

## To-Do 4 — Avatar

### 4.1 Kalau sudah ada foto

```css
.avatar-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #9aaf7a;
  margin-bottom: 12px;
  position: relative;
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Online indicator dot */
.avatar-wrap::after {
  content: '';
  position: absolute;
  bottom: 2px; right: 2px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #6b8f4e;
  border: 2px solid #ffffff;
}
```

### 4.2 Kalau belum ada foto (placeholder)

```css
.avatar-placeholder {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #e8dfd0;
  border: 2px solid #9aaf7a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
  color: #9aaf7a;
}
```

---

## To-Do 5 — Mind map: hanya perbaiki ukuran font

> **PENTING:** Jangan ubah apapun dari style mind map yang sudah ada
> (warna lingkaran, warna garis, stroke, fill, logika drag, posisi node).
> Hanya font size yang diperbesar — sesuaikan di class/attribute
> yang sudah ada di kode aslinya.

### 5.1 Font size node label (nama node: About, Resume, dll)

Cari selector font/text yang sudah ada di kode mind map, naikkan ukurannya:

| Element | Sebelum (estimasi) | Sesudah |
|---|---|---|
| Node label (nama) | ~10px atau 11px | **14px** |
| Node number (01, 02...) | ~9px atau 10px | **12px** |
| Center label (Fitri Zahwa) | ~11px atau 12px | **14px** |
| Center sublabel (Indonesia) | ~9px atau 10px | **12px** |

Semua font size harus kelipatan 2. Jangan ubah font-family, fill color,
text-anchor, atau properti lain — hanya `font-size`.

### 5.2 Drag hint

```css
.drag-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #b0c890;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
}
```

---

## To-Do 6 — Page layout keseluruhan

```css
/* Wrapper utama */
.page-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #faf7f2;
}

/* Main content area */
.main-area {
  flex: 1;
  background: #faf7f2;   /* plain warm cream, no image */
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## To-Do 7 — Prompt Copilot

```
Redesign the homepage layout of "Fitri's Garden" portfolio.
This is the real homepage — it has a sidebar on the left and
a mind map in the center. Style must match the intro page
and Leave Your Bloom page (same warm palette and fonts).

FONT RULE: all font sizes must be multiples of 2.
BACKGROUND RULE: remove all background images — use plain #faf7f2.

OVERALL LAYOUT:
- display: flex, height: 100vh, overflow: hidden
- Left: sidebar (width 240px desktop / 220px tablet)
- Right: main area (flex: 1, background #faf7f2)

SIDEBAR STRUCTURE (display flex, flex-direction column, height 100vh):
- background: #f5f0e8
- border-right: 0.5px solid rgba(154,175,122,0.3)

  TOP SCROLLABLE AREA (.sidebar-scroll, flex: 1, overflow-y auto,
  padding 20px 16px, hide scrollbar):
    1. Avatar (52px circle, border 2px solid #9aaf7a, mb 12px)
       with green online dot (10px, absolute bottom-right)
    2. Name "Fitri Zahwa"
       Playfair Display 700, 22px, color #2d4a1e
    3. Role "UI/UX Designer, Illustrator, Pixel Artist"
       Inter 400, 10px, uppercase, ls 0.1em, color #6b8f4e
    4. Bio paragraph
       Inter 300, 12px, color #5a7040, line-height 1.6, mb 20px
    5. Section label "EXPLORE"
       Inter 500, 10px, uppercase, ls 0.12em, color #9aaf7a, mb 8px
    6. Nav list (gap 2px):
       Use icons already in the existing codebase — do not import new ones.
       Each item: icon (16px, color #6b8f4e) + label (Inter 400 14px
       color #5a7040) + arrow → (12px color #9aaf7a, margin-left auto)
       padding 8px 10px, border-radius 8px
       hover: bg rgba(200,219,160,0.2)
       ACTIVE state: bg rgba(200,219,160,0.35), color #2d4a1e, fw 500
       hover: bg rgba(200,219,160,0.15)
       Items: Home (active), Project, About Me, Resume, Visitor Gallery
    7. Section label "FIND ME AT" (same style, mt 4px)
    8. Social list (gap 8px):
       Each: icon (14px #6b8f4e) + label (Inter 400 12px #5a7040)
       Items: Email, LinkedIn, GitHub, Instagram

  BOTTOM FOOTER (.sidebar-footer, flex-shrink 0, padding 12px 16px,
  border-top 0.5px solid rgba(154,175,122,0.2), bg #f5f0e8):
    - Live clock: Inter 400 14px color #2d4a1e, tabular-nums
      updated every second with JS
    - Status row: green dot (7px circle #6b8f4e) +
      "All systems operational" Inter 500 10px uppercase
      ls 0.1em color #4e7a30

MAIN AREA (flex: 1, background #faf7f2, position relative):
  - PERTAHANKAN grid background yang sudah ada di kode aslinya
    (jangan hapus atau ganti — hanya pastikan warnanya #faf7f2)
  - Mind map centered, DO NOT change any existing styles
    (colors, strokes, fills, node sizes, drag logic)
  - ONLY increase font sizes in existing text elements:
    node labels → 14px, node numbers → 12px,
    center label → 14px, center sublabel → 12px
  - Use existing icon library already in the codebase — do not
    replace or import new icons
  - Drag hint: keep existing style, ensure font-size is 10px

Google Fonts: Playfair Display (700) + Inter (300, 400, 500)
```

---

## Ringkasan font sizes — kelipatan 2

| Element | Desktop | Tablet |
|---|---|---|
| Nama (Playfair) | 22px | 20px |
| Role / jabatan | 10px | 10px |
| Bio | 12px | 12px |
| Section labels | 10px | 10px |
| Nav items | 14px | 14px |
| Social items | 12px | 12px |
| Clock | 14px | 14px |
| Status text | 10px | 10px |
| Node label | 12px | 12px |
| Node number | 10px | 10px |

---

## Color palette (konsisten dengan semua page)

```css
:root {
  --color-bg:           #faf7f2;   /* main background */
  --color-sidebar-bg:   #ffffff;   /* sidebar background — putih */
  --color-title:        #2d4a1e;   /* judul, nama */
  --color-green-dark:   #4e7a30;   /* status dot, active icon */
  --color-green-mid:    #6b8f4e;   /* icon, role text */
  --color-green-sub:    #5a7040;   /* bio, nav item, social */
  --color-green-light:  #9aaf7a;   /* divider, nav arrow */
  --color-green-muted:  #b0c890;   /* node number, drag hint */
  --color-nav-active:   rgba(200, 219, 160, 0.35);
  --color-nav-hover:    rgba(200, 219, 160, 0.15);
}
```

---

## Checklist

- [ ] Hapus background image dari main area, ganti `background: #faf7f2`
- [ ] Pertahankan grid background yang sudah ada di kode aslinya
- [ ] Ubah sidebar background ke `#f5f0e8`
- [ ] Pisahkan sidebar jadi `.sidebar-scroll` + `.sidebar-footer`
- [ ] `.sidebar-footer` dengan `flex-shrink: 0` — selalu di bottom
- [ ] "Find me at" langsung setelah nav list di `.sidebar-scroll`
- [ ] Live clock dengan JS `setInterval` setiap 1 detik
- [ ] Nav items: active state dengan rounded bg hijau muda
- [ ] Nav items: icon + label + arrow sesuai foto mobile
- [ ] Naikkan font size node label mind map ke 14px (jangan ubah style lain)
- [ ] Naikkan font size node number ke 12px
- [ ] Drag hint di bottom main area
- [ ] Test: scroll sidebar — footer tetap terlihat di bawah
- [ ] Test breakpoint tablet (1024px) — sidebar mengecil ke 220px
- [ ] Font sizes semua kelipatan 2

---

*Style konsisten dengan intro page (Fitri's Garden hero) dan Leave Your Bloom page.*
