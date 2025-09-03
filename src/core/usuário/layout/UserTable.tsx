import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { UserRow } from "./UserRow";
import { IUser } from "./types";

interface UserTableProps {
  users: IUser[];
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export function UserTable({ users, onView, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="max-md:max-w-[300px] max-md:overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-slate-700/30 border-b border-slate-700/50">
            <TableRow>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Usuário
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Função
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Data de Criação
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                Última Atualização
              </TableHead>
              <TableHead className="text-center py-4 px-6 text-slate-300 font-medium">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-400"
                >
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-center" colSpan={4}>
                <span className="text-sm text-slate-400">
                  {users.length} usuário(s) encontrado(s)
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
