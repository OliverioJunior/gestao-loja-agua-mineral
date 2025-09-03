import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/shared/components/ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ClientDetailsModalProps } from "./types";
import {
  getStatusColor,
  getStatusText,
  formatDate,
  formatPhone,
} from "./client-utils";

export function ClientDetailsModal({
  client,
  isOpen,
  onClose,
  onEdit,
}: ClientDetailsModalProps) {
  if (!client) return null;

  const StatusIcon = client.status === "ATIVO" ? CheckCircle : XCircle;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Nome Completo
                </div>
                <div className="font-medium">{client.nome}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  E-mail
                </div>
                <div className="font-medium">{client.email}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  Telefone
                </div>
                <div className="font-medium">
                  {formatPhone(client.telefone)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    client.status
                  )}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {getStatusText(client.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Endereço</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Endereço Completo
              </div>
              <div className="font-medium">
                {client.endereco!.logradouro} - {client.endereco!.numero}
                <br />
                {client.endereco!.cidade}, {client.endereco!.estado} -{" "}
                {client.endereco!.cep}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Estatísticas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  Total de Pedidos
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {client._count.pedidos}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Total de Vendas
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {client._count.pedidos}
                </div>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Informações de Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Data de Criação
                </div>
                <div className="font-medium">
                  {formatDate(client.createdAt.toString())}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Última Atualização
                </div>
                <div className="font-medium">
                  {formatDate(client.updatedAt.toString())}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={() => onEdit(client)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
