import { TItemCompraWithRelations } from "../domain/item-compra.entity";

/**
 * Utilitários para formatação e manipulação de dados de itens de compra
 */
export class ItemCompraUtils {
  /**
   * Formata valor em centavos para moeda brasileira
   */
  static formatCurrency(valueInCents: number): string {
    const value = valueInCents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
   * Calcula o preço total baseado na quantidade, preço unitário e desconto
   */
  static calculateTotal(
    quantidade: number,
    precoUnitario: number,
    desconto: number = 0
  ): number {
    const subtotal = quantidade * precoUnitario;
    return subtotal - desconto;
  }

  /**
   * Calcula o percentual de desconto
   */
  static calculateDiscountPercentage(
    quantidade: number,
    precoUnitario: number,
    desconto: number
  ): number {
    const subtotal = quantidade * precoUnitario;
    if (subtotal === 0) return 0;
    return (desconto / subtotal) * 100;
  }

  /**
   * Formata a data de criação do item
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  /**
   * Formata apenas a data (sem hora)
   */
  static formatDateOnly(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  }

  /**
   * Gera um resumo do item para exibição
   */
  static getItemSummary(item: TItemCompraWithRelations): string {
    const produto = item.produto?.nome || 'Produto não encontrado';
    const quantidade = item.quantidade;
    const total = this.formatCurrency(item.precoTotal);
    
    return `${quantidade}x ${produto} - ${total}`;
  }

  /**
   * Obtém o nome do fornecedor do item
   */
  static getFornecedorName(item: TItemCompraWithRelations): string {
    return item.compra?.fornecedor?.nome || 'Fornecedor não encontrado';
  }

  /**
   * Obtém o número da nota fiscal
   */
  static getNumeroNota(item: TItemCompraWithRelations): string {
    return item.compra?.numeroNota || 'Sem nota';
  }

  /**
   * Verifica se o item tem desconto
   */
  static hasDiscount(item: TItemCompraWithRelations): boolean {
    return (item.desconto || 0) > 0;
  }

  /**
   * Calcula o subtotal (sem desconto)
   */
  static getSubtotal(item: TItemCompraWithRelations): number {
    return item.quantidade * item.precoUnitario;
  }

  /**
   * Obtém a economia com desconto
   */
  static getDiscountAmount(item: TItemCompraWithRelations): number {
    return item.desconto || 0;
  }

  /**
   * Valida se os valores do item estão consistentes
   */
  static validateItemConsistency(item: TItemCompraWithRelations): boolean {
    const expectedTotal = this.calculateTotal(
      item.quantidade,
      item.precoUnitario,
      item.desconto || 0
    );
    
    return item.precoTotal === expectedTotal;
  }

  /**
   * Gera dados para exportação
   */
  static toExportData(item: TItemCompraWithRelations): Record<string, any> {
    return {
      'Produto': item.produto?.nome || '',
      'Fornecedor': this.getFornecedorName(item),
      'Nota Fiscal': this.getNumeroNota(item),
      'Quantidade': item.quantidade,
      'Preço Unitário': this.formatCurrency(item.precoUnitario),
      'Subtotal': this.formatCurrency(this.getSubtotal(item)),
      'Desconto': this.formatCurrency(item.desconto || 0),
      'Total': this.formatCurrency(item.precoTotal),
      'Data': this.formatDate(item.createdAt)
    };
  }

  /**
   * Agrupa itens por compra
   */
  static groupByCompra(items: TItemCompraWithRelations[]): Record<string, TItemCompraWithRelations[]> {
    return items.reduce((groups, item) => {
      const compraId = item.compraId;
      if (!groups[compraId]) {
        groups[compraId] = [];
      }
      groups[compraId].push(item);
      return groups;
    }, {} as Record<string, TItemCompraWithRelations[]>);
  }

  /**
   * Agrupa itens por produto
   */
  static groupByProduto(items: TItemCompraWithRelations[]): Record<string, TItemCompraWithRelations[]> {
    return items.reduce((groups, item) => {
      const produtoId = item.produtoId;
      if (!groups[produtoId]) {
        groups[produtoId] = [];
      }
      groups[produtoId].push(item);
      return groups;
    }, {} as Record<string, TItemCompraWithRelations[]>);
  }

  /**
   * Calcula estatísticas de uma lista de itens
   */
  static calculateStats(items: TItemCompraWithRelations[]) {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.precoTotal, 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantidade, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.desconto || 0), 0);
    const averageItemValue = totalItems > 0 ? totalValue / totalItems : 0;
    
    return {
      totalItems,
      totalValue,
      totalQuantity,
      totalDiscount,
      averageItemValue,
      formattedTotalValue: this.formatCurrency(totalValue),
      formattedTotalDiscount: this.formatCurrency(totalDiscount),
      formattedAverageItemValue: this.formatCurrency(averageItemValue)
    };
  }
}