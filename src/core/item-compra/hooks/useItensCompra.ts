import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  TItemCompraWithRelations,
  CreateItemCompraInput,
  UpdateItemCompraInput,
} from "../domain/item-compra.entity";
import { ItemCompra } from "../domain/item-compra";

export interface IItemCompraHook {
  // Estados principais
  items: TItemCompraWithRelations[];
  loading: boolean;
  error: string | null;

  // Estados de UI
  searchTerm: string;
  selectedItem: TItemCompraWithRelations | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Operações CRUD
  fetchItems: () => Promise<void>;
  createItem: (data: CreateItemCompraInput) => Promise<void>;
  updateItem: (id: string, data: UpdateItemCompraInput) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  // Operações específicas
  fetchItemsByCompra: (compraId: string) => Promise<void>;
  fetchItemsByProduto: (produtoId: string) => Promise<void>;
  calculateTotalByCompra: (compraId: string) => Promise<number>;

  // Handlers de UI
  setSearchTerm: (term: string) => void;
  handleItemClick: (item: TItemCompraWithRelations) => void;
  handleAddClick: () => void;
  handleEditClick: (item: TItemCompraWithRelations) => void;
  handleDeleteClick: (item: TItemCompraWithRelations) => void;
  handleCloseModals: () => void;

  // Dados computados
  filteredItems: TItemCompraWithRelations[];
  totalItems: number;
  totalValue: number;
}

export const useItensCompra = (): IItemCompraHook => {
  // Estados principais
  const [items, setItems] = useState<TItemCompraWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<TItemCompraWithRelations | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Operações CRUD
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await ItemCompra.service.findAll();
      setItems(fetchedItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar itens de compra";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(
    async (data: CreateItemCompraInput) => {
      try {
        setLoading(true);
        await ItemCompra.service.create(data);
        await fetchItems();
        toast.success("Item de compra criado com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar item de compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  const updateItem = useCallback(
    async (id: string, data: UpdateItemCompraInput) => {
      try {
        setLoading(true);
        await ItemCompra.service.update(id, data);
        await fetchItems();
        toast.success("Item de compra atualizado com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao atualizar item de compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await ItemCompra.service.delete(id);
        await fetchItems();
        toast.success("Item de compra excluído com sucesso!");
        handleCloseModals();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao excluir item de compra";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  // Operações específicas
  const fetchItemsByCompra = useCallback(async (compraId: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await ItemCompra.service.findByCompraId(compraId);
      setItems(fetchedItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar itens da compra";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItemsByProduto = useCallback(async (produtoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedItems = await ItemCompra.service.findByProdutoId(produtoId);
      setItems(fetchedItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar itens do produto";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateTotalByCompra = useCallback(
    async (compraId: string): Promise<number> => {
      try {
        return await ItemCompra.service.calculateTotalByCompra(compraId);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao calcular total da compra";
        toast.error(errorMessage);
        return 0;
      }
    },
    []
  );

  // Handlers de UI
  const handleItemClick = useCallback((item: TItemCompraWithRelations) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  }, []);

  const handleAddClick = useCallback(() => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  }, []);

  const handleEditClick = useCallback((item: TItemCompraWithRelations) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item: TItemCompraWithRelations) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Dados computados
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.produto?.nome?.toLowerCase().includes(term) ||
        item.compra?.fornecedor?.nome?.toLowerCase().includes(term) ||
        item.compra?.numeroNota?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const totalItems = useMemo(() => filteredItems.length, [filteredItems]);

  const totalValue = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (item.precoTotal || 0), 0);
  }, [filteredItems]);

  // Effects
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Return
  return {
    // Estados principais
    items: filteredItems,
    loading,
    error,

    // Estados de UI
    searchTerm,
    selectedItem,
    isAddModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,

    // Operações CRUD
    fetchItems,
    createItem,
    updateItem,
    deleteItem,

    // Operações específicas
    fetchItemsByCompra,
    fetchItemsByProduto,
    calculateTotalByCompra,

    // Handlers de UI
    setSearchTerm,
    handleItemClick,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModals,

    // Dados computados
    filteredItems,
    totalItems,
    totalValue,
  };
};
