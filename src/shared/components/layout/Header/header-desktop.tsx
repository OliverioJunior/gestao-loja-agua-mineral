"use client";
import { Bell } from "lucide-react";
import { Button } from "@/shared/components/ui";
import { HeaderDescription } from "./header-description";
import { memo, useCallback } from "react";
import { HeaderDesktopProps } from "./types";

const HEADER_STYLES = {
  container:
    "hidden lg:flex bg-[var(--card)] border-b border-[var(--border)] px-6 py-4 items-center justify-between",
  wrapper: "flex items-center gap-4",
  avatar:
    "h-8 w-8 bg-[var(--primary)]/20 rounded-full flex items-center justify-center",
  "avatar-text": "text-sm font-medium text-[var(--primary)]",
  notification: "h-5 w-5 text-[var(--foreground)]",
} as const;

export const HeaderDesktop = memo<HeaderDesktopProps>(
  ({ onNotificationClick }) => {
    const handleNotificationClick = useCallback(() => {
      onNotificationClick?.();
    }, [onNotificationClick]);

    return (
      <div className={HEADER_STYLES.container}>
        <HeaderDescription />

        <div className={HEADER_STYLES.wrapper}>
          <Button
            onClick={handleNotificationClick}
            disabled={!onNotificationClick}
            aria-label="Abrir notificações"
            variant="ghost"
            size="sm"
          >
            <Bell className={HEADER_STYLES.notification} />
          </Button>
          <div className={HEADER_STYLES.avatar} aria-label="Perfil">
            <span className={HEADER_STYLES["avatar-text"]}>JS</span>
          </div>
        </div>
      </div>
    );
  }
);

HeaderDesktop.displayName = "HeaderDesktop";
