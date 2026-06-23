import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, ClipboardList } from "lucide-react";
import { serverApi } from "@/lib/api-server";
import { requireAction } from "@/lib/server-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { NewTemplateButton } from "@/components/new-template-button";

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
    <div className="space-y-6">
      <PageHeader
        title="Templates de checklist"
        description="Modelos que definem os itens e provas exigidas em cada vistoria."
        actions={<NewTemplateButton />}
      />

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm text-muted-foreground">
              Nenhum template criado ainda. Clique em &ldquo;Adicionar&rdquo; para criar o primeiro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Link key={t.id} href={`/checklists/${t.id}` as Route} className="group block">
              <Card className="transition-shadow group-hover:shadow-elevated">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <ClipboardList className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="flex-1">{t.name}</CardTitle>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.items.length} {t.items.length === 1 ? "item" : "itens"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
