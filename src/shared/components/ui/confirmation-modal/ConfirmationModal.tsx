"use client";

import React, { useEffect, useCallback, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import {
  ConfirmationModalProps,
  ConfirmationModalVariant,
  ConfirmationModalThemeMap,
} from "./types";

/**
 * Mapeamento de ícones por variante
 */
const variantIcons = {
  danger: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle,
  default: Info,
};

/**
 * Mapeamento de temas por variante
 */
const themeMap: ConfirmationModalThemeMap = {
  danger: {
    iconColor: "text-red-600 dark:text-red-400",
    iconBackground: "bg-red-100 dark:bg-red-900/20",
    titleColor: "text-red-900 dark:text-red-100",
    descriptionColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-800",
  },
  warning: {
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBackground: "bg-yellow-100 dark:bg-yellow-900/20",
    titleColor: "text-yellow-900 dark:text-yellow-100",
    descriptionColor: "text-yellow-700 dark:text-yellow-300",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  info: {
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBackground: "bg-blue-100 dark:bg-blue-900/20",
    titleColor: "text-blue-900 dark:text-blue-100",
    descriptionColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  success: {
    iconColor: "text-green-600 dark:text-green-400",
    iconBackground: "bg-green-100 dark:bg-green-900/20",
    titleColor: "text-green-900 dark:text-green-100",
    descriptionColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-800",
  },
  default: {
    iconColor: "text-gray-600 dark:text-gray-400",
    iconBackground: "bg-gray-100 dark:bg-gray-900/20",
    titleColor: "text-gray-900 dark:text-gray-100",
    descriptionColor: "text-gray-700 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-800",
  },
};

/**
 * Mapeamento de tamanhos
 */
const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/**
 * Componente para renderizar informações do item
 */
const ItemInfo: React.FC<{
  itemInfo: NonNullable<ConfirmationModalProps["itemInfo"]>;
  variant: ConfirmationModalVariant;
}> = ({ itemInfo, variant }) => {
  const theme = themeMap[variant];

  if (itemInfo.customContent) {
    return <div className="mt-4">{itemInfo.customContent}</div>;
  }

  return (
    <div
      className={cn(
        "mt-4 p-4 rounded-lg border",
        theme.borderColor,
        "bg-muted/50"
      )}
    >
      <div className="space-y-2">
        {itemInfo.name && (
          <div className="flex justify-between">
            <span className="font-medium text-sm text-muted-foreground">
              {itemInfo.type ? `${itemInfo.type}:` : "Nome:"}
            </span>
            <span className="text-sm font-semibold">{itemInfo.name}</span>
          </div>
        )}
        {itemInfo.id && (
          <div className="flex justify-between">
            <span className="font-medium text-sm text-muted-foreground">
              ID:
            </span>
            <span className="text-sm font-mono">{itemInfo.id}</span>
          </div>
        )}
        {itemInfo.details &&
          Object.entries(itemInfo.details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
              </span>
              <span className="text-sm">{String(value)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

/**
 * Componente ConfirmationModal
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "default",
  size = "md",
  actionType = "custom",
  icon,
  confirmButton,
  cancelButton,
  itemInfo,
  loading = false,
  showCancelButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  children,
  footer,
  className,
  contentClassName,
  animation,
  accessibility,
  onBeforeConfirm,
  onAfterConfirm,
  onError,
  preventCloseOnLoading = true,
  "data-testid": testId,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const theme = themeMap[variant];
  const IconComponent = icon || variantIcons[variant];

  // Configurações padrão dos botões baseadas na variante
  const defaultConfirmButton = {
    text: actionType === "delete" ? "Excluir" : "Confirmar",
    variant:
      variant === "danger" ? ("destructive" as const) : ("default" as const),
    ...confirmButton,
  };

  const defaultCancelButton = {
    text: "Cancelar",
    variant: "outline" as const,
    ...cancelButton,
  };

  // Handler para confirmação
  const handleConfirm = useCallback(async () => {
    if (isConfirming || loading) return;

    try {
      setIsConfirming(true);

      // Executar validação antes da confirmação
      if (onBeforeConfirm) {
        const canProceed = await onBeforeConfirm();
        if (!canProceed) {
          setIsConfirming(false);
          return;
        }
      }

      // Executar a ação de confirmação
      await onConfirm();

      // Executar callback após confirmação
      if (onAfterConfirm) {
        onAfterConfirm();
      }

      // Fechar o modal
      onClose();
    } catch (error) {
      console.error("Erro na confirmação:", error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsConfirming(false);
    }
  }, [
    isConfirming,
    loading,
    onBeforeConfirm,
    onConfirm,
    onAfterConfirm,
    onError,
    onClose,
  ]);

  // Handler para fechamento
  const handleClose = useCallback(() => {
    if (preventCloseOnLoading && (loading || isConfirming)) {
      return;
    }
    onClose();
  }, [loading, isConfirming, preventCloseOnLoading, onClose]);

  // Efeito para controle de teclado
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);

  // Configurações de acessibilidade
  const ariaLabel = accessibility?.ariaLabel || title;
  const ariaDescription = accessibility?.ariaDescription || description;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnBackdropClick ? handleClose : undefined}
    >
      <DialogContent
        className={cn(
          sizeMap[size],
          animation?.type === "none" && "animate-none",
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription}
        data-testid={testId}
        onPointerDownOutside={
          closeOnBackdropClick ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader className="text-center sm:text-left">
          <div className="flex items-center gap-4">
            {/* Ícone */}
            <div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                theme.iconBackground
              )}
            >
              <IconComponent className={cn("w-6 h-6", theme.iconColor)} />
            </div>

            <div className="flex-1 min-w-0">
              <DialogTitle
                className={cn("text-lg font-semibold", theme.titleColor)}
              >
                {title}
              </DialogTitle>
              <DialogDescription className={cn("mt-1", theme.descriptionColor)}>
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className={cn("py-4", contentClassName)}>
          {/* Informações do item */}
          {itemInfo && <ItemInfo itemInfo={itemInfo} variant={variant} />}

          {/* Conteúdo adicional */}
          {children && <div className="mt-4">{children}</div>}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          {/* Botão de cancelar */}
          {showCancelButton && (
            <Button
              variant={defaultCancelButton.variant}
              onClick={handleClose}
              disabled={
                defaultCancelButton.disabled ||
                (preventCloseOnLoading && (loading || isConfirming))
              }
              className={defaultCancelButton.className}
              data-testid={`${testId}-cancel-button`}
            >
              {defaultCancelButton.icon && (
                <defaultCancelButton.icon className="w-4 h-4 mr-2" />
              )}
              {defaultCancelButton.text}
            </Button>
          )}

          {/* Botão de confirmação */}
          <Button
            variant={defaultConfirmButton.variant}
            onClick={handleConfirm}
            disabled={defaultConfirmButton.disabled || loading}
            className={defaultConfirmButton.className}
            data-testid={`${testId}-confirm-button`}
            autoFocus={accessibility?.autoFocusConfirm}
          >
            {defaultConfirmButton.loading || isConfirming || loading ? (
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              defaultConfirmButton.icon && (
                <defaultConfirmButton.icon className="w-4 h-4 mr-2" />
              )
            )}
            {defaultConfirmButton.text}
          </Button>

          {/* Footer customizado */}
          {footer && <div className="w-full mt-4 pt-4 border-t">{footer}</div>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
