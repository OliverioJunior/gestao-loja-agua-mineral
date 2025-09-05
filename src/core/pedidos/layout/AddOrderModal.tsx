import { useState, useEffect } from "react";
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
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Checkbox,
} from "@/shared/components/ui";
import {
  Plus,
  Minus,
  Trash2,
  User,
  Package,
  MapPin,
  CreditCard,
} from "lucide-react";
import { AddOrderModalProps, IPedidoItem } from "./types";
import { formatCurrency } from "./order-utils";
import { useClientes } from "@/core/cliente/hooks/useClientes";
import { IProdutoEstoque, useProdutos } from "@/core/produto/hooks/useProdutos";
import { toast } from "sonner";
import {
  useLoading,
  formatCurrencyFromCents,
  convertFormattedToCents,
} from "@/shared/utils";
import { CreatePedidoInput } from "../domain";

export function AddOrderModal({ isOpen, onClose, onAdd }: AddOrderModalProps) {
  const { loading, withLoading } = useLoading();
  const { clients: clientes } = useClientes();
  const { produtos } = useProdutos();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [revenda, setRevenda] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [descontoFormatado, setDescontoFormatado] = useState("");
  const [taxaEntregaFormatada, setTaxaEntregaFormatada] = useState("");

  const selectedCliente = clientes.find((c) => c.id === formData.clienteId);

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

  // Função auxiliar para calcular preço baseado no tipo de venda
  const getPreco = (produto: IProdutoEstoque) => {
    return revenda ? produto.precoRevenda || 0 : produto.precoVenda || 0;
  };

  const handleAddItem = () => {
    const produto = produtos.find((p) => p.id === selectedProduto);
    if (!produto || quantidade <= 0) return;

    const precoUnitario = getPreco(produto);
    const newItem: IPedidoItem = {
      id: produto.id,
      produtoId: produto.id,
      produtoNome: produto.nome,
      produtoPreco: precoUnitario,
      quantidade,
      precoUnitario,
      subtotal: precoUnitario * quantidade,
    };

    setItens([...itens, newItem]);
    setSelectedProduto("");
    setQuantidade(0);
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

    // Prevenir duplos cliques
    if (isSubmitting || loading) {
      return;
    }
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await withLoading(async () => {
        const orderData: CreatePedidoInput = {
          clienteId: formData.clienteId,
          formaPagamento: formData.formaPagamento,
          observacoes: formData.observacoes,
          taxaEntrega: formData.taxaEntrega,
          desconto: formData.desconto,
          itens: itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            preco: item.precoUnitario,
          })),
          total,
          criadoPorId: "",
        };
        await onAdd(orderData);
      });
    } finally {
      resetForm();
      onClose();

      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setItens([]);
    setSelectedProduto("");
    setQuantidade(0);
    setRevenda(false);
    setDescontoFormatado("");
    setTaxaEntregaFormatada("");
    setIsSubmitting(false);
  };

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

  // Função de validação consolidada
  const validateForm = () => {
    if (!formData.clienteId) {
      toast.error("Selecione um cliente");
      return false;
    }
    if (!formData.formaPagamento) {
      toast.error("Selecione uma forma de pagamento");
      return false;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return false;
    }
    return true;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Novo Pedido
          </DialogTitle>
          <DialogDescription>
            Crie um novo pedido, adicionando itens, cliente, forma de pagamento
            e observações.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, clienteId: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent sideOffset={5} align="start">
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="tipoEntrega">Tipo de Entrega *</Label>
                  <Select
                    value={formData.tipoEntrega}
                    onValueChange={(value: "balcao" | "entrega") =>
                      setFormData((prev) => ({ ...prev, tipoEntrega: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcao">Retirada no Balcão</SelectItem>
                      <SelectItem value="entrega">Entrega</SelectItem>
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Endereço de Entrega
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
                    type="text"
                    value={taxaEntregaFormatada}
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      // Remove todos os caracteres não numéricos
                      const numericValue = inputValue.replace(/\D/g, "");

                      // Aplica formatação automática
                      const formatted = formatCurrencyFromCents(numericValue);
                      setTaxaEntregaFormatada(formatted);

                      // Converte para centavos e atualiza o estado do formulário
                      const centavos = convertFormattedToCents(formatted);
                      setFormData((prev) => ({
                        ...prev,
                        taxaEntrega: centavos,
                      }));
                    }}
                    onKeyDown={(e) => {
                      // Permite apenas números, backspace, delete, tab e arrow keys
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="0,00"
                    inputMode="numeric"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar Item */}

              <div className="bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col gap-4">
                  {/* Seção de Produto */}
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="produto"
                        className="text-sm font-semibold text-foreground/90 flex items-center gap-2"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        Produto *
                      </Label>
                      <Select
                        value={selectedProduto}
                        onValueChange={setSelectedProduto}
                      >
                        <SelectTrigger className="w-full h-12 bg-background/80 border-border/60 hover:border-border transition-colors shadow-sm touch-manipulation">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] ">
                          {produtos
                            .filter((p) => p.ativo)
                            .map((produto) => (
                              <SelectItem
                                key={produto.id}
                                value={produto.id}
                                className="py-4 touch-manipulation whitespace-normal break-words max-w-[364px]"
                              >
                                <span className="font-medium text-sm whitespace-normal break-words">
                                  {produto.marca}
                                  <span>
                                    {"\u00A0 (" + produto.nome + ")\u00A0"}
                                  </span>
                                  <span className="whitespace-nowrap">
                                    {formatCurrency(getPreco(produto))}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-background/60 rounded-lg border border-border/30 touch-manipulation">
                      <Checkbox
                        id="terms"
                        checked={revenda}
                        onCheckedChange={(e) => {
                          setRevenda(e as boolean);
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        Revenda
                      </Label>
                      <div className="text-xs text-muted-foreground text-right">
                        {revenda ? "Preço revenda" : "Preço normal"}
                      </div>
                    </div>
                  </div>

                  {/* Seção de Quantidade e Ação */}
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="quantidade"
                        className="text-sm font-semibold text-foreground/90 flex items-center gap-2"
                      >
                        <span className="text-base">📊</span>
                        Quantidade
                      </Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={quantidade || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            setQuantidade(0);
                          } else {
                            const numValue = parseInt(value);
                            setQuantidade(numValue > 0 ? numValue : 1);
                          }
                        }}
                        placeholder="Digite a quantidade"
                        className="w-full h-12 bg-background/80 border-border/60 hover:border-border transition-colors shadow-sm text-center font-medium text-lg touch-manipulation"
                        inputMode="numeric"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddItem}
                      disabled={!selectedProduto}
                      className="w-full h-12 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-semibold text-base touch-manipulation active:scale-95"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Adicionar Item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de Itens */}
              {itens.length > 0 && (
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.produtoNome}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.precoUnitario)} cada
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
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">
                          {formatCurrency(item.precoUnitario * item.quantidade)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento e Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Pagamento e Observações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Forma de Pagamento - Mobile First */}
              <div className="space-y-3">
                <Label
                  htmlFor="formaPagamento"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  💳 Forma de Pagamento *
                </Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      formaPagamento: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 bg-background/80 border-border/60 hover:border-border transition-colors shadow-sm touch-manipulation w-full">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem
                      value="dinheiro"
                      className="py-3 touch-manipulation"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">💵</span>
                        <span>Dinheiro</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="cartao_debito"
                      className="py-3 touch-manipulation"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">💳</span>
                        <span>Cartão de Débito</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="cartao_credito"
                      className="py-3 touch-manipulation"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">💳</span>
                        <span>Cartão de Crédito</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pix" className="py-3 touch-manipulation">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📱</span>
                        <span>PIX</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desconto - Mobile Optimized */}
              <div className="space-y-3">
                <Label
                  htmlFor="desconto"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  🏷️ Desconto (Opcional)
                </Label>
                <div className="flex items-center gap-3 p-4 bg-background/60 rounded-lg border border-border/30">
                  <div className="flex-1">
                    <Input
                      id="desconto"
                      type="text"
                      value={descontoFormatado}
                      onChange={(e) => {
                        const inputValue = e.target.value;

                        // Remove todos os caracteres não numéricos
                        const numericValue = inputValue.replace(/\D/g, "");

                        // Aplica formatação automática
                        const formatted = formatCurrencyFromCents(numericValue);
                        setDescontoFormatado(formatted);

                        // Converte para centavos e atualiza o estado do formulário
                        const centavos = convertFormattedToCents(formatted);
                        setFormData((prev) => ({
                          ...prev,
                          desconto: centavos,
                        }));
                      }}
                      onKeyDown={(e) => {
                        // Permite apenas números, backspace, delete, tab e arrow keys
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "Tab",
                            "ArrowLeft",
                            "ArrowRight",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="0,00"
                      className="h-11 bg-background/80 border-border/60 hover:border-border transition-colors shadow-sm text-center font-medium touch-manipulation"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">R$</div>
                </div>
              </div>

              {/* Observações - Mobile Optimized */}
              <div className="space-y-3">
                <Label
                  htmlFor="observacoes"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  📝 Observações (Opcional)
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observacoes: e.target.value,
                    }))
                  }
                  placeholder="Digite observações adicionais sobre o pedido..."
                  rows={4}
                  className="min-h-[100px] bg-background/80 border-border/60 hover:border-border transition-colors shadow-sm resize-none touch-manipulation"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          {itens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {formData.desconto > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Desconto:</span>
                      <span className="text-red-600">
                        -{formatCurrency(formData.desconto)}
                      </span>
                    </div>
                  )}
                  {formData.taxaEntrega > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Taxa de Entrega:</span>
                      <span>{formatCurrency(formData.taxaEntrega)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                isSubmitting ||
                !formData.clienteId ||
                !formData.formaPagamento ||
                itens.length === 0
              }
            >
              {loading || isSubmitting ? "Criando Pedido..." : "Criar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
