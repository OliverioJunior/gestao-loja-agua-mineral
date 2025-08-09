"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui";
import {
  UserFilters,
  UserDetailsModal,
  UserStatsCards,
  UserTable,
  IUser,
  IUserStats,
} from "@/layout/usuarios";

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    const mockUsers: IUser[] = [
      {
        id: "1",
        name: "João Silva",
        email: "joao.silva@empresa.com",
        role: "admin",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-12-10"),
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria.santos@empresa.com",
        role: "manager",
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-12-08"),
      },
      {
        id: "3",
        name: "Pedro Costa",
        email: "pedro.costa@empresa.com",
        role: "user",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-12-05"),
      },
      {
        id: "4",
        name: "Ana Oliveira",
        email: "ana.oliveira@empresa.com",
        role: "user",
        createdAt: new Date("2024-04-05"),
        updatedAt: new Date("2024-12-01"),
      },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filterRole !== "todos" && user.role !== filterRole) {
      return false;
    }

    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleView = (user: IUser) => {
    setSelectedUser(user);
  };

  const handleEdit = (user: IUser) => {
    console.log("Editar usuário:", user);
  };

  const handleDelete = (user: IUser) => {
    setUsers(users.filter((u) => u.id !== user.id));
    console.log("Usuário excluído:", user);
  };

  const getRoleStats = (): IUserStats => ({
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    user: users.filter((u) => u.role === "user").length,
  });

  const stats = getRoleStats();

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="max-w-7xl mx-auto">
        <UserStatsCards stats={stats} />

        <Card className="bg-card/60 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <UserFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setFilterRole={setFilterRole}
              />
            </div>

            <UserTable
              users={filteredUsers}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <UserDetailsModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
