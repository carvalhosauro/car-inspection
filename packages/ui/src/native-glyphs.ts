import type { BadgeIcon } from "./atoms/Badge/Badge.logic";
import type { AiIcon } from "./domain/AiPhotoResult/AiPhotoResult.logic";
import type { GeoStatus } from "./domain/GeoTag/GeoTag.logic";
import type { IconName } from "./atoms/IconButton/IconButton.logic";

export const BADGE_GLYPHS: Record<BadgeIcon, string> = {
  CheckCircle2: "✓",
  Clock3: "•",
  AlertCircle: "!",
  XCircle: "✕",
  CalendarClock: "◷",
};

export const AI_PHOTO_GLYPHS: Record<AiIcon, string> = {
  CheckCircle2: "✓",
  XCircle: "✕",
};

export const GEO_TAG_GLYPHS: Record<GeoStatus, string> = {
  pending: "⏳",
  acquired: "📍",
  error: "⚠",
};

export const ICON_BUTTON_GLYPHS: Record<IconName, string> = {
  camera: "📷",
  search: "🔍",
  plus: "+",
  edit: "✎",
  trash: "🗑",
  "arrow-right": "→",
};
