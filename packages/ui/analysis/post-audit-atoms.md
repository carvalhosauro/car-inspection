# Post-Audit: Atoms — UI/UX Review
**Date:** 2026-06-17
**Phase:** After improvements

---

## Delta

| Metric | Pre-Audit | Post-Audit | Change |
|--------|-----------|------------|--------|
| Overall Score | 5.4/10 | 6.4/10 | **+1.0** |
| Button | 6/10 | 6.5/10 | +0.5 |
| Input | 5/10 | 5.5/10 | +0.5 |
| Badge | 5/10 | 7.5/10 | +2.5 |
| ProgressBar | 5/10 | 6/10 | +1.0 |
| IconButton | 4/10 | 6.5/10 | +2.5 |

**What improved:**
- Icon system is now coherent. Lucide React across Badge and IconButton eliminates the cross-OS glyph inconsistency. This was the highest-visibility problem in the pre-audit and it is resolved.
- Typography is no longer browser-default. Inter via Google Fonts + `--font-family` token applied to `body, button, input, select, textarea` means all five atoms render in the same typeface. The serif/sans mismatch is gone.
- Spacing tokens are extended. `--space-2xl` and `--space-3xl` complete the scale and unblock future layout work.
- ProgressBar collapse in Storybook is fixed. `min-width: 200px` on `.track` is the correct floor; the Storybook `padded` layout removes the zero-width container issue.
- Lucide icons in Badge are semantically appropriate: `CheckCircle2`, `Clock3`, `AlertCircle`, `XCircle`, `CalendarClock` map cleanly to their inspection states. The pre-audit's `◷` Windows rendering risk is eliminated.

**What did not improve (still open from pre-audit):**
- No hover, focus-visible, or transition states on any interactive element (Button, Input, IconButton). This was Priority 1 in the pre-audit and remains untouched.
- Spinner animation still missing — the `.spinner` class has no `@keyframes` and no `animation` property.
- Touch target sizes below WCAG 2.5.5 (Button md, sizeSm, IconButton all under 44px).
- Badge vertical padding still 2px — cramped on mobile.
- Input disabled state, focus-visible ring, and label-to-field gap are unchanged.

---

## Overall Score: 6.4/10

The library has moved from "skeleton awaiting design intent" to "functional with a visible identity gap." The icon unification and font token are high-leverage wins. The remaining gap is entirely in interaction layer: zero states between resting and disabled means the UI feels inert, not interactive.

---

## Component Reviews

### Button — 6.5/10

**What improved:**
- Font now renders in Inter (via global `body, button` rule in `web.css`). Pre-audit called this out as the most visually jarring issue for the overall library — resolved.
- The logic and variant structure are unchanged in a good way: still clean, still well-typed.

**Still missing:**
- No `:hover` state on any variant. `filter: brightness(0.9)` or a darker background token would cost two lines.
- No `:focus-visible` outline. WCAG 2.4.7 failure remains.
- Spinner (`.spinner`) has `border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%` — exactly as pre-audit. No `@keyframes spin`, no `animation` declaration. It renders as a static C-shape, not a spinner.
- No `transition` on the button or its disabled state. The 0.5 opacity snap on disable is still abrupt.
- `min-height` absent: Button md is ~36px tall (8+16+8+2px border), sizeSm is ~24px. Both below 44px WCAG touch target.
- No `font-family` declaration on `.button` itself — relies entirely on the `body, button` global rule in `web.css`. This is acceptable if `web.css` is always imported, but fragile if components are used in isolation.

**Improvements still needed:**
- Add to `.button`: `transition: filter 150ms ease, opacity 150ms ease;`
- Add `:hover:not(:disabled) { filter: brightness(0.88); }` to `.button`
- Add `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }` to `.button`
- Add `@keyframes spin { to { transform: rotate(360deg); } }` and `animation: spin 600ms linear infinite` to `.spinner`
- Set `min-height: 44px` on `.button`, `min-height: 36px` on `.sizeSm`

---

### Input — 5.5/10

**What improved:**
- Font is now Inter via global rule.
- The gap between label and field is `var(--space-xs)` = 4px. The pre-audit noted this was tight. It is still 4px — not improved, but the Inter rendering at 12px makes the label feel slightly less compressed than it did in the browser's fallback sans-serif.

**Still missing:**
- No `:focus-visible` or `:focus` on `.field`. Focus state is invisible — the border does not change color on focus, there is no outline. WCAG 2.4.7 failure.
- No disabled state styling. A disabled input is visually identical to an active one.
- No `font-weight` on `.error` — error message reads as passive as the label at the same 12px/neutral weight.
- Placeholder color is uncontrolled — still browser default.
- Select element has no custom chevron.
- `name` and `disabled` props are not in `InputProps`.

**Improvements still needed:**
- Add `.field:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 1px; border-color: var(--color-primary); }` — this is the single highest-impact Input fix
- Add `.field:disabled { background: var(--color-neutral-50); color: var(--color-neutral-300); cursor: not-allowed; opacity: 0.7; }`
- Change `.error` to `font-weight: 500` to differentiate from label
- Increase wrapper gap to `var(--space-sm)` (8px) for better label-to-field breathing room
- Add `::placeholder { color: var(--color-neutral-300); }` for consistent placeholder tone

---

### Badge — 7.5/10

**What improved (biggest delta: +2.5):**
- Icon system is completely replaced. Lucide React icons render at consistent `size={14}` across all OS. The `◷` Windows box-render risk is eliminated. `CheckCircle2`, `Clock3`, `AlertCircle`, `XCircle`, `CalendarClock` each communicate their state with appropriate semantic weight — this is a major credibility gain for the inspection domain.
- The `BadgeIcon` type in `Badge.logic.ts` is properly typed as a string union keyed to the `BADGE_ICONS` record in `Badge.web.tsx` — the indirection is clean and extensible.
- `Icon` receives `aria-hidden="true"` — screen readers skip the decorative icon and read only the text label.
- `size={14}` on `<Icon>` creates correct visual hierarchy: icon is subordinate to the text label without being invisible.

**Still missing:**
- Vertical padding is still `2px var(--space-sm)`. The pre-audit recommended `4px var(--space-sm)`. On a 12px font, 2px top/bottom gives a 16px total height — cramped, especially on mobile and in dense inspection lists.
- Background colors (`#DCFCE7`, `#DBEAFE`, etc.) remain hardcoded strings in `Badge.logic.ts`. A future dark-mode token swap cannot reach these values. The pre-audit flagged this; still unresolved.
- No `role="status"` or `aria-label` on the outer `<span>`. Screen readers will announce the visible text (which is correct), but `role="status"` would make the badge a live region — useful when inspection status changes dynamically.
- The `icon` CSS class applies `font-size: var(--font-small-size)` — this is a no-op for SVG icons (Lucide uses `width`/`height` via the `size` prop). The rule is harmless but dead weight.

**Improvements still needed:**
- Change `padding: 2px var(--space-sm)` to `padding: 4px var(--space-sm)` in `.badge`
- Move `bg` values to CSS custom properties: add `--color-success-bg`, `--color-warning-bg`, etc. to `web.css`; reference them from `Badge.logic.ts`
- Add `role="status"` to the outer `<span>` for live-region support during dynamic status updates
- Remove the dead `.icon { font-size }` rule; replace with `display: flex` alignment if needed

---

### ProgressBar — 6/10

**What improved:**
- `min-width: 200px` on `.track` directly fixes the Storybook collapse and the narrow-column collapse in real app contexts. This was the most actionable single-line fix in the pre-audit.
- Storybook `padded` layout fix means the component is now actually visible during development — a prerequisite for any further visual iteration.

**Still missing:**
- No `aria-label` or `aria-labelledby` on the track element. The `role="progressbar"` with only numeric `aria-valuenow` gives screen readers no context about what is progressing. WCAG 4.1.2 failure.
- No `transition: background-color` on `.fill`. A value crossing a threshold (e.g., 49% → 51%) causes an instant color snap from warning amber to primary blue — jarring in animated updates.
- Fill `border-radius: 9999px` creates a rounded left cap that looks odd at low values (5–15%) inside the `overflow: hidden` track — the right pill curves away from the track edge but the left side is clipped flush.
- No size variant (sm/lg). Inspection dashboards need both compact (4px) and prominent (12px) variants.
- No `showLabel` prop for percentage text.
- `resolveProgress` derives semantic color correctly but the color change has no animation companion in CSS.

**Improvements still needed:**
- Add `aria-label` prop to `ProgressBarProps` and pass it on the track div — this is a WCAG blocker
- Add `transition: background-color 300ms ease` to `.fill`
- Fix fill border-radius: `border-radius: 0 9999px 9999px 0` for partial fills, `9999px` only at 100%
- Add size variant: `sm` (4px), `md` (8px, current), `lg` (12px) via a `data-size` attribute on `.track`

---

### IconButton — 6.5/10

**What improved (biggest delta alongside Badge: +2.5):**
- The mixed emoji/unicode/text glyph system is fully replaced with Lucide React. `Camera`, `Search`, `Plus`, `Pencil`, `Trash2`, `ArrowRight` all render at `size={20}`, consistent weight, consistent optical size. The pre-audit called this the "critical problem" — it is resolved.
- `ICON_COMPONENTS` record is properly typed against `IconName` — extensible without type drift.
- `Icon` receives `aria-hidden="true"` with `aria-label` on the button itself — correct screen reader pattern for icon-only buttons.
- `size={20}` is appropriate for a 36px container: 20px icon with 8px padding on each side is a standard icon button proportion.

**Still missing:**
- No `:hover` state. A Lucide icon floating in a `var(--color-neutral-50)` square with zero hover feedback is still visually inert. Ghost variant (`background: transparent`) is completely indistinguishable from a static decorative element.
- No `:focus-visible` outline. Icon buttons are high-frequency keyboard targets (camera capture, search trigger, row actions in inspection lists) — this is a critical accessibility gap.
- No `transition` on background. State changes (hover, active) will snap.
- Fixed `width: 36px; height: 36px` — still below 44px WCAG 2.5.5 touch target minimum.
- Non-ghost variant has `background: var(--color-neutral-50)` (#F8FAFC) on white (#FFFFFF): ~1.1:1 contrast. The button boundary is invisible without a border. Pre-audit flagged this; still unresolved.
- No `disabled` prop or styling.
- `font-size: var(--font-body-size)` in `.button` is now a dead rule — Lucide uses `size` prop, not font-size. Harmless but misleading.

**Improvements still needed:**
- Add `:hover:not(:disabled) { background: var(--color-neutral-300); }` to `.button`
- Add `:hover[data-ghost="true"]:not(:disabled) { background: color-mix(in srgb, var(--color-primary) 8%, transparent); }` — ghost hover must be distinguishable
- Add `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }` to `.button`
- Add `transition: background 150ms ease` to `.button`
- Change to `min-width: 44px; min-height: 44px` (use 40px default for visual, 44px min for touch)
- Add `border: 1px solid var(--color-neutral-300)` to non-ghost variant to make the button boundary visible
- Add `disabled` prop to `IconButtonProps` and `opacity: 0.4; cursor: not-allowed` on `:disabled`
- Remove dead `font-size` rule from `.button`

---

## Top 3 Priority Fixes (cross-component, post-improvement)

### 1. Interactive states remain completely absent (Button, Input, IconButton)

This was Priority 1 in the pre-audit. It is still Priority 1 post-improvement. No `:hover`, no `:focus-visible`, no `:active`, no `transition` on any interactive element. The improvements applied were additive (new tokens, new icons, new font) but did not touch the interaction layer. The library still fails WCAG 2.4.7 (Focus Visible). A single CSS pass across three files fixes this:

```css
/* Button.module.css additions */
.button { transition: filter 150ms ease, opacity 150ms ease; }
.button:hover:not(:disabled) { filter: brightness(0.88); }
.button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

/* Input.module.css addition */
.field:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 1px; border-color: var(--color-primary); }

/* IconButton.module.css additions */
.button { transition: background 150ms ease; }
.button:hover:not(:disabled) { background: var(--color-neutral-300); }
.button[data-ghost="true"]:hover:not(:disabled) { background: color-mix(in srgb, var(--color-primary) 8%, transparent); }
.button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

### 2. Spinner animation is broken (Button)

The `.spinner` class renders a static incomplete circle. `aria-busy="true"` is set on loading buttons — assistive technology announces the loading state — but visually nothing moves. This is a credibility problem: a "loading" button that does not animate signals either a bug or a frozen UI to the user. Fix: add `@keyframes spin { to { transform: rotate(360deg); } }` and `animation: spin 600ms linear infinite` to `.spinner` in `Button.module.css`.

### 3. ProgressBar lacks an aria-label prop (WCAG blocker)

`role="progressbar"` with only `aria-valuenow={pct}` gives screen readers "progressbar 67" with no context. In an inspection workflow with multiple progress bars (photos uploaded, items inspected, damages documented), this is meaningless. Fix: add `ariaLabel?: string` to `ProgressBarProps`, pass `aria-label={ariaLabel}` on the track div, and add it as required in Storybook stories with values like "Fotos enviadas" and "Itens inspecionados".

---

## Remaining Improvement Suggestions (lower priority)

- **Badge:** Increase vertical padding from `2px` to `4px`. Move hardcoded background hex values to CSS custom properties for dark-mode readiness.
- **Input:** Add `font-weight: 500` to `.error`, increase wrapper gap to 8px, add `::placeholder` color rule, expose `disabled` and `name` props.
- **ProgressBar:** Fix fill `border-radius` at partial fills (odd left cap at low values), add `transition: background-color` to `.fill`, add `size` variant prop.
- **IconButton:** Add a visible border to non-ghost variant; `#F8FAFC` on `#FFFFFF` is ~1.1:1 and the button is invisible without it. Bump size to minimum 44×44px.
- **Tokens:** Consider adding `--color-success-bg`, `--color-warning-bg`, `--color-error-bg`, `--color-primary-bg` to `web.css` so Badge (and future semantic components) stop hardcoding hex backgrounds inline.
- **Font:** Inter is listed — confirm Google Fonts `<link>` is present in the Storybook `preview-head.html` or equivalent. If not, Inter falls back to `-apple-system` which looks identical on macOS but differs on Windows/Linux. Consider self-hosting via `fontsource` package for offline/test reliability.
