"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui";
import {
  CategoryFilters,
  CategoryDetailsModal,
  CategoryStatsCards,
  CategoryTable,
  EditCategoryModal,
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
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categoria")
      .then(async (res) => await res.json())
      .then((data) => {
        // Mapear os dados da API para a interface ICategory
        const mappedCategories = data.map((category: ICategory) => ({
          id: category.id,
          name: category.name, // Mapear 'nome' do banco para 'name' da interface
          description: category.description,
          productsCount: category.productsCount,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt),
        }));
        setCategories(mappedCategories);
      });
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
    setEditingCategory(category);
    setIsEditModalOpen(true);
    setSelectedCategory(null);
  };

  const handleDelete = async (category: ICategory) => {
    try {
      const response = await fetch("/api/categoria/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: category.id }),
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== category.id));
        console.log("Categoria excluída:", category);
      } else {
        console.error("Erro ao excluir categoria");
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const handleAddCategory = async (categoryData: {
    nome: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/categoria/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const newCategoryData = await response.json();
        const newCategory: ICategory = {
          id: newCategoryData.id,
          name: newCategoryData.nome,
          description: newCategoryData.description,
          productsCount: newCategoryData.productsCount,
          createdAt: new Date(newCategoryData.createdAt),
          updatedAt: new Date(newCategoryData.updatedAt),
        };

        setCategories([...categories, newCategory]);
        console.log("Nova categoria adicionada:", newCategory);
      } else {
        console.error("Erro ao adicionar categoria");
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
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

        <EditCategoryModal
          category={editingCategory}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCategory(null);
          }}
          onEditCategory={(updatedCategory) => {
            setCategories(
              categories.map((c) =>
                c.id === updatedCategory.id ? updatedCategory : c
              )
            );
          }}
        />
      </div>
    </main>
  );
}
