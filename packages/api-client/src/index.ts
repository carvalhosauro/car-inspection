import type {
  LoginInput, TokenPair, MeOutput, VehicleDto, CreateVehicleInput,
  ChecklistTemplateDto, CreateChecklistTemplateInput, InspectionDto,
  CreateInspectionInput, InspectionItemDto, CreateEvidenceInput, EvidenceDto,
  ItemStatus,
} from "@vistoria/contracts";
import { createHttp, type TokenGetter } from "./http";

export { ApiError } from "./http";
export type { TokenGetter } from "./http";

type Page<T> = { items: T[]; nextCursor: string | null };

/** Response of `POST /v1/uploads/sign` (Supabase signed upload — signedUrl is absolute, token embedded). */
export interface SignUploadResponse {
  filePath: string;
  signedUrl: string;
  token: string;
}

export function createApiClient(baseUrl: string, getToken: TokenGetter) {
  const http = createHttp(baseUrl, getToken);
  return {
    auth: {
      login: (b: LoginInput) => http.post<TokenPair>("/v1/auth/login", b),
      me: () => http.get<MeOutput>("/v1/auth/me"),
      refresh: (refreshToken: string) =>
        http.post<{ accessToken: string }>("/v1/auth/refresh", { refreshToken }),
    },
    vehicles: {
      list: () => http.get<Page<VehicleDto>>("/v1/vehicles"),
      create: (b: CreateVehicleInput) => http.post<VehicleDto>("/v1/vehicles", b),
    },
    templates: {
      list: () => http.get<Page<ChecklistTemplateDto>>("/v1/checklist-templates"),
      create: (b: CreateChecklistTemplateInput) => http.post<ChecklistTemplateDto>("/v1/checklist-templates", b),
    },
    inspections: {
      create: (b: CreateInspectionInput) => http.post<InspectionDto>("/v1/inspections", b),
      get: (id: string) => http.get<InspectionDto>(`/v1/inspections/${id}`),
      myToday: () => http.get<{ items: InspectionDto[] }>("/v1/me/inspections?date=today"),
      start: (id: string) => http.post<InspectionDto>(`/v1/inspections/${id}/start`),
      items: (id: string) => http.get<InspectionItemDto[]>(`/v1/inspections/${id}/items`),
      finish: (id: string, b: { geoLat: number; geoLng: number }) =>
        http.post<InspectionDto>(`/v1/inspections/${id}/finish`, b),
      history: () => http.get<Page<InspectionDto>>("/v1/me/inspections/history"),
    },
    evidences: {
      create: (itemId: string, b: CreateEvidenceInput) =>
        http.post<EvidenceDto>(`/v1/inspection-items/${itemId}/evidences`, b),
    },
    inspectionItems: {
      update: (id: string, b: { status?: ItemStatus; justification?: string }) =>
        http.patch<InspectionItemDto>(`/v1/inspection-items/${id}`, b),
      createChild: (id: string, b: { labelSnapshot: string; order?: number }) =>
        http.post<InspectionItemDto>(`/v1/inspection-items/${id}/children`, b),
    },
    uploads: {
      sign: (b: { contentType: string }) =>
        http.post<SignUploadResponse>("/v1/uploads/sign", b),
    },
  };
}
export type ApiClient = ReturnType<typeof createApiClient>;
