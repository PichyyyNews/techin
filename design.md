# Design System Specification: S.pichayut (Light Theme Monochrome)

> **Document Status**: Canonical Project Reference  
> **Brand Identity**: S.pichayut  
> **Theme Direction**: Black & White Minimalist Light Theme (`#FFFFFF` / `#09090B`)  
> **Visual Background Engine**: React Bits Pro "Blinking Squares"  

---

## 1. Core Visual Directives & Theme Architecture

### 1.1 Aesthetic Stance
- **Strict Monochrome**: Pure clean white background (`#FFFFFF`), high-contrast dark text (`#09090B`), subtle neutral borders (`#E4E4E7` / `#E5E5E5`), and solid black action buttons.
- **Precision Grid Layout**: Hairline boundaries, modular alignments, and deliberate typographic rhythm.
- **Subtle Atmospheric Motion**: Blinking Squares background from React Bits Pro quietly twinkling on the right half of the hero viewport.

---

## 2. Design Tokens & Color Palette

| Token Name | Value | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FFFFFF` | Global light background |
| `--bg-surface` | `#FAFAFA` / `#F4F4F5` | Badges, subtle hover states, popovers |
| `--border-hairline` | `#E4E4E7` / `#E5E5E5` | 1px dividers, header bottom border, card borders |
| `--text-primary` | `#09090B` | Headlines, primary text, brand wordmark |
| `--text-secondary` | `#52525B` | Subtitles, body descriptions, nav menu links |
| `--text-muted` | `#71717A` / `#A1A1AA` | Metadata, tags, footer copyright |
| `--btn-primary-bg` | `#09090B` | Black primary CTA button background |
| `--btn-primary-text` | `#FFFFFF` | Primary CTA button text |
| `--square-color` | `#000000` | Blinking Squares particle color |
| `--scrollbar-thumb` | `rgba(0, 0, 0, 0.18)` | Minimalist 6px custom scrollbar thumb |

---

## 3. Typography Scale & Scroll Mechanics

- **Display Headline**: `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] [text-wrap:balance]`
- **Body & Subtitle**: `text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl`
- **Brand / Monospace Elements**: `font-mono text-xs sm:text-sm font-semibold`
- **Nav Links**: `text-sm font-medium text-neutral-600 hover:text-black`
- **Custom Scrollbar**: Ultra-thin 6px rounded thumb with zero arrows/buttons and transparent track matching Swiss-minimalist aesthetics.

---

## 4. Components & Layout Breakdown

### 4.1 Navbar (`S.pichayut`)
- **Left Logo**: Square badge with "S" glyph + `S.pichayut` monospace wordmark.
- **Right Nav Menu**: Mock navigation links (`Work`, `Projects`, `Experience`, `About`, `Contact`).
- **Primary CTA**: Black button `[Get in touch]`.

### 4.2 Hero Section with Blinking Squares
- **Background**:
  ```tsx
  <BlinkingSquares
    direction="right"
    gridSize={16}
    squareSize={0.55}
    fadeStart={0.35}
    fadeEnd={1.00}
    falloff={1.25}
    minBrightness={0.55}
    twinkleSpeed={2.05}
    twinkleStrength={0.94}
    intensity={1.00}
    opacity={1.00}
    squareColor="#000000"
    background="#FFFFFF"
  />
  ```
- **Headline**: "Teaching Practicum Performance & Activity Log" (Rendered via ReactBits `<TextType />` typing effect)
- **Sub-headline**: "Track daily teaching operations, lesson plans, and educational innovations."
- **Primary CTA**: Solid black `[Explore Activity Log]`
- **Secondary CTA**: 1px bordered `[View Lesson Plans]`

---

## 5. ReactBits Components Integration

### 5.1 `<TextType />`
Dynamic human-like typing effect for the Hero Headline powered by GSAP.
- `typingSpeed`: `85ms` (natural, relaxed typing pace)
- `pauseDuration`: `4200ms` (comfortable reading duration)
- `deletingSpeed`: `35ms`
- `initialDelay`: `300ms`
- `showCursor`: `true`
- `cursorCharacter`: `"|"`

### 5.2 `<BlinkingSquares />`
- Fine high-density micro-grid background (`gridSize={16}`, `squareSize={0.55}`) with directional dithered fade.

### 5.3 `<BadgeCanvas />` (3D Interactive Lanyard Event Badge)
- Built with **Three.js**, **React Three Fiber (`@react-three/fiber`)**, and **`@react-three/drei`**.
- Features realistic lanyard strap ribbon, metallic clamp and ring, smooth rounded 3D card body, typography with metallic accents, and interactive drag/rotate via `OrbitControls`.
- Integrated on the right side of the Hero section in a 2-column responsive layout.
