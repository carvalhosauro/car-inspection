import { type FC } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { useCopied, type UniqueCodeProps } from "./UniqueCode.logic";

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: "flex-start",
  },
  code: {
    fontFamily: "monospace",
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1,
  },
  copy: { fontSize: 12, color: colors.neutral600 },
  copied: { fontSize: 12, color: colors.success, fontWeight: "600" },
});

export const UniqueCode: FC<UniqueCodeProps> = ({ code, onCopied }) => {
  const [copied, setCopied] = useCopied();

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
