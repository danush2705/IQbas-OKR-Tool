import React, { createContext, useContext, useState } from "react";
import { mockLogin, mockLogout } from "@/services/authService";
import type { AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserRole: (id: string, role: AuthUser["role"]) => void;
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

  const updateUserRole = (id: string, role: AuthUser["role"]) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.id !== id) return prev;
      // Keep admin flag as-is (this can be managed via a dedicated admin switch elsewhere)
      return { ...prev, role } as AuthUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
