"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  StatsCardLoadingProps,
  StatsCardSize,
  StatsCardVariant,
} from "./types";

/**
 * Mapeamento de tamanhos para o componente de loading
 */
const loadingSizeMap = {
  sm: {
    card: "p-4",
    titleWidth: "w-16",
    titleHeight: "h-3",
    valueWidth: "w-12",
    valueHeight: "h-6",
    iconSize: "h-4 w-4",
    descriptionWidth: "w-3/4",
    descriptionHeight: "h-2",
  },
  md: {
    card: "p-6",
    titleWidth: "w-20",
    titleHeight: "h-4",
    valueWidth: "w-16",
    valueHeight: "h-8",
    iconSize: "h-5 w-5",
    descriptionWidth: "w-3/4",
    descriptionHeight: "h-3",
  },
  lg: {
    card: "p-8",
    titleWidth: "w-24",
    titleHeight: "h-5",
    valueWidth: "w-20",
    valueHeight: "h-10",
    iconSize: "h-6 w-6",
    descriptionWidth: "w-4/5",
    descriptionHeight: "h-4",
  },
};

/**
 * Mapeamento de cores por variante para o loading
 */
const loadingVariantMap: Record<StatsCardVariant, string> = {
  default: "bg-muted",
  success: "bg-green-100 dark:bg-green-900/20",
  warning: "bg-yellow-100 dark:bg-yellow-900/20",
  danger: "bg-red-100 dark:bg-red-900/20",
  info: "bg-blue-100 dark:bg-blue-900/20",
};

/**
 * Componente de skeleton para diferentes layouts
 */
interface SkeletonProps {
  className?: string;
  variant?: StatsCardVariant;
  animated?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "default",
  animated = true,
}) => {
  const baseClasses = "rounded";
  const variantClasses = loadingVariantMap[variant];
  const animationClasses = animated ? "animate-pulse" : "";

  return (
    <div
      className={cn(baseClasses, variantClasses, animationClasses, className)}
    />
  );
};

/**
 * Componente de loading para layout horizontal (ícone à direita/esquerda)
 */
const HorizontalLoadingLayout: React.FC<{
  size: StatsCardSize;
  variant: StatsCardVariant;
  animated: boolean;
  showDescription: boolean;
}> = ({ size, variant, animated, showDescription }) => {
  const sizeConfig = loadingSizeMap[size];

  return (
    <div className="space-y-3">
      {/* Header com título e ícone */}
      <div className="flex items-center justify-between">
        <Skeleton
          className={cn(sizeConfig.titleWidth, sizeConfig.titleHeight)}
          variant={variant}
          animated={animated}
        />
        <Skeleton
          className={sizeConfig.iconSize}
          variant={variant}
          animated={animated}
        />
      </div>

      {/* Valor principal */}
      <Skeleton
        className={cn(sizeConfig.valueWidth, sizeConfig.valueHeight, "mb-2")}
        variant={variant}
        animated={animated}
      />

      {/* Descrição opcional */}
      {showDescription && (
        <Skeleton
          className={cn(
            sizeConfig.descriptionWidth,
            sizeConfig.descriptionHeight
          )}
          variant={variant}
          animated={animated}
        />
      )}
    </div>
  );
};

/**
 * Componente de loading para layout vertical (ícone no topo)
 */
const VerticalLoadingLayout: React.FC<{
  size: StatsCardSize;
  variant: StatsCardVariant;
  animated: boolean;
  showDescription: boolean;
}> = ({ size, variant, animated, showDescription }) => {
  const sizeConfig = loadingSizeMap[size];

  return (
    <div className="space-y-4">
      {/* Ícone centralizado */}
      <div className="flex justify-center">
        <Skeleton
          className={cn(sizeConfig.iconSize, "rounded-lg")}
          variant={variant}
          animated={animated}
        />
      </div>

      {/* Conteúdo centralizado */}
      <div className="text-center space-y-2">
        <Skeleton
          className={cn(
            sizeConfig.titleWidth,
            sizeConfig.titleHeight,
            "mx-auto"
          )}
          variant={variant}
          animated={animated}
        />
        <Skeleton
          className={cn(
            sizeConfig.valueWidth,
            sizeConfig.valueHeight,
            "mx-auto"
          )}
          variant={variant}
          animated={animated}
        />
        {showDescription && (
          <Skeleton
            className={cn(
              sizeConfig.descriptionWidth,
              sizeConfig.descriptionHeight,
              "mx-auto"
            )}
            variant={variant}
            animated={animated}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Componente de loading para grid de múltiplos cards
 */
export const StatsCardGridLoading: React.FC<{
  count?: number;
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  size?: StatsCardSize;
  variant?: StatsCardVariant;
  animated?: boolean;
  className?: string;
}> = ({
  count = 4,
  columns = 4,
  size = "md",
  variant = "default",
  animated = true,
  className,
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    7: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7",
  };

  return (
    <div className={cn("grid gap-4", gridClasses[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StatsCardLoading
          key={index}
          size={size}
          variant={variant}
          animated={animated}
        />
      ))}
    </div>
  );
};

/**
 * Componente principal de loading para StatsCard
 */
export const StatsCardLoading: React.FC<StatsCardLoadingProps> = ({
  variant = "default",
  size = "md",
  className,
  animated = true,
  layout = "horizontal",
  showDescription = true,
  showBorder = false,
  borderPosition = "left",
  "data-testid": testId,
}) => {
  const sizeConfig = loadingSizeMap[size];

  const borderClasses = showBorder
    ? {
        left: "border-l-4 border-muted",
        top: "border-t-4 border-muted",
        right: "border-r-4 border-muted",
        bottom: "border-b-4 border-muted",
      }[borderPosition]
    : "";

  const cardClasses = cn(
    "bg-card border shadow-sm",
    borderClasses,
    animated && "animate-pulse",
    className
  );

  return (
    <Card className={cardClasses} data-testid={testId}>
      <CardContent className={sizeConfig.card}>
        {layout === "vertical" ? (
          <VerticalLoadingLayout
            size={size}
            variant={variant}
            animated={animated}
            showDescription={showDescription}
          />
        ) : (
          <HorizontalLoadingLayout
            size={size}
            variant={variant}
            animated={animated}
            showDescription={showDescription}
          />
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Componente de loading com pulso customizável
 */
export const StatsCardPulseLoading: React.FC<{
  size?: StatsCardSize;
  className?: string;
  pulseColor?: string;
  duration?: "slow" | "normal" | "fast";
}> = ({
  size = "md",
  className,
  pulseColor = "bg-primary/20",
  duration = "normal",
}) => {
  const sizeConfig = loadingSizeMap[size];

  const durationClasses = {
    slow: "animate-pulse [animation-duration:2s]",
    normal: "animate-pulse",
    fast: "animate-pulse [animation-duration:0.5s]",
  };

  return (
    <Card className={cn("bg-card border shadow-sm", className)}>
      <CardContent className={sizeConfig.card}>
        <div
          className={cn(
            "w-full h-full rounded-lg",
            pulseColor,
            durationClasses[duration]
          )}
        />
      </CardContent>
    </Card>
  );
};

export default StatsCardLoading;
