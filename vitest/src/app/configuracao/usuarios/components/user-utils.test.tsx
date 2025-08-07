import { describe, it, expect } from 'vitest';
import { getRoleColor, getRoleText } from '@/app/configuracoes/usuarios/components/user-utils';

describe('User Utils - Testes de Funções Utilitárias', () => {
  describe('getRoleColor', () => {
    it('deve retornar cor correta para admin', () => {
      const result = getRoleColor('admin');
      expect(result).toBe('bg-red-500/20 text-red-400 border-red-500/30');
    });

    it('deve retornar cor correta para manager', () => {
      const result = getRoleColor('manager');
      expect(result).toBe('bg-blue-500/20 text-blue-400 border-blue-500/30');
    });

    it('deve retornar cor correta para user', () => {
      const result = getRoleColor('user');
      expect(result).toBe('bg-green-500/20 text-green-400 border-green-500/30');
    });

    it('deve retornar cor padrão para role desconhecido', () => {
      const result = getRoleColor('unknown');
      expect(result).toBe('bg-gray-500/20 text-gray-400 border-gray-500/30');
    });

    it('deve retornar cor padrão para string vazia', () => {
      const result = getRoleColor('');
      expect(result).toBe('bg-gray-500/20 text-gray-400 border-gray-500/30');
    });

    it('deve funcionar com maiúsculas', () => {
      const result = getRoleColor('ADMIN');
      expect(result).toBe('bg-red-500/20 text-red-400 border-red-500/30');
    });
  });

  describe('getRoleText', () => {
    it('deve retornar texto correto para admin', () => {
      const result = getRoleText('admin');
      expect(result).toBe('Administrador');
    });

    it('deve retornar texto correto para manager', () => {
      const result = getRoleText('manager');
      expect(result).toBe('Gerente');
    });

    it('deve retornar texto correto para user', () => {
      const result = getRoleText('user');
      expect(result).toBe('Usuário');
    });

    it('deve retornar o próprio valor para role desconhecido', () => {
      const result = getRoleText('unknown');
      expect(result).toBe('unknown');
    });

    it('deve retornar string vazia para entrada vazia', () => {
      const result = getRoleText('');
      expect(result).toBe('');
    });

    it('deve funcionar com maiúsculas', () => {
      const result = getRoleText('MANAGER');
      expect(result).toBe('Gerente');
    });

    it('deve retornar valor original para caracteres especiais', () => {
      const result = getRoleText('test@123');
      expect(result).toBe('test@123');
    });
  });
});