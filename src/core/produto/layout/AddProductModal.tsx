import { CreateProdutoInput } from "@/core/produto/domain/produto.entity";
import { useCategory } from "@/core/categoria/hooks/useCategory";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  formatCurrencyFromCents,
  convertFormattedToCents,
  useLoading,
} from "@/shared/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  const { loading, withLoading } = useLoading();
  const { categories } = useCategory();

  // Estado inicial do formulário
  const initialFormData = {
    nome: "",
    descricao: "",
    marca: "",
    categoriaId: "",
    precoCusto: "",
    precoVenda: "",
    precoRevenda: "",
    precoPromocao: "",
    estoque: 0,
    estoqueMinimo: 0,
    ativo: true,
    promocao: false,
    atualizadoPorId: "",
    criadoPorId: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.nome.trim()) {
      toast.error("Nome do produto é obrigatório", {
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    if (!formData.precoCusto || !formData.precoVenda) {
      toast.error("Preço de custo e preço de venda são obrigatórios", {
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    await withLoading(async () => {
      // Converte os valores formatados para centavos
      const submitData = {
        ...formData,
        precoCusto: convertFormattedToCents(formData.precoCusto.toString()),
        precoVenda: convertFormattedToCents(formData.precoVenda.toString()),
        precoRevenda: convertFormattedToCents(formData.precoRevenda.toString()),
        precoPromocao: convertFormattedToCents(
          formData.precoPromocao.toString()
        ),
      };

      await onAdd(submitData);
      handleClose();
    });
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Handlers para formatação de preços
  const handlePriceChange = (field: string, value: string) => {
    // Remove todos os caracteres não numéricos
    const numericOnly = value.replace(/\D/g, "");

    // Formata como moeda (cada dígito é um centavo)
    const formattedValue = formatCurrencyFromCents(numericOnly);

    setFormData({ ...formData, [field]: formattedValue });
  };

  const handleClose = () => {
    resetForm();
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
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo produto.
            </DialogDescription>
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
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {loading ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
