import type { FC } from "react";
import { Modal as RNModal, View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../../tokens";
import { Button } from "../../atoms/Button/Button.native";
import { resolveModalLabels, type ModalProps } from "./Modal.logic";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md
  },
  dialog: {
    backgroundColor: colors.neutralWhite,
    borderRadius: 12,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 420,
    gap: spacing.md
  },
  title: { fontSize: 24, fontWeight: "600", color: colors.dark },
  body: { gap: spacing.sm },
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
