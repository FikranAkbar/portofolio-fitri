# Fishdoro Case Study — UI Fixes V3
*Comprehensive revision round — based on latest screenshots*
*Implement all fixes in one Copilot session*

---

## Copilot Prompt

```
Apply the following fixes to the Fishdoro case study page.
Implement all changes in order as listed below.

---

FIX 1 — Make case study title larger

Increase the font size of the main case study title
("Designing a Gamified Pomodoro Timer: Can Focus Feel Like Play?")

Change:
  font-size: current size → 36px (desktop) / 28px (tablet) / 24px (Android)
  font-weight: 700
  font-family: Playfair Display (keep existing)
  color: #2d4a1e (keep existing)
  line-height: 1.2

---

FIX 2 — Change primary text color from green to dark/black

All primary text that is currently using a green color
(#2d4a1e or similar dark green) should be changed to near-black:

Change:
  #2d4a1e → #1a1a1a

Apply to:
  - All body paragraph text
  - Section headings (h2, h3)
  - Takeaway titles
  - Entry titles
  - Any text that is meant to be "primary" readable content

DO NOT change:
  - Tags, badges, pills (keep green)
  - Section pill labels (keep green)
  - Meta labels (ROLE, TYPE, STACK — keep muted green)
  - Caption text (keep muted)
  - Sidebar text (keep as-is)

---

FIX 3 — Increase body text size to 18px

Change all body/paragraph text inside the case study content area to 18px.

Applies to:
  - All <p> tags inside .cs-content or equivalent
  - Takeaway body text
  - Background section paragraphs
  - Discover/Define/Develop body text

DO NOT change:
  - Tags, badges, captions, labels (keep their existing sizes)
  - Headings

---

FIX 4 — Update Background section content

Replace the current Background section body text with the following
(keep section pill "BACKGROUND" and heading "The productivity paradox"):

Keep blockquote:
  "What if the reward was part of the focus itself?"

Replace all paragraphs with:

  Paragraph 1:
  "Most productivity apps promise to help you focus. In practice, they
  add cognitive overhead — more notifications, more dashboards, more
  decisions. The tool becomes the distraction."

  Paragraph 2:
  "I wanted to understand why. And then I wanted to build something
  different."

  Paragraph 3:
  "This case study documents the research, design decisions, and build
  process behind that question."

Keep "What is Fishdoro?" subsection and its paragraph unchanged.

---

FIX 5 — Add white top bar and back button to case study view

When the case study expand view is open (replacing the project grid),
add a white top bar at the very top of the case study area.

The bar should contain:
  Left side: Back button
    - "← Back to projects" text
    - Inter 400, 14px, color #1a1a1a
    - No border, no background, cursor pointer
    - On click: close case study, return to project grid
    - Hover: color #6b8f4e

  The bar itself:
    - background: #ffffff
    - border-bottom: 0.5px solid rgba(0,0,0,0.08)
    - padding: 12px 24px
    - position: sticky, top: 0, z-index: 20

---

FIX 6 — Make hero thumbnail clickable and zoomable

The hero image (Hero.png) at the top of the case study should be
clickable to open a fullscreen lightbox overlay.

Implement a simple lightbox:
  - On image click: show overlay (background rgba(0,0,0,0.85))
  - Overlay fills entire viewport, z-index 100
  - Image inside: max-width 90vw, max-height 90vh, object-fit contain
  - Click anywhere on overlay to close
  - Add subtle cursor: zoom-in on hover of the image
  - Add a close button (×) top-right of overlay:
    Inter 400, 24px, color white, cursor pointer

Apply the same lightbox behavior to ALL images in the case study
that are NOT part of interactive components (see Fix 10 for list).

---

FIX 7 — Fix lo-fi iteration slider image cropping

The before/after slider images in the iteration section are being
cropped at the bottom. Fix this by:

  1. Increase slider height:
     .ba-slider { height: 360px; }  (desktop)
     Tablet (≤1024px): height 300px
     Android (≤480px): height 220px

  2. Change object-fit from cover to contain for lo-fi wireframe images
     so the full wireframe is visible without cropping:
     .ba-before img, .ba-after img { object-fit: contain; }

  3. Add background color to slider so contain doesn't show empty space:
     .ba-slider { background: #f5f5f5; }

---

FIX 8 — Remove annotated viewer hotspots from hi-fi timer screen

In the hi-fi screens section, the main timer screenshot currently shows
numbered hotspot circles (1, 2, 3) for the annotated viewer component.

Remove the annotated viewer entirely from this section:
  - Remove all .av-hotspot elements
  - Remove the AnnotatedViewer component or its output
  - The image (HiFi-Pomodoro-Session.png) should display as a plain
    image with no overlaid circles or tooltips
  - Keep the caption text below the image

---

FIX 9 — Reorganize hi-fi screens into 2-column grid

The hi-fi screens section currently shows screens in a mix of
single and multi-column layouts. Reorganize ALL 8 hi-fi screens
into a clean 2-column grid.

2-column grid CSS:
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

The 8 screens to display (in this order):
  1. HiFi-Pomodoro-Session.png — "Focus timer"
  2. HiFi-Home.png — "Home screen"
  3. HiFi-Get-Fish-Timer-Finish.png — "Reward reveal"
  4. HiFi-Session-Setup.png — "Session setup"
  5. HiFi-Session-Setting.png — "Session settings"
  6. HiFi-App-Setting.png — "App settings"
  7. HiFi-Catch-Log.png — "Fishing log"
  8. HiFi-Catch-Report.png — "Catch report"

Each image:
  - width: 100%
  - height: 280px desktop / 220px tablet / auto mobile
  - object-fit: cover
  - border-radius: 10px
  - border: 0.5px solid rgba(154,175,122,0.3)
  - Caption below each: Inter 300, 12px, color #888, text-align center

Add intro text above the grid:
  "Once the structure was solid, I layered in all the visual elements
  — pixel art, animations, and the core cast → wait → catch loop."

Android (≤480px): 1 column

---

FIX 10 — Make all non-interactive images clickable (lightbox)

Apply the lightbox behavior from Fix 6 to ALL of these images
throughout the case study (not just the hero):

  - Hero.png
  - Moodboard.png
  - All HiFi-*.png screens in the hi-fi gallery (Fix 9)
  - HiFi-Break-State.png if displayed
  - LoFi vs HiFi fade cards (lh-card) — on click show full image
    of whichever layer is currently visible

DO NOT apply lightbox to:
  - Before/after sliders (they are interactive)
  - Flip cards (they are interactive)
  - Annotated viewer (being removed in Fix 8)

Lightbox implementation (shared, reusable):

HTML — add once at bottom of page:
  <div id="lightbox" class="lb-overlay">
    <button class="lb-close" id="lbClose">×</button>
    <img class="lb-img" id="lbImg" src="" alt="" />
  </div>

CSS:
  .lb-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.88);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
  }
  .lb-overlay.active { display: flex; }

  .lb-img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 6px;
    cursor: default;
  }

  .lb-close {
    position: fixed;
    top: 20px;
    right: 24px;
    font-size: 32px;
    color: white;
    background: none;
    border: none;
    cursor: pointer;
    line-height: 1;
    opacity: 0.8;
  }
  .lb-close:hover { opacity: 1; }

JS — add once:
  const lightbox = document.getElementById('lightbox')
  const lbImg = document.getElementById('lbImg')
  const lbClose = document.getElementById('lbClose')

  // Add cursor zoom-in to all lightbox-enabled images
  document.querySelectorAll('.lb-trigger').forEach(img => {
    img.style.cursor = 'zoom-in'
    img.addEventListener('click', () => {
      lbImg.src = img.src
      lbImg.alt = img.alt
      lightbox.classList.add('active')
    })
  })

  // Close on overlay click or close button
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lbImg) lightbox.classList.remove('active')
  })
  lbClose.addEventListener('click', () => {
    lightbox.classList.remove('active')
  })

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active')
  })

Add class="lb-trigger" to all images that should open the lightbox.

---

FIX 11 — Key Takeaways: accordion/expand on click

The Key Takeaways section currently shows full body text for all 4
items at once — it feels too long. Change to an accordion pattern:

Each takeaway shows only the title by default.
Click to expand and reveal the body text.
Click again to collapse.
Only one takeaway can be open at a time.

HTML structure per item:
  <div class="ta-item">
    <button class="ta-header" aria-expanded="false">
      <span class="ta-num">01</span>
      <span class="ta-title">The problem is more interesting than the solution.</span>
      <span class="ta-arrow">↓</span>
    </button>
    <div class="ta-body" hidden>
      <p class="ta-text">Body text here...</p>
    </div>
  </div>

CSS:
  .ta-item {
    border: 0.5px solid rgba(154,175,122,0.3);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .ta-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    background: #ffffff;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease;
  }

  .ta-header:hover { background: #fafafa; }

  .ta-header[aria-expanded="true"] {
    border-bottom: 0.5px solid rgba(154,175,122,0.2);
  }

  .ta-num {
    font-size: 10px;
    font-weight: 500;
    color: #9aaf7a;
    letter-spacing: 0.1em;
    flex-shrink: 0;
    width: 24px;
  }

  .ta-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    flex: 1;
    line-height: 1.4;
  }

  .ta-arrow {
    font-size: 14px;
    color: #9aaf7a;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .ta-header[aria-expanded="true"] .ta-arrow {
    transform: rotate(180deg);
  }

  .ta-body {
    padding: 14px 18px 18px;
    background: #ffffff;
  }

  .ta-text {
    font-size: 16px;
    font-weight: 300;
    color: #444444;
    line-height: 1.7;
  }

JS:
  document.querySelectorAll('.ta-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true'
      const body = btn.nextElementSibling

      // Close all
      document.querySelectorAll('.ta-header').forEach(b => {
        b.setAttribute('aria-expanded', 'false')
        b.nextElementSibling.hidden = true
      })

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true')
        body.hidden = false
      }
    })
  })
```

---

## Summary of all fixes

| Fix | Area | What changes |
|---|---|---|
| 1 | Header | Title font size → 36px |
| 2 | Whole case study | Primary text color → #1a1a1a (near black) |
| 3 | Whole case study | Body text size → 18px |
| 4 | Background section | Update body paragraphs content |
| 5 | Layout | Add white sticky top bar with "← Back to projects" button |
| 6 | Hero image | Clickable lightbox zoom |
| 7 | Iteration sliders | Fix image cropping — increase height, object-fit contain |
| 8 | Hi-fi section | Remove annotated viewer hotspots |
| 9 | Hi-fi section | Reorganize 8 screens into 2-column grid |
| 10 | All images | Add lightbox to all non-interactive images |
| 11 | Key Takeaways | Accordion — show title only, expand on click |

---

## Order of implementation

1. Fix 2 + Fix 3 — color and font size (CSS sweep, do first)
2. Fix 5 — add back button bar (structural)
3. Fix 1 — title size
4. Fix 4 — background content
5. Fix 8 — remove annotated viewer
6. Fix 9 — reorganize hi-fi grid
7. Fix 7 — fix slider cropping
8. Fix 10 + Fix 6 — lightbox (add HTML once, then add .lb-trigger class)
9. Fix 11 — accordion takeaways (replace existing markup + add JS)
