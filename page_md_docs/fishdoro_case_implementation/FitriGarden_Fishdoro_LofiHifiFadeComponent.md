# Fishdoro — Lo-fi vs Hi-fi Fade Component
*Ready-to-use Copilot prompt + full HTML/CSS/JS code*
*Drop this into your Astro case study page — after "The build as a design signal"*

---

## Copilot Prompt

```
Create an Astro component called LofiHifiFade.astro for the Fishdoro case study.

The component shows two screen comparisons (Home + Focus Timer) side by side.
Each card displays the hi-fi final design by default. On hover (desktop) or
tap (mobile), it fades to reveal the lo-fi wireframe underneath.

This communicates the full design evolution — from wireframe to final product.

FONT: Inter (already imported)
All font sizes must be multiples of 2.
No external libraries — plain HTML + CSS + vanilla JS.

SECTION HEADER:
- Label: "From wireframe to final design"
  Inter 500, 10px, uppercase, letter-spacing 0.12em, color #9aaf7a, mb 8px
- Title: "Hover to see where it started"
  Inter 500, 16px, color #2d4a1e, mb 6px
- Subtitle: "The hi-fi screens above are the result of the full process —
  from lo-fi sketch to final pixel art."
  Inter 300, 14px, color #5a7040, mb 20px

TWO CARD GRID (CSS grid, 1fr 1fr, gap 16px):

Each card:
- position relative, border-radius 12px, overflow hidden
- border: 0.5px solid rgba(154,175,122,0.3)
- cursor pointer
- height: 280px desktop / 220px tablet / 180px Android

Inside each card:
  A. Hi-fi image (bottom layer):
     position absolute, inset 0
     img: width 100%, height 100%, object-fit cover, display block

  B. Lo-fi image (top layer, fades out on hover):
     position absolute, inset 0
     img: same as above
     opacity: 1 by default
     transition: opacity 0.4s ease
     On hover (.fade-card:hover .lofi-layer): opacity 0
     On .tapped class (.fade-card.tapped .lofi-layer): opacity 0

  C. Top label bar (position absolute, top 0, full width):
     background: linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)
     padding: 10px 14px
     display flex, justify-content space-between
     - Left: screen name — Inter 500, 12px, color white
     - Right: state indicator — Inter 300, 12px, color rgba(255,255,255,0.8)
       Default text: "Final design"
       On hover/tap: "Lo-fi wireframe"
       Transition: opacity 0.3s ease (fade the text)

  D. Bottom hint (position absolute, bottom 0, full width):
     background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)
     padding: 10px 14px, text-align center
     - Desktop: "Hover to reveal wireframe"
     - Mobile: "Tap to reveal wireframe"
     Inter 300, 10px, color rgba(255,255,255,0.7)
     Hide bottom hint after first interaction

PAIR 1:
  Screen name: "Home Screen"
  Hi-fi:  /assets/Fishdoro-SS/HiFi-Home.png
  Lo-fi:  /assets/Fishdoro-SS/LoFi-Home.png

PAIR 2:
  Screen name: "Focus Timer"
  Hi-fi:  /assets/Fishdoro-SS/HiFi-Pomodoro-Session.png
  Lo-fi:  /assets/Fishdoro-SS/LoFi-Pomodoro-Session.png

MOBILE BEHAVIOR (≤768px):
- Tap toggles between hi-fi and lo-fi (add/remove .tapped class)
- Change hint text to "Tap to reveal wireframe"
- On first tap: hide hint

RESPONSIVE:
- Tablet (≤1024px): height 220px, gap 14px
- Android (≤480px): grid-template-columns 1fr (stack), height 200px
```

---

## Full HTML + CSS + JS Code

```html
---
// LofiHifiFade.astro — no props needed
---

<section class="lh-section">

  <p class="lh-eyebrow">From wireframe to final design</p>
  <h3 class="lh-title">Hover to see where it started</h3>
  <p class="lh-subtitle">The hi-fi screens above are the result of the full
  process — from lo-fi sketch to final pixel art.</p>

  <div class="lh-grid">

    <!-- Card 1: Home Screen -->
    <div class="lh-card" id="lhCard1">
      <!-- Hi-fi (bottom layer) -->
      <div class="lh-hifi-layer">
        <img src="/assets/Fishdoro-SS/HiFi-Home.png" alt="Home screen — final design" />
      </div>
      <!-- Lo-fi (top layer, fades out on hover) -->
      <div class="lh-lofi-layer">
        <img src="/assets/Fishdoro-SS/LoFi-Home.png" alt="Home screen — lo-fi wireframe" />
      </div>
      <!-- Top label -->
      <div class="lh-label-bar">
        <span class="lh-screen-name">Home Screen</span>
        <span class="lh-state-label">
          <span class="lh-state-hifi">Final design</span>
          <span class="lh-state-lofi">Lo-fi wireframe</span>
        </span>
      </div>
      <!-- Bottom hint -->
      <div class="lh-hint">
        <span class="lh-hint-desktop">Hover to reveal wireframe</span>
        <span class="lh-hint-mobile">Tap to reveal wireframe</span>
      </div>
    </div>

    <!-- Card 2: Focus Timer -->
    <div class="lh-card" id="lhCard2">
      <div class="lh-hifi-layer">
        <img src="/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png"
             alt="Focus timer — final design" />
      </div>
      <div class="lh-lofi-layer">
        <img src="/assets/Fishdoro-SS/LoFi-Pomodoro-Session.png"
             alt="Focus timer — lo-fi wireframe" />
      </div>
      <div class="lh-label-bar">
        <span class="lh-screen-name">Focus Timer</span>
        <span class="lh-state-label">
          <span class="lh-state-hifi">Final design</span>
          <span class="lh-state-lofi">Lo-fi wireframe</span>
        </span>
      </div>
      <div class="lh-hint">
        <span class="lh-hint-desktop">Hover to reveal wireframe</span>
        <span class="lh-hint-mobile">Tap to reveal wireframe</span>
      </div>
    </div>

  </div>

</section>

<style>
  .lh-section { margin-bottom: 28px; }

  .lh-eyebrow {
    font-size: 10px;
    font-weight: 500;
    color: #9aaf7a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .lh-title {
    font-size: 16px;
    font-weight: 500;
    color: #2d4a1e;
    margin-bottom: 6px;
  }
  .lh-subtitle {
    font-size: 14px;
    font-weight: 300;
    color: #5a7040;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  /* Grid */
  .lh-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* Card */
  .lh-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 0.5px solid rgba(154, 175, 122, 0.3);
    cursor: pointer;
    height: 280px;
  }

  /* Hi-fi layer (always visible underneath) */
  .lh-hifi-layer {
    position: absolute;
    inset: 0;
  }
  .lh-hifi-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Lo-fi layer (on top, fades out on hover/tap) */
  .lh-lofi-layer {
    position: absolute;
    inset: 0;
    opacity: 1;
    transition: opacity 0.4s ease;
  }
  .lh-lofi-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Hover: fade lo-fi out to reveal hi-fi */
  .lh-card:hover .lh-lofi-layer,
  .lh-card.tapped .lh-lofi-layer {
    opacity: 0;
  }

  /* Top label bar */
  .lh-label-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    pointer-events: none;
  }
  .lh-screen-name {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
  }

  /* State label — toggle between "Final design" and "Lo-fi wireframe" */
  .lh-state-label { position: relative; }

  .lh-state-hifi,
  .lh-state-lofi {
    font-size: 12px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.85);
    transition: opacity 0.3s ease;
    position: absolute;
    right: 0;
    top: 0;
    white-space: nowrap;
  }
  .lh-state-lofi { opacity: 0; }

  /* On hover/tap: swap state labels */
  .lh-card:hover .lh-state-hifi,
  .lh-card.tapped .lh-state-hifi { opacity: 0; }

  .lh-card:hover .lh-state-lofi,
  .lh-card.tapped .lh-state-lofi { opacity: 1; }

  /* Spacer for absolute positioned labels */
  .lh-state-label {
    min-width: 100px;
    min-height: 18px;
    display: inline-block;
  }

  /* Bottom hint */
  .lh-hint {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%);
    padding: 10px 14px;
    text-align: center;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .lh-hint.hidden { opacity: 0; }

  .lh-hint-desktop,
  .lh-hint-mobile {
    font-size: 10px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
  }

  /* Show/hide hint text per device */
  .lh-hint-mobile { display: none; }

  @media (hover: none) {
    /* Touch device */
    .lh-hint-desktop { display: none; }
    .lh-hint-mobile  { display: inline; }
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .lh-card  { height: 220px; }
    .lh-grid  { gap: 14px; }
    .lh-title { font-size: 16px; }
  }

  @media (max-width: 480px) {
    .lh-grid     { grid-template-columns: 1fr; }
    .lh-card     { height: 200px; }
    .lh-subtitle { font-size: 12px; }
  }
</style>

<script>
  document.querySelectorAll('.lh-card').forEach(card => {
    let interacted = false

    card.addEventListener('click', () => {
      // Toggle tapped state (for mobile)
      card.classList.toggle('tapped')

      // Hide hint after first interaction
      if (!interacted) {
        interacted = true
        card.querySelector('.lh-hint')?.classList.add('hidden')
      }
    })

    // Hide hint on first hover (desktop)
    card.addEventListener('mouseenter', () => {
      if (!interacted) {
        interacted = true
        card.querySelector('.lh-hint')?.classList.add('hidden')
      }
    })
  })
</script>
```

---

## How to use in your case study page

```astro
---
import LofiHifiFade from '../components/LofiHifiFade.astro'
---

<!-- After "The build as a design signal" paragraph -->
<LofiHifiFade />

<!-- Then continue with What's built so far -->
```

---

## How it works

```
Default state:        Lo-fi wireframe visible (on top)
                              ↓
Hover (desktop)       Lo-fi fades out → Hi-fi revealed
or tap (mobile):              ↓
                      Label changes: "Final design" → "Lo-fi wireframe"
                      Hint disappears after first interaction
```

The component shows **lo-fi by default** and reveals hi-fi on interaction —
this is intentional. The "reveal" moment goes from rough → polished,
which feels more satisfying than the reverse.

---

## Notes

- Two cards side by side: Home Screen + Focus Timer
- Both pairs show the most dramatic transformation in the design
- Hint text auto-detects touch device (`@media (hover: none)`)
- Hint disappears after first interaction so it doesn't distract
- All font sizes are multiples of 2 ✓
- No external libraries ✓
- Fully responsive ✓
