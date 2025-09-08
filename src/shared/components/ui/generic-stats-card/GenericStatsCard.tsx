"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardTitle } from "@/shared/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GenericStatsCardProps, StatsCardThemeMap } from "./types";

/**
 * Mapeamento de temas por variante
 */
const themeMap: StatsCardThemeMap = {
  default: {
    background: "bg-card",
    border: "border-border",
    iconBackground: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-muted-foreground",
    valueColor: "text-foreground",
    descriptionColor: "text-muted-foreground",
    hoverBackground: "hover:bg-muted/50",
  },
  success: {
    background: "bg-card",
    border: "border-green-200 dark:border-green-800",
    iconBackground: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-muted-foreground",
    valueColor: "text-green-600 dark:text-green-400",
    descriptionColor: "text-muted-foreground",
    hoverBackground: "hover:bg-green-50 dark:hover:bg-green-900/10",
  },
  warning: {
    background: "bg-card",
    border: "border-yellow-200 dark:border-yellow-800",
    iconBackground: "bg-yellow-100 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-muted-foreground",
    valueColor: "text-yellow-600 dark:text-yellow-400",
    descriptionColor: "text-muted-foreground",
    hoverBackground: "hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
  },
  danger: {
    background: "bg-card",
    border: "border-red-200 dark:border-red-800",
    iconBackground: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-muted-foreground",
    valueColor: "text-red-600 dark:text-red-400",
    descriptionColor: "text-muted-foreground",
    hoverBackground: "hover:bg-red-50 dark:hover:bg-red-900/10",
  },
  info: {
    background: "bg-card",
    border: "border-blue-200 dark:border-blue-800",
    iconBackground: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-muted-foreground",
    valueColor: "text-blue-600 dark:text-blue-400",
    descriptionColor: "text-muted-foreground",
    hoverBackground: "hover:bg-blue-50 dark:hover:bg-blue-900/10",
  },
};

/**
 * Mapeamento de tamanhos
 */
const sizeMap = {
  sm: {
    card: "p-4",
    icon: "h-4 w-4",
    iconContainer: "p-2",
    title: "text-xs",
    value: "text-lg",
    description: "text-xs",
  },
  md: {
    card: "p-6",
    icon: "h-5 w-5",
    iconContainer: "p-2.5",
    title: "text-sm",
    value: "text-2xl",
    description: "text-xs",
  },
  lg: {
    card: "p-8",
    icon: "h-6 w-6",
    iconContainer: "p-3",
    title: "text-base",
    value: "text-3xl",
    description: "text-sm",
  },
};

/**
 * Função para formatar valores
 */
const formatValue = (
  value: string | number,
  formatting?: GenericStatsCardProps["valueFormatting"]
): string => {
  if (!formatting) return String(value);

  const {
    type = "number",
    locale = "pt-BR",
    options,
    customFormatter,
  } = formatting;

  if (customFormatter) {
    return customFormatter(value);
  }

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  switch (type) {
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "BRL",
        ...options,
      }).format(numericValue);
    case "percentage":
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 1,
        ...options,
      }).format(numericValue / 100);
    case "number":
      return new Intl.NumberFormat(locale, options).format(numericValue);
    default:
      return String(value);
  }
};

/**
 * Componente para renderizar indicador de tendência
 */
const TrendIndicator: React.FC<{
  direction?: "up" | "down" | "neutral";
  text?: string;
  className?: string;
}> = ({ direction, text, className }) => {
  if (!direction || !text) return null;

  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
      ? TrendingDown
      : Minus;
  const colorClass =
    direction === "up"
      ? "text-green-600 dark:text-green-400"
      : direction === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-xs mt-1",
        colorClass,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
};

/**
 * Componente GenericStatsCard
 */
export const GenericStatsCard: React.FC<GenericStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  size = "md",
  iconPosition = "right",
  loading = false,
  className,
  valueFormatting,
  animation,
  onClick,
  clickable = false,
  trendText,
  trendDirection,
  showTrend = false,
  iconColor,
  valueColor,
  showBorder = false,
  borderPosition = "left",
  footer,
  showShadow = true,
  "data-testid": testId,
}) => {
  const theme = themeMap[variant];
  const sizeConfig = sizeMap[size];
  const isClickable = clickable || !!onClick;

  const formattedValue = formatValue(value, valueFormatting);

  const borderClasses = showBorder
    ? {
        left: "border-l-4",
        top: "border-t-4",
        right: "border-r-4",
        bottom: "border-b-4",
      }[borderPosition]
    : "";

  const cardClasses = cn(
    theme.background,
    theme.border,
    borderClasses,
    showShadow && "shadow-sm",
    isClickable && [
      "cursor-pointer",
      "transition-all duration-200",
      theme.hoverBackground,
      "hover:shadow-md",
    ],
    animation?.enableHover !== false && "transition-colors",
    className
  );

  const iconContainerClasses = cn(
    "rounded-lg flex items-center justify-center",
    theme.iconBackground,
    sizeConfig.iconContainer
  );

  const iconClasses = cn(iconColor || theme.iconColor, sizeConfig.icon);

  const titleClasses = cn("font-medium", theme.titleColor, sizeConfig.title);

  const valueClasses = cn(
    "font-bold",
    valueColor || theme.valueColor,
    sizeConfig.value,
    animation?.animateValue && "transition-all duration-300"
  );

  const descriptionClasses = cn(theme.descriptionColor, sizeConfig.description);

  if (loading) {
    return (
      <Card className={cn(cardClasses, "animate-pulse")} data-testid={testId}>
        <CardContent className={sizeConfig.card}>
          <div className="flex items-center justify-between space-y-0 pb-2">
            <div
              className={cn(
                "h-4 bg-muted rounded",
                sizeConfig.title === "text-xs" ? "w-16" : "w-20"
              )}
            />
            <div className={cn("bg-muted rounded", sizeConfig.icon)} />
          </div>
          <div
            className={cn(
              "h-8 bg-muted rounded mb-2",
              sizeConfig.value === "text-lg" ? "w-12" : "w-16"
            )}
          />
          {description && <div className="h-3 bg-muted rounded w-3/4" />}
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    if (iconPosition === "top") {
      return (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={iconContainerClasses}>
              <Icon className={iconClasses} />
            </div>
          </div>
          <div className="text-center space-y-2">
            <CardTitle className={titleClasses}>{title}</CardTitle>
            <div className={valueClasses}>{formattedValue}</div>
            {description && <p className={descriptionClasses}>{description}</p>}
            {showTrend && (
              <TrendIndicator direction={trendDirection} text={trendText} />
            )}
          </div>
        </div>
      );
    }

    const iconElement = (
      <div className={iconContainerClasses}>
        <Icon className={iconClasses} />
      </div>
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between space-y-0">
          {iconPosition === "left" && iconElement}
          <CardTitle
            className={cn(
              titleClasses,
              iconPosition === "left" && "flex-1 ml-3"
            )}
          >
            {title}
          </CardTitle>
          {iconPosition === "right" && iconElement}
        </div>
        <div className="space-y-2">
          <div className={valueClasses}>{formattedValue}</div>
          {description && <p className={descriptionClasses}>{description}</p>}
          {showTrend && (
            <TrendIndicator direction={trendDirection} text={trendText} />
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cardClasses} onClick={onClick} data-testid={testId}>
      <CardContent className={sizeConfig.card}>
        {renderContent()}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border">{footer}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default GenericStatsCard;
