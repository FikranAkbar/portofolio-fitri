# Fishdoro — Annotated Screen Viewer Component
*Develop section — applied to HiFi-Pomodoro-Session.png*
*Numbered hotspots that reveal design decision tooltips on click*

---

## Copilot Prompt

```
Create an Astro component called AnnotatedViewer.astro for the Fishdoro
case study Develop section.

The component displays the hi-fi timer screen with numbered hotspot circles
overlaid at key UI elements. Clicking a hotspot opens a tooltip explaining
the design decision and which research insight drove it.

FONT: Inter (already imported)
All font sizes must be multiples of 2.
No external libraries — plain HTML + CSS + vanilla JS.

IMAGE:
  src: /assets/Fishdoro-SS/HiFi-Pomodoro-Session.png
  alt: "Fishdoro focus timer — annotated"
  width 100%, height auto, display block

WRAPPER (.av-wrap):
  position relative, border-radius 12px, overflow hidden
  border 0.5px solid rgba(154,175,122,0.3)
  margin-bottom 6px

CAPTION below image:
  Inter 300, 12px, color #9aaf7a, text-align center, margin-top 6px
  Text: "Click the numbered circles to see design decisions"

THREE HOTSPOTS — positions as percentage of image:

  Hotspot 1 — position: left 72%, top 85%
  Button: 22px circle, bg #4e7a30, color white, border 2px rgba(250,247,242,0.8)
    Inter 500, 12px, number "1"
  Tooltip text: "Full-width CTA added after testing — matches the mental
    model of one clear action to start."
  Insight tag: "Solves: Flexibility problem"

  Hotspot 2 — position: left 30%, top 25%
  Button: same style, number "2"
  Tooltip text: "Custom duration input added here — users who need
    45-minute sessions shouldn't have to fight the tool."
  Insight tag: "Solves: Flexibility problem"

  Hotspot 3 — position: left 50%, top 50%
  Button: same style, number "3"
  Tooltip text: "Pixel art fishing scene sets the emotional register
    before the user does anything. If this feels cozy in the first
    2 seconds, the whole session feels different."
  Insight tag: "Solves: Retention problem"

HOTSPOT BUTTON (.av-btn):
  width 22px, height 22px, border-radius 50%
  background #4e7a30, color #faf7f2
  border 2px solid rgba(250,247,242,0.8)
  font Inter 500 12px, cursor pointer
  transition transform 0.15s ease, background 0.15s ease
  hover + aria-expanded true: transform scale(1.15), background #2d4a1e

TOOLTIP (.av-tooltip):
  position absolute, bottom calc(100% + 8px), left 50%
  transform translateX(-50%) translateY(4px)
  width 220px
  background #ffffff, border 0.5px solid rgba(154,175,122,0.4)
  border-radius 10px, padding 10px 12px
  opacity 0, pointer-events none
  transition opacity 0.2s ease, transform 0.2s ease
  z-index 10

  When .visible:
    opacity 1, transform translateX(-50%) translateY(0)
    pointer-events auto

  Tooltip text: Inter 300, 12px, color #5a7040, line-height 1.5, mb 6px
  Insight tag: Inter 500, 10px, color #6b8f4e

JS BEHAVIOR:
  Click hotspot: toggle tooltip visible
  Click elsewhere: close all tooltips
  Only one tooltip open at a time
  Each button has aria-expanded attribute that updates on toggle
  Tooltip auto-flips if near top edge: show below instead of above
```

---

## Full HTML + CSS + JS Code

```html
---
// AnnotatedViewer.astro — no props needed
---

<div class="av-section">
  <div class="av-wrap" id="annotatedViewer">
    <img
      src="/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png"
      alt="Fishdoro focus timer — annotated"
      class="av-img"
    />

    <!-- Hotspot 1 -->
    <div class="av-hotspot" style="left: 72%; top: 85%;">
      <button class="av-btn" aria-label="Design note 1" aria-expanded="false">1</button>
      <div class="av-tooltip" role="tooltip">
        <p class="av-tooltip-text">Full-width CTA added after testing —
        matches the mental model of one clear action to start.</p>
        <span class="av-insight">Solves: Flexibility problem</span>
      </div>
    </div>

    <!-- Hotspot 2 -->
    <div class="av-hotspot" style="left: 30%; top: 25%;">
      <button class="av-btn" aria-label="Design note 2" aria-expanded="false">2</button>
      <div class="av-tooltip" role="tooltip">
        <p class="av-tooltip-text">Custom duration input added here —
        users who need 45-minute sessions shouldn't have to fight the tool.</p>
        <span class="av-insight">Solves: Flexibility problem</span>
      </div>
    </div>

    <!-- Hotspot 3 -->
    <div class="av-hotspot" style="left: 50%; top: 50%;">
      <button class="av-btn" aria-label="Design note 3" aria-expanded="false">3</button>
      <div class="av-tooltip" role="tooltip">
        <p class="av-tooltip-text">Pixel art fishing scene sets the emotional
        register before the user does anything. If this feels cozy in the
        first 2 seconds, the whole session feels different.</p>
        <span class="av-insight">Solves: Retention problem</span>
      </div>
    </div>
  </div>

  <p class="av-caption">Click the numbered circles to see design decisions</p>
</div>

<style>
  .av-section { margin-bottom: 20px; }

  .av-wrap {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 0.5px solid rgba(154, 175, 122, 0.3);
  }

  .av-img {
    width: 100%;
    height: auto;
    display: block;
  }

  .av-caption {
    font-size: 12px;
    font-weight: 300;
    color: #9aaf7a;
    text-align: center;
    margin-top: 6px;
  }

  /* Hotspot */
  .av-hotspot {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .av-btn {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #4e7a30;
    color: #faf7f2;
    border: 2px solid rgba(250, 247, 242, 0.8);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, background 0.15s ease;
    position: relative;
    z-index: 3;
  }

  .av-btn:hover,
  .av-btn[aria-expanded="true"] {
    transform: scale(1.15);
    background: #2d4a1e;
  }

  /* Tooltip */
  .av-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    width: 220px;
    background: #ffffff;
    border: 0.5px solid rgba(154, 175, 122, 0.4);
    border-radius: 10px;
    padding: 10px 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 10;
  }

  .av-tooltip.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }

  /* Flip tooltip below if near top */
  .av-hotspot.flip-down .av-tooltip {
    bottom: auto;
    top: calc(100% + 8px);
    transform: translateX(-50%) translateY(-4px);
  }
  .av-hotspot.flip-down .av-tooltip.visible {
    transform: translateX(-50%) translateY(0);
  }

  .av-tooltip-text {
    font-size: 12px;
    font-weight: 300;
    color: #5a7040;
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .av-insight {
    font-size: 10px;
    font-weight: 500;
    color: #6b8f4e;
    display: block;
  }
</style>

<script>
  const viewer = document.getElementById('annotatedViewer')
  if (viewer) {
    let activeTooltip = null
    let activeBtn = null

    viewer.querySelectorAll('.av-btn').forEach(btn => {
      const hotspot = btn.parentElement
      const tooltip = hotspot.querySelector('.av-tooltip')

      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const isOpen = tooltip.classList.contains('visible')

        // Close all open tooltips
        viewer.querySelectorAll('.av-tooltip.visible').forEach(t => {
          t.classList.remove('visible')
        })
        viewer.querySelectorAll('.av-btn[aria-expanded="true"]').forEach(b => {
          b.setAttribute('aria-expanded', 'false')
        })

        if (!isOpen) {
          // Check if near top — flip tooltip below
          const rect = hotspot.getBoundingClientRect()
          const wrapRect = viewer.getBoundingClientRect()
          if (rect.top - wrapRect.top < 120) {
            hotspot.classList.add('flip-down')
          } else {
            hotspot.classList.remove('flip-down')
          }

          tooltip.classList.add('visible')
          btn.setAttribute('aria-expanded', 'true')
          activeTooltip = tooltip
          activeBtn = btn
        } else {
          activeTooltip = null
          activeBtn = null
        }
      })
    })

    // Click outside closes tooltip
    document.addEventListener('click', () => {
      if (activeTooltip) {
        activeTooltip.classList.remove('visible')
        activeBtn?.setAttribute('aria-expanded', 'false')
        activeTooltip = null
        activeBtn = null
      }
    })
  }
</script>
```

---

## How to use

```astro
---
import AnnotatedViewer from '../components/AnnotatedViewer.astro'
---

<!-- Replaces or wraps the full-width HiFi-Pomodoro-Session.png display -->
<AnnotatedViewer />
```

---

## Adjusting hotspot positions

If the hotspot positions don't align with the actual image content,
adjust the `left` and `top` percentages in the HTML:

```html
<!-- Example: move hotspot to 60% from left, 70% from top -->
<div class="av-hotspot" style="left: 60%; top: 70%;">
```

Test by loading the page and visually checking alignment.
Percentage positions scale automatically with image width.
