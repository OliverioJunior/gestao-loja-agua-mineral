import { TProduto } from "@/core/produto/produto.entity";
import { useCategory } from "@/hooks/categoria/useCategory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<TProduto, "id" | "createdAt" | "updatedAt">) => void;
}

export function AddProductModal({
  isOpen,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    marca: "",
    categoria: "",
    precoCusto: "",
    precoVenda: "",
    precoRevenda: "",
    precoPromocao: "",
    quantidade: "",
    estoqueMinimo: "",
    ativo: true,
    promocao: false,
  });
  const { categories } = useCategory();
  console.log({ categories, teste: "1" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: TProduto = {
      nome: formData.nome,
      descricao: formData.descricao || null,
      marca: formData.marca || null,
      categoriaId: null,
      atualizadoPorId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      criadoPorId: "1",
      id: "1",
      precoCusto: parseFloat(formData.precoCusto) * 100, // Converter para centavos
      precoVenda: parseFloat(formData.precoVenda) * 100,
      precoRevenda: formData.precoRevenda
        ? parseFloat(formData.precoRevenda) * 100
        : null,
      precoPromocao: formData.precoPromocao
        ? parseFloat(formData.precoPromocao) * 100
        : null,
      quantidade: parseInt(formData.quantidade),
      estoqueMinimo: parseInt(formData.estoqueMinimo),
      ativo: formData.ativo,
      promocao: formData.promocao,
    };

    onAdd(productData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nome: "",
      descricao: "",
      marca: "",
      categoria: "",
      precoCusto: "",
      precoVenda: "",
      precoRevenda: "",
      precoPromocao: "",
      quantidade: "",
      estoqueMinimo: "",
      ativo: true,
      promocao: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Plus className="h-5 w-5 text-primary" />
              Adicionar Novo Produto
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Água Mineral Crystal 500ml"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                placeholder="Ex: Crystal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descrição detalhada do produto"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) =>
                setFormData({ ...formData, categoria: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precoCusto">Preço de Custo (R$) *</Label>
              <Input
                id="precoCusto"
                type="number"
                step="0.01"
                value={formData.precoCusto}
                onChange={(e) =>
                  setFormData({ ...formData, precoCusto: e.target.value })
                }
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
              <Input
                id="precoVenda"
                type="number"
                step="0.01"
                value={formData.precoVenda}
                onChange={(e) =>
                  setFormData({ ...formData, precoVenda: e.target.value })
                }
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoRevenda">Preço Revenda (R$)</Label>
              <Input
                id="precoRevenda"
                type="number"
                step="0.01"
                value={formData.precoRevenda}
                onChange={(e) =>
                  setFormData({ ...formData, precoRevenda: e.target.value })
                }
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoPromocao">Preço Promoção (R$)</Label>
              <Input
                id="precoPromocao"
                type="number"
                step="0.01"
                value={formData.precoPromocao}
                onChange={(e) =>
                  setFormData({ ...formData, precoPromocao: e.target.value })
                }
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade em Estoque *</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({ ...formData, quantidade: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) =>
                  setFormData({ ...formData, estoqueMinimo: e.target.value })
                }
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="ativo">Produto Ativo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="promocao"
                  checked={formData.promocao}
                  onChange={(e) =>
                    setFormData({ ...formData, promocao: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="promocao">Em Promoção</Label>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
