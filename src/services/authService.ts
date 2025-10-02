// src/services/authService.ts
export type UserRole = "ceo" | "manager" | "user" | "hr";
export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  isAdmin?: boolean;
}

const mockUsers: Record<string, AuthUser> = {
  "ceo@iqbas.org": { id: "ceo-1", name: "Alex Riley", role: "ceo", email: "ceo@iqbas.org", isAdmin: false },
  "manager@iqbas.org": { id: "manager-1", name: "Jane Doe", role: "manager", email: "manager@iqbas.org", isAdmin: false },
  "user@iqbas.org": { id: "user-1", name: "John Smith", role: "user", email: "user@iqbas.org", isAdmin: false },
  // Optional HR admin account (for testing admin permissions)
  "hr@iqbas.org": { id: "hr-1", name: "Susan Reid", role: "hr", email: "hr@iqbas.org", isAdmin: true },
};

export const mockLogin = (email: string, _password: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockUsers[email];
      if (found) resolve(found);
      else reject("Invalid credentials");
    }, 400);
  });
};

export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 200));
};
