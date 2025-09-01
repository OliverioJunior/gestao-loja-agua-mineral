/**
 * Hook personalizado para gerenciamento de estados de loading
 * 
 * Este hook centraliza a lógica de loading utilizada em todo o sistema,
 * garantindo consistência e facilitando manutenção.
 */

import { useState, useCallback } from "react";

/**
 * Interface para o retorno do hook useLoading
 */
export interface UseLoadingReturn {
  /** Estado atual do loading */
  loading: boolean;
  /** Função para definir o estado de loading */
  setLoading: (loading: boolean) => void;
  /** Função para iniciar o loading */
  startLoading: () => void;
  /** Função para parar o loading */
  stopLoading: () => void;
  /** Função para executar uma operação assíncrona com loading automático */
  withLoading: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Hook para gerenciar estados de loading
 * 
 * @param initialState - Estado inicial do loading (padrão: false)
 * @returns Objeto com estado e funções para controlar loading
 * 
 * @example
 * const { loading, startLoading, stopLoading, withLoading } = useLoading();
 * 
 * // Uso manual
 * const handleSave = async () => {
 *   startLoading();
 *   try {
 *     await saveData();
 *   } finally {
 *     stopLoading();
 *   }
 * };
 * 
 * // Uso automático
 * const handleSave = () => withLoading(async () => {
 *   await saveData();
 * });
 */
export const useLoading = (initialState: boolean = false): UseLoadingReturn => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      const result = await operation();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

/**
 * Interface para múltiplos estados de loading
 */
export interface UseMultipleLoadingReturn {
  /** Objeto com todos os estados de loading */
  loadingStates: Record<string, boolean>;
  /** Função para definir um estado específico */
  setLoading: (key: string, loading: boolean) => void;
  /** Função para iniciar loading de uma chave específica */
  startLoading: (key: string) => void;
  /** Função para parar loading de uma chave específica */
  stopLoading: (key: string) => void;
  /** Função para verificar se algum loading está ativo */
  isAnyLoading: () => boolean;
  /** Função para verificar se um loading específico está ativo */
  isLoading: (key: string) => boolean;
  /** Função para executar operação com loading automático */
  withLoading: <T>(key: string, operation: () => Promise<T>) => Promise<T>;
}

/**
 * Hook para gerenciar múltiplos estados de loading simultaneamente
 * 
 * @param keys - Array com as chaves dos estados de loading
 * @returns Objeto com estados e funções para controlar múltiplos loadings
 * 
 * @example
 * const { loadingStates, startLoading, stopLoading, isLoading } = useMultipleLoading([
 *   'save', 'delete', 'fetch'
 * ]);
 * 
 * const handleSave = async () => {
 *   startLoading('save');
 *   try {
 *     await saveData();
 *   } finally {
 *     stopLoading('save');
 *   }
 * };
 * 
 * // No JSX
 * <Button disabled={isLoading('save')}>
 *   {isLoading('save') ? 'Salvando...' : 'Salvar'}
 * </Button>
 */
export const useMultipleLoading = (keys: string[]): UseMultipleLoadingReturn => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const startLoading = useCallback((key: string) => {
    setLoading(key, true);
  }, [setLoading]);

  const stopLoading = useCallback((key: string) => {
    setLoading(key, false);
  }, [setLoading]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(key: string, operation: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await operation();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    isAnyLoading,
    isLoading,
    withLoading,
  };
};

/**
 * Interface para configuração de loading com timeout
 */
export interface LoadingWithTimeoutOptions {
  /** Timeout em milissegundos para parar o loading automaticamente */
  timeout?: number;
  /** Callback executado quando o timeout é atingido */
  onTimeout?: () => void;
}

/**
 * Hook para loading com timeout automático
 * 
 * @param options - Opções de configuração
 * @returns Objeto com estado e funções para controlar loading com timeout
 * 
 * @example
 * const { loading, startLoading, stopLoading } = useLoadingWithTimeout({
 *   timeout: 5000, // 5 segundos
 *   onTimeout: () => console.log('Operação demorou muito!')
 * });
 */
export const useLoadingWithTimeout = (options: LoadingWithTimeoutOptions = {}) => {
  const { timeout = 30000, onTimeout } = options; // 30 segundos por padrão
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    
    if (timeout > 0) {
      const id = setTimeout(() => {
        setLoading(false);
        onTimeout?.();
      }, timeout);
      setTimeoutId(id);
    }
  }, [timeout, onTimeout]);

  const stopLoading = useCallback(() => {
    setLoading(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const withLoading = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await operation();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

/**
 * Hook para loading com debounce (evita múltiplas chamadas rápidas)
 * 
 * @param delay - Delay em milissegundos para o debounce (padrão: 300ms)
 * @returns Objeto com estado e funções para controlar loading com debounce
 * 
 * @example
 * const { loading, debouncedStartLoading, stopLoading } = useLoadingWithDebounce(500);
 * 
 * // Múltiplas chamadas rápidas só ativarão o loading uma vez
 * const handleSearch = (term: string) => {
 *   debouncedStartLoading();
 *   // ... lógica de busca
 * };
 */
export const useLoadingWithDebounce = (delay: number = 300) => {
  const [loading, setLoading] = useState(false);
  const [debounceTimeoutId, setDebounceTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedStartLoading = useCallback(() => {
    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
    }

    const id = setTimeout(() => {
      setLoading(true);
    }, delay);
    
    setDebounceTimeoutId(id);
  }, [delay, debounceTimeoutId]);

  const stopLoading = useCallback(() => {
    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
      setDebounceTimeoutId(null);
    }
    setLoading(false);
  }, [debounceTimeoutId]);

  return {
    loading,
    debouncedStartLoading,
    stopLoading,
  };
};