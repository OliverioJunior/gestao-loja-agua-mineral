import { Search, ChevronDown, Download, Plus } from "lucide-react";

interface IFiltrosPesquisa {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  onAddProduct: () => void;
}

export function FiltrosPesquisa({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onAddProduct,
}: IFiltrosPesquisa) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
            >
              <option value="todos">Todos os status</option>
              <option value="ok">Em estoque</option>
              <option value="baixo">Estoque baixo</option>
              <option value="critico">Estoque crítico</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-slate-700/50 border border-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600/50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={onAddProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
