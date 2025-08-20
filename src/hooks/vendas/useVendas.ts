import { CreateVendaInput, TVendas } from "@/core/vendas";
import { useState, useEffect, useCallback } from "react";

export function useVendas() {
  const [vendas, setVendas] = useState<TVendas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/venda");
      if (!response.ok) {
        throw new Error("Erro ao carregar vendas");
      }
      const data: TVendas[] = await response.json();
      setVendas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);
  const createVendas = useCallback(
    async (venda: CreateVendaInput) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/venda", {
          method: "POST",
          body: JSON.stringify(venda),
        });
        if (!response.ok) {
          throw new Error("Erro ao criar venda");
        }
        const data: TVendas = await response.json();
        setVendas([...vendas, data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [vendas]
  );

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  return {
    vendas,
    loading,
    error,
    fetchVendas,
    createVendas,
  };
}
