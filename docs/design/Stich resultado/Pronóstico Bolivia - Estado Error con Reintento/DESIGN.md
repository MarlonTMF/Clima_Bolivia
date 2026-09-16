---
name: Altiplano & Llanos Synoptic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#894d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac6200'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  tabular-data-xl:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.02em
  tabular-data-lg:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  tabular-data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  tabular-data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is built for institutional precision, meteorological governance, and scientific utility across Bolivia’s diverse physiographic zones—from the extreme altitudes of La Paz and Potosí to the tropical lowlands of Santa Cruz, Trinidad, and Cobija. The visual language eschews atmospheric dramatization, weather-app novelty, and decorative fluff in favor of rigorous tabular clarity, reliable information hierarchy, and calm institutional authority.

The aesthetic philosophy is **Rational Modernism / Technical Utility**:
- Zero superfluous gradients or simulated weather backdrops.
- Data density treated with structural discipline and air, allowing analysts, municipal authorities, and citizens to rapidly digest pressure levels, precipitation thresholds, wind vectors, and UV indexes.
- High legibility under varied outdoor field conditions, prioritizing contrast compliance and optical stability across desktop workstations and mobile instruments.

## Colors

The palette is engineered for prolonged observational focus and uncompromising technical clarity.

- **Background & Canvas:** Pure subtle slate canvas `#F8FAFC` provides an glare-free, clinical ground. Surfaces and containers adopt `#FFFFFF` to create defined, orderly analytical cards.
- **Structural Outlines:** Subtle, crisp borders rendered strictly in `#E2E8F0` segment data clusters without visual weight or clutter.
- **Primary Text:** Deep carbon `#0F172A` provides near-black contrast (AAA ratio) for instantaneous data recognition.
- **Secondary / Supporting Text:** Slate grey `#64748B` handles metadata, measurement units (hPa, m/s, mm, °C), time stamps, and tabular headers.
- **Primary Accent:** Slate Cyan `#0284C7` acts as a surgical focal marker. It indicates the active capital selection, synoptic anomalies, and interactive states without evoking commercial playfulness.
- **Data States & Critical Thresholds:** Functional alerts must follow muted, non-vibrant tones: Warning / High Solar Radiation `#D97706`, Severe Pluvial Alert `#DC2626`, and Nominal Flow `#16A34A`.

## Typography

The typographic hierarchy prioritizes objective readability and tabular alignment:

- **Primary Interface Font:** `Inter` handles all prose, headings, station designations, and operational labels. It provides neutral, unadorned structural clarity.
- **Numerical & Metric Font:** `JetBrains Mono` is enforced for all quantitative output (barometric readings, elevation figures, coordinates, temperature, wind bearings, humidity percentages). This prevents column jitter during real-time synoptic refreshes.
- All numbers within tables and telemetry displays must enable lining tabular figures (`font-variant-numeric: tabular-nums lining-nums`).
- Uppercase tracking (`letterSpacing: 0.04em`) is reserved exclusively for small station category chips, telemetry codes, and metadata headers.

## Layout & Spacing

The layout is grounded in a modular 12-column grid designed for tabular and comparative analysis across all 9 departmental capitals (La Paz, Sucre, Cochabamba, Santa Cruz de la Sierra, Oruro, Potosí, Tarija, Trinidad, Cobija).

- **Grid Architecture:** 12 columns with 1.5rem (24px) gutters on desktop (`≥ 1024px`), transforming to an 8-column layout on tablets (`768px - 1023px`), and a single or 2-column stacked layout on mobile (`< 768px`).
- **Data Spacing Matrix:** Padding within cards adheres strictly to `space-md` (16px) for telemetry blocks and `space-lg` (24px) for master station overviews. Dense tabular metrics utilize condensed row paddings (`space-xs` vertically, `space-sm` horizontally).
- **Synchronized Comparison:** The 9-capital overview grid reflows into a 3x3 uniform telemetry matrix on wide displays, ensuring simultaneous observation without horizontal scroll requirements.

## Elevation & Depth

Depth in this system is strictly architectural and non-skeuomorphic:

- **Zero Dramatic Shadows:** Atmospheric elevation drop-shadows are eliminated to prevent rendering degradation and retain a clean analytical plane.
- **Low-Contrast Structural Borders:** Surface delineation relies exclusively on 1px solid borders in `#E2E8F0`. 
- **Surface Layering:** 
  - Ground level: Canvas `#F8FAFC`.
  - Analytical Layer 1: White `#FFFFFF` with 1px border.
  - Interactive Hover / Focus State: Border color steps to `#CBD5E1`; subtle background shift on interactive rows to `#F1F5F9`.
  - Active Station Highlight: 1px border colored in `#0284C7` with a zero-offset focus outline (`box-shadow: 0 0 0 1px #0284C7`).

## Shapes

The design system employs a restrained, disciplined corner treatment:

- **Soft Radius (`roundedness: 1`):** Base components (buttons, input fields, badges) use 4px (`0.25rem`) corner rounding.
- **Cards & Data Modules:** Cards use 6px to 8px (`rounded-lg`) borders, preserving a structured, calibrated tool appearance without clinical harshness.
- Pills and circles are strictly avoided, except for minimal 8px diameter status indicators (e.g., active telemetry pulse). No pill-shaped buttons or rounded pills are permitted in technical layouts.

## Components

### Station Selector & Departmental Tabs
A horizontal segmental switch or clean vertical selector displaying all 9 capitals. Active state is indicated by a 2px solid `#0284C7` bottom or side anchor and `#0F172A` text; inactive tabs use `#64748B` with no fill.

### Telemetry Cards & Metric Panels
- **Container:** Pure `#FFFFFF` background, 1px border in `#E2E8F0`, 4px radius.
- **Header:** Station identifier (e.g., `SLLP / EL ALTO - LA PAZ`) in `label-sm` with `#64748B`, uppercase.
- **Value Core:** Primary parameter (e.g., `9.4 °C`, `1014.2 hPa`) in `tabular-data-xl` (`JetBrains Mono`, `#0F172A`).
- **Sub-metrics:** Secondary parameters (dew point, relative humidity, wind vector) aligned horizontally along a hair-thin divider line (`#F1F5F9`), utilizing `tabular-data-sm`.

### Tabular Station Grid (Synoptic Overview)
A tabular matrix tracking all 9 capitals simultaneously:
- **Header Row:** Border-bottom 1px `#CBD5E1`, text uppercase `label-sm` in `#64748B`.
- **Row Anatomy:** Alternating or bordered rows with 36px fixed height, numeric data right-aligned in `tabular-data-md`, and station names left-aligned in `body-md` bold (`#0F172A`).

### Buttons & Operational Controls
- **Primary:** Solid `#0284C7` fill, white `#FFFFFF` text in `label-md`, 4px radius, 0px border. Hover: `#0369A1`. Focus: 2px ring `#BAE6FD`.
- **Secondary / Ghost:** White `#FFFFFF` fill, 1px `#E2E8F0` border, `#0F172A` text. Hover: `#F8FAFC` background with `#CBD5E1` border.

### Badges & Technical Status Chips
Subdued, flat indicators with 2px corner radius. No rounded pills.
- Example: `UV 11+ [EXTREMO]` rendered with 1px border `#FCA5A5`, text `#991B1B`, and background `#FEF2F2`.

### Inputs & Filter Fields
Inputs adopt a white surface, 1px border `#CBD5E1`, 4px radius, and `body-md` text. Focus state transitions border to `#0284C7` without glow or distortion.