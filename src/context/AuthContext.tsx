import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "merchant" | "admin";
export interface User { name: string; email: string; role: Role; }

interface AuthCtx {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return <Ctx.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>{children}</Ctx.Provider>;
}


export const useAuth = () => useContext(Ctx);
