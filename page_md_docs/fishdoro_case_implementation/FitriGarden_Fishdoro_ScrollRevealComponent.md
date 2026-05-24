# Fishdoro — Scroll Reveal Component
*Define section — problem cards fade + slide up on scroll*
*Applied to the three problem cards inside ProblemFramework.astro*

---

## Copilot Prompt

```
Add scroll-triggered reveal animation to the three problem cards
inside ProblemFramework.astro in the Fishdoro case study.

IMPORTANT: The scroll observer must be attached to .cs-content
(the case study scroll container), NOT to window.
This is because the case study is an expand view inside the portfolio —
the page itself does not scroll, only .cs-content does.

BEHAVIOR:
- Each .pf-card starts invisible: opacity 0, translateY(16px)
- When card enters viewport (inside .cs-content), it animates to:
  opacity 1, translateY(0)
- Stagger delay:
  1st card: 0ms delay
  2nd card: 200ms delay
  3rd card: 400ms delay
- Animation duration: 0.4s ease
- Each card animates only once (unobserve after visible)
- Threshold: 0.2 (card 20% visible triggers animation)

CSS to add to ProblemFramework.astro:

.pf-card {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.pf-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.pf-card:nth-child(2) { transition-delay: 200ms; }
.pf-card:nth-child(3) { transition-delay: 400ms; }

JS to add inside a <script> tag in ProblemFramework.astro:

const cards = document.querySelectorAll('.pf-card')
const scrollContainer = document.querySelector('.cs-content')

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },
  {
    root: scrollContainer,   // CRITICAL: attach to .cs-content, not window
    threshold: 0.2
  }
)

cards.forEach(card => observer.observe(card))
```

---

## Full code to add to ProblemFramework.astro

Add this CSS inside the existing `<style>` tag:

```css
/* Scroll reveal — starts hidden */
.pf-card {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* Visible state — triggered by JS */
.pf-card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays */
.pf-card:nth-child(2) { transition-delay: 200ms; }
.pf-card:nth-child(3) { transition-delay: 400ms; }
```

Add this `<script>` tag at the bottom of ProblemFramework.astro:

```html
<script>
  // IMPORTANT: root must be .cs-content, not window
  // Case study is an expand view — only .cs-content scrolls
  const pfCards = document.querySelectorAll('.pf-card')
  const csContent = document.querySelector('.cs-content')

  if (pfCards.length && csContent) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)  // animate once only
          }
        })
      },
      {
        root: csContent,
        threshold: 0.2
      }
    )
    pfCards.forEach(card => observer.observe(card))
  }
</script>
```

---

## How it works

```
User scrolls into Define section
        ↓
Card 1 enters viewport → fades in immediately
        ↓ (200ms later)
Card 2 fades in
        ↓ (400ms later)
Card 3 fades in
        ↓
Each card animates once, observer disconnects
```

## Critical note

If the animation never triggers, check that `.cs-content` exists
in the DOM and is the actual scroll container. If the component is
used outside the portfolio expand view (e.g. standalone page),
change `root: csContent` to `root: null` to use the viewport instead.
