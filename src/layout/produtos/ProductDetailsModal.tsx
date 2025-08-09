import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/shared/components/ui";
import {
  X,
  Edit,
  Package,
  Tag,
  Calendar,
  DollarSign,
  Badge,
} from "lucide-react";
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
import { TProduto } from "@/core/produto/produto.entity";

interface ProductDetailsModalProps {
  product: TProduto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: TProduto) => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onEdit,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const stockStatus = getStockStatus(
    product.quantidade,
    product.estoqueMinimo || 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Package className="h-5 w-5 text-primary" />
              Detalhes do Produto
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nome do Produto
                </label>
                <p className="text-lg font-semibold text-foreground">
                  {product.nome}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Marca
                </label>
                <p className="text-foreground">
                  {product.marca || "Não informado"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Categoria
                </label>
                <div className="mt-1">
                  <Badge
                    className={`${getCategoryColor(product.categoria)} border`}
                  >
                    {getCategoryText(product.categoria)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1 flex gap-2">
                  <Badge className={`${getStatusColor(product.ativo)} border`}>
                    {getStatusText(product.ativo)}
                  </Badge>
                  {product.promocao && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      <Tag className="h-3 w-3 mr-1" />
                      Promoção
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Estoque
                </label>
                <div className="mt-1">
                  <p className="text-lg font-semibold text-foreground">
                    {product.quantidade} unidades
                  </p>
                  <Badge className={`${stockStatus.color} border text-xs mt-1`}>
                    {stockStatus.text}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo: {product.estoqueMinimo} unidades
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {product.descricao && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Descrição
              </label>
              <p className="text-foreground mt-1">{product.descricao}</p>
            </div>
          )}

          {/* Preços */}
          <div>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Informações de Preço
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Preço de Custo</p>
                <p className="font-semibold text-foreground">
                  {formatPrice(product.precoCusto)}
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Preço de Venda</p>
                <p className="font-semibold text-green-600">
                  {formatPrice(product.precoVenda)}
                </p>
              </div>
              {product.precoRevenda && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Preço Revenda</p>
                  <p className="font-semibold text-blue-600">
                    {formatPrice(product.precoRevenda)}
                  </p>
                </div>
              )}
              {product.precoPromocao && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Preço Promoção
                  </p>
                  <p className="font-semibold text-purple-600">
                    {formatPrice(product.precoPromocao)}
                  </p>
                </div>
              )}
            </div>
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
              onClick={() => onEdit(product)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
