import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function SettingsProfile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const save = () => {
    // UI-only for now
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <div className="text-sm font-medium text-card-foreground">Profile Information</div>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input className="mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input className="mt-1" value={user?.email || ""} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Profile Picture</label>
            <input className="mt-1" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={save}>Save Changes</Button>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="text-sm font-medium text-card-foreground">Change Password</div>
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" className="mt-1" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" className="mt-1" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" className="mt-1" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={save}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
