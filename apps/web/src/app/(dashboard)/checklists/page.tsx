import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { TemplateEditor } from "@/components/template-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChecklistsPage() {
  const { denied } = await requireAction("crudTemplates");
  if (denied) return <p className="text-muted-foreground">Apenas o gestor gerencia templates de checklist.</p>;

  const api = await serverApi();
  const { items } = await api.base.templates.list();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Templates de checklist</h1>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t.items.length} itens</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold">Novo template</h2>
        <TemplateEditor />
      </div>
    </div>
  );
}
