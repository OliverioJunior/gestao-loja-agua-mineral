/**
 * Componentes de loading centralizados
 *
 * Este módulo contém todos os componentes de loading utilizados no sistema,
 * garantindo consistência visual e facilitando manutenção.
 */

import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Interface para props do LoadingSpinner
 */
export interface LoadingSpinnerProps {
  /** Tamanho do spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Classe CSS adicional */
  className?: string;
  /** Cor do spinner */
  variant?: "primary" | "secondary" | "muted" | "white";
  /** Se deve mostrar o texto de carregamento */
  showText?: boolean;
  /** Texto personalizado de carregamento */
  text?: string;
}

/**
 * Mapeamento de tamanhos para classes CSS
 */
const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
} as const;

/**
 * Mapeamento de variantes para classes CSS
 */
const variantClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
  white: "text-white",
} as const;

/**
 * Componente de spinner de loading básico
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <LoadingSpinner size="md" variant="primary" />
 * <LoadingSpinner size="lg" showText text="Carregando dados..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  variant = "primary",
  showText = false,
  text = "Carregando...",
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      />
      {showText && (
        <span className={cn("text-sm", variantClasses[variant])}>{text}</span>
      )}
    </div>
  );
};

/**
 * Interface para props do LoadingPage
 */
export interface LoadingPageProps {
  /** Mensagem de carregamento */
  message?: string;
  /** Tamanho do spinner */
  size?: "md" | "lg" | "xl";
  /** Altura mínima da área de loading */
  minHeight?: string;
}

/**
 * Componente de loading para páginas inteiras
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <LoadingPage message="Carregando clientes..." />
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Carregando...",
  size = "lg",
  minHeight = "calc(100dvh-93px)",
}) => {
  return (
    <main className={cn("p-6")} style={{ minHeight }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size={size} className="mx-auto mb-4" />
            <p className="text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

/**
 * Interface para props do LoadingCard
 */
export interface LoadingCardProps {
  /** Número de cards de loading a serem exibidos */
  count?: number;
  /** Altura dos cards */
  height?: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente de loading para cards/estatísticas
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <LoadingCard count={4} height="120px" />
 */
export const LoadingCard: React.FC<LoadingCardProps> = ({
  count = 4,
  height = "auto",
  className,
}) => {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-card border rounded-lg p-6 animate-pulse"
          style={{ height }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 w-4 bg-muted rounded"></div>
          </div>
          <div className="h-8 bg-muted rounded mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * Interface para props do LoadingTable
 */
export interface LoadingTableProps {
  /** Número de linhas de loading */
  rows?: number;
  /** Número de colunas */
  columns?: number;
  /** Headers da tabela */
  headers?: string[];
}

/**
 * Componente de loading para tabelas
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <LoadingTable rows={5} headers={["Nome", "Email", "Status", "Ações"]} />
 */
export const LoadingTable: React.FC<LoadingTableProps> = ({
  rows = 5,
  columns = 4,
  headers = [],
}) => {
  const columnCount = headers.length || columns;

  return (
    <div className="rounded-md border">
      <div className="overflow-hidden">
        <table className="w-full">
          {headers.length > 0 && (
            <thead className="bg-muted/50">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(columnCount)].map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Interface para props do LoadingButton
 */
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Se o botão está em estado de loading */
  loading?: boolean;
  /** Texto quando não está carregando */
  children: React.ReactNode;
  /** Texto quando está carregando */
  loadingText?: string;
}

/**
 * Componente de botão com estado de loading
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <LoadingButton loading={isLoading} loadingText="Salvando...">
 *   Salvar
 * </LoadingButton>
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  loadingText,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      disabled={loading || disabled}
      className={cn("inline-flex items-center justify-center gap-2", className)}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

/**
 * Interface para props do LoadingOverlay
 */
export interface LoadingOverlayProps {
  /** Se o overlay está visível */
  visible?: boolean;
  /** Mensagem de carregamento */
  message?: string;
  /** Cor de fundo do overlay */
  backgroundColor?: string;
}

/**
 * Componente de overlay de loading para cobrir conteúdo
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <div className="relative">
 *   <SomeContent />
 *   <LoadingOverlay visible={isLoading} message="Processando..." />
 * </div>
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible = false,
  message = "Carregando...",
  backgroundColor = "rgba(255, 255, 255, 0.8)",
}) => {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor }}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

/**
 * Componente de loading inline para textos
 *
 * @param props - Props do componente
 * @returns JSX Element
 *
 * @example
 * <p>Dados: <LoadingInline /></p>
 */
export const LoadingInline: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <LoadingSpinner size="sm" />
    </span>
  );
};

/**
 * Componente de loading para listas vazias
 *
 * @param message - Mensagem personalizada
 * @returns JSX Element
 *
 * @example
 * <LoadingEmpty message="Carregando produtos..." />
 */
export const LoadingEmpty: React.FC<{ message?: string }> = ({
  message = "Carregando dados...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
};
