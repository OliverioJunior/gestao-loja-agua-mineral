import { ConfirmationModal } from "@/shared/components/ui";
import { TClienteWithCount } from "@/core/cliente/domain/cliente.entity";

interface DeleteClientModalProps {
  client: TClienteWithCount | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (client: TClienteWithCount) => void;
}

export function DeleteClientModal({
  client,
  isOpen,
  onClose,
  onConfirm,
}: DeleteClientModalProps) {
  if (!client) return null;

  const handleConfirm = () => {
    onConfirm(client);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmar Exclusão"
      description={`Tem certeza que deseja excluir o cliente "${client.nome}"? Todos os dados relacionados a este cliente serão permanentemente removidos.`}
      variant="danger"
      actionType="delete"
      itemInfo={{
        type: "cliente",
        name: client.nome,
        details: { warning: "Todos os dados relacionados serão removidos." },
      }}
      confirmButton={{
        text: "Excluir Cliente",
        variant: "destructive",
      }}
      cancelButton={{
        text: "Cancelar",
        variant: "outline",
      }}
      data-testid="delete-client-modal"
    />
  );
}
