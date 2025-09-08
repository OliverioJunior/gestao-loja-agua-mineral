import {
  TableRow,
  TableCell,
  Button,
  ConfirmationModal,
} from "@/shared/components/ui";

import { Tag, Eye, Edit3, Trash2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { ICategoryRow } from "./types";

export function CategoryRow({
  category,
  onView,
  onEdit,
  onDelete,
}: ICategoryRow) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(category);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };
  return (
    <>
      <TableRow className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
        <TableCell className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{category.nome}</p>
              <p className="text-sm text-slate-400">{category.description}</p>
            </div>
          </div>
        </TableCell>

        <TableCell className="py-4 px-6">
          <div className="flex items-center gap-1 text-slate-300">
            <Package className="h-4 w-4" />
            <span className="text-sm">{category.productsCount} produto(s)</span>
          </div>
        </TableCell>
        <TableCell className="py-4 px-6">
          <div className="flex items-center gap-1 text-slate-300">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {format(new Date(category.createdAt), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>
        </TableCell>
        <TableCell className="py-4 px-6">
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-sm">
              {format(new Date(category.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        </TableCell>
        <TableCell className="py-4 px-6" colSpan={2}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(category)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir a categoria "${category.nome}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        actionType="delete"
        itemInfo={{
          type: "categoria",
          name: category.nome,
          details: { warning: "Esta ação não pode ser desfeita." },
        }}
        confirmButton={{
          text: "Excluir",
          variant: "destructive",
        }}
        cancelButton={{
          text: "Cancelar",
          variant: "outline",
        }}
        data-testid="delete-category-modal"
      />
    </>
  );
}
