import type { InspectionItemDto, EvidenceDto } from "@vistoria/contracts";
import type { LaudoInspection } from "@/lib/web-api";
import { formatDate, formatInspectionStatus } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function EvidenceView({ ev }: { ev: EvidenceDto }) {
  return (
    <div className="rounded-md border border-border p-3">
      <div className="mb-2 flex items-center gap-2">
        <Badge>{ev.kind}</Badge>
        {ev.accepted === true && <span className="text-xs text-green-600">aceita</span>}
        {ev.accepted === false && <span className="text-xs text-destructive">rejeitada</span>}
        {ev.accepted === null && <span className="text-xs text-muted-foreground">pendente</span>}
      </div>
      {ev.kind === "photo" && ev.filePath && (
        // filePath holds a signed URL returned by the API for display.
        <img src={ev.filePath} alt={`Evidência ${ev.kind}`} className="max-h-48 rounded-md" />
      )}
      {ev.value && (
        <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
          {JSON.stringify(ev.value)}
        </pre>
      )}
    </div>
  );
}

function ItemView({ item }: { item: InspectionItemDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{item.labelSnapshot}</span>
          <Badge>{item.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.justification && (
          <p className="text-sm text-muted-foreground">Justificativa: {item.justification}</p>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {item.evidences.map((ev) => (
            <EvidenceView key={ev.id} ev={ev} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function InspectionLaudo({ laudo }: { laudo: LaudoInspection }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laudo da vistoria</h1>
        <Badge>{formatInspectionStatus(laudo.status)}</Badge>
      </div>

      <Card>
        <CardContent className="grid gap-2 p-6 text-sm md:grid-cols-2">
          <p><span className="text-muted-foreground">Código único: </span><span className="font-mono">{laudo.uniqueCode ?? "—"}</span></p>
          <p><span className="text-muted-foreground">Resultado: </span>{laudo.result ?? "—"}</p>
          <p><span className="text-muted-foreground">Início: </span>{formatDate(laudo.startedAt)}</p>
          <p><span className="text-muted-foreground">Fim: </span>{formatDate(laudo.finishedAt)}</p>
          <p>
            <span className="text-muted-foreground">Geo: </span>
            {laudo.geoLat !== null && laudo.geoLng !== null ? `${laudo.geoLat}, ${laudo.geoLng}` : "—"}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {laudo.items.map((item) => (
          <ItemView key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
