import React, { createContext, useContext, useState } from "react";
import { mockLogin, mockLogout } from "@/services/authService";

export type UserRole = "ceo" | "manager" | "user";
export interface AuthUser {
  name: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const userData = await mockLogin(email, password);
      if (userData) {
        setUser(userData as AuthUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await mockLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
