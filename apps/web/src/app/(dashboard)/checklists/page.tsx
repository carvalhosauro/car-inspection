import { ClipboardList } from "lucide-react";
import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { TemplateEditor } from "@/components/template-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default async function ChecklistsPage() {
  const { denied } = await requireAction("crudTemplates");
  if (denied)
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
        Apenas o gestor gerencia templates de checklist.
      </p>
    );

  const api = await serverApi();
  const { items } = await api.base.templates.list();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Templates de checklist"
        description="Modelos que definem os itens e provas exigidas em cada vistoria."
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">Nenhum template criado ainda. Crie o primeiro abaixo.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.id} className="transition-shadow hover:shadow-elevated">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                </span>
                <CardTitle>{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t.items.length} {t.items.length === 1 ? "item" : "itens"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Novo template</h2>
          <p className="text-sm text-muted-foreground">Monte os itens e requisitos de prova do checklist.</p>
        </div>
        <TemplateEditor />
      </div>
    </div>
  );
}
