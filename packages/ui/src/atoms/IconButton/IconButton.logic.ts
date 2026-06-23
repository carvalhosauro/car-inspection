export type IconName = "camera" | "search" | "plus" | "edit" | "trash" | "arrow-right";

export interface IconButtonProps {
  icon: IconName;
  ariaLabel: string;
  ghost?: boolean;
  onPress?: () => void;
}
