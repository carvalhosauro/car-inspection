# Post-Audit: Molecules — UI/UX Review
**Date:** 2026-06-17
**Phase:** After improvements

---

## Delta

| Metric | Pre-Audit | Post-Audit | Change |
|---|---|---|---|
| Overall score | 5.5/10 | 6.2/10 | +0.7 |
| Font declared | No | Yes (Inter) | Fixed |
| New spacing tokens | 5 stops | 7 stops (+2xl, +3xl) | Expanded |
| VehicleCard padding | `--space-sm` gap only | `--space-lg` padding added | Improved |
| StatCard padding | None beyond gap | `--space-lg` padding | Improved |
| Modal body padding | None extra | `--space-lg` on body | Improved |
| WCAG failures | 2 confirmed | 2 still present | Not addressed |
| Keyboard a11y bug (UploadArea) | Present | Still present | Not addressed |
| Hardcoded hex values | 2 | 2 | Not addressed |
| Hover/focus states (VehicleCard) | Absent | Still absent | Not addressed |
| CSS one-liner format (StatCard, OcrResult) | 2 files | 2 files | Not addressed |

**Summary of what improved:** The single highest-impact change landed — Inter font is now declared system-wide via `--font-family`, with correct fallback stack and a global `font-family` reset on `body, button, input, select, textarea`. This alone eliminates the "browser default / Times New Roman" degradation that made every component look undesigned. Two new spacing tokens (`--space-2xl`, `--space-3xl`) fill the upper end of the scale. VehicleCard and StatCard received increased padding (`--space-lg`) that gives both cards more visual air. The gains are real but narrow — the structural defects (WCAG failures, keyboard bug, hardcoded hex, missing interaction states) remain entirely untouched.

---

## Overall Score: 6.2/10

The library has crossed the threshold from "prototype" to "designed" primarily because of the font declaration. Inter is a conservative but safe and professional choice — it is not the most distinctive option available, but it is correct and renders consistently across all platforms. The padding increases on VehicleCard and StatCard are a visible improvement. However, the two WCAG AA contrast failures are unresolved accessibility defects that in a production vehicle inspection tool represent a compliance risk. The keyboard inaccessibility of UploadArea is a WCAG 2.1 SC 2.1.1 violation. The hardcoded hex values in UploadArea and OcrResult remain design-system violations. The library is better but not yet production-grade.

---

## Component Reviews

### VehicleCard — 6/10 (was 5/10, +1)

**What changed:** `padding: var(--space-lg)` (24px) was added to `.card`. Font family now renders as Inter due to the global reset.

**Visual appeal:** The increased padding is meaningful — content no longer touches the border. Inter renders cleanly at all the type sizes used here (24px plate, 16px model, 12px meta). The card looks more intentionally designed than before. Still no visual personality beyond "clean white card."

**Spacing & rhythm:** `padding: var(--space-lg)` helps the outer boundary. The internal `gap: var(--space-sm)` (8px) between all rows is still uniform — the plate/badge header, model, meta, and progress bar all sit 8px apart with no visual grouping. This is an improvement in overall size but not in internal rhythm. The plate at 24px still sits only 8px above the 16px model string — still a collision at close reading.

**Typography:** Inter at 24px/600 for the plate is excellent. No `letter-spacing` applied to the plate — real license plates use monospaced or tracked letterforms. The absence of `letter-spacing: 0.08em` on `.plate` is a visible missed opportunity. No `aspect-ratio` on the image container — still a fixed 140px height.

**Color & contrast:** No changes. All token-compliant. Passes AA throughout.

**Layout:** `width: 280px` is still hardcoded. This is still an anti-pattern for a component library — the consumer cannot place this in a 3-column grid without overriding the fixed width. `width: 100%` with `min-width: 240px` would be the correct fix.

**UX feel:** No hover state added to `.pressable`. The card can be clicked (it renders as a `<button>`) but gives zero visual feedback on hover or focus. `cursor: pointer` is set but no `background` shift, no `box-shadow` lift, no `border-color` change on `:hover` or `:focus-visible`. For an inspector scanning a list of vehicles, this feels unresponsive.

**Remaining improvements needed:**
- Replace `width: 280px` with `width: 100%; min-width: 240px`
- Add hover/focus-visible state to `.pressable`: `box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-color: var(--color-primary)`
- Add `letter-spacing: 0.08em` to `.plate`
- Change `height: 140px` to `aspect-ratio: 16/9; height: auto` on `.image`
- Add a camera/image placeholder icon inside the empty `.image` div
- Differentiate internal gaps: 8px between plate→model, 12px before meta, 16px before progress bar

---

### StatCard — 5.5/10 (was 5/10, +0.5)

**What changed:** `padding: var(--space-lg)` is now inside the one-liner `.card` declaration. Font family renders as Inter.

**Visual appeal:** Inter at 40px/700 for the value is striking and correct. The padding increase makes the card feel less like a data cell and more like a KPI tile. The improvement is modest because the underlying structural issues are unchanged.

**Spacing & rhythm:** `gap: var(--space-xs)` (4px) throughout is still far too tight. A 40px value sits 4px above a 12px label — they visually merge. This is the most pressing spacing issue in the component. The padding increase helps the card's outer feel but not the internal hierarchy.

**Typography:** Inter with `font-variant-numeric: tabular-nums` was NOT added to `.value`. This means numeric values (e.g., changing from "1,234" to "999") will cause layout shift. The one-liner CSS format still makes this difficult to maintain and audit.

**Color & contrast:** The WCAG AA failure is unresolved. The change indicator uses `style={{ color: change.color }}` which pulls `#22C55E` (green) on white background. At 12px/600, this is approximately 2.5:1 — **still failing WCAG AA** (requires 4.5:1 for normal text under 18px non-bold, or 3:1 for 14px+ bold — 12px bold requires 4.5:1). This is a real compliance defect carried forward unchanged.

**Layout:** CSS is still one-liner format — hard to read, diff, and extend. No icon slot exists.

**Remaining improvements needed:**
- Fix WCAG failure: change indicator color must reach 4.5:1 on white; darken success to `#166534`, error to `#B91C1C`
- Add `font-variant-numeric: tabular-nums` to `.value`
- Rewrite CSS to multi-line format
- Implement non-uniform gap: 6px value→label, 10px label→change
- Move change color from inline JS to CSS custom property: `style={{ '--change-color': change.color }}` + `.change { color: var(--change-color); }` in CSS
- Add optional icon slot

---

### ChecklistItem — 6/10 (was 6/10, +0)

**What changed:** Font family renders as Inter. No structural changes were made to this component.

**Visual appeal:** Inter improves rendering quality at 16px/12px. The component is unchanged otherwise — it was already the strongest molecule and the font improvement is visible but incremental.

**Spacing & rhythm:** Still `padding: var(--space-sm) 0` (8px vertical, no horizontal). Touch target is approximately 33px tall — below the WCAG 2.5.5 recommended 44px minimum. No changes. The `.text` container still has no `gap`, so label and sublabel butt directly together.

**Typography:** Inter renders well here. No gap between `.label` and `.sublabel` — still missing `gap: var(--space-xs)` (4px) in `.text`.

**Color & contrast:** Unchanged. Icon colors are token-driven (success/warning/error). Still using bare Unicode glyphs (`✓`, `○`, `⚠`) which render inconsistently across platforms.

**Layout:** Still missing `flex-shrink: 0` on `.icon`. Still no `:last-child` rule to remove the final border. Still no `min-height: 44px` for touch target compliance.

**Remaining improvements needed (same as pre-audit, all unaddressed):**
- Add `min-height: 44px; align-items: center` to `.item`
- Add `flex-shrink: 0` to `.icon`
- Add `gap: var(--space-xs)` to `.text`
- Replace bare Unicode glyphs with background-circle pattern for dual color+shape encoding
- Add `.item:last-child { border-bottom: none }`

---

### UploadArea — 6/10 (was 6/10, +0)

**What changed:** Font family renders as Inter. No structural changes were made.

**Visual appeal:** Inter renders cleanly. The component is otherwise identical to pre-audit. The `<span>` instruction and `<small>` hint still have identical visual weight — no size or weight differentiation applied.

**Spacing & rhythm:** `padding: var(--space-xl)` (32px) was already the correct value pre-audit and remains correct. No change here.

**Typography:** The instruction `<span>` still has no `font-size` or `font-weight` applied. It inherits 16px/400 — identical to the default body. The `<small>` tag provides a minor size reduction in some browsers but not via the design system's token. Both lines still compete visually.

**Color & contrast:** `background: #DBEAFE` on the dragging state is still a hardcoded hex — a design-system violation unchanged from pre-audit.

**Accessibility — WCAG 2.1 SC 2.1.1 violation still present:** The `onKeyDown` handler is still absent. The component has `tabIndex={0}` and `role="button"` but pressing Enter or Space does nothing for keyboard users. This is unchanged and unaddressed.

**UX feel:** No state-specific content was added. The `uploading` state still has zero CSS rules. `success` state still only changes the border color with no confirmation text or icon.

**Remaining improvements needed (all from pre-audit, unaddressed):**
- Add `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}` — highest priority, WCAG violation
- Replace `background: #DBEAFE` with `--color-primary-tint` token
- Add distinct visual content per state (uploading spinner, success checkmark + text, error icon + message)
- Add `font-size: var(--font-body-size); font-weight: 600` to instruction `<span>`
- Add `font-size: var(--font-small-size)` explicitly to `<small>`
- Add an upload/image icon above the instruction
- Add `.area[data-state="uploading"]` CSS rule

---

### OcrResult — 5.5/10 (was 5.5/10, +0)

**What changed:** Font family renders as Inter. No structural changes were made.

**Visual appeal:** Inter at 24px/600 for the extracted value renders sharply and looks professional. The font improvement is the only visible change.

**Spacing & rhythm:** `padding: var(--space-sm)` (8px) on the row is still the original cramped value. Content still optically touches the border. The pre-audit recommendation of `var(--space-md)` (16px) was not applied.

**Typography:** The value at 24px/600 inside an 8px-padded row still creates an oversized feeling. "ABC-1234" at 24px leaves very little breathing room against the border. Pre-audit recommendation to reduce to 20px was not applied.

**Color & contrast:** WCAG AA failure is unresolved. The `.pill` uses `background: #DCFCE7` (hardcoded hex, still present) with `color: var(--color-success)` (`#22C55E`). Green on green-tinted background: approximately 2.3:1 at 12px — **still failing WCAG AA**. This is the same defect as pre-audit, carried forward unchanged.

**Layout:** Still one-liner CSS. Still no `flex-shrink: 0` on `.thumb` or `.pill`.

**Remaining improvements needed (all from pre-audit, unaddressed):**
- Fix WCAG failure: pill text must reach 4.5:1; use `background: var(--color-success); color: white` or darken text to `#166534`
- Replace `background: #DCFCE7` with `--color-success-tint` token
- Increase row padding to `var(--space-md)` (16px)
- Add `flex-shrink: 0` to `.thumb` and `.pill`
- Reduce `.value` from 24px to 20px (`var(--font-h3-size)` → manual `20px` or new token)
- Rewrite CSS to multi-line format

---

### Modal — 6.5/10 (was 6.5/10, +0)

**What changed:** `padding: var(--space-lg)` was added to `.body`. Font family renders as Inter. Score holds — the body padding is a minor improvement within an already-adequate component, offset by no progress on the UX defects.

**Visual appeal:** Inter at 24px/600 for the title renders well. The body padding increase (`.body { padding: var(--space-lg) }`) adds internal breathing room when body content is present. The improvement is real but marginal.

**Spacing & rhythm:** `.dialog` now has `gap: var(--space-md)` between sections and `.body` has `padding: var(--space-lg)` — the dialog interior reads better. The action button gap is still `var(--space-sm)` (8px), still tight for mobile tap targets.

**Typography:** No concerns with Inter applied. Title/body hierarchy is clear.

**Color & contrast:** Warning icon (`color-warning: #F59E0B`) is `aria-hidden="true"` — decorative only, not a WCAG failure technically.

**UX feel — all pre-audit defects remain:**
- No entrance animation. The modal still snaps in with no transition.
- No backdrop click-to-close. Clicking the overlay does not call `onCancel`.
- No Escape key handler. `useEffect` + `keydown` listener is absent.
- Semantic mismatch unchanged: warning modal's confirm button uses `variant="success"` — a green "Confirmar" button on a warning/destructive dialog. This communicates safety when the action may be destructive.
- No close `×` button in the dialog header.
- No `autoFocus` or focus trap when the modal opens.

**Remaining improvements needed:**
- Add `@keyframes dialogIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }` and `animation: dialogIn 150ms ease-out` on `.dialog`
- Add `onClick={props.onCancel}` to `.overlay` and `e.stopPropagation()` on `.dialog`
- Add `useEffect` + `keydown` listener for Escape → `onCancel` in `Modal.web.tsx`
- Change confirm button variant from `"success"` to `"danger"` on warning modals
- Increase action gap to `var(--space-md)` (16px)
- Add `autoFocus` to the primary action button

---

## Cross-Component Issues

### Token Compliance
| Location | Issue | Status |
|---|---|---|
| `UploadArea.module.css` | `background: #DBEAFE` — hardcoded hex | Still present |
| `OcrResult.module.css` | `background: #DCFCE7` — hardcoded hex | Still present |
| `StatCard.web.tsx` | `style={{ color: change.color }}` — inline JS bypasses CSS | Still present |
| `web.css` | `--color-primary-tint` missing | Still missing |
| `web.css` | `--color-success-tint` missing | Still missing |
| `web.css` | `--space-xs` to `--space-sm` gap (no 12px step) | Still missing |

### WCAG Failures
| Component | Element | Issue | Status |
|---|---|---|---|
| `StatCard` | Change indicator (12px) | `#22C55E` on white ≈ 2.5:1 — fails AA | **Unresolved** |
| `OcrResult` | "Validado" pill (12px) | `#22C55E` on `#DCFCE7` ≈ 2.3:1 — fails AA | **Unresolved** |
| `UploadArea` | Keyboard interaction | `role="button"` + `tabIndex={0}` without `onKeyDown` | **Unresolved** |

### CSS Maintainability
| File | Issue | Status |
|---|---|---|
| `StatCard.module.css` | All declarations on single lines | Not addressed |
| `OcrResult.module.css` | All declarations on single lines | Not addressed |

---

## Top 3 Remaining Issues

1. **WCAG AA contrast failures on success-colored small text (StatCard + OcrResult).** Both components use `#22C55E` at 12px on light backgrounds — the same defect identified in the pre-audit, entirely unaddressed. In a vehicle inspection tool used by field workers who may be in bright sunlight or using lower-quality screens, this is not a theoretical risk. Fix: darken change indicator to `#166534`; redesign OcrResult pill to `background: var(--color-success); color: white` (passes ~4.6:1).

2. **UploadArea keyboard inaccessibility.** The `onKeyDown` handler is still missing despite the pre-audit flagging it as a WCAG 2.1 SC 2.1.1 violation. A component with `role="button"` and `tabIndex={0}` that does not respond to Enter/Space is a broken button. The fix is a three-line addition to `UploadArea.web.tsx` and takes under a minute to implement. This should have been the first fix applied.

3. **Font choice: Inter is safe but not distinctive.** The font is declared (a genuine improvement) but Inter was specifically called out in the pre-audit as one of the generic fonts to avoid ("not Arial, Inter, Roboto, system fonts, Space Grotesk"). The pre-audit explicitly suggested `'DM Sans'` as an alternative — free, professional, highly legible, and not ubiquitous in developer-built UIs. Switching from Inter to DM Sans (or another alternative such as `'Plus Jakarta Sans'` or `'Outfit'`) would add the typographic personality the library currently lacks, at zero additional cost beyond a single token change.
