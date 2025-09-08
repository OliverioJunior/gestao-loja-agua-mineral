import { ConfirmationModal } from "@/shared/components/ui";
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

  const handleConfirm = async () => {
    onConfirm(product);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmar Exclusão"
      description="Esta ação não pode ser desfeita. Tem certeza que deseja excluir este produto?"
      variant="danger"
      actionType="delete"
      size="md"
      itemInfo={{
        name: product.nome,
        type: "produto",
        id: product.id,
        details: {
          categoria: product.categoria?.nome || "Sem categoria",
          estoque: `${product.estoque} unidades`,
        },
      }}
      confirmButton={{
        text: "Excluir Produto",
        variant: "destructive",
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
      }}
      data-testid="delete-product-modal"
    >
      <p className="text-sm text-muted-foreground">
        Todos os dados relacionados a este produto serão permanentemente
        removidos.
      </p>
    </ConfirmationModal>
  );
}
