import React, { createContext, useContext, useState, useCallback } from "react";

type UserType = "customer" | "employee" | null;

interface User {
  name: string;
  email: string;
  phone?: string;
  type: UserType;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userType: UserType;
  loginCustomer: (name: string, email: string, phone: string) => void;
  loginEmployee: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Employee credentials
const EMPLOYEE_CREDENTIALS = {
  email: "nicolawcarro@gmail.com",
  password: "123456",
  name: "Pizzaria Paulistana",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginCustomer = useCallback((name: string, email: string, phone: string) => {
    setUser({ name, email, phone, type: "customer" });
  }, []);

  const loginEmployee = useCallback((email: string, password: string) => {
    if (
      email === EMPLOYEE_CREDENTIALS.email &&
      password === EMPLOYEE_CREDENTIALS.password
    ) {
      setUser({
        name: EMPLOYEE_CREDENTIALS.name,
        email: EMPLOYEE_CREDENTIALS.email,
        type: "employee",
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        userType: user?.type || null,
        loginCustomer,
        loginEmployee,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
