# UI Component Library — Design Spec

**Date:** 2026-06-17  
**Project:** Vistoria AI  
**Scope:** `packages/ui` — design system componentization + Storybook

---

## 1. Context

Monorepo Turborepo com `apps/api` (pronto). Próxima fase: frontend web (gerente) + mobile (vistoriador). Antes de qualquer app, centralizar o design system em `packages/ui` para evitar duplicação e garantir consistência visual entre plataformas.

Referências visuais: `carro-vistoria-components.jpeg` (design system) + `carro-vistoria-pages.jpeg` (páginas).

---

## 2. Stack

| Decisão | Escolha |
|---------|---------|
| Web app | Next.js |
| Mobile app | React Native / Expo |
| Estilo | CSS Modules (web) + objeto JS (native) |
| Validação visual | Storybook 8 + `@storybook/react-vite` |
| Monorepo | Turborepo (já configurado) |

---

## 3. Estrutura do Pacote

```
packages/ui/
  src/
    tokens/
      index.ts          ← fonte da verdade (cores, tipografia, espaçamento)
      web.css           ← CSS custom properties (:root { --color-primary: ... })
    atoms/
      Button/
      Input/
      Badge/
      ProgressBar/
      IconButton/
    molecules/
      VehicleCard/
      StatCard/
      ChecklistItem/
      UploadArea/
      OcrResult/
      Modal/
    organisms/
      Sidebar/
      BottomNav/
      DataTable/
    domain/
      GeoTag/
      UniqueCode/
      AiPhotoResult/
  .storybook/
    main.ts
    preview.ts
  package.json
  tsconfig.json
```

### Convenção por componente

```
Button/
  Button.web.tsx        ← implementação web (usa CSS Modules)
  Button.native.tsx     ← implementação React Native (usa StyleSheet)
  Button.logic.ts       ← props/types/hooks compartilhados
  Button.module.css     ← estilos web
  Button.stories.tsx    ← Storybook (todas as variantes)
  index.ts              ← re-export
```

---

## 4. Tokens

### Cores

| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#2563EB` | Botão primário, links, foco |
| `dark` | `#0F172A` | Texto principal, sidebar bg |
| `success` | `#22C55E` | Badge Concluído, botão Aprovar |
| `warning` | `#F59E0B` | Badge Pendente, atenção |
| `error` | `#EF4444` | Badge Reprovado, erro, botão Reprovar |
| `neutral-white` | `#FFFFFF` | Background padrão |
| `neutral-50` | `#F8FAFC` | Background alternativo |
| `neutral-300` | `#CBD5E1` | Bordas, separadores |
| `neutral-600` | `#334155` | Texto secundário |

### Tipografia

| Token | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| `h1` | 40px | 700 | Dashboard title |
| `h2` | 32px | 600 | Section headers |
| `h3` | 24px | 600 | Card titles |
| `body` | 16px | 400 | Texto corrido |
| `small` | 12px | 400 | Labels, badges |

### Token bridge (web ↔ native)

```ts
// tokens/index.ts — fonte da verdade
export const colors = { primary: '#2563EB', success: '#22C55E', ... }
export const typography = { h1: { fontSize: 40, fontWeight: '700' }, ... }

// tokens/web.css — CSS vars para uso via CSS Modules
:root {
  --color-primary: #2563EB;
  --font-h1-size: 40px;
  ...
}
```

CSS Modules usam `var(--color-primary)`. React Native importa `colors.primary` diretamente.

---

## 5. Inventário de Componentes

### Atoms (5)

**Button**
- Variantes: `primary | secondary | success | danger`
- Tamanhos: `md` (padrão), `sm`
- Estado: `disabled`, `loading`

**Input**
- Tipos: `text | select | search | datepicker`
- Estados: `default | filled | error`
- Prop `errorMessage` para texto de erro inline

**Badge**
- Variantes: `concluido | em-andamento | pendente | reprovado | agendado`
- Cada variante tem cor de fundo + ícone + label pré-definidos

**ProgressBar**
- Prop `value: number` (0–100)
- Cor muda: 0–49 → warning, 50–99 → primary, 100 → success

**IconButton**
- Ícones: `camera | search | plus | edit | trash | arrow-right`
- Variante `ghost` (sem fundo)

### Molecules (6)

**VehicleCard**
- Imagem do veículo + placa + modelo + ano + km
- Badge de status + ProgressBar
- Props: `plate`, `model`, `year`, `km`, `status`, `progress`

**StatCard**
- Número grande + label + variação percentual (↑↓)
- Props: `value`, `label`, `change`, `changeDirection`

**ChecklistItem**
- Estados: `conforme | pendente | nao-conforme`
- Label do item + sublabel contextual
- Ícone muda por estado (check / vazio / warning)

**UploadArea**
- Drag & drop + click to select
- Aceita PNG/JPG até 10MB
- Estado: `idle | dragging | uploading | success | error`

**OcrResult**
- Tipo: `placa | hodometro`
- Imagem miniatura + resultado textual + badge `Validado`

**Modal**
- Genérico: título + corpo (slot) + ações (cancelar/confirmar)
- Variante `warning` com ícone amarelo (ex: confirmação de aprovação)

### Organisms (3)

**Sidebar** *(web only)*
- Logo + lista de nav links + item ativo destacado
- Links: Dashboard, Frota, Checklist, Vistorias, Auditoria, Relatórios, Configurações, Usuários
- Collapsible (ícone only) em breakpoints menores

**BottomNav** *(mobile only)*
- 5 tabs: Início, Vistorias, (câmera central destacada), Alertas, Perfil
- Badge numérico em Alertas
- Tab central (câmera) com estilo elevado

**DataTable**
- Colunas configuráveis via prop `columns`
- Coluna de status renderiza `Badge`
- Coluna de ações: ícones view + edit
- Paginação simples (prev/next + total)

### Domain (3)

**GeoTag**
- Ícone de pin + cidade/estado + label `Localização validada`

**UniqueCode**
- Código `VST-XXXXXX` em destaque + botão copy-to-clipboard

**AiPhotoResult**
- Variante `aprovada`: ícone check verde + "Foto aprovada pela IA"
- Variante `recusada`: ícone X vermelho + motivo da recusa

---

## 6. Storybook

- **Versão:** Storybook 8
- **Builder:** `@storybook/react-vite`
- **Addons:** `@storybook/addon-a11y`, `@storybook/addon-interactions`
- **Porta:** `6006`
- **Cobertura:** todas as variantes/estados de cada componente como stories separadas
- **Testes:** smoke test via `@storybook/test` — renderiza sem crash

React Native **não** entra no Storybook — validado via Expo Go no device/emulador.

---

## 7. Package Exports

```json
{
  "name": "@vistoria/ui",
  "exports": {
    "./tokens": "./src/tokens/index.ts",
    "./atoms/*": "./src/atoms/*/index.ts",
    "./molecules/*": "./src/molecules/*/index.ts",
    "./organisms/*": "./src/organisms/*/index.ts",
    "./domain/*": "./src/domain/*/index.ts"
  }
}
```

Consumo:
```ts
import { Button } from '@vistoria/ui/atoms/Button'
import { colors } from '@vistoria/ui/tokens'
```

---

## 8. Turbo Pipeline

Adicionar ao `turbo.json`:
```json
{
  "tasks": {
    "storybook": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"] }
  }
}
```

---

## 9. Fora de Escopo

- Style Dictionary / geração automática de tokens (adicionar se escalar)
- Temas dark mode (fase futura)
- React Native Storybook
- Animações / motion (fase futura)
