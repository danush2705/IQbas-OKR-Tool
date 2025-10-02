import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { objectives as mockObjectives } from "@/data/mockData";
import { generateExportData } from "@/utils/exportUtils";

export default function SettingsExport() {
  const [period, setPeriod] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [includeObjectives, setIncludeObjectives] = useState(true);
  const [includeKRs, setIncludeKRs] = useState(true);
  const [includeMilestones, setIncludeMilestones] = useState(true);

  const departments = useMemo(() => {
    return ["all", ...Array.from(new Set(mockObjectives.map(o => o.department || "General")))];
  }, []);

  const onGenerate = () => {
    // For now, reuse generateExportData on objectives only; in a full impl we'd include KRs/Milestones
    const filtered = mockObjectives.filter(o => (department === "all" ? true : (o.department || "General") === department));
    const { data, headers } = generateExportData(filtered as any);
    // Build CSV / trigger download via an anchor element
    const csvRows = [headers.map(h => '"'+h.label+'"').join(','), ...data.map(row => headers.map(h => '"'+String((row as any)[h.key] ?? '')+'"').join(','))];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OKR_Export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Export</h1>
          <p className="text-muted-foreground mt-1">Generate customized exports for reporting</p>
        </div>

        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  <SelectItem value="q1-2026">Q1 2026</SelectItem>
                  <SelectItem value="q2-2026">Q2 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(d => (
                    <SelectItem key={d} value={d}>{d === 'all' ? 'All Departments' : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Include</div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeObjectives} onChange={(e)=>setIncludeObjectives(e.target.checked)} /> Objectives
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeKRs} onChange={(e)=>setIncludeKRs(e.target.checked)} /> Key Results
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeMilestones} onChange={(e)=>setIncludeMilestones(e.target.checked)} /> Milestones
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onGenerate}>Generate & Download CSV</Button>
          </div>
        </Card>
      </div>
  );
}
