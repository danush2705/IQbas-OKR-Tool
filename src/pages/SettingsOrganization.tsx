import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Period { id: string; name: string; start: string; end: string; }

export default function SettingsOrganization() {
  const [periods, setPeriods] = useState<Period[]>([
    { id: "p1", name: "Q1 2026", start: "2026-01-01", end: "2026-03-31" },
  ]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [notifyOnUpdates, setNotifyOnUpdates] = useState(true);

  const addPeriod = () => {
    setPeriods(prev => [...prev, { id: `p${prev.length+1}`, name: "", start: "", end: "" }]);
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground mt-1">Manage time periods, branding, and notifications</p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="text-sm font-medium text-card-foreground">Time Periods</div>
        {periods.map((p, idx) => (
          <div key={p.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input className="mt-1" value={p.name} onChange={(e) => setPeriods(prev => prev.map((x,i)=> i===idx? { ...x, name: e.target.value } : x))} placeholder="Q2 2026" />
            </div>
            <div>
              <label className="text-sm font-medium">Start</label>
              <Input type="date" className="mt-1" value={p.start} onChange={(e) => setPeriods(prev => prev.map((x,i)=> i===idx? { ...x, start: e.target.value } : x))} />
            </div>
            <div>
              <label className="text-sm font-medium">End</label>
              <Input type="date" className="mt-1" value={p.end} onChange={(e) => setPeriods(prev => prev.map((x,i)=> i===idx? { ...x, end: e.target.value } : x))} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPeriods(prev => prev.filter((_,i)=>i!==idx))}>Remove</Button>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addPeriod}>Add Period</Button>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="text-sm font-medium text-card-foreground">Branding</div>
        <div>
          <label className="text-sm font-medium">Company Logo</label>
          <input className="mt-1" type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <div className="text-sm font-medium text-card-foreground">Notification Preferences</div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={notifyOnUpdates} onChange={(e)=>setNotifyOnUpdates(e.target.checked)} />
          Notify managers when a team member updates an objective
        </label>
      </Card>
    </div>
  );
}
