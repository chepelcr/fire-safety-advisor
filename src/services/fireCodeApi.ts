/**
 * FireCode CR — API service
 *
 * All requests are SigV4-signed automatically via the Cognito Identity Pool
 * anonymous credentials configured in src/config/amplify.ts.
 * No login required — every visitor gets a unique anonymous IdentityId.
 *
 * Usage:
 *   import "../config/amplify";   // configure once in main.tsx
 *   const groups = await fireCodeApi.getRules({ building_type: "comercial" });
 */

import { get, post } from "aws-amplify/api";

// ── DTOs matching the backend contract ───────────────────────────────────────

export interface RiskDTO {
  level: string;
  impact: string;
  consequence: string;
}

export interface RuleDTO {
  id: string;
  standard: string;
  title: string;
  category: string;
  description: string;
  risk: RiskDTO;
  technical_requirements: string[];
  installation_requirements: string[];
  inspection_requirements: string[];
  failure_risks: string[];
  applies_to: string[];
  conditions: string[];
  keywords: string[];
}

export interface RuleGroupDTO {
  type: string;
  description: string;
  quantity: number;
  rules: RuleDTO[];
}

export enum BuildingType {
  residencial = 1,
  comercial   = 2,
  industrial  = 3,
}

export enum RuleCategory {
  iniciacion    = 1,
  notificacion  = 2,
  monitoreo     = 3,
  accionamiento = 4,
}

export interface PaginationResponse {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface RuleListResponse {
  data: RuleGroupDTO[];
  pagination: PaginationResponse;
}

export interface GetRulesParams {
  building_type?: BuildingType;
  category?: RuleCategory;
  usage?: string;
  area_m2?: number;
  floors?: number;
  occupants?: number;
  ceiling_height_m?: number;
  volume_m3?: number;
  standard?: string;
  page?: number;
  page_size?: number;
}

export interface EvaluateRequest {
  building_type: BuildingType;
  usage: string;
  user_query: string;
  area_m2?: number;
  floors?: number;
  occupants?: number;
  ceiling_height_m?: number;
  volume_m3?: number;
  category?: RuleCategory;
  standard?: string;
}

export interface EvaluateResponse {
  matchedRules: RuleDTO[];
  requirements: string[];
  reference: string[];
  contextCr: string[];
  risk: string;
  foundryUsed: boolean;
}

// ── API client ───────────────────────────────────────────────────────────────

const API_NAME = "FireCodeApi";

function toQueryString(params: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );
}

async function resolveBody<T>(op: { response: Promise<{ body: { json: () => Promise<unknown> } }> }): Promise<T> {
  const resp = await op.response;
  return (await resp.body.json()) as T;
}

export const fireCodeApi = {
  /**
   * GET /rules — returns rules grouped by fire protection category.
   * All params are optional; omitting them returns all groups.
   */
  async getRules(params: GetRulesParams = {}): Promise<RuleListResponse> {
    return resolveBody<RuleListResponse>(
      get({
        apiName: API_NAME,
        path: "/rules",
        options: { queryParams: toQueryString(params as Record<string, unknown>) },
      })
    );
  },

  /**
   * GET /rules/{ruleId} — fetch a single rule by ID.
   * Returns null when the rule is not found (404).
   */
  async getRuleById(ruleId: string): Promise<RuleDTO | null> {
    try {
      return await resolveBody<RuleDTO>(
        get({ apiName: API_NAME, path: `/rules/${encodeURIComponent(ruleId)}` })
      );
    } catch (err: unknown) {
      if (isNotFound(err)) return null;
      throw err;
    }
  },

  /**
   * POST /evaluate — run deterministic filter + AI agent evaluation.
   * `foundryUsed` in the response indicates whether the AI was reached.
   */
  async evaluate(request: EvaluateRequest): Promise<EvaluateResponse> {
    return resolveBody<EvaluateResponse>(
      post({
        apiName: API_NAME,
        path: "/evaluate",
        options: { body: request as unknown as Record<string, unknown> },
      })
    );
  },
};

// ── helpers ───────────────────────────────────────────────────────────────────

function isNotFound(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as { response?: { status?: number }; status?: number };
    return e.response?.status === 404 || e.status === 404;
  }
  return false;
}
