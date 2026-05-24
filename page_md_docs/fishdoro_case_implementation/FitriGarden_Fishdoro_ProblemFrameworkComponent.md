# Fishdoro — Problem Framework Component
*Ready-to-use Copilot prompt + full HTML/CSS code*
*Drop this into your Astro case study page — Define section*

---

## Copilot Prompt

```
Create an Astro component called ProblemFramework.astro for the Fishdoro case study page.

The component displays three design problems derived from research,
laid out as a clean 3-column card row with a colored top border per card.

FONT: Inter (already imported in layout)
BACKGROUND: transparent (inherits from parent)
All font sizes must be multiples of 2.
No external libraries needed — plain HTML + CSS only.

LAYOUT:

SECTION 1 — Header (text-align center, margin-bottom 20px):
  - Eyebrow: "From research to design problems"
    Inter 500, 10px, uppercase, letter-spacing 0.16em, color #9aaf7a
  - Title: "Three problems that shaped every decision in Fishdoro"
    Inter 500, 20px, color #2d4a1e, line-height 1.3

SECTION 2 — Three cards (CSS grid, 1fr 1fr 1fr, gap 16px):

  Each card:
  - background: #ffffff
  - border: 0.5px solid rgba(154,175,122,0.3)
  - border-radius: 12px
  - border-top: 4px solid [color per card]
  - padding: 18px 16px

  Inside each card (top to bottom):
  A. Problem type badge:
     - Small pill: Inter 500, 10px, uppercase, letter-spacing 0.08em
     - Padding: 3px 10px, border-radius 99px
     - Color and bg per card (see below)

  B. Problem name:
     - Inter 500, 16px, color #2d4a1e, margin-top 10px, margin-bottom 6px

  C. Problem description:
     - Inter 300, 14px, color #5a7040, line-height 1.7

  D. Insight source (bottom of card):
     - Small label: "From insight:" Inter 500, 10px, uppercase, color #9aaf7a
     - Source text: Inter 300, 12px, color #6b8f4e, font-style italic

  CARD 1 — Flexibility Problem
  border-top color: #8aad5a
  Badge bg: rgba(200,219,160,0.3) · Badge color: #4e7a30
  Badge text: "Flexibility"
  Name: "Flexibility Problem"
  Desc: "Pomodoro's rigid 25/5 structure works for some people, but breaks
  focus for others. A tool that forces a break at exactly 25 minutes is a
  tool that prioritizes its own logic over the user's momentum."
  Insight source: "Rigidity breaks flow"

  CARD 2 — Motivation Problem
  border-top color: #e0a050
  Badge bg: rgba(240,200,138,0.3) · Badge color: #9a5a10
  Badge text: "Motivation"
  Name: "Motivation Problem"
  Desc: "Most gamified productivity apps treat rewards as external pressure
  — streaks you can't break, leaderboards that compare you to others. This
  shifts the goal from doing meaningful work to maintaining a score."
  Insight source: "Gamification can backfire"

  CARD 3 — Retention Problem
  border-top color: #b098d0
  Badge bg: rgba(216,200,232,0.3) · Badge color: #7a58a8
  Badge text: "Retention"
  Name: "Retention Problem"
  Desc: "Apps feel exciting at first, then predictable, then invisible.
  Without a sense of discovery or progression, there's no reason to come
  back. The app becomes just another notification to dismiss."
  Insight source: "Novelty fades without discovery"

SECTION 3 — Design brief (margin-top 20px):
  - Thin divider: border-top 0.5px solid rgba(154,175,122,0.25), margin 20px 0
  - Label: "Design brief" — Inter 500, 10px, uppercase, letter-spacing 0.12em, color #9aaf7a
  - Brief text (border-left 2.5px solid rgba(107,143,78,0.4), padding-left 16px):
    Inter 300, 14px, color #5a7040, line-height 1.7, font-style italic
    Text: "Build a timer that bends to the user's rhythm, rewards focus
    without pressuring it, and gives people a small reason to come back
    tomorrow. That brief became Fishdoro."

RESPONSIVE:
- Tablet (≤1024px): 3 columns stay, gap reduces to 12px
- Android (≤480px): stack to 1 column
```

---

## Full HTML + CSS Code

```html
---
// ProblemFramework.astro — no props needed
---

<section class="problem-framework">

  <!-- Header -->
  <div class="pf-header">
    <p class="pf-eyebrow">From research to design problems</p>
    <h2 class="pf-title">Three problems that shaped every decision in Fishdoro</h2>
  </div>

  <!-- Three cards -->
  <div class="pf-grid">

    <div class="pf-card pf-card-green">
      <span class="pf-badge pf-badge-green">Flexibility</span>
      <h3 class="pf-name">Flexibility Problem</h3>
      <p class="pf-desc">Pomodoro's rigid 25/5 structure works for some people, but breaks focus for others. A tool that forces a break at exactly 25 minutes is a tool that prioritizes its own logic over the user's momentum.</p>
      <div class="pf-source">
        <span class="pf-source-label">From insight:</span>
        <span class="pf-source-text">Rigidity breaks flow</span>
      </div>
    </div>

    <div class="pf-card pf-card-orange">
      <span class="pf-badge pf-badge-orange">Motivation</span>
      <h3 class="pf-name">Motivation Problem</h3>
      <p class="pf-desc">Most gamified productivity apps treat rewards as external pressure — streaks you can't break, leaderboards that compare you to others. This shifts the goal from doing meaningful work to maintaining a score.</p>
      <div class="pf-source">
        <span class="pf-source-label">From insight:</span>
        <span class="pf-source-text">Gamification can backfire</span>
      </div>
    </div>

    <div class="pf-card pf-card-purple">
      <span class="pf-badge pf-badge-purple">Retention</span>
      <h3 class="pf-name">Retention Problem</h3>
      <p class="pf-desc">Apps feel exciting at first, then predictable, then invisible. Without a sense of discovery or progression, there's no reason to come back. The app becomes just another notification to dismiss.</p>
      <div class="pf-source">
        <span class="pf-source-label">From insight:</span>
        <span class="pf-source-text">Novelty fades without discovery</span>
      </div>
    </div>

  </div>

  <!-- Design brief -->
  <hr class="pf-divider" />
  <p class="pf-brief-label">Design brief</p>
  <div class="pf-brief">
    <p class="pf-brief-text">Build a timer that bends to the user's rhythm, rewards focus without pressuring it, and gives people a small reason to come back tomorrow. That brief became Fishdoro.</p>
  </div>

</section>

<style>
  .problem-framework {
    margin-bottom: 24px;
  }

  /* Header */
  .pf-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .pf-eyebrow {
    font-size: 10px;
    font-weight: 500;
    color: #9aaf7a;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .pf-title {
    font-size: 20px;
    font-weight: 500;
    color: #2d4a1e;
    line-height: 1.3;
  }

  /* Grid */
  .pf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  /* Cards */
  .pf-card {
    background: #ffffff;
    border: 0.5px solid rgba(154, 175, 122, 0.3);
    border-radius: 12px;
    border-top: 4px solid transparent;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .pf-card-green  { border-top-color: #8aad5a; }
  .pf-card-orange { border-top-color: #e0a050; }
  .pf-card-purple { border-top-color: #b098d0; }

  /* Badge */
  .pf-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 99px;
    padding: 3px 10px;
    width: fit-content;
  }
  .pf-badge-green  { background: rgba(200,219,160,0.3); color: #4e7a30; }
  .pf-badge-orange { background: rgba(240,200,138,0.3); color: #9a5a10; }
  .pf-badge-purple { background: rgba(216,200,232,0.3); color: #7a58a8; }

  /* Content */
  .pf-name {
    font-size: 16px;
    font-weight: 500;
    color: #2d4a1e;
    margin-top: 10px;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .pf-desc {
    font-size: 14px;
    font-weight: 300;
    color: #5a7040;
    line-height: 1.7;
    flex: 1;
    margin-bottom: 12px;
  }

  /* Source */
  .pf-source {
    display: flex;
    align-items: center;
    gap: 5px;
    padding-top: 10px;
    border-top: 0.5px solid rgba(154,175,122,0.2);
  }
  .pf-source-label {
    font-size: 10px;
    font-weight: 500;
    color: #9aaf7a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .pf-source-text {
    font-size: 12px;
    font-weight: 300;
    color: #6b8f4e;
    font-style: italic;
  }

  /* Design brief */
  .pf-divider {
    border: none;
    border-top: 0.5px solid rgba(154, 175, 122, 0.25);
    margin: 20px 0;
  }
  .pf-brief-label {
    font-size: 10px;
    font-weight: 500;
    color: #9aaf7a;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .pf-brief {
    border-left: 2.5px solid rgba(107, 143, 78, 0.4);
    padding-left: 16px;
  }
  .pf-brief-text {
    font-size: 14px;
    font-weight: 300;
    color: #5a7040;
    line-height: 1.7;
    font-style: italic;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .pf-grid { gap: 12px; }
    .pf-title { font-size: 18px; }
  }

  @media (max-width: 480px) {
    .pf-grid { grid-template-columns: 1fr; }
    .pf-title { font-size: 16px; }
  }
</style>
```

---

## How to use in your case study page

```astro
---
import ProblemFramework from '../components/ProblemFramework.astro'
---

<!-- After Define opening paragraph -->
<ProblemFramework />

<!-- Then continue with design brief closing and Develop section -->
```

---

## Notes

- Placed in the **Define section**, after the opening paragraph about the core tension
- The "From insight" line at the bottom of each card directly connects Define back to Discover — this closes the gap the mentor mentioned
- Design brief at the bottom acts as the bridge sentence into Develop
- All font sizes are multiples of 2 ✓
- No external libraries needed ✓
- Fully responsive ✓
- Colors match portfolio warm palette ✓
