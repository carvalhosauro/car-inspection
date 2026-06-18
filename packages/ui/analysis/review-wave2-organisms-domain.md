# Wave 2 Review: Organisms + Domain
**Date:** 2026-06-17

---

## Organisms Findings

### Sidebar

- **Missing: hover state on `.link`** — Zero feedback on hover over dark background. Fix: add `.link:hover { background: rgba(255,255,255,0.07); }` and `transition: background 150ms ease, color 150ms ease` to `.link`.
- **Missing: focus-visible ring** — Keyboard navigation is completely invisible. Fix: `.link:focus-visible { outline: 2px solid var(--color-primary); outline-offset: -2px; }` (negative offset keeps ring inside the rounded button bounds on the dark surface).
- **Missing: collapsed-state affordance** — `data-collapsed="true"` hides `.label` and renders no icon. The collapsed sidebar is a column of 64px-wide invisible buttons. Fix (as noted in icon work in progress): add `icon` field to `NavLink` type; render `<Icon size={20} aria-hidden="true" />` inside `.link`; add `.sidebar[data-collapsed="true"] .link { justify-content: center; padding: var(--space-sm); }` so icons are centred. Also add `title={link.label}` attribute to each button in collapsed mode as a native tooltip fallback until icons land.
- **Missing: active-item weight differentiation** — Active and inactive links differ only in background fill. Fix: add `font-weight: 500` to `.link[aria-current="page"]`. Inter 500 reads noticeably bolder than 400 on dark backgrounds.
- **Missing: touch target size** — `.link` padding is `var(--space-sm) var(--space-md)` (8px top/bottom) which yields ~32px item height. Fix: change vertical padding to `var(--space-md)` to reach 44px minimum. CSS change: `padding: var(--space-md)` on `.link`.
- **Missing: collapse toggle button** — The `collapsed` prop is fully passive; there is no internal toggle. A field inspector on a tablet has no way to collapse or expand the sidebar without the parent wiring `onNavigate`. This is a prop-design gap. Suggestion: expose `onToggleCollapse?: () => void` prop and render a `<button aria-label="Recolher menu">` at the bottom of the nav.
- **Missing: responsive breakpoint** — No `@media` rule. On a 375px phone the 240px sidebar occupies 64% of viewport width. Fix: add `@media (max-width: 768px) { .sidebar { display: none; } }` — BottomNav is the intended mobile nav.

---

### BottomNav

- **Missing: icons above labels** — Every tab renders text only. The bottom navigation pattern's entire speed advantage is glanceability via iconography. Without icons, users read five strings on a 12px type. Fix: add `icon: LucideIcon` field to `Tab` type; render `<tab.icon size={20} aria-hidden="true" />` above `<span>{tab.label}</span>`; remove the label from the center Camera tab entirely (the lifted circle IS the affordance).
- **Missing: iOS safe-area padding** — No `env(safe-area-inset-bottom)` on `.bar`. On iPhones with home indicator the bar content overlaps. Fix: add `padding-bottom: calc(var(--space-sm) + env(safe-area-inset-bottom, 0px))` to `.bar`.
- **Missing: desktop guard** — `justify-content: space-around` stretches five tabs to full viewport width on 1280px screens — tabs become 256px wide each. Fix: add `@media (min-width: 768px) { .bar { display: none; } }`. Sidebar is the intended desktop nav.
- **Missing: minimum touch target on `.tab`** — No `min-height` declared. Fix: add `min-height: 44px` to `.tab` (center button already meets this via its 56px height).
- **Missing: active state weight** — Active tab is colour-only. Fix: add `font-weight: 600` to `.tab[aria-current="page"]` to reinforce the colour signal with a typographic signal.
- **Missing: hover and focus states** — Add `.tab:hover { color: var(--color-dark); }` and `.tab:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 4px; }`.
- **Missing: badge position recalibration** — Badge `right: 8px` is positioned relative to the text-only layout. Once icons are added and `.tab` width changes, this will need to become `right: -4px; top: -4px` relative to the icon, not the whole button.

---

### DataTable

- **Missing: empty state** — When `rows.length === 0`, an empty `<tbody>` renders with no feedback. An inspector hitting a zero-result filtered view sees a blank table with pagination showing "Página 1 de 1". Fix: add a conditional before the `rows.map`:
  ```tsx
  {rows.length === 0 && (
    <tr>
      <td colSpan={columns.length} className={styles.empty}>
        Nenhum registro encontrado.
      </td>
    </tr>
  )}
  ```
  CSS: `.empty { text-align: center; padding: var(--space-2xl) var(--space-md); color: var(--color-neutral-600); font-size: var(--font-body-size); }`.
- **Missing: horizontal scroll wrapper** — `.wrapper` has no `overflow-x: auto`. Wide column sets break mobile layouts. Fix: add `overflow-x: auto` to `.wrapper` (one line; already `display: flex; flex-direction: column` so it composes cleanly).
- **Missing: hover feedback on rows** — No `.row:hover` background. Rows have `onView`/`onEdit` actions, so they are interactable units but give no hover signal. Fix: add `.row { cursor: default; transition: background 100ms ease; }` and `.row:hover { background: var(--color-neutral-50); }`. Note: only meaningful if a row-level click is wired; otherwise the hover is misleading.
- **Missing: pagination button interactive states** — `.pageButton` has no `:hover` or `:focus-visible` rule. Fix:
  ```css
  .pageButton:hover:not(:disabled) { background: var(--color-neutral-50); border-color: var(--color-neutral-600); }
  .pageButton:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  ```
- **Missing: column header visual treatment** — `th` renders in 12px Inter at default weight (UA bold). There is no `text-transform`, no `letter-spacing`, no explicit `font-weight`. Fix: add to `.th`: `text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;`. This is the single most effective readability improvement for a data-dense table.
- **Low contrast stripe** — `.row:nth-child(even)` uses `--color-neutral-50` (#F8FAFC) on white (#FFFFFF). Delta is ~2 lightness points — imperceptible on uncalibrated screens. Fix: swap to `background: rgba(37, 99, 235, 0.04)` (primary tint at 4% opacity) which aligns the stripe visually with the brand and raises the contrast delta.
- **Cell padding is tight** — `var(--space-sm) var(--space-md)` (8px / 16px) per cell. Fix: raise to `var(--space-md) var(--space-lg)` (16px / 24px) for more comfortable reading in data-dense views.

---

## Domain Findings

### AiPhotoResult

- **Critical: no verdict-differentiated background or border** — Both `aprovada` and `recusada` render with identical `border: 1px solid var(--color-neutral-300)` and transparent background. The `data-verdict` attribute is already on the element. Fix — add two CSS rules (zero JSX changes required):
  ```css
  .box[data-verdict="aprovada"] {
    background: #F0FDF4;
    border-color: var(--color-success);
    border-left: 4px solid var(--color-success);
  }
  .box[data-verdict="recusada"] {
    background: #FEF2F2;
    border-color: var(--color-error);
    border-left: 4px solid var(--color-error);
  }
  ```
  The left accent bar is the fastest peripheral-vision signal for pass/fail states. This is a safety-critical fix.
- **Missing: verdict message hierarchy** — `.message` is `font-size: var(--font-body-size)` (16px) `font-weight: 600`. For the highest-stakes decision point in the inspector workflow, this reads the same as every other bold paragraph in the app. Fix: raise to `font-size: var(--font-h3-size)` (24px). No weight change needed — 600 at 24px is already dominant.
- **Missing: icon visual weight** — 24px `CheckCircle2`/`XCircle` on a white card is too small to catch in peripheral vision. Fix: raise `size` prop to `32` and wrap in a badge:
  ```tsx
  <span className={styles.iconBadge}>
    <Icon size={32} aria-hidden="true" style={{ color: cfg.color }} />
  </span>
  ```
  CSS: `.iconBadge { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: currentColor; opacity: 0.1; flex-shrink: 0; }` — wait, `currentColor` won't work with a wrapper. Better: use a `data-verdict` child:
  ```css
  .box[data-verdict="aprovada"] .iconBadge { background: rgba(34, 197, 94, 0.12); }
  .box[data-verdict="recusada"] .iconBadge { background: rgba(239, 68, 68, 0.12); }
  ```
- **Missing: rejection reason fallback** — When `verdict === "recusada"` and `reason` is absent, the component renders a blank card bottom. An inspector cannot tell if the AI gave no reason or if the data failed to load. Fix: change the condition in `web.tsx`:
  ```tsx
  {verdict === "recusada" && (
    <span className={styles.reason}>
      {reason ?? "Nenhum detalhe disponível."}
    </span>
  )}
  ```
- **Missing: gap between header and reason** — `gap: var(--space-xs)` (4px) makes reason text appear glued to the verdict line. Fix: change `.box` gap to `var(--space-sm)` (8px).
- **Missing: mount animation** — AI verdict arrives asynchronously; the component renders statically. A `fadeIn` transition signals the result arriving, reducing missed updates. Fix: add to `.box`:
  ```css
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  .box { animation: fadeIn 200ms ease-out; }
  ```

---

### UniqueCode

- **Missing: copy button visual treatment** — The button is transparent with no padding, no border, no icon. The copy action is the entire purpose of this component but the trigger is visually indistinguishable from a text label. Fix: change `.copy` to a styled ghost button:
  ```css
  .copy {
    border: 1px solid var(--color-primary);
    background: transparent;
    cursor: pointer;
    color: var(--color-primary);
    font-size: var(--font-small-size);
    font-weight: 600;
    border-radius: 6px;
    padding: var(--space-xs) var(--space-sm);
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    transition: background 150ms ease, color 150ms ease;
  }
  .copy:hover { background: var(--color-primary); color: var(--color-neutral-white); }
  .copy:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  ```
- **Missing: `Copy`/`Check` icons on the button** — lucide-react is already a dependency. Fix: import `Copy` and `Check` from `lucide-react` and render inside the button:
  ```tsx
  import { Copy, Check } from "lucide-react";
  // in JSX:
  {copied ? (
    <span className={styles.copied}><Check size={14} aria-hidden="true" /> Copiado!</span>
  ) : (
    <button ... className={styles.copy}>
      <Copy size={14} aria-hidden="true" /> Copiar
    </button>
  )}
  ```
- **Missing: clipboard error handling** — `navigator.clipboard.writeText` rejects silently on HTTP or when permission is denied. The current `async copy` has no try/catch. Fix:
  ```ts
  const [copyError, setCopyError] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopied?.();
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };
  ```
  Add `.copyError { font-size: var(--font-small-size); color: var(--color-error); }` and render the error state alongside the button.
- **Missing: `isValidCode` used at render** — `UniqueCode.logic.ts` exports `isValidCode(code)` but `web.tsx` never calls it. An invalid code (wrong format, truncated) renders identically to a valid one. Fix: call it in the component and apply a warning border tint:
  ```tsx
  const valid = isValidCode(code);
  // add data-invalid={!valid} to wrapper span
  ```
  CSS: `.wrapper[data-invalid="true"] { border-color: var(--color-warning); }`. Optionally render a `<AlertTriangle size={14} />` icon next to the code.
- **Missing: wrapper background fill** — Transparent background means the dashed border dissolves on any non-white parent. Fix: add `background: var(--color-neutral-50)` to `.wrapper`.
- **Missing: monospace font stack** — `font-family: monospace` uses the browser default (Courier New on Windows). Fix: `font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', monospace`. This is a one-line CSS change that visually elevates the code string from "browser default" to "intentional".

---

### GeoTag

- **Critical: binary `validated` prop is insufficient for field use** — The boolean collapses "GPS not yet acquired" and "GPS failed" into the same unvalidated state. An inspector on weak signal cannot determine if the device is still acquiring or has permanently failed. Fix: change the prop type in `GeoTag.logic.ts`:
  ```ts
  export type GeoStatus = 'pending' | 'acquired' | 'error';
  export interface GeoTagProps {
    city: string;
    state: string;
    status?: GeoStatus;
  }
  ```
  This is a breaking change to the `validated` prop. Migration path: keep `validated?: boolean` temporarily and derive `status` from it internally (`validated === true` → `'acquired'`, `validated === false` → `'error'`, `validated === undefined` → `'pending'`), then deprecate `validated` in the next minor.
- **Missing: `pending` and `error` icon states** — lucide-react is already imported. Fix in `web.tsx`:
  ```tsx
  import { MapPin, MapPinOff, Loader2 } from "lucide-react";
  const STATUS_ICON = {
    pending: <Loader2 size={16} className={styles.pinPending} aria-hidden="true" />,
    acquired: <MapPin size={16} className={styles.pin} aria-hidden="true" />,
    error: <MapPinOff size={16} className={styles.pinError} aria-hidden="true" />,
  };
  ```
  CSS additions:
  ```css
  .pinPending { color: var(--color-warning); animation: spin 1s linear infinite; }
  .pinError { color: var(--color-error); }
  @keyframes spin { to { transform: rotate(360deg); } }
  ```
- **Missing: container/background** — The tag is bare `inline-flex` with no container. On photographic or tinted backgrounds (camera view) it disappears. Fix: add a pill container:
  ```css
  .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--color-neutral-white);
    border: 1px solid var(--color-neutral-300);
    border-radius: 9999px;
    padding: var(--space-xs) var(--space-sm);
    min-height: 32px;
  }
  ```
- **Missing: city/state typographic differentiation** — "São Paulo, SP" renders as a flat string at uniform weight. Fix: split the render in `web.tsx` instead of using `formatLocation`:
  ```tsx
  <span className={styles.city}>{city.trim()}</span>
  <span className={styles.stateSep}>,</span>
  <span className={styles.state}>{state.trim()}</span>
  ```
  CSS: `.city { font-weight: 600; color: var(--color-dark); }` / `.state { font-weight: 400; color: var(--color-neutral-600); }` / `.stateSep { color: var(--color-neutral-300); }`.
- **Missing: `status` text label** — The current `validated` label is "Localização validada" (green, 12px). Add `error` and `pending` labels:
  ```tsx
  const STATUS_LABEL = {
    pending: <span className={styles.statusPending}>Aguardando GPS…</span>,
    acquired: <span className={styles.validated}>Localização validada</span>,
    error: <span className={styles.statusError}>Falha no GPS</span>,
  };
  ```

---

## Top 5 Highest-Impact Changes

1. **AiPhotoResult — verdict-differentiated background + left accent bar** — Effort: S — Two CSS rule blocks using the `data-verdict` attribute already on the DOM. Zero JSX changes. Approved cards turn green-tinted; rejected cards turn red-tinted with a 4px left border. This is the only safety-critical issue in the library: a field inspector misreading a rejection as approval costs a retake at minimum, a compliance failure at worst. Highest leverage-to-effort ratio in the entire codebase.

2. **BottomNav — icons above labels + iOS safe-area padding** — Effort: M — The BottomNav without icons is architecturally incomplete: it forces label-reading instead of glyph recognition, negating the pattern's purpose. Add `icon: LucideIcon` to the `Tab` type and render icons above labels. Simultaneously add `env(safe-area-inset-bottom)` to `.bar` — a one-line CSS fix that prevents iPhone home indicator overlap in production. Together these two changes bring BottomNav from "sketch" to "shippable".

3. **Sidebar — hover/focus states + touch target size** — Effort: S — Three CSS additions: `.link:hover` background tint, `.link:focus-visible` outline, and `padding: var(--space-md)` on `.link` for 44px touch targets. This fixes both WCAG 2.4.7 (focus visibility) and WCAG 2.5.5 (touch target size) across all eight navigation items in a single pass. The collapsed-mode `title` attribute fallback is an additional one-liner that prevents the collapsed state from being completely non-functional while icon work finishes.

4. **UniqueCode — copy button styled + icons + error handling** — Effort: S — The copy button is currently invisible. Adding a ghost-button style (border, padding, `min-height: 36px`), `Copy`/`Check` icons from the already-imported lucide-react, and a try/catch for clipboard rejection upgrades the component's most-used interaction from invisible to discoverable and reliable. `isValidCode` is already implemented in logic.ts — calling it at render and displaying a warning border is two lines.

5. **DataTable — empty state + `overflow-x: auto` + column header treatment** — Effort: S — Three independent fixes that each close a distinct failure mode: (a) empty state prevents silent dead-end views for zero-result filters; (b) `overflow-x: auto` on `.wrapper` prevents layout breakage on mobile; (c) `text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600` on `.th` is the single most effective readability improvement for a data-dense table, requiring one CSS rule.
