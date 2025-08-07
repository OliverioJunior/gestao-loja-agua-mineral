import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Search } from "lucide-react";
import { IFiltrosUsuarios } from "./types";
import { AddUserModal } from "./AddUserModal";

export function UserFilters({
  searchTerm,
  setSearchTerm,
  setFilterRole,
}: IFiltrosUsuarios) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-400 focus:border-blue-500"
          />
        </div>
        <Select onValueChange={setFilterRole}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-slate-200">
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="todos" className="text-slate-200">
              Todas as funções
            </SelectItem>
            <SelectItem value="admin" className="text-slate-200">
              Administrador
            </SelectItem>
            <SelectItem value="manager" className="text-slate-200">
              Gerente
            </SelectItem>
            <SelectItem value="user" className="text-slate-200">
              Usuário
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <AddUserModal />
    </div>
  );
}