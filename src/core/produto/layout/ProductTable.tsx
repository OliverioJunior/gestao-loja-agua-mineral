import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { ProductRow } from "./ProductRow";
import { TProdutoWithCategoria } from "@/core/produto/domain/produto.entity";

interface ProductTableProps {
  products: TProdutoWithCategoria[];
  onView: (product: TProdutoWithCategoria) => void;
  onEdit: (product: TProdutoWithCategoria) => void;
  onDelete: (product: TProdutoWithCategoria) => void;
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="max-md:max-w-[300px] max-md:overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-slate-700/30 border-b border-slate-700/50">
            <TableRow>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Produto
              </TableHead>

              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Preços
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Estoque
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
            {products.length > 0 ? (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
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
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-center" colSpan={6}>
                <span className="text-sm text-slate-400">
                  {products.length} produto(s) encontrado(s)
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
