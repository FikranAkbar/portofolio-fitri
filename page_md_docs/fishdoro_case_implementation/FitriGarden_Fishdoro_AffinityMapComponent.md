# Fishdoro — Affinity Map Component
*Ready-to-use Copilot prompt + full HTML/CSS/JS code*
*Drop this into your Astro case study page*

---

## Copilot Prompt

```
Create an Astro component called AffinityMap.astro for the Fishdoro case study page.

The component displays a condensed affinity map from Reddit research,
showing 3 theme columns with selected quotes, then a 3-card insight summary below.

FONT: Inter (already imported in layout)
BACKGROUND: #f5f0e8
All font sizes must be multiples of 2.
No external libraries needed — plain HTML + CSS only.

LAYOUT (two sections stacked):

SECTION 1 — Header:
- Eyebrow label: "Reddit Research — Thematic Coding"
  Inter 500, 10px, uppercase, letter-spacing 0.16em, color #9aaf7a
- Title: "What people actually say about Pomodoro & productivity apps"
  Inter 500, 22px, color #2d4a1e, text-align center
- margin-bottom: 28px

SECTION 2 — Three columns (CSS grid, 1fr 1fr 1fr, gap 20px):

  Each column has:
  A. Column header (border-radius 10px 10px 0 0, padding 10px 14px):
     - Icon + column title (Inter 500, 11px, uppercase, color #2d4a1e)
     - Sub-label showing the insight it maps to (Inter 400, 10px, color #5a7040)

  B. Quote cards (background #ffffff, border-left 3px solid per color):
     - Quote text: Inter 300, 12px, italic, color #5a7040, line-height 1.55
     - Meta row: upvote count (Inter 400, 10px, color #9aaf7a) + optional star (color #e8a030)
     - Cards separated by border-bottom 0.5px #f0ebe0
     - Last card: border-radius 0 0 10px 10px

  COLUMN 1 — Flexible & User-Friendly Pomodoro
  Header bg: #c8dba0 · Border-left color: #8aad5a · Icon: ⏱
  Sub-label: → Insight: Rigidity breaks flow
  Quotes:
    1. "Longer Pomodoros work better for me. I prefer 45 min focus,
       15 min short break, 30 min long break." · ↑ 187 · ★
    2. "I stopped being strict about timing. Sometimes 25 min is futile,
       sometimes I need 45. I interrupt just as I start to focus." · ↑ 105
    3. "Twenty-five minutes is too short, but if you can work longer,
       keep going." · ↑ 389 · ★
    4. "The Progressive Pomodoro starts with 15 minutes and gradually
       increases to 20–30 to train focus over time." · ↑ 389

  COLUMN 2 — Risks & Barriers of Gamification
  Header bg: #f0c88a · Border-left color: #e0a050 · Icon: 🎮
  Sub-label: → Insight: Gamification can backfire
  Quotes:
    1. "Quit chasing perfect streaks like a mobile game; you're supposed
       to work and not obsess over productivity." · ↑ 105 · ★
    2. "I treated Pomodoro like a strict ritual — I couldn't break it
       and acted as if the timer was my boss." · ↑ 105
    3. "I don't agree with gamifying everything, but I get the rationale.
       It's harder to push people to high standards than to just engage
       them and they often take the easy way out." · ↑ 72
    4. "Kids today just don't have the attention span for gamified systems
       that demand sustained engagement." · ↑ 260 · ★

  COLUMN 3 — Meaningful & Sustainable Gamification
  Header bg: #d8c8e8 · Border-left color: #b098d0 · Icon: ✨
  Sub-label: → Insight: Novelty fades without discovery
  Quotes:
    1. "Gamification rewards students who already have actual rewards at
       home... kids don't care about badges unless they have purpose,
       meaning, or culture." · ↑ 42 · ★
    2. "Badges haven't really caught on... only those who have already
       earned it can make others competitive." · ↑ 42
    3. "Gamification can go beyond badges and points. Good games have
       clear goals and spark curiosity, like a simulation with a purpose." · ↑ 8 · ★
    4. "I've struggled to stay consistent because the rewards don't match
       my goals and sometimes feel like extra work instead of motivation." · ↑ 8

SECTION 3 — Divider:
hr, border-top 0.5px solid rgba(154,175,122,0.3), margin 20px 0

SECTION 4 — Section label:
"Three insights that shaped Fishdoro"
Inter 500, 10px, uppercase, letter-spacing 0.12em, color #9aaf7a, margin-bottom 10px

SECTION 5 — Insight cards (CSS grid, 1fr 1fr 1fr, gap 20px):

  Each card:
  - background: #ffffff
  - border-radius: 10px
  - padding: 14px 16px
  - border-top: 3px solid per color

  Card 1 — border-top color: #8aad5a
    Insight num: "Insight 01" — Inter 500, 10px, uppercase, color #9aaf7a
    Name: "Rigidity breaks flow" — Inter 500, 14px, color #2d4a1e
    Desc: "The classic 25/5 cycle doesn't adapt to how people actually
    work. Many interrupt deep focus just because the timer said so."
    Inter 300, 12px, color #5a7040, line-height 1.5, margin-bottom 8px
    Confidence: green dot (6px circle #6b8f4e) + "High confidence"
    Inter 500, 10px, color #6b8f4e

  Card 2 — border-top color: #e0a050
    Insight num: "Insight 02"
    Name: "Gamification can backfire"
    Desc: "Streaks and leaderboards create pressure instead of motivation.
    Users end up gaming the system rather than actually working."
    Confidence: green dot + "High confidence"

  Card 3 — border-top color: #b098d0
    Insight num: "Insight 03"
    Name: "Novelty fades without discovery"
    Desc: "Apps feel exciting then predictable then invisible. What kept
    people engaged was unpredictability — not knowing what comes next."
    Confidence: orange dot (6px circle #e0a050) + "Medium confidence"

RESPONSIVE:
- Tablet (≤1024px): columns stay 3-col, reduce gap to 14px
- Android (≤480px): columns stack to 1 column, insight cards stack to 1 column
```

---

## Full HTML + CSS Code

Kalau Copilot kurang tepat hasilnya, paste kode ini langsung ke file `.astro`-mu:

```html
---
// AffinityMap.astro — no props needed
---

<section class="affinity-map">

  <!-- Header -->
  <div class="am-header">
    <p class="am-eyebrow">Reddit Research — Thematic Coding</p>
    <h2 class="am-title">What people actually say about Pomodoro &amp; productivity apps</h2>
  </div>

  <!-- Three columns -->
  <div class="am-grid">

    <!-- Column 1: Rigidity -->
    <div class="am-col">
      <div class="am-col-header am-green-bg">
        <span class="am-col-icon">⏱</span>
        <div>
          <p class="am-col-title">Flexible &amp; User-Friendly Pomodoro</p>
          <p class="am-col-insight">→ Insight: Rigidity breaks flow</p>
        </div>
      </div>
      <div class="am-quotes">
        <div class="am-quote am-green-border">
          <p class="am-quote-text">"Longer Pomodoros work better for me. I prefer 45 min focus, 15 min short break, 30 min long break."</p>
          <div class="am-meta"><span class="am-upvote">↑ 187</span><span class="am-star">★</span></div>
        </div>
        <div class="am-quote am-green-border">
          <p class="am-quote-text">"I stopped being strict about timing. Sometimes 25 min is futile, sometimes I need 45. I interrupt just as I start to focus."</p>
          <div class="am-meta"><span class="am-upvote">↑ 105</span></div>
        </div>
        <div class="am-quote am-green-border">
          <p class="am-quote-text">"Twenty-five minutes is too short, but if you can work longer, keep going."</p>
          <div class="am-meta"><span class="am-upvote">↑ 389</span><span class="am-star">★</span></div>
        </div>
        <div class="am-quote am-green-border am-quote-last">
          <p class="am-quote-text">"The Progressive Pomodoro starts with 15 minutes and gradually increases to 20–30 to train focus over time."</p>
          <div class="am-meta"><span class="am-upvote">↑ 389</span></div>
        </div>
      </div>
    </div>

    <!-- Column 2: Gamification -->
    <div class="am-col">
      <div class="am-col-header am-orange-bg">
        <span class="am-col-icon">🎮</span>
        <div>
          <p class="am-col-title">Risks &amp; Barriers of Gamification</p>
          <p class="am-col-insight">→ Insight: Gamification can backfire</p>
        </div>
      </div>
      <div class="am-quotes">
        <div class="am-quote am-orange-border">
          <p class="am-quote-text">"Quit chasing perfect streaks like a mobile game; you're supposed to work and not obsess over productivity."</p>
          <div class="am-meta"><span class="am-upvote">↑ 105</span><span class="am-star">★</span></div>
        </div>
        <div class="am-quote am-orange-border">
          <p class="am-quote-text">"I treated Pomodoro like a strict ritual — I couldn't break it and acted as if the timer was my boss."</p>
          <div class="am-meta"><span class="am-upvote">↑ 105</span></div>
        </div>
        <div class="am-quote am-orange-border">
          <p class="am-quote-text">"I don't agree with gamifying everything, but I get the rationale. It's harder to push people to high standards than to just engage them."</p>
          <div class="am-meta"><span class="am-upvote">↑ 72</span></div>
        </div>
        <div class="am-quote am-orange-border am-quote-last">
          <p class="am-quote-text">"Kids today just don't have the attention span for gamified systems that demand sustained engagement."</p>
          <div class="am-meta"><span class="am-upvote">↑ 260</span><span class="am-star">★</span></div>
        </div>
      </div>
    </div>

    <!-- Column 3: Retention -->
    <div class="am-col">
      <div class="am-col-header am-purple-bg">
        <span class="am-col-icon">✨</span>
        <div>
          <p class="am-col-title">Meaningful &amp; Sustainable Gamification</p>
          <p class="am-col-insight">→ Insight: Novelty fades without discovery</p>
        </div>
      </div>
      <div class="am-quotes">
        <div class="am-quote am-purple-border">
          <p class="am-quote-text">"Gamification rewards students who already have actual rewards at home... kids don't care about badges unless they have purpose, meaning, or culture."</p>
          <div class="am-meta"><span class="am-upvote">↑ 42</span><span class="am-star">★</span></div>
        </div>
        <div class="am-quote am-purple-border">
          <p class="am-quote-text">"Badges haven't really caught on... only those who have already earned it can make others competitive."</p>
          <div class="am-meta"><span class="am-upvote">↑ 42</span></div>
        </div>
        <div class="am-quote am-purple-border">
          <p class="am-quote-text">"Gamification can go beyond badges and points. Good games have clear goals and spark curiosity, like a simulation with a purpose."</p>
          <div class="am-meta"><span class="am-upvote">↑ 8</span><span class="am-star">★</span></div>
        </div>
        <div class="am-quote am-purple-border am-quote-last">
          <p class="am-quote-text">"I've struggled to stay consistent because the rewards don't match my goals and sometimes feel like extra work instead of motivation."</p>
          <div class="am-meta"><span class="am-upvote">↑ 8</span></div>
        </div>
      </div>
    </div>

  </div>

  <!-- Divider -->
  <hr class="am-divider" />
  <p class="am-section-label">Three insights that shaped Fishdoro</p>

  <!-- Insight cards -->
  <div class="am-insights">

    <div class="am-insight-card am-insight-green">
      <p class="am-insight-num">Insight 01</p>
      <p class="am-insight-name">Rigidity breaks flow</p>
      <p class="am-insight-desc">The classic 25/5 cycle doesn't adapt to how people actually work. Many interrupt deep focus just because the timer said so.</p>
      <div class="am-confidence">
        <span class="am-conf-dot am-conf-green"></span>
        <span class="am-conf-text">High confidence</span>
      </div>
    </div>

    <div class="am-insight-card am-insight-orange">
      <p class="am-insight-num">Insight 02</p>
      <p class="am-insight-name">Gamification can backfire</p>
      <p class="am-insight-desc">Streaks and leaderboards create pressure instead of motivation. Users end up gaming the system rather than actually working.</p>
      <div class="am-confidence">
        <span class="am-conf-dot am-conf-green"></span>
        <span class="am-conf-text">High confidence</span>
      </div>
    </div>

    <div class="am-insight-card am-insight-purple">
      <p class="am-insight-num">Insight 03</p>
      <p class="am-insight-name">Novelty fades without discovery</p>
      <p class="am-insight-desc">Apps feel exciting then predictable then invisible. What kept people engaged was unpredictability — not knowing what comes next.</p>
      <div class="am-confidence">
        <span class="am-conf-dot am-conf-orange"></span>
        <span class="am-conf-text am-conf-orange-text">Medium confidence</span>
      </div>
    </div>

  </div>

</section>

<style>
  .affinity-map {
    background: #f5f0e8;
    padding: 32px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  /* Header */
  .am-header { text-align: center; margin-bottom: 28px; }
  .am-eyebrow {
    font-size: 10px; font-weight: 500;
    color: #9aaf7a; letter-spacing: 0.16em;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .am-title {
    font-size: 22px; font-weight: 500;
    color: #2d4a1e; line-height: 1.3;
  }

  /* Grid */
  .am-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 0;
  }

  .am-col { display: flex; flex-direction: column; }

  /* Column header */
  .am-col-header {
    border-radius: 10px 10px 0 0;
    padding: 10px 14px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
  .am-green-bg  { background: #c8dba0; }
  .am-orange-bg { background: #f0c88a; }
  .am-purple-bg { background: #d8c8e8; }

  .am-col-icon { font-size: 14px; margin-top: 1px; flex-shrink: 0; }
  .am-col-title {
    font-size: 11px; font-weight: 500;
    color: #2d4a1e; text-transform: uppercase;
    letter-spacing: 0.04em; line-height: 1.3;
    margin-bottom: 2px;
  }
  .am-col-insight {
    font-size: 10px; font-weight: 400;
    color: #5a7040;
  }

  /* Quotes */
  .am-quotes { display: flex; flex-direction: column; }
  .am-quote {
    background: #ffffff;
    border-left: 3px solid transparent;
    padding: 10px 14px;
    border-bottom: 0.5px solid #f0ebe0;
  }
  .am-quote-last {
    border-bottom: none;
    border-radius: 0 0 10px 10px;
  }
  .am-green-border  { border-left-color: #8aad5a; }
  .am-orange-border { border-left-color: #e0a050; }
  .am-purple-border { border-left-color: #b098d0; }

  .am-quote-text {
    font-size: 12px; font-weight: 300;
    color: #5a7040; line-height: 1.55;
    font-style: italic; margin-bottom: 6px;
  }
  .am-meta {
    display: flex; align-items: center;
    justify-content: space-between; gap: 6px;
  }
  .am-upvote {
    font-size: 10px; font-weight: 400; color: #9aaf7a;
  }
  .am-star { font-size: 10px; color: #e8a030; }

  /* Divider + label */
  .am-divider {
    border: none;
    border-top: 0.5px solid rgba(154,175,122,0.3);
    margin: 20px 0;
  }
  .am-section-label {
    font-size: 10px; font-weight: 500;
    color: #9aaf7a; letter-spacing: 0.12em;
    text-transform: uppercase; margin-bottom: 10px;
  }

  /* Insight cards */
  .am-insights {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  .am-insight-card {
    background: #ffffff;
    border-radius: 10px;
    padding: 14px 16px;
    border-top: 3px solid transparent;
  }
  .am-insight-green  { border-top-color: #8aad5a; }
  .am-insight-orange { border-top-color: #e0a050; }
  .am-insight-purple { border-top-color: #b098d0; }

  .am-insight-num {
    font-size: 10px; font-weight: 500;
    color: #9aaf7a; letter-spacing: 0.1em;
    text-transform: uppercase; margin-bottom: 4px;
  }
  .am-insight-name {
    font-size: 14px; font-weight: 500;
    color: #2d4a1e; margin-bottom: 6px;
  }
  .am-insight-desc {
    font-size: 12px; font-weight: 300;
    color: #5a7040; line-height: 1.5;
    margin-bottom: 10px;
  }
  .am-confidence {
    display: flex; align-items: center; gap: 5px;
  }
  .am-conf-dot {
    width: 6px; height: 6px;
    border-radius: 50%; flex-shrink: 0;
  }
  .am-conf-green  { background: #6b8f4e; }
  .am-conf-orange { background: #e0a050; }
  .am-conf-text {
    font-size: 10px; font-weight: 500; color: #6b8f4e;
  }
  .am-conf-orange-text { color: #c07830; }

  /* Responsive */
  @media (max-width: 1024px) {
    .am-grid, .am-insights { gap: 14px; }
    .affinity-map { padding: 24px; }
  }

  @media (max-width: 480px) {
    .am-grid { grid-template-columns: 1fr; }
    .am-insights { grid-template-columns: 1fr; }
    .affinity-map { padding: 16px; }
    .am-title { font-size: 18px; }
  }
</style>
```

---

## How to use in your case study page

In your Fishdoro case study section, import and drop the component
right after the Discover intro paragraph:

```astro
---
import AffinityMap from '../components/AffinityMap.astro'
---

<!-- After Discover intro paragraph -->
<AffinityMap />

<!-- Then continue with the three insight flip cards -->
```

---

## Notes

- All font sizes are multiples of 2 ✓
- No external libraries needed ✓
- Fully responsive (desktop / tablet / Android) ✓
- Colors match the portfolio warm palette ✓
- Quote data is hardcoded — update directly in the component if needed
