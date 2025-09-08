/**
 * GenericStatsCard - Componente genérico para cards de estatísticas
 * 
 * Este módulo exporta um componente reutilizável para exibir estatísticas
 * com diferentes variantes visuais, tamanhos e funcionalidades.
 */

export { GenericStatsCard, default } from "./GenericStatsCard";
export { 
  StatsCardLoading, 
  StatsCardGridLoading, 
  StatsCardPulseLoading 
} from "./StatsCardLoading";
export type {
  GenericStatsCardProps,
  StatsCardVariant,
  StatsCardSize,
  IconPosition,
  ValueFormatting,
  AnimationConfig,
  StatsCardLoadingProps,
  LoadingLayout,
  StatsCardTheme,
  StatsCardThemeMap,
  StatsCardGridProps,
} from "./types";