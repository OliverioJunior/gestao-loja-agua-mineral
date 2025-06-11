"use client";
import { useState } from "react";
import { FiltrosPesquisa } from "./FiltrosPesquisa";
import { IProduto, ProdutoRow } from "./ProdutoRow";

interface ITabelaProduto {
  produtos: IProduto[];
  onView: (produto: IProduto) => void;
  onEdit: (produto: IProduto) => void;
  onDelete: (produto: IProduto) => void;
}

export function TabelaProdutos({
  produtos,
  onView,
  onEdit,
  onDelete,
}: ITabelaProduto) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const filteredProdutos = produtos.filter((produto) => {
    if (filterStatus !== "todos" && produto.status !== filterStatus) {
      return false;
    }

    if (
      searchTerm &&
      !produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
  return (
    <>
      <FiltrosPesquisa
        filterStatus={filterStatus}
        onAddProduct={() => console.log("adicionar produto")}
        searchTerm={searchTerm}
        setFilterStatus={setFilterStatus}
        setSearchTerm={setSearchTerm}
      />
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30 border-b border-slate-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Produto
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Categoria
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Estoque
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Preço
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium">
                  Última Movimentação
                </th>
                <th className="text-center py-4 px-6 text-slate-300 font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map((produto) => (
                <ProdutoRow
                  key={produto.id}
                  produto={produto}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
