import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Target, CheckCircle2, TrendingUp } from "lucide-react";
import { OKRTable } from "@/components/dashboard/OKRTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { objectivesData } from "@/data/objectives";

export default function OKRs() {
  // Summary metrics
  const totalObjectives = objectivesData.length;
  const achievedObjectives = objectivesData.filter((obj) => obj.status === "achieved").length;
  const totalPossibleScore = objectivesData.reduce((sum, obj) => sum + (obj.totalScore || 0), 0);
  const totalActualScore = objectivesData.reduce((sum, obj) => sum + (obj.actualScore || 0), 0);
  const overallProgress = totalPossibleScore > 0 ? Math.round((totalActualScore / totalPossibleScore) * 100) : 0;
  return (
    <DashboardLayout>
      <div className="space-y-8 fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">OKR Management</h1>
            <p className="text-muted-foreground mt-1">Create and manage objectives and key results</p>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard value={totalObjectives} label="Total Objectives">
            <Target className="w-5 h-5 text-blue-500" />
          </StatCard>
          <StatCard value={achievedObjectives} label="Objectives Achieved">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </StatCard>
          <StatCard value={`${overallProgress}%`} label="Overall Progress">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </StatCard>
        </div>

        {/* Objectives Table with Filters/Actions */}
        <OKRTable />
      </div>
    </DashboardLayout>
  );
}