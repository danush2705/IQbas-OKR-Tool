import { useMemo, useState } from "react";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { OrganizationChart } from "@/components/dashboard/OrganizationChart";
import { OKRTable } from "@/components/dashboard/OKRTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { objectives as mockObjectives } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Target, TrendingUp } from "lucide-react";

const Index = () => {
  const [view, setView] = useState<"all" | "my" | "company">("all");
  const { user } = useAuth();

  // Derive filtered objectives according to selected view
  const filteredObjectives = useMemo(() => {
    const ceoId = "ceo-1";
    return mockObjectives.filter((o) => {
      if (view === "all") return true;
      if (view === "company") return o.owner === ceoId;
      if (view === "my") return o.owner === (user as any)?.id;
      return true;
    });
  }, [view, user]);

  // Summary metrics based on filtered objectives
  const totalObjectives = filteredObjectives.length;
  const achievedObjectives = filteredObjectives.filter((obj) => obj.status === "achieved").length;
  const totalPossibleScore = filteredObjectives.reduce((sum, obj) => sum + (obj.totalScore || 0), 0);
  const totalActualScore = filteredObjectives.reduce((sum, obj) => sum + (obj.actualScore || 0), 0);
  const overallProgress = totalPossibleScore > 0 ? Math.round((totalActualScore / totalPossibleScore) * 100) : 0;
  return (
      <div className="space-y-8 fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor company-wide OKR progress and team performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">Q1 2025</div>
              <div className="text-xs text-muted-foreground">Financial Year 2025-26</div>
            </div>
          </div>
        </div>
        {/* Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
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
        
        {/* Metrics Overview */}
        <MetricsCards />
        
        {/* Organization Chart */}
        <OrganizationChart view={view} onChangeView={setView} />
        
        {/* OKR Table */}
        <OKRTable view={view} />
      </div>
  );
};

export default Index;
