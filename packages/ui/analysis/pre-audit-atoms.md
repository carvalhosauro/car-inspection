# Pre-Audit: Atoms — UI/UX Review
**Date:** 2026-06-17
**Phase:** Before improvements

## Overall Score: 5.4/10

The foundation is structurally sound — tokens are well-chosen, logic is cleanly separated, accessibility attributes are present. What's missing is visual personality, interaction feedback, and polish. The library currently looks like a skeleton awaiting design intent rather than a finished product ready for vehicle inspection workflows.

---

## Component Reviews

### Button — 6/10

**Strengths:**
- Correct use of `inline-flex` with centered alignment and gap for spinner
- Semantic `disabled` attribute + `aria-busy` on loading state
- Four meaningful variants covering the inspection domain (primary, secondary, success, danger)
- Size system (md/sm) is appropriate and token-driven

**Weaknesses:**
- No hover or focus-visible states defined anywhere in the CSS. Clicking a button produces zero visual feedback — the element is completely static between pointer-down and pointer-up
- The spinner is declared with `border` but has no `animation` property. It is a static ring, not a spinner
- No `transition` on background or opacity changes, so disabled state snaps instantly
- `font-family` inherits browser default serif, which is visually jarring against the clean token palette
- Padding `var(--space-sm) var(--space-lg)` = 8px 24px is adequate but the md size lacks a minimum `min-height` (44px for mobile touch targets per WCAG 2.5.5)
- The `sizeSm` variant at 12px font and 4px/16px padding produces a 24px tall button — below the 44px touch target guideline
- No `lg` size variant despite `--space-xl` existing in tokens
- `outline: none` is absent but also not present — focus ring depends entirely on browser default (which Chrome clips due to `border-radius: 8px` on some versions)

**Improvements needed:**
- Add `:hover` background darkening (e.g. `filter: brightness(0.9)`) for all variants
- Add `:focus-visible` outline using `--color-primary` with 2px offset
- Add `@keyframes spin` and apply `animation: spin 600ms linear infinite` to `.spinner`
- Add `transition: opacity 150ms ease, filter 150ms ease` to `.button`
- Set `min-height: 44px` on `.button` and `min-height: 36px` on `.sizeSm`
- Declare `font-family` once on `.button` (will be resolved when global font token is added)

---

### Input — 5/10

**Strengths:**
- Label + field + error message in a single `<label>` wrapper is semantically correct
- `aria-invalid` on error state
- Unified handler covers both `<input>` and `<select>` cleanly
- `data-state` attribute enables CSS-driven state styling without JS class toggling

**Weaknesses:**
- No `:focus` or `:focus-visible` styles on `.field`. Focus is invisible except for browser default outline, which is removed by many CSS resets
- No `disabled` state styling — an input can be visually indistinguishable from an active one when disabled
- `gap: var(--space-xs)` = 4px between label and field is too tight; the label feels glued to the border
- Label at `var(--font-small-size)` = 12px with `color: var(--color-neutral-600)` (#334155 on white) gives a contrast ratio of approximately 7:1 — passes AA, but at 12px it is at the boundary of WCAG AAA requirement for small text (4.5:1 required, 7:1 recommended)
- No `placeholder` color token — browser default gray placeholder may clash
- The `select` element does not receive a custom chevron/arrow — browser-native dropdowns vary drastically across OS
- Error message and label share the same `font-size: 12px` but have no `font-weight` differentiation — error feels as passive as the label
- Missing `autocomplete` attribute considerations (no `name` prop exposed) — important for vehicle plate/VIN fields in inspection context
- No `readOnly` state in the prop interface or CSS

**Improvements needed:**
- Add `.field:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-color: var(--color-primary); }`
- Increase `gap` to `var(--space-xs)` → `6px` or add a dedicated `--space-xxs` token; consider `gap: var(--space-sm)` (8px)
- Add `.field:disabled { background: var(--color-neutral-50); color: var(--color-neutral-300); cursor: not-allowed; }`
- Add `font-weight: 500` to `.error` to differentiate it from the label
- Replace `gap: var(--space-xs)` in `.wrapper` with `gap: 6px` for label-to-field, and add `margin-top: var(--space-xs)` above `.error`
- Expose `name` and `disabled` props in `InputProps`

---

### Badge — 5/10

**Strengths:**
- Pill shape (`border-radius: 9999px`) is the correct convention for status badges
- Domain-appropriate variants: concluído, em-andamento, pendente, reprovado, agendado — these map precisely to vehicle inspection states
- Colors use inline styles from the token `colors` object, so changing tokens propagates automatically
- `font-weight: 600` gives the label enough presence at 12px

**Weaknesses:**
- Unicode glyphs as status icons are the most significant visual weakness: `✓` `✕` `!` `•` `◷` render inconsistently across OS (especially `◷` on Windows) and at 12px they are barely legible
- The `•` (bullet) for "em-andamento" (in-progress) is semantically weak — a spinner, pulse dot, or directional arrow would better communicate ongoing activity
- `!` for "pendente" could be confused with an error/warning state — the warning icon is already used for `pendente` color (#F59E0B) but the badge for `reprovado` (error) uses `✕`. The `!` collides conceptually with danger/error
- `padding: 2px var(--space-sm)` = 2px 8px is very tight vertically; the badge feels cramped, especially on mobile
- No `aria-label` or `role` on the badge — a screen reader will read the unicode glyph character name (e.g. "CHECK MARK") before the label text, which sounds odd
- Background colors (`#DCFCE7`, `#DBEAFE`, etc.) are hardcoded strings in logic rather than CSS variables — they will not respond to a future dark-mode token swap
- The `icon` span has `font-size: var(--font-small-size)` which matches the label — no size hierarchy between icon and text

**Improvements needed:**
- Replace Unicode glyphs with SVG icons or a minimal icon font (Lucide, Phosphor) — at minimum, use more semantically clear Unicode: `●` for in-progress with a CSS animation pulse, `⚠` for pendente, `✗` for reprovado
- Increase vertical padding to `4px var(--space-sm)` for breathing room
- Add `role="status"` and `aria-label={cfg.label}` to the outer `<span>` so screen readers announce only the human-readable label
- Move background colors to CSS custom properties or token entries (e.g. `--color-success-bg: #DCFCE7`) so dark mode is achievable
- Give `icon` a `line-height: 1` and explicit size slightly larger than label text to create micro-hierarchy

---

### ProgressBar — 5/10

**Strengths:**
- Correct ARIA: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `transition: width 200ms ease` on fill provides smooth value changes
- `resolveProgress` clamps values and derives semantic color automatically — good logic/view separation
- Pill shape on both track and fill is visually cohesive

**Weaknesses:**
- Known Storybook collapse issue: `width: 100%` on `.track` with no `min-width` means the bar is invisible in flex containers with no intrinsic width. In real app contexts (card sidebars, narrow columns), this will also collapse
- No `aria-label` or `aria-labelledby` — required for meaningful screen reader announcements (WCAG 4.1.2). "progressbar" role alone is insufficient without a label
- Color transitions abruptly when crossing thresholds (warning → primary → success) with no animation — a value jumping from 49% to 51% causes an instant color swap
- Track height of 8px is reasonable but there is no size variant (e.g. `sm` at 4px for compact lists, `lg` at 12px for prominent onboarding flows)
- No percentage label option — inspection workflows typically want to show "67% completed" as text alongside the bar
- `border-radius: 9999px` on `.fill` creates a rounded left cap inside the track, which looks odd at low values (e.g., 5%) because the fill's left border-radius is clipped by the track's overflow:hidden but the right border-radius creates a visual pill shape starting partway through the track
- The `200ms ease` transition is adequate but a `cubic-bezier` with slight overshoot would feel more alive

**Improvements needed:**
- Add `min-width: 80px` to `.track` to prevent collapse in constrained layouts
- Add `aria-label` prop to `ProgressBarProps` and pass it as `aria-label` on the track div
- Add `transition: background-color 300ms ease` to `.fill` so color changes animate alongside width
- Add a size variant prop (`sm | md | lg`) mapping to heights 4px / 8px / 12px
- Fix fill border-radius: use `border-radius: 0 9999px 9999px 0` (or `border-radius: inherit`) when `pct < 100`, and `border-radius: 9999px` only at 100%
- Expose optional `showLabel?: boolean` prop that renders `<span>{pct}%</span>` beside the track

---

### IconButton — 4/10

**Strengths:**
- `aria-label` is required in the props interface — correct approach for icon-only buttons
- `ghost` variant boolean is a clean API
- Fixed 36×36px dimensions give consistent tap targets in lists

**Weaknesses:**
- Mixed icon system is the critical problem: camera (`📷`), search (`🔍`), trash (`🗑`) are emoji while plus (`+`), edit (`✎`), arrow-right (`→`) are Unicode text. Emoji render in full color at different sizes across OS; text glyphs render in the system's symbol font. At 36px container, a 16px emoji floats in the center with inconsistent sizing — there is no visual cohesion
- No `:hover` state. The button has zero interactive feedback beyond cursor change
- No `:focus-visible` outline — icon buttons are common keyboard navigation targets (e.g., camera button during inspection photo capture)
- No `disabled` prop or styling — inspection flows need to disable the camera button while a photo is uploading
- `background: var(--color-neutral-50)` (#F8FAFC) on white (#FFFFFF) gives a contrast ratio of approximately 1.1:1 for the button surface — the button boundary is essentially invisible without a border
- `font-size: var(--font-body-size)` = 16px controls icon size, but emoji and glyphs do not scale the same way — the camera emoji may render at 18px while `+` renders at exactly 16px
- Ghost variant (`background: transparent`) has no hover state whatsoever — completely indistinguishable from a static text element
- 36px height is below the 44px WCAG touch target minimum
- No `size` variant despite the parent Button having `sm | md`

**Improvements needed:**
- Standardize icon system: adopt a single SVG icon library (Lucide React is zero-dependency, tree-shakeable, and renders consistently). Remove all emoji glyphs
- Add `:hover { background: var(--color-neutral-300); }` and `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`
- Add `transition: background 150ms ease` to `.button`
- Change fixed size to `min-width: 44px; min-height: 44px` and increase default to 40px
- Add a visible border to the non-ghost variant: `border: 1px solid var(--color-neutral-300)`
- Add `disabled` prop to `IconButtonProps` and `.button:disabled { opacity: 0.4; cursor: not-allowed; }`
- For ghost hover: `:hover[data-ghost="true"] { background: color-mix(in srgb, var(--color-primary) 8%, transparent); }`

---

## Top 3 Priority Fixes (cross-component)

1. **Interactive states are completely absent (all 5 components affected)**
   Every interactive element — Button, Input, IconButton — lacks `:hover` and `:focus-visible` styles. This is the single highest-impact gap. Users receive no feedback that elements are clickable or focused. For keyboard and assistive technology users this is a WCAG 2.4.7 failure. Fix: add a shared interaction mixin or utility class with hover (brightness/color shift) and focus-visible (2px primary-colored outline with 2px offset) applied to all interactive atoms in one CSS pass.

2. **Icon system is incoherent (Badge + IconButton)**
   The mix of Unicode status glyphs, text symbols, and emoji creates visual noise that undermines the professional credibility of the inspection app. On Windows, `◷` may render as a box. Emoji scale differently than text. Fix: adopt Lucide React (or Phosphor) for IconButton icons, and replace Badge unicode glyphs with a consistent small SVG set. This is a one-time migration with compounding visual returns across every screen.

3. **No font-family declared anywhere**
   All components inherit the browser's default serif/sans, which means the same component looks like Times New Roman on one system and Helvetica on another. For a product that inspects vehicles (trust-critical, professional context), typographic consistency is non-negotiable. Fix: add `--font-family-base` to `web.css` tokens (suggested: `'DM Sans', system-ui, sans-serif` — geometric, neutral, highly legible at small sizes), then apply `font-family: var(--font-family-base)` in a single `:root` rule or on `.button`, `.field`, `.badge` simultaneously.
