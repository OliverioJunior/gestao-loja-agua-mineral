"use client";
import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Search, Plus, Filter } from "lucide-react";
import { DespesaFiltersProps } from "./types";
import { categoriaOptions, formaPagamentoOptions } from "./despesa-utils";

export function DespesaFilters({
  searchTerm,
  filterCategoria,
  filterFormaPagamento,
  onSearchChange,
  onCategoriaChange,
  onFormaPagamentoChange,
  onAddDespesa,
}: DespesaFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Linha principal com busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por descrição ou observações..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>

          <Button onClick={onAddDespesa} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          {/* Filtro de Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={filterCategoria} onValueChange={onCategoriaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Forma de Pagamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Forma de Pagamento</label>
            <Select
              value={filterFormaPagamento}
              onValueChange={onFormaPagamentoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma forma" />
              </SelectTrigger>
              <SelectContent>
                {formaPagamentoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão para limpar filtros */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                onSearchChange("");
                onCategoriaChange("TODAS");
                onFormaPagamentoChange("TODAS");
              }}
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
