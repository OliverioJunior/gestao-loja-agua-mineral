import { useState, useEffect, useMemo, useCallback } from "react";
import { IProductStats, IFiltrosProdutos } from "@/layout/produtos";
import { MOCK_PRODUCTS } from "../constants";
import { TProduto } from "@/core/produto/produto.entity";

export const useProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<IFiltrosProdutos>({
    status: "todos",
  });
  const [products, setProducts] = useState<TProduto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TProduto | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize products with mock data
  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
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
            if (product.quantidade > (product.estoqueMinimo || 0)) return false;
            break;
        }
      }

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = product.nome.toLowerCase().includes(searchLower);
        const matchesBrand = product.marca?.toLowerCase().includes(searchLower);
        const matchesCategory = product.categoria
          ?.toLowerCase()
          .includes(searchLower);

        if (!matchesName && !matchesBrand && !matchesCategory) {
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
      (p) => p.quantidade <= (p.estoqueMinimo || 0)
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
  const handleProductClick = useCallback((product: TProduto) => {
    setSelectedProduct(product);
  }, []);

  const handleAddProduct = useCallback(
    (productData: Omit<TProduto, "id" | "createdAt" | "updatedAt">) => {
      const newProduct: TProduto = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    },
    []
  );

  const handleEdit = useCallback((product: TProduto) => {
    // TODO: Implement edit functionality
    console.log("Editar produto:", product);
  }, []);

  const handleDelete = useCallback((product: TProduto) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    console.log("Produto excluído:", product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

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
    handleDelete,
    handleCloseModal,
    handleCloseAddModal,
    handleOpenAddModal,
  };
};
