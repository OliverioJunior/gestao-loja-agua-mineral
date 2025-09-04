import {
  TFornecedor,
  TFornecedorWithRelations,
  CreateFornecedorInput,
  UpdateFornecedorInput,
  IFornecedorRepository,
} from "./fornecedor.entity";
import { FornecedorValidation } from "./fornecedor.validation";
import { FornecedorNotFoundError } from "./fornecedor.errors";
import { ErrorHandler } from "../../error/errors-handler";

export interface IFornecedorService {
  // Operações CRUD
  create(data: CreateFornecedorInput): Promise<TFornecedor>;
  update(id: string, data: UpdateFornecedorInput): Promise<TFornecedor>;
  delete(id: string): Promise<TFornecedor>;
  findById(id: string): Promise<TFornecedorWithRelations | null>;
  findAll(): Promise<TFornecedorWithRelations[]>;

  // Operações específicas do domínio
  findByStatus(status: string): Promise<TFornecedorWithRelations[]>;
  findByCnpj(cnpj: string): Promise<TFornecedorWithRelations | null>;
  findByCpf(cpf: string): Promise<TFornecedorWithRelations | null>;
  findByEmail(email: string): Promise<TFornecedorWithRelations | null>;
  searchByName(name: string): Promise<TFornecedorWithRelations[]>;
  getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    totalCompras: number;
  }>;

  // Operações de negócio
  activateFornecedor(id: string, userId: string): Promise<TFornecedor>;
  deactivateFornecedor(id: string, userId: string): Promise<TFornecedor>;
  getActiveSuppliers(): Promise<TFornecedorWithRelations[]>;
}

export class FornecedorService implements IFornecedorService {
  constructor(private fornecedorRepository: IFornecedorRepository) {}

  /**
   * Cria um novo fornecedor
   */
  async create(data: CreateFornecedorInput): Promise<TFornecedor> {
    try {
      // Validar entrada
      FornecedorValidation.validateCreateInput(data);

      // Executar operação
      return await this.fornecedorRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de fornecedor");
    }
  }

  /**
   * Atualiza um fornecedor existente
   */
  async update(id: string, data: UpdateFornecedorInput): Promise<TFornecedor> {
    try {
      // Validar entrada
      FornecedorValidation.validateUpdateInput(data);

      // Executar operação
      return await this.fornecedorRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de fornecedor"
      );
    }
  }

  /**
   * Remove um fornecedor
   */
  async delete(id: string): Promise<TFornecedor> {
    try {
      return await this.fornecedorRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "exclusão de fornecedor"
      );
    }
  }

  /**
   * Busca um fornecedor por ID
   */
  async findById(id: string): Promise<TFornecedorWithRelations | null> {
    try {
      return await this.fornecedorRepository.findById(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por ID"
      );
    }
  }

  /**
   * Lista todos os fornecedores
   */
  async findAll(): Promise<TFornecedorWithRelations[]> {
    try {
      return await this.fornecedorRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "listagem de fornecedores"
      );
    }
  }

  /**
   * Busca fornecedores por status
   */
  async findByStatus(status: string): Promise<TFornecedorWithRelations[]> {
    try {
      // Validar status
      const validStatuses = ["ATIVO", "INATIVO"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status inválido: ${status}`);
      }

      return await this.fornecedorRepository.findByStatus(status);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedores por status"
      );
    }
  }

  /**
   * Busca fornecedor por CNPJ
   */
  async findByCnpj(cnpj: string): Promise<TFornecedorWithRelations | null> {
    try {
      // Validar CNPJ

      return await this.fornecedorRepository.findByCnpj(cnpj);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por CNPJ"
      );
    }
  }

  /**
   * Busca fornecedor por CPF
   */
  async findByCpf(cpf: string): Promise<TFornecedorWithRelations | null> {
    try {
      // Validar CPF

      return await this.fornecedorRepository.findByCpf(cpf);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por CPF"
      );
    }
  }

  /**
   * Busca fornecedor por email
   */
  async findByEmail(email: string): Promise<TFornecedorWithRelations | null> {
    try {
      // Validar email

      return await this.fornecedorRepository.findByEmail(email);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por email"
      );
    }
  }

  /**
   * Busca fornecedores por nome
   */
  async searchByName(name: string): Promise<TFornecedorWithRelations[]> {
    try {
      if (!name || name.trim().length < 2) {
        throw new Error("Nome deve ter pelo menos 2 caracteres");
      }

      return await this.fornecedorRepository.searchByName(name.trim());
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedores por nome"
      );
    }
  }

  /**
   * Obtém estatísticas dos fornecedores
   */
  async getStatistics(): Promise<{
    total: number;
    ativos: number;
    inativos: number;
    totalCompras: number;
  }> {
    try {
      return await this.fornecedorRepository.getStatistics();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "obtenção de estatísticas de fornecedores"
      );
    }
  }

  /**
   * Ativa um fornecedor
   */
  async activateFornecedor(id: string, userId: string): Promise<TFornecedor> {
    try {
      // Verificar se o fornecedor existe
      const fornecedor = await this.fornecedorRepository.findById(id);
      if (!fornecedor) {
        throw new FornecedorNotFoundError("id", id);
      }

      // Se já está ativo, não fazer nada
      if (fornecedor.status === "ATIVO") {
        return fornecedor;
      }

      return await this.fornecedorRepository.update(id, {
        status: "ATIVO",
        atualizadoPorId: userId,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "ativação de fornecedor"
      );
    }
  }

  /**
   * Desativa um fornecedor
   */
  async deactivateFornecedor(id: string, userId: string): Promise<TFornecedor> {
    try {
      // Verificar se o fornecedor existe
      const fornecedor = await this.fornecedorRepository.findById(id);
      if (!fornecedor) {
        throw new FornecedorNotFoundError("id", id);
      }

      // Se já está inativo, não fazer nada
      if (fornecedor.status === "INATIVO") {
        return fornecedor;
      }

      return await this.fornecedorRepository.update(id, {
        status: "INATIVO",
        atualizadoPorId: userId,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "desativação de fornecedor"
      );
    }
  }

  /**
   * Obtém apenas fornecedores ativos
   */
  async getActiveSuppliers(): Promise<TFornecedorWithRelations[]> {
    try {
      return await this.fornecedorRepository.findByStatus("ATIVO");
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedores ativos"
      );
    }
  }
}
