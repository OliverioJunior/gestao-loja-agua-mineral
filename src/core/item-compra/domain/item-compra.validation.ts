import {
  CreateItemCompraInput,
  UpdateItemCompraInput
} from "./item-compra.entity";
import {
  ItemCompraValidationError,
  InvalidQuantityError,
  InvalidPriceError
} from "./item-compra.errors";

export class ItemCompraValidation {
  /**
   * Valida os dados de entrada para criação de item de compra
   */
  static validateCreateInput(data: CreateItemCompraInput): void {
    // Validar campos obrigatórios
    this.validateRequiredFields(data);
    
    // Validar quantidade
    this.validateQuantidade(data.quantidade);
    
    // Validar preços
    this.validatePrecoUnitario(data.precoUnitario);
    this.validatePrecoTotal(data.precoTotal);
    
    // Validar desconto se fornecido
    if (data.desconto !== null && data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }
    
    // Validar consistência entre preços
    this.validatePriceConsistency(data);
  }

  /**
   * Valida os dados de entrada para atualização de item de compra
   */
  static validateUpdateInput(data: UpdateItemCompraInput): void {
    // Validar quantidade se fornecida
    if (data.quantidade !== undefined) {
      this.validateQuantidade(data.quantidade);
    }
    
    // Validar preço unitário se fornecido
    if (data.precoUnitario !== undefined) {
      this.validatePrecoUnitario(data.precoUnitario);
    }
    
    // Validar preço total se fornecido
    if (data.precoTotal !== undefined) {
      this.validatePrecoTotal(data.precoTotal);
    }
    
    // Validar desconto se fornecido
    if (data.desconto !== null && data.desconto !== undefined) {
      this.validateDesconto(data.desconto);
    }
  }

  /**
   * Valida campos obrigatórios
   */
  private static validateRequiredFields(data: CreateItemCompraInput): void {
    if (!data.compraId?.trim()) {
      throw new ItemCompraValidationError(
        "compraId",
        "ID da compra é obrigatório"
      );
    }

    if (!data.produtoId?.trim()) {
      throw new ItemCompraValidationError(
        "produtoId",
        "ID do produto é obrigatório"
      );
    }

    if (!data.criadoPorId?.trim()) {
      throw new ItemCompraValidationError(
        "criadoPorId",
        "ID do usuário criador é obrigatório"
      );
    }
  }

  /**
   * Valida quantidade
   */
  private static validateQuantidade(quantidade: number): void {
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw new InvalidQuantityError(quantidade);
    }

    if (quantidade > 999999) {
      throw new ItemCompraValidationError(
        "quantidade",
        "Quantidade não pode ser maior que 999.999",
        quantidade
      );
    }
  }

  /**
   * Valida preço unitário
   */
  private static validatePrecoUnitario(preco: number): void {
    if (!Number.isInteger(preco) || preco <= 0) {
      throw new InvalidPriceError(preco, "precoUnitario");
    }

    if (preco > 99999999) { // R$ 999.999,99 em centavos
      throw new ItemCompraValidationError(
        "precoUnitario",
        "Preço unitário não pode ser maior que R$ 999.999,99",
        preco
      );
    }
  }

  /**
   * Valida preço total
   */
  private static validatePrecoTotal(preco: number): void {
    if (!Number.isInteger(preco) || preco <= 0) {
      throw new InvalidPriceError(preco, "precoTotal");
    }

    if (preco > 9999999999) { // R$ 99.999.999,99 em centavos
      throw new ItemCompraValidationError(
        "precoTotal",
        "Preço total não pode ser maior que R$ 99.999.999,99",
        preco
      );
    }
  }

  /**
   * Valida desconto
   */
  private static validateDesconto(desconto: number): void {
    if (!Number.isInteger(desconto) || desconto < 0) {
      throw new ItemCompraValidationError(
        "desconto",
        "Desconto deve ser um valor positivo ou zero",
        desconto
      );
    }
  }

  /**
   * Valida consistência entre preços
   */
  private static validatePriceConsistency(data: CreateItemCompraInput): void {
    const expectedTotal = data.precoUnitario * data.quantidade;
    const discountAmount = data.desconto || 0;
    const expectedTotalWithDiscount = expectedTotal - discountAmount;

    if (data.precoTotal !== expectedTotalWithDiscount) {
      throw new ItemCompraValidationError(
        "precoTotal",
        `Preço total inconsistente. Esperado: ${expectedTotalWithDiscount}, Recebido: ${data.precoTotal}`,
        {
          expected: expectedTotalWithDiscount,
          received: data.precoTotal,
          calculation: {
            precoUnitario: data.precoUnitario,
            quantidade: data.quantidade,
            desconto: discountAmount
          }
        }
      );
    }
  }

  /**
   * Valida ID no formato UUID
   */
  static validateUUID(id: string, fieldName: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(id)) {
      throw new ItemCompraValidationError(
        fieldName,
        `${fieldName} deve ser um UUID válido`,
        id
      );
    }
  }
}