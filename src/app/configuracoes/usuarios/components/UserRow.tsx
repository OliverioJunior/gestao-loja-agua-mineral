import {
  TableRow,
  TableCell,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui";
import {
  Users,
  Eye,
  Edit3,
  Trash2,
  Shield,
  Mail,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { IUserRow } from "./types";
import { getRoleColor, getRoleText } from "./user-utils";

export function UserRow({ user, onView, onEdit, onDelete }: IUserRow) {
  return (
    <TableRow className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-slate-200">{user.name}</p>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(
            user.role
          )}`}
        >
          <Shield className="h-3 w-3" />
          {getRoleText(user.role)}
        </span>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-1 text-slate-300">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-1 text-slate-300">
          <span className="text-sm">
            {format(new Date(user.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(user)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-slate-200">
                  Confirmar exclusão
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Tem certeza que deseja excluir o usuário{" "}
                  <span className="font-medium text-slate-200">
                    {user.name}
                  </span>
                  ? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(user)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}