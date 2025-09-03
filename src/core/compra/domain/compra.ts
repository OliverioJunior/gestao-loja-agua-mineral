import { CompraRepository } from "./compra.repository";
import { CompraService } from "./compra.service";

/**
 * Classe principal do domínio Compra
 * Responsável por centralizar e coordenar as operações do domínio
 */
export class Compra {
  private static _repository: CompraRepository | null;
  private static _service: CompraService | null;

  /**
   * Obtém a instância do repositório (Singleton)
   */
  static get repository(): CompraRepository {
    if (!this._repository) {
      this._repository = new CompraRepository();
    }
    return this._repository;
  }

  /**
   * Obtém a instância do service (Singleton)
   */
  static get service(): CompraService {
    if (!this._service) {
      this._service = new CompraService(this.repository);
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
