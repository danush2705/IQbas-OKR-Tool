import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AccessDeniedModal({ open = true }: { open?: boolean }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Access Denied
          </DialogTitle>
          <DialogDescription>
            You do not have the necessary permissions to view this page.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => navigate("/", { replace: true })}>Return to Dashboard</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
