# Fishdoro — Flip Cards Component
*Discover section — replaces the three insight paragraphs*
*Front: Reddit quote · Back: insight name + description + confidence*

---

## Copilot Prompt

```
Create an Astro component called FlipCards.astro for the Fishdoro case study
Discover section.

Three cards in a row. Each card has a front face showing a real Reddit quote
and a back face showing the insight derived from it. Click to flip.
Keyboard accessible (Enter/Space).

FONT: Inter (already imported)
All font sizes must be multiples of 2.
No external libraries — plain HTML + CSS + vanilla JS.

LAYOUT:
- Three cards in CSS grid: grid-template-columns 1fr 1fr 1fr, gap 12px
- Each card height: 180px desktop / auto min-height 140px Android
- Android (≤480px): grid-template-columns 1fr (stack vertically)

EACH CARD STRUCTURE:
- Outer wrapper (.flip-card): perspective 1000px, cursor pointer
  tabindex="0", role="button", aria-label per card
- Inner wrapper (.flip-inner): transform-style preserve-3d,
  transition transform 0.5s ease, border-radius 10px
- When .flipped class on outer: .flip-inner rotates rotateY(180deg)

FRONT FACE (.flip-front):
  position absolute, inset 0, backface-visibility hidden
  background #ffffff, border 0.5px solid rgba(154,175,122,0.3)
  border-radius 10px, padding 14px
  display flex, flex-direction column, justify-content space-between
  - Quote text: Inter 300, 12px, italic, color #5a7040, line-height 1.6, flex 1
  - Hint text: "Click to reveal insight"
    Inter 400, 10px, color #b0c890, letter-spacing 0.06em

BACK FACE (.flip-back):
  same as front but transform rotateY(180deg)
  background #f5f0e8, border 0.5px solid rgba(107,143,78,0.4)
  - Label: Inter 500, 12px, color #2d4a1e, margin-bottom 6px
  - Insight text: Inter 300, 12px, color #5a7040, line-height 1.5, flex 1
  - Confidence: Inter 500, 10px, color #6b8f4e

CARD 1:
  aria-label: "Flip card: Rigidity insight"
  Front quote: "Longer Pomodoros work better for me. I prefer 45 min focus,
    15 min short break, 30 min long break."
  Back label: "Rigidity breaks flow"
  Back insight: "The classic 25/5 cycle doesn't adapt to how people actually
    work. Many users described interrupting deep focus just because the timer
    said so — and never getting back into it."
  Confidence: "High confidence"

CARD 2:
  aria-label: "Flip card: Gamification insight"
  Front quote: "Leaderboards only help top students. The rest feel discouraged."
  Back label: "Gamification can backfire"
  Back insight: "Points, leaderboards, and streaks create pressure instead of
    motivation. Users described feeling like they were gaming the system rather
    than actually working."
  Confidence: "High confidence"

CARD 3:
  aria-label: "Flip card: Retention insight"
  Front quote: "Gamified apps get boring when nothing changes.
    I need unpredictability."
  Back label: "Novelty fades without discovery"
  Back insight: "Apps that felt exciting at first became boring once users had
    seen everything. What kept people engaged was unpredictability — not
    knowing what comes next."
  Confidence: "Medium confidence"

JS BEHAVIOR:
  Click: toggle .flipped class on .flip-card
  Keyboard: Enter or Space also toggles .flipped
  Each card independent — flipping one doesn't affect others
```

---

## Full HTML + CSS + JS Code

```html
---
// FlipCards.astro — no props needed
---

<div class="fc-grid">

  <!-- Card 1: Rigidity -->
  <div class="fc-card" tabindex="0" role="button"
       aria-label="Flip card: Rigidity insight">
    <div class="fc-inner">
      <div class="fc-front">
        <p class="fc-quote">"Longer Pomodoros work better for me. I prefer
        45 min focus, 15 min short break, 30 min long break."</p>
        <span class="fc-hint">Click to reveal insight</span>
      </div>
      <div class="fc-back">
        <p class="fc-label">Rigidity breaks flow</p>
        <p class="fc-insight">The classic 25/5 cycle doesn't adapt to how
        people actually work. Many users described interrupting deep focus
        just because the timer said so — and never getting back into it.</p>
        <span class="fc-confidence">High confidence</span>
      </div>
    </div>
  </div>

  <!-- Card 2: Gamification -->
  <div class="fc-card" tabindex="0" role="button"
       aria-label="Flip card: Gamification insight">
    <div class="fc-inner">
      <div class="fc-front">
        <p class="fc-quote">"Leaderboards only help top students.
        The rest feel discouraged."</p>
        <span class="fc-hint">Click to reveal insight</span>
      </div>
      <div class="fc-back">
        <p class="fc-label">Gamification can backfire</p>
        <p class="fc-insight">Points, leaderboards, and streaks create
        pressure instead of motivation. Users described feeling like they
        were gaming the system rather than actually working.</p>
        <span class="fc-confidence">High confidence</span>
      </div>
    </div>
  </div>

  <!-- Card 3: Retention -->
  <div class="fc-card" tabindex="0" role="button"
       aria-label="Flip card: Retention insight">
    <div class="fc-inner">
      <div class="fc-front">
        <p class="fc-quote">"Gamified apps get boring when nothing changes.
        I need unpredictability."</p>
        <span class="fc-hint">Click to reveal insight</span>
      </div>
      <div class="fc-back">
        <p class="fc-label">Novelty fades without discovery</p>
        <p class="fc-insight">Apps that felt exciting at first became boring
        once users had seen everything. What kept people engaged was
        unpredictability — not knowing what comes next.</p>
        <span class="fc-confidence">Medium confidence</span>
      </div>
    </div>
  </div>

</div>

<style>
  .fc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .fc-card {
    height: 180px;
    perspective: 1000px;
    cursor: pointer;
    outline: none;
  }

  .fc-card:focus-visible .fc-inner {
    box-shadow: 0 0 0 2px #6b8f4e;
    border-radius: 10px;
  }

  .fc-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
    border-radius: 10px;
  }

  .fc-card.flipped .fc-inner {
    transform: rotateY(180deg);
  }

  .fc-front,
  .fc-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .fc-front {
    background: #ffffff;
    border: 0.5px solid rgba(154, 175, 122, 0.3);
  }

  .fc-back {
    background: #f5f0e8;
    border: 0.5px solid rgba(107, 143, 78, 0.4);
    transform: rotateY(180deg);
  }

  .fc-quote {
    font-size: 12px;
    font-weight: 300;
    font-style: italic;
    color: #5a7040;
    line-height: 1.6;
    flex: 1;
  }

  .fc-hint {
    font-size: 10px;
    font-weight: 400;
    color: #b0c890;
    letter-spacing: 0.06em;
    margin-top: 8px;
  }

  .fc-label {
    font-size: 12px;
    font-weight: 500;
    color: #2d4a1e;
    margin-bottom: 6px;
  }

  .fc-insight {
    font-size: 12px;
    font-weight: 300;
    color: #5a7040;
    line-height: 1.5;
    flex: 1;
  }

  .fc-confidence {
    font-size: 10px;
    font-weight: 500;
    color: #6b8f4e;
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    .fc-grid {
      grid-template-columns: 1fr;
    }
    .fc-card {
      height: auto;
      min-height: 140px;
    }
  }
</style>

<script>
  document.querySelectorAll('.fc-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped')
    })
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        card.classList.toggle('flipped')
      }
    })
  })
</script>
```

---

## How to use

```astro
---
import FlipCards from '../components/FlipCards.astro'
---

<!-- After Discover intro paragraphs, before bridge sentence -->
<FlipCards />
<p class="cs-body">These three patterns became the foundation for every
major decision in Fishdoro.</p>
```
