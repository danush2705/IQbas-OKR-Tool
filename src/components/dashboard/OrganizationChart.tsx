import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, User, Edit3, Move } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  view?: "all" | "my" | "company";
  onChangeView?: (v: "all" | "my" | "company") => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  progress: number;
  avatar: string;
  level: number;
  parentId?: string;
}

const mockTeamData: TeamMember[] = [
  // Level 0: CEO
  { id: "ceo-1", name: "Alex Riley", role: "CEO", department: "Executive", progress: 85, avatar: "AR", level: 0 },

  // Level 1: Direct reports to CEO
  { id: "manager-1", name: "Jane Doe", role: "Manager", department: "Operations", progress: 70, avatar: "JD", level: 1, parentId: "ceo-1" },
  { id: "finance-1", name: "Finance", role: "Finance", department: "Finance", progress: 60, avatar: "F", level: 1, parentId: "ceo-1" },
  { id: "hr-1", name: "Susan Reid", role: "HR", department: "HR", progress: 65, avatar: "SR", level: 1, parentId: "ceo-1" },
  // Users report to manager-1 to reflect org relationships
  { id: "user-1", name: "John Smith", role: "User", department: "General", progress: 50, avatar: "JS", level: 1, parentId: "manager-1" },
  { id: "user-2", name: "Peter Jones", role: "User", department: "General", progress: 48, avatar: "PJ", level: 1, parentId: "manager-1" },
];

export function OrganizationChart({ view = "all", onChangeView }: Props) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamData);
  const [draggedMember, setDraggedMember] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  const handleDragStart = (e: React.DragEvent, memberId: string) => {
    if (!isEditMode) return;
    setDraggedMember(memberId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (!isEditMode || !draggedMember) return;
    e.preventDefault();
    
    // Update parent relationship
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === draggedMember 
          ? { ...member, parentId: targetId }
          : member
      )
    );
    setDraggedMember(null);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 60) return "bg-info";
    if (progress >= 40) return "bg-warning";
    return "bg-danger";
  };

  const getProgressBg = (progress: number) => {
    if (progress >= 80) return "bg-success-light";
    if (progress >= 60) return "bg-info-light";
    if (progress >= 40) return "bg-warning-light";
    return "bg-danger-light";
  };

  // Filter members based on selected view and logged-in user
  const currentUserId = (user as any)?.id as string | undefined;
  const base = teamMembers;
  const isDescendantOf = (member: TeamMember, ancestorId: string): boolean => {
    let pid = member.parentId;
    while (pid) {
      if (pid === ancestorId) return true;
      const parent = base.find(m => m.id === pid);
      pid = parent?.parentId;
    }
    return false;
  };
  let viewMembers: TeamMember[] = base;
  if (view === "company") {
    viewMembers = base.filter(m => m.id === "ceo-1" || isDescendantOf(m, "ceo-1"));
  } else if (view === "my" && currentUserId) {
    // Show me and my direct reports; CEO sees all
    if (currentUserId === "ceo-1") viewMembers = base;
    else viewMembers = base.filter(m => m.id === currentUserId || m.parentId === currentUserId);
  }

  const ceo = viewMembers.find(m => m.level === 0 || m.id === "ceo-1");
  const managers = viewMembers.filter(m => m.level === 1 && (m.parentId === "ceo-1" || view !== "company"));

  // Simplified connector approach - use CSS positioning
  const managersRef = useRef<HTMLDivElement | null>(null);

  return (
    <Card className="p-8 card-elevated">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Organization Chart</h2>
          <p className="text-muted-foreground mt-1">Company hierarchy and progress overview</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Segmented control */}
          <div className="inline-flex rounded-md overflow-hidden border border-card-border">
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${view === "all" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              onClick={() => onChangeView?.("all")}
            >
              All OKRs
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-card-border ${view === "my" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              onClick={() => onChangeView?.("my")}
            >
              My OKRs
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-card-border ${view === "company" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              onClick={() => onChangeView?.("company")}
            >
              Company OKRs
            </button>
          </div>

          {/* Icon-only Edit toggle */}
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="icon"
            onClick={() => setIsEditMode(!isEditMode)}
            aria-label="Edit Chart"
            title={isEditMode ? "Exit Edit" : "Edit Chart"}
          >
            {isEditMode ? <Move className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="w-full flex justify-center items-center h-[500px]">
        <div className="relative">
          {/* CEO Level */}
          {ceo && (
            <div className="flex justify-center mb-12">
            <div
              className={`org-chart-node ${draggedMember === ceo.id ? 'dragging' : ''} ${isEditMode ? 'cursor-move' : ''} bg-white border border-gray-200 rounded-lg p-4 shadow-sm`}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, ceo.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, ceo.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {ceo.avatar}
                  </div>
                  <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{ceo.name}</h3>
                    <span className="text-sm text-gray-500">{ceo.role}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-900">{ceo.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${ceo.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection from CEO to managers */}
        <div className="absolute left-1/2 top-32 w-0.5 h-8 bg-gray-400 transform -translate-x-0.5 z-10"></div>

        {/* Manager Level */}
        <div className="relative mt-12" ref={managersRef}>
          {/* Central horizontal connector spanning the managers */}
          <div className="absolute left-1/2 top-0 h-0.5 bg-gray-400 transform -translate-x-1/2 w-96 z-10"></div>
          
          <div className="grid grid-cols-4 gap-8 justify-center">
          {managers.map((member, index) => (
            <div key={member.id} className="relative">
              {/* Vertical connection lines from horizontal bar to each node */}
              <div className="absolute left-1/2 -top-12 w-0.5 h-12 bg-gray-400 transform -translate-x-0.5 z-10"></div>
              
              <div
                className={`org-chart-node ${draggedMember === member.id ? 'dragging' : ''} ${isEditMode ? 'cursor-move' : ''} bg-white border border-gray-200 rounded-lg p-4 shadow-sm`}
                data-org-node
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, member.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, member.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {member.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{member.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{member.department}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900">{member.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            member.progress >= 60 ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Users under this manager */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {viewMembers.filter(child => child.parentId === member.id && child.role.toLowerCase() === 'user').map(child => (
                  <div key={child.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {child.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{child.name}</div>
                      <div className="text-xs text-gray-500 truncate">{child.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
        </div>
      </div>

      {isEditMode && (
        <div className="mt-8 p-4 bg-info-light border border-info/20 rounded-lg">
          <div className="flex items-center gap-2 text-info text-sm">
            <Move className="w-4 h-4" />
            <span className="font-medium">Edit Mode Active:</span>
            <span>Drag and drop team members to reorganize the hierarchy</span>
          </div>
        </div>
      )}
    </Card>
  );
}