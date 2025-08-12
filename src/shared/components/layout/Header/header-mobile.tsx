"use client";
import { memo, useCallback } from "react";
import { Droplets, Bell, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { HeaderMobileProps } from "./types";
import { useCurrentUser, getUserInitials } from "@/shared/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const HEADER_STYLES = {
  container:
    "lg:hidden bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between",
  logo: "flex items-center gap-2",
  actions: "flex items-center gap-1",
  icon: "text-[var(--foreground)]",
  primaryIcon: "text-[var(--primary)]",
  appName: "font-semibold text-[var(--foreground)]",
  avatar: "h-7 w-7 bg-[var(--primary)]/20 rounded-full flex items-center justify-center",
  avatarText: "text-xs font-medium text-[var(--primary)]",
  loading: "h-4 w-4 animate-spin",
} as const;

const ICON_SIZES = {
  logo: "h-6 w-6",
  action: "h-5 w-5",
} as const;

const DEFAULT_APP_NAME = "AquaManager";

export const HeaderMobile = memo<HeaderMobileProps>(
  ({
    onMenuClick,
    onNotificationClick,
    appName = DEFAULT_APP_NAME,
    className,
    "data-testid": testId = "header-mobile",
  }) => {
    const { user, loading, error } = useCurrentUser();
    const router = useRouter();
    
    const handleMenuClick = useCallback(() => {
      onMenuClick();
    }, [onMenuClick]);

    const handleNotificationClick = useCallback(() => {
      onNotificationClick?.();
    }, [onNotificationClick]);

    const handleLogout = useCallback(async () => {
      try {
        const response = await fetch("/api/auth/signout", {
          method: "POST",
        });
        
        if (response.ok) {
          router.push("/login");
        } else {
          console.error("Erro ao fazer logout");
        }
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    }, [router]);

    const renderUserAvatar = () => {
      if (loading) {
        return (
          <div className={HEADER_STYLES.avatar} aria-label="Carregando...">
            <User className={HEADER_STYLES.loading} />
          </div>
        );
      }

      if (error || !user) {
        return (
          <div className={HEADER_STYLES.avatar} aria-label="Usuário não encontrado">
            <User className="h-3 w-3 text-[var(--muted-foreground)]" />
          </div>
        );
      }

      return (
        <div className={HEADER_STYLES.avatar} aria-label={`Perfil de ${user.name}`}>
          <span className={HEADER_STYLES.avatarText}>
            {getUserInitials(user.name)}
          </span>
        </div>
      );
    };

    const containerClassName = className
      ? `${HEADER_STYLES.container} ${className}`
      : HEADER_STYLES.container;

    return (
      <header className={containerClassName} data-testid={testId} role="banner">
        <div className={HEADER_STYLES.logo}>
          <Droplets
            className={`${ICON_SIZES.logo} ${HEADER_STYLES.primaryIcon}`}
            aria-hidden="true"
          />
          <span className={HEADER_STYLES.appName}>{appName}</span>
        </div>

        <div className={HEADER_STYLES.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationClick}
            disabled={!onNotificationClick}
            data-testid={`${testId}-notification-button`}
            aria-label="Abrir notificações"
          >
            <Bell
              className={`${ICON_SIZES.action} ${HEADER_STYLES.icon}`}
              aria-hidden="true"
            />
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              data-testid={`${testId}-logout-button`}
              aria-label="Fazer logout"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <LogOut
                className={`${ICON_SIZES.action}`}
                aria-hidden="true"
              />
            </Button>
          )}

          {renderUserAvatar()}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleMenuClick}
            data-testid={`${testId}-menu-button`}
            aria-label="Abrir menu de navegação"
          >
            <Menu
              className={`${ICON_SIZES.action} ${HEADER_STYLES.icon}`}
              aria-hidden="true"
            />
          </Button>
        </div>
      </header>
    );
  }
);

HeaderMobile.displayName = "HeaderMobile";

export type { HeaderMobileProps };
