# Design Report — Fitri Zahwa Portfolio

> **Stack:** Astro 6 · React 19 · Tailwind CSS 3 · d3-force · TypeScript  
> **Date:** April 29, 2026  
> **Status:** Production-ready

---

## Table of Contents

1. [Global](#1-global)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Layout Structure](#4-layout-structure)
5. [Cursor Dot](#5-cursor-dot)
6. [Sidebar Card](#6-sidebar-card)
   - 6.1 [Avatar](#61-avatar)
   - 6.2 [Introduction](#62-introduction)
   - 6.3 [NavMenu](#63-navmenu)
   - 6.4 [SocialLinks](#64-sociallinks)
7. [Canvas Panel](#7-canvas-panel)
8. [Force Graph Nodes](#8-force-graph-nodes)
   - 8.1 [Center Node](#81-center-node)
   - 8.2 [Box Node — Work](#82-box-node--work)
   - 8.3 [Pill Nodes — Read / Design / Contact](#83-pill-nodes--read--design--contact)
   - 8.4 [Links (Edges)](#84-links-edges)
9. [Animations & Transitions](#9-animations--transitions)
10. [File Structure](#10-file-structure)

---

## 1. Global

| Property | Value |
|---|---|
| Background | `#F5F5F5` |
| Body font | `Inter` (300 · 400 · 500 · 600 · 700) |
| Display/Title font | `DM Sans` (400 · 500 · 600 · 700) |
| Font source | Google Fonts |
| Font smoothing | `-webkit-font-smoothing: antialiased` |
| Cursor | `none !important` — native cursor hidden globally |
| Box-sizing | `border-box` on `*` |

---

## 2. Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Pink Accent** | `#FF49DB` | Cursor dot · hover stroke · icon hover · social link hover |
| **Canvas BG** | `#F5F5F5` | Page background · canvas area |
| **Card BG** | `#FFFFFF` | Sidebar card background |
| **Text Primary** | `#111827` | Headings · active nav labels |
| **Text Secondary** | `#6B7280` | Body paragraph · nav default |
| **Text Muted** | `#9CA3AF` | Subtitle · node sub-labels |
| **Border / Stroke** | `#E5E7EB` | Node borders · dividers |
| **Active BG** | `#F3F4F6` | Active nav item background |
| **Hover BG** | `#F9FAFB` | Hovered nav item background |
| **Pink Tint BG** | `#FFF0FA` | Pill node hover fill |

---

## 3. Typography

| Element | Font | Size | Weight | Color | Line Height |
|---|---|---|---|---|---|
| Heading — "Fitri Zahwa" | DM Sans | 32px | 700 | `#111827` | tight (1.25) |
| Subtitle | Inter | 16px | 400 | `#9CA3AF` | snug (1.375) |
| Bio paragraph | Inter | 16px | 400 | `#6B7280` | relaxed (1.625) |
| Section labels (EXPLORE, FIND ME AT) | Inter | 16px | 600 | `#111827` | — |
| Nav items | Inter | 16px | 400 / 500 active | `#6B7280` / `#111827` | — |
| Social links | Inter | 16px | 400 | `#6B7280` | — |
| Drag hint (canvas) | Inter | 10px | 400 | `#9CA3AF` | — |
| Center node label | Inter | 13px | 600 | `#111827` | — |
| Center node sub-label | Inter | 10px | 400 | `#9CA3AF` | — |
| Box node label | Inter | 12px | 600 | `#111827` | — |
| Box node sub-label | Inter | 9.5px | 400 | `#9CA3AF` | — |
| Pill node label | Inter | 12px | 500 | `#374151` | — |

> **Letter Spacing:**  
> - "Fitri Zahwa" heading → `tracking-tight` (-0.025em)  
> - Section labels (EXPLORE, FIND ME AT) → `tracking-widest` (0.1em) + `uppercase`  
> - Drag hint → `tracking-widest` + `uppercase`

---

## 4. Layout Structure

```
<body>  bg-[#F5F5F5]  h-screen
└── <div>  flex  h-screen  overflow-hidden
    ├── <div>  pl-6  pt-6  pb-6  shrink-0        ← 24px spacing left/top/bottom
    │   └── <Sidebar />                           ← 288px wide floating card
    └── <CanvasPanel />                           ← flex-1, fills remaining width
```

| Property | Value |
|---|---|
| Layout type | `flex` (horizontal row) |
| Viewport | `100vh` / `100vw` |
| Overflow | `hidden` |
| Sidebar offset | `padding-left: 24px`, `padding-top: 24px`, `padding-bottom: 24px` |

---

## 5. Cursor Dot

> Replaces the native OS cursor across the entire page.

| Property | Value |
|---|---|
| Size | `8 × 8px` (`w-2 h-2`) |
| Shape | Circle (`rounded-full`) |
| Color | `#FF49DB` |
| Position | `fixed` — follows `mousemove` via `requestAnimationFrame` |
| z-index | `9999` |
| Blend mode | `mix-blend-mode: multiply` |
| Pointer events | `none` |
| Initial position | off-screen (`left: -20px, top: -20px`) |

---

## 6. Sidebar Card

> **File:** `src/components/sidebar/Sidebar.astro`

| Property | Value |
|---|---|
| Width | `288px` (fixed) |
| Height | `100%` (fills parent wrapper) |
| Background | `#FFFFFF` |
| Border radius | `16px` (`rounded-2xl`) |
| Shadow | `0 1px 2px rgba(0,0,0,0.05)` (`shadow-sm`) |
| Border | None |
| Overflow | `overflow-y: auto` · scrollbar hidden |
| Padding | `24px` left/right (`px-6`) · `28px` top/bottom (`py-7`) |
| Gap between sections | `24px` (`gap-6`) |

### Internal section order

```
① Logo          → <Avatar />
② Introduction  → h1 + subtitle + bio
③ Explore Card  → <NavMenu />
   Text Link     → <SocialLinks />  (pushed to bottom via mt-auto)
```

---

### 6.1 Avatar

> **File:** `src/components/sidebar/Avatar.astro`

| Property | Value |
|---|---|
| Size | `48 × 48px` (`w-12 h-12`) |
| Shape | Rounded `8px` (`rounded-md`) |
| Background | `#E5E7EB` (`bg-gray-200`) |
| Icon | SVG person silhouette · `28 × 28px` · `#9CA3AF` |
| Overflow | `hidden` |

---

### 6.2 Introduction

> **File:** `src/components/sidebar/Sidebar.astro` (inline section)

| Element | Property | Value |
|---|---|---|
| Section gap | `gap-2` | 8px between name block and bio |
| **h1 "Fitri Zahwa"** | Font | DM Sans |
| | Size | 32px |
| | Weight | 700 |
| | Color | `#111827` |
| | Letter spacing | tight |
| | Line height | tight (1.25) |
| **Subtitle** | Font | Inter |
| | Size | 16px |
| | Weight | 400 |
| | Color | `#9CA3AF` |
| | Margin top | 4px |
| **Bio paragraph** | Font | Inter |
| | Size | 16px |
| | Weight | 400 |
| | Color | `#6B7280` |
| | Line height | relaxed (1.625) |

---

### 6.3 NavMenu

> **File:** `src/components/sidebar/NavMenu.astro`

#### Section label — "EXPLORE"

| Property | Value |
|---|---|
| Font size | 16px |
| Weight | 600 (semibold) |
| Color | `#111827` |
| Transform | `uppercase` |
| Letter spacing | `widest` (0.1em) |
| Margin bottom | 12px |

#### Nav item row

| State | Background | Text color | Weight | Arrow |
|---|---|---|---|---|
| **Active** | `#F3F4F6` | `#111827` | 500 | Visible |
| **Default** | Transparent | `#6B7280` | 400 | Hidden |
| **Hover** | `#F9FAFB` | `#1F2937` | 400 | Slides in |

| Property | Value |
|---|---|
| Padding | `12px` left/right (`px-3`) · `10px` top/bottom (`py-2.5`) |
| Border radius | `8px` (`rounded-lg`) |
| Font size | 16px |
| Gap between items | `4px` (`gap-1`) |
| Transition | `all 200ms ease` |

#### Arrow icon `→`

| State | Opacity | Transform |
|---|---|---|
| Default | `0` | `translateX(-4px)` |
| Hover / Active | `1` | `translateX(0)` |
| Transition | `opacity 200ms ease` + `transform 200ms ease` | |

---

### 6.4 SocialLinks

> **File:** `src/components/sidebar/SocialLinks.astro`

#### Section label — "FIND ME AT"

| Property | Value |
|---|---|
| Font size | 16px |
| Weight | 600 |
| Color | `#111827` |
| Transform | `uppercase` |
| Letter spacing | `widest` |
| Margin bottom | 12px |

#### Link items (Email · LinkedIn · GitHub · Instagram)

| State | Icon color | Text color |
|---|---|---|
| **Default** | `#9CA3AF` | `#6B7280` |
| **Hover** | `#FF49DB` | `#111827` |

| Property | Value |
|---|---|
| Layout | `flex` column |
| Gap between links | `8px` (`gap-2`) |
| Icon size | `16 × 16px` |
| Icon-to-text gap | `8px` (`gap-2`) |
| Font size | 16px |
| Transition | `color 200ms` |

---

## 7. Canvas Panel

> **File:** `src/components/canvas/CanvasPanel.astro`

| Property | Value |
|---|---|
| Background | `#F5F5F5` |
| Flex | `flex-1` (fills remaining width) |
| Height | `100%` |
| Padding | `24px` all sides (`p-6`) |
| Inner div | `w-full h-full overflow-hidden` |
| Drag hint text | `"DRAG THE CENTER NODE"` · 10px · `#9CA3AF` · `tracking-widest` · `uppercase` |
| Hint position | `absolute top-4` · horizontally centered |

---

## 8. Force Graph Nodes

> **File:** `src/components/canvas/ForceGraph.tsx`  
> **Engine:** d3-force (forceSimulation + forceLink + forceManyBody + forceCollide)

### Simulation config

| Force | Setting |
|---|---|
| Link distance | `190px` (to box) · `200px` (to pills) |
| Link strength | `0.08` default · `0.18` on drag release |
| Charge | `forceManyBody` strength `-280` |
| Collision radius | `64px` (center) · `56px` (others) |
| Alpha decay | `0.015` |
| Velocity decay | `0.65` default |
| Alpha min | `0.001` |

---

### 8.1 Center Node

| Property | Value |
|---|---|
| Shape | Circle |
| Radius | `40px` |
| Fill | Radial gradient `#FFFFFF → #E2E8F0` |
| Stroke (default) | `#E2E8F0` · `1.5px` |
| Stroke (hover) | `#FF49DB` · `1.5px` |
| Filter (hover) | Glow blur `stdDeviation: 8` |
| Cursor | `grab` / `grabbing` during drag |
| **Pulse ring** | |
| └ Radius | `48px` |
| └ Stroke | `#CBD5E1` · `1.5px` |
| └ Opacity | `0.3` |
| └ Animation | `pulse-ring 2.8s ease-out infinite` |
| **Label "Fitri Zahwa"** | |
| └ Font | Inter · 13px · 600 |
| └ Color | `#111827` |
| └ Offset | `dy: -6` (above center) |
| **Sub-label "📍 Indonesia"** | |
| └ Font | Inter · 10px · 400 |
| └ Color | `#9CA3AF` |
| └ Offset | `dy: 9` (below center) |

---

### 8.2 Box Node — Work

| Property | Value |
|---|---|
| Shape | Rounded rectangle |
| Size | `80 × 44px` |
| Border radius | `8px` |
| Fill (default) | `#FFFFFF` |
| Stroke (default) | `#E5E7EB` · `1px` |
| Stroke (hover) | `#FF49DB` |
| Filter (hover) | Pink glow (`flood-color: #FF49DB · opacity: 0.35`) |
| Cursor | `pointer` |
| **Label "Work"** | Font: Inter · 12px · 600 · `#111827` / hover: `#FF49DB` |
| **Sub-label "Go to work"** | Font: Inter · 9.5px · 400 · `#9CA3AF` |

---

### 8.3 Pill Nodes — Read / Design / Contact

| Property | Value |
|---|---|
| Shape | Rounded rectangle |
| Border radius | `20px` |
| Fill (default) | `#F9FAFB` |
| Fill (hover) | `#FFF0FA` |
| Stroke (default) | `#E5E7EB` · `1px` |
| Stroke (hover) | `#FF49DB` |
| Padding | `16px` left/right · `9px` top/bottom |
| Size | Auto-sized via SVG `getBBox()` |
| Cursor | `pointer` |
| **Label** | Font: Inter · 12px · 500 · `#374151` / hover: `#FF49DB` |

---

### 8.4 Links (Edges)

| Property | Value |
|---|---|
| Stroke color | `#D1D5DB` |
| Stroke width | `1px` |
| Style — to box node | Dashed `6 4` |
| Style — to pill nodes | Dashed `4 4` |
| Stroke linecap | `round` |
| Opacity | `0.7` |

---

## 9. Animations & Transitions

### CSS Keyframes

| Name | Trigger | Behavior | Duration |
|---|---|---|---|
| `pulse-ring` | Always (center node) | SVG circle expands `r: 44→64` and fades out | `2.8s ease-out infinite` |
| `float-in` | On mount | Element slides up 6px + fades in | `0.4s ease forwards` |

### JS / Interaction Transitions

| Name | Trigger | Behavior | Timing |
|---|---|---|---|
| Arrow slide-in | Nav item hover | `→` icon: `opacity 0→1` + `translateX(-4px → 0)` | `200ms ease` |
| Nav hover | Nav item hover | Background + text color change | `200ms ease` |
| Social icon | Social link hover | Icon color → `#FF49DB` | `200ms` |
| Node hover (center) | `mouseenter` | Stroke → pink + glow filter | Immediate |
| Node hover (box) | `mouseenter` | Pink stroke + pink glow + text → pink | Immediate |
| Node hover (pill) | `mouseenter` | Fill → pink tint + pink stroke + text → pink | Immediate |
| Cursor dot | `mousemove` | Follows cursor position | `~16ms` (rAF) |

### Drag Spring Physics (center node)

| Phase | Delay | velocityDecay | alphaTarget | linkStrength |
|---|---|---|---|---|
| Release | 0ms | `0.28` | `0.35` | `0.18` |
| Dampen | 450ms | `0.50` | `0.15` | — |
| Stop | 900ms | `0.70` | `0` | `0.08` |

---

## 10. File Structure

```
src/
├── styles/
│   └── global.css               ← Tailwind directives · keyframes · cursor-none · scrollbar-hide
├── layouts/
│   └── BaseLayout.astro         ← HTML shell · Google Fonts · global CSS import
├── components/
│   ├── sidebar/
│   │   ├── Sidebar.astro        ← Card container (288px · rounded · shadow)
│   │   ├── Avatar.astro         ← Profile photo placeholder
│   │   ├── NavMenu.astro        ← EXPLORE section with 5 nav items
│   │   └── SocialLinks.astro    ← FIND ME AT section (Email · LinkedIn · GitHub · Instagram)
│   └── canvas/
│       ├── CanvasPanel.astro    ← Canvas wrapper with 24px padding
│       └── ForceGraph.tsx       ← React island · d3-force · drag · cursor dot
└── pages/
    └── index.astro              ← Two-column page layout
```

