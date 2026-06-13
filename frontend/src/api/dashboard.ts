import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { ResearchProject } from "../types/project";
import type { Reagent } from "../types/reagent";

export type DashboardSummary = {
  activeProjects: ResearchProject[];
  recentExperimentCount: number;
  lowStockReagents: Reagent[];
  pendingReviews: number;
};

export const dashboardApi = {
  summary: () => request<DashboardSummary>(API_PATHS.dashboard)
};
