import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddOkrModal } from "@/components/dashboard/AddOkrModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CSVLink } from "react-csv";
import { generateExportData } from "@/utils/exportUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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

interface OKRData {
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

const mockOKRData: OKRData[] = [
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
    department: "Marketing"
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
    department: "Customer Success"
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
    department: "Operations"
  }
];

export function OKRTable() {
  const [okrData, setOkrData] = useState<OKRData[]>(mockOKRData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [timeframe, setTimeframe] = useState('quarterly');
  const { user } = useAuth();

  // Register chart elements once
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDesc, setRequestDesc] = useState("");

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
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(okrData.map(okr => okr.department))];

  // Prepare CSV export payload from current filtered data
  const exportPayload = generateExportData(filteredData);
  const csvReport = {
    data: exportPayload.data,
    headers: exportPayload.headers,
    filename: "OKR_Export.csv",
  };

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
            {user?.role === 'ceo' ? (
              <Button size="sm" className="gap-2" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add OKR
              </Button>
            ) : (
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
          const newObj: OKRData = {
            id: (okrData.length + 1).toString(),
            title: objectiveTitle,
            owner: owner || "Unassigned",
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
          };
          setOkrData(prev => [newObj, ...prev]);
        }}
      />

      {/* Request Objective Modal for non-CEO users */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Objective</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Objective Title</label>
              <Input
                placeholder="e.g., Improve customer NPS"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Description</label>
              <Textarea
                placeholder="Add a short description for your request"
                value={requestDesc}
                onChange={(e) => setRequestDesc(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                // In a real app this would submit to an approval workflow
                setIsRequestOpen(false);
                setRequestTitle("");
                setRequestDesc("");
              }}
              disabled={!requestTitle.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto max-w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Objective</TableHead>
              <TableHead className="font-semibold">Owner</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold text-center">Progress Chart</TableHead>
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
                  <div className="truncate" title={okr.title}>
                    {okr.title}
                  </div>
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
                {/* Progress Chart */}
                <TableCell className="text-center">
                  <div className="w-12 h-12 mx-auto">
                    {(() => {
                      const achieved = Math.max(0, Math.min(okr.actualScore, okr.totalScore));
                      const remaining = Math.max(0, okr.totalScore - achieved);
                      const chartData = {
                        labels: ["Achieved", "Remaining"],
                        datasets: [
                          {
                            data: [achieved, remaining],
                            backgroundColor: ["#34D399", "#E5E7EB"],
                            borderWidth: 0,
                          },
                        ],
                      };
                      const chartOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "60%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                      };
                      return <Doughnut data={chartData as any} options={chartOptions as any} />;
                    })()}
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