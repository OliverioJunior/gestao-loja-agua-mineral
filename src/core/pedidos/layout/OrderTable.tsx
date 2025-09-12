import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { Package } from "lucide-react";
import { OrderTableProps } from "./types";
import { OrderRow } from "./OrderRow";

export function OrderTable({
  orders,
  onView,
  onEdit,
  onDelete,
  onAdvanceStatus,
  onCancelOrder,
  isLoading,
}: OrderTableProps) {
  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden max-md:max-w-[88vw] max-md:overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 bg-muted/30">
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Data
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Cliente
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Tipo de Entrega
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Pagamento
              </TableHead>
              <TableHead className="px-4 py-3 text-left font-medium text-foreground">
                Total
              </TableHead>
              <TableHead className="px-4 py-3 text-center font-medium text-foreground">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Skeleton rows para loading */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-b border-border/30">
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-28"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-muted animate-pulse rounded-full w-20"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-muted animate-pulse rounded-full w-24"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-muted animate-pulse rounded-full w-20"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                    <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                  </div>
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Estado vazio (sem dados)
  if (orders.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum pedido encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há pedidos cadastrados ou que correspondam aos filtros
            aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden max-md:max-w-[88vw] max-md:overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 bg-muted/30">
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Data
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Cliente
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Tipo de Entrega
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Status
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Pagamento
            </TableHead>
            <TableHead className="px-4 py-3 text-left font-medium text-foreground">
              Total
            </TableHead>
            <TableHead className="px-4 py-3 text-center font-medium text-foreground">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdvanceStatus={onAdvanceStatus}
              onCancelOrder={onCancelOrder}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
