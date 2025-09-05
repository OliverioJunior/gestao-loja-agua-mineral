import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  ShoppingCart,
  Building,
  FileText,
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { CompraDetailsModalProps } from "./types";
import { CompraUtils } from "./compra-utils";

export function CompraDetailsModal({
  isOpen,
  onClose,
  compra,
}: CompraDetailsModalProps) {
  if (!compra) return null;

  const statusColors = CompraUtils.getStatusColor(compra.status);
  const financial = CompraUtils.getFinancialInfo(compra);
  const itens = CompraUtils.getItensStatistics(compra);
  const isVencida = CompraUtils.isVencida(compra);
  const diasVencimento = CompraUtils.getDiasAteVencimento(compra);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Detalhes da Compra</span>
          </DialogTitle>
          <DialogDescription>
            Visualize os detalhes da compra, incluindo itens, fornecedor, status
            e datas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {CompraUtils.formatNumeroNota(compra.numeroNota)}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                >
                  {CompraUtils.getStatusText(compra.status)}
                </Badge>
                {isVencida && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Vencida
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Fornecedor */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Fornecedor</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              {compra.fornecedor ? (
                <div className="space-y-2">
                  <p className="font-medium">{compra.fornecedor.nome}</p>
                  {compra.fornecedor.razaoSocial &&
                    compra.fornecedor.razaoSocial !==
                      compra.fornecedor.nome && (
                      <p className="text-sm text-muted-foreground">
                        Razão Social: {compra.fornecedor.razaoSocial}
                      </p>
                    )}
                  {compra.fornecedor.cnpj && (
                    <p className="text-sm text-muted-foreground">
                      CNPJ: {compra.fornecedor.cnpj}
                    </p>
                  )}
                  {compra.fornecedor.cpf && (
                    <p className="text-sm text-muted-foreground">
                      CPF: {compra.fornecedor.cpf}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Fornecedor não informado
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Datas */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Datas</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data da Compra
                  </p>
                  <p className="font-medium">
                    {CompraUtils.formatDate(compra.dataCompra)}
                  </p>
                </div>
                {compra.dataVencimento && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data de Vencimento
                    </p>
                    <div className="flex items-center space-x-2">
                      <p
                        className={`font-medium ${
                          isVencida
                            ? "text-red-600"
                            : diasVencimento !== null && diasVencimento <= 7
                            ? "text-yellow-600"
                            : ""
                        }`}
                      >
                        {CompraUtils.formatDate(compra.dataVencimento)}
                      </p>
                      {diasVencimento !== null && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            isVencida
                              ? "bg-red-100 text-red-700"
                              : diasVencimento <= 7
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {diasVencimento > 0
                            ? `${diasVencimento} dias`
                            : "Vencida"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Financeiras */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Informações Financeiras</h3>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      {CompraUtils.formatCurrency(financial.subtotal)}
                    </span>
                  </div>

                  {financial.desconto > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="font-medium text-green-600">
                        -{CompraUtils.formatCurrency(financial.desconto)}
                        {financial.descontoPercentual > 0 && (
                          <span className="text-xs ml-1">
                            ({financial.descontoPercentual.toFixed(1)}%)
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {financial.frete > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete:</span>
                      <span className="font-medium">
                        {CompraUtils.formatCurrency(financial.frete)}
                      </span>
                    </div>
                  )}

                  {financial.impostos > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impostos:</span>
                      <span className="font-medium">
                        {CompraUtils.formatCurrency(financial.impostos)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-primary">
                      {CompraUtils.formatCurrency(financial.total)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Forma de Pagamento:
                    </span>
                    <span className="font-medium">
                      {CompraUtils.getFormaPagamentoText(compra.formaPagamento)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Itens da Compra */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Itens da Compra</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Total de Itens</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {itens.totalItens.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-xl">📦</span>
                  <div>
                    <p className="text-sm text-green-700">Quantidade Total</p>
                    <p className="text-2xl font-bold text-green-800">
                      {itens.quantidadeTotal.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Itens */}
          {compra.itens && compra.itens.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Detalhes dos Itens</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {compra.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.produto?.nome || "Produto não informado"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qtd: {item.quantidade} ×{" "}
                          {CompraUtils.formatCurrency(item.precoUnitario)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {CompraUtils.formatCurrency(item.precoTotal)}
                        </p>
                        {(item.desconto || 0) > 0 && (
                          <p className="text-xs text-green-600">
                            -{CompraUtils.formatCurrency(item.desconto || 0)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Observações */}
          {compra.observacoes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Observações</h3>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{compra.observacoes}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Informações do Sistema */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Informações do Sistema</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Criado em:</p>
                <p className="font-medium">
                  {CompraUtils.formatDateTime(compra.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Última atualização:</p>
                <p className="font-medium">
                  {CompraUtils.formatDateTime(compra.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
