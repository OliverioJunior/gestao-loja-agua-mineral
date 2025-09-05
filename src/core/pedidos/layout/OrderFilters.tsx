import { useState } from "react";
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Search, Plus, Download } from "lucide-react";
import { OrderFiltersProps } from "./types";
import { AddOrderModal } from "./AddOrderModal";
import { CreatePedidoInput } from "../domain";

export function OrderFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onAddOrder,
}: OrderFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddOrder = async (order: CreatePedidoInput) => {
    await onAddOrder(order);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por número, cliente ou telefone..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>

            {/* Filtro por Status */}
            <div className="min-w-[200px]">
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="preparando">Preparando</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-background/50 border-border/50 hover:bg-background/80"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Novo Pedido
            </Button>
          </div>
        </div>
      </div>

      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrder}
      />
    </>
  );
}
