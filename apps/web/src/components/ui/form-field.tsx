import { Label } from "@/components/ui/label";
import { HtmlInput } from "@/components/ui/html-input";
import type { InputHTMLAttributes } from "react";

export function FormField({
  id,
  label,
  ...inputProps
}: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <HtmlInput id={id} {...inputProps} />
    </div>
  );
}
