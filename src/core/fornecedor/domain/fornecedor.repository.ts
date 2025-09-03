import { prisma } from "@/infrastructure";
import {
  TFornecedor,
  TFornecedorWithRelations,
  CreateFornecedorInput,
  UpdateFornecedorInput,
  IFornecedorRepository,
} from "./fornecedor.entity";
import {
  FornecedorNotFoundError,
  CnpjAlreadyExistsError,
  CpfAlreadyExistsError,
  EmailAlreadyExistsError,
  FornecedorHasComprasError,
} from "./fornecedor.errors";
import { ErrorHandler } from "@/core/error";
import { Status } from "@/infrastructure/generated/prisma";

export class FornecedorRepository implements IFornecedorRepository {
  /**
   * Cria um novo fornecedor
   */
  async create(data: CreateFornecedorInput): Promise<TFornecedor> {
    try {
      // Verificar se já existe fornecedor com mesmo CNPJ
      if (data.cnpj) {
        const existingCnpj = await this.findByCnpj(data.cnpj);
        if (existingCnpj) {
          throw new CnpjAlreadyExistsError(data.cnpj);
        }
      }

      // Verificar se já existe fornecedor com mesmo CPF
      if (data.cpf) {
        const existingCpf = await this.findByCpf(data.cpf);
        if (existingCpf) {
          throw new CpfAlreadyExistsError(data.cpf);
        }
      }

      // Verificar se já existe fornecedor com mesmo email
      if (data.email) {
        const existingEmail = await this.findByEmail(data.email);
        if (existingEmail) {
          throw new EmailAlreadyExistsError(data.email);
        }
      }

      return await prisma.fornecedor.create({
        data,
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de fornecedor");
    }
  }

  /**
   * Atualiza um fornecedor existente
   */
  async update(id: string, data: UpdateFornecedorInput): Promise<TFornecedor> {
    try {
      // Verificar se o fornecedor existe
      const exists = await this.existsById(id);
      if (!exists) {
        throw new FornecedorNotFoundError("id", id);
      }

      // Verificar conflitos apenas se os campos foram alterados
      if (data.cnpj) {
        const existingCnpj = await this.findByCnpj(data.cnpj);
        if (existingCnpj && existingCnpj.id !== id) {
          throw new CnpjAlreadyExistsError(data.cnpj);
        }
      }

      if (data.cpf) {
        const existingCpf = await this.findByCpf(data.cpf);
        if (existingCpf && existingCpf.id !== id) {
          throw new CpfAlreadyExistsError(data.cpf);
        }
      }

      if (data.email) {
        const existingEmail = await this.findByEmail(data.email);
        if (existingEmail && existingEmail.id !== id) {
          throw new EmailAlreadyExistsError(data.email);
        }
      }

      return await prisma.fornecedor.update({
        where: { id },
        data,
      });
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
      const exists = await this.existsById(id);
      if (!exists) {
        throw new FornecedorNotFoundError("id", id);
      }

      // Verificar se o fornecedor tem compras associadas
      const comprasCount = await prisma.compra.count({
        where: { fornecedorId: id },
      });

      if (comprasCount > 0) {
        throw new FornecedorHasComprasError(id, comprasCount);
      }

      return await prisma.fornecedor.delete({
        where: { id },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "exclusão de fornecedor"
      );
    }
  }

  /**
   * Busca um fornecedor por ID com relacionamentos
   */
  async findById(id: string): Promise<TFornecedorWithRelations | null> {
    try {
      return await prisma.fornecedor.findUnique({
        where: { id },
        include: {
          compras: {
            include: {
              itens: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por ID"
      );
    }
  }

  /**
   * Lista todos os fornecedores com relacionamentos
   */
  async findAll(): Promise<TFornecedorWithRelations[]> {
    try {
      return await prisma.fornecedor.findMany({
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
        orderBy: {
          nome: "asc",
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "listagem de fornecedores"
      );
    }
  }

  /**
   * Verifica se um fornecedor existe
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const count = await prisma.fornecedor.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "verificação de existência de fornecedor"
      );
    }
  }

  /**
   * Busca fornecedores por status
   */
  async findByStatus(status: Status): Promise<TFornecedorWithRelations[]> {
    try {
      return await prisma.fornecedor.findMany({
        where: { status: status },
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
        orderBy: {
          nome: "asc",
        },
      });
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
      return await prisma.fornecedor.findUnique({
        where: { cnpj },
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
      });
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
      return await prisma.fornecedor.findUnique({
        where: { cpf },
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
      });
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
      return await prisma.fornecedor.findFirst({
        where: { email },
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
      });
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de fornecedor por email"
      );
    }
  }

  /**
   * Busca fornecedores por nome (busca parcial)
   */
  async searchByName(name: string): Promise<TFornecedorWithRelations[]> {
    try {
      return await prisma.fornecedor.findMany({
        where: {
          nome: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          compras: {
            include: {
              itens: true,
            },
          },
        },
        orderBy: {
          nome: "asc",
        },
      });
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
      const [total, ativos, inativos, totalCompras] = await Promise.all([
        prisma.fornecedor.count(),
        prisma.fornecedor.count({ where: { status: "ATIVO" } }),
        prisma.fornecedor.count({ where: { status: "INATIVO" } }),
        prisma.compra.count(),
      ]);

      return {
        total,
        ativos,
        inativos,
        totalCompras,
      };
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "obtenção de estatísticas de fornecedores"
      );
    }
  }
}
