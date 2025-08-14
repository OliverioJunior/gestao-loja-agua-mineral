import { Input } from "@/shared/components/ui";
import { Search } from "lucide-react";
import { ICategory, IFiltrosCategorias } from "./types";
import { AddCategoryModal } from "./AddCategoryModal";

interface CategoryFiltersProps extends IFiltrosCategorias {
  onAddCategory: (category: ICategory) => void;
}

export function CategoryFilters({
  searchTerm,
  setSearchTerm,
  onAddCategory,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-400 focus:border-blue-500"
        />
      </div>

      <AddCategoryModal onAddCategory={onAddCategory} />
    </div>
  );
}
