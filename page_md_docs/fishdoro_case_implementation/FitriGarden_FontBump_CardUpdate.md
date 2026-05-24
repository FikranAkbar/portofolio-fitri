# Font Size Bump (+2px) & Card Color Update
*Copilot prompt to increase all content font sizes by 2px and update card backgrounds to white*
*Applies to: Case Study page, About Me page, Visitor Gallery page*

---

## Copilot Prompt

```
Make the following two changes across the Fitri's Garden portfolio.
Do NOT change font sizes in the sidebar, navigation, topbar, or badges/tags.
Only affect content area text and card backgrounds.

---

CHANGE 1 — Increase all content area font sizes by 2px

Find every font-size declaration inside these areas:
- .cs-content, .cs-inner (case study page)
- .content-area, .content-inner (about me page)
- .bloom-card (visitor gallery page)

For each font-size found, increase by exactly 2px.
All results must still be multiples of 2.

BEFORE → AFTER reference table:
  10px → 12px
  12px → 14px
  14px → 16px
  16px → 18px
  18px → 20px
  20px → 22px
  36px → 38px

Apply this to ALL of these selectors if they exist:
  .cs-body            (case study body text)
  .cs-subtitle        (case study subtitle)
  .cs-title           (case study title — Playfair Display)
  .cs-meta-value      (case study meta row values)
  .cs-meta-label      (case study meta labels)
  .insight-text       (discover insight cards)
  .insight-label      (discover insight labels)
  .insight-conf       (discover confidence text)
  .problem-text       (define problem cards)
  .problem-num        (define problem labels)
  .takeaway-title     (key takeaways titles)
  .takeaway-body      (key takeaways body)
  .flip-quote         (flip cards front quote)
  .flip-insight       (flip cards back insight)
  .flip-label         (flip cards back label)
  .flip-hint          (flip cards hint text)
  .flip-confidence    (flip cards confidence)
  .cs-screenshot-caption (screenshot captions)
  .cs-closing         (signing off paragraph)
  .pf-name            (problem framework card names)
  .pf-desc            (problem framework descriptions)
  .pf-source-text     (problem framework source text)
  .pf-brief-text      (design brief text)
  .blockquote p       (about me quote)
  .quote-response     (about me quote response)
  .bio-intro          (about me bio intro)
  .bio-body           (about me bio body)
  .entry-title        (about me entry titles)
  .entry-role         (about me entry roles)
  .entry-desc         (about me entry descriptions)
  .entry-date         (about me entry dates)
  .t-quote            (testimonial quote text)
  .t-name             (testimonial name)
  .t-location         (testimonial location)
  .bloom-type         (visitor gallery bloom card type)
  .bloom-message      (visitor gallery bloom card message)
  .bloom-by           (visitor gallery bloom by text)
  .bloom-date         (visitor gallery bloom date)

DO NOT change font sizes for:
  - .tag, .cs-tag, .badge (tags and badges)
  - .section-pill (section labels)
  - .nav-item, .nav-icon, .sec-lbl (sidebar navigation)
  - .topbar-title, .topbar-tab, .topbar-back (topbar)
  - .sb-name, .sb-role, .sb-bio (sidebar text)
  - .status-txt, .clock (sidebar footer)
  - .am-eyebrow, .am-col-title, .am-insight-num (affinity map labels)
  - .hotspot-btn, .av-insight (annotated viewer)
  - .lh-eyebrow, .lh-hint (lofi-hifi fade labels)
  - .ba-pair-label, .ba-pair-issue, .ba-why (before/after labels)

---

CHANGE 2 — Update card backgrounds from cream to white

Find every card that currently uses a cream/warm background color and
change it to #ffffff (white). Apply to ALL of these:

Case study page:
  .insight-card       background: #ffffff
  .problem-card       background: #ffffff
  .takeaway-item      (no background change needed — uses border-left only)
  .flip-front         background: #ffffff
  .flip-back          background: #ffffff (change from #f5f0e8 to #ffffff)
  .av-tooltip         background: #ffffff (already white — keep)

About Me page:
  .testimonial-card   background: #ffffff (likely already white)
  .sidebar-card       background: #ffffff (the "Your Bloom Story" form card
                      in Leave Your Bloom — change from #f5f0e8 to #ffffff)

Visitor Gallery page:
  .bloom-card         background: #ffffff (likely already white — verify)

Keep these cream/warm backgrounds UNCHANGED:
  .affinity-map       background: #f5f0e8 (the whole affinity map section)
  .pf-brief           background: transparent (blockquote, no bg)
  sidebar             background: #ffffff (already white)
  .cs-content         background: #faf7f2 (main content bg — keep warm)
  .garden-area        background: #f2ede4 (garden — keep)
```

---

## Summary of changes

| What | Change |
|---|---|
| All content area font sizes | +2px (multiples of 2 only) |
| Insight cards background | cream → `#ffffff` |
| Problem cards background | cream → `#ffffff` |
| Flip cards (front + back) | cream → `#ffffff` |
| Testimonial cards | verify already `#ffffff` |
| Bloom cards | verify already `#ffffff` |
| Sidebar card (Leave Your Bloom) | `#f5f0e8` → `#ffffff` |

## What stays the same

- Sidebar font sizes and colors
- Navigation font sizes
- Topbar font sizes
- Badge and tag font sizes
- Section pill font sizes
- All background colors except cards listed above
- Warm main background `#faf7f2`
- Garden background `#f2ede4`
- Affinity map section background `#f5f0e8`
