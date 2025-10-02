import { useState } from "react";
import { OrganizationChart } from "@/components/dashboard/OrganizationChart";
import { Building2 } from "lucide-react";

export default function Organization() {
  const [view, setView] = useState<"all" | "my" | "company">("all");
  return (
      <div className="space-y-8 fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Organization Management</h1>
            <p className="text-muted-foreground mt-1">Manage team structure and hierarchy</p>
          </div>
        </div>
        
        <OrganizationChart view={view} onChangeView={setView} />
      </div>
  );
}