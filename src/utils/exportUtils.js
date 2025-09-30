// src/utils/exportUtils.js

export const generateExportData = (objectives) => {
  // Define the headers for your CSV file
  const headers = [
    { label: "Objective Title", key: "title" },
    { label: "Owner", key: "owner" },
    { label: "Status", key: "status" },
    { label: "Progress (%)", key: "progress" },
    { label: "Target", key: "target" },
    { label: "Actual", key: "actual" },
    { label: "Start Date", key: "startDate" },
    { label: "End Date", key: "endDate" },
  ];

  // Format the data to match the headers and calculate progress
  const data = (objectives || []).map((obj) => ({
    ...obj,
    progress: typeof obj.target === "number" && obj.target !== 0
      ? Math.round(((obj.actual ?? 0) / obj.target) * 100)
      : 0,
  }));

  return { data, headers };
};
