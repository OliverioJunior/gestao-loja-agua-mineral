import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

import { ICategory } from "./types";
import { CategoryRow } from "./CategoryRow";

interface CategoryTableProps {
  categories: ICategory[];
  onView: (category: ICategory) => void;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

export function CategoryTable({
  categories,
  onView,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-slate-700/30 border-b border-slate-700/50">
            <TableRow>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Categoria
              </TableHead>

              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Produtos
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Data de Criação
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Última Atualização
              </TableHead>
              <TableHead
                className="text-center py-4 px-6 text-slate-300 font-medium"
                colSpan={2}
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-400"
                >
                  Nenhuma categoria encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-center" colSpan={5}>
                <span className="text-sm text-slate-400">
                  {categories.length} categoria(s) encontrada(s)
                </span>
              </TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
