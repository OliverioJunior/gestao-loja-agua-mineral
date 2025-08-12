"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui";
import {
  CategoryFilters,
  CategoryDetailsModal,
  CategoryStatsCards,
  CategoryTable,
  ICategory,
  ICategoryStats,
} from "@/layout/categorias";

export default function CategoriasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  useEffect(() => {
    fetch("/api/categoria")
      .then(async (res) => await res.json())
      .then((data) => setCategories(data));
  }, []);

  const filteredCategories = categories.filter((category) => {
    if (filterStatus !== "todos") {
      return false;
    }

    if (
      searchTerm &&
      !category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !category.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleView = (category: ICategory) => {
    setSelectedCategory(category);
  };

  const handleEdit = (category: ICategory) => {
    console.log("Editar categoria:", category);
  };

  const handleDelete = (category: ICategory) => {
    setCategories(categories.filter((c) => c.id !== category.id));
    console.log("Categoria excluída:", category);
  };

  const handleAddCategory = (categoryData: {
    nome: string;
    description: string;
  }) => {
    const newCategory: ICategory = {
      id: Date.now().toString(), // Simulando um ID único
      name: categoryData.nome,
      description: categoryData.description,
      productsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCategories([...categories, newCategory]);
    console.log("Nova categoria adicionada:", newCategory);
  };

  const getStatusStats = (): ICategoryStats => ({
    total: categories.length,
    withProducts: categories.filter((c) => c.productsCount > 0).length,
  });

  const stats = getStatusStats();

  return (
    <main className="min-h-[calc(100dvh-93px)] p-6">
      <div className="max-w-7xl mx-auto">
        <CategoryStatsCards stats={stats} />

        <Card className="bg-card/60 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <CategoryFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setFilterStatus={setFilterStatus}
                onAddCategory={handleAddCategory}
              />
            </div>

            <CategoryTable
              categories={filteredCategories}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <CategoryDetailsModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
