import { ItemCompraRepository } from "./item-compra.repository";
import { ItemCompraService } from "./item-compra.service";

/**
 * Classe principal do domínio ItemCompra
 * Responsável por centralizar e coordenar as operações do domínio
 */
export class ItemCompra {
  private static _repository: ItemCompraRepository | null = null;
  private static _service: ItemCompraService | null = null;

  /**
   * Obtém a instância do repositório (Singleton)
   */
  static get repository(): ItemCompraRepository {
    if (!this._repository) {
      this._repository = new ItemCompraRepository();
    }
    return this._repository;
  }

  /**
   * Obtém a instância do service (Singleton)
   */
  static get service(): ItemCompraService {
    if (!this._service) {
      this._service = new ItemCompraService(this.repository);
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
