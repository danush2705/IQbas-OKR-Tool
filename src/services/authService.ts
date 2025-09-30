// src/services/authService.ts
export type UserRole = "ceo" | "manager" | "user";
export interface AuthUser {
  name: string;
  role: UserRole;
  email?: string;
}

const mockUsers: Record<string, AuthUser> = {
  "ceo@iqbas.org": { name: "Alex Riley", role: "ceo", email: "ceo@iqbas.org" },
  "manager@iqbas.org": { name: "Jane Doe", role: "manager", email: "manager@iqbas.org" },
  "user@iqbas.org": { name: "John Smith", role: "user", email: "user@iqbas.org" },
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
