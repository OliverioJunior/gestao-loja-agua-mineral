import { TCompraWithRelations } from "../domain/compra.entity";

/**
 * Utilitários para formatação e manipulação de dados de compras
 */
export class CompraUtils {
  /**
   * Formata valor monetário de centavos para reais
   */
  static formatCurrency(valueInCents: number): string {
    const valueInReais = valueInCents / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valueInReais);
  }

  /**
   * Converte valor em reais para centavos
   */
  static toCents(valueInReais: number): number {
    return Math.round(valueInReais * 100);
  }

  /**
   * Converte valor em centavos para reais
   */
  static toReais(valueInCents: number): number {
    return valueInCents / 100;
  }

  /**
   * Calcula o subtotal da compra (total - desconto - frete - impostos)
   */
  static calculateSubtotal(compra: TCompraWithRelations): number {
    const desconto = compra.desconto || 0;
    const frete = compra.frete || 0;
    const impostos = compra.impostos || 0;
    return compra.total - desconto - frete - impostos;
  }

  /**
   * Calcula o percentual de desconto
   */
  static calculateDescontoPercentual(compra: TCompraWithRelations): number {
    if (!compra.desconto || compra.total === 0) return 0;
    return (compra.desconto / compra.total) * 100;
  }

  /**
   * Formata a data de compra
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(dateObj);
  }

  /**
   * Formata data e hora
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  }

  /**
   * Obtém a cor do status
   */
  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (status) {
      case "PENDENTE":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "CONFIRMADA":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "RECEBIDA":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "CANCELADA":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
        };
    }
  }

  /**
   * Obtém o texto do status
   */
  static getStatusText(status: string): string {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "CONFIRMADA":
        return "Confirmada";
      case "RECEBIDA":
        return "Recebida";
      case "CANCELADA":
        return "Cancelada";
      default:
        return "Desconhecido";
    }
  }

  /**
   * Obtém o texto da forma de pagamento
   */
  static getFormaPagamentoText(formaPagamento: string): string {
    switch (formaPagamento) {
      case "DINHEIRO":
        return "Dinheiro";
      case "PIX":
        return "PIX";
      case "CARTAO_DEBITO":
        return "Cartão de Débito";
      case "CARTAO_CREDITO":
        return "Cartão de Crédito";
      case "TRANSFERENCIA":
        return "Transferência";
      case "BOLETO":
        return "Boleto";
      case "CHEQUE":
        return "Cheque";
      case "PRAZO":
        return "A Prazo";
      default:
        return formaPagamento;
    }
  }

  /**
   * Verifica se a compra está vencida
   */
  static isVencida(compra: TCompraWithRelations): boolean {
    if (!compra.dataVencimento) return false;
    const hoje = new Date();
    const vencimento = new Date(compra.dataVencimento);
    return (
      vencimento < hoje && ["PENDENTE", "CONFIRMADA"].includes(compra.status)
    );
  }

  /**
   * Calcula dias até o vencimento
   */
  static getDiasAteVencimento(compra: TCompraWithRelations): number | null {
    if (!compra.dataVencimento) return null;
    const hoje = new Date();
    const vencimento = new Date(compra.dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Gera um resumo da compra para exibição
   */
  static getCompraSummary(compra: TCompraWithRelations): string {
    const numeroNota = compra.numeroNota || "S/N";
    const fornecedor = compra.fornecedor?.nome || "Fornecedor não informado";
    return `${numeroNota} - ${fornecedor}`;
  }

  /**
   * Obtém informações financeiras da compra
   */
  static getFinancialInfo(compra: TCompraWithRelations): {
    subtotal: number;
    desconto: number;
    frete: number;
    impostos: number;
    total: number;
    descontoPercentual: number;
  } {
    return {
      subtotal: this.calculateSubtotal(compra),
      desconto: compra.desconto || 0,
      frete: compra.frete || 0,
      impostos: compra.impostos || 0,
      total: compra.total,
      descontoPercentual: this.calculateDescontoPercentual(compra),
    };
  }

  /**
   * Verifica se a compra pode ser editada
   */
  static canEdit(compra: TCompraWithRelations): boolean {
    return !["RECEBIDA", "CANCELADA"].includes(compra.status);
  }

  /**
   * Verifica se a compra pode ser excluída
   */
  static canDelete(compra: TCompraWithRelations): boolean {
    return compra.status !== "RECEBIDA";
  }

  /**
   * Verifica se a compra pode ser confirmada
   */
  static canConfirm(compra: TCompraWithRelations): boolean {
    return compra.status === "PENDENTE";
  }

  /**
   * Verifica se a compra pode ser recebida
   */
  static canReceive(compra: TCompraWithRelations): boolean {
    return compra.status === "CONFIRMADA";
  }

  /**
   * Verifica se a compra pode ser cancelada
   */
  static canCancel(compra: TCompraWithRelations): boolean {
    return ["PENDENTE", "CONFIRMADA"].includes(compra.status);
  }

  /**
   * Obtém as transições de status permitidas
   */
  static getAllowedStatusTransitions(currentStatus: string): string[] {
    const transitions: Record<string, string[]> = {
      PENDENTE: ["CONFIRMADA", "CANCELADA"],
      CONFIRMADA: ["RECEBIDA", "CANCELADA"],
      RECEBIDA: [],
      CANCELADA: [],
    };

    return transitions[currentStatus] || [];
  }

  /**
   * Calcula estatísticas de itens da compra
   */
  static getItensStatistics(compra: TCompraWithRelations): {
    totalItens: number;
    quantidadeTotal: number;
  } {
    const totalItens = compra.itens?.length || 0;
    const quantidadeTotal =
      compra.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0;

    return {
      totalItens,
      quantidadeTotal,
    };
  }

  /**
   * Gera dados para exportação
   */
  static toExportData(
    compra: TCompraWithRelations
  ): Record<string, string | number> {
    const financial = this.getFinancialInfo(compra);
    const itens = this.getItensStatistics(compra);

    return {
      "Número da Nota": compra.numeroNota || "",
      Fornecedor: compra.fornecedor?.nome || "",
      "Data da Compra": this.formatDate(compra.dataCompra),
      "Data de Vencimento": compra.dataVencimento
        ? this.formatDate(compra.dataVencimento)
        : "",
      Status: this.getStatusText(compra.status),
      "Forma de Pagamento": this.getFormaPagamentoText(compra.formaPagamento),
      Subtotal: this.formatCurrency(financial.subtotal),
      Desconto: this.formatCurrency(financial.desconto),
      Frete: this.formatCurrency(financial.frete),
      Impostos: this.formatCurrency(financial.impostos),
      Total: this.formatCurrency(financial.total),
      "Total de Itens": itens.totalItens,
      "Quantidade Total": itens.quantidadeTotal,
      "Data de Criação": this.formatDateTime(compra.createdAt),
      "Última Atualização": this.formatDateTime(compra.updatedAt),
    };
  }

  /**
   * Agrupa compras por status
   */
  static groupByStatus(
    compras: TCompraWithRelations[]
  ): Record<string, TCompraWithRelations[]> {
    return compras.reduce((groups, compra) => {
      const status = compra.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(compra);
      return groups;
    }, {} as Record<string, TCompraWithRelations[]>);
  }

  /**
   * Agrupa compras por fornecedor
   */
  static groupByFornecedor(
    compras: TCompraWithRelations[]
  ): Record<string, TCompraWithRelations[]> {
    return compras.reduce((groups, compra) => {
      const fornecedorNome = compra.fornecedor?.nome || "Sem fornecedor";
      if (!groups[fornecedorNome]) {
        groups[fornecedorNome] = [];
      }
      groups[fornecedorNome].push(compra);
      return groups;
    }, {} as Record<string, TCompraWithRelations[]>);
  }

  /**
   * Filtra compras por termo de busca
   */
  static filterBySearchTerm(
    compras: TCompraWithRelations[],
    searchTerm: string
  ): TCompraWithRelations[] {
    if (!searchTerm.trim()) return compras;

    const term = searchTerm.toLowerCase();
    return compras.filter((compra) => {
      return (
        compra.numeroNota?.toLowerCase().includes(term) ||
        compra.fornecedor?.nome?.toLowerCase().includes(term) ||
        compra.fornecedor?.razaoSocial?.toLowerCase().includes(term) ||
        compra.observacoes?.toLowerCase().includes(term)
      );
    });
  }

  /**
   * Calcula estatísticas de uma lista de compras
   */
  static calculateStatistics(compras: TCompraWithRelations[]) {
    const total = compras.length;
    const pendentes = compras.filter((c) => c.status === "PENDENTE").length;
    const confirmadas = compras.filter((c) => c.status === "CONFIRMADA").length;
    const recebidas = compras.filter((c) => c.status === "RECEBIDA").length;
    const canceladas = compras.filter((c) => c.status === "CANCELADA").length;

    const valorTotal = compras
      .filter((c) => ["CONFIRMADA", "RECEBIDA"].includes(c.status))
      .reduce((sum, c) => sum + c.total, 0);

    const valorMedio = total > 0 ? valorTotal / total : 0;

    return {
      total,
      pendentes,
      confirmadas,
      recebidas,
      canceladas,
      valorTotal,
      valorMedio,
      percentualPendentes: total > 0 ? (pendentes / total) * 100 : 0,
      percentualConfirmadas: total > 0 ? (confirmadas / total) * 100 : 0,
      percentualRecebidas: total > 0 ? (recebidas / total) * 100 : 0,
      percentualCanceladas: total > 0 ? (canceladas / total) * 100 : 0,
    };
  }

  /**
   * Valida se um valor monetário é válido
   */
  static isValidMoneyValue(value: number): boolean {
    return typeof value === "number" && !isNaN(value) && value >= 0;
  }

  /**
   * Formata número da nota fiscal
   */
  static formatNumeroNota(numeroNota: string | null): string {
    return numeroNota || "S/N";
  }

  /**
   * Obtém sugestões de busca baseadas nas compras
   */
  static getSearchSuggestions(compras: TCompraWithRelations[]): string[] {
    const suggestions = new Set<string>();

    compras.forEach((compra) => {
      if (compra.numeroNota) suggestions.add(compra.numeroNota);
      if (compra.fornecedor?.nome) suggestions.add(compra.fornecedor.nome);
      if (compra.fornecedor?.razaoSocial)
        suggestions.add(compra.fornecedor.razaoSocial);
    });

    return Array.from(suggestions).sort();
  }

  /**
   * Calcula o prazo médio de pagamento
   */
  static calculatePrazoMedioPagamento(compras: TCompraWithRelations[]): number {
    const comprasComVencimento = compras.filter(
      (c) => c.dataVencimento && ["CONFIRMADA", "RECEBIDA"].includes(c.status)
    );

    if (comprasComVencimento.length === 0) return 0;

    const totalDias = comprasComVencimento.reduce((sum, compra) => {
      const dataCompra = new Date(compra.dataCompra);
      const dataVencimento = new Date(compra.dataVencimento!);
      const diffTime = dataVencimento.getTime() - dataCompra.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);

    return Math.round(totalDias / comprasComVencimento.length);
  }
}
