# Fishdoro Case Study — UI Fixes V5
*Based on latest screenshots review*

---

## Copilot Prompt

```
Apply the following fixes to fishdoro.astro, FlipCards.astro,
ProblemFramework.astro, BeforeAfterSliders.astro, and LofiHifiFade.astro.
Check each file and apply only what is needed.

---

FIX 1 — Remove intro paragraphs from header (fishdoro.astro)

Inside <header class="cs-header">, keep ONLY:
  1. .cs-tags
  2. .cs-title
  3. .cs-subtitle
  4. .cs-hero-img
  5. .cs-meta-row

Delete ANY <p> tags that appear between .cs-subtitle and .cs-hero-img.
These are the "Productivity tools have a paradox..." paragraphs.
They are already in the Background section — do not add them anywhere else.

---

FIX 2 — Flip cards: change to vertical layout (FlipCards.astro)

Change the flip cards grid from horizontal 3-column to vertical 1-column:

In <style>:
  .fc-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .fc-card {
    height: auto;
    min-height: 120px;
    perspective: 1000px;
    cursor: pointer;
    outline: none;
  }

  .fc-inner {
    width: 100%;
    min-height: 120px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
    border-radius: 10px;
  }

Remove any existing grid-template-columns from .fc-grid.

---

FIX 3 — Flip cards: increase font sizes (FlipCards.astro)

In <style>, update:
  .fc-quote {
    font-size: 16px;  /* was 12px */
  }
  .fc-insight {
    font-size: 16px;  /* was 12px */
  }
  .fc-label {
    font-size: 14px;  /* was 12px */
  }
  .fc-hint {
    font-size: 12px;  /* was 10px */
  }
  .fc-confidence {
    font-size: 12px;  /* was 10px */
  }

---

FIX 4 — Flip cards: add hover animation (FlipCards.astro)

Add hover effect to show the card is interactive:

In <style>:
  .fc-card:hover .fc-inner {
    box-shadow: 0 4px 20px rgba(107, 143, 78, 0.15);
    transform: translateY(-2px);
  }

  /* But when already flipped, don't apply translateY to hover */
  .fc-card.flipped:hover .fc-inner {
    transform: rotateY(180deg) translateY(-2px);
  }

  .fc-front,
  .fc-back {
    transition: box-shadow 0.2s ease;
  }

---

FIX 5 — Problem Framework: make "From insight" more visible (ProblemFramework.astro)

In <style>, update .pf-source and related:
  .pf-source {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(154,175,122,0.25);
    margin-top: auto;
  }

  .pf-source-label {
    font-size: 11px;
    font-weight: 700;        /* bold */
    color: #2d4a1e;          /* darker, more visible */
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .pf-source-text {
    font-size: 13px;
    font-weight: 600;        /* bold */
    color: #2d4a1e;          /* darker, more visible */
    font-style: normal;      /* remove italic */
  }

---

FIX 6 — All zoomable images: add hover animation + fix hint text size (fishdoro.astro)

In <style>, add hover effect for all lb-trigger images:
  .lb-trigger {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .lb-trigger:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }

Also fix hint text size. Find .cs-screenshot-caption and .hifi-caption:
  .cs-screenshot-caption {
    font-size: 12px;   /* ensure it's 12px */
  }
  .hifi-caption {
    font-size: 12px;   /* ensure it's 12px */
  }

---

FIX 7 — LofiHifiFade: fix left/right order — Before on left, After on right (LofiHifiFade.astro)

Currently the cards show hi-fi by default and lo-fi on hover.
The VISUAL order should be: lo-fi (Before) on left, hi-fi (After) on right.

Change the component so:
  - Left card: shows lo-fi wireframe by default, reveals hi-fi on hover
    Label: "Before" (top-left), screen name top-right
  - Right card: shows hi-fi final design always (no fade effect)
    Label: "After" (top-left), screen name top-right

OR simpler approach: change both cards to show lo-fi by default
and label them clearly:

Left card:
  Default: LoFi-Home.png visible
  On hover: HiFi-Home.png revealed
  Top-left label: "Before"
  Top-right state: toggles "Lo-fi wireframe" / "Final design"

Right card:
  Default: LoFi-Pomodoro-Session.png visible
  On hover: HiFi-Pomodoro-Session.png revealed
  Top-left label: "Before"
  Top-right state: toggles "Lo-fi wireframe" / "Final design"

Wait — actually the correct fix is:
  - Remove the fade effect entirely from this component
  - Show a simple STATIC side-by-side:
    Left image: lo-fi wireframe (LoFi-Home.png)
    Right image: hi-fi final (HiFi-Home.png)
    Left label: "Before — Lo-fi wireframe"
    Right label: "After — Final design"

This is clearer and avoids confusion about which state is shown.

UPDATE the component to this static side-by-side layout:

HTML structure:
  <div class="lh-grid">
    <div class="lh-card">
      <div class="lh-label-bar">
        <span class="lh-before-label">Before</span>
        <span class="lh-state-text">Lo-fi wireframe</span>
      </div>
      <img class="lb-trigger lh-img"
           src="/assets/Fishdoro-SS/LoFi-Home.png"
           alt="Home screen — lo-fi wireframe" />
    </div>
    <div class="lh-card">
      <div class="lh-label-bar">
        <span class="lh-after-label">After</span>
        <span class="lh-state-text">Final design</span>
      </div>
      <img class="lb-trigger lh-img"
           src="/assets/Fishdoro-SS/HiFi-Home.png"
           alt="Home screen — final design" />
    </div>
  </div>

  <div class="lh-grid" style="margin-top: 16px;">
    <div class="lh-card">
      <div class="lh-label-bar">
        <span class="lh-before-label">Before</span>
        <span class="lh-state-text">Lo-fi wireframe</span>
      </div>
      <img class="lb-trigger lh-img"
           src="/assets/Fishdoro-SS/LoFi-Pomodoro-Session.png"
           alt="Focus timer — lo-fi wireframe" />
    </div>
    <div class="lh-card">
      <div class="lh-label-bar">
        <span class="lh-after-label">After</span>
        <span class="lh-state-text">Final design</span>
      </div>
      <img class="lb-trigger lh-img"
           src="/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png"
           alt="Focus timer — final design" />
    </div>
  </div>

CSS:
  .lh-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .lh-card {
    border-radius: 10px;
    overflow: hidden;
    border: 0.5px solid rgba(154,175,122,0.3);
    position: relative;
  }

  .lh-label-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #fafafa;
    border-bottom: 0.5px solid rgba(154,175,122,0.2);
  }

  .lh-before-label,
  .lh-after-label {
    font-size: 12px;
    font-weight: 600;
    color: #2d4a1e;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .lh-state-text {
    font-size: 12px;
    font-weight: 300;
    color: #9aaf7a;
  }

  .lh-img {
    width: 100%;
    height: 320px;
    object-fit: contain;
    background: #f5f5f5;
    display: block;
  }

  @media (max-width: 480px) {
    .lh-grid { grid-template-columns: 1fr; }
    .lh-img { height: 220px; }
  }

---

FIX 8 — Hi-fi screens: object-fit contain, no cropping (fishdoro.astro)

In <style>, update .hifi-img:
  .hifi-img {
    width: 100%;
    height: 340px;
    object-fit: contain;      /* was cover — change to contain */
    background: #f5f5f5;
    border-radius: 10px;
    border: 0.5px solid rgba(154, 175, 122, 0.3);
    display: block;
  }

---

FIX 9 — Increase spacing between sections/headings (fishdoro.astro)

In <style>, increase spacing for section headings and between sections:
  .cs-section-title {
    margin-top: 40px;    /* was 8px — increase significantly */
    margin-bottom: 12px;
  }

  .cs-divider {
    margin: 56px 0;      /* was 40px */
  }

  .cs-section {
    gap: 20px;           /* was 16px */
  }

---

FIX 10 — LofiHifiFade section: update title to 2 lines + move hint outside (fishdoro.astro)

Find the "From wireframe to final design" / "Hover to see where it started" section.

Update the title:
  Change: "Hover to see where it started"
  To: "From wireframe\nto final design"

Or in HTML:
  <h2 class="cs-section-title">
    From wireframe<br>to final design
  </h2>

Remove the subtitle text "The hi-fi screens above are the result..."
and replace with a hint text OUTSIDE and BELOW the image cards:

  <p class="lh-hint-text">
    Compare the lo-fi wireframe with the final design — click any image to zoom.
  </p>

CSS for hint text:
  .lh-hint-text {
    font-size: 13px;
    font-weight: 300;
    color: #9aaf7a;
    text-align: center;
    margin-top: 10px;
    font-style: italic;
  }

---

FIX 11 — Key Takeaways: add hover state to show interactivity (fishdoro.astro)

In <style>, add hover effect to .ta-header to clearly signal
that it's clickable even before clicking:

  .ta-header {
    /* existing styles... */
    transition: background 0.15s ease, color 0.15s ease;
  }

  .ta-header:hover {
    background: #f5f8f0;      /* light green tint */
  }

  .ta-header:hover .ta-title {
    color: #4e7a30;            /* green on hover to signal clickable */
  }

  .ta-header:hover .ta-arrow {
    color: #4e7a30;
    transform: translateY(2px); /* subtle nudge down */
  }

  /* When already open, keep green */
  .ta-header[aria-expanded="true"] .ta-title {
    color: #2d4a1e;
  }
```

---

## Summary

| Fix | File | What changes |
|---|---|---|
| 1 | fishdoro.astro | Remove intro paragraphs from header |
| 2 | FlipCards.astro | Change to vertical 1-column layout |
| 3 | FlipCards.astro | Increase font sizes: body 16px, sub 12px |
| 4 | FlipCards.astro | Add hover animation (lift + shadow) |
| 5 | ProblemFramework.astro | "From insight" → bold, darker color |
| 6 | fishdoro.astro | Hover scale on all lb-trigger, hint text 12px |
| 7 | LofiHifiFade.astro | Static side-by-side, Before left / After right |
| 8 | fishdoro.astro | hifi-img object-fit contain, no cropping |
| 9 | fishdoro.astro | More spacing between headings and sections |
| 10 | fishdoro.astro | LofiHifiFade title 2 lines, hint outside images |
| 11 | fishdoro.astro | Key Takeaways hover: green tint + title color |

---

## Order of implementation

1. Fix 1 — header cleanup (fishdoro.astro)
2. Fix 9 — spacing (fishdoro.astro)
3. Fix 6 — hover + hint size (fishdoro.astro)
4. Fix 8 — hifi object-fit (fishdoro.astro)
5. Fix 10 — lofi-hifi title + hint (fishdoro.astro)
6. Fix 11 — takeaway hover (fishdoro.astro)
7. Fix 2 + 3 + 4 — flip cards layout + size + hover (FlipCards.astro)
8. Fix 5 — problem framework (ProblemFramework.astro)
9. Fix 7 — lofi-hifi static layout (LofiHifiFade.astro)
