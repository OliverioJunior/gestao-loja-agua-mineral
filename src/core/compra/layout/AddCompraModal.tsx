"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Plus,
  ShoppingCart,
  Calendar,
  DollarSign,
  Package,
  Trash2,
} from "lucide-react";
import { AddCompraModalProps, CompraFormData } from "./types";
import { CompraUtils } from "./compra-utils";
import { TFornecedor } from "@/core/fornecedor/domain/fornecedor.entity";
import { TProduto } from "@/core/produto/domain/produto.entity";
import {
  FormaPagamentoCompra,
  StatusCompra,
} from "@/infrastructure/generated/prisma";

// Interface para itens da compra
interface ItemCompra {
  id: string;
  produtoId: string;
  produto?: TProduto;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
  desconto?: number;
}

export function AddCompraModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCompraModalProps) {
  const [formData, setFormData] = useState<CompraFormData>({
    fornecedorId: "",
    numeroNota: "",
    dataCompra: new Date(),
    dataVencimento: undefined,
    total: 0,
    desconto: 0,
    frete: 0,
    impostos: 0,
    formaPagamento: "DINHEIRO",
    status: "PENDENTE",
    observacoes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<TFornecedor[]>([]);
  const [loadingFornecedores, setLoadingFornecedores] = useState(true);

  // Estados para itens da compra
  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [produtos, setProdutos] = useState<TProduto[]>([]);
  const [loadingProdutos, setLoadingProdutos] = useState(true);
  const [novoItem, setNovoItem] = useState<Partial<ItemCompra>>({});
  const [showAddItem, setShowAddItem] = useState(false);

  // Carregar fornecedores e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingFornecedores(true);
        setLoadingProdutos(true);

        // Carregar fornecedores
        const fornecedoresResponse = await fetch(
          "/api/fornecedor?status=ATIVO"
        );
        const fornecedoresData = await fornecedoresResponse.json();
        if (fornecedoresData.success) {
          setFornecedores(fornecedoresData.data);
        }

        // Carregar produtos
        const produtosResponse = await fetch("/api/produto?status=ATIVO");
        const produtosData = await produtosResponse.json();
        if (produtosData.success) {
          setProdutos(produtosData.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoadingFornecedores(false);
        setLoadingProdutos(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Funções para gerenciar itens
  const adicionarItem = () => {
    if (!novoItem.produtoId || !novoItem.quantidade) {
      toast.error("Selecione um produto e informe a quantidade");
      return;
    }

    const produto = produtos.find((p) => p.id === novoItem.produtoId);
    const precoUnitario =
      novoItem.precoUnitario ||
      (produto?.precoCusto ? produto.precoCusto / 100 : 0);
    const precoTotal =
      (novoItem.quantidade || 0) * precoUnitario - (novoItem.desconto || 0);

    const item: ItemCompra = {
      id: Date.now().toString(),
      produtoId: novoItem.produtoId,
      produto,
      quantidade: novoItem.quantidade || 0,
      precoUnitario,
      precoTotal,
      desconto: novoItem.desconto || 0,
    };

    setItens((prev) => [...prev, item]);
    setNovoItem({});
    setShowAddItem(false);

    // Atualizar total da compra baseado nos itens
    const totalItens = [...itens, item].reduce(
      (sum, i) => sum + i.precoTotal,
      0
    );
    const totalComExtras =
      totalItens +
      (formData.frete || 0) +
      (formData.impostos || 0) -
      (formData.desconto || 0);
    setFormData((prev) => ({
      ...prev,
      total: Math.round(totalComExtras * 100) / 100,
    }));
  };

  // Função para preencher preço automaticamente quando produto é selecionado
  const handleProdutoChange = (produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    setNovoItem((prev) => ({
      ...prev,
      produtoId,
      precoUnitario: produto?.precoCusto ? produto.precoCusto / 100 : 0,
    }));
  };

  const removerItem = (itemId: string) => {
    const novosItens = itens.filter((item) => item.id !== itemId);
    setItens(novosItens);

    // Atualizar total da compra baseado nos itens restantes
    const totalItens = novosItens.reduce(
      (sum, item) => sum + item.precoTotal,
      0
    );
    const totalComExtras =
      totalItens +
      (formData.frete || 0) +
      (formData.impostos || 0) -
      (formData.desconto || 0);
    setFormData((prev) => ({
      ...prev,
      total: Math.round(totalComExtras * 100) / 100,
    }));
  };

  const calcularPrecoTotal = () => {
    const quantidade = novoItem.quantidade || 0;
    const precoUnitario = novoItem.precoUnitario || 0;
    const desconto = novoItem.desconto || 0;
    return Math.round((quantidade * precoUnitario - desconto) * 100) / 100;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fornecedorId.trim()) {
      newErrors.fornecedorId = "Fornecedor é obrigatório";
    }

    if (!formData.dataCompra) {
      newErrors.dataCompra = "Data da compra é obrigatória";
    } else {
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);
      if (formData.dataCompra > hoje) {
        newErrors.dataCompra = "Data da compra não pode ser futura";
      }
    }

    if (formData.dataVencimento && formData.dataCompra) {
      if (formData.dataVencimento < formData.dataCompra) {
        newErrors.dataVencimento =
          "Data de vencimento não pode ser anterior à data de compra";
      }
    }

    if (itens.length === 0) {
      newErrors.itens = "Adicione pelo menos um item à compra";
    }

    if (formData.total <= 0) {
      newErrors.total = "Valor total deve ser maior que zero";
    }

    if (formData.desconto && formData.desconto > formData.total) {
      newErrors.desconto = "Desconto não pode ser maior que o valor total";
    }

    if (formData.frete && formData.frete < 0) {
      newErrors.frete = "Frete não pode ser negativo";
    }

    if (formData.impostos && formData.impostos < 0) {
      newErrors.impostos = "Impostos não podem ser negativos";
    }

    if (!formData.formaPagamento) {
      newErrors.formaPagamento = "Forma de pagamento é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit({
        fornecedorId: formData.fornecedorId,
        numeroNota: formData.numeroNota?.trim() || null,
        dataCompra: formData.dataCompra,
        dataVencimento: formData.dataVencimento || null,
        total: CompraUtils.toCents(formData.total),
        desconto: formData.desconto
          ? CompraUtils.toCents(formData.desconto)
          : null,
        frete: formData.frete ? CompraUtils.toCents(formData.frete) : null,
        impostos: formData.impostos
          ? CompraUtils.toCents(formData.impostos)
          : null,
        formaPagamento: formData.formaPagamento as FormaPagamentoCompra,
        status: formData.status as StatusCompra,
        observacoes: formData.observacoes?.trim() || null,
        criadoPorId: "",
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          precoTotal: item.precoTotal,
          desconto: item.desconto || 0,
        })),
      });

      // Reset form
      setFormData({
        fornecedorId: "",
        numeroNota: "",
        dataCompra: new Date(),
        dataVencimento: undefined,
        total: 0,
        desconto: 0,
        frete: 0,
        impostos: 0,
        formaPagamento: "DINHEIRO",
        status: "PENDENTE",
        observacoes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao criar compra:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fornecedorId: "",
      numeroNota: "",
      dataCompra: new Date(),
      dataVencimento: undefined,
      total: 0,
      desconto: 0,
      frete: 0,
      impostos: 0,
      formaPagamento: "DINHEIRO",
      status: "PENDENTE",
      observacoes: "",
    });
    setItens([]);
    setNovoItem({});
    setShowAddItem(false);
    setErrors({});
    onClose();
  };

  const handleMoneyChange = (field: keyof CompraFormData, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData((prev) => {
      const newData = { ...prev, [field]: numericValue };

      // Recalcular total se for alteração em frete, impostos ou desconto
      if (["frete", "impostos", "desconto"].includes(field)) {
        const totalItens = itens.reduce(
          (sum, item) => sum + item.precoTotal,
          0
        );
        const frete = field === "frete" ? numericValue : prev.frete || 0;
        const impostos =
          field === "impostos" ? numericValue : prev.impostos || 0;
        const desconto =
          field === "desconto" ? numericValue : prev.desconto || 0;
        const totalComExtras = totalItens + frete + impostos - desconto;
        newData.total = Math.round(totalComExtras * 100) / 100;
      }

      return newData;
    });
  };

  const handleDateChange = (field: keyof CompraFormData, value: string) => {
    const date = value ? new Date(value) : undefined;
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Adicionar Compra</span>
          </DialogTitle>
          <DialogDescription>
            Preencha as informações básicas da compra.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Informações Básicas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedorId">Fornecedor *</Label>
                <Select
                  value={formData.fornecedorId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, fornecedorId: value }))
                  }
                  disabled={loadingFornecedores}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingFornecedores
                          ? "Carregando fornecedores..."
                          : "Selecione um fornecedor"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{fornecedor.nome}</span>
                          {fornecedor.razaoSocial &&
                            fornecedor.razaoSocial !== fornecedor.nome && (
                              <span className="text-xs text-muted-foreground">
                                {fornecedor.razaoSocial}
                              </span>
                            )}
                        </div>
                      </SelectItem>
                    ))}
                    {fornecedores.length === 0 && !loadingFornecedores && (
                      <SelectItem value="none" disabled>
                        Nenhum fornecedor ativo encontrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.fornecedorId && (
                  <p className="text-sm text-destructive">
                    {errors.fornecedorId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroNota">Número da Nota Fiscal</Label>
                <Input
                  id="numeroNota"
                  value={formData.numeroNota}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      numeroNota: e.target.value,
                    }))
                  }
                  placeholder="Ex: 12345"
                />
                {errors.numeroNota && (
                  <p className="text-sm text-destructive">
                    {errors.numeroNota}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Datas</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataCompra">Data da Compra *</Label>
                <Input
                  id="dataCompra"
                  type="date"
                  value={
                    formData.dataCompra
                      ? formData.dataCompra.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("dataCompra", e.target.value)
                  }
                />
                {errors.dataCompra && (
                  <p className="text-sm text-destructive">
                    {errors.dataCompra}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={
                    formData.dataVencimento
                      ? formData.dataVencimento.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleDateChange("dataVencimento", e.target.value)
                  }
                />
                {errors.dataVencimento && (
                  <p className="text-sm text-destructive">
                    {errors.dataVencimento}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Valores Financeiros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total">Valor Total *</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total}
                  readOnly
                  className="bg-muted/50 cursor-not-allowed"
                  placeholder="0,00"
                  title="Valor calculado automaticamente baseado nos itens, frete, impostos e desconto"
                />
                {errors.total && (
                  <p className="text-sm text-destructive">{errors.total}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="desconto">Desconto</Label>
                <Input
                  id="desconto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.desconto}
                  onChange={(e) =>
                    handleMoneyChange("desconto", e.target.value)
                  }
                  placeholder="0,00"
                />
                {errors.desconto && (
                  <p className="text-sm text-destructive">{errors.desconto}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frete">Frete</Label>
                <Input
                  id="frete"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.frete}
                  onChange={(e) => handleMoneyChange("frete", e.target.value)}
                  placeholder="0,00"
                />
                {errors.frete && (
                  <p className="text-sm text-destructive">{errors.frete}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="impostos">Impostos</Label>
                <Input
                  id="impostos"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.impostos}
                  onChange={(e) =>
                    handleMoneyChange("impostos", e.target.value)
                  }
                  placeholder="0,00"
                />
                {errors.impostos && (
                  <p className="text-sm text-destructive">{errors.impostos}</p>
                )}
              </div>
            </div>
          </div>

          {/* Itens da Compra */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Itens da Compra</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddItem(true)}
                disabled={loadingProdutos}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {errors.itens && (
              <p className="text-sm text-destructive">{errors.itens}</p>
            )}

            {/* Lista de itens */}
            {itens.length > 0 && (
              <div className="border rounded-lg">
                <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
                  <div className="col-span-4">Produto</div>
                  <div className="col-span-2 text-center">Qtd</div>
                  <div className="col-span-2 text-center">Preço Unit.</div>
                  <div className="col-span-2 text-center">Desconto</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                {itens.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 p-3 border-t items-center"
                  >
                    <div className="col-span-4">
                      <span className="font-medium">{item.produto?.nome}</span>
                      {item.produto?.descricao && (
                        <p className="text-xs text-muted-foreground">
                          {item.produto.descricao}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      {item.quantidade}
                    </div>
                    <div className="col-span-2 text-center">
                      R$ {item.precoUnitario.toFixed(2)}
                    </div>
                    <div className="col-span-2 text-center">
                      R$ {(item.desconto || 0).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center font-medium">
                      R$ {item.precoTotal.toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-muted/30 border-t">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total dos Itens:</span>
                    <span>
                      R${" "}
                      {itens
                        .reduce((sum, item) => sum + item.precoTotal, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulário para adicionar item */}
            {showAddItem && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <h4 className="font-medium mb-3">Adicionar Novo Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="space-y-2">
                    <Label>Produto *</Label>
                    <Select
                      value={novoItem.produtoId || ""}
                      onValueChange={handleProdutoChange}
                      disabled={loadingProdutos}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingProdutos ? "Carregando..." : "Selecione"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {produtos.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {produto.nome}
                              </span>
                              {produto.descricao && (
                                <span className="text-xs text-muted-foreground">
                                  {produto.descricao}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade *</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={novoItem.quantidade || ""}
                      onChange={(e) =>
                        setNovoItem((prev) => ({
                          ...prev,
                          quantidade: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preço Unitário *</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={novoItem.precoUnitario || ""}
                      onChange={(e) =>
                        setNovoItem((prev) => ({
                          ...prev,
                          precoUnitario: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0,00"
                      className="bg-muted/50"
                      title="Preço preenchido automaticamente do cadastro do produto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Desconto</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={novoItem.desconto || ""}
                      onChange={(e) =>
                        setNovoItem((prev) => ({
                          ...prev,
                          desconto: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total</Label>
                    <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
                      R$ {calcularPrecoTotal().toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNovoItem({});
                      setShowAddItem(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="button" onClick={adicionarItem}>
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Forma de Pagamento e Status */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, formaPagamento: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">
                      Cartão de Débito
                    </SelectItem>
                    <SelectItem value="CARTAO_CREDITO">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                    <SelectItem value="PRAZO">A Prazo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.formaPagamento && (
                  <p className="text-sm text-destructive">
                    {errors.formaPagamento}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                    <SelectItem value="RECEBIDA">Recebida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <div className="space-y-2">
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
                placeholder="Observações adicionais sobre a compra"
                rows={3}
              />
            </div>
          </div>

          {/* Resumo Financeiro */}
          {formData.total > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">
                Resumo Financeiro
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">
                    Subtotal:{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(
                        formData.total -
                          (formData.desconto || 0) -
                          (formData.frete || 0) -
                          (formData.impostos || 0)
                      )
                    )}
                  </p>
                  {(formData.desconto || 0) > 0 && (
                    <p className="text-green-600">
                      Desconto: -
                      {CompraUtils.formatCurrency(
                        CompraUtils.toCents(formData.desconto || 0)
                      )}
                    </p>
                  )}
                </div>
                <div>
                  {formData.frete ||
                    (0 > 0 && (
                      <p className="text-blue-700">
                        Frete:{" "}
                        {CompraUtils.formatCurrency(
                          CompraUtils.toCents(formData.frete || 0)
                        )}
                      </p>
                    ))}
                  {formData.impostos ||
                    (0 > 0 && (
                      <p className="text-blue-700">
                        Impostos:{" "}
                        {CompraUtils.formatCurrency(
                          CompraUtils.toCents(formData.impostos || 0)
                        )}
                      </p>
                    ))}
                  <p className="font-semibold text-blue-800">
                    Total:{" "}
                    {CompraUtils.formatCurrency(
                      CompraUtils.toCents(formData.total)
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Compra"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
