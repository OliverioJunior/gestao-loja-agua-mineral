import { useState, useEffect, useMemo, useCallback } from "react";
import { IProductStats, IFiltrosProdutos } from "@/layout/produtos";
import { TProdutoWithCategoria } from "@/core/produto/produto.entity";

export const useProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<IFiltrosProdutos>({
    status: "todos",
  });
  const [products, setProducts] = useState<TProdutoWithCategoria[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<TProdutoWithCategoria | null>(null);
  const [editingProduct, setEditingProduct] =
    useState<TProdutoWithCategoria | null>(null);
  const [deletingProduct, setDeletingProduct] =
    useState<TProdutoWithCategoria | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize products with mock data
  useEffect(() => {
    fetch("/api/produto")
      .then(async (res) => await res.json())
      .then((data) => setProducts(data));
  }, []);

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Status filter
      if (filters.status !== "todos") {
        switch (filters.status) {
          case "ativo":
            if (!product.ativo) return false;
            break;
          case "inativo":
            if (product.ativo) return false;
            break;
          case "promocao":
            if (!product.promocao) return false;
            break;
          case "estoque_baixo":
            if (product.estoque > (product.estoqueMinimo || 0)) return false;
            break;
        }
      }

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = product.nome.toLowerCase().includes(searchLower);
        const matchesBrand = product.marca?.toLowerCase().includes(searchLower);

        if (!matchesName && !matchesBrand) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters, searchTerm]);

  // Memoized statistics calculation for better performance
  const stats = useMemo((): IProductStats => {
    const activeProducts = products.filter((p) => p.ativo);
    const inactiveProducts = products.filter((p) => !p.ativo);
    const promotionProducts = products.filter((p) => p.promocao);
    const lowStockProducts = products.filter(
      (p) => p.estoque <= (p.estoqueMinimo || 0)
    );

    return {
      total: products.length,
      ativo: activeProducts.length,
      inativo: inactiveProducts.length,
      promocao: promotionProducts.length,
      estoqueBaixo: lowStockProducts.length,
    };
  }, [products]);

  // Memoized event handlers for better performance
  const handleProductClick = useCallback((product: TProdutoWithCategoria) => {
    setSelectedProduct(product);
  }, []);

  const handleAddProduct = useCallback(
    (
      productData: Omit<TProdutoWithCategoria, "id" | "createdAt" | "updatedAt">
    ) => {
      const newProduct: TProdutoWithCategoria = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    },
    []
  );

  const handleEdit = useCallback((product: TProdutoWithCategoria) => {
    setEditingProduct(product);
    setSelectedProduct(null); // Fechar modal de visualização se estiver aberto
  }, []);

  const handleDelete = useCallback((product: TProdutoWithCategoria) => {
    setDeletingProduct(product);
  }, []);

  const handleConfirmDelete = useCallback(
    async (product: TProdutoWithCategoria) => {
      try {
        await fetch("/api/produto/delete", {
          method: "DELETE",
          body: JSON.stringify({ id: product.id }),
        });
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    },
    []
  );

  const handleCloseDeleteModal = useCallback(() => {
    setDeletingProduct(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleSaveEdit = useCallback(
    async (updatedProduct: TProdutoWithCategoria) => {
      try {
        await fetch("/api/produto/update", {
          method: "PUT",
          body: JSON.stringify(updatedProduct),
        });
        setProducts((prev) =>
          prev.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      } catch (error) {
        console.error(error);
      }
      setEditingProduct(null);
    },
    []
  );

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  return {
    // State
    searchTerm,
    filters,
    products,
    selectedProduct,
    editingProduct,
    deletingProduct,
    isAddModalOpen,
    filteredProducts,
    stats,

    // Setters
    setSearchTerm,
    setFilters,

    // Handlers
    handleProductClick,
    handleAddProduct,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleConfirmDelete,
    handleCloseModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
    handleCloseAddModal,
    handleOpenAddModal,
  };
};
