# Fishdoro — Before/After Slider Component (4 pairs)
*Ready-to-use Copilot prompt + full HTML/CSS/JS code*
*Drop this into your Astro case study page — Develop section*

---

## Copilot Prompt

```
Update the existing BeforeAfter slider component in the Fishdoro case study
to support 4 comparison pairs instead of 1.

Each pair shows a before (lo-fi wireframe) and after (revised wireframe or hi-fi)
with a draggable divider line.

LAYOUT:
- Section title: "Iteration — drag to compare"
  Inter 500, 16px, color #2d4a1e, margin-bottom 8px
- Section subtitle: "Four rounds of iteration. Drag the slider to compare
  the wireframe with the revised version."
  Inter 300, 14px, color #5a7040, margin-bottom 20px

- Four sliders stacked vertically, gap 24px between each
- Each slider has:
  A. Pair label above the slider:
     Inter 500, 12px, color #2d4a1e, margin-bottom 8px
  B. Issue label (what was wrong):
     Inter 300, 12px, color #9aaf7a, font-style italic, margin-bottom 8px
  C. The slider itself (existing drag logic, keep as-is)
  D. Why it matters line below the slider:
     Inter 300, 12px, color #9aaf7a, margin-top 6px

THE FOUR PAIRS:

Pair 1:
  Label: "Homepage Buttons"
  Issue: "Inconsistent button widths created unclear visual hierarchy"
  Before image: /assets/Home-A.png
  After image:  /assets/Home-B.png
  Why it matters: "Cleaner hierarchy creates a more polished first impression"

Pair 2:
  Label: "Timer Customization Placement"
  Issue: "Users expected timer settings on the setup screen, not elsewhere"
  Before image: /assets/Session-Setup-A.png
  After image:  /assets/Session-Setup-B.png
  Why it matters: "Matches the mental model users already bring to Pomodoro apps"

Pair 3:
  Label: "Bait Icon vs Start Button"
  Issue: "The bait icon was visually competing with the primary CTA"
  Before image: /assets/Session-Settings-A.png
  After image:  /assets/Session-Settings-B.png
  Why it matters: "Primary CTAs must be visually dominant — only one thing should say 'press me'"

Pair 4:
  Label: "Copy Consistency"
  Issue: "'Catch Log' and 'Work Report' broke the fishing theme"
  Before image: /assets/Catch-Log-A.png
  After image:  /assets/Catch-Log-B.png
  Why it matters: "A unified fishing theme strengthens Fishdoro's product identity"

SLIDER BEHAVIOR (keep existing logic, just replicate for 4 instances):
- Each slider is independent — dragging one doesn't affect others
- Use data attributes or unique IDs to target each slider separately
- Before label: "Before" — After label: "After"
- Handle: circular button with ⇔ icon, bg #6b8f4e, color white
- Divider line: 2px solid #6b8f4e

SLIDER DIMENSIONS:
- Width: 100%
- Height: 280px desktop / 220px tablet / 180px Android
- Border-radius: 10px
- Image object-fit: cover

RESPONSIVE:
- Tablet (≤1024px): height 220px
- Android (≤480px): height 180px, label font-size 12px
```

---

## Full HTML + CSS + JS Code

```html
---
// BeforeAfterSliders.astro — 4 pairs
---

<section class="ba-section">

  <h3 class="ba-title">Iteration — drag to compare</h3>
  <p class="ba-subtitle">Four rounds of iteration. Drag the slider to compare the wireframe with the revised version.</p>

  <!-- Pair 1: Homepage Buttons -->
  <div class="ba-pair">
    <p class="ba-pair-label">Homepage Buttons</p>
    <p class="ba-pair-issue">"Inconsistent button widths created unclear visual hierarchy"</p>
    <div class="ba-slider" id="slider-1">
      <div class="ba-after">
        <img src="/assets/Home-B.png" alt="After — revised button layout" />
        <span class="ba-label ba-label-after">After</span>
      </div>
      <div class="ba-before">
        <img src="/assets/Home-A.png" alt="Before — original button layout" />
        <span class="ba-label ba-label-before">Before</span>
      </div>
      <div class="ba-handle">
        <div class="ba-line"></div>
        <button class="ba-thumb" aria-label="Drag to compare">⇔</button>
      </div>
    </div>
    <p class="ba-why">→ Cleaner hierarchy creates a more polished first impression</p>
  </div>

  <!-- Pair 2: Timer Customization -->
  <div class="ba-pair">
    <p class="ba-pair-label">Timer Customization Placement</p>
    <p class="ba-pair-issue">"Users expected timer settings on the setup screen, not elsewhere"</p>
    <div class="ba-slider" id="slider-2">
      <div class="ba-after">
        <img src="/assets/Session-Setup-B.png" alt="After — timer on setup screen" />
        <span class="ba-label ba-label-after">After</span>
      </div>
      <div class="ba-before">
        <img src="/assets/Session-Setup-A.png" alt="Before — timer in wrong place" />
        <span class="ba-label ba-label-before">Before</span>
      </div>
      <div class="ba-handle">
        <div class="ba-line"></div>
        <button class="ba-thumb" aria-label="Drag to compare">⇔</button>
      </div>
    </div>
    <p class="ba-why">→ Matches the mental model users already bring to Pomodoro apps</p>
  </div>

  <!-- Pair 3: Bait Icon -->
  <div class="ba-pair">
    <p class="ba-pair-label">Bait Icon vs Start Button</p>
    <p class="ba-pair-issue">"The bait icon was visually competing with the primary CTA"</p>
    <div class="ba-slider" id="slider-3">
      <div class="ba-after">
        <img src="/assets/Session-Settings-B.png" alt="After — clear CTA hierarchy" />
        <span class="ba-label ba-label-after">After</span>
      </div>
      <div class="ba-before">
        <img src="/assets/Session-Settings-A.png" alt="Before — confusing bait icon" />
        <span class="ba-label ba-label-before">Before</span>
      </div>
      <div class="ba-handle">
        <div class="ba-line"></div>
        <button class="ba-thumb" aria-label="Drag to compare">⇔</button>
      </div>
    </div>
    <p class="ba-why">→ Primary CTAs must be visually dominant — only one thing should say "press me"</p>
  </div>

  <!-- Pair 4: Copy Consistency -->
  <div class="ba-pair">
    <p class="ba-pair-label">Copy Consistency</p>
    <p class="ba-pair-issue">"'Catch Log' and 'Work Report' broke the fishing theme"</p>
    <div class="ba-slider" id="slider-4">
      <div class="ba-after">
        <img src="/assets/Catch-Log-B.png" alt="After — unified fishing theme copy" />
        <span class="ba-label ba-label-after">After</span>
      </div>
      <div class="ba-before">
        <img src="/assets/Catch-Log-A.png" alt="Before — inconsistent copy" />
        <span class="ba-label ba-label-before">Before</span>
      </div>
      <div class="ba-handle">
        <div class="ba-line"></div>
        <button class="ba-thumb" aria-label="Drag to compare">⇔</button>
      </div>
    </div>
    <p class="ba-why">→ A unified fishing theme strengthens Fishdoro's product identity</p>
  </div>

</section>

<style>
  .ba-section { margin-bottom: 28px; }

  .ba-title {
    font-size: 16px;
    font-weight: 500;
    color: #2d4a1e;
    margin-bottom: 6px;
  }
  .ba-subtitle {
    font-size: 14px;
    font-weight: 300;
    color: #5a7040;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  /* Each pair */
  .ba-pair { margin-bottom: 28px; }
  .ba-pair:last-child { margin-bottom: 0; }

  .ba-pair-label {
    font-size: 14px;
    font-weight: 500;
    color: #2d4a1e;
    margin-bottom: 4px;
  }
  .ba-pair-issue {
    font-size: 12px;
    font-weight: 300;
    color: #9aaf7a;
    font-style: italic;
    margin-bottom: 10px;
  }
  .ba-why {
    font-size: 12px;
    font-weight: 300;
    color: #9aaf7a;
    margin-top: 8px;
  }

  /* Slider container */
  .ba-slider {
    position: relative;
    width: 100%;
    height: 280px;
    border-radius: 10px;
    overflow: hidden;
    cursor: ew-resize;
    user-select: none;
    border: 0.5px solid rgba(154,175,122,0.3);
  }

  /* After (bottom layer, full width) */
  .ba-after {
    position: absolute;
    inset: 0;
  }
  .ba-after img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Before (top layer, clipped by width var) */
  .ba-before {
    position: absolute;
    inset: 0;
    width: var(--divider, 50%);
    overflow: hidden;
  }
  .ba-before img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* ensure image fills full original width */
    min-width: calc(100vw - 240px);
  }

  /* Labels */
  .ba-label {
    position: absolute;
    top: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #2d4a1e;
    background: rgba(250,247,242,0.9);
    border-radius: 99px;
    padding: 3px 10px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    pointer-events: none;
  }
  .ba-label-before { left: 10px; }
  .ba-label-after  { right: 10px; }

  /* Handle */
  .ba-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--divider, 50%);
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    z-index: 2;
  }
  .ba-line {
    width: 2px;
    flex: 1;
    background: #6b8f4e;
  }
  .ba-thumb {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #6b8f4e;
    color: #ffffff;
    border: 2px solid rgba(250,247,242,0.9);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: ew-resize;
    pointer-events: none;
    line-height: 1;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .ba-slider { height: 220px; }
  }
  @media (max-width: 480px) {
    .ba-slider { height: 180px; }
    .ba-pair-label { font-size: 12px; }
    .ba-subtitle { font-size: 12px; }
  }
</style>

<script>
  // Initialize all 4 sliders independently
  document.querySelectorAll('.ba-slider').forEach(slider => {
    let dragging = false

    function setDivider(clientX) {
      const rect = slider.getBoundingClientRect()
      const pct = Math.min(Math.max(
        (clientX - rect.left) / rect.width * 100, 3
      ), 97)
      slider.style.setProperty('--divider', pct + '%')
      slider.querySelector('.ba-before').style.width = pct + '%'
      slider.querySelector('.ba-handle').style.left = pct + '%'
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      dragging = true
      setDivider(e.clientX)
    })
    window.addEventListener('mousemove', (e) => {
      if (dragging) setDivider(e.clientX)
    })
    window.addEventListener('mouseup', () => { dragging = false })

    // Touch events (mobile)
    slider.addEventListener('touchstart', (e) => {
      dragging = true
      setDivider(e.touches[0].clientX)
    }, { passive: true })
    window.addEventListener('touchmove', (e) => {
      if (dragging) setDivider(e.touches[0].clientX)
    }, { passive: true })
    window.addEventListener('touchend', () => { dragging = false })
  })
</script>
```

---

## Image filenames to prepare

| Filename | Pair | Version |
|---|---|---|
| `Home-A.png` | Homepage Buttons | Before |
| `Home-B.png` | Homepage Buttons | After |
| `Session-Setup-A.png` | Timer Customization Placement | Before |
| `Session-Setup-B.png` | Timer Customization Placement | After |
| `Session-Settings-A.png` | Bait Icon vs Start Button | Before |
| `Session-Settings-B.png` | Bait Icon vs Start Button | After |
| `Catch-Log-A.png` | Copy Consistency | Before |
| `Catch-Log-B.png` | Copy Consistency | After |

Export from Figma at **640×280px minimum**, PNG.
Save all to `/public/assets/`.

---

## How to use in your case study page

```astro
---
import BeforeAfterSliders from '../components/BeforeAfterSliders.astro'
---

<!-- After lo-fi iteration paragraph in Develop section -->
<BeforeAfterSliders />
```

---

## Notes

- Each slider is **fully independent** — dragging one doesn't affect others
- Touch events included — works on Android
- Images use `object-fit: cover` so any size works as placeholder
- The `.ba-before img` has `min-width` to prevent image from squishing when slider moves left
- All font sizes are multiples of 2 ✓
- No external libraries ✓
- Responsive ✓
