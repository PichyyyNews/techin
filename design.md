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
| `--square-color` | `#27272A` | Blinking Squares particle color |

---

## 3. Typography Scale

- **Display Headline**: `text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.06]`
- **Body & Subtitle**: `text-base sm:text-xl text-neutral-600 leading-relaxed font-normal`
- **Brand / Monospace Elements**: `font-mono text-xs sm:text-sm font-semibold`
- **Nav Links**: `text-sm font-medium text-neutral-600 hover:text-black`

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
    fadeEnd={0.98}
    falloff={1.35}
    minBrightness={0.35}
    twinkleSpeed={1.2}
    twinkleStrength={0.92}
    intensity={1.0}
    opacity={0.75}
    squareColor="#52525b"
    background="#FFFFFF"
  />
  ```
- **Content**:
  - Massive display title: "Building high-craft interfaces & digital systems."
  - Primary button: Solid black `[Explore Projects]`.
  - Secondary button: 1px bordered `[Read Experience]`.
  - Tech highlights strip: Monospace pills with hairline top divider.

---

## 5. React Bits Pro Integration
- Registry configured in `components.json`:
  ```json
  {
    "registries": {
      "@reactbits-starter": {
        "url": "https://pro.reactbits.dev/r/starter",
        "headers": {
          "Authorization": "Bearer ${REACTBITS_LICENSE_KEY}"
        }
      }
    }
  }
  ```
- Direct component implementation in `src/components/ui/BlinkingSquares.tsx` supporting dynamic canvas scaling, direction fade curves, and random twinkling oscillation.
