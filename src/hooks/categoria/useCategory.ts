import { useEffect, useState } from "react";

import { ICategory } from "@/layout/categorias";

export const useCategory = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    fetch("/api/categoria")
      .then(async (res) => await res.json())
      .then((data) => {
        // Mapear os dados da API para a interface ICategory
        const mappedCategories = data.map((category: ICategory) => ({
          id: category.id,
          nome: category.nome,
          description: category.description,
          productsCount: category.productsCount,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt),
        }));
        setCategories(mappedCategories);
      });
  }, []);

  return {
    categories,
  };
};
