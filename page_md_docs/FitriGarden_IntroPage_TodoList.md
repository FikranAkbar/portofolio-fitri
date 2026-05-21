# Fitri's Garden — Intro Page To-Do List
*Design spec lengkap + responsive untuk dikerjakan dengan Google Copilot di VS Code + Astro*

---

## Reference Image

![Fitri's Garden Homepage Reference](./FitriGarden_Homepage_Reference.png)

*Reference mockup homepage Fitri's Garden — warm palette, plain background, Playfair Display + Inter.*

---

## Google Fonts — pasang ini dulu sebelum apapun

Tambahkan di `<head>` layout utama Astro (biasanya `src/layouts/BaseLayout.astro`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
```

**Dua font yang dipakai:**
- `Playfair Display` → judul "Fitri's" dan "Garden". Serif klasik, cocok untuk kesan botanical/editorial yang elegant.
- `Inter` → semua teks lainnya (eyebrow, subtitle, button, nav). Sans-serif screen-optimized, kontras bersih dengan Playfair.

---

## Breakpoint System

```css
/* Android / small mobile: max-width 480px        */
/* Tablet:                  481px – 1024px         */
/* Desktop:                 min-width 1025px       */
```

---

## Aturan font size — semua kelipatan 2

Semua ukuran font mengikuti skala kelipatan 2. Tidak ada nilai ganjil.

---

## To-Do 1 — Typography Responsive

### 1.1 Eyebrow — "WELCOME TO"

| Breakpoint | Font size |
|---|---|
| Desktop (≥1025px) | `14px` |
| Tablet (481–1024px) | `12px` |
| Android (≤480px) | `10px` |

```css
.eyebrow {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.18em;
  color: #6b8f4e;
  text-transform: uppercase;
  margin-bottom: 10px;

  font-size: 14px;          /* Desktop */
}

@media (max-width: 1024px) {
  .eyebrow {
    font-size: 12px;        /* Tablet */
    letter-spacing: 0.15em;
  }
}

@media (max-width: 480px) {
  .eyebrow {
    font-size: 10px;        /* Android */
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }
}
```

### 1.2 Main title — "Fitri's"

| Breakpoint | Font size |
|---|---|
| Desktop (≥1025px) | `74px` |
| Tablet (481–1024px) | `54px` |
| Android (≤480px) | `38px` |

```css
.title-main {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-style: normal;
  color: #2d4a1e;
  line-height: 1.0;
  margin: 0;

  font-size: 74px;          /* Desktop */
}

@media (max-width: 1024px) {
  .title-main { font-size: 54px; }   /* Tablet */
}

@media (max-width: 480px) {
  .title-main { font-size: 38px; }   /* Android */
}
```

### 1.3 Italic title — "Garden"

| Breakpoint | Font size |
|---|---|
| Desktop (≥1025px) | `78px` |
| Tablet (481–1024px) | `58px` |
| Android (≤480px) | `42px` |

```css
.title-italic {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-style: italic;
  color: #7a58a8;
  line-height: 1.0;

  font-size: 78px;          /* Desktop */
  margin: 0 0 16px 0;
}

@media (max-width: 1024px) {
  .title-italic { font-size: 58px; margin: 0 0 14px 0; }  /* Tablet */
}

@media (max-width: 480px) {
  .title-italic { font-size: 42px; margin: 0 0 12px 0; }  /* Android */
}
```

### 1.4 Divider ornament

```css
.divider-line {
  height: 1px;
  background: #9aaf7a;

  width: 48px;              /* Desktop */
  margin: 0 auto 16px;
}

@media (max-width: 1024px) {
  .divider-line { width: 40px; margin: 0 auto 14px; }
}

@media (max-width: 480px) {
  .divider-line { width: 32px; margin: 0 auto 12px; }
}
```

### 1.5 Subtitle

| Breakpoint | Font size | Line height |
|---|---|---|
| Desktop (≥1025px) | `16px` | `1.7` |
| Tablet (481–1024px) | `14px` | `1.65` |
| Android (≤480px) | `14px` | `1.6` |

```css
.subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  color: #5a7040;
  letter-spacing: 0.01em;
  text-align: center;
  margin-bottom: 24px;

  font-size: 16px;          /* Desktop */
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .subtitle { font-size: 14px; line-height: 1.65; margin-bottom: 20px; }
}

@media (max-width: 480px) {
  .subtitle { font-size: 14px; line-height: 1.6; margin-bottom: 18px; padding: 0 8px; }
}
```

### 1.6 CTA Button

| Breakpoint | Font size | Padding |
|---|---|---|
| Desktop (≥1025px) | `16px` | `10px 28px` |
| Tablet (481–1024px) | `14px` | `8px 24px` |
| Android (≤480px) | `14px` | `8px 22px` |

```css
.cta-button {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #2d4a1e;
  border: 1px solid #6b8f4e;
  border-radius: 99px;
  background: rgba(250, 247, 242, 0.5);
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s ease;

  font-size: 16px;          /* Desktop */
  padding: 10px 28px;
}

.cta-button:hover {
  background: rgba(155, 175, 122, 0.15);
}

@media (max-width: 1024px) {
  .cta-button { font-size: 14px; padding: 8px 24px; }
}

@media (max-width: 480px) {
  .cta-button { font-size: 14px; padding: 8px 22px; }
}
```

### 1.7 Nav items

| Breakpoint | Font size |
|---|---|
| Desktop (≥1025px) | `14px` |
| Tablet (481–1024px) | `12px` |
| Android (≤480px) | `10px` |

```css
.nav-logo, .nav-skip {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  text-transform: uppercase;

  font-size: 14px;          /* Desktop */
  letter-spacing: 0.12em;
}

@media (max-width: 1024px) {
  .nav-logo, .nav-skip { font-size: 12px; letter-spacing: 0.10em; }
}

@media (max-width: 480px) {
  .nav-logo, .nav-skip { font-size: 10px; letter-spacing: 0.08em; }
}
```

---

## To-Do 2 — Layout Responsive

```css
.hero {
  width: 100%;
  background-color: #faf7f2;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

@media (max-width: 480px) {
  .hero { min-height: 100svh; }
}

.hero-content {
  position: relative; z-index: 1;
  text-align: center;
  display: flex; flex-direction: column; align-items: center;
  max-width: 600px; padding: 0 24px;   /* Desktop */
}

@media (max-width: 1024px) {
  .hero-content { max-width: 520px; padding: 0 32px; }
}

@media (max-width: 480px) {
  .hero-content { max-width: 100%; padding: 0 20px; }
}

.nav {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  z-index: 2;
  padding: 20px 32px;      /* Desktop */
}

@media (max-width: 1024px) {
  .nav { padding: 18px 28px; }
}

@media (max-width: 480px) {
  .nav { padding: 16px 20px; }
}
```

**Z-index stack:**
1. Background `#faf7f2` — z-index: 0
2. Hero content — z-index: 1
3. Nav bar — z-index: 2

---

## To-Do 3 — Color Palette (CSS variables)

```css
:root {
  --color-bg:          #faf7f2;  /* background — warm cream */
  --color-title:       #2d4a1e;  /* judul utama — dark forest green */
  --color-accent:      #7a58a8;  /* italic title — purple */
  --color-green-dark:  #4e7a30;  /* green gelap */
  --color-green-mid:   #6b8f4e;  /* eyebrow, border button, nav */
  --color-green-sub:   #5a7040;  /* subtitle */
  --color-green-light: #9aaf7a;  /* divider, skip nav */
}
```

---

## To-Do 4 — Prompt Copilot (complete)

```
Create a fully responsive Astro component called HeroSection.astro
for a portfolio website called "Fitri's Garden".

RULE: All font sizes must be multiples of 2 (8, 10, 12, 14, 16... etc).

Three breakpoints:
- Desktop: min-width 1025px
- Tablet: 481px to 1024px
- Android/Mobile: max-width 480px

Base layout:
- Full viewport height (100vh desktop/tablet, 100svh mobile)
- Background color: #faf7f2 (plain warm cream, no pattern)
- Centered content with flexbox, overflow hidden

Navigation bar (position absolute, top, full width):
- padding: 20px 32px / 18px 28px / 16px 20px
- Left: "fitri.world" — Inter 400, uppercase
- Right: "Skip intro →" — Inter 400, color #9aaf7a
- Font: 14px / 12px / 10px
- letter-spacing: 0.12em / 0.10em / 0.08em
- color logo: #6b8f4e

Hero content (centered, flex column, align-items center):
- max-width: 600px / 520px / 100%
- padding: 0 24px / 0 32px / 0 20px

Content inside hero (top to bottom):
1. Eyebrow "— Welcome to —"
   Inter 400, uppercase, color #6b8f4e
   Font: 14px / 12px / 10px
   letter-spacing: 0.18em / 0.15em / 0.12em
   margin-bottom: 10px / 10px / 8px

2. "Fitri's" — Playfair Display 700 normal
   Font: 74px / 54px / 38px
   color #2d4a1e, line-height 1.0, margin 0

3. "Garden" — Playfair Display 700 italic
   Font: 78px / 58px / 42px
   color #7a58a8, line-height 1.0
   margin-bottom: 16px / 14px / 12px

4. Thin divider div:
   width: 48px / 40px / 32px
   height 1px, background #9aaf7a
   margin: 0 auto 16px / 14px / 12px

5. Subtitle "There are stories waiting to be shaped,
   why not begin with mine and build something together?"
   Inter 300, color #5a7040, text-align center, letter-spacing 0.01em
   Font: 16px / 14px / 14px
   line-height: 1.7 / 1.65 / 1.6
   margin-bottom: 24px / 20px / 18px

6. CTA button "Start the Journey →"
   Inter 400, color #2d4a1e
   letter-spacing 0.05em
   border: 1px solid #6b8f4e, border-radius: 99px
   background: rgba(250,247,242,0.5)
   hover: background rgba(155,175,122,0.15), transition 0.2s ease
   Font: 16px / 14px / 14px
   padding: 10px 28px / 8px 24px / 8px 22px

Google Fonts: Playfair Display (700, 700italic) + Inter (300, 400, 500)
```

---

## Ringkasan ukuran font per breakpoint

| Element | Desktop ≥1025px | Tablet 481–1024px | Android ≤480px |
|---|---|---|---|
| Eyebrow | 14px | 12px | 10px |
| "Fitri's" | 74px | 54px | 38px |
| "Garden" | 78px | 58px | 42px |
| Subtitle | 16px | 14px | 14px |
| CTA button | 16px | 14px | 14px |
| Nav | 14px | 12px | 10px |
| min-height | 100vh | 100vh | 100svh |

---

## Checklist

- [ ] Pasang Google Fonts (Playfair Display + Inter) di layout utama
- [ ] Simpan CSS variables di `global.css`
- [ ] Buat `HeroSection.astro` menggunakan prompt di To-Do 4
- [ ] Test di Chrome DevTools — cek ketiga breakpoint (1280px / 768px / 390px)
- [ ] Cek `100svh` di Android Chrome
- [ ] Verifikasi semua font size adalah kelipatan 2 sebelum deploy
- [ ] (Opsional) Tambahkan `&display=swap` di Google Fonts URL untuk performa

---

*Semua font size mengikuti aturan kelipatan 2. Warm palette dipertahankan.*
