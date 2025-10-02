export const getStatusBorder = (status?: string) => {
  const s = (status || "").toLowerCase();
  if (s === "achieved" || s === "done") return "border-l-4 border-green-500";
  if (s === "in progress" || s === "in-progress") return "border-l-4 border-orange-500";
  // default / to-do / not started
  return "border-l-4 border-gray-400";
};
