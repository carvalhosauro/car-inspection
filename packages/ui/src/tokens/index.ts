export const colors = {
  primary: "#2563EB",
  dark: "#0F172A",
  success: "#22C55E",
  successText: "#166534",
  warning: "#F59E0B",
  error: "#EF4444",
  neutralWhite: "#FFFFFF",
  neutral50: "#F8FAFC",
  neutral300: "#CBD5E1",
  neutral600: "#334155",
  successBg: "#DCFCE7",
  primaryBg: "#DBEAFE",
  warningBg: "#FEF3C7",
  errorBg: "#FEE2E2",
  neutralBg: "#F1F5F9",
} as const;

export const typography = {
  h1: { fontSize: 40, fontWeight: "700" },
  h2: { fontSize: 32, fontWeight: "600" },
  h3: { fontSize: 24, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  small: { fontSize: 12, fontWeight: "400" },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export const borderRadius = {
  pill: 9999,
  button: 8,
  card: 12,
  image: 8,
} as const;

export const size = {
  vehicleImageHeight: 140,
  progressTrackHeight: 8,
} as const;

export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type SizeToken = keyof typeof size;
