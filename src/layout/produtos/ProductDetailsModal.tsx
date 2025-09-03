import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui";
import { Edit, Package, Tag, Calendar, DollarSign, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  getCategoryColor,
  getCategoryText,
  getStatusColor,
  getStatusText,
  formatPrice,
  getStockStatus,
} from "./product-utils";
import { TProdutoWithCategoria } from "@/core/produto/produto.entity";

import { useState, useEffect } from "react";
import { useCategory } from "@/core/categoria/hooks/useCategory";

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

// Função para converter valor formatado de volta para número
const parseCurrency = (formattedValue: string): number => {
  const numericValue = formattedValue.replace(/\D/g, "");
  return parseInt(numericValue || "0") / 100;
};

interface ProductDetailsModalProps {
  product: TProdutoWithCategoria | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: TProdutoWithCategoria) => void;
  openInEditMode?: boolean;
}

interface FormDataType
  extends Omit<
    TProdutoWithCategoria,
    "precoCusto" | "precoVenda" | "precoRevenda" | "precoPromocao"
  > {
  precoCusto: string;
  precoVenda: string;
  precoRevenda: string;
  precoPromocao: string;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onEdit,
  openInEditMode = false,
}: ProductDetailsModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<FormDataType | null>(null);
  const { categories } = useCategory();

  // Atualizar formData quando product mudar
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        precoCusto: formatCurrency(product.precoCusto.toString()),
        precoVenda: formatCurrency(product.precoVenda.toString()),
        precoRevenda: product.precoRevenda
          ? formatCurrency(product.precoRevenda.toString())
          : "",
        precoPromocao: product.precoPromocao
          ? formatCurrency(product.precoPromocao.toString())
          : "",
      });
      setEditMode(openInEditMode); // Set edit mode based on prop
    }
  }, [product, openInEditMode]);

  // Handler para formatação de preços
  const handlePriceChange = (field: string, value: string) => {
    if (!formData) return;
    const formattedValue = formatCurrency(value);
    setFormData({ ...formData, [field]: formattedValue });
  };

  if (!product || !formData) return null;

  const stockStatus = getStockStatus(
    product.estoque,
    product.estoqueMinimo || 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Package className="h-5 w-5 text-primary" />
              {editMode ? "Editar Produto" : "Detalhes do Produto"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome do Produto
                </label>
                <p className="text-lg font-semibold text-foreground">
                  {editMode ? (
                    <Input
                      type="text"
                      value={formData.nome}
                      className="w-full p-2 border border-input bg-background"
                      onChange={(e) =>
                        formData &&
                        setFormData({ ...formData, nome: e.target.value })
                      }
                    />
                  ) : (
                    product.nome
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Marca
                </label>
                {editMode ? (
                  <Input
                    type="text"
                    value={formData.marca || ""}
                    className="w-full p-2 border border-input bg-background mt-1"
                    onChange={(e) =>
                      formData &&
                      setFormData({ ...formData, marca: e.target.value })
                    }
                    placeholder="Ex: Crystal"
                  />
                ) : (
                  <p className="text-foreground">
                    {product.marca || "Não informado"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Categoria
                </label>
                {editMode ? (
                  <div className="mt-1">
                    <Select
                      value={formData.categoriaId || ""}
                      onValueChange={(value) =>
                        formData &&
                        setFormData({ ...formData, categoriaId: value })
                      }
                    >
                      <SelectTrigger className="w-full">
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
                ) : (
                  <div className="mt-1">
                    <Badge
                      className={`${getCategoryColor(
                        product.categoriaId || ""
                      )} border`}
                    >
                      {getCategoryText(product.categoria!.nome)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                {editMode ? (
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="ativo"
                        checked={formData.ativo}
                        onChange={(e) =>
                          formData &&
                          setFormData({ ...formData, ativo: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="ativo"
                        className="text-sm text-foreground"
                      >
                        Produto Ativo
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="promocao"
                        checked={formData.promocao}
                        onChange={(e) =>
                          formData &&
                          setFormData({
                            ...formData,
                            promocao: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="promocao"
                        className="text-sm text-foreground"
                      >
                        Em Promoção
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex gap-2">
                    <Badge
                      className={`${getStatusColor(product.ativo)} border`}
                    >
                      {getStatusText(product.ativo)}
                    </Badge>
                    {product.promocao && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        <Tag className="h-3 w-3 mr-1" />
                        Promoção
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Estoque
                </label>
                {editMode ? (
                  <div className="mt-1 space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Quantidade Atual *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.estoque}
                        className="w-full"
                        onChange={(e) =>
                          formData &&
                          setFormData({
                            ...formData,
                            estoque: parseInt(e.target.value || "0"),
                          })
                        }
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Estoque Mínimo *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.estoqueMinimo || 0}
                        className="w-full"
                        onChange={(e) =>
                          formData &&
                          setFormData({
                            ...formData,
                            estoqueMinimo: parseInt(e.target.value || "0"),
                          })
                        }
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-lg font-semibold text-foreground">
                      {product.estoque} unidades
                    </p>
                    <Badge
                      className={`${stockStatus.color} border text-xs mt-1`}
                    >
                      {stockStatus.text}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo: {product.estoqueMinimo} unidades
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Descrição
            </label>
            {editMode ? (
              <textarea
                value={formData.descricao || ""}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                onChange={(e) =>
                  formData &&
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            ) : (
              <p className="text-foreground mt-1">
                {product.descricao || "Não informado"}
              </p>
            )}
          </div>

          {/* Preços */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Informações de Preço
            </label>
            {editMode ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Preço de Custo (R$) *
                  </label>
                  <Input
                    type="text"
                    value={formData.precoCusto}
                    className="w-full"
                    onChange={(e) =>
                      handlePriceChange("precoCusto", e.target.value)
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Preço de Venda (R$) *
                  </label>
                  <Input
                    type="text"
                    value={formData.precoVenda}
                    className="w-full"
                    onChange={(e) =>
                      handlePriceChange("precoVenda", e.target.value)
                    }
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Preço Revenda (R$)
                  </label>
                  <Input
                    type="text"
                    value={formData.precoRevenda}
                    className="w-full"
                    onChange={(e) =>
                      handlePriceChange("precoRevenda", e.target.value)
                    }
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Preço Promoção (R$)
                  </label>
                  <Input
                    type="text"
                    value={formData.precoPromocao}
                    className="w-full"
                    onChange={(e) =>
                      handlePriceChange("precoPromocao", e.target.value)
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Preço de Custo
                  </p>
                  <p className="font-semibold text-foreground">
                    {formatPrice(product.precoCusto)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Preço de Venda
                  </p>
                  <p className="font-semibold text-green-600">
                    {formatPrice(product.precoVenda)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Preço Revenda</p>
                  <p className="font-semibold text-blue-600">
                    {product.precoRevenda
                      ? formatPrice(product.precoRevenda)
                      : "Não definido"}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Preço Promoção
                  </p>
                  <p className="font-semibold text-purple-600">
                    {product.precoPromocao
                      ? formatPrice(product.precoPromocao)
                      : "Não definido"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Data de Criação
              </label>
              <p className="text-foreground">
                {format(
                  product.createdAt,
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  {
                    locale: ptBR,
                  }
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Última Atualização
              </label>
              <p className="text-foreground">
                {format(
                  product.updatedAt,
                  "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                  {
                    locale: ptBR,
                  }
                )}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (editMode) {
                  // Cancelar edição - resetar dados e sair do modo edição
                  setFormData({
                    ...product,
                    precoCusto: formatCurrency(product.precoCusto.toString()),
                    precoVenda: formatCurrency(product.precoVenda.toString()),
                    precoRevenda: product.precoRevenda
                      ? formatCurrency(product.precoRevenda.toString())
                      : "",
                    precoPromocao: product.precoPromocao
                      ? formatCurrency(product.precoPromocao.toString())
                      : "",
                  });
                  setEditMode(false);
                } else {
                  // Chamar onEdit para abrir o modal de edição dedicado
                  onEdit(product);
                }
              }}
              className="flex items-center gap-2"
              variant={editMode ? "destructive" : "default"}
            >
              {editMode ? (
                "Cancelar"
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Editar
                </>
              )}
            </Button>
            {editMode && (
              <Button
                type="button"
                onClick={() => {
                  if (!formData) return;
                  // Converter valores formatados de volta para centavos
                  const dataToSave = {
                    ...formData,
                    precoCusto: Math.round(
                      parseCurrency(formData.precoCusto) * 100
                    ),
                    precoVenda: Math.round(
                      parseCurrency(formData.precoVenda) * 100
                    ),
                    precoRevenda: formData.precoRevenda
                      ? Math.round(parseCurrency(formData.precoRevenda) * 100)
                      : null,
                    precoPromocao: formData.precoPromocao
                      ? Math.round(parseCurrency(formData.precoPromocao) * 100)
                      : null,
                  };
                  onEdit(dataToSave);
                  setEditMode(false);
                }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Salvar
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
