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
