import { ErrorHandler } from "../../error/errors-handler";
import {
  IClienteRepository,
  CreateClienteInput,
  UpdateClienteInput,
  TCliente,
  TClienteWithAdressAndCount,
} from "./cliente.entity";
import { ClienteNotFoundError, ClienteConflictError } from "./cliente.errors";
import { ClienteValidation } from "./cliente.validation";

export class ClienteService {
  constructor(private clienteRepository: IClienteRepository) {}

  async create(data: CreateClienteInput): Promise<TCliente> {
    try {
      ClienteValidation.validateCreateInput(data);

      // Verificar se email já existe
      const emailExists = await this.clienteRepository.existsByEmail(
        data.email
      );
      if (emailExists) {
        throw new ClienteConflictError("email", data.email);
      }

      // Verificar se telefone já existe
      const telefoneExists = await this.clienteRepository.existsByTelefone(
        data.telefone
      );
      if (telefoneExists) {
        throw new ClienteConflictError("telefone", data.telefone);
      }

      return await this.clienteRepository.create(data);
    } catch (error) {
      console.error(error);
      return ErrorHandler.handleRepositoryError(error, "criação de cliente");
    }
  }

  async update(id: string, data: UpdateClienteInput): Promise<TCliente> {
    try {
      ClienteValidation.validateId(id);
      ClienteValidation.validateUpdateInput(data);

      const exists = await this.clienteRepository.existsById(id);
      if (!exists) {
        throw new ClienteNotFoundError(id.toString());
      }

      // Verificar se email já existe (se estiver sendo atualizado)
      if (data.email) {
        const emailExists = await this.clienteRepository.existsByEmail(
          data.email
        );
        if (emailExists) {
          const existingClient = await this.clienteRepository.findByEmail(
            data.email
          );
          if (existingClient && existingClient.id !== id) {
            throw new ClienteConflictError("email", data.email);
          }
        }
      }

      // Verificar se telefone já existe (se estiver sendo atualizado)
      if (data.telefone) {
        const telefoneExists = await this.clienteRepository.existsByTelefone(
          data.telefone
        );
        if (telefoneExists) {
          const existingClient = await this.clienteRepository.findByTelefone(
            data.telefone
          );
          if (existingClient && existingClient.id !== id) {
            throw new ClienteConflictError("telefone", data.telefone);
          }
        }
      }

      return await this.clienteRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de cliente"
      );
    }
  }

  async delete(id: string): Promise<TCliente> {
    try {
      ClienteValidation.validateId(id);

      const exists = await this.clienteRepository.existsById(id);
      if (!exists) {
        throw new ClienteNotFoundError(id.toString());
      }

      return await this.clienteRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de cliente");
    }
  }

  async findById(id: string): Promise<TCliente | null> {
    try {
      ClienteValidation.validateId(id);

      const cliente = await this.clienteRepository.findById(id);
      if (!cliente) {
        throw new ClienteNotFoundError(id.toString());
      }

      return cliente;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de cliente");
    }
  }

  async findAll(): Promise<TClienteWithAdressAndCount[]> {
    try {
      return await this.clienteRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de clientes");
    }
  }

  async findByEmail(email: string): Promise<TCliente | null> {
    try {
      return await this.clienteRepository.findByEmail(email);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de cliente por email"
      );
    }
  }

  async findByTelefone(telefone: string): Promise<TCliente | null> {
    try {
      return await this.clienteRepository.findByTelefone(telefone);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de cliente por telefone"
      );
    }
  }

  async findByNome(nome: string): Promise<TCliente[]> {
    try {
      return await this.clienteRepository.findByNome(nome);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de clientes por nome"
      );
    }
  }
}
