import {
  CreateFornecedorInput,
  UpdateFornecedorInput,
} from "./fornecedor.entity";
import {
  FornecedorValidationError,
  InvalidCnpjError,
  InvalidCpfError,
  InvalidEmailError,
  InvalidTelefoneError,
} from "./fornecedor.errors";

export class FornecedorValidation {
  /**
   * Valida os dados de entrada para criação de fornecedor
   */
  static validateCreateInput(data: CreateFornecedorInput): void {
    // Validar campos obrigatórios
    this.validateRequiredFields(data);

    // Validar nome
    this.validateNome(data.nome);

    // Validar documentos (CNPJ ou CPF)
    this.validateDocuments(data.cnpj, data.cpf);

    // Validar email se fornecido
    if (data.email) {
      this.validateEmail(data.email);
    }

    // Validar telefone se fornecido
    if (data.telefone) {
      this.validateTelefone(data.telefone);
    }

    // Validar status
    this.validateStatus(data.status);
  }

  /**
   * Valida os dados de entrada para atualização de fornecedor
   */
  static validateUpdateInput(data: UpdateFornecedorInput): void {
    // Validar nome se fornecido
    if (data.nome !== undefined) {
      this.validateNome(data.nome);
    }

    // Validar documentos se fornecidos
    if (data.cnpj !== undefined || data.cpf !== undefined) {
      this.validateDocuments(data.cnpj, data.cpf);
    }

    // Validar email se fornecido
    if (data.email !== undefined && data.email !== null) {
      this.validateEmail(data.email);
    }

    // Validar telefone se fornecido
    if (data.telefone !== undefined && data.telefone !== null) {
      this.validateTelefone(data.telefone);
    }

    // Validar status se fornecido
    if (data.status !== undefined) {
      this.validateStatus(data.status);
    }
  }

  /**
   * Valida campos obrigatórios
   */
  private static validateRequiredFields(data: CreateFornecedorInput): void {
    if (!data.nome?.trim()) {
      throw new FornecedorValidationError("nome", "Nome é obrigatório");
    }

    if (!data.criadoPorId?.trim()) {
      throw new FornecedorValidationError(
        "criadoPorId",
        "ID do usuário criador é obrigatório"
      );
    }
  }

  /**
   * Valida nome do fornecedor
   */
  private static validateNome(nome: string): void {
    if (!nome || typeof nome !== "string") {
      throw new FornecedorValidationError(
        "nome",
        "Nome deve ser uma string válida",
        nome
      );
    }

    const trimmedNome = nome.trim();

    if (trimmedNome.length < 2) {
      throw new FornecedorValidationError(
        "nome",
        "Nome deve ter pelo menos 2 caracteres",
        nome
      );
    }

    if (trimmedNome.length > 255) {
      throw new FornecedorValidationError(
        "nome",
        "Nome não pode ter mais de 255 caracteres",
        nome
      );
    }

    // Validar caracteres permitidos (letras, números, espaços e alguns símbolos)
    const nomeRegex = /^[a-zA-ZÀ-ÿ0-9\s\-\.\&\(\)]+$/;
    if (!nomeRegex.test(trimmedNome)) {
      throw new FornecedorValidationError(
        "nome",
        "Nome contém caracteres inválidos",
        nome
      );
    }
  }

  /**
   * Valida documentos (CNPJ ou CPF)
   */
  private static validateDocuments(
    cnpj?: string | null,
    cpf?: string | null
  ): void {
    // Pelo menos um documento deve ser fornecido
    if (!cnpj && !cpf) {
      throw new FornecedorValidationError(
        "documento",
        "CNPJ ou CPF é obrigatório"
      );
    }

    // Não pode ter ambos os documentos
    if (cnpj && cpf) {
      throw new FornecedorValidationError(
        "documento",
        "Forneça apenas CNPJ ou CPF, não ambos"
      );
    }

    // Validar CNPJ se fornecido
    if (cnpj) {
      this.validateCnpj(cnpj);
    }

    // Validar CPF se fornecido
    if (cpf) {
      this.validateCpf(cpf);
    }
  }

  /**
   * Valida CNPJ
   */
  private static validateCnpj(cnpj: string): void {
    if (!cnpj || typeof cnpj !== "string") {
      throw new InvalidCnpjError(cnpj);
    }

    // Remove caracteres não numéricos
    const cleanCnpj = cnpj.replace(/\D/g, "");

    // Verifica se tem 14 dígitos
    if (cleanCnpj.length !== 14) {
      throw new InvalidCnpjError(cnpj);
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(cleanCnpj)) {
      throw new InvalidCnpjError(cnpj);
    }

    // Validação do dígito verificador
    if (!this.isValidCnpjChecksum(cleanCnpj)) {
      throw new InvalidCnpjError(cnpj);
    }
  }

  /**
   * Valida CPF
   */
  private static validateCpf(cpf: string): void {
    if (!cpf || typeof cpf !== "string") {
      throw new InvalidCpfError(cpf);
    }

    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, "");

    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
      throw new InvalidCpfError(cpf);
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      throw new InvalidCpfError(cpf);
    }

    // Validação do dígito verificador
    if (!this.isValidCpfChecksum(cleanCpf)) {
      throw new InvalidCpfError(cpf);
    }
  }

  /**
   * Valida email
   */
  private static validateEmail(email: string): void {
    if (!email || typeof email !== "string") {
      throw new InvalidEmailError(email);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidEmailError(email);
    }

    if (email.length > 255) {
      throw new FornecedorValidationError(
        "email",
        "Email não pode ter mais de 255 caracteres",
        email
      );
    }
  }

  /**
   * Valida telefone
   */
  private static validateTelefone(telefone: string): void {
    if (!telefone || typeof telefone !== "string") {
      throw new InvalidTelefoneError(telefone);
    }

    // Remove caracteres não numéricos
    const cleanTelefone = telefone.replace(/\D/g, "");

    // Verifica se tem entre 10 e 11 dígitos (telefone brasileiro)
    if (cleanTelefone.length < 10 || cleanTelefone.length > 11) {
      throw new InvalidTelefoneError(telefone);
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1+$/.test(cleanTelefone)) {
      throw new InvalidTelefoneError(telefone);
    }
  }

  /**
   * Valida status
   */
  private static validateStatus(status: string): void {
    const validStatuses = ["ATIVO", "INATIVO"];
    if (!validStatuses.includes(status)) {
      throw new FornecedorValidationError(
        "status",
        "Status deve ser ATIVO ou INATIVO",
        status
      );
    }
  }

  /**
   * Valida dígito verificador do CNPJ
   */
  private static isValidCnpjChecksum(cnpj: string): boolean {
    // Primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cnpj[12]) !== digit1) {
      return false;
    }

    // Segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return parseInt(cnpj[13]) === digit2;
  }

  /**
   * Valida dígito verificador do CPF
   */
  private static isValidCpfChecksum(cpf: string): boolean {
    // Primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (parseInt(cpf[9]) !== digit1) {
      return false;
    }

    // Segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return parseInt(cpf[10]) === digit2;
  }
}
