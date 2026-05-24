# Fishdoro Case Study — Master Implementation Document
*Complete content + screenshot mapping + code requirements for Google Copilot*
*All assets located in: /public/assets/Fishdoro-SS/*

---

## Project Goal

Implement the Fishdoro case study page in the Fitri's Garden web portfolio
(fitri.world), built with Astro + vanilla JS.

The case study is displayed as an **expand view** inside the Project Page —
when the Fishdoro card is clicked, the right content area switches from the
project grid to the full case study. The sidebar remains unchanged.

**What this document covers:**
- All text content per section, ready to paste into HTML
- Every screenshot filename, its position, and display spec
- All 8 interactive components with Copilot prompts and full code

**What this implementation should achieve:**
- Communicate the full design process: research → problem definition → iteration → final design
- Show that design decisions are traceable back to research insights
- Demonstrate that the designer built the product herself (Electron + code)
- Present an honest, unfinished-but-structured case study that reflects
  professional maturity

**Tech stack:** Astro · Vanilla JS · Plain HTML/CSS · No external libraries

---

## Asset Inventory

All files confirmed in /public/assets/Fishdoro-SS/ — all complete ✓

| Filename | Type | Used in |
|---|---|---|
| `Affinity Mapping.png` | Research visual | Discover — replaced by AffinityMap.astro component |
| `LoFi-Catch-Log-After.png` | Lo-fi revised | Before/After slider pair 4 — After |
| `LoFi-Catch-Log-Before.png` | Lo-fi wireframe | Before/After slider pair 4 — Before |
| `Hero.png` | Build screenshot | Hero cover image |
| `HiFi-App-Setting.png` | Hi-fi final | Develop — hi-fi gallery |
| `HiFi-Catch-Log.png` | Hi-fi final | Develop — hi-fi gallery |
| `HiFi-Catch-Report.png` | Hi-fi final | Develop — hi-fi gallery |
| `HiFi-Get-Fish-Timer-Finish.png` | Hi-fi final | Develop — reward reveal (WAJIB) |
| `HiFi-Home.png` | Hi-fi final | Develop — hi-fi gallery + Lo-fi vs Hi-fi fade |
| `HiFi-Pomodoro-Session.png` | Hi-fi final | Develop — timer focus (WAJIB) |
| `HiFi-Session-Setting.png` | Hi-fi final | Develop — hi-fi gallery |
| `HiFi-Session-Setup.png` | Hi-fi final | Develop — hi-fi gallery + Lo-fi vs Hi-fi fade |
| `HiFi-Break-State.png` | Hi-fi final | Develop — hi-fi gallery |
| `LoFi-Home-After.png` | Lo-fi revised | Before/After slider pair 1 — After |
| `LoFi-Home-Before.png` | Lo-fi wireframe | Before/After slider pair 1 — Before |
| `LoFi-Home.png` | Lo-fi wireframe | Lo-fi vs Hi-fi fade comparison |
| `Moodboard.png` | Visual reference | Develop — moodboard |
| `LoFi-Session-Settings-After.png` | Lo-fi revised | Before/After slider pair 3 — After |
| `LoFi-Session-Settings-Before.png` | Lo-fi wireframe | Before/After slider pair 3 — Before |
| `LoFi-Session-Setup-After.png` | Lo-fi revised | Before/After slider pair 2 — After |
| `LoFi-Session-Setup-Before.png` | Lo-fi wireframe | Before/After slider pair 2 — Before |
| `LoFi-Pomodoro-Session.png` | Lo-fi wireframe | Lo-fi vs Hi-fi fade comparison |

> **Note:** All assets complete. Affinity Map and Problem Framework
> are implemented as coded Astro components — no image files needed.

---

# SECTION 1 — HEADER

## Text content

```
Tags: UI/UX · Pixel Art · Gamification · Personal Project
Title: Fishdoro — A Focus Tool That Feels Like Play
Subtitle: A Pomodoro timer reimagined as a cozy fishing mini-game,
  where completing a focus session means catching a tiny pixel fish.
  It started as a question: can a productivity tool feel genuinely
  delightful instead of just efficient?

Meta:
  Role: UI/UX Designer · Developer
  Type: Personal exploration project
  Stack: Electron · HTML · CSS · JS

Opening paragraphs (display before meta row):
  Productivity tools have a paradox: the apps designed to help you focus
  are often the reason you stop using them. Pomodoro timers are everywhere
  — minimal, functional, and nearly identical. Most of them work fine in
  theory. But people keep quitting them.

  I wanted to understand why. And then I wanted to build something different.

  This case study documents the research, design decisions, and build
  process behind that question.
```

## Screenshot

```
FILE: Hero.png
PATH: /public/assets/Fishdoro-SS/Hero.png
DISPLAY: Full width, height 240px, border-radius 12px, object-fit cover
CAPTION: none
```

## Copilot instruction

```
Display the case study header with tags, title, subtitle, and meta row
(Role / Type / Stack). Below the meta row, show a full-width cover image:
  src="/assets/Fishdoro-SS/Hero.png"
  height 240px desktop / 200px tablet / 160px Android
  border-radius 12px, object-fit cover, bg #e8e2d8 as fallback
```

---

# SECTION 2 — DISCOVER

## Text content

```
Intro paragraph:
To understand the problem before designing a solution, I turned to Reddit —
a space where people talk honestly about their productivity habits,
frustrations, and tool preferences. I analyzed threads across three areas:
general Pomodoro discussions, opinions on gamification in productivity apps,
and user reviews of competitor apps like Forest.

To make sense of the patterns, I used thematic coding — grouping recurring
comments into themes, then assigning confidence levels based on how often
each theme appeared across different threads.

Three insights emerged consistently:
```

## Visual — Coded component (no image)

```
COMPONENT: AffinityMap.astro
POSITION: After intro paragraph
FILE: /src/components/AffinityMap.astro
NOTE: Full HTML/CSS code available in FitriGarden_Fishdoro_AffinityMapComponent.md
```

## Text content continued

```
Three insights emerged consistently:

INSIGHT 1 — Rigidity breaks flow
The classic 25/5 cycle doesn't adapt to how people actually work. Many users
described interrupting deep focus just because the timer said so — and never
getting back into it.
Confidence: High — appeared across nearly every thread discussing Pomodoro

INSIGHT 2 — Gamification can backfire
Points, leaderboards, and streaks create pressure instead of motivation.
Users described feeling like they were "gaming the system" rather than
actually working.
Confidence: High — consistent across gamification and Forest discussions

INSIGHT 3 — Novelty fades without discovery
Apps that felt exciting at first became boring once users had "seen
everything." What kept people engaged was unpredictability — not knowing
what comes next.
Confidence: Medium — appeared in several threads but less universally

Bridge sentence:
These three patterns became the foundation for every major decision in Fishdoro.
```

## Interactive component

```
COMPONENT: FlipCards (vanilla JS)
POSITION: Replaces the three insight paragraphs above
BEHAVIOR: Front shows Reddit quote, back shows insight name + desc + confidence
Full code available in FitriGarden_Fishdoro_InteractiveComponents_TodoList.md
```

---

# SECTION 3 — DEFINE

## Text content

```
Opening:
The research pointed to one core tension: people don't quit Pomodoro because
they lack discipline. They quit because the tools don't adapt to how they
actually work.

From the three insights, three design problems emerged:
```

## Visual — Coded component (no image)

```
COMPONENT: ProblemFramework.astro
POSITION: After opening paragraph
FILE: /src/components/ProblemFramework.astro
NOTE: Full HTML/CSS code available in FitriGarden_Fishdoro_ProblemFrameworkComponent.md
```

## Interactive component

```
COMPONENT: ScrollReveal (vanilla JS)
POSITION: Applied to the three problem cards inside ProblemFramework.astro
BEHAVIOR: Cards fade + slide up one by one (stagger 200ms) on scroll into view
Observer root: .cs-content (NOT window)
Full code in FitriGarden_Fishdoro_InteractiveComponents_TodoList.md
```

## Text content continued

```
Design brief (after problem cards):
These three problems shaped a clear design brief: build a timer that bends
to the user's rhythm, rewards focus without pressuring it, and gives people
a small reason to come back tomorrow.

That brief became Fishdoro.
```

---

# SECTION 4 — DEVELOP

## Sub-section: Structure first — IA and user flows

```
Text:
Before any visual work, I mapped the entire experience as an Information
Architecture and a set of core user flows — from starting a session,
customizing duration, managing breaks, receiving fish rewards, viewing the
fishing log, and adjusting settings.

The goal was to keep navigation invisible. In a tool people use while trying
to focus, every extra decision is friction. Every path through the app
needed to feel obvious without thinking.
```

## Sub-section: Visual direction — cozy by design

```
Text:
The visual language came from a simple premise: if focusing feels like
fishing, the app should look like the world you're fishing in. I built a
moodboard around pixel art, warm earth tones, soft light, and retro-game
UI references — things that feel familiar and calming rather than clinical
and optimized.

The aim was a specific emotional register: delightful enough to make you
smile when you open it, quiet enough to disappear once you start working.
```

## Screenshot — Moodboard

```
FILE: Moodboard.png
PATH: /public/assets/Fishdoro-SS/Moodboard.png
DISPLAY: Full width, height 200px, border-radius 10px, object-fit cover
CAPTION: "Moodboard — pixel art, warm tones, retro-game UI references"
POSITION: After visual direction paragraph
```

## Copilot instruction for moodboard

```
After the visual direction paragraph, show:
<div class="cs-screenshot-grid single">
  <div class="cs-screenshot">
    <div class="cs-screenshot-img tall">
      <img src="/assets/Fishdoro-SS/Moodboard.png" alt="Fishdoro moodboard" />
    </div>
    <p class="cs-screenshot-caption">
      Moodboard — pixel art, warm tones, retro-game UI references
    </p>
  </div>
</div>
```

## Sub-section: Lo-fi to hi-fi — designing by iteration

```
Text:
I started with loose sketches, moved into lo-fi wireframes, and ran informal
walkthroughs with a few people to catch early friction before investing in
visual polish. The feedback surfaced five specific issues worth iterating on
— inconsistent button hierarchy, timer customization in the wrong place, a
bait icon that looked like a primary CTA, fish rewards that felt too random,
and copy that broke the fishing theme.

Each issue had a clear fix, and each fix was traceable back to a principle
from the research: rewards should feel earned, not random. The interface
should match the mental model users bring to it. The fishing theme should be
consistent, not decorative.
```

## Interactive component — Before/After Sliders (4 pairs)

```
COMPONENT: BeforeAfterSliders.astro
POSITION: After iteration paragraph
FILE: /src/components/BeforeAfterSliders.astro
Full code in FitriGarden_Fishdoro_BeforeAfterSlidersComponent.md

PAIR 1 — Homepage Buttons
  Label: "Homepage Buttons"
  Issue: "Inconsistent button widths created unclear visual hierarchy"
  Before: /assets/Fishdoro-SS/LoFi-Home-Before.png
  After:  /assets/Fishdoro-SS/LoFi-Home-After.png
  Why: "Cleaner hierarchy creates a more polished first impression"

PAIR 2 — Timer Customization
  Label: "Timer Customization Placement"
  Issue: "Users expected timer settings on the setup screen, not elsewhere"
  Before: /assets/Fishdoro-SS/LoFi-Session-Setup-Before.png
  After:  /assets/Fishdoro-SS/LoFi-Session-Setup-After.png
  Why: "Matches the mental model users already bring to Pomodoro apps"

PAIR 3 — Bait Icon
  Label: "Bait Icon vs Start Button"
  Issue: "The bait icon was visually competing with the primary CTA"
  Before: /assets/Fishdoro-SS/LoFi-Session-Settings-Before.png
  After:  /assets/Fishdoro-SS/LoFi-Session-Settings-After.png
  Why: "Primary CTAs must be visually dominant — only one thing should say press me"

PAIR 4 — Copy Consistency
  Label: "Copy Consistency"
  Issue: "'Catch Log' and 'Work Report' broke the fishing theme"
  Before: /assets/Fishdoro-SS/LoFi-Catch-Log-Before.png
  After:  /assets/Fishdoro-SS/LoFi-Catch-Log-After.png
  Why: "A unified fishing theme strengthens Fishdoro's product identity"
```

## Sub-section: Hi-fi screens

```
Text:
Once the structure was solid, I layered in all the visual elements — pixel
art, animations, and the core cast → wait → catch loop.
```

## Screenshots — Hi-fi gallery

```
DISPLAY ORDER AND LAYOUT:

1. FULL WIDTH — Timer focus state (most important)
   FILE: HiFi-Pomodoro-Session.png
   PATH: /public/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png
   HEIGHT: 280px (tall)
   CAPTION: "Focus timer — cast → wait → catch"

2. TWO COLUMN GRID — Home + Reward reveal
   Left:  HiFi-Home.png — "Home screen"
   Right: HiFi-Get-Fish-Timer-Finish.png — "Reward reveal — the pixel fish"
   HEIGHT: 200px each

3. THREE COLUMN GRID — Session Setup + Session Setting + App Setting
   Col 1: HiFi-Session-Setup.png — "Session setup"
   Col 2: HiFi-Session-Setting.png — "Session settings"
   Col 3: HiFi-App-Setting.png — "App settings"
   HEIGHT: 160px each (short)

4. TWO COLUMN GRID — Catch Log + Catch Report
   Left:  HiFi-Catch-Log.png — "Fishing log"
   Right: HiFi-Catch-Report.png — "Catch report"
   HEIGHT: 200px each

5. TWO COLUMN GRID — Break State + (spacer or future screen)
   Left:  HiFi-Break-State.png — "Break state — a different pace"
   Right: empty or future screen
   HEIGHT: 200px each
```

## Copilot instruction for hi-fi gallery

```
After the hi-fi intro text, display screens in this order:

<!-- 1. Full width — timer -->
<div class="cs-screenshot-grid single">
  <div class="cs-screenshot">
    <div class="cs-screenshot-img tall">
      <img src="/assets/Fishdoro-SS/HiFi-Pomodoro-Session.png"
           alt="Fishdoro focus timer" />
    </div>
    <p class="cs-screenshot-caption">Focus timer — cast → wait → catch</p>
  </div>
</div>

<!-- 2. Two column — home + reward -->
<div class="cs-screenshot-grid">
  <div class="cs-screenshot">
    <div class="cs-screenshot-img">
      <img src="/assets/Fishdoro-SS/HiFi-Home.png" alt="Home screen" />
    </div>
    <p class="cs-screenshot-caption">Home screen</p>
  </div>
  <div class="cs-screenshot">
    <div class="cs-screenshot-img">
      <img src="/assets/Fishdoro-SS/HiFi-Get-Fish-Timer-Finish.png"
           alt="Reward reveal" />
    </div>
    <p class="cs-screenshot-caption">Reward reveal — the pixel fish</p>
  </div>
</div>

<!-- 3. Three column — setup + settings + app settings -->
<div class="cs-screenshot-grid three">
  <div class="cs-screenshot">
    <div class="cs-screenshot-img short">
      <img src="/assets/Fishdoro-SS/HiFi-Session-Setup.png"
           alt="Session setup" />
    </div>
    <p class="cs-screenshot-caption">Session setup</p>
  </div>
  <div class="cs-screenshot">
    <div class="cs-screenshot-img short">
      <img src="/assets/Fishdoro-SS/HiFi-Session-Setting.png"
           alt="Session settings" />
    </div>
    <p class="cs-screenshot-caption">Session settings</p>
  </div>
  <div class="cs-screenshot">
    <div class="cs-screenshot-img short">
      <img src="/assets/Fishdoro-SS/HiFi-App-Setting.png"
           alt="App settings" />
    </div>
    <p class="cs-screenshot-caption">App settings</p>
  </div>
</div>

<!-- 4. Two column — log + report -->
<div class="cs-screenshot-grid">
  <div class="cs-screenshot">
    <div class="cs-screenshot-img">
      <img src="/assets/Fishdoro-SS/HiFi-Catch-Log.png"
           alt="Fishing log" />
    </div>
    <p class="cs-screenshot-caption">Fishing log</p>
  </div>
  <div class="cs-screenshot">
    <div class="cs-screenshot-img">
      <img src="/assets/Fishdoro-SS/HiFi-Catch-Report.png"
           alt="Catch report" />
    </div>
    <p class="cs-screenshot-caption">Catch report</p>
  </div>
</div>
```

## Interactive component — Annotated Screen Viewer

```
COMPONENT: AnnotatedViewer (vanilla JS)
POSITION: Applied to HiFi-Pomodoro-Session.png (full-width timer screen)
BEHAVIOR: Numbered hotspots, click to reveal design decision tooltip
Full code in FitriGarden_Fishdoro_InteractiveComponents_TodoList.md

ANNOTATIONS:
  Hotspot 1 — x: 72%, y: 85%
  Text: "Full-width CTA added after testing — matches the mental model of
  one clear action to start."
  Insight: "Solves: Flexibility problem"

  Hotspot 2 — x: 30%, y: 25%
  Text: "Custom duration input added here — users who need 45-minute
  sessions shouldn't have to fight the tool."
  Insight: "Solves: Flexibility problem"

  Hotspot 3 — x: 50%, y: 50%
  Text: "Pixel art fishing scene sets the emotional register before the
  user does anything. If this feels cozy in the first 2 seconds,
  the whole session feels different."
  Insight: "Solves: Retention problem"
```

## Sub-section: What's built so far

```
Text:
Fishdoro is currently in active development. The core experience — home
screen, session selection, focus timer, reward reveal, and report — is
functional. The fishing logic, transitions, and reward reveal work as
intended, and the experience already feels meaningfully different from
a standard Pomodoro timer.

What remains is the craft layer: completing the full pixel art asset set,
refining animations, and polishing transitions. These are not design
unknowns — the decisions are made, the execution is in progress.
```

## Sub-section: The build as a design signal

```
Text:
One aspect of this project worth noting: Fishdoro is being built entirely
by the designer, using Electron, HTML, CSS, and JavaScript. This was never
the plan — it emerged from necessity and curiosity. But it changed how I
design.

When you're the one implementing your own decisions, you stop making design
choices that are easy to draw but hard to build. You develop instincts for
the gap between how something looks in Figma and how it feels when you
actually interact with it. That gap, it turns out, is where most of the
interesting design problems live.
```

## Visual — Lo-fi vs Hi-fi fade comparison

```
COMPONENT: LofiHifiFade.astro
POSITION: After "The build as a design signal" paragraph
FILE: /src/components/LofiHifiFade.astro
NOTE: Full code available in FitriGarden_Fishdoro_LofiHifiFadeComponent.md

TWO PAIRS:
  Pair 1 — Home screen
    Lo-fi:  /assets/Fishdoro-SS/LoFi-Home.png
    Hi-fi:  /assets/Fishdoro-SS/HiFi-Home.png
    Label:  "Home Screen"

  Pair 2 — Session Setup
    Lo-fi:  /assets/Fishdoro-SS/LoFi-Pomodoro-Session.png
    Hi-fi:  /assets/Fishdoro-SS/HiFi-Pomodoro-Session.png
    Label:  "Focus Timer"

BEHAVIOR:
  Desktop — hover to fade between lo-fi and hi-fi
  Mobile  — tap to toggle between states
  Default state: hi-fi visible
  Hover/tap state: lo-fi visible (fade transition 0.4s ease)
```

---

# SECTION 5 — VALIDATION

## Text content

```
The current build has not yet gone through structured usability testing with
external users. The informal walkthroughs during lo-fi helped shape the
structure, but a proper validation round is planned once the full visual
layer is complete.

The key questions I want to answer: Does the fishing metaphor land
immediately, or does it need onboarding? Does the reward frequency feel
satisfying or distracting during actual work sessions? And does the cozy
aesthetic hold up across longer sessions, or does it become visual noise?

These are hypotheses, not conclusions — and that's the honest state of
this project right now.
```

---

# SECTION 6 — KEY TAKEAWAYS

## Text content

```
TAKEAWAY 1
Title: The problem is more interesting than the solution.
Body: The most valuable part of this project wasn't designing the fishing
mechanic — it was discovering that people quit Pomodoro not because of
laziness, but because of rigidity. That reframe changed everything. Instead
of asking "how do I make a timer more fun?", the real question became "how
do I make a timer that gets out of the user's way?" The difference between
those two questions produced a fundamentally different design.

TAKEAWAY 2
Title: Designing something you build yourself changes how you think.
Body: Building Fishdoro in code taught me that design decisions have weight.
A button position that takes five seconds to move in Figma might take an
hour to re-implement in the actual interface — and that asymmetry forces you
to be more intentional early. I started catching interaction problems in
wireframes that I previously would have only noticed in prototypes, because
I could mentally simulate how they'd feel to implement.

TAKEAWAY 3
Title: Gamification is a hypothesis, not a feature.
Body: Going into this project, I assumed that a fishing metaphor would
naturally make focusing more enjoyable. What I learned from early
walkthroughs is that the metaphor only works if the reward feels earned,
not just given. The moment a fish appeared too easily, it stopped feeling
like a reward and started feeling like noise. That's a principle I'd apply
to any project involving behavioral mechanics: the value of a reward is
inseparable from the effort that precedes it.

TAKEAWAY 4
Title: Knowing what you don't know is a design skill.
Body: Fishdoro hasn't gone through structured usability testing yet. I know
the questions I need to answer — does the metaphor land? does the reward
frequency work in real sessions? — but I don't have the answers yet.
Sitting with that uncertainty honestly, rather than filling it with
assumptions, is something this project taught me to do better.
```

---

# SECTION 7 — SIGNING OFF

## Text content

```
The question that started Fishdoro was simple: can a boring timer become
something you actually want to open?

The honest answer, at this stage, is: I think so — but I'm not done
proving it yet.

What I do know is that the research is solid, the design decisions are
traceable, and the experience already feels different from everything else
in this space. A tiny pixel fish as a reward for 25 minutes of focus sounds
absurd on paper. But there's something about it that works — the same way
fishing itself works. You're not guaranteed to catch anything. But the
possibility keeps you patient.

That's the feeling Fishdoro is trying to bottle. The build continues. 🎣

---

Process note — Discover → Define → Develop
(Display as a section header before the process sections:)
## The Process — Discover → Define → Develop
```

---

# COMPONENTS SUMMARY

| Component | File | Section | Source doc |
|---|---|---|---|
| AffinityMap | AffinityMap.astro | Discover | `AffinityMapComponent.md` |
| FlipCards | FlipCards.astro | Discover | `FlipCardsComponent.md` |
| ProblemFramework | ProblemFramework.astro | Define | `ProblemFrameworkComponent.md` |
| ScrollReveal | added to ProblemFramework.astro | Define | `ScrollRevealComponent.md` |
| BeforeAfterSliders | BeforeAfterSliders.astro | Develop | `BeforeAfterSlidersComponent.md` |
| AnnotatedViewer | AnnotatedViewer.astro | Develop | `AnnotatedViewerComponent.md` |
| LofiHifiFade | LofiHifiFade.astro | Develop | `LofiHifiFadeComponent.md` |
| ProgressBar | added to cs-content layout | All | `ProgressBarComponent.md` |

All component files (each contains Copilot prompt + full code):
- `FitriGarden_Fishdoro_AffinityMapComponent.md`
- `FitriGarden_Fishdoro_FlipCardsComponent.md`
- `FitriGarden_Fishdoro_ProblemFrameworkComponent.md`
- `FitriGarden_Fishdoro_ScrollRevealComponent.md`
- `FitriGarden_Fishdoro_BeforeAfterSlidersComponent.md`
- `FitriGarden_Fishdoro_AnnotatedViewerComponent.md`
- `FitriGarden_Fishdoro_LofiHifiFadeComponent.md`
- `FitriGarden_Fishdoro_ProgressBarComponent.md`

---

# SCREENSHOT SUMMARY

| File | Section | Layout | Height |
|---|---|---|---|
| `Hero.png` | Header | Full width | 240px |
| `Moodboard.png` | Develop — visual direction | Full width | 200px |
| `LoFi-Home-Before.png` + `LoFi-Home-After.png` | Develop — slider pair 1 | Slider | 280px |
| `LoFi-Session-Setup-Before.png` + `LoFi-Session-Setup-After.png` | Develop — slider pair 2 | Slider | 280px |
| `LoFi-Session-Settings-Before.png` + `LoFi-Session-Settings-After.png` | Develop — slider pair 3 | Slider | 280px |
| `LoFi-Catch-Log-Before.png` + `LoFi-Catch-Log-After.png` | Develop — slider pair 4 | Slider | 280px |
| `HiFi-Pomodoro-Session.png` | Develop — hi-fi | Full width | 280px (tall) |
| `HiFi-Home.png` | Develop — hi-fi + Lo-fi vs Hi-fi | 2-col grid | 200px |
| `HiFi-Get-Fish-Timer-Finish.png` | Develop — hi-fi | 2-col grid | 200px |
| `HiFi-Session-Setup.png` | Develop — hi-fi + Lo-fi vs Hi-fi | 3-col grid | 160px (short) |
| `HiFi-Session-Setting.png` | Develop — hi-fi | 3-col grid | 160px (short) |
| `HiFi-App-Setting.png` | Develop — hi-fi | 3-col grid | 160px (short) |
| `HiFi-Catch-Log.png` | Develop — hi-fi | 2-col grid | 200px |
| `HiFi-Catch-Report.png` | Develop — hi-fi | 2-col grid | 200px |
| `HiFi-Break-State.png` | Develop — hi-fi | 2-col grid | 200px |
| `LoFi-Home.png` | Develop — Lo-fi vs Hi-fi fade | Fade component | — |
| `LoFi-Pomodoro-Session.png` | Develop — Lo-fi vs Hi-fi fade | Fade component | — |

**Not used as image (coded component instead):**
- `Affinity Mapping.png` — replaced by AffinityMap.astro
- Problem Framework — replaced by ProblemFramework.astro

**All assets complete — nothing missing ✓**

---

# NOTES & CORRECTIONS

1. **All assets are now complete** — nothing missing.

2. **Lo-fi vs Hi-fi naming clarified:**
   - Files named `LoFi-xxx` = wireframe / pre-iteration screens
   - Files named `HiFi-xxx` = final design / implemented screens
   - The 4 before/after slider pairs show lo-fi iteration (before/after testing)
   - The Lo-fi vs Hi-fi fade component shows the full evolution (wireframe → final)

3. **File naming with spaces** — some files have spaces in the name.
   Astro can handle spaces in src paths but it's cleaner to rename:
   - "HiFi-Get-Fish-Timer-Finish.png" → "HiFi-Get-Fish-Timer-Finish.png"
   - "HiFi-Catch-Log.png" → "HiFi-Catch-Log.png"
   - "HiFi-Catch-Report.png" → "HiFi-Catch-Report.png"
   - "HiFi-App-Setting.png" → "HiFi-App-Setting.png"
   - "HiFi-Session-Setup.png" → "HiFi-Session-Setup.png"
   - "HiFi-Session-Setting.png" → "HiFi-Session-Setting.png"
   - "HiFi-Pomodoro-Session.png" → "HiFi-Pomodoro-Session.png"
   - "LoFi-Catch-Log-Before.png" → "LoFi-Catch-Log-Before.png"
   - "LoFi-Catch-Log-After.png" → "LoFi-Catch-Log-After.png"

4. **HiFi-Pomodoro-Session.png** — timer screen background (bottom half)
   is still plain blue. If polished before launch, re-export and replace.
   Can proceed with current version.

---

*All component source files referenced above contain complete HTML/CSS/JS
ready to paste into Astro. This document is the single source of truth
for the Fishdoro case study page implementation.*
