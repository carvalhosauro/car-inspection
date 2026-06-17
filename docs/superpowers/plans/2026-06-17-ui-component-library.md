# Implementation Plan — UI Component Library (`@vistoria/ui`)

**For agentic workers:** Execute this plan task-by-task following `superpowers:subagent-driven-development`. Each task is self-contained: a fresh subagent with zero prior context can complete it from the Files, Interfaces, and checkbox steps alone. Do NOT skip the failing-test-first step. Do NOT batch tasks.

**Goal:** Build the `@vistoria/ui` design-system package — tokens, cross-platform components (web + native), and Storybook 8 — so future web (Next.js) and mobile (Expo) apps consume one consistent visual source.

**Architecture:** A new pnpm workspace package `packages/ui` under the existing Turborepo. Each component ships a shared `.logic.ts` (prop types/helpers, the only file tested for non-render logic), a `.web.tsx` (CSS Modules), a `.native.tsx` (React Native StyleSheet, NOT vitest-tested), a `.module.css`, a `.stories.tsx`, and an `index.ts` re-export. Web components + logic are tested with vitest (jsdom + Testing Library); Storybook stories cover every variant/state and run a smoke render via `@storybook/test`.

**Tech Stack:** TypeScript 5.6 (ESM), React 18, React Native (types only), vitest 2.1 + jsdom + @testing-library/react, Storybook 8 (`@storybook/react-vite`), CSS Modules, Turborepo + pnpm workspaces.

**Model routing:** `Plan = Opus xhigh | Exec atômica = Sonnet high | Exec complexa = Opus xhigh | Review = Opus xhigh | Final = Opus xhigh`

---

## Global Constraints

Copied verbatim / derived from the approved spec and verified repo conventions. Every task MUST honor these.

- **Package name:** `@vistoria/ui`. `"version": "0.0.0"`, `"private": true`, `"type": "module"`.
- **Shared TS config:** extend `@vistoria/config/tsconfig`. tsconfig.json shape:
  ```json
  { "extends": "@vistoria/config/tsconfig", "compilerOptions": { "outDir": "dist", "rootDir": "src" }, "include": ["src"] }
  ```
- **Base compiler options (inherited, do not redefine):** target ES2022, module ESNext, moduleResolution Bundler, lib `[ES2022, DOM]`, strict, noUncheckedIndexedAccess, esModuleInterop, skipLibCheck, declaration, composite, isolatedModules, resolveJsonModule. JSX must be enabled in this package (`"jsx": "react-jsx"` added locally — base does not set it).
- **Shared eslint:** `@vistoria/config/eslint`.
- **Test runner:** **vitest** (`vitest run`). NEVER jest. Web component tests use `environment: "jsdom"`.
- **Package scripts:** `typecheck`: `tsc --noEmit`, `test`: `vitest run`, `lint`: `eslint .`, `storybook`: `storybook dev -p 6006`, `build-storybook`: `storybook build`.
- **turbo.json:** add `"storybook": { "cache": false, "persistent": true }`. Do not remove existing tasks.
- **Native files are NOT tested via vitest.** They are implemented and typechecked only. React Native does not enter Storybook (validated via Expo Go).
- **Commits:** Conventional Commits, scope `(ui)`. Every commit message ends with the trailer line:
  `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **Out of scope (do NOT build):** Style Dictionary / token codegen, dark mode, React Native Storybook, animations/motion.

### Design tokens (single source of truth — use these EXACT values)

Colors: `primary #2563EB`, `dark #0F172A`, `success #22C55E`, `warning #F59E0B`, `error #EF4444`, `neutral-white #FFFFFF`, `neutral-50 #F8FAFC`, `neutral-300 #CBD5E1`, `neutral-600 #334155`.

Typography: `h1 40px/700`, `h2 32px/600`, `h3 24px/600`, `body 16px/400`, `small 12px/400`.

---

## File Structure

Every file created (C) or modified (M), with one-line responsibility. Ordered by creation.

| File | C/M | Responsibility |
|------|-----|----------------|
| `turbo.json` | M | Add `storybook` task (cache:false, persistent:true) |
| `packages/ui/package.json` | C | Package manifest: name, exports, scripts, deps |
| `packages/ui/tsconfig.json` | C | Extends shared config, adds `jsx: react-jsx` |
| `packages/ui/vitest.config.ts` | C | vitest jsdom env + setup file |
| `packages/ui/vitest.setup.ts` | C | jest-dom matchers registration |
| `packages/ui/eslint.config.mjs` | C | Re-export shared eslint config |
| `packages/ui/src/tokens/index.ts` | C | JS source of truth: `colors`, `typography`, `spacing` |
| `packages/ui/src/tokens/index.test.ts` | C | Asserts token values |
| `packages/ui/src/tokens/web.css` | C | CSS custom properties mirroring tokens |
| `packages/ui/.storybook/main.ts` | C | Storybook config: framework, stories glob, addons |
| `packages/ui/.storybook/preview.ts` | C | Imports `web.css`, global parameters |
| `packages/ui/src/atoms/Button/Button.logic.ts` | C | Button prop types + class resolver |
| `packages/ui/src/atoms/Button/Button.logic.test.ts` | C | Tests class resolver |
| `packages/ui/src/atoms/Button/Button.web.tsx` | C | Web Button (CSS Modules) |
| `packages/ui/src/atoms/Button/Button.web.test.tsx` | C | Renders Button variants/states |
| `packages/ui/src/atoms/Button/Button.native.tsx` | C | Native Button (StyleSheet) — not vitest-tested |
| `packages/ui/src/atoms/Button/Button.module.css` | C | Web Button styles |
| `packages/ui/src/atoms/Button/Button.stories.tsx` | C | All Button variants/states as stories |
| `packages/ui/src/atoms/Button/index.ts` | C | Re-export web Button + logic types |
| `packages/ui/src/atoms/Input/*` | C | Input atom (6-file convention) |
| `packages/ui/src/atoms/Badge/*` | C | Badge atom (6-file convention) |
| `packages/ui/src/atoms/ProgressBar/*` | C | ProgressBar atom (6-file convention) |
| `packages/ui/src/atoms/IconButton/*` | C | IconButton atom (6-file convention) |
| `packages/ui/src/molecules/VehicleCard/*` | C | VehicleCard molecule |
| `packages/ui/src/molecules/StatCard/*` | C | StatCard molecule |
| `packages/ui/src/molecules/ChecklistItem/*` | C | ChecklistItem molecule |
| `packages/ui/src/molecules/UploadArea/*` | C | UploadArea molecule |
| `packages/ui/src/molecules/OcrResult/*` | C | OcrResult molecule |
| `packages/ui/src/molecules/Modal/*` | C | Modal molecule |
| `packages/ui/src/organisms/Sidebar/*` | C | Sidebar organism (web only) |
| `packages/ui/src/organisms/BottomNav/*` | C | BottomNav organism (mobile only) |
| `packages/ui/src/organisms/DataTable/*` | C | DataTable organism |
| `packages/ui/src/domain/GeoTag/*` | C | GeoTag domain component |
| `packages/ui/src/domain/UniqueCode/*` | C | UniqueCode domain component |
| `packages/ui/src/domain/AiPhotoResult/*` | C | AiPhotoResult domain component |

**Per-component file set (the "6-file convention"):** `<Name>.logic.ts`, `<Name>.logic.test.ts` (when logic exists), `<Name>.web.tsx`, `<Name>.web.test.tsx`, `<Name>.native.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `index.ts`.

---

## Task Index

1. Scaffold package (manifest, tsconfig, eslint) — `[complexa]`
2. Vitest config + setup — `[atômica]`
3. Tokens: `index.ts` + test — `[atômica]`
4. Tokens: `web.css` — `[atômica]`
5. Storybook 8 setup — `[complexa]`
6. Atom: Button — `[complexa]`
7. Atom: Input — `[complexa]`
8. Atom: Badge — `[atômica]`
9. Atom: ProgressBar — `[atômica]`
10. Atom: IconButton — `[atômica]`
11. Molecule: VehicleCard — `[complexa]`
12. Molecule: StatCard — `[atômica]`
13. Molecule: ChecklistItem — `[atômica]`
14. Molecule: UploadArea — `[complexa]`
15. Molecule: OcrResult — `[atômica]`
16. Molecule: Modal — `[complexa]`
17. Organism: Sidebar — `[complexa]`
18. Organism: BottomNav — `[complexa]`
19. Organism: DataTable — `[complexa]`
20. Domain: GeoTag — `[atômica]`
21. Domain: UniqueCode — `[complexa]`
22. Domain: AiPhotoResult — `[atômica]`
23. Wire turbo `storybook` task + final verification — `[atômica]`

**Total: 23 tasks — 12 `[atômica]`, 11 `[complexa]`.**

> CSS Module note for tests: vitest resolves `*.module.css` imports to a proxy where `styles.foo === "foo"`. No extra config needed beyond `css: false`-style default; vitest returns an empty/identity proxy for CSS in jsdom. Tests assert on `data-*` attributes and roles, NOT on hashed class names, to stay robust.

---

## Task 1 — Scaffold `@vistoria/ui` package `[complexa]`

Cross-cutting: creates manifest, tsconfig, eslint, and the directory tree that all later tasks depend on.

**Files**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/eslint.config.mjs`

**Interfaces**
- Produces: workspace package `@vistoria/ui` resolvable via `pnpm install`; subpath exports `./tokens`, `./atoms/*`, `./molecules/*`, `./organisms/*`, `./domain/*`.
- Consumes: `@vistoria/config/tsconfig`, `@vistoria/config/eslint` (workspace).

**Steps**

- [ ] Create `packages/ui/package.json` with exact content:
  ```json
  {
    "name": "@vistoria/ui",
    "version": "0.0.0",
    "private": true,
    "type": "module",
    "exports": {
      "./tokens": "./src/tokens/index.ts",
      "./tokens/web.css": "./src/tokens/web.css",
      "./atoms/*": "./src/atoms/*/index.ts",
      "./molecules/*": "./src/molecules/*/index.ts",
      "./organisms/*": "./src/organisms/*/index.ts",
      "./domain/*": "./src/domain/*/index.ts"
    },
    "scripts": {
      "typecheck": "tsc --noEmit",
      "test": "vitest run",
      "lint": "eslint .",
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build"
    },
    "peerDependencies": {
      "react": "^18.3.0",
      "react-dom": "^18.3.0"
    },
    "devDependencies": {
      "@vistoria/config": "workspace:*",
      "@testing-library/jest-dom": "^6.5.0",
      "@testing-library/react": "^16.0.0",
      "@testing-library/user-event": "^14.5.0",
      "@types/react": "^18.3.0",
      "@types/react-dom": "^18.3.0",
      "@types/react-native": "^0.73.0",
      "jsdom": "^25.0.0",
      "react": "^18.3.0",
      "react-dom": "^18.3.0",
      "react-native": "^0.74.0",
      "typescript": "^5.6.0",
      "vitest": "^2.1.0",
      "@vitejs/plugin-react": "^4.3.0",
      "storybook": "^8.3.0",
      "@storybook/react-vite": "^8.3.0",
      "@storybook/react": "^8.3.0",
      "@storybook/addon-a11y": "^8.3.0",
      "@storybook/addon-interactions": "^8.3.0",
      "@storybook/test": "^8.3.0"
    }
  }
  ```
- [ ] Create `packages/ui/tsconfig.json` with exact content:
  ```json
  {
    "extends": "@vistoria/config/tsconfig",
    "compilerOptions": { "outDir": "dist", "rootDir": "src", "jsx": "react-jsx" },
    "include": ["src", "vitest.setup.ts", ".storybook"]
  }
  ```
- [ ] Create `packages/ui/eslint.config.mjs` with exact content:
  ```js
  import config from "@vistoria/config/eslint";

  export default [
    ...config,
    { ignores: ["dist", "storybook-static", "node_modules"] }
  ];
  ```
- [ ] Run `pnpm install` from repo root. Confirm `@vistoria/ui` appears in the workspace and dependencies resolve. Expect success, no peer-dep errors.
- [ ] Run `pnpm --filter @vistoria/ui exec tsc --noEmit`. Expect it to PASS (no source files yet → no errors) OR fail only with "no inputs" — both acceptable at this stage.
- [ ] Commit: `chore(ui): scaffold @vistoria/ui package manifest, tsconfig, eslint`
  (with the `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` trailer)

---

## Task 2 — Vitest config + setup `[atômica]`

Single concern: test harness. 2 files, no cross deps.

**Files**
- Create: `packages/ui/vitest.config.ts`
- Create: `packages/ui/vitest.setup.ts`

**Interfaces**
- Produces: `vitest run` executes with jsdom env and jest-dom matchers loaded.
- Consumes: `@vitejs/plugin-react`, `@testing-library/jest-dom`.

**Steps**

- [ ] Create `packages/ui/vitest.config.ts` with exact content:
  ```ts
  import { defineConfig } from "vitest/config";
  import react from "@vitejs/plugin-react";

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./vitest.setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      exclude: ["src/**/*.native.tsx", "**/node_modules/**"]
    }
  });
  ```
- [ ] Create `packages/ui/vitest.setup.ts` with exact content:
  ```ts
  import "@testing-library/jest-dom/vitest";
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run`. Expect "No test files found" (acceptable — none exist yet) and NO config/loader errors.
- [ ] Commit: `chore(ui): add vitest jsdom config and jest-dom setup`

---

## Task 3 — Tokens `index.ts` + test `[atômica]`

Single concern: JS token source of truth. Test-first.

**Files**
- Create: `packages/ui/src/tokens/index.test.ts` (Test)
- Create: `packages/ui/src/tokens/index.ts`

**Interfaces**
- Produces: `export const colors`, `export const typography`, `export const spacing`; types `ColorToken`, `TypographyToken`.
- Consumes: nothing.

**Steps**

- [ ] Write failing test `packages/ui/src/tokens/index.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { colors, typography, spacing } from "./index";

  describe("color tokens", () => {
    it("exposes the exact brand palette", () => {
      expect(colors.primary).toBe("#2563EB");
      expect(colors.dark).toBe("#0F172A");
      expect(colors.success).toBe("#22C55E");
      expect(colors.warning).toBe("#F59E0B");
      expect(colors.error).toBe("#EF4444");
      expect(colors.neutralWhite).toBe("#FFFFFF");
      expect(colors.neutral50).toBe("#F8FAFC");
      expect(colors.neutral300).toBe("#CBD5E1");
      expect(colors.neutral600).toBe("#334155");
    });
  });

  describe("typography tokens", () => {
    it("maps sizes and weights from the spec", () => {
      expect(typography.h1).toEqual({ fontSize: 40, fontWeight: "700" });
      expect(typography.h2).toEqual({ fontSize: 32, fontWeight: "600" });
      expect(typography.h3).toEqual({ fontSize: 24, fontWeight: "600" });
      expect(typography.body).toEqual({ fontSize: 16, fontWeight: "400" });
      expect(typography.small).toEqual({ fontSize: 12, fontWeight: "400" });
    });
  });

  describe("spacing tokens", () => {
    it("exposes a 4px scale", () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/tokens`. Expect FAIL (module not found).
- [ ] Implement `packages/ui/src/tokens/index.ts`:
  ```ts
  export const colors = {
    primary: "#2563EB",
    dark: "#0F172A",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    neutralWhite: "#FFFFFF",
    neutral50: "#F8FAFC",
    neutral300: "#CBD5E1",
    neutral600: "#334155"
  } as const;

  export const typography = {
    h1: { fontSize: 40, fontWeight: "700" },
    h2: { fontSize: 32, fontWeight: "600" },
    h3: { fontSize: 24, fontWeight: "600" },
    body: { fontSize: 16, fontWeight: "400" },
    small: { fontSize: 12, fontWeight: "400" }
  } as const;

  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  } as const;

  export type ColorToken = keyof typeof colors;
  export type TypographyToken = keyof typeof typography;
  export type SpacingToken = keyof typeof spacing;
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/tokens`. Expect PASS.
- [ ] Commit: `feat(ui): add design tokens source of truth (colors, typography, spacing)`

---

## Task 4 — Tokens `web.css` `[atômica]`

Single concern: CSS custom properties mirroring `tokens/index.ts`. No vitest (CSS file); verified by a string-content assertion test to guard drift.

**Files**
- Create: `packages/ui/src/tokens/web.css`
- Create: `packages/ui/src/tokens/web-css.test.ts` (Test — reads the CSS file as text)

**Interfaces**
- Produces: `:root` CSS variables `--color-*`, `--font-*-size`, `--font-*-weight`, `--space-*`.
- Consumes: nothing (mirrors Task 3 values).

**Steps**

- [ ] Write failing test `packages/ui/src/tokens/web-css.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { readFileSync } from "node:fs";
  import { fileURLToPath } from "node:url";

  const css = readFileSync(
    fileURLToPath(new URL("./web.css", import.meta.url)),
    "utf8"
  );

  describe("web.css custom properties", () => {
    it("mirrors the brand colors", () => {
      expect(css).toContain("--color-primary: #2563EB;");
      expect(css).toContain("--color-success: #22C55E;");
      expect(css).toContain("--color-error: #EF4444;");
      expect(css).toContain("--color-warning: #F59E0B;");
      expect(css).toContain("--color-neutral-300: #CBD5E1;");
    });
    it("mirrors typography sizes", () => {
      expect(css).toContain("--font-h1-size: 40px;");
      expect(css).toContain("--font-small-size: 12px;");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/tokens/web-css`. Expect FAIL (file missing).
- [ ] Implement `packages/ui/src/tokens/web.css`:
  ```css
  :root {
    --color-primary: #2563EB;
    --color-dark: #0F172A;
    --color-success: #22C55E;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
    --color-neutral-white: #FFFFFF;
    --color-neutral-50: #F8FAFC;
    --color-neutral-300: #CBD5E1;
    --color-neutral-600: #334155;

    --font-h1-size: 40px;
    --font-h1-weight: 700;
    --font-h2-size: 32px;
    --font-h2-weight: 600;
    --font-h3-size: 24px;
    --font-h3-weight: 600;
    --font-body-size: 16px;
    --font-body-weight: 400;
    --font-small-size: 12px;
    --font-small-weight: 400;

    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/tokens/web-css`. Expect PASS.
- [ ] Commit: `feat(ui): add web.css custom properties mirroring tokens`

---

## Task 5 — Storybook 8 setup `[complexa]`

Cross-cutting: Storybook config that every later `.stories.tsx` depends on.

**Files**
- Create: `packages/ui/.storybook/main.ts`
- Create: `packages/ui/.storybook/preview.ts`

**Interfaces**
- Produces: a runnable Storybook (`pnpm --filter @vistoria/ui storybook`) on port 6006 discovering `src/**/*.stories.tsx`.
- Consumes: `@storybook/react-vite`, `@storybook/addon-a11y`, `@storybook/addon-interactions`, `src/tokens/web.css`.

**Steps**

- [ ] Create `packages/ui/.storybook/main.ts` with exact content:
  ```ts
  import type { StorybookConfig } from "@storybook/react-vite";

  const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-a11y", "@storybook/addon-interactions"],
    framework: { name: "@storybook/react-vite", options: {} },
    core: { disableTelemetry: true }
  };

  export default config;
  ```
- [ ] Create `packages/ui/.storybook/preview.ts` with exact content:
  ```ts
  import type { Preview } from "@storybook/react";
  import "../src/tokens/web.css";

  const preview: Preview = {
    parameters: {
      controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
      layout: "centered"
    }
  };

  export default preview;
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec storybook build --quiet`. Expect a successful static build into `storybook-static/` (no stories yet is fine; it must not error on config). If the CLI requires at least one story, this check moves to Task 6's verification — note that and proceed.
- [ ] Run `pnpm --filter @vistoria/ui exec tsc --noEmit`. Expect PASS.
- [ ] Commit: `chore(ui): configure Storybook 8 with react-vite, a11y, interactions addons`

---

## Task 6 — Atom: Button `[complexa]`

Multi-file (logic + web + native + css + stories + index), establishes the per-component pattern every later component copies.

**Files**
- Create: `packages/ui/src/atoms/Button/Button.logic.ts`
- Test: `packages/ui/src/atoms/Button/Button.logic.test.ts`
- Create: `packages/ui/src/atoms/Button/Button.web.tsx`
- Test: `packages/ui/src/atoms/Button/Button.web.test.tsx`
- Create: `packages/ui/src/atoms/Button/Button.native.tsx`
- Create: `packages/ui/src/atoms/Button/Button.module.css`
- Create: `packages/ui/src/atoms/Button/Button.stories.tsx`
- Create: `packages/ui/src/atoms/Button/index.ts`

**Interfaces**
- Produces:
  ```ts
  type ButtonVariant = "primary" | "secondary" | "success" | "danger";
  type ButtonSize = "md" | "sm";
  interface ButtonProps {
    variant?: ButtonVariant; size?: ButtonSize;
    disabled?: boolean; loading?: boolean;
    label: string; onPress?: () => void;
  }
  function resolveButtonState(props: ButtonProps): { isInteractive: boolean; variant: ButtonVariant; size: ButtonSize };
  const Button: React.FC<ButtonProps>; // web
  ```
- Consumes: `../../tokens` (native colors).

**Steps**

- [ ] Write failing test `Button.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { resolveButtonState } from "./Button.logic";

  describe("resolveButtonState", () => {
    it("defaults to primary/md and interactive", () => {
      const s = resolveButtonState({ label: "Save" });
      expect(s).toEqual({ isInteractive: true, variant: "primary", size: "md" });
    });
    it("is non-interactive when disabled", () => {
      expect(resolveButtonState({ label: "x", disabled: true }).isInteractive).toBe(false);
    });
    it("is non-interactive when loading", () => {
      expect(resolveButtonState({ label: "x", loading: true }).isInteractive).toBe(false);
    });
    it("passes through variant and size", () => {
      const s = resolveButtonState({ label: "x", variant: "danger", size: "sm" });
      expect(s.variant).toBe("danger");
      expect(s.size).toBe("sm");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Button`. Expect FAIL (module missing).
- [ ] Implement `Button.logic.ts`:
  ```ts
  export type ButtonVariant = "primary" | "secondary" | "success" | "danger";
  export type ButtonSize = "md" | "sm";

  export interface ButtonProps {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    onPress?: () => void;
  }

  export function resolveButtonState(props: ButtonProps): {
    isInteractive: boolean;
    variant: ButtonVariant;
    size: ButtonSize;
  } {
    return {
      isInteractive: !props.disabled && !props.loading,
      variant: props.variant ?? "primary",
      size: props.size ?? "md"
    };
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Button`. Expect logic test PASS.
- [ ] Write failing test `Button.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Button } from "./Button.web";

  describe("Button (web)", () => {
    it("renders the label", () => {
      render(<Button label="Aprovar" />);
      expect(screen.getByRole("button", { name: "Aprovar" })).toBeInTheDocument();
    });
    it("exposes variant and size via data attributes", () => {
      render(<Button label="x" variant="danger" size="sm" />);
      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("data-variant", "danger");
      expect(btn).toHaveAttribute("data-size", "sm");
    });
    it("calls onPress when clicked", async () => {
      const onPress = vi.fn();
      render(<Button label="Go" onPress={onPress} />);
      await userEvent.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledOnce();
    });
    it("does not call onPress when disabled", async () => {
      const onPress = vi.fn();
      render(<Button label="Go" onPress={onPress} disabled />);
      await userEvent.click(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });
    it("shows a loading indicator and disables when loading", () => {
      render(<Button label="Go" loading />);
      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-busy", "true");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Button`. Expect web test FAIL.
- [ ] Implement `Button.module.css`:
  ```css
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: var(--font-body-size);
    padding: var(--space-sm) var(--space-lg);
  }
  .sizeSm { padding: var(--space-xs) var(--space-md); font-size: var(--font-small-size); }
  .primary { background: var(--color-primary); color: var(--color-neutral-white); }
  .secondary { background: var(--color-neutral-50); color: var(--color-dark); border: 1px solid var(--color-neutral-300); }
  .success { background: var(--color-success); color: var(--color-neutral-white); }
  .danger { background: var(--color-error); color: var(--color-neutral-white); }
  .button:disabled { opacity: 0.5; cursor: not-allowed; }
  .spinner { width: 14px; height: 14px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; }
  ```
- [ ] Implement `Button.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { resolveButtonState, type ButtonProps } from "./Button.logic";
  import styles from "./Button.module.css";

  const variantClass: Record<string, string> = {
    primary: styles.primary,
    secondary: styles.secondary,
    success: styles.success,
    danger: styles.danger
  };

  export const Button: FC<ButtonProps> = (props) => {
    const { isInteractive, variant, size } = resolveButtonState(props);
    const className = [
      styles.button,
      variantClass[variant],
      size === "sm" ? styles.sizeSm : ""
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        type="button"
        className={className}
        data-variant={variant}
        data-size={size}
        disabled={!isInteractive}
        aria-busy={props.loading ? "true" : undefined}
        onClick={isInteractive ? props.onPress : undefined}
      >
        {props.loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {props.label}
      </button>
    );
  };
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Button`. Expect ALL Button tests PASS.
- [ ] Implement `Button.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { resolveButtonState, type ButtonProps, type ButtonVariant } from "./Button.logic";

  const bg: Record<ButtonVariant, string> = {
    primary: colors.primary,
    secondary: colors.neutral50,
    success: colors.success,
    danger: colors.error
  };

  const styles = StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      borderRadius: 8,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg
    },
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
    label: { color: colors.neutralWhite, fontWeight: "600", fontSize: 16 },
    secondaryLabel: { color: colors.dark },
    disabled: { opacity: 0.5 }
  });

  export const Button: FC<ButtonProps> = (props) => {
    const { isInteractive, variant, size } = resolveButtonState(props);
    return (
      <Pressable
        accessibilityRole="button"
        disabled={!isInteractive}
        onPress={isInteractive ? props.onPress : undefined}
        style={[
          styles.base,
          { backgroundColor: bg[variant] },
          size === "sm" ? styles.sm : null,
          !isInteractive ? styles.disabled : null
        ]}
      >
        {props.loading ? <ActivityIndicator color={colors.neutralWhite} /> : null}
        <Text style={[styles.label, variant === "secondary" ? styles.secondaryLabel : null]}>
          {props.label}
        </Text>
      </Pressable>
    );
  };
  ```
- [ ] Implement `Button.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { Button } from "./Button.web";

  const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    args: { label: "Aprovar" }
  };
  export default meta;
  type Story = StoryObj<typeof Button>;

  export const Primary: Story = { args: { variant: "primary" } };
  export const Secondary: Story = { args: { variant: "secondary" } };
  export const Success: Story = { args: { variant: "success", label: "Aprovar" } };
  export const Danger: Story = { args: { variant: "danger", label: "Reprovar" } };
  export const Small: Story = { args: { size: "sm" } };
  export const Disabled: Story = { args: { disabled: true } };
  export const Loading: Story = { args: { loading: true } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await expect(canvas.getByRole("button")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { Button } from "./Button.web";
  export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.logic";
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Button` and `pnpm --filter @vistoria/ui exec tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add Button atom (variants, sizes, loading, web+native)`

---

## Task 7 — Atom: Input `[complexa]`

Multi-file with state-dependent rendering (error message) and multiple input types.

**Files**
- Create: `packages/ui/src/atoms/Input/Input.logic.ts`
- Test: `packages/ui/src/atoms/Input/Input.logic.test.ts`
- Create: `packages/ui/src/atoms/Input/Input.web.tsx`
- Test: `packages/ui/src/atoms/Input/Input.web.test.tsx`
- Create: `packages/ui/src/atoms/Input/Input.native.tsx`
- Create: `packages/ui/src/atoms/Input/Input.module.css`
- Create: `packages/ui/src/atoms/Input/Input.stories.tsx`
- Create: `packages/ui/src/atoms/Input/index.ts`

**Interfaces**
- Produces:
  ```ts
  type InputType = "text" | "select" | "search" | "datepicker";
  type InputState = "default" | "filled" | "error";
  interface InputProps {
    type?: InputType; value?: string; placeholder?: string;
    errorMessage?: string; options?: { label: string; value: string }[];
    onChangeText?: (v: string) => void; label?: string;
  }
  function resolveInputState(props: InputProps): InputState;
  ```
- Consumes: `../../tokens` (native).

**Steps**

- [ ] Write failing test `Input.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { resolveInputState } from "./Input.logic";

  describe("resolveInputState", () => {
    it("is error when errorMessage present", () => {
      expect(resolveInputState({ errorMessage: "Obrigatório" })).toBe("error");
    });
    it("is filled when value is non-empty and no error", () => {
      expect(resolveInputState({ value: "ABC1234" })).toBe("filled");
    });
    it("is default when empty and no error", () => {
      expect(resolveInputState({ value: "" })).toBe("default");
      expect(resolveInputState({})).toBe("default");
    });
    it("error wins over filled", () => {
      expect(resolveInputState({ value: "x", errorMessage: "bad" })).toBe("error");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Input`. Expect FAIL.
- [ ] Implement `Input.logic.ts`:
  ```ts
  export type InputType = "text" | "select" | "search" | "datepicker";
  export type InputState = "default" | "filled" | "error";

  export interface InputOption {
    label: string;
    value: string;
  }

  export interface InputProps {
    type?: InputType;
    value?: string;
    placeholder?: string;
    label?: string;
    errorMessage?: string;
    options?: InputOption[];
    onChangeText?: (value: string) => void;
  }

  export function resolveInputState(props: InputProps): InputState {
    if (props.errorMessage) return "error";
    if (props.value && props.value.length > 0) return "filled";
    return "default";
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Input`. Expect logic PASS.
- [ ] Write failing test `Input.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Input } from "./Input.web";

  describe("Input (web)", () => {
    it("renders a text field with placeholder", () => {
      render(<Input placeholder="Placa" />);
      expect(screen.getByPlaceholderText("Placa")).toBeInTheDocument();
    });
    it("renders a label when provided", () => {
      render(<Input label="Placa" value="ABC1D23" />);
      expect(screen.getByText("Placa")).toBeInTheDocument();
    });
    it("emits onChangeText on typing", async () => {
      const onChangeText = vi.fn();
      render(<Input onChangeText={onChangeText} />);
      await userEvent.type(screen.getByRole("textbox"), "A");
      expect(onChangeText).toHaveBeenCalledWith("A");
    });
    it("shows the error message and marks state error", () => {
      render(<Input errorMessage="Campo obrigatório" />);
      const field = screen.getByRole("textbox");
      expect(field).toHaveAttribute("data-state", "error");
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    });
    it("renders a select with options", () => {
      render(<Input type="select" options={[{ label: "Carro", value: "car" }]} />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Carro" })).toBeInTheDocument();
    });
    it("uses search input type for search", () => {
      render(<Input type="search" placeholder="Buscar" />);
      expect(screen.getByPlaceholderText("Buscar")).toHaveAttribute("type", "search");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Input`. Expect web FAIL.
- [ ] Implement `Input.module.css`:
  ```css
  .wrapper { display: flex; flex-direction: column; gap: var(--space-xs); }
  .label { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  .field {
    border: 1px solid var(--color-neutral-300);
    border-radius: 8px;
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-body-size);
    color: var(--color-dark);
    background: var(--color-neutral-white);
  }
  .field[data-state="filled"] { border-color: var(--color-neutral-600); }
  .field[data-state="error"] { border-color: var(--color-error); }
  .error { font-size: var(--font-small-size); color: var(--color-error); }
  ```
- [ ] Implement `Input.web.tsx`:
  ```tsx
  import type { FC, ChangeEvent } from "react";
  import { resolveInputState, type InputProps } from "./Input.logic";
  import styles from "./Input.module.css";

  export const Input: FC<InputProps> = (props) => {
    const state = resolveInputState(props);
    const isError = state === "error";
    const handle = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => props.onChangeText?.(e.target.value);

    return (
      <label className={styles.wrapper}>
        {props.label ? <span className={styles.label}>{props.label}</span> : null}
        {props.type === "select" ? (
          <select
            className={styles.field}
            data-state={state}
            aria-invalid={isError || undefined}
            value={props.value}
            onChange={handle}
          >
            {(props.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={styles.field}
            data-state={state}
            aria-invalid={isError || undefined}
            type={
              props.type === "search"
                ? "search"
                : props.type === "datepicker"
                  ? "date"
                  : "text"
            }
            placeholder={props.placeholder}
            value={props.value}
            onChange={handle}
          />
        )}
        {props.errorMessage ? (
          <span className={styles.error}>{props.errorMessage}</span>
        ) : null}
      </label>
    );
  };
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Input`. Expect ALL PASS.
- [ ] Implement `Input.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, TextInput, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { resolveInputState, type InputProps } from "./Input.logic";

  const styles = StyleSheet.create({
    wrapper: { gap: spacing.xs },
    label: { fontSize: 12, color: colors.neutral600 },
    field: {
      borderWidth: 1,
      borderColor: colors.neutral300,
      borderRadius: 8,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: 16,
      color: colors.dark
    },
    error: { fontSize: 12, color: colors.error },
    errorBorder: { borderColor: colors.error }
  });

  export const Input: FC<InputProps> = (props) => {
    const state = resolveInputState(props);
    return (
      <View style={styles.wrapper}>
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
        <TextInput
          style={[styles.field, state === "error" ? styles.errorBorder : null]}
          placeholder={props.placeholder}
          value={props.value}
          onChangeText={props.onChangeText}
        />
        {props.errorMessage ? <Text style={styles.error}>{props.errorMessage}</Text> : null}
      </View>
    );
  };
  ```
- [ ] Implement `Input.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { Input } from "./Input.web";

  const meta: Meta<typeof Input> = {
    title: "Atoms/Input",
    component: Input,
    args: { placeholder: "Placa do veículo" }
  };
  export default meta;
  type Story = StoryObj<typeof Input>;

  export const Default: Story = {};
  export const Filled: Story = { args: { value: "ABC1D23", label: "Placa" } };
  export const Error: Story = { args: { errorMessage: "Placa inválida" } };
  export const Search: Story = { args: { type: "search", placeholder: "Buscar veículo" } };
  export const Select: Story = {
    args: { type: "select", options: [{ label: "Carro", value: "car" }, { label: "Moto", value: "moto" }] }
  };
  export const DatePicker: Story = { args: { type: "datepicker", label: "Data" } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      await expect(canvas.getByRole("textbox")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { Input } from "./Input.web";
  export type { InputProps, InputType, InputState, InputOption } from "./Input.logic";
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Input` and `pnpm --filter @vistoria/ui exec tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add Input atom (text/select/search/datepicker, error state, web+native)`

---

## Task 8 — Atom: Badge `[atômica]`

Single concern (status pill driven by a variant→config map). Logic is a pure lookup.

**Files**
- Create: `packages/ui/src/atoms/Badge/Badge.logic.ts`
- Test: `packages/ui/src/atoms/Badge/Badge.logic.test.ts`
- Create: `packages/ui/src/atoms/Badge/Badge.web.tsx`
- Test: `packages/ui/src/atoms/Badge/Badge.web.test.tsx`
- Create: `packages/ui/src/atoms/Badge/Badge.native.tsx`
- Create: `packages/ui/src/atoms/Badge/Badge.module.css`
- Create: `packages/ui/src/atoms/Badge/Badge.stories.tsx`
- Create: `packages/ui/src/atoms/Badge/index.ts`

**Interfaces**
- Produces:
  ```ts
  type BadgeVariant = "concluido" | "em-andamento" | "pendente" | "reprovado" | "agendado";
  interface BadgeConfig { label: string; icon: string; color: string; bg: string; }
  const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig>;
  interface BadgeProps { variant: BadgeVariant; }
  ```
- Consumes: `../../tokens` (colors).

**Steps**

- [ ] Write failing test `Badge.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { BADGE_CONFIG } from "./Badge.logic";

  describe("BADGE_CONFIG", () => {
    it("covers all five status variants", () => {
      expect(Object.keys(BADGE_CONFIG).sort()).toEqual(
        ["agendado", "concluido", "em-andamento", "pendente", "reprovado"]
      );
    });
    it("maps concluido to success color and label", () => {
      expect(BADGE_CONFIG.concluido.label).toBe("Concluído");
      expect(BADGE_CONFIG.concluido.color).toBe("#22C55E");
    });
    it("maps reprovado to error color", () => {
      expect(BADGE_CONFIG.reprovado.color).toBe("#EF4444");
      expect(BADGE_CONFIG.reprovado.label).toBe("Reprovado");
    });
    it("maps pendente to warning color", () => {
      expect(BADGE_CONFIG.pendente.color).toBe("#F59E0B");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Badge`. Expect FAIL.
- [ ] Implement `Badge.logic.ts`:
  ```ts
  import { colors } from "../../tokens";

  export type BadgeVariant =
    | "concluido"
    | "em-andamento"
    | "pendente"
    | "reprovado"
    | "agendado";

  export interface BadgeConfig {
    label: string;
    icon: string;
    color: string;
    bg: string;
  }

  export const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
    concluido: { label: "Concluído", icon: "✓", color: colors.success, bg: "#DCFCE7" },
    "em-andamento": { label: "Em andamento", icon: "•", color: colors.primary, bg: "#DBEAFE" },
    pendente: { label: "Pendente", icon: "!", color: colors.warning, bg: "#FEF3C7" },
    reprovado: { label: "Reprovado", icon: "✕", color: colors.error, bg: "#FEE2E2" },
    agendado: { label: "Agendado", icon: "◷", color: colors.neutral600, bg: "#F1F5F9" }
  };

  export interface BadgeProps {
    variant: BadgeVariant;
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Badge`. Expect logic PASS.
- [ ] Write failing test `Badge.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { Badge } from "./Badge.web";

  describe("Badge (web)", () => {
    it("renders the variant label", () => {
      render(<Badge variant="concluido" />);
      expect(screen.getByText("Concluído")).toBeInTheDocument();
    });
    it("exposes the variant via data attribute", () => {
      render(<Badge variant="reprovado" />);
      expect(screen.getByText("Reprovado").closest("[data-variant]"))
        .toHaveAttribute("data-variant", "reprovado");
    });
    it("renders pendente label", () => {
      render(<Badge variant="pendente" />);
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Badge`. Expect web FAIL.
- [ ] Implement `Badge.module.css`:
  ```css
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    border-radius: 9999px;
    padding: 2px var(--space-sm);
    font-size: var(--font-small-size);
    font-weight: 600;
  }
  .icon { font-size: var(--font-small-size); }
  ```
- [ ] Implement `Badge.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { BADGE_CONFIG, type BadgeProps } from "./Badge.logic";
  import styles from "./Badge.module.css";

  export const Badge: FC<BadgeProps> = ({ variant }) => {
    const cfg = BADGE_CONFIG[variant];
    return (
      <span
        className={styles.badge}
        data-variant={variant}
        style={{ color: cfg.color, backgroundColor: cfg.bg }}
      >
        <span className={styles.icon} aria-hidden="true">{cfg.icon}</span>
        {cfg.label}
      </span>
    );
  };
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Badge`. Expect ALL PASS.
- [ ] Implement `Badge.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, StyleSheet } from "react-native";
  import { spacing } from "../../tokens";
  import { BADGE_CONFIG, type BadgeProps } from "./Badge.logic";

  const styles = StyleSheet.create({
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      borderRadius: 9999,
      paddingVertical: 2,
      paddingHorizontal: spacing.sm,
      alignSelf: "flex-start"
    },
    label: { fontSize: 12, fontWeight: "600" }
  });

  export const Badge: FC<BadgeProps> = ({ variant }) => {
    const cfg = BADGE_CONFIG[variant];
    return (
      <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.label, { color: cfg.color }]}>{cfg.icon}</Text>
        <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    );
  };
  ```
- [ ] Implement `Badge.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { Badge } from "./Badge.web";

  const meta: Meta<typeof Badge> = { title: "Atoms/Badge", component: Badge };
  export default meta;
  type Story = StoryObj<typeof Badge>;

  export const Concluido: Story = { args: { variant: "concluido" } };
  export const EmAndamento: Story = { args: { variant: "em-andamento" } };
  export const Pendente: Story = { args: { variant: "pendente" } };
  export const Reprovado: Story = { args: { variant: "reprovado" } };
  export const Agendado: Story = { args: { variant: "agendado" } };

  export const Smoke: Story = {
    args: { variant: "concluido" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Concluído")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { Badge } from "./Badge.web";
  export { BADGE_CONFIG } from "./Badge.logic";
  export type { BadgeProps, BadgeVariant, BadgeConfig } from "./Badge.logic";
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/Badge` and `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add Badge atom (5 status variants, web+native)`

---

## Task 9 — Atom: ProgressBar `[atômica]`

Single concern: value→color thresholds + clamped fill.

**Files**
- Create: `packages/ui/src/atoms/ProgressBar/ProgressBar.logic.ts`
- Test: `packages/ui/src/atoms/ProgressBar/ProgressBar.logic.test.ts`
- Create: `packages/ui/src/atoms/ProgressBar/ProgressBar.web.tsx`
- Test: `packages/ui/src/atoms/ProgressBar/ProgressBar.web.test.tsx`
- Create: `packages/ui/src/atoms/ProgressBar/ProgressBar.native.tsx`
- Create: `packages/ui/src/atoms/ProgressBar/ProgressBar.module.css`
- Create: `packages/ui/src/atoms/ProgressBar/ProgressBar.stories.tsx`
- Create: `packages/ui/src/atoms/ProgressBar/index.ts`

**Interfaces**
- Produces:
  ```ts
  interface ProgressBarProps { value: number; }
  function resolveProgress(value: number): { pct: number; color: string };
  ```
- Consumes: `../../tokens` (colors).

**Steps**

- [ ] Write failing test `ProgressBar.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { resolveProgress } from "./ProgressBar.logic";

  describe("resolveProgress", () => {
    it("uses warning for 0-49", () => {
      expect(resolveProgress(0).color).toBe("#F59E0B");
      expect(resolveProgress(49).color).toBe("#F59E0B");
    });
    it("uses primary for 50-99", () => {
      expect(resolveProgress(50).color).toBe("#2563EB");
      expect(resolveProgress(99).color).toBe("#2563EB");
    });
    it("uses success at 100", () => {
      expect(resolveProgress(100).color).toBe("#22C55E");
    });
    it("clamps below 0 and above 100", () => {
      expect(resolveProgress(-10).pct).toBe(0);
      expect(resolveProgress(150).pct).toBe(100);
    });
    it("returns the value as pct within range", () => {
      expect(resolveProgress(73).pct).toBe(73);
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/ProgressBar`. Expect FAIL.
- [ ] Implement `ProgressBar.logic.ts`:
  ```ts
  import { colors } from "../../tokens";

  export interface ProgressBarProps {
    value: number;
  }

  export function resolveProgress(value: number): { pct: number; color: string } {
    const pct = Math.max(0, Math.min(100, Math.round(value)));
    let color: string;
    if (pct >= 100) color = colors.success;
    else if (pct >= 50) color = colors.primary;
    else color = colors.warning;
    return { pct, color };
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/ProgressBar`. Expect logic PASS.
- [ ] Write failing test `ProgressBar.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { ProgressBar } from "./ProgressBar.web";

  describe("ProgressBar (web)", () => {
    it("exposes value via progressbar role and aria", () => {
      render(<ProgressBar value={73} />);
      const bar = screen.getByRole("progressbar");
      expect(bar).toHaveAttribute("aria-valuenow", "73");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });
    it("clamps over-range values in aria", () => {
      render(<ProgressBar value={150} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/ProgressBar`. Expect web FAIL.
- [ ] Implement `ProgressBar.module.css`:
  ```css
  .track {
    width: 100%;
    height: 8px;
    background: var(--color-neutral-300);
    border-radius: 9999px;
    overflow: hidden;
  }
  .fill { height: 100%; border-radius: 9999px; transition: width 200ms ease; }
  ```
- [ ] Implement `ProgressBar.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { resolveProgress, type ProgressBarProps } from "./ProgressBar.logic";
  import styles from "./ProgressBar.module.css";

  export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
    const { pct, color } = resolveProgress(value);
    return (
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.fill} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    );
  };
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/ProgressBar`. Expect ALL PASS.
- [ ] Implement `ProgressBar.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, StyleSheet } from "react-native";
  import { colors } from "../../tokens";
  import { resolveProgress, type ProgressBarProps } from "./ProgressBar.logic";

  const styles = StyleSheet.create({
    track: { width: "100%", height: 8, backgroundColor: colors.neutral300, borderRadius: 9999, overflow: "hidden" },
    fill: { height: "100%", borderRadius: 9999 }
  });

  export const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
    const { pct, color } = resolveProgress(value);
    return (
      <View style={styles.track} accessibilityRole="progressbar">
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    );
  };
  ```
- [ ] Implement `ProgressBar.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { ProgressBar } from "./ProgressBar.web";

  const meta: Meta<typeof ProgressBar> = { title: "Atoms/ProgressBar", component: ProgressBar };
  export default meta;
  type Story = StoryObj<typeof ProgressBar>;

  export const Low: Story = { args: { value: 20 } };
  export const Mid: Story = { args: { value: 65 } };
  export const Complete: Story = { args: { value: 100 } };

  export const Smoke: Story = {
    args: { value: 50 },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByRole("progressbar")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { ProgressBar } from "./ProgressBar.web";
  export { resolveProgress } from "./ProgressBar.logic";
  export type { ProgressBarProps } from "./ProgressBar.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add ProgressBar atom (threshold colors, clamped, web+native)`

---

## Task 10 — Atom: IconButton `[atômica]`

Single concern: icon glyph lookup + ghost variant.

**Files**
- Create: `packages/ui/src/atoms/IconButton/IconButton.logic.ts`
- Test: `packages/ui/src/atoms/IconButton/IconButton.logic.test.ts`
- Create: `packages/ui/src/atoms/IconButton/IconButton.web.tsx`
- Test: `packages/ui/src/atoms/IconButton/IconButton.web.test.tsx`
- Create: `packages/ui/src/atoms/IconButton/IconButton.native.tsx`
- Create: `packages/ui/src/atoms/IconButton/IconButton.module.css`
- Create: `packages/ui/src/atoms/IconButton/IconButton.stories.tsx`
- Create: `packages/ui/src/atoms/IconButton/index.ts`

**Interfaces**
- Produces:
  ```ts
  type IconName = "camera" | "search" | "plus" | "edit" | "trash" | "arrow-right";
  const ICON_GLYPH: Record<IconName, string>;
  interface IconButtonProps { icon: IconName; ghost?: boolean; ariaLabel: string; onPress?: () => void; }
  ```
- Consumes: nothing.

**Steps**

- [ ] Write failing test `IconButton.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { ICON_GLYPH } from "./IconButton.logic";

  describe("ICON_GLYPH", () => {
    it("covers all six icon names", () => {
      expect(Object.keys(ICON_GLYPH).sort()).toEqual(
        ["arrow-right", "camera", "edit", "plus", "search", "trash"]
      );
    });
    it("each glyph is a non-empty string", () => {
      for (const g of Object.values(ICON_GLYPH)) {
        expect(typeof g).toBe("string");
        expect(g.length).toBeGreaterThan(0);
      }
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/atoms/IconButton`. Expect FAIL.
- [ ] Implement `IconButton.logic.ts`:
  ```ts
  export type IconName = "camera" | "search" | "plus" | "edit" | "trash" | "arrow-right";

  export const ICON_GLYPH: Record<IconName, string> = {
    camera: "📷",
    search: "🔍",
    plus: "+",
    edit: "✎",
    trash: "🗑",
    "arrow-right": "→"
  };

  export interface IconButtonProps {
    icon: IconName;
    ariaLabel: string;
    ghost?: boolean;
    onPress?: () => void;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `IconButton.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { IconButton } from "./IconButton.web";

  describe("IconButton (web)", () => {
    it("uses ariaLabel as accessible name", () => {
      render(<IconButton icon="camera" ariaLabel="Tirar foto" />);
      expect(screen.getByRole("button", { name: "Tirar foto" })).toBeInTheDocument();
    });
    it("marks ghost via data attribute", () => {
      render(<IconButton icon="edit" ariaLabel="Editar" ghost />);
      expect(screen.getByRole("button")).toHaveAttribute("data-ghost", "true");
    });
    it("calls onPress on click", async () => {
      const onPress = vi.fn();
      render(<IconButton icon="plus" ariaLabel="Adicionar" onPress={onPress} />);
      await userEvent.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledOnce();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `IconButton.module.css`:
  ```css
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: var(--color-neutral-50);
    color: var(--color-dark);
    font-size: var(--font-body-size);
  }
  .button[data-ghost="true"] { background: transparent; }
  ```
- [ ] Implement `IconButton.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { ICON_GLYPH, type IconButtonProps } from "./IconButton.logic";
  import styles from "./IconButton.module.css";

  export const IconButton: FC<IconButtonProps> = ({ icon, ariaLabel, ghost, onPress }) => (
    <button
      type="button"
      className={styles.button}
      data-ghost={ghost ? "true" : "false"}
      aria-label={ariaLabel}
      onClick={onPress}
    >
      <span aria-hidden="true">{ICON_GLYPH[icon]}</span>
    </button>
  );
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `IconButton.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { Pressable, Text, StyleSheet } from "react-native";
  import { colors } from "../../tokens";
  import { ICON_GLYPH, type IconButtonProps } from "./IconButton.logic";

  const styles = StyleSheet.create({
    button: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.neutral50
    },
    ghost: { backgroundColor: "transparent" },
    glyph: { fontSize: 16, color: colors.dark }
  });

  export const IconButton: FC<IconButtonProps> = ({ icon, ariaLabel, ghost, onPress }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      onPress={onPress}
      style={[styles.button, ghost ? styles.ghost : null]}
    >
      <Text style={styles.glyph}>{ICON_GLYPH[icon]}</Text>
    </Pressable>
  );
  ```
- [ ] Implement `IconButton.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { IconButton } from "./IconButton.web";

  const meta: Meta<typeof IconButton> = {
    title: "Atoms/IconButton",
    component: IconButton,
    args: { ariaLabel: "Ação" }
  };
  export default meta;
  type Story = StoryObj<typeof IconButton>;

  export const Camera: Story = { args: { icon: "camera", ariaLabel: "Tirar foto" } };
  export const Search: Story = { args: { icon: "search", ariaLabel: "Buscar" } };
  export const Plus: Story = { args: { icon: "plus", ariaLabel: "Adicionar" } };
  export const Edit: Story = { args: { icon: "edit", ariaLabel: "Editar" } };
  export const Trash: Story = { args: { icon: "trash", ariaLabel: "Excluir" } };
  export const ArrowRight: Story = { args: { icon: "arrow-right", ariaLabel: "Avançar" } };
  export const Ghost: Story = { args: { icon: "edit", ariaLabel: "Editar", ghost: true } };

  export const Smoke: Story = {
    args: { icon: "camera", ariaLabel: "Tirar foto" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByRole("button")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { IconButton } from "./IconButton.web";
  export { ICON_GLYPH } from "./IconButton.logic";
  export type { IconButtonProps, IconName } from "./IconButton.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add IconButton atom (6 icons, ghost variant, web+native)`

---

## Task 11 — Molecule: VehicleCard `[complexa]`

Composes Badge + ProgressBar; multi-file with several data props.

**Files**
- Create: `packages/ui/src/molecules/VehicleCard/VehicleCard.logic.ts`
- Test: `packages/ui/src/molecules/VehicleCard/VehicleCard.logic.test.ts`
- Create: `packages/ui/src/molecules/VehicleCard/VehicleCard.web.tsx`
- Test: `packages/ui/src/molecules/VehicleCard/VehicleCard.web.test.tsx`
- Create: `packages/ui/src/molecules/VehicleCard/VehicleCard.native.tsx`
- Create: `packages/ui/src/molecules/VehicleCard/VehicleCard.module.css`
- Create: `packages/ui/src/molecules/VehicleCard/VehicleCard.stories.tsx`
- Create: `packages/ui/src/molecules/VehicleCard/index.ts`

**Interfaces**
- Produces:
  ```ts
  interface VehicleCardProps {
    plate: string; model: string; year: number; km: number;
    status: BadgeVariant; progress: number; imageUrl?: string;
  }
  function formatKm(km: number): string; // "45.000 km"
  ```
- Consumes: `../../atoms/Badge`, `../../atoms/ProgressBar` (Badge `BadgeVariant`).

**Steps**

- [ ] Write failing test `VehicleCard.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { formatKm } from "./VehicleCard.logic";

  describe("formatKm", () => {
    it("groups thousands with a dot and appends km", () => {
      expect(formatKm(45000)).toBe("45.000 km");
    });
    it("handles small values", () => {
      expect(formatKm(0)).toBe("0 km");
      expect(formatKm(999)).toBe("999 km");
    });
    it("handles millions", () => {
      expect(formatKm(1234567)).toBe("1.234.567 km");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/VehicleCard`. Expect FAIL.
- [ ] Implement `VehicleCard.logic.ts`:
  ```ts
  import type { BadgeVariant } from "../../atoms/Badge";

  export interface VehicleCardProps {
    plate: string;
    model: string;
    year: number;
    km: number;
    status: BadgeVariant;
    progress: number;
    imageUrl?: string;
  }

  export function formatKm(km: number): string {
    return `${km.toLocaleString("pt-BR")} km`;
  }
  ```
- [ ] Run vitest. Expect logic PASS. (Note: Node's `toLocaleString("pt-BR")` uses `.` as the thousands separator; confirm ICU is present — vitest runs on full Node, so it is.)
- [ ] Write failing test `VehicleCard.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { VehicleCard } from "./VehicleCard.web";

  describe("VehicleCard (web)", () => {
    const props = {
      plate: "ABC1D23", model: "Onix 1.0", year: 2022,
      km: 45000, status: "em-andamento" as const, progress: 65
    };
    it("renders plate, model and year", () => {
      render(<VehicleCard {...props} />);
      expect(screen.getByText("ABC1D23")).toBeInTheDocument();
      expect(screen.getByText("Onix 1.0")).toBeInTheDocument();
      expect(screen.getByText(/2022/)).toBeInTheDocument();
    });
    it("renders formatted km", () => {
      render(<VehicleCard {...props} />);
      expect(screen.getByText("45.000 km")).toBeInTheDocument();
    });
    it("renders the status badge", () => {
      render(<VehicleCard {...props} />);
      expect(screen.getByText("Em andamento")).toBeInTheDocument();
    });
    it("renders a progressbar reflecting progress", () => {
      render(<VehicleCard {...props} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "65");
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `VehicleCard.module.css`:
  ```css
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    border: 1px solid var(--color-neutral-300);
    border-radius: 12px;
    padding: var(--space-md);
    background: var(--color-neutral-white);
    width: 280px;
  }
  .image { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; background: var(--color-neutral-50); }
  .header { display: flex; justify-content: space-between; align-items: center; }
  .plate { font-size: var(--font-h3-size); font-weight: 600; color: var(--color-dark); }
  .model { font-size: var(--font-body-size); color: var(--color-dark); }
  .meta { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  ```
- [ ] Implement `VehicleCard.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { Badge } from "../../atoms/Badge";
  import { ProgressBar } from "../../atoms/ProgressBar";
  import { formatKm, type VehicleCardProps } from "./VehicleCard.logic";
  import styles from "./VehicleCard.module.css";

  export const VehicleCard: FC<VehicleCardProps> = (props) => (
    <article className={styles.card}>
      {props.imageUrl ? (
        <img className={styles.image} src={props.imageUrl} alt={`Veículo ${props.plate}`} />
      ) : (
        <div className={styles.image} role="img" aria-label={`Veículo ${props.plate}`} />
      )}
      <div className={styles.header}>
        <span className={styles.plate}>{props.plate}</span>
        <Badge variant={props.status} />
      </div>
      <span className={styles.model}>{props.model}</span>
      <span className={styles.meta}>
        {props.year} • {formatKm(props.km)}
      </span>
      <ProgressBar value={props.progress} />
    </article>
  );
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `VehicleCard.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, Image, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { Badge } from "../../atoms/Badge/Badge.native";
  import { ProgressBar } from "../../atoms/ProgressBar/ProgressBar.native";
  import { formatKm, type VehicleCardProps } from "./VehicleCard.logic";

  const styles = StyleSheet.create({
    card: { gap: spacing.sm, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 12, padding: spacing.md, backgroundColor: colors.neutralWhite },
    image: { width: "100%", height: 140, borderRadius: 8, backgroundColor: colors.neutral50 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    plate: { fontSize: 24, fontWeight: "600", color: colors.dark },
    model: { fontSize: 16, color: colors.dark },
    meta: { fontSize: 12, color: colors.neutral600 }
  });

  export const VehicleCard: FC<VehicleCardProps> = (props) => (
    <View style={styles.card}>
      {props.imageUrl ? <Image style={styles.image} source={{ uri: props.imageUrl }} /> : <View style={styles.image} />}
      <View style={styles.header}>
        <Text style={styles.plate}>{props.plate}</Text>
        <Badge variant={props.status} />
      </View>
      <Text style={styles.model}>{props.model}</Text>
      <Text style={styles.meta}>{props.year} • {formatKm(props.km)}</Text>
      <ProgressBar value={props.progress} />
    </View>
  );
  ```
- [ ] Implement `VehicleCard.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { VehicleCard } from "./VehicleCard.web";

  const meta: Meta<typeof VehicleCard> = {
    title: "Molecules/VehicleCard",
    component: VehicleCard,
    args: { plate: "ABC1D23", model: "Onix 1.0", year: 2022, km: 45000, status: "em-andamento", progress: 65 }
  };
  export default meta;
  type Story = StoryObj<typeof VehicleCard>;

  export const InProgress: Story = {};
  export const Completed: Story = { args: { status: "concluido", progress: 100 } };
  export const Rejected: Story = { args: { status: "reprovado", progress: 40 } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("ABC1D23")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { VehicleCard } from "./VehicleCard.web";
  export { formatKm } from "./VehicleCard.logic";
  export type { VehicleCardProps } from "./VehicleCard.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add VehicleCard molecule (Badge+ProgressBar composition, web+native)`

---

## Task 12 — Molecule: StatCard `[atômica]`

Single concern: big number + signed change indicator.

**Files**
- Create: `packages/ui/src/molecules/StatCard/StatCard.logic.ts`
- Test: `packages/ui/src/molecules/StatCard/StatCard.logic.test.ts`
- Create: `packages/ui/src/molecules/StatCard/StatCard.web.tsx`
- Test: `packages/ui/src/molecules/StatCard/StatCard.web.test.tsx`
- Create: `packages/ui/src/molecules/StatCard/StatCard.native.tsx`
- Create: `packages/ui/src/molecules/StatCard/StatCard.module.css`
- Create: `packages/ui/src/molecules/StatCard/StatCard.stories.tsx`
- Create: `packages/ui/src/molecules/StatCard/index.ts`

**Interfaces**
- Produces:
  ```ts
  type ChangeDirection = "up" | "down";
  interface StatCardProps { value: string; label: string; change?: string; changeDirection?: ChangeDirection; }
  function resolveChange(p: StatCardProps): { arrow: string; color: string } | null;
  ```
- Consumes: `../../tokens` (colors).

**Steps**

- [ ] Write failing test `StatCard.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { resolveChange } from "./StatCard.logic";

  describe("resolveChange", () => {
    it("returns null when no change", () => {
      expect(resolveChange({ value: "120", label: "Vistorias" })).toBeNull();
    });
    it("up uses success and an up arrow", () => {
      const r = resolveChange({ value: "1", label: "x", change: "12%", changeDirection: "up" });
      expect(r).toEqual({ arrow: "↑", color: "#22C55E" });
    });
    it("down uses error and a down arrow", () => {
      const r = resolveChange({ value: "1", label: "x", change: "3%", changeDirection: "down" });
      expect(r).toEqual({ arrow: "↓", color: "#EF4444" });
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/StatCard`. Expect FAIL.
- [ ] Implement `StatCard.logic.ts`:
  ```ts
  import { colors } from "../../tokens";

  export type ChangeDirection = "up" | "down";

  export interface StatCardProps {
    value: string;
    label: string;
    change?: string;
    changeDirection?: ChangeDirection;
  }

  export function resolveChange(p: StatCardProps): { arrow: string; color: string } | null {
    if (!p.change || !p.changeDirection) return null;
    return p.changeDirection === "up"
      ? { arrow: "↑", color: colors.success }
      : { arrow: "↓", color: colors.error };
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `StatCard.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { StatCard } from "./StatCard.web";

  describe("StatCard (web)", () => {
    it("renders value and label", () => {
      render(<StatCard value="120" label="Vistorias hoje" />);
      expect(screen.getByText("120")).toBeInTheDocument();
      expect(screen.getByText("Vistorias hoje")).toBeInTheDocument();
    });
    it("renders an upward change with arrow", () => {
      render(<StatCard value="120" label="x" change="12%" changeDirection="up" />);
      expect(screen.getByText(/↑/)).toBeInTheDocument();
      expect(screen.getByText(/12%/)).toBeInTheDocument();
    });
    it("omits change block when not provided", () => {
      render(<StatCard value="120" label="x" />);
      expect(screen.queryByText(/↑|↓/)).not.toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `StatCard.module.css`:
  ```css
  .card { display: flex; flex-direction: column; gap: var(--space-xs); border: 1px solid var(--color-neutral-300); border-radius: 12px; padding: var(--space-md); background: var(--color-neutral-white); min-width: 160px; }
  .value { font-size: var(--font-h1-size); font-weight: 700; color: var(--color-dark); }
  .label { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  .change { font-size: var(--font-small-size); font-weight: 600; }
  ```
- [ ] Implement `StatCard.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { resolveChange, type StatCardProps } from "./StatCard.logic";
  import styles from "./StatCard.module.css";

  export const StatCard: FC<StatCardProps> = (props) => {
    const change = resolveChange(props);
    return (
      <div className={styles.card}>
        <span className={styles.value}>{props.value}</span>
        <span className={styles.label}>{props.label}</span>
        {change ? (
          <span className={styles.change} style={{ color: change.color }}>
            {change.arrow} {props.change}
          </span>
        ) : null}
      </div>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `StatCard.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { resolveChange, type StatCardProps } from "./StatCard.logic";

  const styles = StyleSheet.create({
    card: { gap: spacing.xs, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 12, padding: spacing.md, backgroundColor: colors.neutralWhite },
    value: { fontSize: 40, fontWeight: "700", color: colors.dark },
    label: { fontSize: 12, color: colors.neutral600 },
    change: { fontSize: 12, fontWeight: "600" }
  });

  export const StatCard: FC<StatCardProps> = (props) => {
    const change = resolveChange(props);
    return (
      <View style={styles.card}>
        <Text style={styles.value}>{props.value}</Text>
        <Text style={styles.label}>{props.label}</Text>
        {change ? <Text style={[styles.change, { color: change.color }]}>{change.arrow} {props.change}</Text> : null}
      </View>
    );
  };
  ```
- [ ] Implement `StatCard.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { StatCard } from "./StatCard.web";

  const meta: Meta<typeof StatCard> = {
    title: "Molecules/StatCard",
    component: StatCard,
    args: { value: "120", label: "Vistorias hoje" }
  };
  export default meta;
  type Story = StoryObj<typeof StatCard>;

  export const Plain: Story = {};
  export const Up: Story = { args: { change: "12%", changeDirection: "up" } };
  export const Down: Story = { args: { change: "3%", changeDirection: "down" } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("120")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { StatCard } from "./StatCard.web";
  export { resolveChange } from "./StatCard.logic";
  export type { StatCardProps, ChangeDirection } from "./StatCard.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add StatCard molecule (value, label, signed change, web+native)`

---

## Task 13 — Molecule: ChecklistItem `[atômica]`

Single concern: state→icon/color mapping with label + sublabel.

**Files**
- Create: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.logic.ts`
- Test: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.logic.test.ts`
- Create: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.web.tsx`
- Test: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.web.test.tsx`
- Create: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.native.tsx`
- Create: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.module.css`
- Create: `packages/ui/src/molecules/ChecklistItem/ChecklistItem.stories.tsx`
- Create: `packages/ui/src/molecules/ChecklistItem/index.ts`

**Interfaces**
- Produces:
  ```ts
  type ChecklistState = "conforme" | "pendente" | "nao-conforme";
  const CHECKLIST_CONFIG: Record<ChecklistState, { icon: string; color: string }>;
  interface ChecklistItemProps { state: ChecklistState; label: string; sublabel?: string; }
  ```
- Consumes: `../../tokens` (colors).

**Steps**

- [ ] Write failing test `ChecklistItem.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { CHECKLIST_CONFIG } from "./ChecklistItem.logic";

  describe("CHECKLIST_CONFIG", () => {
    it("covers the three states", () => {
      expect(Object.keys(CHECKLIST_CONFIG).sort()).toEqual(
        ["conforme", "nao-conforme", "pendente"]
      );
    });
    it("conforme is success with a check", () => {
      expect(CHECKLIST_CONFIG.conforme).toEqual({ icon: "✓", color: "#22C55E" });
    });
    it("nao-conforme is error", () => {
      expect(CHECKLIST_CONFIG["nao-conforme"].color).toBe("#EF4444");
    });
    it("pendente is warning with an empty marker", () => {
      expect(CHECKLIST_CONFIG.pendente.color).toBe("#F59E0B");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/ChecklistItem`. Expect FAIL.
- [ ] Implement `ChecklistItem.logic.ts`:
  ```ts
  import { colors } from "../../tokens";

  export type ChecklistState = "conforme" | "pendente" | "nao-conforme";

  export const CHECKLIST_CONFIG: Record<ChecklistState, { icon: string; color: string }> = {
    conforme: { icon: "✓", color: colors.success },
    pendente: { icon: "○", color: colors.warning },
    "nao-conforme": { icon: "!", color: colors.error }
  };

  export interface ChecklistItemProps {
    state: ChecklistState;
    label: string;
    sublabel?: string;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `ChecklistItem.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { ChecklistItem } from "./ChecklistItem.web";

  describe("ChecklistItem (web)", () => {
    it("renders label and sublabel", () => {
      render(<ChecklistItem state="conforme" label="Pneus" sublabel="Sem desgaste" />);
      expect(screen.getByText("Pneus")).toBeInTheDocument();
      expect(screen.getByText("Sem desgaste")).toBeInTheDocument();
    });
    it("exposes state via data attribute", () => {
      render(<ChecklistItem state="nao-conforme" label="Farol" />);
      expect(screen.getByText("Farol").closest("[data-state]"))
        .toHaveAttribute("data-state", "nao-conforme");
    });
    it("omits sublabel when absent", () => {
      render(<ChecklistItem state="pendente" label="Vidros" />);
      expect(screen.getByText("Vidros")).toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `ChecklistItem.module.css`:
  ```css
  .item { display: flex; align-items: flex-start; gap: var(--space-sm); padding: var(--space-sm) 0; border-bottom: 1px solid var(--color-neutral-300); }
  .icon { width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
  .text { display: flex; flex-direction: column; }
  .label { font-size: var(--font-body-size); color: var(--color-dark); }
  .sublabel { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  ```
- [ ] Implement `ChecklistItem.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { CHECKLIST_CONFIG, type ChecklistItemProps } from "./ChecklistItem.logic";
  import styles from "./ChecklistItem.module.css";

  export const ChecklistItem: FC<ChecklistItemProps> = ({ state, label, sublabel }) => {
    const cfg = CHECKLIST_CONFIG[state];
    return (
      <div className={styles.item} data-state={state}>
        <span className={styles.icon} style={{ color: cfg.color }} aria-hidden="true">
          {cfg.icon}
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{label}</span>
          {sublabel ? <span className={styles.sublabel}>{sublabel}</span> : null}
        </span>
      </div>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `ChecklistItem.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { CHECKLIST_CONFIG, type ChecklistItemProps } from "./ChecklistItem.logic";

  const styles = StyleSheet.create({
    item: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.neutral300 },
    icon: { width: 20, fontWeight: "700", textAlign: "center" },
    label: { fontSize: 16, color: colors.dark },
    sublabel: { fontSize: 12, color: colors.neutral600 }
  });

  export const ChecklistItem: FC<ChecklistItemProps> = ({ state, label, sublabel }) => {
    const cfg = CHECKLIST_CONFIG[state];
    return (
      <View style={styles.item}>
        <Text style={[styles.icon, { color: cfg.color }]}>{cfg.icon}</Text>
        <View>
          <Text style={styles.label}>{label}</Text>
          {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
        </View>
      </View>
    );
  };
  ```
- [ ] Implement `ChecklistItem.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { ChecklistItem } from "./ChecklistItem.web";

  const meta: Meta<typeof ChecklistItem> = {
    title: "Molecules/ChecklistItem",
    component: ChecklistItem,
    args: { label: "Pneus dianteiros", sublabel: "Verificar desgaste" }
  };
  export default meta;
  type Story = StoryObj<typeof ChecklistItem>;

  export const Conforme: Story = { args: { state: "conforme" } };
  export const Pendente: Story = { args: { state: "pendente" } };
  export const NaoConforme: Story = { args: { state: "nao-conforme" } };

  export const Smoke: Story = {
    args: { state: "conforme" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Pneus dianteiros")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { ChecklistItem } from "./ChecklistItem.web";
  export { CHECKLIST_CONFIG } from "./ChecklistItem.logic";
  export type { ChecklistItemProps, ChecklistState } from "./ChecklistItem.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add ChecklistItem molecule (conforme/pendente/nao-conforme, web+native)`

---

## Task 14 — Molecule: UploadArea `[complexa]`

Cross-cutting: drag/drop + click, multiple states, file validation logic.

**Files**
- Create: `packages/ui/src/molecules/UploadArea/UploadArea.logic.ts`
- Test: `packages/ui/src/molecules/UploadArea/UploadArea.logic.test.ts`
- Create: `packages/ui/src/molecules/UploadArea/UploadArea.web.tsx`
- Test: `packages/ui/src/molecules/UploadArea/UploadArea.web.test.tsx`
- Create: `packages/ui/src/molecules/UploadArea/UploadArea.native.tsx`
- Create: `packages/ui/src/molecules/UploadArea/UploadArea.module.css`
- Create: `packages/ui/src/molecules/UploadArea/UploadArea.stories.tsx`
- Create: `packages/ui/src/molecules/UploadArea/index.ts`

**Interfaces**
- Produces:
  ```ts
  type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";
  const MAX_BYTES = 10 * 1024 * 1024;
  const ACCEPTED = ["image/png", "image/jpeg"];
  function validateFile(f: { type: string; size: number }): { ok: true } | { ok: false; reason: string };
  interface UploadAreaProps { state?: UploadState; onFiles?: (files: File[]) => void; }
  ```
- Consumes: `../../tokens` (native).

**Steps**

- [ ] Write failing test `UploadArea.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { validateFile, MAX_BYTES } from "./UploadArea.logic";

  describe("validateFile", () => {
    it("accepts a small png", () => {
      expect(validateFile({ type: "image/png", size: 1024 })).toEqual({ ok: true });
    });
    it("accepts jpeg", () => {
      expect(validateFile({ type: "image/jpeg", size: 1024 }).ok).toBe(true);
    });
    it("rejects unsupported type", () => {
      const r = validateFile({ type: "application/pdf", size: 10 });
      expect(r).toEqual({ ok: false, reason: "Formato não suportado (use PNG ou JPG)" });
    });
    it("rejects files over 10MB", () => {
      const r = validateFile({ type: "image/png", size: MAX_BYTES + 1 });
      expect(r).toEqual({ ok: false, reason: "Arquivo excede 10MB" });
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/UploadArea`. Expect FAIL.
- [ ] Implement `UploadArea.logic.ts`:
  ```ts
  export type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

  export const MAX_BYTES = 10 * 1024 * 1024;
  export const ACCEPTED = ["image/png", "image/jpeg"] as const;

  export function validateFile(
    f: { type: string; size: number }
  ): { ok: true } | { ok: false; reason: string } {
    if (!ACCEPTED.includes(f.type as (typeof ACCEPTED)[number])) {
      return { ok: false, reason: "Formato não suportado (use PNG ou JPG)" };
    }
    if (f.size > MAX_BYTES) {
      return { ok: false, reason: "Arquivo excede 10MB" };
    }
    return { ok: true };
  }

  export interface UploadAreaProps {
    state?: UploadState;
    onFiles?: (files: File[]) => void;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `UploadArea.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen, fireEvent } from "@testing-library/react";
  import { UploadArea } from "./UploadArea.web";

  describe("UploadArea (web)", () => {
    it("renders idle instructions", () => {
      render(<UploadArea />);
      expect(screen.getByText(/arraste|clique/i)).toBeInTheDocument();
    });
    it("exposes state via data attribute", () => {
      render(<UploadArea state="uploading" />);
      expect(screen.getByTestId("upload-area")).toHaveAttribute("data-state", "uploading");
    });
    it("toggles to dragging on dragOver and back on dragLeave", () => {
      render(<UploadArea />);
      const area = screen.getByTestId("upload-area");
      fireEvent.dragOver(area);
      expect(area).toHaveAttribute("data-state", "dragging");
      fireEvent.dragLeave(area);
      expect(area).toHaveAttribute("data-state", "idle");
    });
    it("emits valid dropped files via onFiles", () => {
      const onFiles = vi.fn();
      render(<UploadArea onFiles={onFiles} />);
      const area = screen.getByTestId("upload-area");
      const file = new File(["x"], "p.png", { type: "image/png" });
      fireEvent.drop(area, { dataTransfer: { files: [file] } });
      expect(onFiles).toHaveBeenCalledWith([file]);
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `UploadArea.module.css`:
  ```css
  .area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    border: 2px dashed var(--color-neutral-300);
    border-radius: 12px;
    padding: var(--space-xl);
    background: var(--color-neutral-50);
    color: var(--color-neutral-600);
    cursor: pointer;
    text-align: center;
  }
  .area[data-state="dragging"] { border-color: var(--color-primary); background: #DBEAFE; }
  .area[data-state="success"] { border-color: var(--color-success); }
  .area[data-state="error"] { border-color: var(--color-error); color: var(--color-error); }
  .hidden { display: none; }
  ```
- [ ] Implement `UploadArea.web.tsx`:
  ```tsx
  import { useRef, useState, type FC, type DragEvent, type ChangeEvent } from "react";
  import { validateFile, type UploadAreaProps, type UploadState } from "./UploadArea.logic";
  import styles from "./UploadArea.module.css";

  export const UploadArea: FC<UploadAreaProps> = ({ state: controlled, onFiles }) => {
    const [internal, setInternal] = useState<UploadState>("idle");
    const inputRef = useRef<HTMLInputElement>(null);
    const state = controlled ?? internal;

    const accept = (files: File[]) => {
      const valid = files.filter((f) => validateFile(f).ok);
      if (valid.length > 0) onFiles?.(valid);
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!controlled) setInternal("idle");
      accept(Array.from(e.dataTransfer.files));
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
      accept(Array.from(e.target.files ?? []));

    return (
      <div
        data-testid="upload-area"
        className={styles.area}
        data-state={state}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!controlled) setInternal("dragging");
        }}
        onDragLeave={() => {
          if (!controlled) setInternal("idle");
        }}
        onDrop={onDrop}
      >
        <span>Arraste a imagem ou clique para selecionar</span>
        <small>PNG ou JPG até 10MB</small>
        <input
          ref={inputRef}
          className={styles.hidden}
          type="file"
          accept="image/png,image/jpeg"
          onChange={onChange}
        />
      </div>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `UploadArea.native.tsx` (NOT vitest-tested; native uses an image picker callback, so it renders a pressable prompt):
  ```tsx
  import type { FC } from "react";
  import { Pressable, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import type { UploadAreaProps } from "./UploadArea.logic";

  const styles = StyleSheet.create({
    area: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.neutral300,
      borderRadius: 12,
      padding: spacing.xl,
      backgroundColor: colors.neutral50
    },
    text: { color: colors.neutral600 },
    small: { color: colors.neutral600, fontSize: 12 }
  });

  export const UploadArea: FC<UploadAreaProps> = () => (
    <Pressable style={styles.area} accessibilityRole="button">
      <Text style={styles.text}>Toque para selecionar uma imagem</Text>
      <Text style={styles.small}>PNG ou JPG até 10MB</Text>
    </Pressable>
  );
  ```
- [ ] Implement `UploadArea.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { UploadArea } from "./UploadArea.web";

  const meta: Meta<typeof UploadArea> = { title: "Molecules/UploadArea", component: UploadArea };
  export default meta;
  type Story = StoryObj<typeof UploadArea>;

  export const Idle: Story = { args: { state: "idle" } };
  export const Dragging: Story = { args: { state: "dragging" } };
  export const Uploading: Story = { args: { state: "uploading" } };
  export const Success: Story = { args: { state: "success" } };
  export const Error: Story = { args: { state: "error" } };

  export const Smoke: Story = {
    args: { state: "idle" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByTestId("upload-area")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { UploadArea } from "./UploadArea.web";
  export { validateFile, MAX_BYTES, ACCEPTED } from "./UploadArea.logic";
  export type { UploadAreaProps, UploadState } from "./UploadArea.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add UploadArea molecule (drag/drop, validation, 5 states, web+native)`

---

## Task 15 — Molecule: OcrResult `[atômica]`

Single concern: OCR type label + thumbnail + validated badge.

**Files**
- Create: `packages/ui/src/molecules/OcrResult/OcrResult.logic.ts`
- Test: `packages/ui/src/molecules/OcrResult/OcrResult.logic.test.ts`
- Create: `packages/ui/src/molecules/OcrResult/OcrResult.web.tsx`
- Test: `packages/ui/src/molecules/OcrResult/OcrResult.web.test.tsx`
- Create: `packages/ui/src/molecules/OcrResult/OcrResult.native.tsx`
- Create: `packages/ui/src/molecules/OcrResult/OcrResult.module.css`
- Create: `packages/ui/src/molecules/OcrResult/OcrResult.stories.tsx`
- Create: `packages/ui/src/molecules/OcrResult/index.ts`

**Interfaces**
- Produces:
  ```ts
  type OcrType = "placa" | "hodometro";
  const OCR_LABEL: Record<OcrType, string>;
  interface OcrResultProps { type: OcrType; value: string; imageUrl?: string; validated?: boolean; }
  ```
- Consumes: `../../atoms/Badge`.

**Steps**

- [ ] Write failing test `OcrResult.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { OCR_LABEL } from "./OcrResult.logic";

  describe("OCR_LABEL", () => {
    it("labels placa and hodometro in pt-BR", () => {
      expect(OCR_LABEL.placa).toBe("Placa");
      expect(OCR_LABEL.hodometro).toBe("Hodômetro");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/OcrResult`. Expect FAIL.
- [ ] Implement `OcrResult.logic.ts`:
  ```ts
  export type OcrType = "placa" | "hodometro";

  export const OCR_LABEL: Record<OcrType, string> = {
    placa: "Placa",
    hodometro: "Hodômetro"
  };

  export interface OcrResultProps {
    type: OcrType;
    value: string;
    imageUrl?: string;
    validated?: boolean;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `OcrResult.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { OcrResult } from "./OcrResult.web";

  describe("OcrResult (web)", () => {
    it("renders the type label and value", () => {
      render(<OcrResult type="placa" value="ABC1D23" />);
      expect(screen.getByText("Placa")).toBeInTheDocument();
      expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    });
    it("renders Validado badge when validated", () => {
      render(<OcrResult type="hodometro" value="45000" validated />);
      expect(screen.getByText("Validado")).toBeInTheDocument();
    });
    it("omits the badge when not validated", () => {
      render(<OcrResult type="hodometro" value="45000" />);
      expect(screen.queryByText("Validado")).not.toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `OcrResult.module.css`:
  ```css
  .row { display: flex; align-items: center; gap: var(--space-md); border: 1px solid var(--color-neutral-300); border-radius: 12px; padding: var(--space-sm); }
  .thumb { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; background: var(--color-neutral-50); }
  .body { display: flex; flex-direction: column; flex: 1; }
  .type { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  .value { font-size: var(--font-h3-size); font-weight: 600; color: var(--color-dark); }
  .pill { display: inline-flex; align-items: center; gap: var(--space-xs); border-radius: 9999px; padding: 2px var(--space-sm); font-size: var(--font-small-size); font-weight: 600; background: #DCFCE7; color: var(--color-success); }
  ```
- [ ] Implement `OcrResult.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { OCR_LABEL, type OcrResultProps } from "./OcrResult.logic";
  import styles from "./OcrResult.module.css";

  export const OcrResult: FC<OcrResultProps> = ({ type, value, imageUrl, validated }) => (
    <div className={styles.row}>
      {imageUrl ? (
        <img className={styles.thumb} src={imageUrl} alt={`Captura de ${OCR_LABEL[type]}`} />
      ) : (
        <div className={styles.thumb} role="img" aria-label={`Captura de ${OCR_LABEL[type]}`} />
      )}
      <div className={styles.body}>
        <span className={styles.type}>{OCR_LABEL[type]}</span>
        <span className={styles.value}>{value}</span>
      </div>
      {validated ? <span className={styles.pill}>✓ Validado</span> : null}
    </div>
  );
  ```
  > Note: OcrResult uses a self-contained "Validado" pill (not the Badge atom) because the spec's Badge variants do not include a "validado" variant. The `Consumes: Badge` line above is corrected — OcrResult does NOT import Badge. Keep this implementation.
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `OcrResult.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, Image, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { OCR_LABEL, type OcrResultProps } from "./OcrResult.logic";

  const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderWidth: 1, borderColor: colors.neutral300, borderRadius: 12, padding: spacing.sm },
    thumb: { width: 56, height: 56, borderRadius: 8, backgroundColor: colors.neutral50 },
    body: { flex: 1 },
    type: { fontSize: 12, color: colors.neutral600 },
    value: { fontSize: 24, fontWeight: "600", color: colors.dark },
    pill: { borderRadius: 9999, paddingVertical: 2, paddingHorizontal: spacing.sm, backgroundColor: "#DCFCE7" },
    pillText: { fontSize: 12, fontWeight: "600", color: colors.success }
  });

  export const OcrResult: FC<OcrResultProps> = ({ type, value, imageUrl, validated }) => (
    <View style={styles.row}>
      {imageUrl ? <Image style={styles.thumb} source={{ uri: imageUrl }} /> : <View style={styles.thumb} />}
      <View style={styles.body}>
        <Text style={styles.type}>{OCR_LABEL[type]}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {validated ? (
        <View style={styles.pill}>
          <Text style={styles.pillText}>✓ Validado</Text>
        </View>
      ) : null}
    </View>
  );
  ```
- [ ] Implement `OcrResult.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { OcrResult } from "./OcrResult.web";

  const meta: Meta<typeof OcrResult> = { title: "Molecules/OcrResult", component: OcrResult };
  export default meta;
  type Story = StoryObj<typeof OcrResult>;

  export const Placa: Story = { args: { type: "placa", value: "ABC1D23", validated: true } };
  export const Hodometro: Story = { args: { type: "hodometro", value: "45000 km" } };

  export const Smoke: Story = {
    args: { type: "placa", value: "ABC1D23" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Placa")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { OcrResult } from "./OcrResult.web";
  export { OCR_LABEL } from "./OcrResult.logic";
  export type { OcrResultProps, OcrType } from "./OcrResult.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add OcrResult molecule (placa/hodometro, validated pill, web+native)`

---

## Task 16 — Molecule: Modal `[complexa]`

Cross-cutting: portal-free overlay, open/close, slot body, action callbacks, warning variant.

**Files**
- Create: `packages/ui/src/molecules/Modal/Modal.logic.ts`
- Test: `packages/ui/src/molecules/Modal/Modal.logic.test.ts`
- Create: `packages/ui/src/molecules/Modal/Modal.web.tsx`
- Test: `packages/ui/src/molecules/Modal/Modal.web.test.tsx`
- Create: `packages/ui/src/molecules/Modal/Modal.native.tsx`
- Create: `packages/ui/src/molecules/Modal/Modal.module.css`
- Create: `packages/ui/src/molecules/Modal/Modal.stories.tsx`
- Create: `packages/ui/src/molecules/Modal/index.ts`

**Interfaces**
- Produces:
  ```ts
  type ModalVariant = "default" | "warning";
  interface ModalProps {
    open: boolean; title: string; variant?: ModalVariant;
    confirmLabel?: string; cancelLabel?: string;
    onConfirm?: () => void; onCancel?: () => void;
    children?: React.ReactNode;
  }
  ```
- Consumes: `../../atoms/Button`.

**Steps**

- [ ] Write failing test `Modal.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { resolveModalLabels } from "./Modal.logic";

  describe("resolveModalLabels", () => {
    it("defaults to Confirmar / Cancelar", () => {
      expect(resolveModalLabels({})).toEqual({ confirm: "Confirmar", cancel: "Cancelar" });
    });
    it("respects provided labels", () => {
      expect(resolveModalLabels({ confirmLabel: "Aprovar", cancelLabel: "Voltar" }))
        .toEqual({ confirm: "Aprovar", cancel: "Voltar" });
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/molecules/Modal`. Expect FAIL.
- [ ] Implement `Modal.logic.ts`:
  ```ts
  import type { ReactNode } from "react";

  export type ModalVariant = "default" | "warning";

  export interface ModalProps {
    open: boolean;
    title: string;
    variant?: ModalVariant;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    children?: ReactNode;
  }

  export function resolveModalLabels(p: {
    confirmLabel?: string;
    cancelLabel?: string;
  }): { confirm: string; cancel: string } {
    return {
      confirm: p.confirmLabel ?? "Confirmar",
      cancel: p.cancelLabel ?? "Cancelar"
    };
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `Modal.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Modal } from "./Modal.web";

  describe("Modal (web)", () => {
    it("renders nothing when closed", () => {
      render(<Modal open={false} title="Confirmar aprovação" />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("renders title and body when open", () => {
      render(<Modal open title="Confirmar aprovação"><p>Tem certeza?</p></Modal>);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Confirmar aprovação")).toBeInTheDocument();
      expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
    });
    it("invokes onConfirm and onCancel", async () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      render(<Modal open title="t" onConfirm={onConfirm} onCancel={onCancel} />);
      await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
      await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      expect(onConfirm).toHaveBeenCalledOnce();
      expect(onCancel).toHaveBeenCalledOnce();
    });
    it("exposes warning variant via data attribute", () => {
      render(<Modal open title="t" variant="warning" />);
      expect(screen.getByRole("dialog")).toHaveAttribute("data-variant", "warning");
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `Modal.module.css`:
  ```css
  .overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; padding: var(--space-md); }
  .dialog { background: var(--color-neutral-white); border-radius: 12px; padding: var(--space-lg); width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: var(--space-md); }
  .header { display: flex; align-items: center; gap: var(--space-sm); }
  .warnIcon { color: var(--color-warning); font-size: var(--font-h3-size); }
  .title { font-size: var(--font-h3-size); font-weight: 600; color: var(--color-dark); }
  .body { font-size: var(--font-body-size); color: var(--color-neutral-600); }
  .actions { display: flex; justify-content: flex-end; gap: var(--space-sm); }
  ```
- [ ] Implement `Modal.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { Button } from "../../atoms/Button";
  import { resolveModalLabels, type ModalProps } from "./Modal.logic";
  import styles from "./Modal.module.css";

  export const Modal: FC<ModalProps> = (props) => {
    if (!props.open) return null;
    const { confirm, cancel } = resolveModalLabels(props);
    const variant = props.variant ?? "default";

    return (
      <div className={styles.overlay}>
        <div className={styles.dialog} role="dialog" aria-modal="true" data-variant={variant}>
          <div className={styles.header}>
            {variant === "warning" ? (
              <span className={styles.warnIcon} aria-hidden="true">⚠</span>
            ) : null}
            <span className={styles.title}>{props.title}</span>
          </div>
          {props.children ? <div className={styles.body}>{props.children}</div> : null}
          <div className={styles.actions}>
            <Button label={cancel} variant="secondary" onPress={props.onCancel} />
            <Button
              label={confirm}
              variant={variant === "warning" ? "success" : "primary"}
              onPress={props.onConfirm}
            />
          </div>
        </div>
      </div>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `Modal.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { Modal as RNModal, View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { Button } from "../../atoms/Button/Button.native";
  import { resolveModalLabels, type ModalProps } from "./Modal.logic";

  const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.5)", alignItems: "center", justifyContent: "center", padding: spacing.md },
    dialog: { backgroundColor: colors.neutralWhite, borderRadius: 12, padding: spacing.lg, width: "100%", maxWidth: 420, gap: spacing.md },
    title: { fontSize: 24, fontWeight: "600", color: colors.dark },
    body: { fontSize: 16, color: colors.neutral600 },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: spacing.sm }
  });

  export const Modal: FC<ModalProps> = (props) => {
    const { confirm, cancel } = resolveModalLabels(props);
    const variant = props.variant ?? "default";
    return (
      <RNModal visible={props.open} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.title}>{variant === "warning" ? "⚠ " : ""}{props.title}</Text>
            {props.children ? <View style={styles.body}>{props.children}</View> : null}
            <View style={styles.actions}>
              <Button label={cancel} variant="secondary" onPress={props.onCancel} />
              <Button label={confirm} variant={variant === "warning" ? "success" : "primary"} onPress={props.onConfirm} />
            </View>
          </View>
        </View>
      </RNModal>
    );
  };
  ```
- [ ] Implement `Modal.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { Modal } from "./Modal.web";

  const meta: Meta<typeof Modal> = {
    title: "Molecules/Modal",
    component: Modal,
    args: { open: true, title: "Confirmar aprovação", children: "Esta ação não pode ser desfeita." }
  };
  export default meta;
  type Story = StoryObj<typeof Modal>;

  export const Default: Story = {};
  export const Warning: Story = { args: { variant: "warning", confirmLabel: "Aprovar" } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      const body = canvasElement.ownerDocument.body;
      await expect(within(body).getByRole("dialog")).toBeInTheDocument();
    }
  };
  ```
  > Note: the Modal overlay is `position: fixed`, so in Storybook the dialog is rendered within the preview iframe body. The smoke test queries `ownerDocument.body` to reliably find it.
- [ ] Implement `index.ts`:
  ```ts
  export { Modal } from "./Modal.web";
  export { resolveModalLabels } from "./Modal.logic";
  export type { ModalProps, ModalVariant } from "./Modal.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add Modal molecule (open/close, slot body, warning variant, web+native)`

---

## Task 17 — Organism: Sidebar (web only) `[complexa]`

Cross-cutting: nav list, active highlighting, collapsible. Web only — no native file.

**Files**
- Create: `packages/ui/src/organisms/Sidebar/Sidebar.logic.ts`
- Test: `packages/ui/src/organisms/Sidebar/Sidebar.logic.test.ts`
- Create: `packages/ui/src/organisms/Sidebar/Sidebar.web.tsx`
- Test: `packages/ui/src/organisms/Sidebar/Sidebar.web.test.tsx`
- Create: `packages/ui/src/organisms/Sidebar/Sidebar.module.css`
- Create: `packages/ui/src/organisms/Sidebar/Sidebar.stories.tsx`
- Create: `packages/ui/src/organisms/Sidebar/index.ts`

> No `.native.tsx` — Sidebar is web only (spec §5 Organisms).

**Interfaces**
- Produces:
  ```ts
  interface NavLink { id: string; label: string; }
  const DEFAULT_LINKS: NavLink[]; // Dashboard, Frota, Checklist, Vistorias, Auditoria, Relatórios, Configurações, Usuários
  interface SidebarProps { links?: NavLink[]; activeId: string; collapsed?: boolean; onNavigate?: (id: string) => void; }
  function isActive(linkId: string, activeId: string): boolean;
  ```
- Consumes: nothing.

**Steps**

- [ ] Write failing test `Sidebar.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { DEFAULT_LINKS, isActive } from "./Sidebar.logic";

  describe("Sidebar logic", () => {
    it("ships the eight default nav links in order", () => {
      expect(DEFAULT_LINKS.map((l) => l.label)).toEqual([
        "Dashboard", "Frota", "Checklist", "Vistorias",
        "Auditoria", "Relatórios", "Configurações", "Usuários"
      ]);
    });
    it("isActive matches by id", () => {
      expect(isActive("dashboard", "dashboard")).toBe(true);
      expect(isActive("frota", "dashboard")).toBe(false);
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/organisms/Sidebar`. Expect FAIL.
- [ ] Implement `Sidebar.logic.ts`:
  ```ts
  export interface NavLink {
    id: string;
    label: string;
  }

  export const DEFAULT_LINKS: NavLink[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "frota", label: "Frota" },
    { id: "checklist", label: "Checklist" },
    { id: "vistorias", label: "Vistorias" },
    { id: "auditoria", label: "Auditoria" },
    { id: "relatorios", label: "Relatórios" },
    { id: "configuracoes", label: "Configurações" },
    { id: "usuarios", label: "Usuários" }
  ];

  export interface SidebarProps {
    links?: NavLink[];
    activeId: string;
    collapsed?: boolean;
    onNavigate?: (id: string) => void;
  }

  export function isActive(linkId: string, activeId: string): boolean {
    return linkId === activeId;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `Sidebar.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { Sidebar } from "./Sidebar.web";

  describe("Sidebar (web)", () => {
    it("renders all default links", () => {
      render(<Sidebar activeId="dashboard" />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Usuários")).toBeInTheDocument();
    });
    it("marks the active link with aria-current", () => {
      render(<Sidebar activeId="frota" />);
      const active = screen.getByText("Frota").closest("a, button");
      expect(active).toHaveAttribute("aria-current", "page");
    });
    it("calls onNavigate with the link id", async () => {
      const onNavigate = vi.fn();
      render(<Sidebar activeId="dashboard" onNavigate={onNavigate} />);
      await userEvent.click(screen.getByText("Checklist"));
      expect(onNavigate).toHaveBeenCalledWith("checklist");
    });
    it("hides labels when collapsed", () => {
      render(<Sidebar activeId="dashboard" collapsed />);
      expect(screen.getByTestId("sidebar")).toHaveAttribute("data-collapsed", "true");
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `Sidebar.module.css`:
  ```css
  .sidebar { display: flex; flex-direction: column; gap: var(--space-xs); width: 240px; height: 100%; background: var(--color-dark); padding: var(--space-md); }
  .sidebar[data-collapsed="true"] { width: 64px; }
  .logo { color: var(--color-neutral-white); font-size: var(--font-h3-size); font-weight: 700; margin-bottom: var(--space-md); }
  .link { display: flex; align-items: center; gap: var(--space-sm); border: none; background: transparent; color: var(--color-neutral-300); padding: var(--space-sm) var(--space-md); border-radius: 8px; cursor: pointer; font-size: var(--font-body-size); text-align: left; width: 100%; }
  .link[aria-current="page"] { background: var(--color-primary); color: var(--color-neutral-white); }
  .label { white-space: nowrap; }
  .sidebar[data-collapsed="true"] .label { display: none; }
  ```
- [ ] Implement `Sidebar.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { DEFAULT_LINKS, isActive, type SidebarProps } from "./Sidebar.logic";
  import styles from "./Sidebar.module.css";

  export const Sidebar: FC<SidebarProps> = ({ links = DEFAULT_LINKS, activeId, collapsed, onNavigate }) => (
    <nav
      className={styles.sidebar}
      data-testid="sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      aria-label="Navegação principal"
    >
      <span className={styles.logo}>{collapsed ? "V" : "Vistoria AI"}</span>
      {links.map((link) => (
        <button
          key={link.id}
          type="button"
          className={styles.link}
          aria-current={isActive(link.id, activeId) ? "page" : undefined}
          onClick={() => onNavigate?.(link.id)}
        >
          <span className={styles.label}>{link.label}</span>
        </button>
      ))}
    </nav>
  );
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `Sidebar.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { Sidebar } from "./Sidebar.web";

  const meta: Meta<typeof Sidebar> = {
    title: "Organisms/Sidebar",
    component: Sidebar,
    args: { activeId: "dashboard" },
    parameters: { layout: "fullscreen" }
  };
  export default meta;
  type Story = StoryObj<typeof Sidebar>;

  export const Expanded: Story = {};
  export const ActiveFrota: Story = { args: { activeId: "frota" } };
  export const Collapsed: Story = { args: { collapsed: true } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Dashboard")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { Sidebar } from "./Sidebar.web";
  export { DEFAULT_LINKS, isActive } from "./Sidebar.logic";
  export type { SidebarProps, NavLink } from "./Sidebar.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add Sidebar organism (web only, 8 nav links, active+collapsed)`

---

## Task 18 — Organism: BottomNav (mobile only) `[complexa]`

Cross-cutting: 5 tabs, elevated center camera, numeric badge. Mobile only — primary impl is `.native.tsx`; a `.web.tsx` exists ONLY so the component can render in Storybook for visual review (spec validates RN via Expo, but a web mirror keeps Storybook coverage consistent). Tests target the web mirror + logic.

**Files**
- Create: `packages/ui/src/organisms/BottomNav/BottomNav.logic.ts`
- Test: `packages/ui/src/organisms/BottomNav/BottomNav.logic.test.ts`
- Create: `packages/ui/src/organisms/BottomNav/BottomNav.web.tsx`
- Test: `packages/ui/src/organisms/BottomNav/BottomNav.web.test.tsx`
- Create: `packages/ui/src/organisms/BottomNav/BottomNav.native.tsx`
- Create: `packages/ui/src/organisms/BottomNav/BottomNav.module.css`
- Create: `packages/ui/src/organisms/BottomNav/BottomNav.stories.tsx`
- Create: `packages/ui/src/organisms/BottomNav/index.ts`

**Interfaces**
- Produces:
  ```ts
  interface Tab { id: string; label: string; center?: boolean; }
  const DEFAULT_TABS: Tab[]; // Início, Vistorias, (camera center), Alertas, Perfil
  interface BottomNavProps { activeId: string; alertCount?: number; onTab?: (id: string) => void; }
  function formatBadge(count: number): string | null; // null when 0, "9+" when >9
  ```
- Consumes: nothing.

**Steps**

- [ ] Write failing test `BottomNav.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { DEFAULT_TABS, formatBadge } from "./BottomNav.logic";

  describe("BottomNav logic", () => {
    it("ships five tabs with a center camera tab", () => {
      expect(DEFAULT_TABS).toHaveLength(5);
      expect(DEFAULT_TABS.map((t) => t.label)).toEqual([
        "Início", "Vistorias", "Câmera", "Alertas", "Perfil"
      ]);
      expect(DEFAULT_TABS.find((t) => t.id === "camera")?.center).toBe(true);
    });
    it("formatBadge hides zero and caps at 9+", () => {
      expect(formatBadge(0)).toBeNull();
      expect(formatBadge(3)).toBe("3");
      expect(formatBadge(12)).toBe("9+");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/organisms/BottomNav`. Expect FAIL.
- [ ] Implement `BottomNav.logic.ts`:
  ```ts
  export interface Tab {
    id: string;
    label: string;
    center?: boolean;
  }

  export const DEFAULT_TABS: Tab[] = [
    { id: "inicio", label: "Início" },
    { id: "vistorias", label: "Vistorias" },
    { id: "camera", label: "Câmera", center: true },
    { id: "alertas", label: "Alertas" },
    { id: "perfil", label: "Perfil" }
  ];

  export interface BottomNavProps {
    activeId: string;
    alertCount?: number;
    onTab?: (id: string) => void;
  }

  export function formatBadge(count: number): string | null {
    if (count <= 0) return null;
    return count > 9 ? "9+" : String(count);
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `BottomNav.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { BottomNav } from "./BottomNav.web";

  describe("BottomNav (web mirror)", () => {
    it("renders all five tabs", () => {
      render(<BottomNav activeId="inicio" />);
      ["Início", "Vistorias", "Câmera", "Alertas", "Perfil"].forEach((t) =>
        expect(screen.getByText(t)).toBeInTheDocument()
      );
    });
    it("marks the center tab as elevated", () => {
      render(<BottomNav activeId="inicio" />);
      expect(screen.getByText("Câmera").closest("[data-center]"))
        .toHaveAttribute("data-center", "true");
    });
    it("renders an alert badge when alertCount > 0", () => {
      render(<BottomNav activeId="inicio" alertCount={3} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });
    it("does not render a badge when alertCount is 0", () => {
      render(<BottomNav activeId="inicio" alertCount={0} />);
      expect(screen.queryByTestId("alert-badge")).not.toBeInTheDocument();
    });
    it("fires onTab with the tab id", async () => {
      const onTab = vi.fn();
      render(<BottomNav activeId="inicio" onTab={onTab} />);
      await userEvent.click(screen.getByText("Perfil"));
      expect(onTab).toHaveBeenCalledWith("perfil");
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `BottomNav.module.css`:
  ```css
  .bar { display: flex; justify-content: space-around; align-items: flex-end; background: var(--color-neutral-white); border-top: 1px solid var(--color-neutral-300); padding: var(--space-sm); }
  .tab { display: flex; flex-direction: column; align-items: center; gap: 2px; border: none; background: transparent; color: var(--color-neutral-600); font-size: var(--font-small-size); cursor: pointer; position: relative; }
  .tab[aria-current="page"] { color: var(--color-primary); }
  .tab[data-center="true"] { background: var(--color-primary); color: var(--color-neutral-white); border-radius: 9999px; width: 56px; height: 56px; justify-content: center; transform: translateY(-12px); }
  .badge { position: absolute; top: -4px; right: 8px; background: var(--color-error); color: var(--color-neutral-white); border-radius: 9999px; font-size: 10px; min-width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; padding: 0 4px; }
  ```
- [ ] Implement `BottomNav.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { DEFAULT_TABS, formatBadge, type BottomNavProps } from "./BottomNav.logic";
  import styles from "./BottomNav.module.css";

  export const BottomNav: FC<BottomNavProps> = ({ activeId, alertCount = 0, onTab }) => {
    const badge = formatBadge(alertCount);
    return (
      <nav className={styles.bar} aria-label="Navegação inferior">
        {DEFAULT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={styles.tab}
            data-center={tab.center ? "true" : "false"}
            aria-current={tab.id === activeId ? "page" : undefined}
            onClick={() => onTab?.(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.id === "alertas" && badge ? (
              <span className={styles.badge} data-testid="alert-badge">{badge}</span>
            ) : null}
          </button>
        ))}
      </nav>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `BottomNav.native.tsx` (NOT vitest-tested; primary platform):
  ```tsx
  import type { FC } from "react";
  import { View, Text, Pressable, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { DEFAULT_TABS, formatBadge, type BottomNavProps } from "./BottomNav.logic";

  const styles = StyleSheet.create({
    bar: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", backgroundColor: colors.neutralWhite, borderTopWidth: 1, borderTopColor: colors.neutral300, padding: spacing.sm },
    tab: { alignItems: "center", gap: 2 },
    label: { fontSize: 12, color: colors.neutral600 },
    activeLabel: { color: colors.primary },
    center: { backgroundColor: colors.primary, borderRadius: 9999, width: 56, height: 56, alignItems: "center", justifyContent: "center", transform: [{ translateY: -12 }] },
    centerLabel: { color: colors.neutralWhite },
    badge: { position: "absolute", top: -4, right: 8, backgroundColor: colors.error, borderRadius: 9999, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
    badgeText: { color: colors.neutralWhite, fontSize: 10 }
  });

  export const BottomNav: FC<BottomNavProps> = ({ activeId, alertCount = 0, onTab }) => {
    const badge = formatBadge(alertCount);
    return (
      <View style={styles.bar}>
        {DEFAULT_TABS.map((tab) => (
          <Pressable key={tab.id} style={[styles.tab, tab.center ? styles.center : null]} onPress={() => onTab?.(tab.id)}>
            <Text style={[styles.label, tab.center ? styles.centerLabel : null, tab.id === activeId ? styles.activeLabel : null]}>{tab.label}</Text>
            {tab.id === "alertas" && badge ? (
              <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
            ) : null}
          </Pressable>
        ))}
      </View>
    );
  };
  ```
- [ ] Implement `BottomNav.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { BottomNav } from "./BottomNav.web";

  const meta: Meta<typeof BottomNav> = {
    title: "Organisms/BottomNav",
    component: BottomNav,
    args: { activeId: "inicio" },
    parameters: { layout: "fullscreen" }
  };
  export default meta;
  type Story = StoryObj<typeof BottomNav>;

  export const Default: Story = {};
  export const WithAlerts: Story = { args: { alertCount: 3 } };
  export const ManyAlerts: Story = { args: { alertCount: 42 } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Câmera")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { BottomNav } from "./BottomNav.web";
  export { DEFAULT_TABS, formatBadge } from "./BottomNav.logic";
  export type { BottomNavProps, Tab } from "./BottomNav.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add BottomNav organism (5 tabs, elevated camera, alert badge)`

---

## Task 19 — Organism: DataTable `[complexa]`

Cross-cutting: configurable columns, status→Badge cell, action icons, pagination.

**Files**
- Create: `packages/ui/src/organisms/DataTable/DataTable.logic.ts`
- Test: `packages/ui/src/organisms/DataTable/DataTable.logic.test.ts`
- Create: `packages/ui/src/organisms/DataTable/DataTable.web.tsx`
- Test: `packages/ui/src/organisms/DataTable/DataTable.web.test.tsx`
- Create: `packages/ui/src/organisms/DataTable/DataTable.native.tsx`
- Create: `packages/ui/src/organisms/DataTable/DataTable.module.css`
- Create: `packages/ui/src/organisms/DataTable/DataTable.stories.tsx`
- Create: `packages/ui/src/organisms/DataTable/index.ts`

**Interfaces**
- Produces:
  ```ts
  type ColumnKind = "text" | "status" | "actions";
  interface Column { key: string; header: string; kind?: ColumnKind; }
  interface DataTableProps<R extends Record<string, unknown>> {
    columns: Column[]; rows: R[];
    page: number; pageSize: number; total: number;
    onPrev?: () => void; onNext?: () => void;
    onView?: (row: R) => void; onEdit?: (row: R) => void;
  }
  function pageInfo(page: number, pageSize: number, total: number): { from: number; to: number; canPrev: boolean; canNext: boolean };
  ```
- Consumes: `../../atoms/Badge`, `../../atoms/IconButton`.

**Steps**

- [ ] Write failing test `DataTable.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { pageInfo } from "./DataTable.logic";

  describe("pageInfo", () => {
    it("computes the first page window", () => {
      expect(pageInfo(1, 10, 35)).toEqual({ from: 1, to: 10, canPrev: false, canNext: true });
    });
    it("computes a middle page", () => {
      expect(pageInfo(2, 10, 35)).toEqual({ from: 11, to: 20, canPrev: true, canNext: true });
    });
    it("clamps the last page window to total and disables next", () => {
      expect(pageInfo(4, 10, 35)).toEqual({ from: 31, to: 35, canPrev: true, canNext: false });
    });
    it("handles empty data", () => {
      expect(pageInfo(1, 10, 0)).toEqual({ from: 0, to: 0, canPrev: false, canNext: false });
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/organisms/DataTable`. Expect FAIL.
- [ ] Implement `DataTable.logic.ts`:
  ```ts
  export type ColumnKind = "text" | "status" | "actions";

  export interface Column {
    key: string;
    header: string;
    kind?: ColumnKind;
  }

  export interface DataTableProps<R extends Record<string, unknown>> {
    columns: Column[];
    rows: R[];
    page: number;
    pageSize: number;
    total: number;
    onPrev?: () => void;
    onNext?: () => void;
    onView?: (row: R) => void;
    onEdit?: (row: R) => void;
  }

  export function pageInfo(
    page: number,
    pageSize: number,
    total: number
  ): { from: number; to: number; canPrev: boolean; canNext: boolean } {
    if (total === 0) return { from: 0, to: 0, canPrev: false, canNext: false };
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    return { from, to, canPrev: page > 1, canNext: to < total };
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `DataTable.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { DataTable } from "./DataTable.web";
  import type { Column } from "./DataTable.logic";

  type Row = { plate: string; status: "concluido" | "pendente" };
  const columns: Column[] = [
    { key: "plate", header: "Placa", kind: "text" },
    { key: "status", header: "Status", kind: "status" },
    { key: "actions", header: "Ações", kind: "actions" }
  ];
  const rows: Row[] = [
    { plate: "ABC1D23", status: "concluido" },
    { plate: "XYZ9K88", status: "pendente" }
  ];

  describe("DataTable (web)", () => {
    it("renders headers and text cells", () => {
      render(<DataTable columns={columns} rows={rows} page={1} pageSize={10} total={2} />);
      expect(screen.getByText("Placa")).toBeInTheDocument();
      expect(screen.getByText("ABC1D23")).toBeInTheDocument();
    });
    it("renders a Badge in status cells", () => {
      render(<DataTable columns={columns} rows={rows} page={1} pageSize={10} total={2} />);
      expect(screen.getByText("Concluído")).toBeInTheDocument();
      expect(screen.getByText("Pendente")).toBeInTheDocument();
    });
    it("fires onView and onEdit from action icons", async () => {
      const onView = vi.fn();
      const onEdit = vi.fn();
      render(<DataTable columns={columns} rows={rows} page={1} pageSize={10} total={2} onView={onView} onEdit={onEdit} />);
      await userEvent.click(screen.getAllByRole("button", { name: "Visualizar" })[0]!);
      await userEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]!);
      expect(onView).toHaveBeenCalledWith(rows[0]);
      expect(onEdit).toHaveBeenCalledWith(rows[0]);
    });
    it("shows pagination info and disables prev on first page", () => {
      render(<DataTable columns={columns} rows={rows} page={1} pageSize={10} total={2} />);
      expect(screen.getByText(/1.*2.*de.*2/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `DataTable.module.css`:
  ```css
  .wrapper { display: flex; flex-direction: column; gap: var(--space-sm); }
  .table { width: 100%; border-collapse: collapse; }
  .th { text-align: left; font-size: var(--font-small-size); color: var(--color-neutral-600); padding: var(--space-sm); border-bottom: 1px solid var(--color-neutral-300); }
  .td { font-size: var(--font-body-size); color: var(--color-dark); padding: var(--space-sm); border-bottom: 1px solid var(--color-neutral-300); }
  .actions { display: flex; gap: var(--space-xs); }
  .pagination { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-md); font-size: var(--font-small-size); color: var(--color-neutral-600); }
  ```
- [ ] Implement `DataTable.web.tsx`:
  ```tsx
  import { Badge, type BadgeVariant } from "../../atoms/Badge";
  import { IconButton } from "../../atoms/IconButton";
  import { pageInfo, type Column, type DataTableProps } from "./DataTable.logic";
  import styles from "./DataTable.module.css";

  export function DataTable<R extends Record<string, unknown>>(props: DataTableProps<R>) {
    const { columns, rows, page, pageSize, total } = props;
    const info = pageInfo(page, pageSize, total);

    const renderCell = (col: Column, row: R) => {
      if (col.kind === "status") {
        return <Badge variant={row[col.key] as BadgeVariant} />;
      }
      if (col.kind === "actions") {
        return (
          <span className={styles.actions}>
            <IconButton icon="arrow-right" ariaLabel="Visualizar" ghost onPress={() => props.onView?.(row)} />
            <IconButton icon="edit" ariaLabel="Editar" ghost onPress={() => props.onEdit?.(row)} />
          </span>
        );
      }
      return <>{String(row[col.key] ?? "")}</>;
    };

    return (
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={styles.th}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} className={styles.td}>{renderCell(c, row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <span>{info.from}–{info.to} de {total}</span>
          <button type="button" disabled={!info.canPrev} onClick={props.onPrev}>Anterior</button>
          <button type="button" disabled={!info.canNext} onClick={props.onNext}>Próximo</button>
        </div>
      </div>
    );
  }
  ```
  > Note: the pagination text uses an en-dash (`–`) and reads e.g. `1–2 de 2`; the test regex `/1.*2.*de.*2/` matches it.
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `DataTable.native.tsx` (NOT vitest-tested; simple stacked rows):
  ```tsx
  import { View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { Badge } from "../../atoms/Badge/Badge.native";
  import type { BadgeVariant } from "../../atoms/Badge";
  import { pageInfo, type DataTableProps } from "./DataTable.logic";

  const styles = StyleSheet.create({
    wrapper: { gap: spacing.sm },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.neutral300 },
    cell: { fontSize: 16, color: colors.dark },
    pagination: { fontSize: 12, color: colors.neutral600, textAlign: "right" }
  });

  export function DataTable<R extends Record<string, unknown>>(props: DataTableProps<R>) {
    const info = pageInfo(props.page, props.pageSize, props.total);
    return (
      <View style={styles.wrapper}>
        {props.rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {props.columns.map((c) =>
              c.kind === "status" ? (
                <Badge key={c.key} variant={row[c.key] as BadgeVariant} />
              ) : c.kind === "actions" ? null : (
                <Text key={c.key} style={styles.cell}>{String(row[c.key] ?? "")}</Text>
              )
            )}
          </View>
        ))}
        <Text style={styles.pagination}>{info.from}–{info.to} de {props.total}</Text>
      </View>
    );
  }
  ```
- [ ] Implement `DataTable.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { DataTable } from "./DataTable.web";
  import type { Column } from "./DataTable.logic";

  type Row = Record<string, unknown>;
  const columns: Column[] = [
    { key: "plate", header: "Placa", kind: "text" },
    { key: "model", header: "Modelo", kind: "text" },
    { key: "status", header: "Status", kind: "status" },
    { key: "actions", header: "Ações", kind: "actions" }
  ];
  const rows: Row[] = [
    { plate: "ABC1D23", model: "Onix", status: "concluido" },
    { plate: "XYZ9K88", model: "HB20", status: "pendente" },
    { plate: "QWE4R55", model: "Kwid", status: "reprovado" }
  ];

  const meta: Meta<typeof DataTable<Row>> = {
    title: "Organisms/DataTable",
    component: DataTable,
    args: { columns, rows, page: 1, pageSize: 10, total: 3 }
  };
  export default meta;
  type Story = StoryObj<typeof DataTable<Row>>;

  export const Default: Story = {};
  export const SecondPage: Story = { args: { page: 2, total: 18 } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("Placa")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { DataTable } from "./DataTable.web";
  export { pageInfo } from "./DataTable.logic";
  export type { DataTableProps, Column, ColumnKind } from "./DataTable.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add DataTable organism (columns, status Badge, actions, pagination)`

---

## Task 20 — Domain: GeoTag `[atômica]`

Single concern: pin + location text + validated label.

**Files**
- Create: `packages/ui/src/domain/GeoTag/GeoTag.logic.ts`
- Test: `packages/ui/src/domain/GeoTag/GeoTag.logic.test.ts`
- Create: `packages/ui/src/domain/GeoTag/GeoTag.web.tsx`
- Test: `packages/ui/src/domain/GeoTag/GeoTag.web.test.tsx`
- Create: `packages/ui/src/domain/GeoTag/GeoTag.native.tsx`
- Create: `packages/ui/src/domain/GeoTag/GeoTag.module.css`
- Create: `packages/ui/src/domain/GeoTag/GeoTag.stories.tsx`
- Create: `packages/ui/src/domain/GeoTag/index.ts`

**Interfaces**
- Produces:
  ```ts
  interface GeoTagProps { city: string; state: string; validated?: boolean; }
  function formatLocation(city: string, state: string): string; // "São Paulo, SP"
  ```
- Consumes: `../../tokens` (native).

**Steps**

- [ ] Write failing test `GeoTag.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { formatLocation } from "./GeoTag.logic";

  describe("formatLocation", () => {
    it("joins city and state with a comma", () => {
      expect(formatLocation("São Paulo", "SP")).toBe("São Paulo, SP");
    });
    it("trims surrounding whitespace", () => {
      expect(formatLocation("  Rio de Janeiro ", " RJ ")).toBe("Rio de Janeiro, RJ");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/domain/GeoTag`. Expect FAIL.
- [ ] Implement `GeoTag.logic.ts`:
  ```ts
  export interface GeoTagProps {
    city: string;
    state: string;
    validated?: boolean;
  }

  export function formatLocation(city: string, state: string): string {
    return `${city.trim()}, ${state.trim()}`;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `GeoTag.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { GeoTag } from "./GeoTag.web";

  describe("GeoTag (web)", () => {
    it("renders the formatted location", () => {
      render(<GeoTag city="São Paulo" state="SP" />);
      expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();
    });
    it("shows the validated label when validated", () => {
      render(<GeoTag city="São Paulo" state="SP" validated />);
      expect(screen.getByText("Localização validada")).toBeInTheDocument();
    });
    it("omits the validated label by default", () => {
      render(<GeoTag city="São Paulo" state="SP" />);
      expect(screen.queryByText("Localização validada")).not.toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `GeoTag.module.css`:
  ```css
  .tag { display: inline-flex; align-items: center; gap: var(--space-sm); }
  .pin { color: var(--color-primary); font-size: var(--font-body-size); }
  .location { font-size: var(--font-body-size); color: var(--color-dark); }
  .validated { font-size: var(--font-small-size); color: var(--color-success); font-weight: 600; }
  ```
- [ ] Implement `GeoTag.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { formatLocation, type GeoTagProps } from "./GeoTag.logic";
  import styles from "./GeoTag.module.css";

  export const GeoTag: FC<GeoTagProps> = ({ city, state, validated }) => (
    <span className={styles.tag}>
      <span className={styles.pin} aria-hidden="true">📍</span>
      <span className={styles.location}>{formatLocation(city, state)}</span>
      {validated ? <span className={styles.validated}>Localização validada</span> : null}
    </span>
  );
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `GeoTag.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { formatLocation, type GeoTagProps } from "./GeoTag.logic";

  const styles = StyleSheet.create({
    tag: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    pin: { color: colors.primary, fontSize: 16 },
    location: { fontSize: 16, color: colors.dark },
    validated: { fontSize: 12, color: colors.success, fontWeight: "600" }
  });

  export const GeoTag: FC<GeoTagProps> = ({ city, state, validated }) => (
    <View style={styles.tag}>
      <Text style={styles.pin}>📍</Text>
      <Text style={styles.location}>{formatLocation(city, state)}</Text>
      {validated ? <Text style={styles.validated}>Localização validada</Text> : null}
    </View>
  );
  ```
- [ ] Implement `GeoTag.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { GeoTag } from "./GeoTag.web";

  const meta: Meta<typeof GeoTag> = {
    title: "Domain/GeoTag",
    component: GeoTag,
    args: { city: "São Paulo", state: "SP" }
  };
  export default meta;
  type Story = StoryObj<typeof GeoTag>;

  export const Default: Story = {};
  export const Validated: Story = { args: { validated: true } };

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("São Paulo, SP")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { GeoTag } from "./GeoTag.web";
  export { formatLocation } from "./GeoTag.logic";
  export type { GeoTagProps } from "./GeoTag.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add GeoTag domain component (pin, location, validated label)`

---

## Task 21 — Domain: UniqueCode `[complexa]`

Cross-cutting: code formatting/validation + clipboard side effect with copied feedback.

**Files**
- Create: `packages/ui/src/domain/UniqueCode/UniqueCode.logic.ts`
- Test: `packages/ui/src/domain/UniqueCode/UniqueCode.logic.test.ts`
- Create: `packages/ui/src/domain/UniqueCode/UniqueCode.web.tsx`
- Test: `packages/ui/src/domain/UniqueCode/UniqueCode.web.test.tsx`
- Create: `packages/ui/src/domain/UniqueCode/UniqueCode.native.tsx`
- Create: `packages/ui/src/domain/UniqueCode/UniqueCode.module.css`
- Create: `packages/ui/src/domain/UniqueCode/UniqueCode.stories.tsx`
- Create: `packages/ui/src/domain/UniqueCode/index.ts`

**Interfaces**
- Produces:
  ```ts
  interface UniqueCodeProps { code: string; onCopied?: () => void; }
  function isValidCode(code: string): boolean; // matches VST-XXXXXX (6 alnum upper)
  ```
- Consumes: browser `navigator.clipboard` (web).

**Steps**

- [ ] Write failing test `UniqueCode.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { isValidCode } from "./UniqueCode.logic";

  describe("isValidCode", () => {
    it("accepts VST- followed by 6 uppercase alphanumerics", () => {
      expect(isValidCode("VST-AB12C9")).toBe(true);
      expect(isValidCode("VST-000000")).toBe(true);
    });
    it("rejects wrong prefix, length, or case", () => {
      expect(isValidCode("VS-AB12C9")).toBe(false);
      expect(isValidCode("VST-AB12C")).toBe(false);
      expect(isValidCode("VST-ab12c9")).toBe(false);
      expect(isValidCode("VST-AB12C99")).toBe(false);
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/domain/UniqueCode`. Expect FAIL.
- [ ] Implement `UniqueCode.logic.ts`:
  ```ts
  export interface UniqueCodeProps {
    code: string;
    onCopied?: () => void;
  }

  const CODE_RE = /^VST-[A-Z0-9]{6}$/;

  export function isValidCode(code: string): boolean {
    return CODE_RE.test(code);
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `UniqueCode.web.test.tsx`:
  ```tsx
  import { describe, it, expect, vi, beforeEach } from "vitest";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
  import { UniqueCode } from "./UniqueCode.web";

  describe("UniqueCode (web)", () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
      });
    });

    it("renders the code", () => {
      render(<UniqueCode code="VST-AB12C9" />);
      expect(screen.getByText("VST-AB12C9")).toBeInTheDocument();
    });
    it("copies to clipboard and fires onCopied when the copy button is clicked", async () => {
      const onCopied = vi.fn();
      render(<UniqueCode code="VST-AB12C9" onCopied={onCopied} />);
      await userEvent.click(screen.getByRole("button", { name: /copiar/i }));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("VST-AB12C9");
      expect(onCopied).toHaveBeenCalledOnce();
    });
    it("shows a copied confirmation after copying", async () => {
      render(<UniqueCode code="VST-AB12C9" />);
      await userEvent.click(screen.getByRole("button", { name: /copiar/i }));
      expect(await screen.findByText("Copiado!")).toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `UniqueCode.module.css`:
  ```css
  .wrapper { display: inline-flex; align-items: center; gap: var(--space-sm); border: 1px dashed var(--color-primary); border-radius: 8px; padding: var(--space-sm) var(--space-md); }
  .code { font-family: monospace; font-size: var(--font-h3-size); font-weight: 700; color: var(--color-primary); letter-spacing: 1px; }
  .copy { border: none; background: transparent; cursor: pointer; color: var(--color-neutral-600); font-size: var(--font-small-size); }
  .copied { font-size: var(--font-small-size); color: var(--color-success); font-weight: 600; }
  ```
- [ ] Implement `UniqueCode.web.tsx`:
  ```tsx
  import { useState, type FC } from "react";
  import type { UniqueCodeProps } from "./UniqueCode.logic";
  import styles from "./UniqueCode.module.css";

  export const UniqueCode: FC<UniqueCodeProps> = ({ code, onCopied }) => {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopied?.();
    };

    return (
      <span className={styles.wrapper}>
        <span className={styles.code}>{code}</span>
        {copied ? (
          <span className={styles.copied}>Copiado!</span>
        ) : (
          <button type="button" className={styles.copy} onClick={copy} aria-label="Copiar código">
            Copiar
          </button>
        )}
      </span>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `UniqueCode.native.tsx` (NOT vitest-tested; uses RN Clipboard API surface via a callback — keep import-free of expo to avoid coupling, expose onCopied):
  ```tsx
  import { useState, type FC } from "react";
  import { View, Text, Pressable, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import type { UniqueCodeProps } from "./UniqueCode.logic";

  const styles = StyleSheet.create({
    wrapper: { flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderStyle: "dashed", borderColor: colors.primary, borderRadius: 8, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignSelf: "flex-start" },
    code: { fontFamily: "monospace", fontSize: 24, fontWeight: "700", color: colors.primary, letterSpacing: 1 },
    copy: { fontSize: 12, color: colors.neutral600 },
    copied: { fontSize: 12, color: colors.success, fontWeight: "600" }
  });

  export const UniqueCode: FC<UniqueCodeProps> = ({ code, onCopied }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
      setCopied(true);
      onCopied?.();
    };
    return (
      <View style={styles.wrapper}>
        <Text style={styles.code}>{code}</Text>
        {copied ? (
          <Text style={styles.copied}>Copiado!</Text>
        ) : (
          <Pressable onPress={copy} accessibilityRole="button" accessibilityLabel="Copiar código">
            <Text style={styles.copy}>Copiar</Text>
          </Pressable>
        )}
      </View>
    );
  };
  ```
  > Note: native clipboard write is delegated to the consuming app via `onCopied` (Expo's `expo-clipboard` is an app dependency, not a UI-package dependency — keeps the package platform-agnostic).
- [ ] Implement `UniqueCode.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { UniqueCode } from "./UniqueCode.web";

  const meta: Meta<typeof UniqueCode> = {
    title: "Domain/UniqueCode",
    component: UniqueCode,
    args: { code: "VST-AB12C9" }
  };
  export default meta;
  type Story = StoryObj<typeof UniqueCode>;

  export const Default: Story = {};

  export const Smoke: Story = {
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByText("VST-AB12C9")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { UniqueCode } from "./UniqueCode.web";
  export { isValidCode } from "./UniqueCode.logic";
  export type { UniqueCodeProps } from "./UniqueCode.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add UniqueCode domain component (VST code, copy-to-clipboard)`

---

## Task 22 — Domain: AiPhotoResult `[atômica]`

Single concern: aprovada/recusada variant with icon, message, and optional reason.

**Files**
- Create: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.logic.ts`
- Test: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.logic.test.ts`
- Create: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.web.tsx`
- Test: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.web.test.tsx`
- Create: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.native.tsx`
- Create: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.module.css`
- Create: `packages/ui/src/domain/AiPhotoResult/AiPhotoResult.stories.tsx`
- Create: `packages/ui/src/domain/AiPhotoResult/index.ts`

**Interfaces**
- Produces:
  ```ts
  type AiVerdict = "aprovada" | "recusada";
  const AI_CONFIG: Record<AiVerdict, { icon: string; color: string; message: string }>;
  interface AiPhotoResultProps { verdict: AiVerdict; reason?: string; }
  ```
- Consumes: `../../tokens` (colors).

**Steps**

- [ ] Write failing test `AiPhotoResult.logic.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { AI_CONFIG } from "./AiPhotoResult.logic";

  describe("AI_CONFIG", () => {
    it("aprovada uses success color and approval message", () => {
      expect(AI_CONFIG.aprovada.color).toBe("#22C55E");
      expect(AI_CONFIG.aprovada.message).toBe("Foto aprovada pela IA");
      expect(AI_CONFIG.aprovada.icon).toBe("✓");
    });
    it("recusada uses error color and rejection icon", () => {
      expect(AI_CONFIG.recusada.color).toBe("#EF4444");
      expect(AI_CONFIG.recusada.icon).toBe("✕");
    });
  });
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run src/domain/AiPhotoResult`. Expect FAIL.
- [ ] Implement `AiPhotoResult.logic.ts`:
  ```ts
  import { colors } from "../../tokens";

  export type AiVerdict = "aprovada" | "recusada";

  export const AI_CONFIG: Record<AiVerdict, { icon: string; color: string; message: string }> = {
    aprovada: { icon: "✓", color: colors.success, message: "Foto aprovada pela IA" },
    recusada: { icon: "✕", color: colors.error, message: "Foto recusada pela IA" }
  };

  export interface AiPhotoResultProps {
    verdict: AiVerdict;
    reason?: string;
  }
  ```
- [ ] Run vitest. Expect logic PASS.
- [ ] Write failing test `AiPhotoResult.web.test.tsx`:
  ```tsx
  import { describe, it, expect } from "vitest";
  import { render, screen } from "@testing-library/react";
  import { AiPhotoResult } from "./AiPhotoResult.web";

  describe("AiPhotoResult (web)", () => {
    it("renders the approval message for aprovada", () => {
      render(<AiPhotoResult verdict="aprovada" />);
      expect(screen.getByText("Foto aprovada pela IA")).toBeInTheDocument();
      expect(screen.getByTestId("ai-result")).toHaveAttribute("data-verdict", "aprovada");
    });
    it("renders the rejection reason for recusada", () => {
      render(<AiPhotoResult verdict="recusada" reason="Imagem desfocada" />);
      expect(screen.getByText("Foto recusada pela IA")).toBeInTheDocument();
      expect(screen.getByText("Imagem desfocada")).toBeInTheDocument();
    });
    it("omits the reason when not provided", () => {
      render(<AiPhotoResult verdict="recusada" />);
      expect(screen.getByText("Foto recusada pela IA")).toBeInTheDocument();
    });
  });
  ```
- [ ] Run vitest. Expect web FAIL.
- [ ] Implement `AiPhotoResult.module.css`:
  ```css
  .box { display: flex; flex-direction: column; gap: var(--space-xs); border-radius: 12px; padding: var(--space-md); border: 1px solid var(--color-neutral-300); }
  .header { display: flex; align-items: center; gap: var(--space-sm); }
  .icon { font-weight: 700; font-size: var(--font-h3-size); }
  .message { font-size: var(--font-body-size); font-weight: 600; color: var(--color-dark); }
  .reason { font-size: var(--font-small-size); color: var(--color-neutral-600); }
  ```
- [ ] Implement `AiPhotoResult.web.tsx`:
  ```tsx
  import type { FC } from "react";
  import { AI_CONFIG, type AiPhotoResultProps } from "./AiPhotoResult.logic";
  import styles from "./AiPhotoResult.module.css";

  export const AiPhotoResult: FC<AiPhotoResultProps> = ({ verdict, reason }) => {
    const cfg = AI_CONFIG[verdict];
    return (
      <div className={styles.box} data-testid="ai-result" data-verdict={verdict}>
        <div className={styles.header}>
          <span className={styles.icon} style={{ color: cfg.color }} aria-hidden="true">
            {cfg.icon}
          </span>
          <span className={styles.message}>{cfg.message}</span>
        </div>
        {verdict === "recusada" && reason ? (
          <span className={styles.reason}>{reason}</span>
        ) : null}
      </div>
    );
  };
  ```
- [ ] Run vitest. Expect ALL PASS.
- [ ] Implement `AiPhotoResult.native.tsx` (NOT vitest-tested):
  ```tsx
  import type { FC } from "react";
  import { View, Text, StyleSheet } from "react-native";
  import { colors, spacing } from "../../tokens";
  import { AI_CONFIG, type AiPhotoResultProps } from "./AiPhotoResult.logic";

  const styles = StyleSheet.create({
    box: { gap: spacing.xs, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.neutral300 },
    header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    icon: { fontWeight: "700", fontSize: 24 },
    message: { fontSize: 16, fontWeight: "600", color: colors.dark },
    reason: { fontSize: 12, color: colors.neutral600 }
  });

  export const AiPhotoResult: FC<AiPhotoResultProps> = ({ verdict, reason }) => {
    const cfg = AI_CONFIG[verdict];
    return (
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={[styles.icon, { color: cfg.color }]}>{cfg.icon}</Text>
          <Text style={styles.message}>{cfg.message}</Text>
        </View>
        {verdict === "recusada" && reason ? <Text style={styles.reason}>{reason}</Text> : null}
      </View>
    );
  };
  ```
- [ ] Implement `AiPhotoResult.stories.tsx`:
  ```tsx
  import type { Meta, StoryObj } from "@storybook/react";
  import { expect, within } from "@storybook/test";
  import { AiPhotoResult } from "./AiPhotoResult.web";

  const meta: Meta<typeof AiPhotoResult> = {
    title: "Domain/AiPhotoResult",
    component: AiPhotoResult
  };
  export default meta;
  type Story = StoryObj<typeof AiPhotoResult>;

  export const Aprovada: Story = { args: { verdict: "aprovada" } };
  export const Recusada: Story = { args: { verdict: "recusada", reason: "Imagem desfocada — refaça a foto" } };

  export const Smoke: Story = {
    args: { verdict: "aprovada" },
    play: async ({ canvasElement }) => {
      await expect(within(canvasElement).getByTestId("ai-result")).toBeInTheDocument();
    }
  };
  ```
- [ ] Implement `index.ts`:
  ```ts
  export { AiPhotoResult } from "./AiPhotoResult.web";
  export { AI_CONFIG } from "./AiPhotoResult.logic";
  export type { AiPhotoResultProps, AiVerdict } from "./AiPhotoResult.logic";
  ```
- [ ] Run vitest + `tsc --noEmit`. Expect BOTH PASS.
- [ ] Commit: `feat(ui): add AiPhotoResult domain component (aprovada/recusada, reason)`

---

## Task 23 — Wire turbo `storybook` task + final verification `[atômica]`

Single concern: add the turbo task and run the whole suite end-to-end.

**Files**
- Modify: `turbo.json`

**Interfaces**
- Produces: `turbo run storybook` resolves; full `test`/`typecheck`/`lint` pass for `@vistoria/ui`.
- Consumes: all prior tasks.

**Steps**

- [ ] Modify `turbo.json` — add the `storybook` task inside `tasks` (keep existing tasks intact). Final file:
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
      "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
      "dev": { "cache": false, "persistent": true },
      "lint": {},
      "typecheck": { "dependsOn": ["^build"] },
      "test": { "dependsOn": ["^build"] },
      "storybook": { "cache": false, "persistent": true }
    }
  }
  ```
- [ ] Run `pnpm --filter @vistoria/ui exec vitest run`. Expect ALL test files PASS (tokens + every web component + every logic file). Native files are excluded by the vitest `exclude` glob.
- [ ] Run `pnpm --filter @vistoria/ui exec tsc --noEmit`. Expect PASS (this is the only typecheck of the `.native.tsx` files — they must compile even though they are not tested).
- [ ] Run `pnpm --filter @vistoria/ui exec eslint .`. Expect PASS (fix any lint errors before committing).
- [ ] Run `pnpm --filter @vistoria/ui exec storybook build --quiet`. Expect a successful static build of `storybook-static/` containing every story.
- [ ] Run `pnpm turbo run storybook --dry=json | head -40`. Expect the `storybook` task to be recognized for `@vistoria/ui` (dry run, does not start the server).
- [ ] Commit: `chore(ui): wire turbo storybook task and finalize @vistoria/ui suite`

---

## Self-Review Checklist (run before declaring the plan executable)

This section was executed against the spec and the repo conventions; results inlined.

### Spec coverage
- [x] Tokens: colors (9), typography (5), spacing scale, JS + CSS bridge — Tasks 3-4.
- [x] Atoms (5/5): Button, Input, Badge, ProgressBar, IconButton — Tasks 6-10.
- [x] Molecules (6/6): VehicleCard, StatCard, ChecklistItem, UploadArea, OcrResult, Modal — Tasks 11-16.
- [x] Organisms (3/3): Sidebar (web only), BottomNav (mobile primary), DataTable — Tasks 17-19.
- [x] Domain (3/3): GeoTag, UniqueCode, AiPhotoResult — Tasks 20-22.
- [x] Button variants `primary|secondary|success|danger`, sizes `md|sm`, `disabled`/`loading` — Task 6.
- [x] Badge variants `concluido|em-andamento|pendente|reprovado|agendado` — Task 8.
- [x] ProgressBar thresholds (0-49 warning, 50-99 primary, 100 success) — Task 9.
- [x] IconButton icons `camera|search|plus|edit|trash|arrow-right` + `ghost` — Task 10.
- [x] Input types `text|select|search|datepicker`, states, `errorMessage` — Task 7.
- [x] ChecklistItem states `conforme|pendente|nao-conforme` — Task 13.
- [x] UploadArea states `idle|dragging|uploading|success|error`, PNG/JPG ≤10MB — Task 14.
- [x] OcrResult types `placa|hodometro` + Validado — Task 15.
- [x] Modal generic + `warning` variant — Task 16.
- [x] Sidebar 8 links + active + collapsible — Task 17.
- [x] BottomNav 5 tabs + center camera + Alertas badge — Task 18.
- [x] DataTable columns + status Badge cell + view/edit + pagination — Task 19.
- [x] AiPhotoResult `aprovada`/`recusada` with reason — Task 22.
- [x] Storybook 8 + `@storybook/react-vite` + addon-a11y + addon-interactions + port 6006 + smoke via `@storybook/test` — Tasks 5 & every stories file.
- [x] Package exports map (`./tokens`, `./atoms/*`, etc.) — Task 1.
- [x] turbo `storybook` task — Task 23.
- [x] Per-component 6-file convention (web/native/logic/css/stories/index) — every component task.
- [x] Native files implemented but NOT vitest-tested — enforced by vitest `exclude` glob (Task 2) and noted per task.
- [x] Out-of-scope items (Style Dictionary, dark mode, RN Storybook, animations) — excluded; not present in any task.

### Placeholder scan
- [x] No "TBD", "TODO", "similar to Task N", or "...". Every code block is complete and self-contained (code is repeated, never referenced).
- [x] Every component has full test + web + native + css + stories + index code shown.

### Type consistency
- [x] `BadgeVariant` defined in Badge.logic and reused by VehicleCard, DataTable, OcrResult-adjacent — imported, not redefined.
- [x] `colors`/`spacing`/`typography` imported from `../../tokens` in every native file and color-driven logic.
- [x] `noUncheckedIndexedAccess` honored: array element access in tests uses `!` (e.g. `getAllByRole(...)[0]!`); record lookups use known keys.
- [x] `isolatedModules` honored: all type-only exports use `export type`.
- [x] `strict` honored: no implicit any; generics on DataTable carry `R extends Record<string, unknown>`.

### Corrections applied inline
- Task 15 OcrResult: removed the Badge-atom dependency (spec Badge has no "validado" variant); uses a self-contained pill. The Interfaces "Consumes" note is annotated accordingly.
- Task 16 Modal smoke story: queries `ownerDocument.body` because the overlay is `position: fixed`.
- Task 18 BottomNav: added a `.web.tsx` mirror (not in the strict spec, which marks it mobile-only) solely to keep Storybook + vitest coverage; native remains the production target. This is the single intentional deviation and is documented here.

### Open questions
None blocking. One product note recorded in `.omc/plans/open-questions.md`: confirm whether BottomNav should ship a web mirror long-term or be Storybook-only via an RN-web adapter.
