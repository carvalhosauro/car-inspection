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
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Avarias por veículo">
        <BarChart data={damages}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="plate" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="damages" fill="hsl(var(--primary))" />
        </BarChart>
      </ChartCard>

      <ChartCard title="Pendentes por vistoriador">
        <BarChart data={pending}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="pending" fill="hsl(var(--primary))" />
        </BarChart>
      </ChartCard>

      <ChartCard title="Tempo médio de vistoria (min)">
        <BarChart data={avgTime}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgMinutes" fill="hsl(var(--primary))" />
        </BarChart>
      </ChartCard>
    </div>
  );
}
