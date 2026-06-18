import type {
  LoginInput, TokenPair, MeOutput, VehicleDto, CreateVehicleInput,
  ChecklistTemplateDto, CreateChecklistTemplateInput, InspectionDto,
  CreateInspectionInput, InspectionItemDto, CreateEvidenceInput, EvidenceDto,
} from "@vistoria/contracts";
import { createHttp, type TokenGetter } from "./http";

export { ApiError } from "./http";
export type { TokenGetter } from "./http";

export function createApiClient(baseUrl: string, getToken: TokenGetter) {
  const http = createHttp(baseUrl, getToken);
  return {
    auth: {
      login: (b: LoginInput) => http.post<TokenPair>("/v1/auth/login", b),
      me: () => http.get<MeOutput>("/v1/auth/me"),
    },
    vehicles: {
      list: () => http.get<{ items: VehicleDto[]; nextCursor: string | null }>("/v1/vehicles"),
      create: (b: CreateVehicleInput) => http.post<VehicleDto>("/v1/vehicles", b),
    },
    templates: {
      list: () => http.get<{ items: ChecklistTemplateDto[]; nextCursor: string | null }>("/v1/checklist-templates"),
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
    },
    evidences: {
      create: (itemId: string, b: CreateEvidenceInput) =>
        http.post<EvidenceDto>(`/v1/inspection-items/${itemId}/evidences`, b),
    },
  };
}
export type ApiClient = ReturnType<typeof createApiClient>;
