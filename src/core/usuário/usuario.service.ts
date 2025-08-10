import { ErrorHandler } from "../error/errors-handler";
import {
  IUsuarioRepository,
  CreateUsuarioInput,
  UpdateUsuarioInput,
  TUsuario,
} from "./usuario.entity";
import { UsuarioNotFoundError, UsuarioConflictError } from "./usuario.errors";
import { UsuarioValidator } from "./usuario.validator";

export class UsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async create(data: CreateUsuarioInput): Promise<TUsuario> {
    try {
      UsuarioValidator.validateCreateInput(data);

      const emailExists = await this.usuarioRepository.existsByEmail(
        data.email
      );
      if (emailExists) {
        throw new UsuarioConflictError("email", data.email);
      }

      return await this.usuarioRepository.create(data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "criação de usuário");
    }
  }

  async update(id: string, data: UpdateUsuarioInput): Promise<TUsuario> {
    try {
      UsuarioValidator.validateId(id);
      UsuarioValidator.validateUpdateInput(data);

      const exists = await this.usuarioRepository.existsById(id);
      if (!exists) {
        throw new UsuarioNotFoundError("Usuário não encontrado");
      }
      if (data.email) {
        const emailExists = await this.usuarioRepository.existsByEmail(
          data.email
        );
        if (emailExists) {
          const existingUser = await this.usuarioRepository.findByEmail(
            data.email
          );
          if (existingUser && existingUser.id !== id) {
            throw new UsuarioConflictError("email", data.email);
          }
        }
      }

      return await this.usuarioRepository.update(id, data);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "atualização de usuário"
      );
    }
  }

  async delete(id: string): Promise<TUsuario> {
    try {
      UsuarioValidator.validateId(id);

      const exists = await this.usuarioRepository.existsById(id);
      if (!exists) {
        throw new UsuarioNotFoundError(id);
      }

      return await this.usuarioRepository.delete(id);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "exclusão de usuário");
    }
  }

  async findById(id: string): Promise<TUsuario | null> {
    try {
      UsuarioValidator.validateId(id);

      const usuario = await this.usuarioRepository.findById(id);
      if (!usuario) {
        throw new UsuarioNotFoundError(id);
      }

      return usuario;
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de usuário");
    }
  }

  async findAll(): Promise<TUsuario[]> {
    try {
      return await this.usuarioRepository.findAll();
    } catch (error) {
      return ErrorHandler.handleRepositoryError(error, "busca de usuários");
    }
  }

  async findByEmail(email: string): Promise<TUsuario | null> {
    try {
      return await this.usuarioRepository.findByEmail(email);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de usuário por email"
      );
    }
  }

  async findByNome(nome: string): Promise<TUsuario[]> {
    try {
      return await this.usuarioRepository.findByNome(nome);
    } catch (error) {
      return ErrorHandler.handleRepositoryError(
        error,
        "busca de usuários por nome"
      );
    }
  }
}
