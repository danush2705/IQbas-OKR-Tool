import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Calendar,
  Users,
  Award
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "info";
}

function MetricCard({ title, value, subtitle, trend, trendValue, icon, color }: MetricCardProps) {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground", 
    warning: "bg-warning text-warning-foreground",
    info: "bg-info text-info-foreground"
  };

  const trendClasses = {
    up: "text-success",
    down: "text-danger", 
    neutral: "text-muted-foreground"
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Clock;

  return (
    <Card className="card-elevated interactive-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shadow-card`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-3xl font-bold text-card-foreground">
              {value}
            </div>
            
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-4 h-4 ${trendClasses[trend]}`} />
              <span className={`text-sm font-medium ${trendClasses[trend]}`}>
                {trendValue}
              </span>
              <span className="text-sm text-muted-foreground">vs last period</span>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export function MetricsCards() {
  const metrics = [
    {
      title: "Total Objectives",
      value: "12",
      subtitle: "Active OKRs",
      trend: "up" as const,
      trendValue: "+3",
      icon: <Target className="w-6 h-6" />,
      color: "primary" as const
    },
    {
      title: "Completion Rate",
      value: "78%",
      subtitle: "Overall Progress",
      trend: "up" as const,
      trendValue: "+5.2%",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "success" as const
    },
    {
      title: "Key Results",
      value: "45",
      subtitle: "In Progress",
      trend: "neutral" as const,
      trendValue: "0",
      icon: <Award className="w-6 h-6" />,
      color: "info" as const
    },
    {
      title: "At Risk",
      value: "8",
      subtitle: "Need Attention",
      trend: "down" as const,
      trendValue: "-2",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "warning" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}