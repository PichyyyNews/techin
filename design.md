# Design System Specification & Architecture: "No AI Slop" Standard

> **Document Status**: Canonical Reference Document  
> **Target Aesthetic**: Swiss Minimalist × Developer Tooling × Retro-Futurist Halftone Craft  
> **Inspiration Benchmarks**: Frame, Pixelpush, Linear, Vercel, Raycast, Teenage Engineering  

---

## 1. Core Visual Identity & Design Tenets

### 1.1 The "Anti-AI-Slop" Manifesto
Most automated modern web design suffers from generic mediocrity:
- Neon purple/cyan gradient text on dark backgrounds
- Bloated `rounded-3xl` cards with empty floating emojis
- Overused frosted glass blur (`backdrop-blur-xl bg-white/10`) lacking structural borders
- Unclear typographic hierarchy and buzzword-heavy copy

**Our Counter-Standard**:
1. **Typography First**: Sharp, deliberate typography pairing tight grotesque sans with precision monospace data elements.
2. **Monochrome Rigor**: 90% monochrome baseline (deep blacks, clean off-whites, neutral grays) with a single deliberate accent (Industrial Orange / Amber).
3. **Mathematical & Procedural Visuals**: Bespoke generative ASCII canvas art, halftone dot matrices, mosaic pixel dithering, and dotted 3D spatial globes.
4. **Hairline Tactility**: 1px borders, subtle surface contrast, and micro-interactions that feel engineered, not generated.

---

## 2. Color System & Design Tokens

### 2.1 Palette Matrix

| Token Name | Light Mode Hex | Dark Mode Hex | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FAFAFA` | `#0A0A0A` | Global background canvas |
| `--bg-surface` | `#FFFFFF` | `#121212` | Cards, popovers, dropdowns |
| `--bg-surface-subtle` | `#F4F4F5` | `#18181B` | Pill navs, hovered items, secondary buttons |
| `--border-hairline` | `#E4E4E7` | `#27272A` | Primary 1px structural dividers and card borders |
| `--border-subtle` | `#F4F4F5` | `#1F1F23` | Inner card dividers, grid guidelines |
| `--text-primary` | `#09090B` | `#FAFAFA` | Main headings, primary CTA text, high contrast |
| `--text-secondary` | `#52525B` | `#A1A1AA` | Body copy, secondary nav links, descriptions |
| `--text-muted` | `#71717A` | `#71717A` | Metadata, timestamps, captions, square bullets |
| `--accent-primary` | `#FF5500` (`#F97316`) | `#FF661F` | Stat numbers (`20M+`), active bullets (`■`), horizon glow |
| `--accent-glow` | `rgba(255, 85, 0, 0.15)` | `rgba(255, 102, 31, 0.25)` | Dotted globe horizon atmospheric glow |

---

## 3. Typography Scale & Font Architecture

### 3.1 Font Stacks
- **Display & Headings**: `Geist`, `Inter`, or `Plus Jakarta Sans` (sans-serif, weights 600–800)
- **Body & Controls**: `Geist`, `Inter` (sans-serif, weights 400–500)
- **Data, Badges & Indicators**: `Geist Mono`, `JetBrains Mono` (monospace, weights 400–600)

### 3.2 Typographic Hierarchy Table

| Level | Size (Mobile / Desktop) | Weight | Tracking | Line Height | Example Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `36px / 64px` (`text-4xl md:text-6xl`) | `800` | `-0.035em` (`tracking-tight`) | `1.05` | "A baseline for products that move quickly." |
| **Section Heading** | `28px / 40px` (`text-2xl md:text-4xl`) | `700` | `-0.025em` (`tracking-tight`) | `1.15` | "A scaffold, not a finished product" |
| **Card Title** | `18px / 20px` (`text-lg md:text-xl`) | `600` | `-0.015em` | `1.25` | "Skip the blank canvas →" |
| **Stat Metric** | `36px / 52px` (`text-4xl md:text-5xl`) | `800` | `-0.03em` | `1.0` | `20M+`, `10x`, `180k+` |
| **Body Primary** | `15px / 16px` (`text-base`) | `400` | `normal` | `1.6` | Product descriptions, feature summaries |
| **Body Muted** | `13px / 14px` (`text-sm`) | `400` | `normal` | `1.55` | Scaffold card bottom descriptions |
| **Mono Eyebrow** | `11px / 12px` (`text-xs`) | `600` | `+0.08em` (`font-mono uppercase tracking-widest`) | `1.0` | `■ Global community`, `■ Videos created` |

---

## 4. Detailed Component Breakdown (From Reference Images)

### 4.1 Floating Capsule Navigation (Image 1 & 3)
- **Left**: Minimalist geometric logo (solid square/triangle badge) + crisp brand wordmark.
- **Center**: Floating pill container (`rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 px-4 py-1.5 backdrop-blur-md`).
- **Right Action Group**:
  - `Sign In` / `Log in` text button.
  - Bordered secondary pill button (`border border-neutral-300 dark:border-neutral-700 rounded-full px-4 py-1.5 text-sm`).
  - Solid high-contrast primary button (`bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full px-4 py-1.5 text-sm font-medium`).

### 4.2 Hero Section Configurations
- **Variant A (Frame Style - Image 1)**:
  - 50/50 Split layout.
  - Left: Massive headline + twin CTA (`[GET STARTED]` solid pill + `LEARN MORE ▶` circular play button).
  - Right: Generative ASCII / Halftone circular dot matrix canvas (procedural rotating donut / sphere).
- **Variant B (Pixelpush Style - Image 3)**:
  - Left: Clean value prop headline ("Make studio-grade video in minutes, not days.") + descriptive subtext.
  - Right: Mosaic pixel dithering grid in warm orange/ochre tones.

### 4.3 Scaffold Feature Cards (Image 2)
- **Container**: `rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 md:p-8 flex flex-col justify-between min-h-[220px] transition-all hover:border-neutral-400 dark:hover:border-neutral-700`.
- **Top Row**: Card title + trailing directional arrow (`Skip the blank canvas →`).
- **Bottom Row**: Technical description in muted neutral tone (`text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed`).
- **Social Proof Strip**: Hairline top border with "Trusted by teams at **Linear**" and geometric line logos.

### 4.4 Stats & Metrics Grid (Image 4)
- 3-Column horizontal bar with hairline vertical dividers (`divide-x divide-neutral-200 dark:divide-neutral-800`).
- Stat numbers rendered in **Industrial Orange** (`text-[#FF5500] font-bold text-4xl md:text-5xl`).
- Stat label paired with micro square bullet (`■` in orange) and uppercase/small-caps label (`Videos created`).
- Eyebrow header: `■ Global community` followed by tight display heading "Creators from all over the world".

### 4.5 3D Halftone Dotted Globe & Creator Badges (Image 5)
- Dotted point-cloud hemisphere / globe rendered on interactive HTML5 canvas.
- Atmospheric horizon glow in radial amber/orange.
- Floating pinned creator cards (`rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 shadow-sm flex items-center gap-2`).
- Creator avatar thumbnail + handle (`@maya.cuts`, `@leo.edits`).

---

## 5. Micro-Interactions & Physics
1. **Button Hover**: Fast `duration-150 ease-out` opacity shift (`hover:opacity-90` or `hover:border-neutral-500`).
2. **Card Hover**: Subtle 1px border brightness shift (`border-neutral-200 -> border-neutral-400`).
3. **ASCII/Halftone Animation**: Procedural sine wave / rotation at 60fps on canvas without CPU thrashing.
4. **Theme Switch**: Smooth instant color transition on `background-color` and `border-color`.

---

## 6. ReactBits Integration Standard
- Use `reactbits-dev-mcp-server` to inspect, retrieve, and customize animated components (e.g. `LetterGlitch`, `DecryptedText`, `GridDistortion`, `Iridescence`, `SpotlightCard`).
- Retain strict monochrome + orange accent tokens when integrating ReactBits components.
