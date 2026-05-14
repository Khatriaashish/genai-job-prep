import { createContext, useState, ReactNode } from "react";

export interface User {
  _id?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
