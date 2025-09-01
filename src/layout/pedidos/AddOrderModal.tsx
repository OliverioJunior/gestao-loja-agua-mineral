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
import { AddOrderModalProps, IPedidoItem, ICreatePedido } from "./types";
import { formatCurrency } from "./order-utils";
import { useClientes } from "@/hooks/clientes/useClientes";
import { IProdutoEstoque, useProdutos } from "@/hooks/produtos/useProdutos";
import { usePedidos } from "@/hooks/pedidos/usePedidos";
import { toast } from "sonner";
import { useLoading } from "@/shared/utils";

export function AddOrderModal({ isOpen, onClose, onAdd }: AddOrderModalProps) {
  const { loading, withLoading } = useLoading();
  const { clients: clientes } = useClientes();
  const { produtos } = useProdutos();
  const { createPedido } = usePedidos();

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
  const [quantidade, setQuantidade] = useState(1);

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

    if (!validateForm()) {
      return;
    }

    const result = await withLoading(async () => {
      try {
        const orderData: ICreatePedido = {
          clienteId: formData.clienteId,
          tipoEntrega: formData.tipoEntrega,
          formaPagamento: formData.formaPagamento as
            | "dinheiro"
            | "cartao_debito"
            | "cartao_credito"
            | "pix",
          observacoes: formData.observacoes,
          enderecoEntrega:
            formData.tipoEntrega === "entrega"
              ? formData.enderecoEntrega
              : undefined,
          taxaEntrega: formData.taxaEntrega,
          desconto: formData.desconto,
          itens: itens.map((item) => ({
            produtoId: item.produtoId,
            produtoNome: item.produtoNome,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.subtotal,
          })),
        };

        const success = await createPedido(orderData);
        if (success) {
          onAdd?.(orderData); // Callback opcional para atualizar dashboard
          return { success: true };
        } else {
          throw new Error("Falha ao criar pedido");
        }
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Erro desconhecido ao criar pedido",
        };
      }
    });

    if (result.success) {
      toast.success("Pedido criado com sucesso!");
      resetForm();
      onClose();
    } else {
      toast.error(result.error || "Erro ao criar pedido. Tente novamente.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setItens([]);
    setSelectedProduto("");
    setQuantidade(1);
    setRevenda(false);
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, clienteId: value }))
                    }
                  >
                    <SelectTrigger>
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

                <div className="grid gap-2">
                  <Label htmlFor="tipoEntrega">Tipo de Entrega *</Label>
                  <Select
                    value={formData.tipoEntrega}
                    onValueChange={(value: "balcao" | "entrega") =>
                      setFormData((prev) => ({ ...prev, tipoEntrega: value }))
                    }
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
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar Item */}

              <div className="flex gap-2">
                <div className="flex-1">
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
                            {produto.nome} - {formatCurrency(getPreco(produto))}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox
                      id="terms"
                      checked={revenda}
                      onCheckedChange={(e) => {
                        setRevenda(e as boolean);
                      }}
                    />
                    <Label htmlFor="terms">Revenda</Label>
                  </div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) =>
                      setQuantidade(parseInt(e.target.value) || 1)
                    }
                    placeholder="Qtd"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProduto}
                >
                  <Plus className="h-4 w-4" />
                </Button>
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
                <CreditCard className="h-4 w-4 " />
                Pagamento e Observações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        formaPagamento: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
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

                <div className="flex flex-col items-end  ">
                  <div className="grid gap-2 ">
                    <Label htmlFor="desconto">Desconto</Label>
                    <Input
                      id="desconto"
                      type="number"
                      step="0.01"
                      className="w-20"
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
                </div>
              </div>

              <div className="mt-4 grid gap-4">
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
                  placeholder="Observações adicionais sobre o pedido..."
                  rows={3}
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
                !formData.clienteId ||
                !formData.formaPagamento ||
                itens.length === 0
              }
            >
              {loading ? "Criando Pedido..." : "Criar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
