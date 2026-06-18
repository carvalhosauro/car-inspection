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
