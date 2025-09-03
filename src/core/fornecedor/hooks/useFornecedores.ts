import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  TFornecedorWithRelations,
  CreateFornecedorInput,
  UpdateFornecedorInput
} from "../domain/fornecedor.entity";
import { Fornecedor } from "../domain/fornecedor";

export interface IFornecedorHook {
  // Estados principais
  fornecedores: TFornecedorWithRelations[];
  loading: boolean;
  error: string | null;
  
  // Estados de UI
  searchTerm: string;
  statusFilter: string;
  selectedFornecedor: TFornecedorWithRelations | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDetailsModalOpen: boolean;
  isDeleteModalOpen: boolean;
  
  // Operações CRUD
  fetchFornecedores: () => Promise<void>;
  createFornecedor: (data: CreateFornecedorInput) => Promise<void>;
  updateFornecedor: (id: string, data: UpdateFornecedorInput) => Promise<void>;
  deleteFornecedor: (id: string) => Promise<void>;
  
  // Operações específicas
  fetchFornecedoresByStatus: (status: string) => Promise<void>;
  searchFornecedoresByName: (name: string) => Promise<void>;
  activateFornecedor: (id: string) => Promise<void>;
  deactivateFornecedor: (id: string) => Promise<void>;
  getStatistics: () => Promise<{
    total: number;
    ativos: number;
    inativos: number;
    totalCompras: number;
  } | null>;
  
  // Handlers de UI
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  handleFornecedorClick: (fornecedor: TFornecedorWithRelations) => void;
  handleAddClick: () => void;
  handleEditClick: (fornecedor: TFornecedorWithRelations) => void;
  handleDeleteClick: (fornecedor: TFornecedorWithRelations) => void;
  handleCloseModals: () => void;
  
  // Dados computados
  filteredFornecedores: TFornecedorWithRelations[];
  totalFornecedores: number;
  activeFornecedores: number;
  inactiveFornecedores: number;
}

export const useFornecedores = (): IFornecedorHook => {
  // Estados principais
  const [fornecedores, setFornecedores] = useState<TFornecedorWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [selectedFornecedor, setSelectedFornecedor] = useState<TFornecedorWithRelations | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Operações CRUD
  const fetchFornecedores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFornecedores = await Fornecedor.service.findAll();
      setFornecedores(fetchedFornecedores);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar fornecedores";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFornecedor = useCallback(async (data: CreateFornecedorInput) => {
    try {
      setLoading(true);
      await Fornecedor.service.create(data);
      await fetchFornecedores();
      toast.success("Fornecedor criado com sucesso!");
      handleCloseModals();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar fornecedor";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFornecedores]);

  const updateFornecedor = useCallback(async (id: string, data: UpdateFornecedorInput) => {
    try {
      setLoading(true);
      await Fornecedor.service.update(id, data);
      await fetchFornecedores();
      toast.success("Fornecedor atualizado com sucesso!");
      handleCloseModals();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar fornecedor";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFornecedores]);

  const deleteFornecedor = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await Fornecedor.service.delete(id);
      await fetchFornecedores();
      toast.success("Fornecedor excluído com sucesso!");
      handleCloseModals();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir fornecedor";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFornecedores]);

  // Operações específicas
  const fetchFornecedoresByStatus = useCallback(async (status: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFornecedores = await Fornecedor.service.findByStatus(status);
      setFornecedores(fetchedFornecedores);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar fornecedores por status";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFornecedoresByName = useCallback(async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFornecedores = await Fornecedor.service.searchByName(name);
      setFornecedores(fetchedFornecedores);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar fornecedores";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const activateFornecedor = useCallback(async (id: string) => {
    try {
      await Fornecedor.service.activateFornecedor(id, 'current-user-id'); // TODO: Obter do contexto
      await fetchFornecedores();
      toast.success("Fornecedor ativado com sucesso!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao ativar fornecedor";
      toast.error(errorMessage);
    }
  }, [fetchFornecedores]);

  const deactivateFornecedor = useCallback(async (id: string) => {
    try {
      await Fornecedor.service.deactivateFornecedor(id, 'current-user-id'); // TODO: Obter do contexto
      await fetchFornecedores();
      toast.success("Fornecedor desativado com sucesso!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao desativar fornecedor";
      toast.error(errorMessage);
    }
  }, [fetchFornecedores]);

  const getStatistics = useCallback(async () => {
    try {
      return await Fornecedor.service.getStatistics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao obter estatísticas";
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // Handlers de UI
  const handleFornecedorClick = useCallback((fornecedor: TFornecedorWithRelations) => {
    setSelectedFornecedor(fornecedor);
    setIsDetailsModalOpen(true);
  }, []);

  const handleAddClick = useCallback(() => {
    setSelectedFornecedor(null);
    setIsAddModalOpen(true);
  }, []);

  const handleEditClick = useCallback((fornecedor: TFornecedorWithRelations) => {
    setSelectedFornecedor(fornecedor);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((fornecedor: TFornecedorWithRelations) => {
    setSelectedFornecedor(fornecedor);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedFornecedor(null);
  }, []);

  // Dados computados
  const filteredFornecedores = useMemo(() => {
    let filtered = fornecedores;

    // Filtrar por status
    if (statusFilter !== "TODOS") {
      filtered = filtered.filter(fornecedor => fornecedor.status === statusFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(fornecedor => 
        fornecedor.nome?.toLowerCase().includes(term) ||
        fornecedor.razaoSocial?.toLowerCase().includes(term) ||
        fornecedor.cnpj?.includes(term) ||
        fornecedor.cpf?.includes(term) ||
        fornecedor.email?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [fornecedores, statusFilter, searchTerm]);

  const totalFornecedores = useMemo(() => filteredFornecedores.length, [filteredFornecedores]);

  const activeFornecedores = useMemo(() => {
    return filteredFornecedores.filter(f => f.status === 'ATIVO').length;
  }, [filteredFornecedores]);

  const inactiveFornecedores = useMemo(() => {
    return filteredFornecedores.filter(f => f.status === 'INATIVO').length;
  }, [filteredFornecedores]);

  // Effects
  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  // Return
  return {
    // Estados principais
    fornecedores: filteredFornecedores,
    loading,
    error,
    
    // Estados de UI
    searchTerm,
    statusFilter,
    selectedFornecedor,
    isAddModalOpen,
    isEditModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,
    
    // Operações CRUD
    fetchFornecedores,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
    
    // Operações específicas
    fetchFornecedoresByStatus,
    searchFornecedoresByName,
    activateFornecedor,
    deactivateFornecedor,
    getStatistics,
    
    // Handlers de UI
    setSearchTerm,
    setStatusFilter,
    handleFornecedorClick,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModals,
    
    // Dados computados
    filteredFornecedores,
    totalFornecedores,
    activeFornecedores,
    inactiveFornecedores
  };
};