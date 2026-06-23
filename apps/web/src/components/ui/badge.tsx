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

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  status?: string;
}

export function Badge({ className, tone, status, children, ...props }: BadgeProps) {
  const resolved =
    tone ?? toneForStatus(status ?? (typeof children === "string" ? children : undefined));
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        TONE_CLASSES[resolved],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
