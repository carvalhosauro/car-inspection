"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { JSXElementConstructor, ReactElement } from "react";
import type {
  DamagesByVehicle,
  PendingByInspector,
  AvgInspectionTime,
} from "@/lib/web-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportCharts({
  damages,
  pending,
  avgTime,
}: {
  damages: DamagesByVehicle[];
  pending: PendingByInspector[];
  avgTime: AvgInspectionTime[];
}) {
  const CHARTS = [
    { title: "Avarias por veículo", data: damages as object[], xKey: "plate", dataKey: "damages", allowDecimals: false as boolean | undefined },
    { title: "Pendentes por vistoriador", data: pending as object[], xKey: "name", dataKey: "pending", allowDecimals: false as boolean | undefined },
    { title: "Tempo médio de vistoria (min)", data: avgTime as object[], xKey: "type", dataKey: "avgMinutes", allowDecimals: undefined as boolean | undefined },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {CHARTS.map((c) => (
        <ChartCard key={c.title} title={c.title}>
          <BarChart data={c.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={c.xKey} />
            <YAxis allowDecimals={c.allowDecimals} />
            <Tooltip />
            <Bar dataKey={c.dataKey} fill="hsl(var(--primary))" />
          </BarChart>
        </ChartCard>
      ))}
    </div>
  );
}
