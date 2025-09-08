import { LucideIcon } from "lucide-react";

/**
 * Variantes de estilo disponíveis para o GenericStatsCard
 */
export type StatsCardVariant = 
  | "default" 
  | "success" 
  | "warning" 
  | "danger" 
  | "info";

/**
 * Tamanhos disponíveis para o GenericStatsCard
 */
export type StatsCardSize = "sm" | "md" | "lg";

/**
 * Posicionamento do ícone no card
 */
export type IconPosition = "left" | "right" | "top";

/**
 * Propriedades para formatação de valores
 */
export interface ValueFormatting {
  /** Tipo de formatação do valor */
  type?: "number" | "currency" | "percentage" | "custom";
  /** Configurações de localização para formatação */
  locale?: string;
  /** Opções específicas para formatação de números */
  options?: Intl.NumberFormatOptions;
  /** Função customizada de formatação */
  customFormatter?: (value: string | number) => string;
}

/**
 * Propriedades para animações e transições
 */
export interface AnimationConfig {
  /** Se deve animar a mudança de valores */
  animateValue?: boolean;
  /** Duração da animação em ms */
  duration?: number;
  /** Se deve mostrar efeito de hover */
  enableHover?: boolean;
}

/**
 * Propriedades principais do GenericStatsCard
 */
export interface GenericStatsCardProps {
  /** Título do card */
  title: string;
  
  /** Valor principal a ser exibido */
  value: string | number;
  
  /** Ícone do Lucide React */
  icon: LucideIcon;
  
  /** Descrição adicional (opcional) */
  description?: string;
  
  /** Variante de estilo do card */
  variant?: StatsCardVariant;
  
  /** Tamanho do card */
  size?: StatsCardSize;
  
  /** Posição do ícone */
  iconPosition?: IconPosition;
  
  /** Estado de loading */
  loading?: boolean;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Configurações de formatação do valor */
  valueFormatting?: ValueFormatting;
  
  /** Configurações de animação */
  animation?: AnimationConfig;
  
  /** Função de callback ao clicar no card */
  onClick?: () => void;
  
  /** Se o card deve ser clicável */
  clickable?: boolean;
  
  /** Valor de comparação para mostrar tendência */
  previousValue?: string | number;
  
  /** Texto da tendência (ex: "+5% vs mês anterior") */
  trendText?: string;
  
  /** Direção da tendência */
  trendDirection?: "up" | "down" | "neutral";
  
  /** Se deve mostrar indicador de tendência */
  showTrend?: boolean;
  
  /** Cor customizada para o ícone */
  iconColor?: string;
  
  /** Cor customizada para o valor */
  valueColor?: string;
  
  /** Se deve mostrar borda colorida */
  showBorder?: boolean;
  
  /** Posição da borda colorida */
  borderPosition?: "left" | "top" | "right" | "bottom";
  
  /** Conteúdo adicional no footer do card */
  footer?: React.ReactNode;
  
  /** Se deve mostrar sombra */
  showShadow?: boolean;
  
  /** Propriedades de teste */
  "data-testid"?: string;
}

/**
 * Layout do componente de loading
 */
export type LoadingLayout = "horizontal" | "vertical";

/**
 * Propriedades para o componente de loading do StatsCard
 */
export interface StatsCardLoadingProps {
  /** Variante de estilo */
  variant?: StatsCardVariant;
  
  /** Tamanho do card */
  size?: StatsCardSize;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Se deve mostrar animação de skeleton */
  animated?: boolean;
  
  /** Layout do loading (horizontal ou vertical) */
  layout?: LoadingLayout;
  
  /** Se deve mostrar skeleton da descrição */
  showDescription?: boolean;
  
  /** Se deve mostrar borda colorida */
  showBorder?: boolean;
  
  /** Posição da borda colorida */
  borderPosition?: "left" | "top" | "right" | "bottom";
  
  /** Propriedades de teste */
  "data-testid"?: string;
}

/**
 * Configuração de tema para as variantes
 */
export interface StatsCardTheme {
  background: string;
  border: string;
  iconBackground: string;
  iconColor: string;
  titleColor: string;
  valueColor: string;
  descriptionColor: string;
  hoverBackground?: string;
}

/**
 * Mapeamento de temas por variante
 */
export type StatsCardThemeMap = Record<StatsCardVariant, StatsCardTheme>;

/**
 * Props para container de múltiplos StatsCards
 */
export interface StatsCardGridProps {
  /** Array de propriedades para cada card */
  cards: GenericStatsCardProps[];
  
  /** Número de colunas no grid */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Gap entre os cards */
  gap?: "sm" | "md" | "lg";
  
  /** Classes CSS adicionais para o container */
  className?: string;
  
  /** Estado de loading para todos os cards */
  loading?: boolean;
}