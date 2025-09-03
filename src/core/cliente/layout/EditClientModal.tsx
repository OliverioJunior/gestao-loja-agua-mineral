import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Edit, AlertCircle } from "lucide-react";
import {
  TClienteWithAdressAndCount,
  UpdateClienteInput,
} from "@/core/cliente/domain/cliente.entity";
import { Status } from "@/infrastructure/generated/prisma";

interface EditClientModalProps {
  client: TClienteWithAdressAndCount | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: UpdateClienteInput) => Promise<void>;
}

export function EditClientModal({
  client,
  isOpen,
  onClose,
  onSubmit,
}: EditClientModalProps) {
  const [formData, setFormData] = useState<{
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    aniversario: string;
    status: Status;
    numero: string;
    enderecoId: string;
  }>({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    aniversario: "",
    numero: "",
    status: Status.ATIVO,
    enderecoId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Atualizar formData quando client mudar
  useEffect(() => {
    if (client) {
      setFormData({
        nome: client.nome,
        email: client.email,
        telefone: client.telefone,
        endereco: client.endereco?.logradouro || "",
        cidade: client.endereco?.cidade || "",
        estado: client.endereco?.estado || "",
        cep: client.endereco?.cep || "",
        numero: client.endereco?.numero || "",
        aniversario: client.aniversario
          ? new Date(client.aniversario).toISOString().split("T")[0]
          : "",
        status: client.status,
        enderecoId: client.endereco?.id || "",
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData: UpdateClienteInput = {
        ...formData,
        aniversario: formData.aniversario
          ? new Date(formData.aniversario)
          : null,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao atualizar cliente"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Cliente
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Digite o nome completo"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Digite o e-mail"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                placeholder="(11) 99999-9999"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aniversario">Data de Aniversário</Label>
              <Input
                id="aniversario"
                type="date"
                value={formData.aniversario}
                onChange={(e) =>
                  setFormData({ ...formData, aniversario: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) =>
                setFormData({ ...formData, endereco: e.target.value })
              }
              placeholder="Digite o endereço completo"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
              placeholder="Digite o número"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) =>
                  setFormData({ ...formData, cidade: e.target.value })
                }
                placeholder="Digite a cidade"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
                }
                placeholder="SP"
                maxLength={2}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) =>
                  setFormData({ ...formData, cep: e.target.value })
                }
                placeholder="00000-000"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Status) =>
                setFormData({ ...formData, status: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Status.ATIVO}>Ativo</SelectItem>
                <SelectItem value={Status.INATIVO}>Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
