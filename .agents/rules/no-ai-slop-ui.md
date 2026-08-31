# Rule: No AI Slop UI - High-Craft Frontend Engineering Standard

## 1. Philosophy & Purpose
This codebase adheres to a strict **"Anti-AI-Slop"** standard. Most AI-generated frontends look identical: generic purple/violet gradients, rounded-3xl pastel cards with floating emojis, meaningless glassmorphic blur, and empty marketing fluff.

We build **developer-grade, high-craft, minimalist web interfaces** inspired by industry leaders like Linear, Vercel, Raycast, Teenage Engineering, Frame, and Pixelpush.

---

## 2. Forbidden Anti-Patterns (The "AI Slop" Hall of Shame)

❌ **NEVER USE:**
1. **Generic Purple/Pink/Indigo Gradients**:
   - FORBIDDEN: `bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500` on text, hero backgrounds, or primary buttons.
2. **Meaningless Glassmorphism & Neon Blobs**:
   - FORBIDDEN: Random `backdrop-blur-md bg-white/5 border-purple-500/30` floating blobs with no structural purpose.
3. **Bloated, Childish Corner Radii**:
   - FORBIDDEN: Over-rounded `rounded-3xl` cards that waste screen real estate and create childish bubble aesthetics. Keep card radii crisp (`rounded-lg` or `rounded-xl` / `rounded-2xl` max).
4. **Cookie-Cutter Feature Cards**:
   - FORBIDDEN: 3 cards each with an icon inside a soft pastel rounded square followed by generic filler ("Fast", "Secure", "Scalable").
5. **Low-Contrast Illegibility**:
   - FORBIDDEN: `#888` gray text on `#222` dark background failing WCAG AA contrast. All text must be clearly readable.
6. **Fake Marketing Copy & Placeholders**:
   - FORBIDDEN: "Unlock the next-gen AI super-intelligence synergy". Write concrete, architectural, engineer-focused copy.

---

## 3. Mandatory High-Craft Principles

### A. Typography & Spatial Rhythm
- **Primary Display Font**: High-quality grotesque sans (Geist, Inter, Plus Jakarta Sans).
- **Secondary Monospace Font**: Precision mono (Geist Mono, JetBrains Mono) for labels, tags, counters, timestamps, metric indicators, and code snippets.
- **Letter Spacing (Tracking)**:
  - Hero / Display Headlines: `tracking-tight` or `tracking-tighter` (e.g. `text-4xl md:text-6xl font-bold tracking-tight`).
  - Monospace Badges & Eyebrows: `tracking-widest uppercase text-[10px]` or `text-xs font-mono`.
- **Vertical Rhythm**: Generous whitespace around key visual anchors, but tight density inside functional UI blocks.

### B. Color Palette: Strict Monochrome + Single Deliberate Accent
- **Base Canvas**:
  - Light mode: `#FAFAFA` (canvas), `#FFFFFF` (surfaces), `#E5E5E5` / `#E2E8F0` (hairline borders).
  - Dark mode: `#0A0A0A` (canvas), `#141414` (surfaces), `#262626` / `#1F1F1F` (hairline borders).
- **Intentional Accent**:
  - Primary Accent: Industrial Warm Orange / Ochre (`#FF5500`, `#F97316`, `text-orange-500`, `bg-orange-500`) used selectively for active badges, stat bullets, and subtle atmospheric rim glow.
  - Accent usage rule: Accents must never exceed 5-10% of total visual surface area.

### C. Visual Texture & Bespoke Graphics
- Use structured, mathematical, and generative textures instead of generic vector blobs:
  - **Halftone & Dotted Matrices**: ASCII canvas, circular dot matrices, procedural wave grids.
  - **Mosaic Pixel Dithering**: Precision grid pixels fading into the canvas.
  - **Dotted 3D Spatial Spheres**: Halftone point-cloud globes with atmospheric horizon glow.
  - **Technical Hairlines**: 1px crisp dividers, subtle crosshair grid markers (`+`), and dotted borders.

### D. Component Architecture & Micro-Interactions
- **Capsule / Pill Navigation**: Floating, pill-shaped nav containers (`rounded-full border px-4 py-1.5`) with high-contrast pill action buttons.
- **Scaffold Cards**: Clean border bounding boxes with directional arrows (`→`), hover border brightness transition, and muted technical descriptions.
- **Data & Metric Grids**: Multi-column split grid with hairline vertical dividers (`divide-x divide-neutral-200 dark:divide-neutral-800`), bold numeric callouts (`20M+`, `10x`), and square indicator bullets (`■`).
- **Interactive Floating Badges**: Subtle rounded avatar pills (`@creator.handle`) pinned to visual canvas points.
- **Theme Switcher**: Minimalist floating dark/light mode toggle with smooth instant transition.

---

## 4. Code Quality & TypeScript Rules
1. **Strict Types**: Always provide explicit interfaces/types for props. NEVER use `any` or loose type assertions.
2. **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<aside>` instead of `<div>` soup.
3. **Utility Function**: Use `cn()` (`clsx` + `tailwind-merge`) for clean, conflict-free class composition.
4. **Micro-Motion**: Keep animations snappy and physical (`duration-150` to `duration-200`, ease-out / spring curves). No sluggish 1-second floating bounce loops.
