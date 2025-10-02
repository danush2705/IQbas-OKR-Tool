import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { orgChartUsers, type OrgUser, type Role } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const roleOptions: Role[] = ["user", "manager", "hr"];

export default function SettingsUserManagement() {
  const [users, setUsers] = useState<OrgUser[]>(orgChartUsers);
  const [dirty, setDirty] = useState<Record<string, Role>>({});
  const { updateUserRole } = useAuth();
  const { toast } = useToast();

  const onChangeRole = (id: string, role: Role) => {
    setDirty(prev => ({ ...prev, [id]: role }));
  };

  const saveRole = (id: string) => {
    const newRole = dirty[id];
    if (!newRole) return;
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: newRole } : u)));
    // Update global auth state if the edited user is the currently logged-in one
    updateUserRole(id, newRole as any);
    setDirty(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    toast({ title: "User role updated successfully" });
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage organization roles (admin only)</p>
      </div>

      <Card className="card-elevated">
        <div className="p-4 border-b border-card-border text-sm font-medium">Organization Users</div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>
                    {u.id === "ceo-1" ? (
                      <div className="text-sm">CEO (locked)</div>
                    ) : (
                      <Select value={dirty[u.id] ?? u.role} onValueChange={(v: Role) => onChangeRole(u.id, v)}>
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(r => (
                            <SelectItem key={r} value={r}>{r.toUpperCase()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" disabled={!dirty[u.id]} onClick={() => saveRole(u.id)}>Save</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
