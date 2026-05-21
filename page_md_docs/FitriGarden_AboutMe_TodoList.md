# Fitri's Garden — About Me Page To-Do List
*Redesign spec untuk halaman About Me*
*Style konsisten dengan Home Page, Project Page, dan Intro Page*

---

## Aturan yang tidak boleh diubah

- Font: `Playfair Display` untuk quote dan bio intro, `Inter` untuk semua teks lainnya
- Semua font size kelipatan 2
- Sidebar identik dengan halaman lain — gunakan komponen yang sama
- Background main area: plain `#faf7f2`, no image
- Icon pakai library yang sudah ada di kode aslinya

---

## Masalah yang ditemukan di versi sekarang

1. Background image di main area masih ada — perlu dihapus
2. Section pills (Experience, Organization, dll) belum konsisten dengan warm palette
3. Testimonial cards belum menyatu dengan style kartu di halaman lain
4. Font sizes tidak mengikuti kelipatan 2
5. Spacing antar section tidak konsisten
6. Content area terlalu lebar — perlu `max-width` supaya teks nyaman dibaca

---

## Struktur data — mudah diedit nanti

Karena konten masih akan berubah, simpan semua data di objek JS terpisah
supaya tinggal edit data tanpa menyentuh HTML/CSS.

### Data structure

```js
const aboutData = {
  quote: {
    author: "Steve Jobs once said...",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    response: "They remind me that design lives in how people experience it, and that's what eventually led me to UI/UX."
  },

  bio: {
    intro: "Hi, I'm Fitri Zahwa Januarita, a former illustrator and animator who found a new purpose in UI/UX design.",
    paragraphs: [
      "I've been drawing since I was a kid...",
      "My attention to detail, which once slowed me down...",
      "I still tell stories, only now they're about users..."
    ]
  },

  experience: [
    {
      company: "Fiverr Platform",
      role: "Freelance Illustrator and Animator",
      period: "May 2020 – Present",
      description: "Completed 150+ illustration..."
    },
    // tambah/hapus entry di sini
  ],

  organization: [
    {
      name: "Amikom Computer Club",
      role: null,               // null jika tidak ada role
      period: "Sep 2020 – Dec 2021",
      description: "Collaborated with a team of five..."
    }
  ],

  courses: [
    {
      name: "Harisenin.com",
      role: "UX Design Bootcamp",
      period: "Feb 2025 – Aug 2025",
      description: "Completed a comprehensive UX design bootcamp..."
    },
    {
      name: "Uxcel",
      role: "UI/UX Design Courses",
      period: "Jan 2025 – Jun 2025",
      description: "Completed multiple UI/UX design courses..."
    }
  ],

  testimonials: [
    {
      stars: 5,
      text: "Really great experience working with Fitri Zahwa...",
      name: "Akraal",
      location: "se Sweden"
    },
    // tambah/hapus testimonial di sini
  ]
}
```

**Cara render dari data:**
```js
// Contoh render experience entries
aboutData.experience.forEach(item => {
  // render entry HTML dari data
})
```

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

Identik dengan Project Page:

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
```

---

## To-Do 3 — Content area

```css
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
}

.content-area::-webkit-scrollbar { display: none; }

.content-inner {
  max-width: 640px;         /* supaya teks tidak terlalu lebar */
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .content-area { padding: 24px 32px; }
}

@media (max-width: 480px) {
  .content-area { padding: 20px 20px; }
  .content-inner { max-width: 100%; }
}
```

---

## To-Do 4 — Quote section

```css
.quote-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #9aaf7a;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.blockquote {
  border-left: 2.5px solid rgba(107, 143, 78, 0.4);
  padding-left: 16px;
  margin-bottom: 12px;
  border-radius: 0;         /* no radius on single-sided border */
}

.blockquote p {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;          /* kelipatan 2 */
  font-weight: 700;
  font-style: italic;
  color: #2d4a1e;
  line-height: 1.5;
}

.quote-response {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #5a7040;
  line-height: 1.7;
  margin-bottom: 32px;
}
```

---

## To-Do 5 — Bio section

```css
.bio-intro {
  font-family: 'Inter', sans-serif;
  font-size: 16px;          /* kelipatan 2 */
  font-weight: 500;
  color: #2d4a1e;
  line-height: 1.6;
  margin-bottom: 14px;
}

.bio-body {
  font-family: 'Inter', sans-serif;
  font-size: 14px;          /* kelipatan 2 */
  font-weight: 300;
  color: #5a7040;
  line-height: 1.8;
  margin-bottom: 14px;
}

/* Bold inline project names */
.bio-body strong {
  font-weight: 500;
  color: #2d4a1e;
}
```

---

## To-Do 6 — Section dividers & pills

Tiap section (Experience, Organization, Courses, Testimonials) dipisahkan
dengan divider tipis + pill label di tengah.

```html
<hr class="section-divider">
<div class="section-pill-wrap">
  <span class="section-pill">Experience</span>
</div>
```

```css
.section-divider {
  border: none;
  border-top: 0.5px solid rgba(154, 175, 122, 0.25);
  margin: 28px 0;
}

.section-pill-wrap {
  text-align: center;
  margin-bottom: 20px;
}

.section-pill {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;          /* kelipatan 2 */
  font-weight: 400;
  color: #4e7a30;
  background: rgba(200, 219, 160, 0.25);
  border: 1px solid rgba(107, 143, 78, 0.35);
  border-radius: 99px;
  padding: 5px 16px;
}
```

---

## To-Do 7 — Experience, Organization, Courses entries

Semua tiga section memakai struktur dan style yang sama:

```html
<div class="entry">
  <div class="entry-header">
    <span class="entry-title">Fiverr Platform</span>
    <span class="entry-date">May 2020 – Present</span>
  </div>
  <!-- role opsional — tampilkan hanya jika ada -->
  <div class="entry-role">Freelance Illustrator and Animator</div>
  <p class="entry-desc">...</p>
</div>
```

```css
.entry {
  margin-bottom: 24px;
}

.entry-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 2px;
}

.entry-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;          /* kelipatan 2 */
  font-weight: 500;
  color: #2d4a1e;
}

.entry-date {
  font-family: 'Inter', sans-serif;
  font-size: 12px;          /* kelipatan 2 */
  font-weight: 300;
  color: #9aaf7a;
  white-space: nowrap;
  flex-shrink: 0;
}

.entry-role {
  font-family: 'Inter', sans-serif;
  font-size: 14px;          /* kelipatan 2 */
  font-weight: 300;
  color: #6b8f4e;
  margin-bottom: 4px;
}

.entry-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;          /* kelipatan 2 */
  font-weight: 300;
  color: #5a7040;
  line-height: 1.7;
}

@media (max-width: 480px) {
  /* Di Android, date pindah ke bawah title */
  .entry-header {
    flex-direction: column;
    gap: 2px;
  }
}
```

---

## To-Do 8 — Testimonial cards

```html
<div class="testimonial-eyebrow">
  That's what they said 🩷
</div>

<div class="testimonial-card">
  <div class="t-stars">★★★★★</div>
  <p class="t-quote">"Quote text here..."</p>
  <div class="t-author">
    <div class="t-avatar">A</div>
    <div>
      <p class="t-name">Akraal</p>
      <p class="t-location">🇸🇪 Sweden</p>
    </div>
  </div>
</div>
```

```css
.testimonial-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #9aaf7a;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.testimonial-card {
  background: #ffffff;
  border: 0.5px solid rgba(154, 175, 122, 0.3);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.t-stars {
  color: #e8b94a;
  font-size: 14px;          /* kelipatan 2 */
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.t-quote {
  font-family: 'Inter', sans-serif;
  font-size: 14px;          /* kelipatan 2 */
  font-weight: 300;
  font-style: italic;
  color: #5a7040;
  line-height: 1.7;
  margin-bottom: 14px;
}

.t-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.t-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8dfd4;
  border: 0.5px solid rgba(154, 175, 122, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 12px;          /* kelipatan 2 */
  font-weight: 500;
  color: #6b8f4e;
  flex-shrink: 0;
}

.t-name {
  font-family: 'Inter', sans-serif;
  font-size: 14px;          /* kelipatan 2 */
  font-weight: 500;
  color: #2d4a1e;
  margin-bottom: 2px;
}

.t-location {
  font-family: 'Inter', sans-serif;
  font-size: 12px;          /* kelipatan 2 */
  font-weight: 300;
  color: #9aaf7a;
}
```

---

## To-Do 9 — Responsive

### 9.1 Breakpoints content area

```css
/* Desktop */
.content-area { padding: 32px 48px; }
.content-inner { max-width: 640px; }

/* Tablet */
@media (max-width: 1024px) {
  .content-area { padding: 24px 32px; }
}

/* Android */
@media (max-width: 480px) {
  .content-area { padding: 20px 20px; }
  .content-inner { max-width: 100%; }
  .entry-header { flex-direction: column; gap: 2px; }
}
```

### 9.2 Font sizes per breakpoint — semua kelipatan 2

| Element | Desktop | Tablet | Android |
|---|---|---|---|
| Topbar title | 14px | 14px | 12px |
| Quote (Playfair) | 18px | 18px | 16px |
| Quote response | 14px | 14px | 14px |
| Bio intro | 16px | 16px | 16px |
| Bio body | 14px | 14px | 14px |
| Section pill | 12px | 12px | 12px |
| Entry title | 16px | 16px | 14px |
| Entry date | 12px | 12px | 12px |
| Entry role | 14px | 14px | 12px |
| Entry desc | 14px | 14px | 14px |
| Testimonial quote | 14px | 14px | 14px |
| Testimonial name | 14px | 14px | 14px |

---

## To-Do 10 — Prompt Copilot

```
Redesign the "About Me" page of "Fitri's Garden" portfolio in Astro.
Use the same sidebar component as the other pages.
Style must match the warm palette used throughout the site.

FONT RULE: all font sizes must be multiples of 2.
BACKGROUND: plain #faf7f2, no image.

PAGE LAYOUT: same as Project Page — sidebar left (240px) + main right.

TOPBAR: same structure as Project Page.
- "About Me" (Inter 500 14px #2d4a1e) + "Who I am" (Inter 400 14px #9aaf7a)

CONTENT AREA (flex 1, overflow-y auto, padding 32px 48px desktop):
- content-inner: max-width 640px, margin 0 auto

CONTENT SECTIONS (top to bottom):

1. QUOTE SECTION:
   - Eyebrow: "Steve Jobs once said..." Inter 500 10px uppercase ls 0.14em #9aaf7a
   - Blockquote: border-left 2.5px solid rgba(107,143,78,0.4), pl 16px, radius 0
     Playfair Display 700 italic 18px #2d4a1e line-height 1.5
   - Response text: Inter 300 14px #5a7040 line-height 1.7, mb 32px

2. BIO SECTION:
   - Intro paragraph: Inter 500 16px #2d4a1e line-height 1.6, mb 14px
   - Body paragraphs: Inter 300 14px #5a7040 line-height 1.8, mb 14px
   - Inline project names bold: font-weight 500, color #2d4a1e

3. EACH SECTION (Experience / Organization / Courses / Certifications):
   - Divider: hr, border-top 0.5px solid rgba(154,175,122,0.25), margin 28px 0
   - Pill: inline-block, Inter 400 12px color #4e7a30,
     bg rgba(200,219,160,0.25), border 1px solid rgba(107,143,78,0.35),
     border-radius 99px, padding 5px 16px, text-align center, mb 20px
   - Entries: title (Inter 500 16px #2d4a1e) + date (Inter 300 12px #9aaf7a)
     in flex row space-between, role (Inter 300 14px #6b8f4e), desc (Inter 300 14px #5a7040)
     mb 24px per entry

4. TESTIMONIALS SECTION:
   - Eyebrow: Inter 500 10px uppercase ls 0.14em #9aaf7a + 🩷
   - Each card: bg #ffffff, border 0.5px solid rgba(154,175,122,0.3),
     border-radius 12px, padding 16px 18px, mb 14px
   - Stars: color #e8b94a, font-size 14px, mb 10px
   - Quote text: Inter 300 italic 14px #5a7040 line-height 1.7, mb 14px
   - Author: avatar circle 32px (bg #e8dfd4, initial letter Inter 500 12px #6b8f4e)
     + name (Inter 500 14px #2d4a1e) + location (Inter 300 12px #9aaf7a)

DATA STRUCTURE: store all content in a JS data object (quote, bio, experience[],
organization[], courses[], testimonials[]) and render from it, so content
can be updated without touching HTML/CSS.

RESPONSIVE:
- Tablet (≤1024px): content padding 24px 32px
- Android (≤480px): content padding 20px, entry-header flex-direction column

Google Fonts: Playfair Display (700, 700italic) + Inter (300, 400, 500)
```

---

## Ringkasan font sizes — kelipatan 2

| Element | Font | Size |
|---|---|---|
| Quote | Playfair Display 700 italic | 18px |
| Bio intro | Inter 500 | 16px |
| Bio body | Inter 300 | 14px |
| Entry title | Inter 500 | 16px |
| Entry date | Inter 300 | 12px |
| Entry role | Inter 300 | 14px |
| Entry desc | Inter 300 | 14px |
| Section pill | Inter 400 | 12px |
| Testimonial quote | Inter 300 italic | 14px |
| Testimonial name | Inter 500 | 14px |
| Testimonial location | Inter 300 | 12px |

---

## Checklist

- [ ] Hapus background image dari main area
- [ ] Gunakan komponen Sidebar yang sama dengan halaman lain
- [ ] Pindahkan semua konten ke data object JS
- [ ] Quote: Playfair italic + border-left, radius 0
- [ ] Section pills: rounded pill, warm green palette
- [ ] Entry date: `white-space: nowrap` supaya tidak wrap
- [ ] Entry header: `flex-direction: column` di Android
- [ ] Testimonial cards: style konsisten dengan Project cards
- [ ] `max-width: 640px` di content-inner untuk readability
- [ ] Font sizes semua kelipatan 2
- [ ] Test breakpoint tablet (1024px) dan Android (480px)
- [ ] Test scroll: sidebar footer tetap di bawah

---

*Style konsisten dengan Home Page, Project Page, dan Intro Page.*
