// Centralized permission service
import type { OrgUser, Objective, KeyResult, Milestone } from "@/data/mockData";

export const canCreateObjective = (user: OrgUser | null | undefined) => {
  if (!user) return false;
  return user.role === "ceo" || !!user.isAdmin;
};

export const canRequestObjective = (user: OrgUser | null | undefined) => {
  if (!user) return false;
  return user.role === "manager";
};

export const canDeleteObjective = (user: OrgUser | null | undefined, objective?: Objective | null) => {
  if (!user || !objective) return false;
  // Admin cannot delete the CEO's objectives
  if (user.isAdmin && objective.owner === "ceo-1") return false;
  return user.role === "ceo" || !!user.isAdmin;
};

export const canAddMilestone = (user: OrgUser | null | undefined, keyResult: KeyResult) => {
  if (!user) return false;
  // A user can add milestones only to their own assigned Key Results
  return user.id === keyResult.owner;
};

export const canUpdateMilestone = (
  user: OrgUser | null | undefined,
  milestone: Milestone,
  keyResult: KeyResult,
  allUsers: OrgUser[]
) => {
  if (!user) return false;
  // A user can update their own milestones (i.e., when they own the KR)
  if (user.id === keyResult.owner) return true;

  // A manager can update milestones of their direct reports
  const krOwner = allUsers.find((u) => u.id === keyResult.owner);
  if (user.role === "manager" && krOwner?.managerId === user.id) {
    return true;
  }

  return user.role === "ceo" || !!user.isAdmin;
};
