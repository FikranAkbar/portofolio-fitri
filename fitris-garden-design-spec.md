# Fitri's Garden — Design Specification

> **Version:** 1.0  
> **Type:** Visual Improvement Only (no structural/logic changes)  
> **Stack:** Astro · TypeScript · HTML · CSS · JavaScript

---

## 1. Project Overview

**"Fitri's Garden"** is a dreamy, interactive portfolio website. This document defines the visual language, atmosphere, and component standards to ensure consistency across all pages and all future prompting sessions.

> This is NOT a redesign. All existing interactions, logic, navigation, and page structure must remain intact. Changes are visual only.

---

## 2. Emotional Direction

The website must feel:

- Dreamy, calming, emotional
- Whimsical yet elegant
- Soft, airy, lightweight
- Magical but minimal

Avoid:

- Dark UI
- Cluttered layouts
- Corporate or productivity-app feeling
- Overly game-like or fantasy-heavy UI
- Aggressive or flashy motion

---

## 3. Color Palette

### Primary — Botanical Greens
| Role | Description |
|------|-------------|
| Primary accent | Botanical green / sage green |
| Supporting | Muted olive tones |
| Surfaces | Soft natural greens (low saturation) |

### Secondary — Pinks (Accent Only)
| Role | Description |
|------|-------------|
| Flower accents | Small decorative highlights |
| Hover accents | Subtle color shifts only |

### Neutrals / Backgrounds
| Role | Description |
|------|-------------|
| Background base | Warm cream / soft beige |
| Grid/checker | Low-contrast, muted |
| Shadows | Very soft, warm-toned |

> **Rule:** No bright neon colors. All colors must remain muted, pastel, and natural.

---

## 4. Typography

| Usage | Style |
|-------|-------|
| Large titles / hero | Serif font — editorial, breathable |
| UI labels / body text | Clean sans-serif — lightweight |
| Uppercase labels | Small, elegant, low weight |

- Avoid futuristic or overly bold fonts
- Line height should feel spacious
- Letter spacing on uppercase labels: slightly wide

---

## 5. Spacing & Layout Rhythm

- Spacing should feel **breathable** — generous whitespace throughout
- No cramped sections or tight padding
- Consistent padding scale applied across all pages
- Section separators: soft gradients or whitespace only (no hard lines)

---

## 6. Visual Component Standards

### Borders & Radius
- All containers: large border radius (soft, rounded, pill-like where appropriate)
- No sharp corners anywhere

### Shadows
- All shadows: soft, diffused, warm-toned
- No hard drop shadows

### Hover States
- All interactive elements must have smooth, subtle hover transitions
- Hover transitions: `150ms–250ms ease`
- Color shifts on hover should be gentle (tint, not full color swap)

### Animations (Global Rules)
- **Allowed:** gentle floating, soft glow, smooth hover, lightweight node sway
- **Forbidden:** aggressive motion, flashy transitions, exaggerated physics
- Animation feel: calm, elegant, peaceful

---

## 7. Page-by-Page Specifications

All pages must share the same color palette, spacing rhythm, typography system, shadow style, border radius, hover polish, and atmospheric softness. Every page should feel like part of one unified "Fitri's Garden" world.

---

### 7.1 Intro Page

**Purpose:** Invite visitors to leave their mark before entering the portfolio.

**Emotional goal:**
> "Leave a little piece of yourself in the garden."

**Required sections:**
- Hero: "Fitri's Garden" title + subtitle + "Start the Journey" + "Skip Intro" buttons
- Planting experience layout
- Bloom Story Panel (form)
- Flower Picker

**Hero atmosphere:**
- Soft botanical / watercolor-like pastel gradients
- Breathable spacing
- Elegant serif title
- Subtle ambient effects (no heavy illustrations required yet)

**Planting Experience Layout:**

| Breakpoint | Layout |
|------------|--------|
| Desktop | Left 70% = garden field · Right 30% = form panel · Bottom = flower picker |
| Mobile | Garden field → form → flower picker (stacked vertically) |

**Interactive Garden Field:**
- Look: soft parchment / botanical memory board / textured paper
- Feel: airy and clean
- NOT: a map, infinite canvas, or design editor
- User-planted flowers are the visual focus
- Decorations: subtle, low-contrast, lightweight

**Flower Planting Interaction (keep existing logic, improve visuals):**
1. User selects flower
2. Transparent flower preview follows cursor in garden
3. Click to plant
4. Plant animation: tiny bloom scale pop + subtle sparkle
5. Repositioning: draggable within small radius only, no free drag, no overlap

**Existing visitor flowers:**
- Show name, date, optional message
- Hover → small elegant tooltip/card

**Bloom Story Panel:**
- Fields: Visitor Name (required) · Short Message/Mood (optional)
- Auto-generated: current date, visitor number ("You are visitor No. XXXX")
- Buttons: "Leave My Bloom" / "Plant My Bloom" / "Skip This Step"
- Users must never feel forced

**Flower Picker:**

| Flower | Notes |
|--------|-------|
| Sakura | |
| Lavender | |
| Daisy | |
| Sunflower | |
| Forget-me-not | |
| Cosmos | |
| Rose | |

Selected flower subtly affects: accent colors, button glow, UI tint, hover colors. All changes must remain elegant and minimal.

---

### 7.2 Homepage

**Keep unchanged:** draggable center node, radial navigation, connected node system, checker/grid background.

**Visual improvements:**
- Softer spacing and breathable layout
- Elegant typography
- Rounded floating node containers
- Soft shadows
- Botanical atmosphere

**Background:**
- Warm cream / soft beige
- Subtle grain/noise texture
- Low-contrast grid/checker pattern

**"DRAG THE CENTER NODE" hint:**
- Position: top center above node system
- Style: small, uppercase, elegant, subtle
- Optional subtext: "to explore"

**Vine/Connection Lines (replace dotted lines):**
- Visual: thin botanical vines / soft stems / root-like curved paths
- Optional: tiny leaves on paths occasionally
- Implementation: SVG paths or CSS transforms
- Style: subtle, elegant, low contrast
- Forbidden: physics engines, heavy canvas, complex simulations

**Node Design:**
- Shape: soft circular containers / floating rounded cards
- Contents: placeholder icon/illustration + title underneath
- Subtitles: hidden by default, appear only on hover
- Hover feel: subtle, smooth, lightweight — no large popups

**Placeholder Icon Themes:**

| Node | Placeholder |
|------|-------------|
| Listen | Music box / vinyl player |
| Read | Stacked books |
| Pixel Art | Framed artwork |
| Project | Flower pot |
| Resume | Rolled parchment |
| About | Watering pot + shovel |
| Testimony | Glass bottle/jar |
| Watch | Retro camera |
| Drawing | Sketchbook |

All placeholder icons: decorative, minimal, soft, readable at small size. Must be easily replaceable with final pixel art assets.

**Center Node:**
- Shape: soft glowing circular container
- Content: miniature flower patch or potted plant illustration
- Text: "Fitri Zahwa" + "Indonesia" underneath
- Role: visual anchor, soft focal point, elegant centerpiece
- Do NOT remove flower pot illustration

---

### 7.3 Project Page

Apply unified visual language:
- Same color palette
- Same spacing rhythm
- Same typography system
- Same shadow/border radius
- Same hover polish
- Same atmospheric softness

---

### 7.4 About Me

Apply unified visual language (same as above).

---

### 7.5 Visitor Gallery

Apply unified visual language (same as above).

---

## 8. Sidebar

**Keep structure unchanged.**

**Visual improvements:**
- Improved spacing and padding
- Clear typography hierarchy
- Polished hover states
- Clear active navigation state
- Soft, cozy, readable card/button feel

**Bottom-right decoration:**
- Watering-can placeholder remains
- Keep placement consistent
- Keep decorative feeling subtle

---

## 9. Botanical Decorations (Global)

> Final flower assets are NOT finalized yet.

**Current guidance:**
- Decorative flowers may be removed or kept minimal
- Rely on spacing and atmosphere over illustrations
- Acceptable temporary decorations: subtle gradients, tiny floating petals, soft ambient glow
- Avoid excessive decorative clutter

---

## 10. Technical Constraints

| Concern | Approach |
|---------|----------|
| Framework | Astro components |
| Interactions | TypeScript |
| Animations | CSS keyframes / transitions |
| Connection lines | SVG paths or CSS transforms |
| DOM updates | Lightweight vanilla |
| **Forbidden** | WebGL, Three.js, heavy canvas, physics engines |

All implementations must be:
- Lightweight
- Maintainable
- Responsive
- Technically achievable within Astro + TypeScript

---

## 11. Asset Management

- All placeholder icons/illustrations must be modular and easily swappable
- Final pixel art assets will replace placeholders in a future pass
- Structure asset references cleanly so replacement requires minimal code changes

---

## 12. Consistency Checklist

Before completing any page or component, verify:

- [ ] Color palette matches spec (botanical greens primary, pink secondary only)
- [ ] Typography: serif titles, sans-serif body, uppercase labels
- [ ] Spacing feels breathable (no tight/cramped sections)
- [ ] Border radius: soft and rounded (no sharp corners)
- [ ] Shadows: soft, diffused, warm-toned
- [ ] Hover transitions: smooth, `150ms–250ms ease`
- [ ] Animations: gentle only (no aggressive motion)
- [ ] Background: warm cream + low-contrast grid
- [ ] All existing interactions and logic preserved
- [ ] Page feels connected to the unified "Fitri's Garden" world
