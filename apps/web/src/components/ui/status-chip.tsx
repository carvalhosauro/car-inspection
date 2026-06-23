import * as React from "react";
import { cn } from "@/lib/utils";
import { toneForStatus, type Tone } from "@/lib/status-tone";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  primary: "bg-accent text-accent-foreground ring-primary/20",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
};

const DOT_CLASSES: Record<Tone, string> = {
  neutral: "bg-muted-foreground/60",
  info: "bg-sky-500",
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Override the auto-detected tone. */
  tone?: Tone;
  /** Raw status value used to infer the tone when `tone` is not given. */
  status?: string;
  /** Show a leading status dot (default true). */
  dot?: boolean;
}

export function StatusChip({ className, tone, status, dot = true, children, ...props }: StatusChipProps) {
  const resolved =
    tone ?? toneForStatus(status ?? (typeof children === "string" ? children : undefined));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        TONE_CLASSES[resolved],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSES[resolved])} aria-hidden="true" />}
      {children}
    </span>
  );
}
