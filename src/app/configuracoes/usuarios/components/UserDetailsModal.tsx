import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IUser } from "./types";
import { getRoleText } from "./user-utils";

interface UserDetailsModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: IUser) => void;
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onEdit,
}: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200">{user.name}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Função:
              </label>
              <p className="text-slate-200">{getRoleText(user.role)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">
                Data de criação:
              </label>
              <p className="text-slate-200">
                {format(
                  new Date(user.createdAt),
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
                  new Date(user.updatedAt),
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
              onEdit(user);
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