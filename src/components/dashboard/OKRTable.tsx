import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddOkrModal } from "@/components/dashboard/AddOkrModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CSVLink } from "react-csv";
import { generateExportData } from "@/utils/exportUtils";
import { useAuth } from "@/context/AuthContext";
import RequestObjectiveModal from "@/components/dashboard/RequestObjectiveModal";
import { objectives as seedObjectives, orgChartUsers, type Objective, type KeyResult, type Milestone, type Attachment } from "@/data/mockData";
import { getStatusBorder } from "@/utils/statusColor";
import { canCreateObjective, canRequestObjective, canAddMilestone, canUpdateMilestone } from "@/services/permissions";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Plus,
  Calendar,
  Target,
  TrendingUp
} from "lucide-react";

// Use centralized mock data (objectives with KRs and milestones)
type FlatOKR = {
  id: string; title: string; owner: string; status: "achieved" | "in-progress" | "not-achieved" | "pending";
  progress: number; target: number; actual: number; totalScore: number; plannedScore: number; actualScore: number;
  startDate: string; endDate: string; department: string;
  ref: Objective;
};

interface Props { view?: "all" | "my" | "company" }
export function OKRTable({ view = "all" }: Props) {
  // Seed from mockData and keep a local mutable copy for interactions
  const [objectives, setObjectives] = useState<Objective[]>(seedObjectives);
  // Provide a flattened view for the table's existing columns
  const okrData: FlatOKR[] = objectives.map(o => ({
    id: o.id,
    title: o.title,
    owner: o.owner,
    status: (o.status ?? "pending") as FlatOKR["status"],
    progress: o.progress ?? 0,
    target: o.target ?? 0,
    actual: o.actual ?? 0,
    totalScore: o.totalScore ?? 0,
    plannedScore: o.plannedScore ?? 0,
    actualScore: o.actualScore ?? 0,
    startDate: o.startDate ?? "",
    endDate: o.endDate ?? "",
    department: o.department ?? "General",
    ref: o,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [timeframe, setTimeframe] = useState('quarterly');
  const { user } = useAuth();

  // Charts removed: donut progress chart column was removed per requirement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [expandedObjectiveIds, setExpandedObjectiveIds] = useState<Record<string, boolean>>({});
  const [addMilestoneFor, setAddMilestoneFor] = useState<{ objId: string; krId: string } | null>(null);
  const [newMsTitle, setNewMsTitle] = useState("");
  const [newMsFiles, setNewMsFiles] = useState<File[]>([]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      achieved: { label: "Achieved", className: "status-achieved" },
      "in-progress": { label: "In Progress", className: "status-in-progress" },
      "not-achieved": { label: "Not Achieved", className: "status-not-achieved" },
      pending: { label: "Pending", className: "status-pending" }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "progress-success";
    if (progress >= 60) return "progress-primary";
    if (progress >= 40) return "progress-warning";
    return "text-danger";
  };

  const filteredData = okrData.filter(okr => {
    const matchesSearch = okr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         okr.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || okr.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || okr.department === departmentFilter;
    const currentUserId = (user as any)?.id;
    const ceoId = "ceo-1";
    const matchesView =
      view === "all" ||
      (view === "my" && okr.owner === currentUserId) ||
      (view === "company" && okr.owner === ceoId);
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesView;
  });

  const departments = [...new Set(okrData.map(okr => okr.department))];

  // Prepare CSV export payload from current filtered data
  const exportPayload = generateExportData(filteredData);
  const csvReport = {
    data: exportPayload.data,
    headers: exportPayload.headers,
    filename: "OKR_Export.csv",
  };

  const canCreate = canCreateObjective(user as any);
  const canRequest = canRequestObjective(user as any);

  return (
    <Card className="card-elevated">
      <div className="p-6 border-b border-card-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground">OKR Financial Year '25</h2>
              <p className="text-sm text-muted-foreground">Monthly and quarterly performance overview</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CSVLink {...csvReport} style={{ textDecoration: "none" }}>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </CSVLink>
            {canCreate && (
              <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add OKR
              </Button>
            )}
            {!canCreate && canRequest && (
              <Button size="sm" variant="default" className="gap-2" onClick={() => setIsRequestOpen(true)}>
                <Plus className="w-4 h-4" />
                Request Objective
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search objectives or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Monthly/Quarterly View Switcher */}
          <div className="flex items-center bg-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setTimeframe('monthly')}
              className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
                timeframe === 'monthly' 
                  ? 'text-white bg-blue-600 rounded-md shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setTimeframe('quarterly')}
              className={`px-4 py-1 text-sm font-semibold rounded-md transition-colors ${
                timeframe === 'quarterly' 
                  ? 'text-white bg-blue-600 rounded-md shadow' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Quarterly
            </button>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="achieved">Achieved</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="not-achieved">Not Achieved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AddOkrModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={({ objectiveTitle, dateRange, owner }) => {
          const newObj: Objective = {
            id: (objectives.length + 1).toString(),
            title: objectiveTitle,
            owner: owner || (user?.id ?? ""),
            status: "pending",
            progress: 0,
            target: 100,
            actual: 0,
            totalScore: 10,
            plannedScore: 0,
            actualScore: 0,
            startDate: dateRange.start || "",
            endDate: dateRange.end || "",
            department: "General",
            keyResults: [],
          };
          setObjectives(prev => [newObj, ...prev]);
        }}
      />
      <RequestObjectiveModal open={isRequestOpen} onOpenChange={setIsRequestOpen} />

      <div className="overflow-x-auto max-w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Objective</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold text-center">Target</TableHead>
              <TableHead className="font-semibold text-center">Actual</TableHead>
              <TableHead className="font-semibold text-center">Total Score</TableHead>
              <TableHead className="font-semibold text-center">Planned</TableHead>
              <TableHead className="font-semibold text-center">Achieved</TableHead>
              <TableHead className="font-semibold">Timeline</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((okr) => (
              <TableRow key={okr.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium max-w-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help" title={okr.title}>
                        {okr.title}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start" className="max-w-md whitespace-pre-wrap break-words">
                      {okr.title}
                    </TooltipContent>
                  </Tooltip>
                  <div className="text-xs text-muted-foreground mt-1">
                    {okr.department}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">
                      {okr.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm">{okr.owner}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(okr.status)}</TableCell>
                <TableCell>
                  <div className="space-y-2 min-w-24">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${getProgressColor(okr.progress)}`}>
                        {okr.progress}%
                      </span>
                    </div>
                    <div className="progress-bar h-2">
                      <div 
                        className={`progress-fill ${getProgressColor(okr.progress)}`}
                        style={{ width: `${okr.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center font-medium">{okr.target}</TableCell>
                <TableCell className="text-center font-medium">{okr.actual}</TableCell>
                <TableCell className="text-center font-bold">{okr.totalScore}</TableCell>
                <TableCell className="text-center">{okr.plannedScore}</TableCell>
                <TableCell className="text-center font-medium">{okr.actualScore}</TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{okr.startDate}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      to {okr.endDate}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Expandable section for KRs and milestones */}
      <div className="px-4 pb-6">
        {objectives.map((obj) => (
          <div key={obj.id} className="border-t border-card-border pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-card-foreground">Key Results for: {obj.title}</div>
              <Button variant="ghost" size="sm" onClick={() => setExpandedObjectiveIds(prev => ({...prev, [obj.id]: !prev[obj.id]}))}>
                {expandedObjectiveIds[obj.id] ? "Hide" : "Show"}
              </Button>
            </div>
            {expandedObjectiveIds[obj.id] && (
              <div className="mt-3 space-y-3">
                {obj.keyResults.map((kr) => (
                  <div key={kr.id} className={`rounded-md border border-card-border p-3 ${getStatusBorder(kr.status)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{kr.title}</div>
                        <div className="text-xs text-muted-foreground">Owner: {kr.owner}</div>
                      </div>
                      {canAddMilestone(user as any, kr) && (
                        <Button size="sm" onClick={() => { setAddMilestoneFor({ objId: obj.id, krId: kr.id }); setNewMsTitle(""); }}>Add Milestone</Button>
                      )}
                    </div>
                    {/* Milestones */}
                    <div className="mt-3 space-y-2">
                      {kr.milestones.map((ms) => {
                        const canEdit = canUpdateMilestone(user as any, ms, kr, orgChartUsers);
                        return (
                          <div key={ms.id} className={`flex items-center gap-3 text-sm ${getStatusBorder(ms.status)}`}>
                            <div className="flex-1">{ms.title}</div>
                            <Select value={ms.status} onValueChange={(val) => {
                              if (!canEdit) return;
                              setObjectives(prev => prev.map(o => o.id !== obj.id ? o : ({
                                ...o,
                                keyResults: o.keyResults.map(k => k.id !== kr.id ? k : ({
                                  ...k,
                                  milestones: k.milestones.map(m => m.id !== ms.id ? m : ({...m, status: val as Milestone["status"]}))
                                }))
                              })));
                            }} disabled={!canEdit}>
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="To-Do">To-Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                      {/* Add Milestone inline form */}
                      {addMilestoneFor && addMilestoneFor.objId === obj.id && addMilestoneFor.krId === kr.id && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input placeholder="New milestone title" value={newMsTitle} onChange={(e) => setNewMsTitle(e.target.value)} />
                            <input
                              type="file"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setNewMsFiles(files);
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (!newMsTitle.trim()) return;
                                const attachments: Attachment[] = newMsFiles.map(f => ({ name: f.name, size: f.size, type: f.type }));
                                setObjectives(prev => prev.map(o => o.id !== obj.id ? o : ({
                                  ...o,
                                  keyResults: o.keyResults.map(k => k.id !== kr.id ? k : ({
                                    ...k,
                                    milestones: [...k.milestones, { id: `m${k.milestones.length+1}`, title: newMsTitle.trim(), status: "To-Do", attachments }]
                                  }))
                                })));
                                setAddMilestoneFor(null);
                                setNewMsTitle("");
                                setNewMsFiles([]);
                              }}
                            >Add</Button>
                            <Button variant="ghost" onClick={() => { setAddMilestoneFor(null); setNewMsTitle(""); setNewMsFiles([]); }}>Cancel</Button>
                          </div>
                          {!!newMsFiles.length && (
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                              {newMsFiles.map((f, idx) => (
                                <div key={idx} className="px-2 py-1 bg-muted rounded flex items-center gap-1">
                                  <span>{f.name}</span>
                                  <button className="text-danger" onClick={() => setNewMsFiles(prev => prev.filter((_, i) => i !== idx))}>×</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-card-foreground mb-2">No OKRs Found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || departmentFilter !== "all" 
              ? "Try adjusting your filters to see more results"
              : "Create your first OKR to get started"
            }
          </p>
        </div>
      )}
    </Card>
  );
}