import type { FC } from "react";
import { Camera, Search, Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import type { IconName, IconButtonProps } from "./IconButton.logic";
import styles from "./IconButton.module.css";

const ICON_COMPONENTS: Record<IconName, typeof Camera> = {
  camera: Camera,
  search: Search,
  plus: Plus,
  edit: Pencil,
  trash: Trash2,
  "arrow-right": ArrowRight
};

export const IconButton: FC<IconButtonProps> = ({ icon, ariaLabel, ghost, onPress }) => {
  const Icon = ICON_COMPONENTS[icon];
  return (
    <button
      type="button"
      className={styles.button}
      data-ghost={ghost ? "true" : "false"}
      aria-label={ariaLabel}
      onClick={onPress}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
};
