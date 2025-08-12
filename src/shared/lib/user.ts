import { prisma } from "@/infrastructure";
import { getSession } from "./session";

export async function getCurrentUser() {
  try {
    const session = await getSession();
    
    if (!session || !session.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Não incluir password por segurança
      },
    });

    return user;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
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