import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateOnSuccess(queryKey: readonly unknown[]) {
  const qc = useQueryClient();
  return { onSuccess: () => qc.invalidateQueries({ queryKey }) };
}
