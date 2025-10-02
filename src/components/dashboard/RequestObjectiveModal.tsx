import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function RequestObjectiveModal({ open, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    // UI-only simulation for now
    onOpenChange(false);
    setTitle("");
    setDesc("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Objective</DialogTitle>
          <DialogDescription>Submit a new objective for approval.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Objective Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Improve NPS" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Description</label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description" className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={!title.trim()}>Submit Request for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
