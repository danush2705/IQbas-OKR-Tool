import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { X } from "lucide-react";

type MetricType = "percentage" | "numeric" | "milestone";

interface KeyResultForm {
  title: string;
  metricType: MetricType;
  start?: number;
  target?: number;
  totalMilestones?: number;
}

interface AddOkrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    objectiveTitle: string;
    objectiveDescription?: string;
    dateRange: { start?: string; end?: string };
    owner: string;
    keyResults: KeyResultForm[];
  }) => void;
}

export function AddOkrModal({ open, onOpenChange, onSubmit }: AddOkrModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Objective
  const [objectiveTitle, setObjectiveTitle] = useState("");
  const [objectiveDescription, setObjectiveDescription] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  // Step 2: Key Results
  const [keyResults, setKeyResults] = useState<KeyResultForm[]>([
    { title: "", metricType: "numeric", start: undefined, target: undefined, totalMilestones: undefined },
  ]);

  // Step 3: Assign & Review
  const [owner, setOwner] = useState<string>("");

  const canProceedStep1 = objectiveTitle.trim().length > 0 && !!dateRange.start && !!dateRange.end;
  const canProceedStep2 = keyResults.every(kr => {
    if (!kr.title.trim()) return false;
    if (kr.metricType === "percentage" || kr.metricType === "numeric") {
      return kr.start !== undefined && kr.target !== undefined;
    }
    if (kr.metricType === "milestone") {
      return kr.totalMilestones !== undefined && kr.totalMilestones > 0;
    }
    return false;
  });
  const canCreate = canProceedStep1 && canProceedStep2 && owner.trim().length > 0;

  const addKeyResult = () => {
    setKeyResults(prev => [...prev, { title: "", metricType: "numeric" }]);
  };

  const updateKeyResult = (index: number, patch: Partial<KeyResultForm>) => {
    setKeyResults(prev => prev.map((kr, i) => (i === index ? { ...kr, ...patch } : kr)));
  };

  const Stepper = () => (
    <div className="flex items-center justify-between mb-6">
      {[
        { id: 1, label: "Objective" },
        { id: 2, label: "Key Results" },
        { id: 3, label: "Assign & Review" },
      ].map(s => (
        <div key={s.id} className="flex-1 flex items-center">
          <div className={`flex items-center gap-2 ${step === s.id ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step === s.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-muted"}`}>
              {s.id}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
          {s.id !== 3 && <div className="flex-1 h-0.5 mx-2 bg-muted" />}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Create New Objective & Key Results</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Stepper />

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Objective Title</label>
              <Input
                placeholder="e.g., Launch our new mobile app by Q4"
                value={objectiveTitle}
                onChange={(e) => setObjectiveTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Description (Optional)</label>
              <Textarea
                placeholder="Add more details about the objective"
                value={objectiveDescription}
                onChange={(e) => setObjectiveDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Timeline</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <Input type="date" value={dateRange.start || ""} onChange={(e) => setDateRange(d => ({ ...d, start: e.target.value }))} />
                <Input type="date" value={dateRange.end || ""} onChange={(e) => setDateRange(d => ({ ...d, end: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {keyResults.map((kr, index) => (
                <div key={index} className="border border-card-border rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">Key Result Title</label>
                      <Input placeholder="e.g., Achieve 10,000 app downloads" value={kr.title} onChange={(e) => updateKeyResult(index, { title: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground mb-2 block">Metric Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { key: "percentage", label: "Percentage (%)" },
                          { key: "numeric", label: "Numeric (#)" },
                          { key: "milestone", label: "Milestone (Task)" },
                        ] as const).map(opt => (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => updateKeyResult(index, { metricType: opt.key })}
                            className={`text-sm rounded-md border px-3 py-2 text-left ${kr.metricType === opt.key ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-muted"}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {kr.metricType !== "milestone" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-card-foreground">Start</label>
                          <Input type="number" value={kr.start ?? ""} onChange={(e) => updateKeyResult(index, { start: Number(e.target.value) })} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-card-foreground">Target</label>
                          <Input type="number" value={kr.target ?? ""} onChange={(e) => updateKeyResult(index, { target: Number(e.target.value) })} className="mt-1" />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium text-card-foreground">Total Milestones</label>
                        <Input type="number" value={kr.totalMilestones ?? ""} onChange={(e) => updateKeyResult(index, { totalMilestones: Number(e.target.value) })} className="mt-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addKeyResult} className="w-full">+ Add Another Key Result</Button>
            </div>
            <div className="space-y-3">
              <div className="bg-secondary rounded-lg p-4 border border-card-border">
                <h4 className="font-medium text-card-foreground mb-2">Tips</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Use measurable metrics where possible</li>
                  <li>Limit to 3-5 key results per objective</li>
                  <li>Keep targets ambitious yet realistic</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg p-4 border border-card-border">
              <h4 className="font-semibold text-card-foreground mb-2">Objective Summary</h4>
              <div className="text-sm text-card-foreground"><span className="font-medium">Title:</span> {objectiveTitle || "-"}</div>
              <div className="text-sm text-card-foreground"><span className="font-medium">Timeline:</span> {dateRange.start || "-"} to {dateRange.end || "-"}</div>
            </div>
            <div className="bg-secondary rounded-lg p-4 border border-card-border">
              <h4 className="font-semibold text-card-foreground mb-2">Key Results</h4>
              <ul className="space-y-2">
                {keyResults.map((kr, i) => (
                  <li key={i} className="text-sm text-card-foreground">
                    <span className="font-medium">{i + 1}.</span> {kr.title || "Untitled"} — {kr.metricType}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Objective Owner</label>
              <Input placeholder="Search or enter owner e.g., John Doe" value={owner} onChange={(e) => setOwner(e.target.value)} className="mt-1" />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => (s === 2 ? 1 : 2))}>
                ← Back
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            )}
          </div>
          <div>
            {step === 1 && (
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>Next: Add Key Results →</Button>
            )}
            {step === 2 && (
              <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>Next: Review →</Button>
            )}
            {step === 3 && (
              <Button
                disabled={!canCreate}
                onClick={() => {
                  onSubmit?.({
                    objectiveTitle,
                    objectiveDescription,
                    dateRange,
                    owner,
                    keyResults,
                  });
                  onOpenChange(false);
                }}
              >
                Create OKR
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


