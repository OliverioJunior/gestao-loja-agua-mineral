"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/shared/components/ui";
import { Users, Edit3, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IUser } from "./types";
import { getRoleText } from "./user-utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: IUser) => void;
  initialMode?: "view" | "edit";
}

export function UserModal({
  user,
  isOpen,
  onClose,
  onSave,
  initialMode = "view",
}: UserModalProps) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<IUser>>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });
    }
    setMode(initialMode);
  }, [user, initialMode]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar usuário");
      }

      const result = await response.json();
      toast.success("Usuário atualizado com sucesso!");

      onSave(result);
      setMode("view");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar usuário"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setMode("view");
  };

  const handleClose = () => {
    setMode("view");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            {mode === "edit" ? (
              <>
                <Edit3 className="h-5 w-5" />
                Editar Usuário
              </>
            ) : (
              <>
                <Eye className="h-5 w-5" />
                Detalhes do Usuário
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {mode === "edit"
              ? "Edite as informações do usuário abaixo."
              : "Visualize os detalhes do usuário."}
          </DialogDescription>
        </DialogHeader>

        {mode === "edit" ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="font-medium text-slate-200 bg-slate-800/50 border-slate-600 mb-1 h-8 text-base"
                    required
                  />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="text-sm text-slate-400 bg-slate-800/50 border-slate-600 h-7"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Função:
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-slate-800/50 border-slate-600 text-slate-200 h-8 mt-1">
                      <SelectValue
                        placeholder={getRoleText(formData.role || user.role)}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="admin" className="text-slate-200">
                        Administrador
                      </SelectItem>
                      <SelectItem value="manager" className="text-slate-200">
                        Gerente
                      </SelectItem>
                      <SelectItem value="user" className="text-slate-200">
                        Usuário
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Data de criação:
                  </label>
                  <p className="text-slate-200">
                    {format(
                      new Date(user.createdAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Última atualização:
                  </label>
                  <p className="text-slate-200">
                    {format(
                      new Date(user.updatedAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
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
                  !formData.role
                }
                className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-200">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Função:
                  </label>
                  <p className="text-slate-200">{getRoleText(user.role)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Data de criação:
                  </label>
                  <p className="text-slate-200">
                    {format(
                      new Date(user.createdAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Última atualização:
                  </label>
                  <p className="text-slate-200">
                    {format(
                      new Date(user.updatedAt),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Fechar
              </Button>
              <Button
                type="button"
                onClick={() => setMode("edit")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
