"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Textarea,
} from "@/shared/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddCategoryModalProps {
  onAddCategory?: (category: { nome: string; description: string }) => void;
}

export function AddCategoryModal({ onAddCategory }: AddCategoryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      formData.nome = formData.nome.trim();
      formData.description = formData.description.trim();

      const response = await fetch("/api/categoria/create", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        onAddCategory?.(formData);
        setFormData({
          nome: "",
          description: "",
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: "",
      description: "",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-200 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Nova Categoria
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Preencha os dados da nova categoria de produtos.
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
            Criar Categoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
