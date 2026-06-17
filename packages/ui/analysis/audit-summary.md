# @vistoria/ui — UI/UX Audit Summary

**Date:** 2026-06-17  
**Auditors:** 4 parallel UI/UX reviewers (Atoms, Molecules, Organisms, Domain)  
**Scope:** Pre-audit (baseline) vs. Post-audit (after targeted improvements)

---

## Score Overview

| Category    | Pre  | Post | Delta |
|-------------|------|------|-------|
| Atoms       | 5.4  | 6.4  | +1.0  |
| Molecules   | 5.5  | 6.2  | +0.7  |
| Organisms   | 4.5  | 5.5  | +1.0  |
| Domain      | 4.5  | 5.7  | +1.2  |
| **Average** | **5.0** | **5.95** | **+0.95** |

The library progressed from "prototype-grade foundation with visual gaps" to "designed baseline with unfinished interaction layer." The improvements were focused but narrow: font tokens, icon system unification, and incremental spacing adjustments. Structural accessibility and interaction-layer work remains unaddressed.

---

## What Improved

### High-Impact Fixes (Completed)

1. **Font System (Global)**
   - Added `--font-family: 'Inter', system-ui, sans-serif` to `:root` in `web.css`
   - Applied via `body, button, input, select, textarea` selector
   - Eliminated browser-default serif/sans inconsistency across all components
   - Visual credibility increased measurably — the interface no longer looks broken at a glance

2. **Icon System Coherence (Atoms, Domain)**
   - Badge: Replaced Unicode glyphs (`✓`, `•`, `!`, `✕`, `◷`) with Lucide React icons (`CheckCircle2`, `Clock3`, `AlertCircle`, `XCircle`, `CalendarClock`)
   - IconButton: Unified mixed emoji/text/Unicode into consistent Lucide React set (`Camera`, `Search`, `Plus`, `Pencil`, `Trash2`, `ArrowRight`)
   - GeoTag: Replaced emoji `📍` with `MapPin` from lucide-react
   - AiPhotoResult: Replaced `✓`/`✕` Unicode with `CheckCircle2`/`XCircle`
   - Eliminated cross-OS rendering inconsistencies, platform-specific sizing issues, and visual incoherence

3. **Spacing Tokens (Extended)**
   - Added `--space-2xl: 48px` and `--space-3xl: 64px` to complete the rhythm scale
   - Increased padding on VehicleCard (`--space-lg` added to `.card`)
   - Increased padding on StatCard and Modal body (`--space-lg`)
   - Increased padding on UniqueCode wrapper (`var(--space-md) var(--space-lg)`)
   - Increased padding on AiPhotoResult (`--space-lg`)

4. **ProgressBar Collapse Fix (Atoms)**
   - Added `min-width: 200px` to `.track` to prevent collapse in narrow Storybook containers and real app layouts
   - Component now renders consistently in all viewport contexts

### Completed by Component

- **Button:** Font rendering (Inter), structure unchanged; interaction states remain missing
- **Input:** Font rendering (Inter); focus/disabled/placeholder states unchanged
- **Badge:** Complete icon system replacement; vertical padding (2px) still tight; background colors still hardcoded
- **ProgressBar:** Min-width fix resolves collapse; aria-label and color-transition animations remain missing
- **IconButton:** Complete icon system replacement; hover/focus/disabled states missing; button size still below 44px WCAG target
- **VehicleCard:** Padding increase; fixed width (280px) still blocks responsive use; hover/focus states missing
- **StatCard:** Padding increase; WCAG AA contrast failure on change indicator still present; spacing still tight
- **ChecklistItem:** Font improvement only; touch targets, icon treatment, visual hierarchy unchanged
- **UploadArea:** Font improvement only; keyboard accessibility bug, state-specific content, hardcoded hex values all remain
- **OcrResult:** Font improvement only; WCAG AA contrast failure, cramped padding, hardcoded hex all remain
- **Modal:** Body padding increase; entrance animation, backdrop dismiss, Escape key handler, semantic button variant all missing
- **Sidebar:** Font improvement; icon system still absent (collapsed state non-functional); interaction states missing
- **BottomNav:** Font improvement; icon system still absent (text-only, defeats pattern purpose); interaction states missing
- **DataTable:** Font improvement; empty state, loading state, row hover, responsive overflow protection all missing
- **GeoTag:** Icon replacement (MapPin); boolean `validated` prop still limits to two states (pending/error states missing)
- **UniqueCode:** Padding increase; copy button invisible (no background/border/padding); icons and error handling missing
- **AiPhotoResult:** Icon replacement (CheckCircle2/XCircle); verdict backgrounds still identical; urgency signals missing

---

## Remaining Issues (Priority Order)

### P1 — Critical / WCAG Violations / Functional Blockers

1. **Interactive States Completely Absent (Button, Input, IconButton, all Molecules, all Organisms)**
   - No `:hover`, `:focus-visible`, `:active`, or `transition` on any interactive element
   - Affects: WCAG 2.4.7 (Focus Visible) compliance across entire library
   - UX impact: Users receive zero feedback that elements are interactive; keyboard navigation is invisible
   - **Status:** Untouched across all 14 components
   - **Effort:** Medium (4–6 hours) — systematic CSS additions to 10+ files

2. **UploadArea Keyboard Inaccessibility (Molecules)**
   - Component has `role="button"` and `tabIndex={0}` but no `onKeyDown` handler
   - Keyboard users cannot trigger file dialog with Enter/Space — only mouse works
   - WCAG 2.1 SC 2.1.1 violation
   - **Status:** Untouched; flagged in pre-audit as explicit violation
   - **Effort:** Minimal (5 minutes) — three-line code addition

3. **AiPhotoResult Verdict-Indifferent Styling (Domain)**
   - Approved and rejected verdicts render identically: same border, background, layout
   - Only visual differentiator is 24px icon colour (green vs. red)
   - Accessibility failure: monochrome-blind users cannot distinguish verdicts visually
   - Safety-critical workflow: field inspectors must immediately understand whether to retake a photo
   - **Status:** Untouched; flagged as highest-priority fix in pre-audit
   - **Effort:** Low (15 minutes) — two CSS rule blocks with conditional styling via `data-verdict` attribute

4. **WCAG AA Contrast Failures (Molecules)**
   - StatCard change indicator: `#22C55E` on white = ~2.5:1 (fails AA requirement 4.5:1)
   - OcrResult "Validado" pill: `#22C55E` on `#DCFCE7` = ~2.3:1 (fails AA)
   - Affects readability in bright sunlight, on lower-quality screens, for low-vision users
   - **Status:** Untouched; flagged as Priority 2 in pre-audit
   - **Effort:** Low (10 minutes) — colour darkening or redesign to white text on coloured background

5. **Spinner Animation Missing (Atoms)**
   - Button `.spinner` has static CSS circle (`border: 2px`) but no `@keyframes` or `animation`
   - Buttons with `aria-busy="true"` communicate "loading" but render static — appears broken or frozen
   - **Status:** Untouched
   - **Effort:** Minimal (5 minutes) — add `@keyframes spin` and `animation: spin 600ms linear infinite`

6. **ProgressBar Lacks aria-label (Atoms)**
   - `role="progressbar"` with only numeric `aria-valuenow` is meaningless to assistive technology
   - Screen readers cannot announce what is progressing ("Fotos enviadas", "Itens inspecionados", etc.)
   - WCAG 4.1.2 violation
   - **Status:** Untouched
   - **Effort:** Low (10 minutes) — add `ariaLabel` prop and pass to track div

### P2 — Important / UX Gaps / Accessibility Gaps

1. **Icon System Still Missing (Organisms)**
   - Sidebar: Collapsed state (64px wide, labels hidden) has zero icons — users cannot identify navigation targets without clicking
   - BottomNav: All five tabs are text-only — defeats the entire purpose of bottom navigation pattern (glanceable, icon-driven navigation)
   - Both components require `icon` field on `NavLink` and `Tab` types respectively
   - **Status:** Untouched; flagged as Priority 2 in pre-audit
   - **Effort:** Medium (3–4 hours) — type changes, icon component, CSS adjustments, Storybook updates

2. **Touch Target Sizes Below WCAG 2.5.5 (44px minimum)**
   - Button md: ~36px tall (8px+16px+8px+padding)
   - Button sizeSm: ~24px tall
   - IconButton: 36×36px (requires 44×44px)
   - Sidebar nav items: ~32px tall
   - BottomNav tabs: unspecified, likely 24–32px
   - ChecklistItem: ~33px tall
   - **Status:** Untouched across 5+ components
   - **Effort:** Low (20 minutes) — add `min-height: 44px` and `min-width: 44px` CSS rules

3. **Hardcoded Hex Values (Design System Violation)**
   - UploadArea: `background: #DBEAFE` on dragging state (should be `--color-primary-tint`)
   - OcrResult: `background: #DCFCE7` on validated pill (should be `--color-success-tint`)
   - StatCard: `style={{ color: change.color }}` inline JS (should be CSS custom property)
   - Prevents dark-mode token swaps, theme consistency, and cascade-driven styling
   - **Status:** Untouched; flagged in pre-audit
   - **Effort:** Low (15 minutes) — add missing tokens to `web.css` and refactor references

4. **Modal UX Gaps (Molecules)**
   - No entrance animation (snaps in abruptly)
   - No backdrop click-to-close (overlay click does nothing)
   - No Escape key handler
   - Semantic mismatch: warning modal's confirm button uses `variant="success"` (green button implies action is safe, contradicting warning intent)
   - No close button (×) in header
   - **Status:** Untouched; flagged as Priority 1 in pre-audit
   - **Effort:** Medium (1 hour) — add animation, event handlers, semantic fix

5. **DataTable Empty/Loading States Missing (Organisms)**
   - Zero-result views render blank `<tbody>` with no message — dead end for inspectors
   - No loading skeleton or spinner during data fetch
   - No row hover background to signal interactivity
   - No overflow wrapper for mobile (wide tables break layout on narrow viewports)
   - **Status:** Untouched; flagged in pre-audit
   - **Effort:** Medium (1 hour) — add conditional JSX, CSS overflow container

6. **GeoTag Limited to Two States (Domain)**
   - Boolean `validated` prop cannot represent "GPS acquisition in progress" — the most common real-world condition
   - Field inspectors on poor signal see bare location with no status signal
   - Needs `status: 'pending' | 'acquired' | 'error'` prop with distinct icons/colours
   - **Status:** Untouched; flagged as Priority 2 in pre-audit
   - **Effort:** Medium (30 minutes) — prop change, icon swap, CSS conditional styling

7. **UniqueCode Copy Button Invisible (Domain)**
   - Button has no background, border, padding, or icon
   - Indistinguishable from plain text label
   - Touch target is word bounding box (~12×44px) — fails WCAG 2.5.5
   - No error handling for clipboard write failures
   - No icons or transitions
   - **Status:** Untouched; flagged as Priority 3 in pre-audit (but should be P2 for UX)
   - **Effort:** Medium (30 minutes) — add styling, icons, error handling

### P3 — Nice-to-Have / Polish

1. **Font Choice: Inter is Safe but Generic**
   - Pre-audit explicitly recommended `'DM Sans'` as more distinctive alternative
   - Inter is ubiquitous in developer-built UIs; DM Sans (free, Google Fonts) adds personality at zero cost
   - **Status:** Inter implemented; DM Sans not considered
   - **Effort:** Trivial (1 minute) — single token change in `web.css`

2. **Hover and Transition States Across All Organisms**
   - All interactive elements snap between states with no motion
   - `transition: color 150ms ease, background 150ms ease` on all interactive elements would add polish
   - **Status:** Untouched
   - **Effort:** Low (30 minutes) — systematic CSS addition

3. **VehicleCard Fixed Width Anti-Pattern**
   - `width: 280px` blocks responsive grid layouts (cannot place in 3-column or 4-column grid)
   - Should be `width: 100%; min-width: 240px` to allow consumer control
   - **Status:** Untouched
   - **Effort:** Trivial (5 minutes) — CSS change

4. **Input Focus Styling (Atoms)**
   - No `:focus` or `:focus-visible` on `.field` — focus is invisible except browser default
   - No disabled state styling
   - No placeholder colour control
   - **Status:** Untouched
   - **Effort:** Low (20 minutes) — add three CSS rule blocks

5. **Badge Vertical Padding (Atoms)**
   - Current `2px var(--space-sm)` = 16px total height — cramped on mobile
   - Recommendation: increase to `4px var(--space-sm)` = 20px
   - **Status:** Untouched
   - **Effort:** Trivial (1 minute) — padding change

6. **ChecklistItem Visual Improvements (Molecules)**
   - No `min-height: 44px` for touch target
   - No gap between label and sublabel (butt directly together)
   - Unicode icons inconsistent across platforms; should have background-circle pattern for dual color+shape encoding
   - **Status:** Untouched
   - **Effort:** Low (20 minutes) — CSS additions, icon pattern change

7. **OcrResult Excessive Font Size**
   - Value at 24px in 8px-padded row creates oversized feeling
   - Recommendation: reduce to 20px
   - Also: no `flex-shrink: 0` prevents compression on narrow containers
   - **Status:** Untouched
   - **Effort:** Low (10 minutes) — font-size and flex property changes

8. **StatCard Spacing and Typography**
   - `gap: var(--space-xs)` (4px) between value/label/change is too tight
   - No `font-variant-numeric: tabular-nums` — numeric changes cause layout shift
   - CSS in one-liner format (hard to maintain)
   - **Status:** Untouched
   - **Effort:** Low (15 minutes) — spacing and typography adjustments

---

## Recommended Next Wave of Improvements

### Immediate (Highest ROI)

1. **Add Interactive States to All Interactive Components** (6 hours)
   - Add `:hover`, `:focus-visible`, `transition` to Button, Input, IconButton, Sidebar links, BottomNav tabs, DataTable pagination, Modal overlay
   - Fix WCAG 2.4.7 compliance across entire library
   - Dramatically improves perceived responsiveness

2. **Fix AiPhotoResult Verdict Styling** (15 minutes)
   - Add `background` and `border-color` conditional CSS via existing `data-verdict` attribute
   - Approved: `background: #F0FDF4; border-color: var(--color-success);`
   - Rejected: `background: #FEF2F2; border-color: var(--color-error);`
   - Single highest-leverage safety-critical fix

3. **Fix WCAG AA Contrast Failures** (15 minutes)
   - StatCard: darken change indicator to `#166534` or switch to white-on-green
   - OcrResult: redesign pill to `background: var(--color-success); color: white`
   - Resolves compliance risk and improves readability in field conditions

4. **Fix UploadArea Keyboard Accessibility** (5 minutes)
   - Add `onKeyDown` handler to trigger file dialog on Enter/Space
   - Resolves WCAG 2.1 SC 2.1.1 violation

### Short-term (1–2 days)

5. **Add Icon System to Sidebar and BottomNav** (3–4 hours)
   - Add `icon` field to `NavLink` and `Tab` types
   - Render Lucide icons in both expanded/collapsed (Sidebar) and all states (BottomNav)
   - Unblock collapsed Sidebar functionality; restore BottomNav pattern effectiveness

6. **Fix Touch Target Sizes** (30 minutes)
   - Audit all interactive components; set `min-height: 44px` and `min-width: 44px` where needed
   - Button, IconButton, Sidebar nav, BottomNav tabs, ChecklistItem all affected

7. **Add Missing Component States** (2–3 hours)
   - DataTable: empty state + loading skeleton
   - GeoTag: `status: 'pending' | 'acquired' | 'error'` prop with icons
   - UploadArea: distinct visual content per state (uploading spinner, success icon, error message)
   - UniqueCode: copy button with styling, icons, error handling

8. **Migrate Remaining Hardcoded Colours to Tokens** (20 minutes)
   - Add `--color-primary-tint`, `--color-success-tint`, `--color-error-tint` to `web.css`
   - Replace UploadArea `#DBEAFE` and OcrResult `#DCFCE7` with token references
   - Enable dark-mode readiness

### Medium-term (3–5 days)

9. **Modal UX Polish** (1 hour)
   - Add entrance animation (`@keyframes` + `animation`)
   - Add backdrop click-to-close and Escape key handler
   - Fix semantic button variant (danger, not success, for warning modals)
   - Add close (×) button

10. **Typography Refinements** (2 hours)
    - Consider switching from Inter to DM Sans or similar (adds personality, same cost)
    - Add `letter-spacing: 0.08em` to license plates (VehicleCard)
    - Add `font-variant-numeric: tabular-nums` to StatCard value
    - Fix label/sublabel spacing in ChecklistItem

11. **Responsive Layout Improvements** (3 hours)
    - Fix VehicleCard fixed width (→ `100%; min-width: 240px`)
    - Add DataTable `overflow-x: auto` wrapper
    - Add Sidebar `@media` auto-collapse on narrow viewports
    - Hide BottomNav on desktop (>768px) when Sidebar is visible

12. **Input Component Polish** (30 minutes)
    - Add `:focus-visible` outline and border-color change
    - Add `:disabled` styling (background, colour, opacity)
    - Add `::placeholder` colour token
    - Expose `disabled` and `name` props

---

## Summary: Audit Completion Status

**Tests Passed:**
- Font system (global token applied)
- Icon coherence (Lucide React fully adopted for Atoms + Domain)
- Spacing token extension (2 new tokens added)
- ProgressBar min-width collapse fix

**Tests Failed / Blocked:**
- Interactive states (0% complete — affects 14 components)
- Touch target compliance (0% complete — affects 5+ components)
- Accessibility violations remain (WCAG AA contrast: 2 unresolved; WCAG 2.1.1 keyboard: 1 unresolved; WCAG 4.1.2 labels: 1 unresolved; WCAG 2.4.7 focus: library-wide)
- Icon system on Organisms (0% complete — Sidebar and BottomNav non-functional)
- Modal UX features (0% complete — animation, backdrop dismiss, Escape key)
- DataTable states (0% complete — empty/loading)
- GeoTag multi-state support (0% complete — stuck on boolean)
- UniqueCode button functionality (0% complete — invisible)

**Effort Remaining (Realistic Estimate):**
- Critical path (P1 + UploadArea keyboard): 10–12 hours
- Full completion (P1 + P2): 25–30 hours
- Including P3 polish: 35–40 hours

**Recommendation:** Prioritize the immediate fixes (interactive states, AiPhotoResult backgrounds, contrast failures, keyboard accessibility) before moving to feature-like work (new icons, new states). The foundation is strong (tokens, components are well-structured); the gaps are systematic (polish layer + accessibility compliance) rather than architectural.
