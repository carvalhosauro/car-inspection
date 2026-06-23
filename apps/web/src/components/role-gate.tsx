import type { ReactNode } from "react";
import type { UserRole } from "@vistoria/contracts";
import { can, type Action } from "@/lib/rbac";

/** Renders children only if `role` is allowed to perform `action`. */
export function RoleGate({
  role,
  action,
  children,
  fallback = null,
}: {
  role: UserRole;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return can(role, action) ? <>{children}</> : <>{fallback}</>;
}
