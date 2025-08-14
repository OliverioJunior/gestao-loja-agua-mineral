import { CreateProdutoInput } from "@/core/produto/produto.entity";
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

// Função para formatar valor monetário brasileiro
const formatCurrency = (value: string): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, "");

  if (!numericValue) return "";

  // Converte para número e divide por 100 para ter centavos
  const numberValue = parseInt(numericValue) / 100;

  // Formata para o padrão brasileiro
  return numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: CreateProdutoInput) => Promise<void>;
}

export function AddProductModal({
  isOpen,
  onClose,
  onAdd,
}: AddProductModalProps) {
  const [formData, setFormData] = useState<CreateProdutoInput>({
    nome: "",
    descricao: "",
    marca: "",
    categoriaId: "",
    precoCusto: 0,
    precoVenda: 0,
    precoRevenda: 0,
    precoPromocao: 0,
    estoque: 0,
    estoqueMinimo: 0,
    ativo: true,
    promocao: false,
    atualizadoPorId: "",
    criadoPorId: "",
  });
  const { categories } = useCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
      alert("Erro ao criar produto. Verifique os dados e tente novamente.");
    }
  };

  // Handlers para formatação de preços
  const handlePriceChange = (field: string, value: string) => {
    const formattedValue = formatCurrency(value);
    setFormData({ ...formData, [field]: formattedValue });
  };

  const handleClose = () => {
    setFormData({
      nome: "",
      descricao: "",
      marca: "",
      categoriaId: "",
      precoCusto: 0,
      precoVenda: 0,
      precoRevenda: 0,
      precoPromocao: 0,
      estoque: 0,
      estoqueMinimo: 0,
      ativo: true,
      promocao: false,
      atualizadoPorId: "",
      criadoPorId: "",
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
                value={formData.marca || ""}
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
              value={formData.descricao || ""}
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
              value={formData.categoriaId || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, categoriaId: value })
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
                type="text"
                value={formData.precoCusto}
                onChange={(e) =>
                  handlePriceChange("precoCusto", e.target.value)
                }
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoVenda">Preço de Venda (R$) *</Label>
              <Input
                id="precoVenda"
                type="text"
                value={formData.precoVenda}
                onChange={(e) =>
                  handlePriceChange("precoVenda", e.target.value)
                }
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoRevenda">Preço Revenda (R$)</Label>
              <Input
                id="precoRevenda"
                type="text"
                value={formData.precoRevenda?.toString() || ""}
                onChange={(e) =>
                  handlePriceChange("precoRevenda", e.target.value)
                }
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoPromocao">Preço Promoção (R$)</Label>
              <Input
                id="precoPromocao"
                type="text"
                value={formData.precoPromocao?.toString() || ""}
                onChange={(e) =>
                  handlePriceChange("precoPromocao", e.target.value)
                }
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoque">Quantidade em Estoque *</Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) =>
                  setFormData({ ...formData, estoque: Number(e.target.value) })
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
                value={formData.estoqueMinimo || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estoqueMinimo: Number(e.target.value),
                  })
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
