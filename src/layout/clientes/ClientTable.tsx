import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { ClientRow } from "./ClientRow";
import { ClientTableProps } from "./types";

export function ClientTable({
  clients,
  onView,
  onEdit,
  onDelete,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              {clients.length === 1
                ? "1 cliente encontrado"
                : `${clients.length} clientes encontrados`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
