"use client";

import { Card, CardContent } from "@/shared/components/ui";
import {
  ProductFilters,
  ProductDetailsModal,
  ProductStatsCards,
  ProductTable,
  AddProductModal,
} from "@/layout/produtos";
import { useProducts } from "./hooks/useProducts";

export default function ProdutosPage() {
  const {
    searchTerm,
    filters,
    selectedProduct,
    isAddModalOpen,
    filteredProducts,
    stats,
    setSearchTerm,
    setFilters,
    handleProductClick,
    handleAddProduct,
    handleEdit,
    handleDelete,
    handleCloseModal,
    handleCloseAddModal,
    handleOpenAddModal,
  } = useProducts();

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <ProductStatsCards stats={stats} />

          <Card className="bg-card/60 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <ProductFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFiltersChange={setFilters}
                onAddProduct={handleOpenAddModal}
              />

              <ProductTable
                products={filteredProducts}
                onView={handleProductClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>

          <ProductDetailsModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={handleCloseModal}
            onEdit={handleEdit}
          />

          <AddProductModal
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            onAdd={handleAddProduct}
          />
        </div>
      </div>
    </main>
  );
}
