export interface UniqueCodeProps {
  code: string;
  onCopied?: () => void;
}

const CODE_RE = /^VST-[A-Z0-9]{6}$/;

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}
