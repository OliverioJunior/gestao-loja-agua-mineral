"use client";

import { useState, useEffect, useCallback } from "react";
import { TProdutoWithCategoria } from "@/core/produto/domain/produto.entity";

export interface IProdutoEstoque {
  id: string;
  nome: string;
  categoria: string;
  marca: string;
  estoque: number;
  estoqueMinimo: number;
  precoCusto: number;
  precoVenda: number;
  precoRevenda?: number;
  ativo: boolean;
  status: "ok" | "baixo" | "critico";
  ultimaMovimentacao: Date;
}

export function useProdutos() {
  const [produtos, setProdutos] = useState<IProdutoEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProdutos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/produto");
      if (!response.ok) {
        throw new Error("Erro ao carregar produtos");
      }

      const data: TProdutoWithCategoria[] = await response.json();

      // Transformar dados para o formato do estoque
      const produtosEstoque: IProdutoEstoque[] = data.map((produto) => {
        const estoqueMinimo = produto.estoqueMinimo ?? 0;
        const status = getStatusEstoque(produto.estoque, estoqueMinimo);

        return {
          id: produto.id,
          nome: produto.nome,
          marca: produto.marca || "Sem marca",
          categoria: produto.categoria?.nome || "Sem categoria",
          estoque: produto.estoque,
          estoqueMinimo,
          precoCusto: produto.precoCusto,
          precoVenda: produto.precoVenda,
          precoRevenda: produto.precoRevenda ?? undefined,
          ativo: produto.ativo,
          status,
          ultimaMovimentacao: new Date(produto.updatedAt),
        };
      });

      setProdutos(produtosEstoque);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusEstoque = (
    estoque: number,
    minimo: number
  ): "ok" | "baixo" | "critico" => {
    if (estoque === 0) return "critico";
    if (estoque <= minimo) return "baixo";
    return "ok";
  };

  const getEstatisticas = () => {
    const total = produtos.length;
    const ativos = produtos.filter((p) => p.ativo).length;
    const inativos = total - ativos;
    const estoqueOk = produtos.filter((p) => p.status === "ok").length;
    const estoqueBaixo = produtos.filter((p) => p.status === "baixo").length;
    const estoqueCritico = produtos.filter(
      (p) => p.status === "critico"
    ).length;
    const valorTotalEstoque = produtos.reduce(
      (acc, p) => acc + p.estoque * p.precoCusto,
      0
    );

    return {
      total,
      ativos,
      inativos,
      estoqueOk,
      estoqueBaixo,
      estoqueCritico,
      valorTotalEstoque,
    };
  };

  const filtrarProdutos = (searchTerm: string, statusFilter: string) => {
    return produtos.filter((produto) => {
      const matchesSearch =
        searchTerm === "" ||
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.categoria.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" || produto.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const atualizarEstoque = async (produtoId: string, novoEstoque: number) => {
    try {
      const response = await fetch(`/api/produto/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: produtoId,
          estoque: novoEstoque,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar estoque");
      }

      // Recarregar produtos após atualização
      await fetchProdutos();

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar estoque"
      );
      return false;
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  return {
    produtos,
    loading,
    error,
    fetchProdutos,
    getEstatisticas,
    filtrarProdutos,
    atualizarEstoque,
  };
}
