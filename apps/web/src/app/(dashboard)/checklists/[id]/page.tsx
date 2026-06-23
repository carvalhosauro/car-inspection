import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { ApiError } from "@/lib/web-api";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { Badge } from "@/components/ui/badge";

export default async function ChecklistDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { denied } = await requireAction("crudTemplates");
  if (denied)
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
        Apenas o gestor gerencia templates de checklist.
      </p>
    );

  const api = await serverApi();
  let template;
  try {
    template = await api.templates.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const items = [...template.items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Link
        href="/checklists"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para checklists
      </Link>

      <PageHeader
        title={template.name}
        description={`${items.length} ${items.length === 1 ? "item" : "itens"} no checklist`}
        actions={
          <StatusChip tone={template.active ? "success" : "neutral"}>
            {template.active ? "Ativo" : "Inativo"}
          </StatusChip>
        }
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Este template ainda não possui itens.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const reqs = [...item.requirements].sort((a, b) => a.order - b.order);
            return (
              <Card key={item.id}>
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    {item.label}
                  </CardTitle>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {reqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem provas obrigatórias.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {reqs.map((r) => (
                        <Badge key={r.id} tone={r.required ? "primary" : "neutral"}>
                          {r.kind.replace(/_/g, " ")}
                          {r.required ? " *" : ""}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
