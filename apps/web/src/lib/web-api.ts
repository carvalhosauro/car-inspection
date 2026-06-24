import {
  createApiClient,
  ApiError,
  type ApiClient,
  type TokenGetter,
} from "@vistoria/api-client";
import type {
  VehicleDto,
  UpdateVehicleInput,
  ChecklistTemplateDto,
  InspectionDto,
  InspectionItemDto,
  EvidenceDto,
  UserDto,
  CreateUserInput,
  UpdateUserInput,
  AuditInput,
  InspectionStatus,
} from "@vistoria/contracts";

export { ApiError };

export interface ReportsSummary {
  inspections: number;
  pending: number;
  approved: number;
  rejected: number;
}
export interface DamagesByVehicle {
  vehicleId: string;
  plate: string;
  damages: number;
}
export interface PendingByInspector {
  inspectorId: string;
  name: string;
  pending: number;
}
export interface AvgInspectionTime {
  type: string;
  avgMinutes: number;
}
export interface LaudoInspection extends InspectionDto {
  items: InspectionItemDto[];
}
export interface InspectionListFilters {
  status?: InspectionStatus;
  inspector?: string;
  vehicle?: string;
  from?: string;
  to?: string;
}

/** Bearer-fetch helper sharing the same convention as @vistoria/api-client. */
async function call<T>(
  baseUrl: string,
  getToken: TokenGetter,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  // caller is responsible for ensuring T matches the API contract
  let data: unknown;
  try {
    data = text ? (JSON.parse(text) as unknown) : undefined;
  } catch (err) {
    console.error("[web-api] parse error:", { status: res.status, text: text.slice(0, 200) });
    throw err;
  }
  if (!res.ok) {
    const errData = data as Record<string, unknown> | undefined;
    throw new ApiError(
      res.status,
      (errData?.code as string) ?? "unknown",
      (errData?.message as string) ?? res.statusText,
      errData?.details,
    );
  }
  return data as T;
}

function buildQuery(filters: InspectionListFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.inspector) params.set("inspector", filters.inspector);
  if (filters.vehicle) params.set("vehicle", filters.vehicle);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export interface WebApi {
  base: ApiClient;
  vehicles: {
    update: (id: string, body: UpdateVehicleInput) => Promise<VehicleDto>;
    remove: (id: string) => Promise<void>;
  };
  templates: {
    get: (id: string) => Promise<ChecklistTemplateDto>;
  };
  inspections: {
    list: (filters: InspectionListFilters) => Promise<{ items: InspectionDto[]; nextCursor: string | null }>;
    laudo: (id: string) => Promise<LaudoInspection>;
    audit: (id: string, body: AuditInput) => Promise<InspectionDto>;
  };
  inspectors: {
    list: () => Promise<{ items: UserDto[] }>;
  };
  users: {
    list: () => Promise<{ items: UserDto[]; nextCursor: string | null }>;
    create: (body: CreateUserInput) => Promise<UserDto>;
    update: (id: string, body: UpdateUserInput) => Promise<UserDto>;
    remove: (id: string) => Promise<void>;
  };
  reports: {
    summary: () => Promise<ReportsSummary>;
    damagesByVehicle: () => Promise<DamagesByVehicle[]>;
    pendingByInspector: () => Promise<PendingByInspector[]>;
    avgInspectionTime: () => Promise<AvgInspectionTime[]>;
  };
}

export function createWebApi(baseUrl: string, getToken: TokenGetter): WebApi {
  const base = createApiClient(baseUrl, getToken);
  const c = <T>(method: string, path: string, body?: unknown) =>
    call<T>(baseUrl, getToken, method, path, body);

  return {
    base,
    vehicles: {
      update: (id, body) => c<VehicleDto>("PATCH", `/v1/vehicles/${id}`, body),
      remove: (id) => c<void>("DELETE", `/v1/vehicles/${id}`),
    },
    templates: {
      get: (id) => c<ChecklistTemplateDto>("GET", `/v1/checklist-templates/${id}`),
    },
    inspections: {
      list: (filters) =>
        c<{ items: InspectionDto[]; nextCursor: string | null }>(
          "GET",
          `/v1/inspections${buildQuery(filters)}`,
        ),
      laudo: (id) => c<LaudoInspection>("GET", `/v1/inspections/${id}`),
      audit: (id, body) => c<InspectionDto>("PATCH", `/v1/inspections/${id}/audit`, body),
    },
    inspectors: {
      list: () => c<{ items: UserDto[] }>("GET", "/v1/inspectors"),
    },
    users: {
      list: () => c<{ items: UserDto[]; nextCursor: string | null }>("GET", "/v1/users"),
      create: (body) => c<UserDto>("POST", "/v1/users", body),
      update: (id, body) => c<UserDto>("PATCH", `/v1/users/${id}`, body),
      remove: (id) => c<void>("DELETE", `/v1/users/${id}`),
    },
    reports: {
      summary: () => c<ReportsSummary>("GET", "/v1/reports/summary"),
      damagesByVehicle: async () => {
        const res = await c<{ items: { vehicleId: string; damageCount: number }[] }>(
          "GET",
          "/v1/reports/damages-by-vehicle",
        );
        return (res.items ?? []).map((i) => ({
          vehicleId: i.vehicleId,
          plate: i.vehicleId.slice(0, 8),
          damages: i.damageCount,
        }));
      },
      pendingByInspector: async () => {
        const res = await c<{ items: { inspectorId: string; pendingCount: number }[] }>(
          "GET",
          "/v1/reports/pending-by-inspector",
        );
        return (res.items ?? []).map((i) => ({
          inspectorId: i.inspectorId,
          name: i.inspectorId.slice(0, 8),
          pending: i.pendingCount,
        }));
      },
      avgInspectionTime: async () => {
        const res = await c<{ avgSeconds: number | null }>("GET", "/v1/reports/avg-inspection-time");
        if (res.avgSeconds === null || res.avgSeconds === undefined) return [];
        return [{ type: "Média geral", avgMinutes: Math.round(res.avgSeconds / 60) }];
      },
    },
  };
}
