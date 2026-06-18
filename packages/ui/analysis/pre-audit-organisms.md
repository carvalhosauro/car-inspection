# Pre-Audit: Organisms — UI/UX Review
**Date:** 2026-06-17
**Phase:** Before improvements

---

## Overall Score: 4.5/10

The three organisms share a common baseline problem: they are structurally sound but visually raw. The token system is well-organized (color, spacing, type scale), yet the components largely ignore the expressive potential it offers. No hover transitions, no focus rings, no font-family declaration, no icon vocabulary beyond the BottomNav's center-action button. For a field app used by inspectors under time pressure, the lack of clear affordance signals is a UX liability as much as a visual one.

---

## Component Reviews

### Sidebar — 4/10

**Source files:**
- `packages/ui/src/organisms/Sidebar/Sidebar.web.tsx`
- `packages/ui/src/organisms/Sidebar/Sidebar.module.css`
- `packages/ui/src/organisms/Sidebar/Sidebar.logic.ts`

**Visual appeal:** The dark background (`--color-dark: #0F172A`) against white text has potential for a premium, professional feel. However, zero transition on the active state, no icon per nav item, and a font rendered in whatever the browser defaults to (Times New Roman on most unset systems) kills that potential immediately. The logo area is a plain `<span>` — no visual weight differentiation beyond `font-weight: 700`.

**Navigation UX:** The 8-item nav list is functional. Active state is clearly distinguished (primary blue fill). Collapsed state hides labels and narrows to 64px, but the collapsed view has no icons at all — only an empty button. Field inspectors navigating in collapsed mode on a tablet have no affordance: they cannot identify the destination before clicking. This is a critical usability gap.

**Spacing & layout:** `gap: var(--space-xs)` (4px) between nav items is very tight. The 8px padding on each `.link` item (`var(--space-sm)`) compresses the tap target. On desktop this is acceptable; on a touch display (inspectors with gloves, or a tablet sidebar) the minimum recommended tap target is 44×44px. Current item height is approximately 32px at body font size — undersized.

**Typography:** `font-size: var(--font-body-size)` (16px) for links and `var(--font-h3-size)` (24px) for the logo are reasonable scales. No `font-family` is set, so browsers default to serif (typically Times New Roman). No `font-weight` distinction between active and inactive links — both render at browser-default weight.

**Interactive states:**
- Active: solid primary background — clear, good.
- Hover: nothing. No color change, no background tint, no cursor feedback beyond the default `cursor: pointer`.
- Focus: no visible focus ring. Keyboard users navigating via Tab have no visible indicator.
- Collapsed: no tooltip or icon — completely unnavigable without label text.

**Responsiveness:** Web-only by design. No `@media` queries — assumes sidebar is always visible. No breakpoint where the sidebar collapses automatically on small viewports. No `min-height` guard on the container.

**Improvements needed:**
- Add an `icon` field to `NavLink` and render SVG icons (or an icon component) in both expanded and collapsed states. Collapsed mode is unusable without them.
- Add a `:hover` rule: `background: rgba(255,255,255,0.07)` and `color: var(--color-neutral-white)` to give clear hover feedback on dark background.
- Add a `:focus-visible` outline for keyboard accessibility.
- Increase link padding from `var(--space-sm) var(--space-md)` to `var(--space-md) var(--space-md)` to meet 44px minimum tap-target height.
- Add `gap: var(--space-xs)` → `gap: 2px` between items and use `var(--space-sm)` as the outer section gap for better visual grouping.
- Add `font-family` once a typeface is chosen (critical across all components).
- Add `transition: background 150ms ease, color 150ms ease` to `.link` for micro-animation polish.
- Add `title` attribute to buttons in collapsed mode as a fallback tooltip.
- Introduce an `auto-collapse` `@media (max-width: 768px)` rule so the sidebar doesn't overflow on tablet breakpoints.

---

### BottomNav — 5/10

**Source files:**
- `packages/ui/src/organisms/BottomNav/BottomNav.web.tsx`
- `packages/ui/src/organisms/BottomNav/BottomNav.module.css`
- `packages/ui/src/organisms/BottomNav/BottomNav.logic.ts`

**Visual appeal:** The floating center action (Camera button lifted 12px via `translateY(-12px)`, circular, primary blue) is the single standout design decision in all three organisms — it communicates hierarchy and primary action effectively. The error-red badge with `border-radius: 9999px` is clean. Everything else — four flat text labels with no icon representation — looks like an unfinished scaffold.

**Navigation UX:** The tab labels ("Início", "Vistorias", "Câmera", "Alertas", "Perfil") currently render as pure text. Without icons, a bottom nav loses all peripheral legibility — users must read each word, negating the speed advantage a bottom nav provides over other nav patterns. The `font-size: var(--font-small-size)` (12px) is appropriate for under-icon labels, but as the sole identifier it is inadequate. The "Câmera" center button also renders its label as text inside the circle, which fights against the visual intent of a focal CTA.

**Spacing & layout:** `padding: var(--space-sm)` (8px) on the bar. The `.tab` has no explicit minimum height — it will be whatever the font renders to. On iOS Safari the safe-area-inset-bottom is not accounted for (`padding-bottom: env(safe-area-inset-bottom)` is absent). Inspector phones with home indicator will have the nav clipped or overlapping the OS gesture bar.

**Typography:** 12px labels are at the absolute floor of legibility. No font weight differentiation between active and inactive tabs (both use `color` alone).

**Interactive states:**
- Active: color change to `--color-primary` — minimal but functional.
- Hover: none.
- Focus: no `:focus-visible` ring on any tab button.
- Center button: no pressed/active state beyond browser default.
- Badge: correctly placed but will overlap icon area once icons are added (position `top: -4px, right: 8px` is calibrated for text-only layout).

**Responsiveness:** Designed for mobile-width bottoms. On desktop, `justify-content: space-around` spreads 5 items across full viewport width — tabs will be 200px+ wide each on a 1280px screen, which is visually broken for a bottom nav pattern. Bottom nav should be capped to a max-width or conditionally hidden on wide viewports (use the Sidebar instead).

**Improvements needed:**
- Replace Unicode emoji / text-only labels with proper icon + label pairs. The `Tab` type already has `label` and `center` fields — add an `icon` field (SVG component or icon name string).
- Add `padding-bottom: env(safe-area-inset-bottom)` to `.bar` for iPhone home indicator safe area.
- Add `max-width: 480px; margin: 0 auto;` and `@media (min-width: 768px) { display: none; }` to hide bottom nav on desktop and prevent tab stretching.
- Add `min-height: 44px` to `.tab` for minimum tap target compliance.
- Add `:hover` tint and `:focus-visible` ring to all tab buttons.
- Add `transition: color 150ms ease` for active state change.
- Recalibrate badge `right` position once icons are added.
- Consider a short label + icon layout where the center CTA shows only the icon (no text) to reinforce its unique role.

---

### DataTable — 4.5/10

**Source files:**
- `packages/ui/src/organisms/DataTable/DataTable.web.tsx`
- `packages/ui/src/organisms/DataTable/DataTable.module.css`
- `packages/ui/src/organisms/DataTable/DataTable.logic.ts`

**Visual appeal:** The alternating row pattern (`nth-child(even)` → `--color-neutral-50`) is the right instinct — it adds subtle visual rhythm. However, `--color-neutral-50: #F8FAFC` is nearly identical to `--color-neutral-white: #FFFFFF` (2% lightness difference). Under typical office or field lighting on a non-calibrated screen, this contrast is invisible. The headers use `--color-neutral-600` (a dark slate) at 12px — correct for secondary hierarchy but very small. The pagination buttons look functional-only: no hover state, no active affordance, no visual distinction between enabled and disabled beyond text color change.

**Navigation UX:** No empty state is handled — if `rows` is empty, the component renders an empty `<tbody>` with no message. For a vehicle inspection app, inspectors will frequently land on zero-result views (no pending inspections in a filtered period). This blank table is a UX dead end. No loading state is handled either. No row click affordance — the only interaction is via `onView`/`onEdit` icon buttons, but there is no hover background on rows to suggest they are interactive.

**Spacing & layout:** `padding: var(--space-sm) var(--space-md)` (8px / 16px) on both `th` and `td` is the minimum viable cell padding. Row height will compress under multi-line content. The pagination area uses `justify-content: flex-end` which is correct, but the "Página X de Y" text and the two buttons sit with only `var(--space-md)` (16px) gap — acceptable but could be more generous. The `.wrapper` uses `gap: var(--space-sm)` between table and pagination — fine.

**Typography:** `12px` for headers and `16px` for cell content gives a sensible hierarchy. Header text has no `font-weight` override — it renders at browser default (typically 700 for `<th>` elements, which is correct but not explicitly controlled). No uppercase or letter-spacing treatment on headers, which is standard practice for table column labels to aid scannability.

**Interactive states:**
- Row hover: none. Rows do not change background on hover.
- Action buttons: delegated to `IconButton` — behavior unknown from this file, likely handled there.
- Pagination buttons: no `:hover` style defined. Only `:disabled` state is handled (text color grays out).
- No `:focus-visible` on pagination buttons.

**Responsiveness:** `width: 100%` on the table is correct. No horizontal scroll container for overflow — on small viewports with many columns, the table will break the page layout or truncate content. No `min-width` on columns. No responsive strategy (e.g., card-per-row view at mobile breakpoint or horizontal scroll wrapper). For a field inspector app where the table may be viewed on a phone, this is a gap.

**Improvements needed:**
- Add an empty state: when `rows.length === 0`, render a centered placeholder with a descriptive message (e.g., "Nenhum registro encontrado") and optionally a call-to-action.
- Add a loading state prop (`isLoading?: boolean`) with a skeleton row pattern.
- Add row hover background: `.row:hover { background: var(--color-neutral-50); cursor: pointer; }` — but only if a row-level click handler is wired up.
- Add `:hover` and `:focus-visible` states to `.pageButton`.
- Wrap `<table>` in `overflow-x: auto` container for mobile viewport protection.
- Upgrade header style: add `text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;` to `.th` for clearer column identity.
- Increase `.th` and `.td` padding to `var(--space-md) var(--space-lg)` for more breathing room per row, especially on desktop.
- Consider striped rows with a more perceptible color difference (e.g., `--color-neutral-100` if a token is added, or a 5% opacity primary tint).
- Add `font-weight` control explicitly to `th` (don't rely on browser UA).

---

## Cross-Component Issues

### No font-family anywhere
All three components — and the entire token file — contain zero `font-family` declarations. Every rendered character is subject to the browser's default, which varies by OS: Times New Roman (Windows), Georgia (macOS default serif), or a system sans-serif if the user has changed preferences. For a professional vehicle inspection product, this is the single most damaging aesthetic gap. A single `font-family` declaration in `web.css` on `:root` (e.g., `'DM Sans', 'IBM Plex Sans', or 'Outfit'`) would immediately elevate all three components.

### No hover/focus transitions
None of the three components define a `transition` property on interactive elements. All state changes (active, hover, focus) are instant. Even a `150ms ease` on `color` and `background` properties would make the interface feel more responsive and polished without adding visual complexity.

### No icon system
Both the Sidebar (collapsed state) and BottomNav (all states) are functionally broken without icons. The `NavLink` and `Tab` types need an `icon` field, and a consistent icon component (SVG-based) needs to be established. This is a system-level gap, not a per-component cosmetic issue.

---

## Top 3 Priority Fixes (cross-component)

1. **Establish a font-family in `web.css` `:root`** — Add a modern, legible sans-serif (e.g., `'DM Sans'`, `'Outfit'`, or `'IBM Plex Sans'`) as `--font-family-base` and apply it via a universal selector or `body`. This single change has the highest visual impact-to-effort ratio of any fix in this audit. Every component benefits immediately with zero structural changes.

2. **Add an `icon` field to `NavLink` and `Tab`, and render icons in both Sidebar and BottomNav** — The Sidebar's collapsed state is completely non-functional without icons (users cannot identify navigation targets). The BottomNav relies entirely on text labels, removing the primary speed advantage of a bottom navigation pattern. An icon vocabulary is non-optional for a field inspector tool where users navigate quickly under cognitive load.

3. **Add hover and focus-visible states to all interactive elements across all three components** — Currently, no organism responds to hover with any visual feedback, and keyboard focus is invisible. This is both a UX regression (no affordance) and an accessibility failure (WCAG 2.4.7 requires visible focus indicators). A shared CSS utility or a token-level definition for `--focus-ring` would allow consistent treatment across the system.
