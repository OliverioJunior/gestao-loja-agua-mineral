import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Card, CardContent } from "@/shared/components/ui/card";
import { LoadingTable } from "@/shared/components/layout/LoadingSpinner";
import { ItemCompraTableProps } from "./types";
import { ItemCompraRow } from "./ItemCompraRow";

export function ItemCompraTable({
  items,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: ItemCompraTableProps) {
  if (loading) {
    return (
      <LoadingTable
        rows={5}
        headers={[
          "Produto",
          "Fornecedor",
          "Qtd.",
          "Preço Unit.",
          "Subtotal",
          "Desconto",
          "Total",
          "Data",
          "Ações",
        ]}
      />
    );
  }

  if (items.length === 0) {
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum item de compra encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Não há itens de compra cadastrados ou que correspondam aos filtros
              aplicados.
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
                <TableHead className="w-[200px]">Produto</TableHead>
                <TableHead className="w-[180px]">Fornecedor</TableHead>
                <TableHead className="w-[100px] text-center">Qtd.</TableHead>
                <TableHead className="w-[120px] text-right">
                  Preço Unit.
                </TableHead>
                <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                <TableHead className="w-[120px] text-right">Desconto</TableHead>
                <TableHead className="w-[120px] text-right">Total</TableHead>
                <TableHead className="w-[140px]">Data</TableHead>
                <TableHead className="w-[120px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <ItemCompraRow
                  key={item.id}
                  item={item}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
