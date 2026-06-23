import { useState, useEffect } from "react";

export interface UniqueCodeProps {
  code: string;
  onCopied?: () => void;
}

export const CODE_PREFIX = "VST";
export const CODE_LENGTH = 6;

const CODE_RE = new RegExp(`^${CODE_PREFIX}-[A-Z0-9]{${CODE_LENGTH}}$`);

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}

export function useCopied(durationMs = 1500) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), durationMs);
    return () => clearTimeout(timer);
  }, [copied, durationMs]);
  return [copied, setCopied] as const;
}
