"use client";
import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui";
import {
  UserFilters,
  UserModal,
  UserStatsCards,
  UserTable,
  IUser,
  IUserStats,
} from "@/layout/usuarios";
import { UserProvider, useUser } from "@/context/user/useContext";
import { toast } from "sonner";

function UsuariosPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [selectedUser, setSelectedUser] = useState<{
    user: IUser;
    mode: "view" | "edit";
  } | null>(null);

  const { users, setUsers } = useUser();

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
    setSelectedUser({ user, mode: "view" });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUser({ user, mode: "edit" });
  };

  const handleEditSave = (updatedUser: IUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setSelectedUser(null);
  };

  const handleDelete = async (user: IUser) => {
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário");
      }

      // Remove user from context after successful API call
      setUsers(users.filter((u) => u.id !== user.id));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
    }
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
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <UserModal
          user={selectedUser?.user || null}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleEditSave}
          initialMode={selectedUser?.mode || "view"}
        />
      </div>
    </main>
  );
}

export default function UsuariosPage() {
  return (
    <UserProvider>
      <UsuariosPageContent />
    </UserProvider>
  );
}
