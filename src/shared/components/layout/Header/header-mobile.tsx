import { memo, useCallback } from "react";
import { Droplets, Bell, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { HeaderMobileProps } from "./types";

const HEADER_STYLES = {
  container:
    "lg:hidden bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between",
  logo: "flex items-center gap-2",
  actions: "flex items-center gap-2",
  icon: "text-[var(--foreground)]",
  primaryIcon: "text-[var(--primary)]",
  appName: "font-semibold text-[var(--foreground)]",
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
    const handleMenuClick = useCallback(() => {
      onMenuClick();
    }, [onMenuClick]);

    const handleNotificationClick = useCallback(() => {
      onNotificationClick?.();
    }, [onNotificationClick]);

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
