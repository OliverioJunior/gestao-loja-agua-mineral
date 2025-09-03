"use client";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/auth/me");
      
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error("Erro ao carregar dados do usuário");
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refetch: fetchUser };
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function formatUserRole(role: string): string {
  const roleMap: Record<string, string> = {
    admin: "Administrador",
    manager: "Gerente",
    employee: "Funcionário",
    user: "Usuário",
  };
  
  return roleMap[role.toLowerCase()] || role;
}