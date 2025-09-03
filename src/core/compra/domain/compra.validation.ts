import {
  CreateCompraInput,
  UpdateCompraInput
} from "./compra.entity";
import {
  CompraValidationError,
  InvalidDataCompraError,
  InvalidDataVencimentoError,
  InvalidTotalError,
  InvalidDescontoError,
  InvalidStatusTransitionError
} from "./compra.errors";

export class CompraValidation {
  /**
   * Valida os dados de entrada para criação de compra
   */
  static validateCreateInput(data: CreateCompraInput): void {
    // Validar campos obrigatórios
    this.validateRequiredFields(data);
    
    // Validar fornecedor
    this.validateFornecedorId(data.fornecedorId);
    
    // Validar datas
    this.validateDataCompra(data.dataCompra);
    if (data.dataVencimento) {
      this.validateDataVencimento(data.dataVencimento, data.dataCompra);
    }
    
    // Validar valores financeiros
    this.validateTotal(data.total);
    if (data.desconto !== null && data.desconto !== undefined) {
      this.validateDesconto(data.desconto, data.total);
    }
    if (data.frete !== null && data.frete !== undefined) {
      this.validateFrete(data.frete);
    }
    if (data.impostos !== null && data.impostos !== undefined) {
      this.validateImpostos(data.impostos);
    }
    
    // Validar status
    this.validateStatus(data.status);
    
    // Validar forma de pagamento
    this.validateFormaPagamento(data.formaPagamento);
  }

  /**
   * Valida os dados de entrada para atualização de compra
   */
  static validateUpdateInput(data: UpdateCompraInput): void {
    // Validar datas se fornecidas
    if (data.dataCompra !== undefined) {
      this.validateDataCompra(data.dataCompra);
    }
    
    if (data.dataVencimento !== undefined && data.dataVencimento !== null) {
      // Se dataCompra não foi fornecida na atualização, assumimos que é válida
      if (data.dataCompra) {
        this.validateDataVencimento(data.dataVencimento, data.dataCompra);
      }
    }
    
    // Validar valores financeiros se fornecidos
    if (data.total !== undefined) {
      this.validateTotal(data.total);
    }
    
    if (data.desconto !== null && data.desconto !== undefined) {
      // Se total não foi fornecido na atualização, validação será feita no service
      if (data.total !== undefined) {
        this.validateDesconto(data.desconto, data.total);
      }
    }
    
    if (data.frete !== null && data.frete !== undefined) {
      this.validateFrete(data.frete);
    }
    
    if (data.impostos !== null && data.impostos !== undefined) {
      this.validateImpostos(data.impostos);
    }
    
    // Validar status se fornecido
    if (data.status !== undefined) {
      this.validateStatus(data.status);
    }
    
    // Validar forma de pagamento se fornecida
    if (data.formaPagamento !== undefined) {
      this.validateFormaPagamento(data.formaPagamento);
    }
  }

  /**
   * Valida campos obrigatórios
   */
  private static validateRequiredFields(data: CreateCompraInput): void {
    if (!data.fornecedorId?.trim()) {
      throw new CompraValidationError(
        "fornecedorId",
        "ID do fornecedor é obrigatório"
      );
    }

    if (!data.dataCompra) {
      throw new CompraValidationError(
        "dataCompra",
        "Data da compra é obrigatória"
      );
    }

    if (data.total === undefined || data.total === null) {
      throw new CompraValidationError(
        "total",
        "Valor total é obrigatório"
      );
    }

    if (!data.formaPagamento?.trim()) {
      throw new CompraValidationError(
        "formaPagamento",
        "Forma de pagamento é obrigatória"
      );
    }

    if (!data.status?.trim()) {
      throw new CompraValidationError(
        "status",
        "Status é obrigatório"
      );
    }

    if (!data.criadoPorId?.trim()) {
      throw new CompraValidationError(
        "criadoPorId",
        "ID do usuário criador é obrigatório"
      );
    }
  }

  /**
   * Valida ID do fornecedor
   */
  private static validateFornecedorId(fornecedorId: string): void {
    if (!fornecedorId || typeof fornecedorId !== 'string') {
      throw new CompraValidationError(
        "fornecedorId",
        "ID do fornecedor deve ser uma string válida",
        fornecedorId
      );
    }

    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(fornecedorId)) {
      throw new CompraValidationError(
        "fornecedorId",
        "ID do fornecedor deve ser um UUID válido",
        fornecedorId
      );
    }
  }

  /**
   * Valida data da compra
   */
  private static validateDataCompra(dataCompra: Date): void {
    if (!(dataCompra instanceof Date) || isNaN(dataCompra.getTime())) {
      throw new CompraValidationError(
        "dataCompra",
        "Data da compra deve ser uma data válida",
        dataCompra
      );
    }

    // Não permitir datas futuras (com tolerância de 1 dia)
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    
    if (dataCompra > hoje) {
      throw new InvalidDataCompraError(dataCompra);
    }

    // Não permitir datas muito antigas (mais de 10 anos)
    const dezAnosAtras = new Date();
    dezAnosAtras.setFullYear(dezAnosAtras.getFullYear() - 10);
    
    if (dataCompra < dezAnosAtras) {
      throw new CompraValidationError(
        "dataCompra",
        "Data da compra não pode ser anterior a 10 anos",
        dataCompra
      );
    }
  }

  /**
   * Valida data de vencimento
   */
  private static validateDataVencimento(dataVencimento: Date, dataCompra: Date): void {
    if (!(dataVencimento instanceof Date) || isNaN(dataVencimento.getTime())) {
      throw new CompraValidationError(
        "dataVencimento",
        "Data de vencimento deve ser uma data válida",
        dataVencimento
      );
    }

    // Data de vencimento não pode ser anterior à data de compra
    if (dataVencimento < dataCompra) {
      throw new InvalidDataVencimentoError(dataVencimento, dataCompra);
    }

    // Data de vencimento não pode ser muito distante (mais de 5 anos)
    const cincoAnosAFrente = new Date(dataCompra);
    cincoAnosAFrente.setFullYear(cincoAnosAFrente.getFullYear() + 5);
    
    if (dataVencimento > cincoAnosAFrente) {
      throw new CompraValidationError(
        "dataVencimento",
        "Data de vencimento não pode ser superior a 5 anos da data de compra",
        dataVencimento
      );
    }
  }

  /**
   * Valida valor total
   */
  private static validateTotal(total: number): void {
    if (typeof total !== 'number' || isNaN(total)) {
      throw new CompraValidationError(
        "total",
        "Valor total deve ser um número válido",
        total
      );
    }

    if (!Number.isInteger(total)) {
      throw new CompraValidationError(
        "total",
        "Valor total deve ser um número inteiro (em centavos)",
        total
      );
    }

    if (total <= 0) {
      throw new InvalidTotalError(total);
    }

    if (total > 999999999999) { // R$ 9.999.999.999,99 em centavos
      throw new CompraValidationError(
        "total",
        "Valor total não pode ser maior que R$ 9.999.999.999,99",
        total
      );
    }
  }

  /**
   * Valida desconto
   */
  private static validateDesconto(desconto: number, total: number): void {
    if (typeof desconto !== 'number' || isNaN(desconto)) {
      throw new CompraValidationError(
        "desconto",
        "Desconto deve ser um número válido",
        desconto
      );
    }

    if (!Number.isInteger(desconto)) {
      throw new CompraValidationError(
        "desconto",
        "Desconto deve ser um número inteiro (em centavos)",
        desconto
      );
    }

    if (desconto < 0) {
      throw new CompraValidationError(
        "desconto",
        "Desconto não pode ser negativo",
        desconto
      );
    }

    if (desconto > total) {
      throw new InvalidDescontoError(desconto, total);
    }
  }

  /**
   * Valida frete
   */
  private static validateFrete(frete: number): void {
    if (typeof frete !== 'number' || isNaN(frete)) {
      throw new CompraValidationError(
        "frete",
        "Frete deve ser um número válido",
        frete
      );
    }

    if (!Number.isInteger(frete)) {
      throw new CompraValidationError(
        "frete",
        "Frete deve ser um número inteiro (em centavos)",
        frete
      );
    }

    if (frete < 0) {
      throw new CompraValidationError(
        "frete",
        "Frete não pode ser negativo",
        frete
      );
    }
  }

  /**
   * Valida impostos
   */
  private static validateImpostos(impostos: number): void {
    if (typeof impostos !== 'number' || isNaN(impostos)) {
      throw new CompraValidationError(
        "impostos",
        "Impostos devem ser um número válido",
        impostos
      );
    }

    if (!Number.isInteger(impostos)) {
      throw new CompraValidationError(
        "impostos",
        "Impostos devem ser um número inteiro (em centavos)",
        impostos
      );
    }

    if (impostos < 0) {
      throw new CompraValidationError(
        "impostos",
        "Impostos não podem ser negativos",
        impostos
      );
    }
  }

  /**
   * Valida status
   */
  private static validateStatus(status: string): void {
    const validStatuses = ['PENDENTE', 'CONFIRMADA', 'RECEBIDA', 'CANCELADA'];
    if (!validStatuses.includes(status)) {
      throw new CompraValidationError(
        "status",
        "Status deve ser PENDENTE, CONFIRMADA, RECEBIDA ou CANCELADA",
        status
      );
    }
  }

  /**
   * Valida forma de pagamento
   */
  private static validateFormaPagamento(formaPagamento: string): void {
    const validFormas = ['DINHEIRO', 'PIX', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'TRANSFERENCIA', 'BOLETO', 'CHEQUE', 'PRAZO'];
    if (!validFormas.includes(formaPagamento)) {
      throw new CompraValidationError(
        "formaPagamento",
        "Forma de pagamento inválida",
        formaPagamento
      );
    }
  }

  /**
   * Valida transição de status
   */
  static validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      'PENDENTE': ['CONFIRMADA', 'CANCELADA'],
      'CONFIRMADA': ['RECEBIDA', 'CANCELADA'],
      'RECEBIDA': [], // Status final, não permite alterações
      'CANCELADA': [] // Status final, não permite alterações
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new InvalidStatusTransitionError(currentStatus, newStatus);
    }
  }

  /**
   * Valida número da nota fiscal
   */
  static validateNumeroNota(numeroNota: string): void {
    if (!numeroNota || typeof numeroNota !== 'string') {
      throw new CompraValidationError(
        "numeroNota",
        "Número da nota deve ser uma string válida",
        numeroNota
      );
    }

    const trimmedNota = numeroNota.trim();
    
    if (trimmedNota.length < 1) {
      throw new CompraValidationError(
        "numeroNota",
        "Número da nota não pode estar vazio",
        numeroNota
      );
    }

    if (trimmedNota.length > 50) {
      throw new CompraValidationError(
        "numeroNota",
        "Número da nota não pode ter mais de 50 caracteres",
        numeroNota
      );
    }

    // Validar caracteres permitidos (números, letras, hífen, barra)
    const notaRegex = /^[a-zA-Z0-9\-\/]+$/;
    if (!notaRegex.test(trimmedNota)) {
      throw new CompraValidationError(
        "numeroNota",
        "Número da nota contém caracteres inválidos",
        numeroNota
      );
    }
  }

  /**
   * Valida ID no formato UUID
   */
  static validateUUID(id: string, fieldName: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(id)) {
      throw new CompraValidationError(
        fieldName,
        `${fieldName} deve ser um UUID válido`,
        id
      );
    }
  }
}