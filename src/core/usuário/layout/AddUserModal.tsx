"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/core/usuário/context/useContext";

export function AddUserModal() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { users, setUsers } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar usuário");
      }

      const newUser = await response.json();
      toast.success("Usuário criado com sucesso!");

      // Add new user to context
      setUsers([...users, newUser]);

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        password: "",
      });

      // Close modal
      setOpen(false);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar usuário"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-200 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Adicionar Novo Usuário
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Preencha os dados do novo usuário do sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Nome completo
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Digite o nome completo"
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                placeholder="Digite o email"
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Função
              </label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="ADMIN" className="text-slate-200">
                    Administrador
                  </SelectItem>
                  <SelectItem value="MANAGER" className="text-slate-200">
                    Gerente
                  </SelectItem>
                  <SelectItem value="USER" className="text-slate-200">
                    Usuário
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 mb-2 block">
                Senha temporária
              </label>
              <Input
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
                placeholder="Digite uma senha temporária"
                className="bg-slate-800 border-slate-700 text-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.email ||
                !formData.role ||
                !formData.password
              }
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isLoading ? "Criando..." : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
