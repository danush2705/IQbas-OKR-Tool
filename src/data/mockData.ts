// Centralized mock data with nested structure and org chart

export type Role = "ceo" | "manager" | "user" | "hr";
export interface OrgUser {
  id: string;
  name: string;
  role: Role;
  managerId?: string;
  isAdmin?: boolean;
}

export interface Attachment {
  name: string; // display name
  size?: number; // bytes (optional)
  type?: string; // mime type (optional)
}

export interface Milestone {
  id: string;
  title: string;
  status: "To-Do" | "In Progress" | "Done";
  attachments?: Attachment[];
}

export interface KeyResult {
  id: string;
  title: string;
  owner: string; // user id
  status?: "To-Do" | "In Progress" | "Done" | "Achieved";
  milestones: Milestone[];
  attachments?: Attachment[];
}

export interface Objective {
  id: string;
  title: string;
  owner: string; // user id
  department?: string;
  status?: "achieved" | "in-progress" | "not-achieved" | "pending";
  progress?: number;
  target?: number;
  actual?: number;
  totalScore?: number;
  plannedScore?: number;
  actualScore?: number;
  startDate?: string;
  endDate?: string;
  keyResults: KeyResult[];
}

export const orgChartUsers: OrgUser[] = [
  { id: "ceo-1", name: "Alex Riley", role: "ceo" },
  { id: "manager-1", name: "Jane Doe", role: "manager", managerId: "ceo-1" },
  { id: "user-1", name: "John Smith", role: "user", managerId: "manager-1" },
  { id: "user-2", name: "Peter Jones", role: "user", managerId: "manager-1" },
  { id: "hr-1", name: "Susan Reid", role: "hr", managerId: "ceo-1", isAdmin: true },
];

export const objectives: Objective[] = [
  {
    id: "1",
    title: "Launch New Marketing Campaign to Increase Brand Awareness",
    owner: "manager-1",
    department: "Marketing",
    status: "in-progress",
    progress: 68,
    target: 100,
    actual: 68,
    totalScore: 42,
    plannedScore: 45.5,
    actualScore: 40.2,
    startDate: "15-May-25",
    endDate: "30-Sep-25",
    keyResults: [
      {
        id: "kr1",
        title: "Achieve 20% Increase in Website Traffic",
        owner: "user-1",
        milestones: [
          { id: "m1", title: "Launch Google Ads campaign", status: "Done" },
          { id: "m2", title: "Publish 4 new blog posts", status: "In Progress" },
          { id: "m3", title: "Optimize SEO for key pages", status: "To-Do" },
        ],
      },
      {
        id: "kr2",
        title: "Grow organic search impressions by 15%",
        owner: "user-2",
        milestones: [
          { id: "m1", title: "Keyword research refresh", status: "Done" },
          { id: "m2", title: "On-page updates for 10 pages", status: "To-Do" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Enhance Customer Satisfaction and Retention Rates",
    owner: "manager-1",
    department: "Customer Success",
    status: "achieved",
    progress: 92,
    target: 100,
    actual: 92,
    totalScore: 38,
    plannedScore: 36.0,
    actualScore: 34.8,
    startDate: "01-Apr-25",
    endDate: "31-Dec-25",
    keyResults: [
      {
        id: "kr3",
        title: "Reduce churn by 10%",
        owner: "user-1",
        milestones: [
          { id: "m1", title: "Implement exit survey flow", status: "Done" },
          { id: "m2", title: "Create save-offer playbook", status: "Done" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Improve Internal Operational Efficiency by Q4",
    owner: "manager-1",
    department: "Operations",
    status: "in-progress",
    progress: 54,
    target: 100,
    actual: 54,
    totalScore: 29,
    plannedScore: 31.3,
    actualScore: 27.1,
    startDate: "10-Jun-25",
    endDate: "31-Mar-26",
    keyResults: [
      {
        id: "kr4",
        title: "Automate invoice processing",
        owner: "user-2",
        milestones: [
          { id: "m1", title: "Select automation vendor", status: "Done" },
          { id: "m2", title: "Pilot with finance team", status: "In Progress" },
        ],
      },
    ],
  },
];
