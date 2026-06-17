# Pre-Audit: Domain Components — UI/UX Review
**Date:** 2026-06-17
**Phase:** Before improvements

---

## Overall Score: 4.5/10

The three components establish a functional baseline — they render correct data, use design tokens consistently, and have reasonable semantic HTML. However, they read as scaffolding rather than finished product. There is no font personality, no motion, no depth, no contextual colour differentiation between states, and the visual weight of interactive vs. static elements is poorly calibrated. For a field inspector working under time pressure, these gaps translate into real friction.

---

## Component Reviews

### GeoTag — 4/10

**What it does:** Displays a city/state location string with an optional "validated" label. Used on mobile by field inspectors who need confidence that their GPS lock is good before proceeding.

**Visual appeal: 4/10**
The component is a horizontal inline-flex strip with an emoji pin, plain text, and a small green label. There is no visual container — no background, no border, no shadow — so it reads as raw text rather than a status badge. The 📍 emoji is device-rendered: it will look meaningfully different on iOS, Android, and desktop Chrome, with no consistent sizing guarantee. On dark or photo backgrounds (common in a vehicle inspection context) the component becomes invisible.

**Domain clarity: 5/10**
The "Localização validada" label communicates the positive state clearly enough. However, there is **no visual representation of the pending or error state** — the logic type only exposes `validated?: boolean`, meaning `false` and `undefined` are visually identical. A field inspector cannot distinguish "GPS not yet acquired" from "component failed to receive a prop." This is the most damaging gap in the component.

**Spacing & rhythm: 5/10**
`gap: var(--space-sm)` (8px) is adequate but cramped on mobile touch targets. The tag has no padding, so it cannot be tapped reliably as a unit. The `inline-flex` display means it collapses to content width with no minimum touch area.

**Typography: 4/10**
Both the location text and the validated label use `var(--font-body-size)` / `var(--font-small-size)` from the token sheet but inherit browser-default font-family. There is no monospace or condensed feel that would signal "technical data." The location string — e.g. "São Paulo, SP" — carries zero visual weight differentiation between city and state.

**Icon/visual quality: 3/10**
📍 is an emoji with platform-specific rendering. It does not scale with CSS transforms cleanly, cannot be recoloured via `color`, and its visual axis is inconsistent across operating systems. No error or pending icon exists at all.

**Feedback UX: 3/10**
Only two states are possible at render time: validated or not. There is no loading/pending animation, no error icon, no tooltip explaining what "validated" means to a first-time inspector. The transition from unvalidated to validated (which may happen live as GPS acquires a fix) is instantaneous with no animation — a missed opportunity to communicate progress.

**Improvements needed:**
- Add a `status` prop with values `pending | acquired | error` to replace the boolean `validated`. Render distinct icons and colours per state using the existing token palette (warning for pending, success for acquired, error for error).
- Replace the 📍 emoji with an SVG icon (or a CSS-drawn pin) so colour, size, and rendering are fully controlled.
- Wrap the tag in a container with `background: var(--color-neutral-50)`, `border-radius: 8px`, and `padding: var(--space-xs) var(--space-sm)` so it reads as a badge rather than raw text and remains legible on any background.
- Add a CSS transition (`opacity`, `color`) between state changes so the inspector sees GPS acquisition progress in real time.
- Minimum touch target: ensure the container is at least 44px tall on mobile (add `min-height: 44px; align-items: center`).
- Split city and state with distinct typographic weight — city in `font-weight: 600`, state in `font-weight: 400` and a slightly muted colour — to aid fast scanning.

---

### UniqueCode — 5.5/10

**What it does:** Displays the VST-XXXXXX inspection code with a copy-to-clipboard button. This is a key workflow step — inspectors share this code with back-office operators, so legibility and copy confirmation are critical.

**Visual appeal: 5/10**
The dashed primary-colour border is the single strongest design decision in all three components — it signals "this is a code to be read and copied" at a glance. The 24px monospace code text is appropriately large. However, the button has zero visual treatment: no border, no background, no padding beyond the browser default. It looks like a hyperlink that forgot its underline. The overall container has no background fill, so the dashed border floats on whatever background the parent provides.

**Domain clarity: 7/10**
The intent is clear: big code, copy button. The "Copiado!" feedback text is correctly localised (Portuguese) and well-positioned. The monospace font for the code is the right call — it signals machine-readable data.

**Spacing & rhythm: 5/10**
`padding: var(--space-sm) var(--space-md)` (8px 16px) gives the container some breathing room, but the gap between the code and the button is only 8px. The button touch target is extremely small — no padding, just the word "Copiar" at 12px. On a mobile device this is a frustrating tap target that will cause mis-taps.

**Typography: 5/10**
The code uses `font-family: monospace` (browser-default monospace — Courier New on most Windows machines, Menlo on macOS) and `font-size: var(--font-h3-size)` (24px). This is functional but not polished. A named monospace stack (`'JetBrains Mono', 'Fira Code', 'Courier New', monospace`) would look intentional. `letter-spacing: 1px` is good — it aids legibility for codes. No font-family is set for the "Copiar" button, so it inherits browser default.

**Icon/visual quality: 4/10**
The copy button has no icon — just the text "Copiar". There is no clipboard icon, no visual affordance beyond the cursor change. The "Copiado!" success state swaps the button for a text label with no animation — the transition is jarring and abrupt.

**Feedback UX: 6/10**
The 1500ms auto-reset timer is the right call. The success text "Copiado!" is clear. However: (1) there is no animation on the state transition — the button should fade out and the success label should fade in; (2) the success state should ideally include a checkmark icon alongside the text for redundancy; (3) there is no error handling if `navigator.clipboard.writeText` rejects (e.g. in non-HTTPS contexts or when permission is denied) — the component will silently fail, leaving the inspector thinking the copy worked when it didn't.

**Improvements needed:**
- Give the copy button a proper visual treatment: `background: var(--color-primary)`, `color: var(--color-neutral-white)`, `border-radius: 6px`, `padding: var(--space-xs) var(--space-sm)`, minimum touch target 44px. Alternatively a ghost button with `border: 1px solid var(--color-primary)`.
- Add a CSS `transition: opacity 150ms ease` between the button and "Copiado!" states instead of an abrupt swap.
- Add a clipboard SVG icon to the button (before the "Copiar" label) and a checkmark to the "Copiado!" label.
- Add a `background: var(--color-neutral-50)` fill to the wrapper so the dashed border is always visible.
- Add try/catch around the clipboard write and render an error state ("Falha ao copiar") with `color: var(--color-error)` on rejection.
- Upgrade the monospace stack from `monospace` to a named variable: `--font-mono: 'JetBrains Mono', 'Fira Code', monospace`.
- Validate the code format at render time using `isValidCode` from logic.ts and visually flag invalid codes (the validation function exists but is never used in the component).

---

### AiPhotoResult — 4/10

**What it does:** Displays the AI verdict on an inspection photo — approved (✓) or rejected (✕) — plus an optional rejection reason. This is one of the highest-stakes UI moments in the entire app: the inspector needs to immediately understand whether to retake a photo.

**Visual appeal: 3/10**
This is the component most in need of improvement. A uniform `border: 1px solid var(--color-neutral-300)` with `border-radius: 12px` renders identically for both approved and rejected verdicts — only the icon colour changes. There is no background differentiation, no left accent bar, no filled state to signal urgency. A rejected photo verdict looks almost identical to an approved one except for a colour change on a small Unicode character. For a safety-critical workflow step, this is a serious deficiency.

**Domain clarity: 4/10**
"Foto aprovada pela IA" and "Foto recusada pela IA" are clear text labels. However, the visual weight of the verdict message is identical to the reason text — both sit at similar font sizes with similar weights. The hierarchy should be: giant icon → verdict message (bold, large) → reason (small, secondary). Currently the 24px icon is the only differentiator.

**Spacing & rhythm: 5/10**
`gap: var(--space-xs)` (4px) between header and reason is too tight — the reason line feels glued to the verdict message. A minimum of `var(--space-sm)` (8px) would help. The `padding: var(--space-md)` (16px) on the box is adequate. The overall component has no minimum height, so a verdict-only card (no reason) looks incomplete.

**Typography: 4/10**
The icon uses `font-size: var(--font-h3-size)` (24px) and `font-weight: 700`. The Unicode characters ✓ and ✕ render fine in terms of weight, but their baseline alignment varies across fonts and browsers. The message is `font-size: var(--font-body-size)` (16px) `font-weight: 600`, the reason is `font-size: var(--font-small-size)` (12px) `color: neutral-600`. This hierarchy exists but is too subtle — the verdict message needs to be visually dominant, not the same size as body copy.

**Icon/visual quality: 3/10**
✓ and ✕ are Unicode code points. They render inconsistently across platforms — ✕ (U+2715) has different stroke weights in system fonts on Windows vs. macOS vs. Android. The icon is styled with inline `color` driven by `AI_CONFIG`, which is correct, but the colour is the only signal — there is no background circle, no badge, no visual containment that would make the icon legible at a glance in peripheral vision.

**Feedback UX: 3/10**
There is no animation whatsoever — the component renders statically. For an AI result that arrives asynchronously, there should be a loading skeleton or spinner state. The component has no `loading` prop. When a rejection reason is absent (`verdict === "recusada"` but no `reason` prop), the component renders only the header with no explanation — this is a confusing blank card for the inspector. The `reason` should have a fallback string ("Nenhum detalhe fornecido.") rather than rendering nothing.

**Improvements needed:**
- Differentiate the box visually by verdict: approved gets a `background: #F0FDF4` (light green tint) with `border-color: var(--color-success)`; rejected gets `background: #FEF2F2` (light red tint) with `border-color: var(--color-error)`. This creates immediate gestalt recognition without reading any text.
- Add a 4px left accent bar (`border-left: 4px solid <verdict-color>`) using a `::before` pseudo-element or a dedicated `<div>` — a common and highly effective urgency signal in field-tool UIs.
- Increase the icon to at least 32px and wrap it in a circular badge: `width: 40px; height: 40px; border-radius: 50%; background: <verdict-color-10%>; display: flex; align-items: center; justify-content: center`. Replace Unicode glyphs with SVG paths for cross-platform consistency.
- Increase message font-size to `var(--font-h3-size)` (24px) and reduce reason font-size to `var(--font-small-size)` (12px) with more contrast gap between them.
- Add a `loading` prop that renders a shimmer/skeleton state in place of the icon and message — essential for async AI responses.
- Add a reason fallback: when `verdict === "recusada"` and `reason` is absent, render "Nenhum detalhe disponível." in italic neutral text.
- Add a CSS `animation: fadeIn 200ms ease-out` to the entire box on mount — the AI result arriving should feel like a reveal, not a static render.
- Increase `gap` from `var(--space-xs)` to `var(--space-sm)` between header and reason.

---

## Top 3 Priority Fixes (cross-component)

1. **AiPhotoResult: verdict-differentiated backgrounds and border colours (critical UX, safety impact)**
   The single highest-leverage change in the entire component library. Approved vs. rejected photos must be distinguishable at a glance — currently they are not. Adding background tints (`#F0FDF4` / `#FEF2F2`) and matching border colours to `--color-success` / `--color-error` costs four CSS lines and eliminates the biggest usability risk: an inspector misreading a rejection as approval.

2. **GeoTag: replace boolean `validated` with a three-state `status` prop and swap emoji for SVG icon**
   The component currently has no way to represent the most common real-world state — GPS acquisition in progress. Field inspectors on poor signal will see a bare location string with no status signal. Adding `status: 'pending' | 'acquired' | 'error'` with distinct icons and colours (warning/success/error tokens) makes the component genuinely useful. The emoji-to-SVG migration is bundled here because it is a prerequisite for reliable colour control.

3. **UniqueCode: copy button needs a real interactive treatment and error handling**
   The copy button is the primary action in a key workflow step, yet it has no visual affordance beyond cursor change. At 12px with no padding, it fails mobile tap-target guidelines (minimum 44px). Adding background, padding, border-radius, and a clipboard icon takes the button from invisible to obvious. The missing try/catch is a silent failure mode that will confuse inspectors in HTTP preview environments or when clipboard permission is denied.
