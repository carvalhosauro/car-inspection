import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api-server";
import { can, type Action } from "@/lib/rbac";

export async function requireAction(action: Action) {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (!can(session.role, action)) {
    return { session, denied: true } as const;
  }
  return { session, denied: false } as const;
}
