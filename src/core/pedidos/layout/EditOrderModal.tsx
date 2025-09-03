import { useState, useEffect } from "react";
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
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/shared/components/ui";
import {
  Plus,
  Minus,
  Trash2,
  User,
  Package,
  MapPin,
  CreditCard,
  Save,
} from "lucide-react";
import { EditOrderModalProps, IPedidoItem } from "./types";
import { formatCurrency } from "./order-utils";
import { useClientes } from "@/core/cliente/hooks/useClientes";
import { useProdutos } from "@/core/produto/hooks/useProdutos";
import { TPedidoWithRelations } from "@/core/pedidos/domain";
import { toast } from "sonner";
import { useLoading } from "@/shared/utils";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  INFO_MESSAGES,
  UI_LABELS,
} from "@/shared/constants/messages";

export function EditOrderModal({
  isOpen,
  onClose,
  onSave,
  order,
}: EditOrderModalProps) {
  // Hooks para buscar dados reais
  const { loading, withLoading } = useLoading();
  const { clients: clientes } = useClientes();
  const { produtos } = useProdutos();

  // Estado inicial do formulário
  const initialFormData = {
    clienteId: "",
    tipoEntrega: "balcao" as "balcao" | "entrega",
    formaPagamento: "",
    observacoes: "",
    enderecoEntrega: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    taxaEntrega: 0,
    desconto: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [itens, setItens] = useState<IPedidoItem[]>([]);
  const [selectedProduto, setSelectedProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const selectedCliente = clientes.find((c) => c.id === formData.clienteId);

  // Função auxiliar para atualizar campos do endereço
  const updateEnderecoField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      enderecoEntrega: {
        ...prev.enderecoEntrega,
        [field]: value,
      },
    }));
  };

  // Função de reset centralizada
  const resetForm = () => {
    setFormData(initialFormData);
    setItens([]);
    setSelectedProduto("");
    setQuantidade(1);
  };

  // Preencher formulário com dados do pedido quando modal abrir
  useEffect(() => {
    if (order && isOpen) {
      setFormData({
        clienteId: order.cliente?.id || "",
        tipoEntrega: order.endereco?.logradouro ? "entrega" : "balcao",
        formaPagamento: order.formaPagamento || "",
        observacoes: "",
        enderecoEntrega: {
          logradouro: order.endereco?.logradouro || "",
          numero: order.endereco?.numero || "",
          complemento: order.endereco?.complemento || "",
          bairro: order.endereco?.bairro || "",
          cidade: order.endereco?.cidade || "",
          estado: order.endereco?.estado || "",
          cep: order.endereco?.cep || "",
        },
        taxaEntrega: order.taxaEntrega || 0,
        desconto: order.desconto || 0,
      });

      // Converter itens do pedido para o formato do modal
      if (order.itens) {
        const itemsFormatted = order.itens.map((item) => ({
          id: item.id || `temp-${Date.now()}`,
          produtoId: item.produtoId,
          produtoNome: item.produto?.nome || "Produto não encontrado",
          produtoPreco: item.preco * item.quantidade || 0,
          quantidade: item.quantidade,
          precoUnitario: item.preco || 0,
          subtotal: item.preco * item.quantidade || 0,
          observacoes: "",
        }));
        setItens(itemsFormatted);
      }
    }
  }, [order, isOpen]);

  // Preencher endereço automaticamente quando cliente for selecionado
  useEffect(() => {
    if (selectedCliente?.endereco && formData.tipoEntrega === "entrega") {
      const { endereco } = selectedCliente;
      setFormData((prev) => ({
        ...prev,
        enderecoEntrega: {
          logradouro: endereco.logradouro || "",
          numero: endereco.numero || "",
          complemento: endereco.complemento || "",
          bairro: endereco.bairro || "",
          cidade: endereco.cidade || "",
          estado: endereco.estado || "",
          cep: endereco.cep || "",
        },
      }));
    }
  }, [selectedCliente, formData.tipoEntrega]);

  const handleAddItem = () => {
    const produto = produtos.find((p) => p.id === selectedProduto);
    if (!produto || quantidade <= 0) return;

    setItens((prevItens) => {
      const existingItemIndex = prevItens.findIndex(
        (item) => item.produtoId === produto.id
      );

      if (existingItemIndex >= 0) {
        // Atualizar quantidade do item existente
        return prevItens.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantidade: item.quantidade + quantidade,
                subtotal: item.precoUnitario * (item.quantidade + quantidade),
              }
            : item
        );
      } else {
        // Adicionar novo item
        const newItem: IPedidoItem = {
          id: `temp-${Date.now()}`,
          produtoId: produto.id,
          produtoNome: produto.nome,
          produtoPreco: produto.precoVenda,
          quantidade,
          precoUnitario: produto.precoVenda,
          subtotal: produto.precoVenda * quantidade,
        };
        return [...prevItens, newItem];
      }
    });

    setSelectedProduto("");
    setQuantidade(1);
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    setItens((prevItens) =>
      prevItens.map((item, i) =>
        i === index
          ? {
              ...item,
              quantidade: newQuantity,
              subtotal: item.precoUnitario * newQuantity,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (index: number) => {
    setItens((prevItens) => prevItens.filter((_, i) => i !== index));
  };

  const subtotal = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );
  const total = subtotal - formData.desconto + formData.taxaEntrega;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.clienteId ||
      !formData.formaPagamento ||
      itens.length === 0 ||
      !order
    ) {
      toast.error(
        `${ERROR_MESSAGES.REQUIRED_FIELD}. Adicione pelo menos um item ao pedido`
      );
      return;
    }

    const result = await withLoading(async () => {
      try {
        const updatedOrderData: Partial<TPedidoWithRelations> = {
          clienteId: formData.clienteId,
          formaPagamento: formData.formaPagamento as
            | "dinheiro"
            | "cartao_debito"
            | "cartao_credito"
            | "pix",
          taxaEntrega: formData.taxaEntrega,
          desconto: formData.desconto,
          total: total,
          itens: itens.map((item) => ({
            id: item.id,
            produtoId: item.produtoId,
            produto: {
              nome: item.produtoNome,
            },
            quantidade: item.quantidade,
            preco: item.precoUnitario,
          })),
        };

        await onSave(order.id, updatedOrderData);
        return { success: true };
      } catch (error) {
        console.error("Erro ao editar pedido:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : ERROR_MESSAGES.UPDATE_ERROR,
        };
      }
    });

    if (result.success) {
      toast.success(SUCCESS_MESSAGES.ORDER_UPDATED);
    } else {
      toast.error(`${ERROR_MESSAGES.UPDATE_ERROR}: ${result.error}`);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {UI_LABELS.EDIT} Pedido #{order.id.slice(-8)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cliente">Cliente *</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, clienteId: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={UI_LABELS.SELECT_OPTION} />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome} - {cliente.telefone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoEntrega">Tipo de Entrega *</Label>
                  <Select
                    value={formData.tipoEntrega}
                    onValueChange={(value: "balcao" | "entrega") =>
                      setFormData((prev) => ({ ...prev, tipoEntrega: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcao">Retirada no Balcão</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        formaPagamento: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={UI_LABELS.SELECT_OPTION} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao_debito">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="cartao_credito">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          {formData.tipoEntrega === "entrega" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {UI_LABELS.ADDRESS} de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro *</Label>
                    <Input
                      id="logradouro"
                      value={formData.enderecoEntrega.logradouro}
                      onChange={(e) =>
                        updateEnderecoField("logradouro", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número *</Label>
                    <Input
                      id="numero"
                      value={formData.enderecoEntrega.numero}
                      onChange={(e) =>
                        updateEnderecoField("numero", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.enderecoEntrega.complemento}
                      onChange={(e) =>
                        updateEnderecoField("complemento", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={formData.enderecoEntrega.bairro}
                      onChange={(e) =>
                        updateEnderecoField("bairro", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={formData.enderecoEntrega.cidade}
                      onChange={(e) =>
                        updateEnderecoField("cidade", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Input
                      id="estado"
                      value={formData.enderecoEntrega.estado}
                      onChange={(e) =>
                        updateEnderecoField("estado", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      value={formData.enderecoEntrega.cep}
                      onChange={(e) =>
                        updateEnderecoField("cep", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="taxaEntrega">Taxa de Entrega</Label>
                  <Input
                    id="taxaEntrega"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.taxaEntrega / 100}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        taxaEntrega: Math.round(
                          parseFloat(e.target.value || "0") * 100
                        ),
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar Item */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="md:col-span-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select
                    value={selectedProduto}
                    onValueChange={setSelectedProduto}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos
                        .filter((p) => p.ativo)
                        .map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome} -{" "}
                            {formatCurrency(produto.precoVenda)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) =>
                      setQuantidade(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduto}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de Itens */}
              {itens.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Itens Adicionados:</h4>
                  {itens.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.produtoNome}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.precoUnitario)} x{" "}
                          {item.quantidade}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(index, item.quantidade - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">
                          {item.quantidade}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(index, item.quantidade + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="w-20 text-right font-medium">
                          {formatCurrency(item.precoUnitario * item.quantidade)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observacoes: e.target.value,
                    }))
                  }
                  placeholder="Observações sobre o pedido..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="desconto">Desconto</Label>
                  <Input
                    id="desconto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.desconto / 100}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desconto: Math.round(
                          parseFloat(e.target.value || "0") * 100
                        ),
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
                {formData.tipoEntrega === "entrega" && (
                  <div>
                    <Label htmlFor="taxaEntregaDisplay">Taxa de Entrega</Label>
                    <Input
                      id="taxaEntregaDisplay"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.taxaEntrega / 100}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          taxaEntrega: Math.round(
                            parseFloat(e.target.value || "0") * 100
                          ),
                        }))
                      }
                      placeholder="0,00"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {formData.desconto > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>-{formatCurrency(formData.desconto)}</span>
                  </div>
                )}
                {formData.taxaEntrega > 0 && (
                  <div className="flex justify-between">
                    <span>Taxa de Entrega:</span>
                    <span>{formatCurrency(formData.taxaEntrega)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              {UI_LABELS.CANCEL}
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.clienteId ||
                !formData.formaPagamento ||
                itens.length === 0
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? INFO_MESSAGES.SAVING : UI_LABELS.SAVE + " Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
