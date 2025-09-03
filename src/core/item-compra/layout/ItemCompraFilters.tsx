import { Search, Package, DollarSign } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ItemCompraFiltersProps } from "./types";
import { ItemCompraUtils } from "./item-compra-utils";

export function ItemCompraFilters({
  searchTerm,
  onSearchChange,
  totalItems,
  totalValue
}: ItemCompraFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por produto, fornecedor ou nota fiscal..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Itens
                </p>
                <p className="text-2xl font-bold">
                  {totalItems.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </p>
                <p className="text-2xl font-bold">
                  {ItemCompraUtils.formatCurrency(totalValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}