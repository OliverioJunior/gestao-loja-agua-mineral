import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { Card, CardContent } from "@/shared/components/ui/card";
import { LoadingTable } from "@/shared/components/layout/LoadingSpinner";
import { CompraTableProps } from "./types";
import { CompraRow } from "./CompraRow";

export function CompraTable({
  compras,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onConfirmar,
  onReceber,
  onCancelar
}: CompraTableProps) {
  if (loading) {
    return (
      <LoadingTable 
        rows={5} 
        headers={[
          "Nota / Fornecedor",
          "Data Compra / Vencimento", 
          "Status",
          "Forma Pagamento",
          "Itens",
          "Valor Total",
          "Ações"
        ]} 
      />
    );
  }

  if (compras.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma compra encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              Não há compras cadastradas ou que correspondam aos filtros aplicados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  Nota / Fornecedor
                </TableHead>
                <TableHead className="w-[180px]">
                  Data Compra / Vencimento
                </TableHead>
                <TableHead className="w-[120px]">
                  Status
                </TableHead>
                <TableHead className="w-[150px]">
                  Forma Pagamento
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Itens
                </TableHead>
                <TableHead className="w-[150px] text-right">
                  Valor Total
                </TableHead>
                <TableHead className="w-[200px] text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((compra) => (
                <CompraRow
                  key={compra.id}
                  compra={compra}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onConfirmar={onConfirmar}
                  onReceber={onReceber}
                  onCancelar={onCancelar}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}