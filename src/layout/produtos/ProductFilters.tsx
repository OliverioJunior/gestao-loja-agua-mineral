import { Search, Filter, Plus } from "lucide-react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "@/shared/components/ui";
import { IFiltrosProdutos } from "./types";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: IFiltrosProdutos;
  onFiltersChange: (filters: IFiltrosProdutos) => void;
  onAddProduct: () => void;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onAddProduct,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome, marca ou categoria..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
        />
      </div>
      
      <div className="flex gap-2">
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[160px] bg-background/50 backdrop-blur-sm border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
            <SelectItem value="promocao">Em Promoção</SelectItem>
            <SelectItem value="estoque_baixo">Estoque Baixo</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={onAddProduct}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
}