import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { objectivesData } from "@/data/objectives";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend } from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { generateExportData } from "@/utils/exportUtils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

type DateRangeFilter = "this-quarter" | "last-quarter" | "ytd";

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>("this-quarter");
  const [department, setDepartment] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof typeof objectivesData[number] | "progress">("progress");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const departments = useMemo(() => {
    return ["all", ...Array.from(new Set(objectivesData.map(o => o.department)))];
  }, []);

  // Basic filter implementation (dateRange is a placeholder for now)
  const filtered = useMemo(() => {
    const list = objectivesData.filter(o => department === "all" ? true : o.department === department);
    return [...list].sort((a, b) => {
      const av = (a as any)[sortKey] ?? 0;
      const bv = (b as any)[sortKey] ?? 0;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [department, sortKey, sortDir]);

  // KPI metrics
  const totalObjectives = filtered.length;
  const achievedObjectives = filtered.filter((obj) => obj.status === "achieved").length;
  const totalPossibleScore = filtered.reduce((sum, obj) => sum + (obj.totalScore || 0), 0);
  const totalActualScore = filtered.reduce((sum, obj) => sum + (obj.actualScore || 0), 0);
  const overallProgress = totalPossibleScore > 0 ? Math.round((totalActualScore / totalPossibleScore) * 100) : 0;

  // Derived status buckets
  const statusBucket = (obj: typeof objectivesData[number]) => {
    if (obj.status === "achieved") return "Achieved";
    if (obj.status === "not-achieved") return "Not Achieved";
    // Heuristic for 'On Track' vs 'At Risk'
    return obj.progress >= 60 ? "On Track" : "At Risk";
  };

  const statusCounts = useMemo(() => {
    const buckets = { "On Track": 0, "At Risk": 0, "Achieved": 0, "Not Achieved": 0 } as Record<string, number>;
    filtered.forEach(o => { buckets[statusBucket(o)] += 1; });
    return buckets;
  }, [filtered]);

  // Charts data
  const progressOverTimeData = useMemo(() => {
    // Simple monthly placeholders; in real use, compute historical trend
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const values = labels.map(() => overallProgress);
    return {
      labels,
      datasets: [
        {
          label: "Overall Progress %",
          data: values,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          pointRadius: 2,
        },
      ],
    };
  }, [overallProgress]);

  const statusDistributionData = useMemo(() => {
    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"],
          borderWidth: 0,
        },
      ],
    };
  }, [statusCounts]);

  const performanceByDeptData = useMemo(() => {
    const deptToProgress: Record<string, number[]> = {};
    filtered.forEach(o => {
      if (!deptToProgress[o.department]) deptToProgress[o.department] = [];
      deptToProgress[o.department].push(o.progress);
    });
    const labels = Object.keys(deptToProgress);
    const data = labels.map(l => {
      const arr = deptToProgress[l];
      return arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
    });
    return {
      labels,
      datasets: [
        {
          label: "Avg Progress %",
          data,
          backgroundColor: "#6366f1",
          borderWidth: 0,
        },
      ],
    };
  }, [filtered]);

  // Prepare CSV export payload using reusable utility
  const { data: exportData, headers: exportHeaders } = generateExportData(filtered);
  const csvReport = {
    data: exportData,
    headers: exportHeaders,
    filename: "OKR_Export.csv",
  };

  const toggleSort = (key: keyof typeof objectivesData[number] | "progress") => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze trends and team performance</p>
        </div>

        {/* Filter Bar */}
        <Card className="p-4 card-elevated">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={dateRange} onValueChange={(v: DateRangeFilter) => setDateRange(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>

              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d === "all" ? "All Departments" : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Export to CSV
                </Button>
              </CSVLink>
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard value={`${overallProgress}%`} label="Overall Progress" />
          <StatCard value={filtered.filter(o => statusBucket(o) === "On Track").length} label="Objectives On Track" />
          <StatCard value={filtered.filter(o => statusBucket(o) === "At Risk").length} label="Objectives At Risk" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="p-4 card-elevated">
            <div className="text-sm font-medium text-card-foreground mb-3">Progress Over Time</div>
            <div className="h-64">
              <Line data={progressOverTimeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } } }} />
            </div>
          </Card>

          <Card className="p-4 card-elevated">
            <div className="text-sm font-medium text-card-foreground mb-3">OKR Status Distribution</div>
            <div className="h-64">
              <Doughnut data={statusDistributionData} options={{ responsive: true, maintainAspectRatio: false, cutout: "60%", plugins: { legend: { display: true, position: "bottom" } } }} />
            </div>
          </Card>

          <Card className="p-4 card-elevated xl:col-span-1">
            <div className="text-sm font-medium text-card-foreground mb-3">Performance by Department</div>
            <div className="h-64">
              <Bar data={performanceByDeptData} options={{ indexAxis: "y" as const, responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 0, max: 100, ticks: { stepSize: 20 } } } }} />
            </div>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="card-elevated">
          <div className="p-4 border-b border-card-border">
            <div className="text-sm font-medium text-card-foreground">Objectives (Filtered)</div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>Objective</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("owner")}>Owner</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>Status</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("progress")}>Progress</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => toggleSort("department")}>Department</TableHead>
                  <TableHead>Timeline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.title}</TableCell>
                    <TableCell>{o.owner}</TableCell>
                    <TableCell className="capitalize">{o.status.replace("-", " ")}</TableCell>
                    <TableCell>{o.progress}%</TableCell>
                    <TableCell>{o.department}</TableCell>
                    <TableCell>{o.startDate} - {o.endDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}


