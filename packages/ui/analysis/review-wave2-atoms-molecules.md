# Wave 2 Review: Atoms + Molecules
**Date:** 2026-06-17

---

## Atoms Findings

### Button

**Missing interactive states:**
- No `:hover` on any variant. Fix:
  ```css
  .button:hover:not(:disabled) { filter: brightness(0.88); }
  ```
- No `:focus-visible`. WCAG 2.4.7 failure. Fix:
  ```css
  .button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  ```
- No `:active` press feedback. Fix:
  ```css
  .button:active:not(:disabled) { filter: brightness(0.78); transform: translateY(1px); }
  ```
- No `transition`. State changes snap. Fix:
  ```css
  .button { transition: filter 150ms ease, opacity 150ms ease, transform 100ms ease; }
  ```

**Spinner is broken (static C-shape):**
`.spinner` has `border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%` but zero `animation` or `@keyframes`. Fix:
```css
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 600ms linear infinite; }
```

**Touch target too small:**
Button `md` computes to ~36px tall (8px + 16px line-height + 8px padding + 2px border ≈ 34–36px). `sizeSm` is ~24px. Both below WCAG 2.5.5 (44px). Fix:
```css
.button { min-height: 44px; }
.sizeSm { min-height: 36px; } /* acceptable for desktop-only contexts */
```

**Visual hierarchy — OK:**
Primary blue on white, weight 600 — clear. Secondary `#F8FAFC` bg with `#CBD5E1` border reads correctly as secondary.

---

### Input

**No focus state — WCAG 2.4.7 failure (highest severity):**
`.field` has zero `:focus` or `:focus-visible` rules. Focused input is visually identical to resting. Fix:
```css
.field:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
  border-color: var(--color-primary);
}
```

**No disabled state:**
A disabled input looks identical to an active one. Fix:
```css
.field:disabled {
  background: var(--color-neutral-50);
  color: var(--color-neutral-300);
  cursor: not-allowed;
  opacity: 0.7;
}
```
Also: `disabled` prop is not in `InputProps` — add it and pass `disabled={props.disabled}` on `<input>` and `<select>`.

**Error message has no visual weight differentiation:**
`.error` is `font-size: 12px; color: var(--color-error)` — same weight as `.label`. The error reads as a sibling note, not an alert. Fix:
```css
.error { font-weight: 600; }
```

**Uncontrolled placeholder color:**
No `::placeholder` rule — browser renders grey at arbitrary contrast. Fix:
```css
.field::placeholder { color: var(--color-neutral-300); }
```

**Label-to-field gap is 4px:**
`.wrapper` gap is `var(--space-xs)` = 4px. At 12px label + 4px gap + 16px field, the label visually merges with the field top border. Fix:
```css
.wrapper { gap: var(--space-sm); } /* 8px */
```

**Select has no custom chevron:**
`<select>` uses system default arrow. Inconsistent with the 8px border-radius rounded field aesthetic. Fix (CSS-only):
```css
select.field {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23CBD5E1' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-md) center;
  padding-right: var(--space-2xl);
}
```

---

### Badge

**Vertical padding is 2px — cramped on mobile:**
`.badge { padding: 2px var(--space-sm) }` gives 16px total height at 12px font. In a list of inspection items on a phone this is too tight to distinguish from inline text. Fix:
```css
.badge { padding: 4px var(--space-sm); }
```

**Hardcoded hex backgrounds (`cfg.bg` from Badge.logic.ts):**
Background colors (`#DCFCE7`, `#DBEAFE`, etc.) are hardcoded strings bypassing the token system. No dark-mode override is possible. Fix: add to `web.css`:
```css
:root {
  --color-success-bg: #DCFCE7;
  --color-warning-bg: #FEF3C7;
  --color-error-bg:   #FEE2E2;
  --color-info-bg:    #DBEAFE;
  --color-neutral-bg: #F1F5F9;
}
```
Then replace hardcoded strings in `Badge.logic.ts` with `var(--color-success-bg)` etc.

**Dead CSS rule:**
`.icon { font-size: var(--font-small-size) }` is a no-op — Lucide SVGs use `width`/`height` from the `size` prop, not `font-size`. Remove it.

**Missing live-region role:**
When inspection status changes dynamically (e.g., a background sync updates `variant`), screen readers get no announcement. Fix:
```tsx
<span role="status" aria-live="polite" ... >
```
Note: only add `role="status"` if the badge is expected to update dynamically in the app; otherwise omit.

---

### ProgressBar

**No `aria-label` — WCAG 4.1.2 failure:**
`role="progressbar"` with only `aria-valuenow={pct}` announces "67" with no context. In an inspection screen with multiple progress bars (fotos, itens, danos) this is meaningless. Fix — add prop and pass it:
```tsx
// ProgressBar.logic.ts
export interface ProgressBarProps { value: number; ariaLabel?: string; }

// ProgressBar.web.tsx
<div
  className={styles.track}
  role="progressbar"
  aria-label={ariaLabel}
  aria-valuenow={pct}
  aria-valuemin={0}
  aria-valuemax={100}
>
```

**No `transition` on background-color change:**
`resolveProgress` changes fill color at value thresholds. The `.fill` rule already has `transition: width 200ms ease` but no `transition` on `background-color`. Crossing a threshold (49%→51%) causes an instant color snap from amber to blue. Fix:
```css
.fill { transition: width 200ms ease, background-color 300ms ease; }
```

**Odd border-radius at low values:**
`border-radius: 9999px` on `.fill` rounds the left cap, which is clipped flush by `overflow: hidden` on `.track`. At 5–15% fill this looks like a flat-left, round-right shape that mismatches the pill-track aesthetic. Fix:
```css
.fill { border-radius: 0 9999px 9999px 0; }
```
At 100%, the left corners inside the overflow-hidden container are invisible anyway.

**No size variants:**
Dashboards need a compact track (4px) and an emphasis track (12px). Fix — add `data-size` on the track:
```css
.track[data-size="sm"] { height: 4px; }
.track[data-size="lg"] { height: 12px; }
```
Add `size?: 'sm' | 'md' | 'lg'` to `ProgressBarProps`.

---

### IconButton

**No hover state — ghost variant is invisible:**
`background: transparent` + no hover = looks like a decorative icon. Fix:
```css
.button:hover:not(:disabled) { background: var(--color-neutral-300); }
.button[data-ghost="true"]:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
```

**No `:focus-visible` — WCAG 2.4.7 failure:**
Icon buttons are high-frequency keyboard targets (camera capture, search, row actions). Fix:
```css
.button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

**No transition:**
```css
.button { transition: background 150ms ease; }
```

**Touch target 36×36px — below WCAG 2.5.5 minimum (44px):**
```css
.button { min-width: 44px; min-height: 44px; }
```
If the 36px visual size is intentional, use padding trick:
```css
.button { width: 36px; height: 36px; padding: 4px; box-sizing: content-box; }
/* results in 44×44px clickable area, 36px visual */
```

**Non-ghost variant is invisible on white:**
`background: var(--color-neutral-50)` (#F8FAFC) on white (#FFFFFF) = ~1.06:1. No border. The button boundary is invisible. Fix:
```css
.button:not([data-ghost="true"]) { border: 1px solid var(--color-neutral-300); }
```

**No `disabled` prop or styling:**
Add `disabled?: boolean` to `IconButtonProps`, pass `disabled={props.disabled}` on `<button>`, and:
```css
.button:disabled { opacity: 0.4; cursor: not-allowed; }
```

**Dead `font-size` rule:**
`.button { font-size: var(--font-body-size) }` has no effect on Lucide SVG icons. Remove it.

---

## Molecules Findings

### VehicleCard

**No hover/focus-visible state on pressable variant:**
A `<button>` that renders as a card with `cursor: pointer` but zero visual feedback on hover feels broken. This is the primary interaction in a vehicle list view. Fix:
```css
.pressable:hover {
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.10);
  border-color: var(--color-primary);
}
.pressable:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.pressable { transition: box-shadow 150ms ease, border-color 150ms ease; }
```

**Fixed `width: 280px` — anti-pattern in a component library:**
This forces all consumers to override the width for any grid layout. Fix:
```css
.card { width: 100%; min-width: 240px; }
```

**No `letter-spacing` on plate:**
License plates use tracked letterforms. "ABC1D23" at 24px/600 without tracking is visually ambiguous (1 vs I, 0 vs O). Fix:
```css
.plate { letter-spacing: 0.08em; font-variant-numeric: tabular-nums; }
```

**Image placeholder has no visual cue:**
Empty `.image` div (when `imageUrl` is absent) renders as a flat `#F8FAFC` rectangle — no camera icon, no "sem foto" label. Field inspectors uploading photos need to know this is a photo slot. Fix: add a `<div>` with a centered Lucide `<ImageOff>` icon inside the `role="img"` fallback branch.

**Internal gaps are uniform:**
All internal rows use `gap: var(--space-sm)` (8px) — plate+badge, model, meta, progress bar all equally spaced. The hierarchy collapses visually. Fix:
```css
/* Override the blanket gap with targeted margins */
.model { margin-top: 0; }         /* stays 8px from header */
.meta  { margin-top: var(--space-xs); } /* 4px from model — tight grouping */
/* or convert to grid with explicit row gaps */
```
Better: switch `.card` to `display: grid; grid-template-rows: auto auto auto auto auto;` and use `row-gap` per section.

**Fixed image height:**
`height: 140px` with `object-fit: cover` crops wildly on portrait photos. Fix:
```css
.image { aspect-ratio: 16/9; height: auto; }
```

---

### StatCard

**WCAG AA failure — change indicator contrast (unresolved from pre-audit):**
`style={{ color: change.color }}` renders `#22C55E` at 12px/600 on white (#FFFFFF). Computed contrast: ~2.5:1. WCAG AA requires 4.5:1 for text under 18px (or under 14px bold). This is a confirmed compliance defect. Fix — change the success/error colors in `StatCard.logic.ts`:
```ts
// StatCard.logic.ts
const CHANGE_COLORS = {
  up:   '#166534',  // was #22C55E — now 7.6:1 on white, passes AAA
  down: '#B91C1C',  // was #EF4444 — now 5.9:1 on white, passes AA
};
```
Also move inline color to CSS variable for maintainability:
```tsx
<span className={styles.change} style={{ '--change-color': change.color } as React.CSSProperties}>
```
```css
.change { color: var(--change-color); }
```

**`gap: var(--space-xs)` (4px) — value and label merge visually:**
40px value sits 4px above 12px label — they form a single visual blob. Fix:
```css
/* Replace uniform gap with stacked layout */
.card { display: flex; flex-direction: column; }
.value { margin-bottom: var(--space-xs); }   /* 4px to label */
.label { margin-bottom: var(--space-sm); }   /* 8px to change indicator */
```

**No `font-variant-numeric: tabular-nums` on `.value`:**
Numeric KPI values ("1,234" → "999") cause layout shift without tabular figures. Fix:
```css
.value { font-variant-numeric: tabular-nums; }
```

**CSS is one-liner format — hard to diff and extend:**
Rewrite to multi-line. This is a maintainability issue, not a visual one, but it blocks every future CSS audit.

---

### ChecklistItem

**Touch target ~33px — below 44px WCAG 2.5.5:**
`.item` has `padding: var(--space-sm) 0` = 8px top/bottom. At 16px label + 12px sublabel + 2×8px padding = ~44px when both lines exist, but ~32px for items with label only. Fix:
```css
.item { min-height: 44px; align-items: center; }
```

**Unicode glyphs (`✓`, `○`, `⚠`) — cross-platform rendering risk:**
These render inconsistently across Windows/Android/iOS. On some Android fonts `✓` renders heavier, `⚠` may be colored emoji. Fix: replace with Lucide icons in the component:
```tsx
import { CheckCircle2, Circle, AlertTriangle, XCircle } from "lucide-react";

const CHECKLIST_ICONS = {
  done:    <CheckCircle2 size={20} aria-hidden="true" />,
  pending: <Circle       size={20} aria-hidden="true" />,
  issue:   <AlertTriangle size={20} aria-hidden="true" />,
  // etc.
};
```
This also aligns with Badge and IconButton which already use Lucide.

**`.text` has no `gap` — label and sublabel butt together:**
```css
.text { gap: var(--space-xs); } /* 4px */
```

**No `flex-shrink: 0` on `.icon`:**
In long-label items the icon can be squeezed by the flex container. Fix:
```css
.icon { flex-shrink: 0; }
```

**Last item still has bottom border:**
No `.item:last-child { border-bottom: none }` rule. Every checklist renders with a dangling bottom line. Fix:
```css
.item:last-child { border-bottom: none; }
```

---

### UploadArea

**WCAG 2.1 SC 2.1.1 violation — keyboard inaccessibility (unresolved from pre-audit):**
`role="button"` + `tabIndex={0}` with no `onKeyDown`. Pressing Enter or Space does nothing. This is the highest-severity defect in this component. Fix — add to `UploadArea.web.tsx`:
```tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    inputRef.current?.click();
  }
}}
```

**Hardcoded hex in drag state:**
`background: #DBEAFE` in `.area[data-state="dragging"]` bypasses the token system. Fix — add token to `web.css`:
```css
:root { --color-primary-tint: #DBEAFE; }
```
Then in `UploadArea.module.css`:
```css
.area[data-state="dragging"] { background: var(--color-primary-tint); }
```

**No visual differentiation between `uploading` / `success` / `error` states beyond border color:**
`uploading`: zero CSS rules — renders identically to `idle`. `success`: only `border-color: var(--color-success)` — no text update, no icon. `error`: changes border and text color but no icon. Fix:

For `uploading`, add a spinner and label change in TSX:
```tsx
{state === 'uploading' && <span className={styles.spinner} aria-label="Enviando..." />}
{state !== 'uploading' && <span>Arraste a imagem ou clique para selecionar</span>}
```
Add `.spinner` animation (same `@keyframes spin` as Button).

For `success`, add a checkmark icon and "Enviado com sucesso" message via state-driven content.

**Instruction text has no typographic weight:**
`<span>Arraste a imagem...</span>` inherits 16px/400 — reads as body text, not a call-to-action. Fix:
```css
/* Add a dedicated class in UploadArea.module.css */
.instruction { font-size: var(--font-body-size); font-weight: 600; color: var(--color-dark); }
.hint        { font-size: var(--font-small-size); color: var(--color-neutral-600); }
```
Replace `<span>` → `<span className={styles.instruction}>` and `<small>` → `<span className={styles.hint}>`.

**No upload icon above the instruction:**
An empty dashed box with only text is less scannable than one with an icon. Add a `<Upload>` Lucide icon (size 32) above the instruction span.

---

### OcrResult

**WCAG AA failure — "Validado" pill contrast (unresolved from pre-audit):**
`.pill` has `background: #DCFCE7; color: var(--color-success)` where `--color-success` is `#22C55E`. Green text on green-tinted background = ~2.3:1. Fails WCAG AA at 12px/600. Fix — flip to white text on solid green:
```css
.pill {
  background: var(--color-success);  /* #22C55E */
  color: #FFFFFF;                    /* 4.6:1 — passes AA */
}
```
Or darken text: `color: #166534` on `#DCFCE7` background = ~6.5:1, passes AAA.

**Row padding is 8px (`var(--space-sm)`) — content touches border:**
24px value + 8px padding = the plate value almost grazes the top border. Fix:
```css
.row { padding: var(--space-md); } /* 16px */
```

**No `flex-shrink: 0` on `.thumb` and `.pill`:**
In a narrow container (e.g., a 320px phone viewport with a modal), the thumbnail and pill can shrink. Fix:
```css
.thumb { flex-shrink: 0; }
.pill  { flex-shrink: 0; }
```

**`.value` at 24px is oversized for its 8px-padded row:**
24px bold text in a 56px-tall row (56px thumb height) with 8px padding on top/bottom reads as disproportionately large. Fix: reduce to 20px or use a `--font-h3-small-size: 20px` token (or hardcode `font-size: 20px` pragmatically).

**CSS one-liner format:**
Same maintainability issue as StatCard. Rewrite to multi-line for diffability.

**Unicode `✓` in pill:**
`<span aria-hidden="true">✓ </span>` has the same cross-platform rendering risk as ChecklistItem. Replace with a Lucide `<Check size={12} />`.

---

### Modal

**No entrance animation:**
Modal snaps in with no transition. On a mobile device this is disorienting — the overlay and dialog appear on the same frame. Fix:
```css
@keyframes dialogIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.dialog { animation: dialogIn 160ms cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
.overlay { animation: overlayIn 160ms ease; }
```

**No backdrop click-to-close:**
`.overlay` has no `onClick`. Clicking outside the dialog does nothing. Fix:
```tsx
<div className={styles.overlay} onClick={props.onCancel}>
  <div
    className={styles.dialog}
    onClick={(e) => e.stopPropagation()}
    ...
  >
```

**No Escape key handler:**
Users expect Esc to close modals. Fix — add to `Modal.web.tsx`:
```tsx
import { useEffect } from "react";

useEffect(() => {
  if (!props.open) return;
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') props.onCancel?.();
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [props.open, props.onCancel]);
```

**No focus trap:**
When the modal opens, focus stays on the element that triggered it. Tab cycles through the entire page behind the overlay. For an inspection tool used on tablets in the field, this is a workflow breaker. Fix: add `autoFocus` to the primary action button as a minimal solution:
```tsx
<Button label={confirm} variant={...} onPress={props.onConfirm} autoFocus />
```
For a complete focus trap, use the `useFocusTrap` pattern or a library like `focus-trap-react`.

**Warning modal uses `variant="success"` on confirm button:**
A green "Confirmar" button on a yellow-warning dialog communicates safety when the action may be destructive (e.g., "Cancelar vistoria?"). Fix:
```tsx
variant={variant === "warning" ? "danger" : "primary"}
```

**`.body` has `padding: var(--space-lg)` but no horizontal padding on header/actions:**
The body content is inset 24px horizontally, but the title and action buttons sit at the dialog's outer padding (also 24px — `.dialog { padding: var(--space-lg) }`). This is actually consistent — the issue is that when no `children` is passed, the dialog header and actions have no vertical breathing room between them. The `gap: var(--space-md)` on `.dialog` is `16px` — acceptable, but add `padding-bottom: var(--space-sm)` to `.header` to give it a natural separation from the body/actions.

---

## Top 5 Highest-Impact Changes

| # | Component | Change | Effort | Why it matters |
|---|-----------|--------|--------|----------------|
| 1 | **Button + Input + IconButton** | Add `:hover:not(:disabled)`, `:focus-visible`, and `transition` to all three interactive atoms in a single CSS pass | S | The library has zero interaction feedback. Every button and input looks inert. This is the single most visible quality gap — the difference between a prototype and a shipped product. Three CSS files, ~15 lines total. |
| 2 | **Button** | Fix broken spinner: add `@keyframes spin` + `animation: spin 600ms linear infinite` to `.spinner` | XS | A static C-shape where a loading indicator should be is a reliability signal to users — it looks like a freeze or bug. `aria-busy="true"` is already set; the visual just needs to match. |
| 3 | **Modal** | Add Escape key handler, backdrop click-to-close, entrance animation, and `autoFocus` on primary button | S | Modals are the highest-stakes interaction in an inspection workflow (confirm, cancel, overwrite). A modal with no Escape, no backdrop close, and no animation feels trapped and unpolished. These four changes share one `useEffect` and ~10 CSS lines. |
| 4 | **StatCard + OcrResult** | Fix WCAG AA contrast failures: `#22C55E` change indicator → `#166534`; OcrResult pill → white text on `var(--color-success)` | XS | Two confirmed compliance defects. Field workers use these in direct sunlight on budget Android devices — 2.5:1 contrast fails at the worst possible time. Each fix is a single color value change. |
| 5 | **UploadArea** | Add `onKeyDown` for Enter/Space, `<Upload>` icon, state-specific content for uploading/success/error | M | The keyboard inaccessibility is a WCAG violation. Beyond compliance, the absence of state-specific content means a user who drags a file sees only a border color change — no confirmation, no progress, no success state. Photo upload is the core field action of a vehicle inspection tool. |
