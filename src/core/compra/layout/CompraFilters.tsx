import { Search, ShoppingCart, Clock, CheckCircle, Package, XCircle, DollarSign, Calendar } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { CompraFiltersProps } from "./types";
import { CompraUtils } from "./compra-utils";

export function CompraFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  totalCompras,
  comprasPendentes,
  comprasConfirmadas,
  comprasRecebidas,
  comprasCanceladas,
  valorTotal
}: CompraFiltersProps) {
  const handleClearDateFilter = () => {
    onDateFilterChange({ startDate: null, endDate: null });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = value ? new Date(value) : null;
    onDateFilterChange({
      ...dateFilter,
      [field]: date
    });
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número da nota, fornecedor ou observações..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os Status</SelectItem>
              <SelectItem value="PENDENTE">Pendentes</SelectItem>
              <SelectItem value="CONFIRMADA">Confirmadas</SelectItem>
              <SelectItem value="RECEBIDA">Recebidas</SelectItem>
              <SelectItem value="CANCELADA">Canceladas</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="date"
              value={dateFilter.startDate ? dateFilter.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="w-full sm:w-40"
              placeholder="Data inicial"
            />
            <Input
              type="date"
              value={dateFilter.endDate ? dateFilter.endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="w-full sm:w-40"
              placeholder="Data final"
            />
            {(dateFilter.startDate || dateFilter.endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearDateFilter}
                className="px-3"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Compras
                </p>
                <p className="text-2xl font-bold">
                  {totalCompras.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pendentes
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {comprasPendentes.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Confirmadas
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {comprasConfirmadas.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recebidas
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {comprasRecebidas.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Canceladas
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {comprasCanceladas.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </p>
                <p className="text-xl font-bold text-purple-600">
                  {CompraUtils.formatCurrency(valorTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de filtros ativos */}
      {(statusFilter !== "TODOS" || dateFilter.startDate || dateFilter.endDate || searchTerm) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Filtros ativos:</span>
              <div className="flex flex-wrap gap-2">
                {statusFilter !== "TODOS" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    Status: {CompraUtils.getStatusText(statusFilter)}
                  </span>
                )}
                {dateFilter.startDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    De: {CompraUtils.formatDate(dateFilter.startDate)}
                  </span>
                )}
                {dateFilter.endDate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    Até: {CompraUtils.formatDate(dateFilter.endDate)}
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                    Busca: &quot;{searchTerm}&quot;
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}