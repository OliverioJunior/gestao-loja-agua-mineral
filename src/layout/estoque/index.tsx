"use client";

import { Cards } from "./Cards";

import { TabelaProdutos } from "./TabelaProdutos";

export function EstoquePage() {
  const produtosMock = [
    {
      id: 1,
      nome: "Água 500ml",
      categoria: "Água Mineral",
      estoque: 20,
      minimo: 20,
      preco: 2.5,
      status: "ok",
      ultimaMovimentacao: "2024-06-10",
    },
    {
      id: 2,
      nome: "Água 1.5L",
      categoria: "Água Mineral",
      estoque: 8,
      minimo: 15,
      preco: 4.8,
      status: "baixo",
      ultimaMovimentacao: "2024-06-09",
    },
    {
      id: 3,
      nome: "Água 5L",
      categoria: "Água Mineral",
      estoque: 35,
      minimo: 30,
      preco: 12.9,
      status: "ok",
      ultimaMovimentacao: "2024-06-11",
    },
    {
      id: 4,
      nome: "Água com gás 500ml",
      categoria: "Água com Gás",
      estoque: 0,
      minimo: 25,
      preco: 3.2,
      status: "critico",
      ultimaMovimentacao: "2024-06-05",
    },
    {
      id: 5,
      nome: "Água Saborizada Limão",
      categoria: "Água Saborizada",
      estoque: 45,
      minimo: 20,
      preco: 3.8,
      status: "ok",
      ultimaMovimentacao: "2024-06-11",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        <Cards produtos={produtosMock} />

        <TabelaProdutos
          produtos={produtosMock}
          onDelete={() => console.log("delete")}
          onEdit={() => console.log("edit")}
          onView={() => console.log("view")}
        />
      </div>
    </div>
  );
}
