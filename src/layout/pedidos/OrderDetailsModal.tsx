import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
} from "@/shared/components/ui";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  Truck,
  FileText,
} from "lucide-react";
import { OrderDetailsModalProps } from "./types";
import {
  getStatusColor,
  getStatusText,
  getDeliveryTypeText,
  getPaymentMethodText,
  formatCurrency,
  formatDate,
  formatPhone,
} from "./order-utils";

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalhes do Pedido {order.numero}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status e Data */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Status do Pedido
                </h3>
                <Badge className={`text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Data do Pedido:</span>
                <span className="font-medium">
                  {formatDate(order.dataPedido)}
                </span>
              </div>

              {order.dataEntrega && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Data de Entrega:
                  </span>
                  <span className="font-medium">
                    {formatDate(order.dataEntrega)}
                  </span>
                </div>
              )}
            </div>

            {/* Tipo e Pagamento */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Tipo de Entrega
                </h3>
                <Badge
                  variant="outline"
                  className={`text-sm ${
                    order.tipoEntrega === "entrega"
                      ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                      : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                  }`}
                >
                  {getDeliveryTypeText(order.tipoEntrega)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Forma de Pagamento:
                </span>
                <span className="font-medium">
                  {getPaymentMethodText(order.formaPagamento)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do Cliente */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{order.cliente.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{order.cliente.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {formatPhone(order.cliente.telefone)}
                </p>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          {order.tipoEntrega === "entrega" && order.enderecoEntrega && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Logradouro</p>
                    <p className="font-medium">
                      {order.enderecoEntrega.logradouro},{" "}
                      {order.enderecoEntrega.numero}
                    </p>
                  </div>
                  {order.enderecoEntrega.complemento && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Complemento
                      </p>
                      <p className="font-medium">
                        {order.enderecoEntrega.complemento}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Bairro</p>
                    <p className="font-medium">
                      {order.enderecoEntrega.bairro}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cidade/UF</p>
                    <p className="font-medium">
                      {order.enderecoEntrega.cidade} -{" "}
                      {order.enderecoEntrega.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CEP</p>
                    <p className="font-medium">{order.enderecoEntrega.cep}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Itens do Pedido */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Itens do Pedido
            </h3>
            <div className="space-y-3">
              {order.itens.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.precoUnitario)} x {item.quantidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(item.precoUnitario * item.quantidade)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumo Financeiro */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(
                    order.itens.reduce(
                      (acc, item) => acc + item.precoUnitario * item.quantidade,
                      0
                    )
                  )}
                </span>
              </div>
              {order.desconto > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(order.desconto)}
                  </span>
                </div>
              )}
              {order.taxaEntrega > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Taxa de Entrega:
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.taxaEntrega)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Observações */}
          {order.observacoes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações
                </h3>
                <p className="text-sm bg-muted/30 p-3 rounded-lg">
                  {order.observacoes}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
