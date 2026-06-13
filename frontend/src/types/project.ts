import type { ProjectStatus } from "./enums";
import type { ProjectMember } from "./member";
import type { ExperimentRecord } from "./experiment";

export type ResearchProject = {
  id: string;
  name: string;
  projectNo: string;
  leaderId: string;
  direction: "Biology" | "Chemistry" | "Physics" | "Materials" | "CS" | "Other";
  startedAt: string;
  expectedEndAt: string;
  actualEndAt?: string;
  status: ProjectStatus;
  totalBudget: number;
  usedBudget: number;
  members?: ProjectMember[];
  timeline?: ExperimentRecord[];
};
