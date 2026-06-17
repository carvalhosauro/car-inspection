# Post-Audit: Organisms — UI/UX Review
**Date:** 2026-06-17
**Phase:** After improvements (font token + spacing tokens + Storybook padded layout)

---

## Delta

| Metric | Pre-Audit | Post-Audit | Change |
|---|---|---|---|
| Overall Score | 4.5/10 | 5.5/10 | **+1.0** |
| Sidebar | 4/10 | 5/10 | +1.0 |
| BottomNav | 5/10 | 6/10 | +1.0 |
| DataTable | 4.5/10 | 5.5/10 | +1.0 |

**What improved:** The single most impactful cross-component fix from the pre-audit's top-priority list landed: `--font-family` is now declared in `:root` and applied via `body, button, input, select, textarea`. Every component now renders in Inter instead of the browser's serif default. This is a genuine, measurable visual upgrade — the dark Sidebar, the BottomNav labels, and the DataTable cells all benefit immediately. Two new spacing tokens (`--space-2xl`, `--space-3xl`) expand the vocabulary for future layout work, though none of the three organisms use them yet. The Storybook `layout: "padded"` change improves story presentation but has no effect on component behavior.

**What did not change:** All three components are otherwise byte-for-byte identical to pre-audit. Priority #2 (icon system — the functional blocker for Sidebar collapsed mode and BottomNav legibility) and Priority #3 (hover/focus-visible states — the accessibility and UX polish gap) remain entirely unaddressed.

---

## Overall Score: 5.5/10

The font fix closes the most embarrassing gap in the pre-audit. The interface no longer looks broken at a glance. However, the score ceiling is held down by structural UX issues that survive unchanged: collapsed Sidebar still has zero navigation affordance, BottomNav still operates as a pure text list with no icon vocabulary, and every interactive element in all three organisms still provides no hover or focus feedback. These are not cosmetic issues — they are functional and accessibility failures for a field inspector tool used under time pressure on touch devices.

---

## Component Reviews

### Sidebar — 5/10

**Source files:**
- `packages/ui/src/organisms/Sidebar/Sidebar.web.tsx`
- `packages/ui/src/organisms/Sidebar/Sidebar.module.css`
- `packages/ui/src/organisms/Sidebar/Sidebar.logic.ts`

**Visual appeal:** The dark panel now renders in Inter, which immediately reads as professional. The contrast between `--color-neutral-300` inactive links and the `--color-primary` active state is clean against `--color-dark`. The score improvement is real but bounded: a well-chosen font on a structurally unchanged layout reveals the absence of icons and transitions more clearly, not less. The logo area remains a plain `<span>` with no visual weight beyond bold text.

**Navigation UX:** Unchanged from pre-audit. The 8-item list is functional in expanded mode. In collapsed mode (`width: 64px`), the `.label` is hidden and no icon is rendered — the collapsed state is still a column of invisible buttons. A user navigating via collapsed sidebar on a tablet has no visual affordance whatsoever. This remains a critical usability gap. `NavLink` in `Sidebar.logic.ts` still has no `icon` field.

**Spacing & layout:** Unchanged. `gap: var(--space-xs)` (4px) between items. `.link` padding `var(--space-sm) var(--space-md)` (8px / 16px) yields approximately 32px item height — below the 44px minimum touch target. The two new spacing tokens (`--space-2xl`, `--space-3xl`) are declared but unused here. The sidebar has no `@media` breakpoint for auto-collapse on narrow viewports.

**Typography:** The font fix lands here most visibly. Inter at `var(--font-body-size)` (16px) for links and `var(--font-h3-size)` (24px) for the logo is a clean pairing. However, there is still no `font-weight` distinction between active and inactive links — both render at Inter's default weight (400). The active item would benefit from `font-weight: 500` or `600` to reinforce the color signal.

**Interactive states:** No change from pre-audit.
- Active: solid primary background fill — clear.
- Hover: nothing. No background tint, no color shift.
- Focus: no `:focus-visible` outline. Keyboard navigation is completely invisible.
- Collapsed: no tooltip (`title` attribute), no icon — buttons are functionally anonymous.
- Transition: none declared.

**Responsiveness:** No change from pre-audit. No `@media` queries. No auto-collapse at mobile breakpoints. No `min-height` guard.

**Remaining improvements (priority order):**
1. Add `icon` field to `NavLink` type and render an SVG icon in both expanded and collapsed states. Collapsed mode is currently non-functional without it.
2. Add `transition: background 150ms ease, color 150ms ease` to `.link`.
3. Add `.link:hover { background: rgba(255,255,255,0.07); }` for hover feedback on dark background.
4. Add `.link:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`.
5. Increase `.link` padding to `var(--space-md)` vertically to reach 44px tap target.
6. Add `font-weight: 500` to `.link[aria-current="page"]`.
7. Add `title` attribute to each collapsed-mode button as a fallback tooltip.
8. Add `@media (max-width: 768px)` auto-collapse rule.

---

### BottomNav — 6/10

**Source files:**
- `packages/ui/src/organisms/BottomNav/BottomNav.web.tsx`
- `packages/ui/src/organisms/BottomNav/BottomNav.module.css`
- `packages/ui/src/organisms/BottomNav/BottomNav.logic.ts`

**Visual appeal:** Inter's clean geometry improves the text labels noticeably over the pre-audit serif default. The floating Camera button remains the standout design decision — circular, lifted `translateY(-12px)`, primary blue. With Inter, the overall bar now reads as intentional rather than accidental. The score improvement is modest because the fundamental layout — five text labels in a white bar — is unchanged.

**Navigation UX:** Still the most structurally constrained organism. All five tabs render as text strings only. The BottomNav pattern exists specifically to provide glanceable, icon-driven navigation — without icons, users must read every label, eliminating the pattern's core speed advantage. `Tab` in `BottomNav.logic.ts` still has no `icon` field. The center Camera button renders its label ("Câmera") as text inside the circle, which competes visually with the CTA intent of the floating action button.

**Spacing & layout:** Unchanged. `padding: var(--space-sm)` (8px) on the bar. No `min-height` on `.tab`. No `padding-bottom: env(safe-area-inset-bottom)` — iPhone home indicator overlap persists. No `max-width` cap — on desktop, five tabs stretch across the full viewport width (200px+ each on 1280px screens). Badge `right: 8px` positioning is calibrated for the current text-only layout and will need recalibration when icons are added.

**Typography:** 12px Inter labels are at the legibility floor but are meaningfully more readable than 12px Times New Roman. No font-weight differentiation between active and inactive tabs. Active state remains color-only (`--color-primary` vs. `--color-neutral-600`).

**Interactive states:** No change from pre-audit.
- Active: color change to `--color-primary` — minimal but functional.
- Hover: none.
- Focus: no `:focus-visible` on any tab button.
- Center button: no pressed/active state.
- Transition: none declared.

**Responsiveness:** No change from pre-audit. `justify-content: space-around` still stretches to full viewport on desktop. No hide-on-desktop media query.

**Remaining improvements (priority order):**
1. Add `icon` field to `Tab` type and render an icon above each label. Remove label text from the center Camera button — the icon should carry it alone.
2. Add `padding-bottom: env(safe-area-inset-bottom)` to `.bar` for iPhone safe area.
3. Add `@media (min-width: 768px) { display: none; }` and `max-width: 480px; margin: 0 auto;` to prevent desktop breakage.
4. Add `min-height: 44px` to `.tab` for touch target compliance.
5. Add `transition: color 150ms ease` to `.tab` for active state change.
6. Add `.tab:hover` tint and `.tab:focus-visible` ring.
7. Recalibrate badge position once icons are in place.

---

### DataTable — 5.5/10

**Source files:**
- `packages/ui/src/organisms/DataTable/DataTable.web.tsx`
- `packages/ui/src/organisms/DataTable/DataTable.module.css`
- `packages/ui/src/organisms/DataTable/DataTable.logic.ts`

**Visual appeal:** Inter at 16px for cell content and 12px for headers is a noticeably better pairing than pre-audit. The table no longer reads as a browser-default document. The alternating row pattern, pagination controls, and action icon buttons all benefit from the font change. The near-invisible stripe (`--color-neutral-50` on white, ~2% lightness delta) remains the primary cosmetic weakness — it is difficult to perceive on any non-calibrated screen.

**Navigation UX:** No structural change. Empty state is still unhandled — an empty `<tbody>` renders with no message when `rows.length === 0`. No loading state. No row hover background to signal interactivity. The `onView`/`onEdit` icon buttons remain the only interaction points. For inspectors landing on zero-result filtered views, the blank table is still a dead end.

**Spacing & layout:** Unchanged. `padding: var(--space-sm) var(--space-md)` (8px / 16px) on `th` and `td`. The `<table>` has no `overflow-x: auto` wrapper — wide column sets will still break mobile layouts. New spacing tokens `--space-2xl` and `--space-3xl` are available but unused here; `--space-lg` (24px) and `--space-xl` (32px) already existed and could have increased cell padding.

**Typography:** The font fix applies directly to `th` and `td`. Headers at 12px Inter with no `font-weight` override still render at whatever the browser assigns `<th>` (typically 700 from UA stylesheet — correct, but not explicitly controlled). No `text-transform: uppercase` or `letter-spacing` on headers — standard practices for column label scannability that remain missing.

**Interactive states:** No change from pre-audit.
- Row hover: no background change.
- Pagination buttons: no `:hover` style. Only `:disabled` handled (text color grays out).
- Focus: no `:focus-visible` on `.pageButton`.
- Transition: none declared.

**Responsiveness:** No change. No `overflow-x: auto` wrapper. No mobile responsive strategy. No `min-width` on columns.

**Remaining improvements (priority order):**
1. Add empty state: when `rows.length === 0`, render a centered placeholder with "Nenhum registro encontrado" and optional CTA.
2. Wrap `<table>` in `overflow-x: auto` for mobile overflow protection.
3. Add `.pageButton:hover { background: var(--color-neutral-50); border-color: var(--color-neutral-600); }` and `.pageButton:focus-visible { outline: 2px solid var(--color-primary); }`.
4. Add `.row:hover { background: var(--color-neutral-50); }` — only if a row-level click handler is wired up.
5. Add `text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;` to `.th` for clearer column identity.
6. Increase cell padding to `var(--space-md) var(--space-lg)` (16px / 24px) for more breathing room.
7. Use a more perceptible stripe color — `rgba(37, 99, 235, 0.04)` (primary tint) or a `--color-neutral-100` token addition.
8. Add `isLoading?: boolean` prop with skeleton row pattern.

---

## Cross-Component Issues

### Font family: RESOLVED
`--font-family` is declared on `:root` and applied to `body, button, input, select, textarea`. All three organisms now render in Inter. This was the highest-impact single fix. The UA selector coverage is correct — it catches both the nav buttons in Sidebar/BottomNav and the table/pagination elements in DataTable. One minor note: the selector does not cover `th` and `td` directly (those inherit from `body`, which is correct in practice, but explicit declaration would be safer across potential CSS reset edge cases).

### Hover/focus transitions: UNRESOLVED
No organism has received a `transition` property on any interactive element. All state changes (active, hover, focus) remain instant. Keyboard focus remains invisible across all three components. This is the highest remaining priority — it spans all three organisms and has both UX and WCAG 2.4.7 compliance implications.

### Icon system: UNRESOLVED
Neither `NavLink` (Sidebar) nor `Tab` (BottomNav) types have acquired an `icon` field. No icon component has been introduced. The Sidebar's collapsed state and the BottomNav remain functionally degraded for the icon-driven navigation patterns they are designed to support. This is still a system-level gap requiring a coordinated type change, an icon component, and CSS adjustments across both organisms.

---

## Updated Top 3 Priority Fixes (cross-component)

1. **Add hover and focus-visible states to all interactive elements** — This is now the highest-priority remaining issue across all three organisms. It touches every interactive element: `.link` and toggle in Sidebar, `.tab` buttons in BottomNav, `.pageButton` in DataTable. A single shared CSS utility or token-level `--focus-ring` definition (e.g., `2px solid var(--color-primary)`) would allow consistent treatment in one pass. Without this, the components fail WCAG 2.4.7 (keyboard focus visibility) and provide no hover affordance.

2. **Add `icon` field to `NavLink` and `Tab`, render icons in Sidebar and BottomNav** — The Sidebar collapsed state (64px wide, labels hidden, no icon) is still a functional dead end. The BottomNav without icons forces users to read five labels instead of recognizing five glyphs — negating the bottom navigation pattern entirely. This is the largest UX-correctness gap remaining.

3. **Add empty state to DataTable and `overflow-x: auto` wrapper** — When `rows.length === 0`, inspectors see a blank `<tbody>`. This is a dead-end UX for a filtered view with no results. The table also has no overflow protection on narrow viewports. These are two lines of JSX and one CSS rule — high impact, low effort.
