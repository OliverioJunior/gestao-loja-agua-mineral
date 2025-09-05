import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { Tag, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ICategory } from "./types";

interface CategoryDetailsModalProps {
  category: ICategory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category: ICategory) => void;
}

export function CategoryDetailsModal({
  category,
  isOpen,
  onClose,
  onEdit,
}: CategoryDetailsModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Detalhes da Categoria
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200">{category.nome}</h3>
              <p className="text-sm text-slate-400">{category.description}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Quantidade de produtos:
              </label>
              <p className="text-slate-200 flex items-center gap-1">
                <Package className="h-4 w-4" />
                {category.productsCount} produto(s)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">
                Data de criação:
              </label>
              <p className="text-slate-200">
                {format(
                  new Date(category.createdAt),
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  { locale: ptBR }
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">
                Última atualização:
              </label>
              <p className="text-slate-200">
                {format(
                  new Date(category.updatedAt),
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  { locale: ptBR }
                )}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Fechar
          </Button>
          <Button
            onClick={() => {
              onEdit(category);
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
