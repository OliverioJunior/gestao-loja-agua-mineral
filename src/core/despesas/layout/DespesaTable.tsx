import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { DespesaRow } from "./DespesaRow";
import { DespesaTableProps } from "./types";
import { formatCurrency } from "./despesa-utils";

export function DespesaTable({
  despesas,
  loading,
  onView,
  onEdit,
  onDelete,
}: DespesaTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse ml-auto w-16" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-24" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (despesas.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium mb-2">
                    Nenhuma despesa encontrada
                  </p>
                  <p className="text-sm">
                    Adicione uma nova despesa para começar.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  // Calcular total das despesas exibidas
  const totalExibido = despesas.reduce(
    (acc, despesa) => acc + despesa.valor,
    0
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Forma de Pagamento</TableHead>
            <TableHead>Criado por</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {despesas.map((despesa) => (
            <DespesaRow
              key={despesa.id}
              despesa={despesa}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {despesas.length > 0 && (
            <TableRow className="bg-muted/50">
              <TableCell colSpan={3} className="font-medium">
                Total ({despesas.length} despesa
                {despesas.length !== 1 ? "s" : ""})
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(totalExibido)}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
