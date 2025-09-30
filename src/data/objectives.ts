export interface ObjectiveData {
  id: string;
  title: string;
  owner: string;
  status: "achieved" | "in-progress" | "not-achieved" | "pending";
  progress: number;
  target: number;
  actual: number;
  totalScore: number;
  plannedScore: number;
  actualScore: number;
  startDate: string;
  endDate: string;
  department: string;
}

export const objectivesData: ObjectiveData[] = [
  {
    id: "1",
    title: "Launch New Marketing Campaign to Increase Brand Awareness",
    owner: "John Doe",
    status: "in-progress",
    progress: 68,
    target: 100,
    actual: 68,
    totalScore: 42,
    plannedScore: 45.5,
    actualScore: 40.2,
    startDate: "15-May-25",
    endDate: "30-Sep-25",
    department: "Marketing",
  },
  {
    id: "2",
    title: "Enhance Customer Satisfaction and Retention Rates",
    owner: "John Doe",
    status: "achieved",
    progress: 92,
    target: 100,
    actual: 92,
    totalScore: 38,
    plannedScore: 36.0,
    actualScore: 34.8,
    startDate: "01-Apr-25",
    endDate: "31-Dec-25",
    department: "Customer Success",
  },
  {
    id: "3",
    title: "Improve Internal Operational Efficiency by Q4",
    owner: "John Doe",
    status: "in-progress",
    progress: 54,
    target: 100,
    actual: 54,
    totalScore: 29,
    plannedScore: 31.3,
    actualScore: 27.1,
    startDate: "10-Jun-25",
    endDate: "31-Mar-26",
    department: "Operations",
  },
];


