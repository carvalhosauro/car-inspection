# Pre-Audit: Molecules — UI/UX Review
**Date:** 2026-06-17
**Phase:** Before improvements

---

## Overall Score: 5.5/10

The library has a solid structural foundation — clean React composition, good logic/view separation, correct semantic HTML, and a consistent token set. What it lacks is visual personality. Every component looks like a first draft: functional, safe, but forgettable. The token palette is competent but under-used; hardcoded hex values leak in exactly where semantic tokens are most needed. No font family is declared anywhere, leaving the browser to render in Times New Roman or system fallback depending on OS. Animations are entirely absent. The result is a library that communicates "prototype" rather than "production vehicle inspection tool."

---

## Component Reviews

### VehicleCard — 5/10

**Visual appeal:** The card shape is correct — image-first layout, plate as the primary identifier, ProgressBar communicating completion. But at exactly 280px fixed width it refuses to be responsive, and the 8px `gap` between all rows compresses the content into a block with no visual breathing. The image placeholder (`background: neutral-50`) is invisible — an empty grey rectangle with no affordance.

**Spacing & rhythm:** `gap: var(--space-sm)` (8px) is uniform throughout the entire card. There is no distinction between tight (plate + badge) and loose (model + meta + progress) groupings. The plate (`font-h3-size: 24px`) sitting directly above a 16px model string with only 8px separation creates a visual collision rather than a hierarchy.

**Typography:** Plate at 24px/600 is appropriately dominant. Model at 16px/400 is fine. Meta (year • km) at 12px/400 is functional. The problem is the absence of font-family — on most browsers this renders as system-ui or Times New Roman, destroying the professional feel. No letter-spacing on the plate; license plates benefit from `letter-spacing: 0.1em` to match real plate rendering.

**Color & contrast:** Neutral-600 (`#334155`) on white for the meta line passes WCAG AA (approx 7:1). Color usage is token-compliant with no hardcoded hex in this file.

**Layout:** Fixed `width: 280px` is a hard anti-pattern in a component library. The card should be `width: 100%` with a max-width, allowing consumers to control grid columns. The image ratio (140px height, full width) works but is not expressed as an aspect-ratio, making it brittle on varying widths.

**UX feel:** A vehicle inspector needs to scan multiple cards quickly. The current design does not differentiate status visually at the card level — only the Badge communicates it. No hover state exists on the pressable variant (the `cursor: pointer` is there, but no background shift, shadow, or border-color change on `:hover`/`:focus-visible`).

**Improvements needed:**
- Replace `width: 280px` with `width: 100%; min-width: 240px` and let consumers set grid width
- Add `transition` + hover/focus-visible styles to `.pressable` (shadow lift, border-color → primary)
- Add `letter-spacing: 0.08em` to `.plate` to evoke real plates
- Add `aspect-ratio: 16/9` to `.image` instead of fixed height
- Add a visible icon (camera glyph or SVG) to the empty image placeholder div
- Use non-uniform gaps: group header/model with tighter 8px, separate meta and progress with 12px/16px
- Set `font-family` at library root or on `.card`

---

### StatCard — 5/10

**Visual appeal:** Three lines stacked in a box. The value at `font-h1-size` (40px) is oversized relative to the 160px min-width — a four-character value like "1.2k" fills the entire card. The Unicode arrows (`↑`/`↓`) for change direction read well enough but are thin and low-visual-weight.

**Spacing & rhythm:** `gap: var(--space-xs)` (4px) between all three rows is far too tight. A 40px value number sitting 4px above a 12px label creates an uncomfortable collision. The value and label should have more separation; the change indicator should feel like a footnote, not a second label.

**Typography:** No font-family declared. The 40px/700 value is the correct typographic choice for a KPI card but needs a tabular-figures font (or `font-variant-numeric: tabular-nums`) to prevent layout shifts as numbers change.

**Color & contrast:** Change color is applied via inline `style={{ color: change.color }}` pulling from JS `colors.*` tokens — this works but bypasses CSS cascade and makes theming harder. The label at `color: neutral-600` (#334155) on white passes AA. The success/error inline colors should be verified: `#22C55E` on white is approximately 2.5:1, **failing WCAG AA** for small text. This is a real accessibility defect.

**Layout:** `min-width: 160px` with no max-width. The CSS is one-liner format, making it difficult to read and maintain. No icon slot — dashboard stat cards almost universally pair a KPI with a contextual icon (document count, clock, car).

**UX feel:** The card communicates a number but not what domain it belongs to at a glance. Without an icon, inspectors must read the label text, which defeats the purpose of a KPI card in a dashboard scan.

**Improvements needed:**
- Fix WCAG failure: `#22C55E` success color on white for small text is ~2.5:1; darken to at least `#16A34A` for AA compliance on 12px text
- Add `font-variant-numeric: tabular-nums` to `.value` to prevent reflow on number change
- Change gap to non-uniform: value→label 6px, label→change 10px
- Add an optional `icon` prop slot with a colored icon container
- Move change color from inline JS style to CSS custom property (`--change-color`) set via `style={{ '--change-color': change.color }}` and consumed in CSS, enabling theme override
- Add `padding: var(--space-lg) var(--space-md)` for more generous vertical breathing
- Replace one-liner CSS with formatted multi-line declarations

---

### ChecklistItem — 6/10

**Visual appeal:** The cleanest molecule in the set. Row layout with icon, label, sublabel works well for a checklist pattern. The 1px bottom border creates implicit list rhythm. States are visually differentiated via icon color (green/amber/red). This is the most "done" component.

**Spacing & rhythm:** `padding: var(--space-sm) 0` (8px top/bottom, no horizontal) works in a list context but feels cramped at 8px vertical. Inspection checklists can be long; 8px padding with a 1px border at 16px body font creates rows that are ~33px tall — borderline for touch targets (WCAG 2.5.5 recommends 44px minimum). The gap between icon and text is 8px, which is tight for a 20px icon container and body text.

**Typography:** Two-level hierarchy (label + sublabel) is correct. The `.text` wrapper uses `flex-direction: column` with no gap, meaning the label and sublabel butt directly against each other. A 2–4px gap would improve legibility.

**Color & contrast:** Icon colors (success green, warning amber, error red) are token-driven — good. However, Unicode `✓` (U+2713) and `○` (U+25CB) render inconsistently across platforms. The `⚠` glyph is particularly problematic: it renders differently in Windows/macOS/Android and can appear at different sizes. No background fill behind icons means the state color is the only differentiator — a monochrome-blind user loses all state information since the icons themselves are shape-similar.

**Layout:** The icon is constrained to `20px × 20px` which clips taller Unicode glyphs on some platforms. No `flex-shrink: 0` on the icon, meaning it can be squeezed on long labels.

**UX feel:** Good. A vehicle inspector working through a checklist will understand this pattern immediately. The sublabel for adding notes or defect descriptions is well-considered. Missing: no indication that items can be tapped/changed — there is no interactive state in the component (though the logic supports states, there's no `onPress` or selection affordance).

**Improvements needed:**
- Add `min-height: 44px` and `align-items: center` to `.item` for touch target compliance
- Add `flex-shrink: 0` to `.icon`
- Add `gap: var(--space-xs)` (4px) to `.text` for label/sublabel separation
- Replace bare Unicode glyphs with a background-circle pattern: small colored circle bg + white icon, providing shape+color dual encoding for colorblind users
- Add a last-child pseudo-class to remove the bottom border on the final item: `.item:last-child { border-bottom: none }`
- Consider adding `onPress` prop and interactive states (hover, focus ring) for editable checklists

---

### UploadArea — 6/10

**Visual appeal:** The dashed border drop zone is the correct pattern and universally understood. The layout is clean. However, it is visually inert — there is no upload icon, no visual hierarchy between the primary instruction and the file-type hint, and no feedback for the `uploading` or `success` states (only `error` and `dragging` have distinct styles; `success` only changes the border color with no text or icon change).

**Spacing & rhythm:** `padding: var(--space-xl)` (32px) is generous and correct for a drop zone — this is the one component where the spacing feels right. The `gap: var(--space-sm)` (8px) between the instruction and hint text is adequate.

**Typography:** The instruction (`Arraste a imagem ou clique para selecionar`) is a raw `<span>` with no size or weight applied — it inherits body size (16px/400) and is visually identical to the `<small>` hint. The primary instruction should be at 16px/600 and the hint should be visually de-emphasized to 12px/400. Currently they compete equally.

**Color & contrast:** The dragging state uses `background: #DBEAFE` — a hardcoded hex (Tailwind blue-100) instead of a semantic token. This is a design-system violation. A `--color-primary-tint` token should be defined and used here. The idle state's `color: neutral-600` on `neutral-50` background: `#334155` on `#F8FAFC` is approximately 9:1 — passes AA. Error state `color: error` (`#EF4444`) on white: approximately 3.5:1 for normal text — **marginal for AA at body size, fails for small text.**

**Layout:** No visual state feedback beyond border/background color for uploading and success states. An inspector who drops a file sees the border turn green briefly but gets no confirmation message, spinner, or success icon. The `uploading` state has no CSS rule at all.

**UX feel:** The pattern is understood but the implementation is incomplete. An inspector uploading a vehicle photo needs clear confirmation the upload succeeded or failed, with a readable error message — not just a red border. The area also lacks keyboard feedback: `onKeyDown` is not wired to trigger the file dialog, so keyboard users are blocked despite `tabIndex={0}` (accessibility bug).

**Improvements needed:**
- Wire `onKeyDown` (Enter/Space) on the container div to call `inputRef.current?.click()` — current implementation is keyboard-inaccessible despite having `tabIndex` and `role="button"`
- Add distinct visual content per state: uploading → spinner icon + "Enviando…", success → checkmark + "Imagem carregada", error → error icon + error message text
- Replace `background: #DBEAFE` with a CSS variable (`--color-primary-tint` or `color-mix`)
- Apply `font-size: var(--font-body-size); font-weight: 600` to the instruction `<span>` and `font-size: var(--font-small-size)` to `<small>`
- Add an upload icon (cloud-arrow or image glyph) above the instruction text for scannability
- Add `.area[data-state="uploading"]` CSS rule

---

### OcrResult — 5.5/10

**Visual appeal:** The horizontal row layout (thumbnail + label/value + validated pill) is the right pattern for a compact data display. The `56×56px` thumbnail is a reasonable size. However, the row has minimal padding (`var(--space-sm)` = 8px) which makes the content feel cramped inside the border. The component "works" but makes no visual impression.

**Spacing & rhythm:** 8px padding inside a bordered row is insufficient — the content touches the border optically. `padding: var(--space-md)` (16px) would breathe much better. The gap between thumbnail and body content at `var(--space-md)` (16px) is appropriate.

**Typography:** The type label (`Placa (OCR)`, `Hodômetro (OCR)`) at 12px/400 in neutral-600 is correct as a label. The result value at 24px/600 in dark is the right visual weight for the primary data. However, 24px is large for a compact row component — a reading of `"ABC-1234"` at 24px inside an 8px-padded row feels like an overflow. The "(OCR)" suffix in both label strings is redundant given the component's context and adds visual noise.

**Color & contrast:** The success pill uses `background: #DCFCE7` (hardcoded hex, Tailwind green-100) with `color: var(--color-success)` (#22C55E). Green on green-tinted white: approximately 2.3:1 — **fails WCAG AA** for the "Validado" text. This is a real accessibility defect. Additionally, the `✓` icon inside the pill is `aria-hidden="true"` which is correct, but the visual check should be paired with the word "Validado" — the current implementation does include both, so that part is fine.

**Layout:** The one-liner CSS format makes the stylesheet hard to maintain. The pill has `border-radius: 9999px` (pill shape) — correct. No `flex-shrink: 0` on `.pill`, so on very narrow containers the pill can be compressed. The `.thumb` has no `flex-shrink: 0` either.

**UX feel:** For a vehicle inspector reviewing OCR extraction results, this component does its job: shows the capture, the extracted value, and a validation status. What's missing is a visual state for unvalidated results — currently there is simply nothing shown, leaving the user uncertain whether validation hasn't happened yet or failed.

**Improvements needed:**
- Fix WCAG failure: darken the pill text to `#166534` (green-800) or add a border to the pill; alternatively use `background: var(--color-success); color: white` (4.5:1+ passes AA)
- Replace `background: #DCFCE7` with a semantic token (`--color-success-tint`)
- Add `flex-shrink: 0` to both `.thumb` and `.pill`
- Increase padding to `var(--space-md)` (16px) on the row
- Add an explicit "unvalidated" visual indicator (e.g., a neutral pill "Aguardando" or simply omitting the pill is fine, but document the pattern)
- Consider reducing `.value` from 24px to 20px for better density in the row
- Remove the "(OCR)" suffix from label strings — it is implied by the component context and adds noise

---

### Modal — 6.5/10

**Visual appeal:** The Modal is the strongest component in the set. The overlay/dialog structure is correct, the warning variant with the Unicode `⚠` icon adds contextual differentiation, and the two-button action row is well-placed. Still, no entrance animation exists — the modal snaps in without transition, which feels abrupt and unprofessional.

**Spacing & rhythm:** `padding: var(--space-lg)` (24px) on the dialog is appropriate. `gap: var(--space-md)` (16px) between header/body/actions works. The `gap: var(--space-sm)` (8px) between action buttons is slightly tight — 12px would give the buttons more breathing room and reduce accidental mis-taps on mobile.

**Typography:** Title at 24px/600 is correct for a modal heading. Body at 16px/400 in neutral-600 is appropriate for supporting text. No concerns here beyond the universal font-family absence.

**Color & contrast:** Overlay at `rgba(15, 23, 42, 0.5)` — dark-950 at 50% — is a reasonable scrim. The warning icon color (`color-warning`: `#F59E0B`) on white: approximately 2.2:1 — **fails WCAG AA** for the icon text. However, the icon is `aria-hidden="true"`, so this is purely decorative and not technically a violation, but it reduces visual impact for low-vision users.

**Layout:** `max-width: 420px` is a sensible constraint. `width: 100%` with `padding: var(--space-md)` on the overlay handles small screens correctly. The `actions` row is `justify-content: flex-end` — consistent with modal conventions. The confirm button gets the `"success"` variant when `variant === "warning"`, which is semantically confusing: a warning modal's confirm action should use a `"danger"` or `"destructive"` variant, not `"success"`. A green "Confirmar" button on a warning dialog implies the action is safe.

**UX feel:** The component lacks a backdrop click-to-close handler — `onCancel` is only wired to the cancel button. Standard modal UX expectation is that clicking outside the dialog (on the overlay) also dismisses it. The modal also lacks a close (`×`) icon button in the top-right corner, which is a universal affordance. No `Escape` key handler.

**Improvements needed:**
- Add CSS `@keyframes` entrance animation: `opacity 0 → 1` + `translateY(8px) → 0` over 150ms ease-out on `.dialog`
- Add `onClick` to `.overlay` and `e.stopPropagation()` to `.dialog` for backdrop dismiss
- Wire `useEffect` + `keydown` listener for Escape key → `onCancel`
- Change confirm button variant from `"success"` to `"danger"` (or `"primary"`) on warning modals — green on a warning dialog is a semantic mismatch
- Add an optional close `×` button in the top-right of the header
- Increase action button gap to `var(--space-md)` for better mobile tap targets
- Add `focus-trap` or at minimum `autoFocus` on the first action button when modal opens

---

## Cross-Component Issues

### Token Compliance
| Location | Issue |
|---|---|
| `UploadArea.module.css` | `background: #DBEAFE` — should be a semantic token |
| `OcrResult.module.css` | `background: #DCFCE7` — should be a semantic token |
| `StatCard.web.tsx` | `style={{ color: change.color }}` — inline JS token bypasses CSS cascade |

The token file (`web.css`) is missing: `--color-primary-tint`, `--color-success-tint`, `--font-family`, and a mid-scale spacing value between `--space-sm` (8px) and `--space-md` (16px) (a 12px value would resolve several cramped patterns).

### WCAG Failures
| Component | Element | Issue |
|---|---|---|
| `StatCard` | Change indicator text (12px) | `#22C55E` on white ≈ 2.5:1 — fails AA |
| `OcrResult` | "Validado" pill text (12px) | `#22C55E` on `#DCFCE7` ≈ 2.3:1 — fails AA |
| Both | Small text in general | No body font declared; renders browser-default |

---

## Top 3 Priority Fixes (cross-component)

1. **Declare a font-family system-wide.** No single change will have more visual impact. Add `--font-family` to `web.css` and apply it in a global reset or on `:root`/`body`. Suggested: `'DM Sans', system-ui, sans-serif` (free, Google Fonts, highly legible, professional, not Inter). This single token lifts every component simultaneously from "browser default" to "designed."

2. **Fix the two WCAG AA failures on success-colored small text.** Both `StatCard` change indicator and `OcrResult` validated pill use `#22C55E` (success green) on light backgrounds at 12px — failing contrast ratio. Darken the text color to `#166534` or `#15803D` (green-700/800), or redesign the pill to use `background: var(--color-success); color: white` which passes at ~4.6:1. This is a legal and ethical compliance issue, not just aesthetics.

3. **Fix the UploadArea keyboard accessibility bug.** `tabIndex={0}` + `role="button"` without an `onKeyDown` handler creates a fake button that works for mouse users only. Keyboard users pressing Enter or Space receive no response. This is a WCAG 2.1 SC 2.1.1 (Keyboard) violation. Add: `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}` to the container div.
