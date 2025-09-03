import { FornecedorRepository } from "./fornecedor.repository";
import { FornecedorService } from "./fornecedor.service";

/**
 * Classe principal do domínio Fornecedor
 * Responsável por centralizar e coordenar as operações do domínio
 */
export class Fornecedor {
  private static _repository: FornecedorRepository | null;
  private static _service: FornecedorService | null;

  /**
   * Obtém a instância do repositório (Singleton)
   */
  static get repository(): FornecedorRepository {
    if (!this._repository) {
      this._repository = new FornecedorRepository();
    }
    return this._repository;
  }

  /**
   * Obtém a instância do service (Singleton)
   */
  static get service(): FornecedorService {
    if (!this._service) {
      this._service = new FornecedorService(this.repository);
    }
    return this._service;
  }

  /**
   * Reinicia as instâncias (útil para testes)
   */
  static reset(): void {
    this._repository = null;
    this._service = null;
  }
}
