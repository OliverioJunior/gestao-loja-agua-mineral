"use client";
import { useState } from "react";
import { FiltrosPesquisa } from "./FiltrosPesquisa";
import { IProduto, ProdutoRow } from "./ProdutoRow";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";

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
        searchTerm={searchTerm}
        setFilterStatus={setFilterStatus}
        setSearchTerm={setSearchTerm}
      />
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-700/30 border-b border-slate-700/50">
              <TableRow>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Produto
                </TableHead>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Categoria
                </TableHead>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Estoque
                </TableHead>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Preço
                </TableHead>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-left py-4 px-6 text-slate-300 font-medium">
                  Última Movimentação
                </TableHead>
                <TableHead className="text-center py-4 px-6 text-slate-300 font-medium">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <ProdutoRow
                  key={produto.id}
                  produto={produto}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-center" colSpan={6}></TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </>
  );
}
