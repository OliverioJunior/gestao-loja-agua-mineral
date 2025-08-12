"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "@/shared/components/ui";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { ICategory } from "./types";

interface EditCategoryModalProps {
  category: ICategory | null;
  isOpen: boolean;
  onClose: () => void;
  onEditCategory?: (category: ICategory) => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onEditCategory,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        nome: category.nome || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!category) return;

    try {
      const updatedData = {
        id: category.id,
        nome: formData.nome.trim(),
        description: formData.description.trim(),
      };

      const response = await fetch("/api/categoria/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        const categoryToUpdate: ICategory = {
          ...category,
          nome: updatedCategory.nome,
          description: updatedCategory.description,
          updatedAt: new Date(updatedCategory.updatedAt),
        };
        onEditCategory?.(categoryToUpdate);
        onClose();
      } else {
        console.error("Erro ao atualizar categoria");
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    }
  };

  const handleCancel = () => {
    if (category) {
      setFormData({
        nome: category.nome || "",
        description: category.description || "",
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Categoria
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Atualize os dados da categoria.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Nome da categoria *
            </label>
            <Input
              placeholder="Digite o nome da categoria"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-200 mb-2 block">
              Descrição
            </label>
            <Textarea
              placeholder="Digite uma descrição para a categoria"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-slate-800 border-slate-700 text-slate-200 min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.nome.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
