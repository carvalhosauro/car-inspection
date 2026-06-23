/**
 * Central design tokens for the mobile app. Keeping colors, spacing, radii and
 * typography in one place gives every screen a consistent, concise look.
 */

export const colors = {
  // Brand
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryText: "#FFFFFF",

  // Surfaces
  background: "#F1F5F9",
  surface: "#FFFFFF",
  surfaceMuted: "#F8FAFC",
  overlay: "rgba(15, 23, 42, 0.6)",

  // Text
  text: "#0F172A",
  textMuted: "#475569",
  textSubtle: "#64748B",
  textInverse: "#FFFFFF",

  // Lines
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",

  // Semantic
  success: "#16A34A",
  successBg: "#DCFCE7",
  successText: "#166534",

  danger: "#DC2626",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",

  warning: "#D97706",
  warningBg: "#FEF3C7",
  warningText: "#92400E",

  info: "#0284C7",
  infoBg: "#E0F2FE",
  infoText: "#075985",

  neutralBg: "#F1F5F9",
  neutralText: "#475569",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  x2: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: "800" as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: "700" as const, color: colors.text },
  subheading: { fontSize: 16, fontWeight: "700" as const, color: colors.text },
  body: { fontSize: 15, fontWeight: "400" as const, color: colors.text },
  meta: { fontSize: 13, fontWeight: "400" as const, color: colors.textMuted },
  label: { fontSize: 13, fontWeight: "600" as const, color: colors.textMuted },
} as const;

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

/** Tone → badge color set used by StatusBadge. */
export const tones = {
  neutral: { bg: colors.neutralBg, text: colors.neutralText },
  info: { bg: colors.infoBg, text: colors.infoText },
  primary: { bg: "#DBEAFE", text: colors.primaryDark },
  success: { bg: colors.successBg, text: colors.successText },
  warning: { bg: colors.warningBg, text: colors.warningText },
  danger: { bg: colors.dangerBg, text: colors.dangerText },
} as const;

export type Tone = keyof typeof tones;
