import {
  TableCell,
  TableRow,
  Button,
} from "@/shared/components/ui";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { ClientRowProps } from "./types";
import {
  getStatusColor,
  getStatusText,
  formatDate,
  formatPhone,
} from "./client-utils";

export function ClientRow({
  client,
  onView,
  onEdit,
  onDelete,
}: ClientRowProps) {

  const StatusIcon = client.status === "ATIVO" ? CheckCircle : XCircle;

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="font-medium">{client.nome}</div>
        <div className="text-sm text-muted-foreground">{client.email}</div>
      </TableCell>
      <TableCell>
        <div>{formatPhone(client.telefone)}</div>
        <div className="text-sm text-muted-foreground">
          {client.cidade}, {client.estado}
        </div>
      </TableCell>
      <TableCell>
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            client.status
          )}`}
        >
          <StatusIcon className="h-3 w-3" />
          {getStatusText(client.status)}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <div>{formatDate(client.createdAt.toString())}</div>
        <div className="text-xs">Criado</div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        <div>{formatDate(client.updatedAt.toString())}</div>
        <div className="text-xs">Atualizado</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(client)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(client)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(client)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
