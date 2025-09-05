import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/shared/components/ui";
import { AlertTriangle } from "lucide-react";
import { TProdutoWithCategoria } from "@/core/produto/domain/produto.entity";

interface DeleteConfirmModalProps {
  product: TProdutoWithCategoria | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: TProdutoWithCategoria) => void;
}

export function DeleteConfirmModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Esta ação não pode ser desfeita
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-foreground">
            Tem certeza que deseja excluir o produto{" "}
            <span className="font-semibold text-red-600">
              &quot;{product.nome}&quot;
            </span>
            ?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Todos os dados relacionados a este produto serão permanentemente
            removidos.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir Produto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
