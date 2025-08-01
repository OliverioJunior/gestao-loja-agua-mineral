import { Button, TableCell, TableRow } from "@/shared/components/ui";
import { Package, Eye, Edit3, Trash2 } from "lucide-react";

interface IProdutoRow {
  produto: IProduto;
  onView: (produto: IProduto) => void;
  onEdit: (produto: IProduto) => void;
  onDelete: (produto: IProduto) => void;
}
export interface IProduto {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  minimo: number;
  preco: number;
  status: string;
  ultimaMovimentacao: string;
}
export function ProdutoRow({ produto, onView, onEdit, onDelete }: IProdutoRow) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "text-green-400";
      case "baixo":
        return "text-yellow-400";
      case "critico":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "baixo":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "critico":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ok":
        return "Em estoque";
      case "baixo":
        return "Estoque baixo";
      case "critico":
        return "Estoque crítico";
      default:
        return "Sem estoque";
    }
  };

  return (
    <TableRow className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-white font-medium">{produto.nome}</p>
            <p className="text-slate-400 text-sm">
              ID: #{produto.id.toString().padStart(3, "0")}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 text-slate-300">
        {produto.categoria}
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${getStatusColor(produto.status)}`}>
            {produto.estoque}
          </span>
          <span className="text-slate-400 text-sm">/ min {produto.minimo}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 text-white font-medium">
        R$ {produto.preco.toFixed(2)}
      </TableCell>
      <TableCell className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
            produto.status
          )}`}
        >
          {getStatusText(produto.status)}
        </span>
      </TableCell>
      <TableCell className="py-4 px-6 text-slate-300">
        {new Date(produto.ultimaMovimentacao).toLocaleDateString("pt-BR")}
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={"ghost"}
            onClick={() => onView(produto)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            aria-label="View"
            name="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => onEdit(produto)}
            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            aria-label="Edit"
            name="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => onDelete(produto)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label="Delete"
            name="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
