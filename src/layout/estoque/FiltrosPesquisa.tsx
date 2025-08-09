"use client";

import { Search, Download } from "lucide-react";
import { DialogEstoque } from "./DialogEstoque";
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";

interface IFiltrosPesquisa {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
}

export function FiltrosPesquisa({
  searchTerm,
  setSearchTerm,
  setFilterStatus,
}: IFiltrosPesquisa) {
  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg  text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-4 py-5"
              />
            </div>

            <Select
              defaultValue="todos"
              onValueChange={(e) => setFilterStatus(e)}
              name="select-status"
            >
              <SelectTrigger name="select-status" size="lg">
                <SelectValue
                  placeholder="Todos os status"
                  aria-label="options-status"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem aria-label="status" value="todos">
                    Todos os status
                  </SelectItem>
                  <SelectItem value="ok">Em estoque</SelectItem>
                  <SelectItem value="baixo">Estoque baixo</SelectItem>
                  <SelectItem value="critico">Estoque crítico</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600/50 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <DialogEstoque />
          </div>
        </div>
      </div>
    </>
  );
}
