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
import { Search, Plus, X } from "lucide-react";
import { OrderFiltersProps } from "./types";
import { AddOrderModal } from "./AddOrderModal";
import { CreatePedidoInput } from "../domain";

export function OrderFilters({
  searchTerm,
  statusFilter,
  startDate,
  endDate,
  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onAddOrder,
}: OrderFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddOrder = async (order: CreatePedidoInput) => {
    await onAddOrder(order);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-3 sm:p-5 lg:p-6 mb-6 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Header com título */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/20">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Filtros de Busca</h3>
              <p className="text-sm text-muted-foreground">Encontre pedidos rapidamente</p>
            </div>
          </div>

          {/* Busca Principal */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground/90">
              🔍 Busca Rápida
            </label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Digite o número do pedido, nome do cliente ou telefone..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 h-12 bg-background/70 border-2 border-border/50 rounded-xl text-base placeholder:text-muted-foreground/60 transition-all duration-200 focus:border-primary/50 focus:bg-background/90 focus:shadow-lg focus:shadow-primary/10 touch-manipulation"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Status Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/90">
                📊 Status do Pedido
              </label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="h-12 bg-background/70 border-2 border-border/50 rounded-xl text-base transition-all duration-200 focus:border-primary/50 focus:bg-background/90 focus:shadow-lg focus:shadow-primary/10 touch-manipulation">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  <SelectItem value="todos" className="text-base py-3 px-4 rounded-lg m-1 focus:bg-primary/10">🔄 Todos os status</SelectItem>
                  <SelectItem value="PENDENTE" className="text-base py-3 px-4 rounded-lg m-1 focus:bg-yellow-500/10">📋 Pendente</SelectItem>
                  <SelectItem value="CONFIRMADO" className="text-base py-3 px-4 rounded-lg m-1 focus:bg-blue-500/10">✅ Confirmado</SelectItem>
                  <SelectItem value="ENTREGUE" className="text-base py-3 px-4 rounded-lg m-1 focus:bg-green-500/10">🚚 Entregue</SelectItem>
                  <SelectItem value="CANCELADO" className="text-base py-3 px-4 rounded-lg m-1 focus:bg-red-500/10">❌ Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Início */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/90">
                📅 Data Início
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => onStartDateChange?.(e.target.value)}
                  className="h-12 bg-background/70 border-2 border-border/50 rounded-xl text-base transition-all duration-200 focus:border-primary/50 focus:bg-background/90 focus:shadow-lg focus:shadow-primary/10 touch-manipulation"
                />
              </div>
            </div>

            {/* Data Fim */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground/90">
                📅 Data Fim
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => onEndDateChange?.(e.target.value)}
                  className="h-12 bg-background/70 border-2 border-border/50 rounded-xl text-base transition-all duration-200 focus:border-primary/50 focus:bg-background/90 focus:shadow-lg focus:shadow-primary/10 touch-manipulation"
                />
              </div>
            </div>
          </div>

          {/* Ações e Controles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-border/20">
            {/* Botão Limpar Filtros */}
            {(startDate || endDate || searchTerm || statusFilter !== "todos") && (
              <Button
                variant="outline"
                onClick={() => {
                  onSearchChange("");
                  onStatusChange("todos");
                  onStartDateChange?.("");
                  onEndDateChange?.("");
                }}
                className="h-11 px-4 bg-background/50 border-2 border-border/50 hover:bg-background/80 hover:border-border/70 rounded-xl transition-all duration-200 touch-manipulation group"
              >
                <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Limpar Filtros</span>
              </Button>
            )}

            {/* Filtros Rápidos de Período */}
             <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
               <div className="flex flex-wrap gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     const yesterday = new Date();
                     yesterday.setDate(yesterday.getDate() - 1);
                     const dateStr = yesterday.toISOString().split('T')[0];
                     onStartDateChange?.(dateStr);
                     onEndDateChange?.(dateStr);
                   }}
                   className="h-9 px-3 bg-background/50 border border-border/50 hover:bg-background/80 rounded-lg transition-all duration-200 text-xs font-medium"
                 >
                   📅 Ontem
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     const today = new Date().toISOString().split('T')[0];
                     onStartDateChange?.(today);
                     onEndDateChange?.(today);
                   }}
                   className="h-9 px-3 bg-background/50 border border-border/50 hover:bg-background/80 rounded-lg transition-all duration-200 text-xs font-medium"
                 >
                   🗓️ Hoje
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     const today = new Date();
                     const weekStart = new Date(today);
                     weekStart.setDate(today.getDate() - today.getDay());
                     const weekEnd = new Date(weekStart);
                     weekEnd.setDate(weekStart.getDate() + 6);
                     onStartDateChange?.(weekStart.toISOString().split('T')[0]);
                     onEndDateChange?.(weekEnd.toISOString().split('T')[0]);
                   }}
                   className="h-9 px-3 bg-background/50 border border-border/50 hover:bg-background/80 rounded-lg transition-all duration-200 text-xs font-medium"
                 >
                   📊 Semana
                 </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => {
                     const today = new Date();
                     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                     const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                     onStartDateChange?.(monthStart.toISOString().split('T')[0]);
                     onEndDateChange?.(monthEnd.toISOString().split('T')[0]);
                   }}
                   className="h-9 px-3 bg-background/50 border border-border/50 hover:bg-background/80 rounded-lg transition-all duration-200 text-xs font-medium"
                 >
                   📈 Mês
                 </Button>
               </div>
               <Button
                 onClick={() => setIsAddModalOpen(true)}
                 className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground rounded-xl transition-all duration-200 touch-manipulation group font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
               >
                 <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                 <span className="hidden sm:inline">Novo Pedido</span>
                 <span className="sm:hidden">Novo</span>
               </Button>
             </div>
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
