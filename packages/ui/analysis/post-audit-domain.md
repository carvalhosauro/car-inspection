# Post-Audit: Domain Components — UI/UX Review
**Date:** 2026-06-17
**Phase:** After improvements

---

## Delta (Pre → Post)

| Component     | Pre  | Post | Change |
|---------------|------|------|--------|
| GeoTag        | 4.0  | 5.5  | +1.5   |
| UniqueCode    | 5.5  | 6.5  | +1.0   |
| AiPhotoResult | 4.0  | 5.0  | +1.0   |
| **Overall**   | **4.5** | **5.7** | **+1.2** |

**What improved:**
- `MapPin` from lucide-react replaces the 📍 emoji in GeoTag — icon colour is now CSS-controlled, cross-platform rendering is consistent, and it accepts a `size` prop cleanly.
- UniqueCode padding upgraded from `var(--space-sm) var(--space-md)` (8/16px) to `var(--space-md) var(--space-lg)` (16/24px) — the wrapper now breathes and feels like a distinct card unit rather than a tight badge.
- AiPhotoResult swaps `✓`/`✕` Unicode for `CheckCircle2`/`XCircle` Lucide icons — geometry is consistent, strokes are CSS-coloured, and the icon is visually coherent with any custom icon set the project may adopt.
- `--font-family: 'Inter', …` is now a global token applied to `body, button, input, select, textarea` — browser-default Arial/Times fallback is eliminated across all components simultaneously.
- Two new spacing tokens (`--space-2xl: 48px`, `--space-3xl: 64px`) expand the rhythm vocabulary for future use.

**What did not improve (carried forward from pre-audit):**
- GeoTag still has no `pending` or `error` state — boolean `validated` prop unchanged.
- UniqueCode copy button still has no visual treatment (transparent, no padding, 12px).
- AiPhotoResult still renders identical border and background for both verdicts.
- No animation or transition anywhere across all three components.
- No error handling for clipboard write failure in UniqueCode.

---

## Overall Score: 5.7/10

The improvements are real and correct in direction. The SVG icon migrations remove the two most egregious platform-inconsistency risks, and the Inter font token gives the library a coherent typographic foundation it lacked. However, the changes address surface-level polish rather than the structural UX deficiencies identified in the pre-audit. The three highest-priority issues from the original report — verdict-differentiated backgrounds in AiPhotoResult, the three-state GeoTag, and a functional copy button — are untouched. The components remain scaffolding with better icons rather than finished, field-tested interfaces.

---

## Component Reviews

### GeoTag — 5.5/10

**What it does:** Displays a city/state location string with an optional "validated" label. Used on mobile by field inspectors who need confidence that their GPS lock is good before proceeding.

**Visual appeal: 5/10**
The `MapPin` icon from lucide-react is a meaningful upgrade over the emoji — it is pixel-sharp, CSS-coloured at `var(--color-primary)`, and sized precisely at 16px. The tag remains a bare inline-flex strip with no container, background, or border. On a white screen it reads acceptably; on any tinted or photographic background it still disappears. The improvement is visible in a dev environment but insufficient in the field.

**Domain clarity: 4/10**
No change from pre-audit. The boolean `validated` prop still collapses `false` and `undefined` to the same visual state. The most common real-world condition — GPS fix in progress — has no representation whatsoever. An inspector on weak signal sees a bare location string and cannot tell whether the device is still acquiring coordinates or has already failed. This remains the most consequential gap in the component.

**Spacing & rhythm: 5/10**
Unchanged. `gap: var(--space-sm)` (8px) between pin, text, and label is tight but acceptable. The tag has no padding and no minimum touch target — cannot be reliably tapped on mobile as a unit. `inline-flex` still collapses to content width.

**Typography: 6/10**
Global Inter token is now applied via `body, button, input, select, textarea`. The `.tag` span and `.location` span inherit it correctly through the DOM cascade, so GeoTag now renders in Inter rather than the browser default. This is the most visually impactful change for this component. The city/state string still renders at uniform weight — "São Paulo, SP" has no differentiation between city (prominent) and state abbreviation (secondary). Letter spacing on the location text would also help legibility on small mobile screens.

**Icon/visual quality: 7/10**
The switch to `MapPin` from lucide-react is well-executed. The icon is `aria-hidden="true"`, sized at 16px, and coloured via CSS. It aligns cleanly with the 16px body text baseline. No error or pending icon exists, but the icon that does exist is now production-quality.

**Feedback UX: 3/10**
Unchanged. Two render-time states only (validated / not). No animation between states. No tooltip. No loading indicator. The validated label appears or not — there is no motion to signal a state change if GPS acquires while the component is mounted.

**Remaining improvements:**
- Replace boolean `validated` with `status: 'pending' | 'acquired' | 'error'` prop. Render `Clock` (warning colour) for pending, `MapPin` (success colour) for acquired, `MapPinOff` (error colour) for error.
- Add a container with `background: var(--color-neutral-50)`, `border-radius: 8px`, `padding: var(--space-xs) var(--space-sm)`, and `min-height: 44px` so the tag is a tappable badge.
- Differentiate city and state typographic weight: city `font-weight: 600`, state `font-weight: 400` with `color: var(--color-neutral-600)`.
- Add `transition: color 200ms ease` between state changes.

---

### UniqueCode — 6.5/10

**What it does:** Displays the VST-XXXXXX inspection code with a copy-to-clipboard button. Inspectors share this code with back-office operators — legibility and copy confirmation are critical.

**Visual appeal: 6/10**
The wrapper padding upgrade from `8px 16px` to `16px 24px` is the right call — the code and button now sit in a properly breathable container. The dashed primary border reads clearly as a "data to copy" affordance. The background remains transparent (`--color-neutral-50` fill not applied), so the dashed border can visually dissolve depending on parent background. The copy button is still invisible: no background, no border, no padding, effectively indistinguishable from a plain text label.

**Domain clarity: 7/10**
Unchanged and strong. Monospace font, large 24px code, "Copiar"/"Copiado!" toggle — the intent is legible. The `isValidCode` function in logic.ts still goes unused in the component — an invalid code (wrong format, truncated) renders identically to a valid one, which is a quiet trust erosion risk in production.

**Spacing & rhythm: 6/10**
The padding increase is felt. Gap between code and button at `var(--space-sm)` (8px) is workable at this larger size. The button itself has zero padding — its touch target is the text bounding box of the word "Copiar" at 12px, which is approximately 12×44px at best on a standard display. That fails WCAG 2.5.5 (minimum 44×44px) and will cause mis-taps in field conditions.

**Typography: 6/10**
Inter is now applied globally. The `font-family: monospace` on `.code` correctly overrides Inter for the code string — this is the right behaviour, as monospace signals machine-readable data. The button and "Copiado!" label now render in Inter rather than browser default. The browser-default monospace stack (Courier New on Windows, Menlo on macOS) is still in use — a named stack (`'JetBrains Mono', 'Fira Code', monospace`) would look intentional and is a one-line change.

**Icon/visual quality: 4/10**
Unchanged. The copy button has no icon — just the word "Copiar". No clipboard icon, no checkmark on "Copiado!". The lucide-react package is already a dependency (used in GeoTag and AiPhotoResult) so adding `Copy` and `Check` icons is zero cost.

**Feedback UX: 6/10**
The 1500ms timer and "Copiado!" text are good. The `aria-label="Copiar código"` is correct. Still missing: (1) no CSS transition between button and success states — the swap is abrupt; (2) no error handling — `navigator.clipboard.writeText` can reject silently in HTTP contexts or when permission is denied; (3) no visual animation on the transition.

**Remaining improvements:**
- Add visual treatment to the copy button: `background: var(--color-primary)`, `color: var(--color-neutral-white)`, `border-radius: 6px`, `padding: var(--space-xs) var(--space-sm)`, `min-height: 44px`. Or a ghost variant with `border: 1px solid var(--color-primary)`.
- Add `Copy` icon before "Copiar" and `Check` icon before "Copiado!" using lucide-react.
- Add `transition: opacity 150ms ease` with conditional `opacity: 0` on the leaving element — CSS-only smooth swap.
- Add `background: var(--color-neutral-50)` fill to wrapper so dashed border is always visible.
- Wrap clipboard write in try/catch; render "Falha ao copiar" in `color: var(--color-error)` on rejection.
- Upgrade `font-family: monospace` to `font-family: 'JetBrains Mono', 'Fira Code', monospace`.
- Call `isValidCode(code)` at render; add a subtle `color: var(--color-error)` border tint and warning icon when format is invalid.

---

### AiPhotoResult — 5.0/10

**What it does:** Displays the AI verdict on an inspection photo — approved or rejected — plus an optional rejection reason. The highest-stakes UI moment in the app: the inspector must immediately understand whether to retake a photo.

**Visual appeal: 5/10**
The Lucide icon upgrade (`CheckCircle2`/`XCircle`) is the strongest visual improvement across all three components. Compared to the Unicode glyphs, these icons have consistent stroke weight, predictable bounding box, and clean rendering at all pixel densities. The `style={{ color: cfg.color }}` inline colour wiring is functional. However, the box itself still renders identically for both verdicts: same `border: 1px solid var(--color-neutral-300)`, same transparent background, same layout. An approved result and a rejected result look like the same card with a different icon colour. For a safety-critical workflow step, this remains a critical deficiency.

**Domain clarity: 4/10**
Unchanged. Text labels are clear ("Foto aprovada pela IA" / "Foto recusada pela IA"). Visual hierarchy is insufficient — the verdict message at 16px body weight is the same size as a standard paragraph. Nothing in the composition signals urgency on rejection. The reason text is correctly smaller and muted. When `verdict === "recusada"` and no `reason` prop is supplied, the component renders a blank card with only a header — no fallback text, leaving the inspector with a silent failure-mode card.

**Spacing & rhythm: 6/10**
The padding was updated to `var(--space-lg)` (24px), which is a genuine improvement. The `gap: var(--space-xs)` (4px) between header and reason is still too tight — the reason line still reads as glued to the verdict message. `var(--space-sm)` (8px) minimum is needed. The component has no minimum height, so a verdict-only card looks incomplete at 24px padding on both sides.

**Typography: 5/10**
Inter is now applied globally, so the verdict message and reason text render in Inter. The verdict message at `font-size: var(--font-body-size)` (16px) `font-weight: 600` is still insufficiently dominant — it reads the same visual weight as body copy across the app. For the highest-stakes decision point in the inspector workflow, the verdict message should be `var(--font-h3-size)` (24px). The reason at `var(--font-small-size)` (12px) is correct.

**Icon/visual quality: 7/10**
The switch from `✓`/`✕` Unicode to `CheckCircle2`/`XCircle` Lucide icons is well-implemented. The icon size is 24px, `aria-hidden="true"`, and colour is wired via inline style from `AI_CONFIG`. Remaining gap: the icon has no visual container (circle badge background) — at 24px in a white card, it does not pop in peripheral vision. A 40×40px circular badge with 10% opacity background tint behind the icon would dramatically increase immediate recognisability.

**Feedback UX: 3/10**
Unchanged. No loading/skeleton state, no `loading` prop for async AI responses. No fallback for missing `reason` on rejection. No entry animation — the component renders statically when the AI result arrives, wasting the reveal moment. No exit/replace animation.

**Remaining improvements:**
- Differentiate box by verdict — this is the single highest-priority change in the library:
  - `aprovada`: `background: #F0FDF4; border-color: var(--color-success);`
  - `recusada`: `background: #FEF2F2; border-color: var(--color-error);`
  - Use `data-verdict` attribute already present on the element to drive CSS: `.box[data-verdict="aprovada"] { … }`.
- Add 4px left accent bar via `border-left: 4px solid <verdict-color>` — common and effective urgency signal.
- Increase icon to 32px and wrap in circular badge: `width: 40px; height: 40px; border-radius: 50%; background: currentColor; opacity: 0.1` behind the icon.
- Increase verdict message to `var(--font-h3-size)` (24px).
- Change `gap` from `var(--space-xs)` to `var(--space-sm)` between header and reason.
- Add reason fallback: when `verdict === "recusada"` and `reason` is absent, render `<em>Nenhum detalhe disponível.</em>`.
- Add `loading` prop: render a shimmer skeleton in place of icon and message.
- Add `animation: fadeIn 200ms ease-out` on mount to signal the async AI result arriving.

---

## Top 3 Priority Fixes (carried forward, unchanged urgency)

1. **AiPhotoResult: verdict-differentiated backgrounds and border colours (critical UX, safety impact)**
   Still the highest-leverage change in the entire library. The `data-verdict` attribute is already on the DOM element — adding two CSS rule blocks is the entire implementation. Approved vs. rejected must be distinguishable at a glance. This was priority 1 in the pre-audit and remains priority 1 post-audit.

2. **GeoTag: three-state `status` prop and pending/error states**
   The emoji-to-SVG migration was completed (the prerequisite called out in the pre-audit). The next step is now unblocked: replace `validated?: boolean` with `status: 'pending' | 'acquired' | 'error'` and add `Clock`/`MapPinOff` icons from lucide-react with warning/error token colours.

3. **UniqueCode: copy button interactive treatment, icon, and error handling**
   The padding increase made the wrapper look more finished, which makes the buttonless "Copiar" text look more out of place, not less. The contrast between the polished dashed-border container and the invisible button is now more jarring than before the improvement. Adding background, padding, a `Copy` icon, and try/catch error handling is ~10 lines of CSS and ~5 lines of TypeScript.
